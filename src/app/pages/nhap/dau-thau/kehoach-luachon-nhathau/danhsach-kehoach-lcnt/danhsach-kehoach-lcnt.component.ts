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
    ngayKy: '',
    trichYeu: '',
    soQd: '',
    namKhoach: '',
    tenVthh: '',
    tenCloaiVthh: '',
    soGoiThau: '',
    tenTrangThai: '',
  };

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

  async ngOnInit() {
    console.log(this.spinner);
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
      console.log(this.loaiVthh);
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
      tuNgayKy: this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 0
        ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
        : null,
      denNgayKy: this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 0
        ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
        : null,
      tuNgayTao: this.searchFilter.ngayLap && this.searchFilter.ngayLap.length > 0
        ? dayjs(this.searchFilter.ngayLap[0]).format('YYYY-MM-DD')
        : null,
      denNgayTao: this.searchFilter.ngayLap && this.searchFilter.ngayLap.length > 0
        ? dayjs(this.searchFilter.ngayLap[1]).format('YYYY-MM-DD')
        : null,
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
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_THEM")) {
        return;
      }
    }
    this.isDetail = true;
    this.selectedId = null;
  }

  showList() {
    this.isDetail = false;
    this.search()
  }

  detail(data?) {
    this.selectedId = data.id;
    this.isDetail = true;
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_THEM")) {
        return;
      }
    }
  }

  clearFilter() {
    this.searchFilter.namKh = null;
    this.searchFilter.soDx = null;
    this.searchFilter.ngayTongHop = null;
    this.searchFilter.ngayLap = null;
    this.searchFilter.trichYeu = null;
    // this.searchFilter.loaiVthh = null;
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
          tuNgayKy: this.searchFilter.ngayTongHop
            ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
            : null,
          denNgayKy: this.searchFilter.ngayTongHop
            ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
            : null,
          soTr: this.searchFilter.soDx,
          loaiVthh: this.searchFilter.loaiVthh,
          namKh: this.searchFilter.namKh,
          trichYeu: this.searchFilter.trichYeu,
        };
        this.danhSachDauThauService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-ke-hoach-lcnt.xlsx'),
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
    if (value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
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
}
