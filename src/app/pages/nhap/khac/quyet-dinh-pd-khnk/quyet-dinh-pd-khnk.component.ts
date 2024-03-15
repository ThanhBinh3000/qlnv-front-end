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
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai, convertVthhToId } from 'src/app/shared/commonFunction';
import { STATUS } from 'src/app/constants/status';
import { HttpClient } from "@angular/common/http";
import { Base2Component } from "../../../../components/base2/base2.component";
import { StorageService } from "../../../../services/storage.service";
import {
  QuyetDinhPheDuyetKeHoachNhapKhacService
} from "../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhPheDuyetKeHoachNhapKhac.service";

@Component({
  selector: 'app-quyet-dinh-pd-khnk',
  templateUrl: './quyet-dinh-pd-khnk.component.html',
  styleUrls: ['./quyet-dinh-pd-khnk.component.scss']
})
export class QuyetDinhPdKhnkComponent extends Base2Component implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  @Input() loaiVthh: string;
  yearNow = dayjs().get('year');
  inputNam: string = '';
  idThHdr: number = 0;
  openTHopKhlcnt = false;

  idDx: number = 0;
  soDx: string;
  openDxKhlcnt = false;
  isView: boolean;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
  ];
  searchFilter = {
    soQd: null,
    loaiVthh: null,
    ngayKyQd: null,
    namKhoach: null,
    trangThai: null,
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
    private quyetDinhPheDuyetKeHoachNhapKhacService: QuyetDinhPheDuyetKeHoachNhapKhacService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachNhapKhacService);
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
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
    if (!this.userService.isAccessPermisson("NHDTQG_NK_QDNH_THEM")) {
      return;
    }
    this.isDetail = true;
    this.selectedId = null;
    this.isView = false;
  }

  async detail(data?) {
    this.isDetail = true;
    this.selectedId = data.id;
  }

  async goDetail(id: number, roles?: any) {
    if (roles != 'NHDTQG_NK_QDNH_XEM') {
      if (!this.checkPermission(roles)) {
        return
      }
      this.selectedId = id;
      this.isDetail = true;
      this.isView = false
    } else {
      // await this.detail(id, roles);
      this.selectedId = id;
      this.isDetail = true;
      this.isView = true
    }
  }

  delete(data?) {
    if (!this.userService.isAccessPermisson("NHDTQG_NK_QDNH_XOA")) {
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
          this.quyetDinhPheDuyetKeHoachNhapKhacService.delete(body).then(async (res) => {
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
    this.searchFilter.ngayKyQd = null;
    this.searchFilter.soGthau = null;
    this.searchFilter.tongTien = null;
    this.tuNgayKy = null;
    this.denNgayKy = null;
    this.search();

  }

  async search() {
    this.dataTable = [];
    let body = {
      tuNgayQd: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayQd: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
      loaiVthh: this.loaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      soQd: this.searchFilter.soQd,
      tongTien: this.searchFilter.tongTien,
      soGthau: this.searchFilter.soGthau,
      // lastest: 0,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
    };
    let res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.search(body);
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
    if (!this.userService.isAccessPermisson("NHDTQG_NK_QDNH_EXP")) {
      return;
    }
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayQd: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayQd: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
          loaiVthh: this.loaiVthh,
          namKhoach: this.searchFilter.namKhoach,
          trichYeu: this.searchFilter.trichYeu,
          soQd: this.searchFilter.soQd,
          tongTien: this.searchFilter.tongTien,
          soGthau: this.searchFilter.soGthau,
          lastest: 0,
          maDvi: this.userService.isTongCuc() ? '' : this.userInfo.MA_DVI
        };
        this.quyetDinhPheDuyetKeHoachNhapKhacService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-phe-duyet-ke-hoach-nhap-khac.xlsx')
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
    if (!this.userService.isAccessPermisson("NHDTQG_NK_QDNH_XOA")) {
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
            let res = await this.quyetDinhPheDuyetKeHoachNhapKhacService.deleteMuti({ idList: dataDelete });
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

  openTHopKhlcntModal(id: number) {
    this.idThHdr = id;
    this.openTHopKhlcnt = true;
  }

  closeTHopKhlcntModal() {
    this.idThHdr = null;
    this.openTHopKhlcnt = false;
  }

  openDxKhlcntModal(id?: number, soDx?: string) {
    if (id) {
      this.idDx = id;
    } else {
      this.soDx = soDx;
    }
    this.openDxKhlcnt = true;
  }

  closeDxKhlcntModal() {
    this.idDx = null;
    this.soDx = null;
    this.openDxKhlcnt = false;
  }

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
}
