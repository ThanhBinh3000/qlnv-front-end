import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MESSAGE } from "../../../../../constants/message";
import { saveAs } from 'file-saver';
import { DanhMucService } from "../../../../../services/danhmuc.service";
import * as dayjs from "dayjs";
import { convertTrangThai } from "../../../../../shared/commonFunction";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhPdKhBdgService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service";
import { UserService } from "../../../../../services/user.service";
import { NzDatePickerComponent } from "ng-zorro-antd/date-picker";
import { PAGE_SIZE_DEFAULT } from "../../../../../constants/config";
import { Subject } from "rxjs";
import {
  VatTu
} from "../../../../../components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type";

import { STATUS } from 'src/app/constants/status';
import { cloneDeep } from 'lodash';
import { UserLogin } from "../../../../../models/userlogin";
import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";

@Component({
  selector: 'app-qd-dieuchinh-khbdg',
  templateUrl: './qd-dieuchinh-khbdg.component.html',
  styleUrls: ['./qd-dieuchinh-khbdg.component.scss']
})
export class QdDieuchinhKhbdgComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() inputLoaiVthh: string;
  @Input() idInput: number;
  @Output() showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @Input() loaiVthh: string;
  yearNow = dayjs().get('year');

  searchFilter = {
    namKh: dayjs().get('year'),
    soQdPd: null,
    trichYeu: null,
    loaiVthh: null,
    ngayKyQd: null,
    soTrHdr: null,
    soQdDc: null

  };

  filterTable: any = {
    namKh: '',
    soQdPd: '',
    ngayKyQd: '',
    trichYeu: '',
    soTrHdr: '',
    idThHdr: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    soDviTsan: '',
    slHdDaKy: '',
    tenTrangThai: '',
  };

  STATUS = STATUS;
  dataTableAll: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  listVthh: any;
  listNam: any[] = [];
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  tabSelected: string = 'quyet-dinh';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  selectHang: any = { ten: "" };
  lastBreadcrumb: string;
  userInfo: UserLogin;

  constructor(private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    // private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    public userService: UserService,) {
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (!this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT") || !this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_XEM")) {
        window.location.href = '/error/401'
      }
      this.userInfo = this.userService.getUserLogin();
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  insert() {
    if (!this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_THEM")) {
      return;
    }
    this.isDetail = true;
    this.selectedId = null;
  }

  detail(data?) {
    if (!this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_THEM")) {
      return;
    }
    this.isDetail = true;
    this.selectedId = data.id;
  }

  delete(data?) {
    if (!this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_XOA")) {
      return;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: MESSAGE.DELETE_CONFIRM,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            "id": data.id,
            "maDvi": null
          }
          this.quyetDinhDchinhKhBdgService.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              await this.search();
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.soQdPd = null;
    this.searchFilter.trichYeu = null;
    this.searchFilter.ngayKyQd = null;
    this.searchFilter.soTrHdr = null;
    this.search();
  }

  async search() {
    this.dataTable = [];
    let body = {
      ngayKyQdTu: this.searchFilter.ngayKyQd
        ? dayjs(this.searchFilter.ngayKyQd[0]).format('YYYY-MM-DD')
        : null,
      ngayKyQdDen: this.searchFilter.ngayKyQd
        ? dayjs(this.searchFilter.ngayKyQd[1]).format('YYYY-MM-DD')
        : null,
      loaiVthh: this.loaiVthh,
      namKh: this.searchFilter.namKh,
      trichYeu: this.searchFilter.trichYeu,
      soQdPd: this.searchFilter.soQdPd,
      soTrHdr: this.searchFilter.soTrHdr,
      lastest: 0,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
    };
    let res = await this.quyetDinhDchinhKhBdgService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
      }
      this.dataTableAll = cloneDeep(this.dataTable)
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
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
      console.log('error: ', e)
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
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  showList() {
    this.isDetail = false;
    this.search();
  }

  convertTrangThaiTable(status: string) {
    return convertTrangThai(status);
  }

  exportData() {
    if (!this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_EXP")) {
      return;
    }
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayKyQdTu: this.searchFilter.ngayKyQd
            ? dayjs(this.searchFilter.ngayKyQd[0]).format('YYYY-MM-DD')
            : null,
          ngayKyQdDen: this.searchFilter.ngayKyQd
            ? dayjs(this.searchFilter.ngayKyQd[1]).format('YYYY-MM-DD')
            : null,
          loaiVthh: this.searchFilter.loaiVthh,
          namKh: this.searchFilter.namKh,
          trichYeu: this.searchFilter.trichYeu,
          soQdPd: this.searchFilter.soQdPd,
          soTrHdr: this.searchFilter.soTrHdr,
          lastest: 0,
        };
        this.quyetDinhDchinhKhBdgService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-phe-duyet-ke-hoach-ban-dau-gia.xlsx')
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
    if (!this.userService.isAccessPermisson("XHDTQG_PTDG_KHBDG_QDLCNT_XOA")) {
      return;
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
            let res = await this.quyetDinhDchinhKhBdgService.deleteMuti({ idList: dataDelete });
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
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item)
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
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      tenTrangThai: '',
    }
  }

  allChecked = false;
  indeterminate = false;

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

}
