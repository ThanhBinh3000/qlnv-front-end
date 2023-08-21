import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LEVEL, LEVEL_USER, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {STATUS} from "../../../../../../constants/status";

@Component({
  selector: 'app-dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class DieuChinhChiTieuKeHoachNamComponent implements OnInit {
  @Input()
  isDetail: boolean = false;
  @Input()
  selectedId: number = 0;
  @Input()
  isView: boolean = false;
  @Input()
  deXuatId: number = 0;

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  namKeHoach: number = null;
  soQDGiao: string = null;
  trichYeuGiao: string = null;
  soQDDieuChinh: string = null;
  trichYeuDieuChinh: string = null;
  startValue: Date | null = null;
  endValue: Date | null = null;
  startValueDc: Date | null = null;
  endValueDc: Date | null = null;
  loaiHangHoa: string = null;

  ngayKy: any;
  ngayKyDc: any;
  STATUS  = STATUS;
  listNam: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  lastBreadcrumb: string;
  userInfo: UserLogin;

  titleCard: string = '';
  tabSelected: number = 0 ;

  filterTable: any = {
    soQuyetDinh: '',
    tenDonVi: '',
    ngayKy: '',
    trichYeu: '',
    soQdGoc: '',
    namKeHoach: '',
    soVbDeXuat: '',
    trangThaiDuyet: '',
  };

  allChecked = false;
  indeterminate = false;

  countTuChoi: number = 0;
  countCuc: number = 0;
  indexTab: number = 0;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private donViService: DonviService,
    public userService: UserService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.getCount();
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          if (res.data.chiTieuKeHoachNamTongCuc) {
            this.countTuChoi = res.data.chiTieuKeHoachNamTongCuc;
          }
          if (res.data.chiTieuKeHoachNamCuc) {
            this.countCuc = res.data.chiTieuKeHoachNamCuc;
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userService.isTongCuc()) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
        this.titleCard =
          'Danh sách điều chỉnh chỉ tiêu kế hoạch năm tổng cục giao';
      } else if (this.userService.isChiCuc()) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
        this.tabSelected = 1;
      } else if (this.userService.isCuc()) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
        this.titleCard = 'Danh sách điều chỉnh chỉ tiêu kế hoạch năm cục giao';
      }
      let dayNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayNow - i,
          text: dayNow - i,
        });
      }
      await Promise.all([this.loadDonVi(), this.search()]);
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
          if (item.trangThai == '00' && this.tabSelected == 0 && this.userService.isTongCuc()) {
            item.checked = true;
          }
          else if (item.trangThai == '00' && this.tabSelected == 1 && this.userService.isCuc()) {
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
    if (this.lastBreadcrumb == LEVEL.TONG_CUC_SHOW) {
      if (this.userInfo.CAP_DVI === LEVEL_USER.CUC) {
        const res = await this.donViService.layTatCaDonVi();
        this.optionsDonVi = [];
        if (res.msg == MESSAGE.SUCCESS) {
          for (let i = 0; i < res.data.length; i++) {
            if (this.userInfo.MA_DVI === res.data[i].maDvi) {
              this.inputDonVi = res.data[i].tenDvi;
              this.selectedDonVi = res.data[i];
              break;
            }
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        const res = await this.donViService.layDonViCon();
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
    } else if (this.lastBreadcrumb == LEVEL.CUC_SHOW) {
      const res = await this.donViService.layDonViCon();
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
    await this.search()
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
    this.inputDonVi = '';
    this.selectedDonVi = {};
    this.ngayKy = null;
    this.loaiHangHoa = null;
  }

  async search() {
    let capDvi = null;
    if (this.tabSelected == 0 && !this.userService.isTongCuc()) {
      capDvi = 1;
    } else if (this.tabSelected == 1 && !this.userService.isCuc()) {
      capDvi = 2;
    }
    let param = {
      pageSize: this.pageSize,
      pageNumber: this.page,
      capDvi: capDvi,
      maDvi: this.selectedDonVi.maDvi,
      namKeHoach: this.namKeHoach,
      soQD: this.soQDDieuChinh,
      trichYeu: this.trichYeuDieuChinh,
      ngayKyDenNgay: this.ngayKy && this.ngayKy.length > 1
        ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgay: this.ngayKy && this.ngayKy.length > 0
        ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
        : null,
      soCT: this.soQDGiao,
      trichYeuCT: this.trichYeuGiao,
      ngayKyDenNgayCT: this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgayCT: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
      loaiHangHoa: this.loaiHangHoa,
      trangThai: null,
    };
    let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.timKiem(
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
          this.quyetDinhDieuChinhChiTieuKeHoachNamService
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
        let capDvi = null;
        let maDvi = null;
        if (this.tabSelected == 0 && !this.userService.isTongCuc()) {
          capDvi = 1;
          maDvi = this.userInfo.MA_DVI;
        } else if (this.tabSelected == 1 && !this.userService.isCuc()) {
          capDvi = 2;
          maDvi = this.userInfo.MA_DVI;
        }
        let body = {
          pageSize: null,
          pageNumber: null,
          capDvi: capDvi,
          maDvi: maDvi,
          soQD: this.soQDGiao,
          namKeHoach: this.namKeHoach,
          trichYeu: this.trichYeuGiao,
          ngayKyDenNgay: this.endValue
            ? dayjs(this.endValue).format('YYYY-MM-DD')
            : null,
          ngayKyTuNgay: this.startValue
            ? dayjs(this.startValue).format('YYYY-MM-DD')
            : null,
          trangThai: this.tabSelected == 0 ? this.globals.prop.TU_CHOI : null,
        };
        this.quyetDinhDieuChinhChiTieuKeHoachNamService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-dieu-chinh-chi-tieu-ke-hoach-nam.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
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
            let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.deleteMultiple({ ids: dataDelete });
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
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  selectTab(cap) {
    this.tabSelected = cap;
    this.indexTab = cap;
    this.clearFilter();
    this.search();
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQuyetDinh: '',
      tenDonVi: '',
      ngayKy: '',
      trichYeu: '',
      soQdGoc: '',
      namKeHoach: '',
      soVbDeXuat: '',
      trangThaiDuyet: '',
    }
  }
}
