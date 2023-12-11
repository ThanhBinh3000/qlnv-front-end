import { Component, Input, OnInit } from "@angular/core";
import {
  QuyetDinhPheDuyetHsmtService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetHsmt.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../../services/user.service";
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { STATUS } from 'src/app/constants/status';
import { PAGE_SIZE_DEFAULT } from "../../../../../constants/config";
import { UserLogin } from "../../../../../models/userlogin";
import dayjs from "dayjs";
import { MESSAGE } from "../../../../../constants/message";
import {DanhMucService} from "../../../../../services/danhmuc.service";

@Component({
  selector: 'app-qd-pd-hs-moi-thau',
  templateUrl: './qd-pd-hs-moi-thau.component.html',
  styleUrls: ['./qd-pd-hs-moi-thau.component.scss']
})
export class QdPdHsMoiThauComponent implements OnInit {
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  isDetailVt: boolean = false;
  isView: boolean = false;
  listNam: any[] = [];
  listLoaiVthh: any[] = [];
  listCloaiVthh: any[] = [];
  STATUS = STATUS;
  searchFilter = {
    soQdPdHsmt: '',
    namKhoach: '',
    soQdPdKhlcnt: '',
    loaiVthh: '',
    cloaiVthh: '',
    trichYeu: ''
  };
  filterTable: any = {
    namKhoach: '',
    soQdPdHsmt: '',
    ngayPduyet: '',
    trichYeu: '',
    soQdPdKhlcnt: '',
    tenLoaiVthh: '',
    trangThai: '',
    lanDieuChinh: '',
  };
  listTrangThai: any[] = [
    { ma: this.STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' }
  ];

  dataTable: any[] = [];
  dataTableAll: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  selectedId: number = 0;
  allChecked = false;
  indeterminate = false;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
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
  constructor(
    private quyetDinhPheDuyetHsmtService: QuyetDinhPheDuyetHsmtService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private danhMucService: DanhMucService,
  ) { }

  async ngOnInit() {
    try {
      await this.spinner.show()
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.listLoaiVthh = [];
      let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
      if (res.msg == MESSAGE.SUCCESS) {
        this.listLoaiVthh = res.data?.filter((x) => (x.ma.length == 4 && x.ma.startsWith('02')));
        this.listCloaiVthh = res.data?.filter((x) => (x.ma.length == 6 && x.ma.startsWith(this.loaiVthh)));
      }
      this.searchFilter.loaiVthh = this.loaiVthh;
      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  filterInTable(key: string, value: string) {
    if (value !=null && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayPduyet'].includes(key)) {
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

  async search() {
    this.spinner.show();
    let body = {
      tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
      soQd: this.searchFilter.soQdPdHsmt,
      soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
      loaiVthh: this.searchFilter.loaiVthh,
      cloaiVthh: this.searchFilter.cloaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.quyetDinhPheDuyetHsmtService.search(body);
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

  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.soQdPdHsmt = null;
    this.searchFilter.soQdPdKhlcnt = null;
    this.searchFilter.trichYeu = null;
    this.searchFilter.cloaiVthh = null;
    this.tuNgayKy = null;
    this.denNgayKy  = null;
    this.search();
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '78') {
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
  xoaItem(item: any) {
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_TCKHLCNT_VT_HSMT_XOA")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_TCKHLCNT_LT_HSMT_XOA")) {
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
          this.quyetDinhPheDuyetHsmtService.delete(body).then((res) => {
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
  deleteSelect() {
    if (this.loaiVthh === "02") {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_TCKHLCNT_VT_HSMT_XOA")) {
        return;
      }
    }
    else {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_TCKHLCNT_LT_HSMT_XOA")) {
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
            let res = await this.quyetDinhPheDuyetHsmtService.deleteMuti({ idList: dataDelete });
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

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
          soQd: this.searchFilter.soQdPdHsmt,
          soQdPdKhlcnt: this.searchFilter.soQdPdKhlcnt,
          loaiVthh: this.searchFilter.loaiVthh,
          cloaiVthh: this.searchFilter.cloaiVthh,
          namKhoach: this.searchFilter.namKhoach,
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
        this.quyetDinhPheDuyetHsmtService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-pd-hsmt.xlsx'),
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

  themMoi() {
    if (this.loaiVthh === "02") {
      // if (!this.userService.isAccessPermisson("NHDTQG_PTDT_TCKHLCNT_VT_HSMT_SUA")) {
      //   return;
      // }
      this.isDetailVt = true;
    }
    else {
      // if (!this.userService.isAccessPermisson("NHDTQG_PTDT_TCKHLCNT_LT_HSMT_SUA")) {
      //   return;
      // }
      this.isDetail = true;
    }
    this.selectedId = null;
    this.isView = false;
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

  checkQuyenXem(data) {
    if (data.trangThai == STATUS.DANG_NHAP_DU_LIEU) {
      if (this.loaiVthh == '02') {
        if (this.userService.isAccessPermisson('NHDTQG_PTDT_TCKHLCNT_VT_HSMT_SUA')) {
          return false
        } else {
          return this.userService.isAccessPermisson('NHDTQG_PTDT_TCKHLCNT_VT_HSMT_XEM')
        }
      } else {
        if (this.userService.isAccessPermisson('NHDTQG_PTDT_TCKHLCNT_LT_HSMT_SUA')) {
          return false
        } else {
          return this.userService.isAccessPermisson('NHDTQG_PTDT_TCKHLCNT_LT_HSMT_XEM')
        }
      }
    } else {
      if (this.loaiVthh == '02') {
        return this.userService.isAccessPermisson('NHDTQG_PTDT_TCKHLCNT_VT_HSMT_XEM')
      } else {
        return this.userService.isAccessPermisson('NHDTQG_PTDT_TCKHLCNT_LT_HSMT_XEM')
      }
    }
  }

  async showList() {
    this.isDetail = false;
    this.isDetailVt = false;
    await this.search();
  }
}
