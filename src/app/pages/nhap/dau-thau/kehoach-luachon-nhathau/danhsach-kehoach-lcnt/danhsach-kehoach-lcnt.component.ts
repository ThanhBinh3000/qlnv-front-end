import { Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { UserService } from 'src/app/services/user.service';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-danhsach-kehoach-lcnt',
  templateUrl: './danhsach-kehoach-lcnt.component.html',
  styleUrls: ['./danhsach-kehoach-lcnt.component.scss']
})

export class DanhsachKehoachLcntComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhSachDauThauService: DanhSachDauThauService,
    private modal: NzModalService,
    public userService: UserService,
  ) {

  }
  @Input()
  loaiVthh: string;
  isDetail: boolean = false;
  isDetailVt: boolean = false;
  isView: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;

  searchFilter = {
    soDx: '',
    namKh: '',
    ngayTongHop: '',
    ngayLap: '',
    loaiVthh: '',
    trichYeu: ''
  };

  STATUS = STATUS

  filterTable: any = {
    soDxuat: '',
    ngayPduyet: '',
    ngayTao: '',
    trichYeu: '',
    soQd: '',
    namKhoach: '',
    tenVthh: '',
    tenCloaiVthh: '',
    soGoiThau: '',
    tenTrangThai: '',
    tenDvi: '',
    tgianDongMothau: '',
  };

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' }
  ];

  listTrangThaiVt: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
  ];

  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  selectedId: number = 0;
  allChecked = false;
  indeterminate = false;
  openQdPdKhlcnt = false;
  qdPdKhlcntId: number = 0;
  openTh = false;
  thId: number = 0;
  openQdGiao = false;
  qdGiaoId: number = 0;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
  tuNgayTao: Date | null = null;
  denNgayTao: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTao) {
      return false;
    }
    return startValue.getTime() > this.denNgayTao.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTao) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTao.getTime();
  };

  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };

  async ngOnInit() {
    try {
      if (this.loaiVthh === "02") {
        if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT") || !this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_XEM")) {
          window.location.href = '/error/401'
        }
      }
      else {
        if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT") || !this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_XEM")) {
          window.location.href = '/error/401'
        }
      }
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.searchFilter.loaiVthh = this.loaiVthh;
      await this.search();
    }
    catch (e) {
      console.log('error: ', e)
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

  async search() {
    this.spinner.show();
    let body = {
      tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
      tuNgayTao: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTao: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') + " 23:59:59": null,
      soTr: this.searchFilter.soDx,
      loaiVthh: this.searchFilter.loaiVthh,
      namKh: this.searchFilter.namKh,
      trichYeu: this.searchFilter.trichYeu,
      maDvi: null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    if (this.userService.isCuc()) {
      body.maDvi = this.userInfo.MA_DVI
    }
    let res = await this.danhSachDauThauService.search(body);
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
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return;
      }
      this.isDetailVt = true;
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_THEM")) {
        return;
      }
      this.isDetail = true;
    }
    this.selectedId = null;
    this.isView = false;
  }

  showList() {
    this.isDetail = false;
    this.isDetailVt = false;
    this.search()
  }

  detail(data?, isView?) {
    if (this.loaiVthh === "02") {
      this.isDetailVt = true;
    }
    else {
      this.isDetail = true;
    }
    this.selectedId = data.id;
    if (isView != null) {
      this.isView = isView;
    }
  }

  clearFilter() {
    this.searchFilter.namKh = null;
    this.searchFilter.soDx = null;
    this.searchFilter.trichYeu = null;
    this.tuNgayKy = null;
    this.denNgayKy  = null;
    this.tuNgayTao = null;
    this.denNgayTao = null;
    this.search();
  }

  xoaItem(item: any) {
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_XOA")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_XOA")) {
        return;
      }
    }
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
          let body = {
            "id": item.id,
          }
          this.danhSachDauThauService.delete(body).then((res) => {
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
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  // convertTrangThai(status: string) {
  //   switch (status) {
  //     case '00': {
  //       return 'Dự thảo'
  //     }
  //     case '03': {
  //       return 'Từ chối - TP'
  //     }
  //     case '12': {
  //       return 'Từ chối - LĐ Cục'
  //     }
  //     case '01': {
  //       return 'Chờ duyệt - TP'
  //     }
  //     case '09': {
  //       return 'Chờ duyệt - LĐ Cục'
  //     }
  //     case '02': {
  //       return 'Đã duyệt'
  //     }
  //     case '05': {
  //       return 'Tổng hợp'
  //     }
  //   }
  // }

  exportData() {
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_EXP")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_EXP")) {
        return;
      }
    }
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') : null,
          denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') : null,
          tuNgayTao: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') : null,
          denNgayTao: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') : null,
          soTr: this.searchFilter.soDx,
          loaiVthh: this.loaiVthh,
          namKh: this.searchFilter.namKh,
          trichYeu: this.searchFilter.trichYeu,
          maDvi: null,
        };
        this.danhSachDauThauService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-de-xuat-ke-hoach-lcnt.xlsx'),
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
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_XOA")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_XOA")) {
        return;
      }
    }
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
            let res = await this.danhSachDauThauService.deleteMuti({ idList: dataDelete });
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

  filterInTable(key: string, value: string) {
    if (value !=null && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['tgianNhang', 'ngayTao', 'ngayPduyet'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
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
      soDxuat: '',
      ngayKy: '',
      trichYeu: '',
      soQd: '',
      namKhoach: '',
      tenVthh: '',
      tenCloaiVthh: '',
      soGoiThau: '',
      tenTrangThai: '',
    }
  }
  openQdPdKhlcntModal(id:number) {
    this.qdPdKhlcntId = id;
    this.openQdPdKhlcnt = true;
  }
  closeQdPdKhlcntModal() {
    this.qdPdKhlcntId = null;
    this.openQdPdKhlcnt = false;
  }

  openModalTh (id: number) {
    this.thId = id;
    this.openTh = true;
  }
  closeModalTh () {
    this.thId = null;
    this.openTh = false;
  }
  openQdGiaoModal(id:number) {
    this.qdGiaoId = id;
    this.openQdGiao = true;
  }
  closeQdGiaoModal () {
    this.qdGiaoId = null;
    this.openQdGiao = false;
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

}
