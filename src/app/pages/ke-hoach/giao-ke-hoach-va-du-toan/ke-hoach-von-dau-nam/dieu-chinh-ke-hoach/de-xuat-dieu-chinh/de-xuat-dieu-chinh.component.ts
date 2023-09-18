import { cloneDeep } from 'lodash';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { chain, isEmpty } from 'lodash';
import { saveAs } from 'file-saver';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LEVEL, LOAI_HH_XUAT_KHAC, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DeXuatDieuChinhService } from 'src/app/services/deXuatDieuChinh.service';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from '../../../../../../constants/status';
import { Base2Component } from '../../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../../services/storage.service';
import { DanhMucService } from '../../../../../../services/danhmuc.service';
import {
  DanhSachVtTbTrongThoiGIanBaoHanh,
} from '../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/DanhSachVtTbTrongThoiGianBaoHanh.service';

@Component({
  selector: 'app-de-xuat-dieu-chinh',
  templateUrl: './de-xuat-dieu-chinh.component.html',
  styleUrls: ['./de-xuat-dieu-chinh.component.scss'],
})
export class DeXuatDieuChinhComponent extends Base2Component implements OnInit {
  @Output()
  showDieuChinhEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  namKeHoach: number = null;
  soQDGiao: string = null;
  trichYeuGiao: string = null;
  soQDDieuChinh: string = null;
  trichYeuDieuChinh: string = null;
  startValue: Date | null = null;
  endValue: Date | null = null;
  startValueDc: Date | null = null;
  STATUS = STATUS;
  endValueDc: Date | null = null;
  ngayKy: any;
  ngayKyDC: any;

  listNam: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  optionsDonVi: any[] = [];
  dsDonvi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  lastBreadcrumb: string;

  isDetail: boolean = false;
  isCreateQdDc: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isViewDetailQdDc: boolean = false;

  filterTable: any = {
    soVanBan: '',
    tenDonVi: '',
    ngayKy: '',
    trichYeu: '',
    soQdKeHoachNam: '',
    namKeHoach: '',
    tenHangHoa: '',
    tenTrangThai: '',
    soQdDc: '',
  };

  allChecked = false;
  indeterminate = false;


  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donViService: DonviService,
              private deXuatDieuChinhService: DeXuatDieuChinhService) {
    super(httpClient, storageService, notification, spinner, modal, deXuatDieuChinhService);
    this.formData = this.fb.group({
      namKeHoach: [],
      maDvi: [],
      idTongHop: [],
      maTongHop: [],
      maDiaDiem: [],
    });
  }


  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.userService.isTongCuc()) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.userService.isChiCuc()) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.userService.isCuc()) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
      let dayNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayNow - i,
          text: dayNow - i,
        });
      }
      await Promise.all([
        this.search(),
        this.loadDsDonVi(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async loadDonVi() {
    const res = await this.donViService.layTatCaDonVi();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsDonVi() {
    const dsTong = await this.donViService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  disabledStartDateDc = (startValue: Date): boolean => {
    if (!startValue || !this.endValueDc) {
      return false;
    }
    return startValue.getTime() > this.endValueDc.getTime();
  };

  disabledEndDateDc = (endValue: Date): boolean => {
    if (!endValue || !this.startValueDc) {
      return false;
    }
    return endValue.getTime() <= this.startValueDc.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  redirectToChiTiet(isView, id) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  clearFilter() {
    this.namKeHoach = null;
    this.soQDGiao = null;
    this.trichYeuGiao = null;
    this.soQDDieuChinh = null;
    this.trichYeuDieuChinh = null;
    this.startValue = null;
    this.endValue = null;
    this.startValueDc = null;
    this.endValueDc = null;
    this.ngayKy = null;
    this.ngayKyDC = null;
    this.inputDonVi = '';
    this.selectedDonVi = {};
    this.search();
  }

  async search() {
    let param = {
      pageSize: this.pageSize,
      pageNumber: this.page,
      namKeHoach: this.namKeHoach,
      soVanBan: this.soQDDieuChinh,
      trichYeuDx: this.trichYeuDieuChinh,
      ngayKyDenNgayDx: this.ngayKyDC && this.ngayKyDC.length > 1
        ? dayjs(this.ngayKyDC[1]).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgayDx: this.ngayKyDC && this.ngayKyDC.length > 0
        ? dayjs(this.ngayKyDC[0]).format('YYYY-MM-DD')
        : null,
      soQuyetDinh: this.soQDGiao,
      trichYeuQd: this.trichYeuGiao,
      ngayKyDenNgayQd: this.ngayKy && this.ngayKy.length > 1
        ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgayQd: this.ngayKy && this.ngayKy.length > 0
        ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
        : null,
      maDvi: this.selectedDonVi ? this.selectedDonVi.maDvi : null,
    };
    let res = await this.deXuatDieuChinhService.timKiem(
      param,
    );
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
      this.clearFilterTable();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.deXuatDieuChinhService
            .deleteData(item.id)
            .then(async () => {
              await this.search();
              this.spinner.hide();
            });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          pageSize: null,
          pageNumber: null,
          namKeHoach: this.namKeHoach,
          soVanBan: this.soQDDieuChinh,
          trichYeuDx: this.trichYeuDieuChinh,
          ngayKyDenNgayDx: this.ngayKyDC && this.ngayKyDC.length > 1
            ? dayjs(this.ngayKyDC[1]).format('YYYY-MM-DD')
            : null,
          ngayKyTuNgayDx: this.ngayKyDC && this.ngayKyDC.length > 0
            ? dayjs(this.ngayKyDC[0]).format('YYYY-MM-DD')
            : null,
          soQuyetDinh: this.soQDGiao,
          trichYeuQd: this.trichYeuGiao,
          ngayKyDenNgayQd: this.ngayKy && this.ngayKy.length > 1
            ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
            : null,
          ngayKyTuNgayQd: this.ngayKy && this.ngayKy.length > 0
            ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
            : null,
        };
        this.deXuatDieuChinhService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-de-xuat-dieu-chinh.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  redirectToQdDieuChinh(isView, id) {
    // this.showDieuChinhEvent.emit({
    //   isView: isView,
    //   deXuatId: id,
    // });
    this.isCreateQdDc = isView;
    this.isViewDetailQdDc = isView;
  }

  deleteSelect() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.deXuatDieuChinhService.deleteMultiple({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, 'Không có dữ liệu phù hợp để xóa.');
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soVanBan: '',
      tenDonVi: '',
      ngayKy: '',
      trichYeu: '',
      soQdKeHoachNam: '',
      namKeHoach: '',
      tenHangHoa: '',
      tenTrangThai: '',
    };
  }
}
