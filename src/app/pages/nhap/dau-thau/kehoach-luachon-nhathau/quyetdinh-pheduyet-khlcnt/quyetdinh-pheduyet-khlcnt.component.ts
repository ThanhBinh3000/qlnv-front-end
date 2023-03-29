import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { VatTu } from 'src/app/components/dialog/dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { LEVEL, LIST_VAT_TU_HANG_HOA, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import { ItemDetail } from 'src/app/models/itemDetail';
import { STATUS } from 'src/app/constants/status';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";

@Component({
  selector: 'app-quyetdinh-pheduyet-khlcnt',
  templateUrl: './quyetdinh-pheduyet-khlcnt.component.html',
  styleUrls: ['./quyetdinh-pheduyet-khlcnt.component.scss']
})
export class QuyetdinhPheduyetKhlcntComponent extends Base2Component implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @Input() loaiVthh: string;
  yearNow = dayjs().get('year');
  inputNam: string = '';
  idThHdr: number = 0;
  openTHopKhlcnt = false;

  idDx: number = 0;
  openDxKhlcnt = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' }
  ];
  searchFilter = {
    soQd: null,
    loaiVthh: null,
    ngayQd: null,
    namKhoach: null,
    trichYeu: null,
    tuNgayQd: null,
    denNgayQd: null,
    soGthau: null,
    tongTien: null,
  };
  filterTable: any = {
    soQd: '',
    ngayQd: '',
    trichYeu: '',
    idThHdr: '',
    namKhoach: '',
    tenVthh: '',
    soGthau: '',
    tongTien: '',
    soGthauTrung: '',
    tenLoaiVthh: '',
    tenTrangThai: '',
    soTrHdr: '',
    tgianNhang: '',
    tgianThien: ''
  };
  STATUS = STATUS
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


  constructor(
    private router: Router,
    httpClient: HttpClient,
    spinner: NgxSpinnerService,
    storageService: StorageService,
    notification: NzNotificationService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachLCNTService);
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT") || !this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_XEM")) {
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
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async selectNam(nam) {
    this.filterInTable('namKhoach', nam.value);
  }

  insert() {
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_THEM")) {
      return;
    }
    this.isDetail = true;
    this.selectedId = null;
  }

  async detail(data?) {
    this.isDetail = true;
    this.selectedId = data.id;
  }

  delete(data?) {
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_XOA")) {
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
          this.quyetDinhPheDuyetKeHoachLCNTService.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              await this.search();
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            }
            else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.soQd = null;
    this.searchFilter.trichYeu = null;
    this.searchFilter.ngayQd = null;
    this.searchFilter.soGthau = null;
    this.searchFilter.tongTien = null;
    this.search();

  }

  async search() {
    this.dataTable = [];
    let body = {
      tuNgayQd: this.searchFilter.ngayQd && this.searchFilter.ngayQd.length > 0
        ? dayjs(this.searchFilter.ngayQd[0]).format('YYYY-MM-DD')
        : null,
      denNgayQd: this.searchFilter.ngayQd && this.searchFilter.ngayQd.length > 0
        ? dayjs(this.searchFilter.ngayQd[1]).format('YYYY-MM-DD')
        : null,
      loaiVthh: this.loaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      soQd: this.searchFilter.soQd,
      tongTien: this.searchFilter.tongTien,
      soGthau: this.searchFilter.soGthau,
      lastest: 0,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      console.log(data)
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
    }
    catch (e) {
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
    }
    catch (e) {
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
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_EXP")) {
      return;
    }
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayQd: this.searchFilter.ngayQd && this.searchFilter.ngayQd.length > 0
            ? dayjs(this.searchFilter.ngayQd[0]).format('YYYY-MM-DD')
            : null,
          denNgayQd: this.searchFilter.ngayQd && this.searchFilter.ngayQd.length > 0
            ? dayjs(this.searchFilter.ngayQd[1]).format('YYYY-MM-DD')
            : null,
          loaiVthh: this.loaiVthh,
          namKhoach: this.searchFilter.namKhoach,
          trichYeu: this.searchFilter.trichYeu,
          soQd: this.searchFilter.soQd,
          tongTien: this.searchFilter.tongTien,
          soGthau: this.searchFilter.soGthau,
          lastest: 0,
          maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
        };
        this.quyetDinhPheDuyetKeHoachLCNTService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.xlsx')
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
    if (!this.userService.isAccessPermisson("NHDTQG_PTDT_KHLCNT_QDLCNT_XOA")) {
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
            let res = await this.quyetDinhPheDuyetKeHoachLCNTService.deleteMuti({ idList: dataDelete });
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

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    console.log(key, value);

    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      idThHdr: '',
      namKhoach: '',
      tenVthh: '',
      tongTien: '',
      soGthau: '',
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

  openTHopKhlcntModal(id:number) {
    this.idThHdr = id;
    this.openTHopKhlcnt = true;
  }

  closeTHopKhlcntModal() {
    this.idThHdr = null;
    this.openTHopKhlcnt = false;
  }

  openDxKhlcntModal(id:number) {
    this.idDx = id;
    this.openDxKhlcnt = true;
  }

  closeDxKhlcntModal() {
    this.idDx = null;
    this.openDxKhlcnt = false;
  }
}
