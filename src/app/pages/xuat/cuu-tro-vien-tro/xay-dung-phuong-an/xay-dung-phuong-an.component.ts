import {saveAs} from 'file-saver';
import {Component, Input, OnInit} from '@angular/core';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import {DANH_MUC_LEVEL} from 'src/app/pages/luu-kho/luu-kho.constant';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {UserService} from 'src/app/services/user.service';
import {DonviService} from 'src/app/services/donvi.service';
import {isEmpty} from 'lodash';
import {Globals} from 'src/app/shared/globals';
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {STATUS} from "src/app/constants/status";

@Component({
  selector: 'app-xay-dung-phuong-an',
  templateUrl: './xay-dung-phuong-an.component.html',
  styleUrls: ['./xay-dung-phuong-an.component.scss']
})
export class XayDungPhuongAnComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
  ) {
  }

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;


  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  searchFilter = {
    soDxuat: null,
    tenDvi: null,
    maDvi: null,
    nam: dayjs().get('year'),
    ngayDxuat: null,
    thoiGianThucHien: null,
    loaiVthh: null,
    trichYeu: null,
  };
  filterTable: any = {
    soKeHoach: '',
    tenDonVi: '',
    ngayLapKeHoach: '',
    ngayKy: '',
    trichYeu: '',
    tenHangHoa: '',
    soQuyetDinhGiaoChiTieu: '',
    soQuyetDinhPheDuyet: '',
    namKeHoach: '',
    tenVthh: '',
    tenCloaiVthh: '',
    tenTrangThai: '',
    nam: '',
  };
  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};

  selectedId: number = 0;

  isVatTu: boolean = false;

  allChecked = false;
  indeterminate = false;

  isView = false;
  STATUS = STATUS;

  async ngOnInit() {
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.searchFilter.loaiVthh = this.loaiVthh;
      this.initData()
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong[DANH_MUC_LEVEL.CUC];
    }

  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
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
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async search() {
    this.spinner.show();
    try {
      let body = {
        tuNgayDxuat: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.ngayDxuat[0]).format('YYYY-MM-DD') : null,
        denNgayDxuat: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.ngayDxuat[1]).format('YYYY-MM-DD') : null,
        tuThoiGianThucHien: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.thoiGianThucHien[0]).format('YYYY-MM-DD') : null,
        denThoiGianThucHien: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.thoiGianThucHien[1]).format('YYYY-MM-DD') : null,
        soDxuat: this.searchFilter.soDxuat,
        maDvi: this.searchFilter.maDvi,
        loaiVatTuHangHoa: this.searchFilter.loaiVthh,
        nam: this.searchFilter.nam,
        trichYeu: this.searchFilter.trichYeu,
        pageNumber: this.page,
        pageSize: this.pageSize,
      };
      let res = await this.deXuatPhuongAnCuuTroService.search(body);

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
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
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
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  themMoi() {
    this.isDetail = true;
    this.isView = false;
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = 0;
    this.loaiVthh = this.loaiVthhCache;
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    this.isView = isView;
    // if (data.loaiVthh.startsWith('02')) {
    //   this.isVatTu = true;
    // } else {
    //   this.isVatTu = false;
    // }
  }

  clearFilter() {
    this.searchFilter.nam = dayjs().get('year');
    this.searchFilter.soDxuat = null;
    this.searchFilter.thoiGianThucHien = null;
    this.searchFilter.trichYeu = null;
    this.search();
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
          this.deXuatPhuongAnCuuTroService.delete({id: item.id}).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  convertTrangThai(status: string) {
    switch (status) {
      case '00': {
        return 'Dự thảo';
      }
      case '03': {
        return 'Từ chối - TP';
      }
      case '12': {
        return 'Từ chối - LĐ Cục';
      }
      case '01': {
        return 'Chờ duyệt - TP';
      }
      case '09': {
        return 'Chờ duyệt - LĐ Cục';
      }
      case '02': {
        return 'Đã duyệt';
      }
      case '05': {
        return 'Tổng hợp';
      }
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayDxuat: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.ngayDxuat[0]).format('YYYY-MM-DD') : null,
          denNgayDxuat: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.ngayDxuat[1]).format('YYYY-MM-DD') : null,
          tuThoiGianThucHien: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.thoiGianThucHien[0]).format('YYYY-MM-DD') : null,
          denThoiGianThucHien: this.searchFilter.ngayDxuat ? dayjs(this.searchFilter.thoiGianThucHien[1]).format('YYYY-MM-DD') : null,
          soKeHoach: this.searchFilter.soDxuat ?? null,
          namKeHoach: this.searchFilter.nam,
          trichYeu: this.searchFilter.trichYeu ?? null,
          maDvis: [this.userInfo.MA_DVI],
          pageable: null,
        };
        this.deXuatPhuongAnCuuTroService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-de-xuat-ke-hoach-ban-dau-gia.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
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
            const body = {
              ids: dataDelete
            }
            let res = await this.deXuatPhuongAnCuuTroService.deleteMuti(body);
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
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .indexOf(value.toString().toLowerCase()) != -1
          ) {
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
      soKeHoach: '',
      ngayLapKeHoach: '',
      ngayKy: '',
      trichYeu: '',
      tenHangHoa: '',
      soQuyetDinhGiaoChiTieu: '',
      soQuyetDinhPheDuyet: '',
      namKeHoach: '',
      tenVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
    };
  }

  async showListEvent() {
    await this.search();
  }
}
