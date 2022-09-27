import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import {DanhSachMuaTrucTiepService} from "../../../../../../services/danh-sach-mua-truc-tiep.service";

@Component({
  selector: 'app-danhsach-kehoach-muatructiep',
  templateUrl: './danhsach-kehoach-muatructiep.component.html',
  styleUrls: ['./danhsach-kehoach-muatructiep.component.scss']
})
export class DanhsachKehoachMuatructiepComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
    private modal: NzModalService,
    public userService: UserService,
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
    soDx: '',
    namKh: dayjs().get('year'),
    ngayTao: '',
    ngayPduyet:'',
    maDvi:'',
    loaiVthh: '',
    trichYeu: '',
  };

  STATUS = STATUS
  filterTable: any = {
    soDxuat: '',
    namKh: '',
    ngayTao: '',
    ngayPduyet: '',
    trichYeu: '',
    soQd: '',
    tenloaiVthh: '',
    tenCloaiVthh: '',
    tongSoLuong: '',
    tenTrangThai:'',
    trangThaiTh:'',
  };

  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  selectedId: number = 0;
  isVatTu: boolean = false;
  allChecked = false;
  indeterminate = false;

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
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
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
      ngayTaoTu: this.searchFilter.ngayTao
        ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD')
        : null,
      ngayTaoDen: this.searchFilter.ngayTao
        ? dayjs(this.searchFilter.ngayTao[1]).format('YYYY-MM-DD')
        : null,
        ngayDuyetTu: this.searchFilter.ngayPduyet
        ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD')
        : null,
        ngayDuyetDen: this.searchFilter.ngayTao
        ? dayjs(this.searchFilter.ngayTao[1]).format('YYYY-MM-DD')
        : null,
       soDxuat: this.searchFilter.soDx,
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
    let res = await this.danhSachMuaTrucTiepService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log(this.dataTable)
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
    console.log(this.dataTable)
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
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = null;
    this.loaiVthh = this.loaiVthhCache;
  }



  showList() {
    this.isDetail = false;
    this.search()
  }

  detail(data?) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    if (data.loaiVthh.startsWith('02')) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_VT_DEXUAT_SUA")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_LT_DEXUAT_SUA")) {
        return;
      }
    }
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.soDx = null;
    this.searchFilter.ngayTao = null;
    this.searchFilter.ngayPduyet
    this.searchFilter.trichYeu = null;
    this.searchFilter.loaiVthh = null;
    this.searchFilter.maDvi = null;
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
          this.danhSachMuaTrucTiepService.delete(body).then((res) => {
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
          ngayTaoTu: this.searchFilter.ngayTao
          ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD')
          : null,
        ngayTaoDen: this.searchFilter.ngayTao
          ? dayjs(this.searchFilter.ngayTao[1]).format('YYYY-MM-DD')
          : null,
          ngayDuyetTu: this.searchFilter.ngayPduyet
          ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD')
          : null,
          ngayDuyetDen: this.searchFilter.ngayTao
          ? dayjs(this.searchFilter.ngayTao[1]).format('YYYY-MM-DD')
          : null,
         soDxuat: this.searchFilter.soDx,
         loaiVthh: this.searchFilter.loaiVthh,
         namKh: this.searchFilter.namKh,
         trichYeu: this.searchFilter.trichYeu,
         maDvi: null,
        };
        this.danhSachMuaTrucTiepService
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
            let res = await this.danhSachMuaTrucTiepService.deleteMuti({ idList: dataDelete });
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
          console.log(item[key])
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
      namKh: '',
      ngayTao: '',
      ngayPduyet: '',
      trichYeu: '',
      soQd: '',
      tenloaiVthh: '',
      tenCloaiVthh: '',
      tongSoLuong: '',
      tenTrangThai:'',
      trangThaiTh:'',
    }
  }
}
