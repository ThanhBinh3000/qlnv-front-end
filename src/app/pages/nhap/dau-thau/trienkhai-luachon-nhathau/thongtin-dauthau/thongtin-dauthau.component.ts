import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATEPICKER_CONFIG, LIST_VAT_TU_HANG_HOA, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThaiGt, convertVthhToId } from 'src/app/shared/commonFunction';
import { saveAs } from 'file-saver';
import { STATUS } from 'src/app/constants/status';
import {
  ThongTinDauThauService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../services/storage.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-thongtin-dauthau',
  templateUrl: './thongtin-dauthau.component.html',
  styleUrls: ['./thongtin-dauthau.component.scss']
})
export class ThongtinDauthauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  constructor(
    private router: Router,
    spinner: NgxSpinnerService,
    notification: NzNotificationService,
    httpClient: HttpClient,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    storageService: StorageService,
    modal: NzModalService,
    userService: UserService,
    private thongTinDauThauService: ThongTinDauThauService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauThauService);
  }
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  STATUS = STATUS

  listTrangThai: any[] = [
    { ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật' },
    { ma: this.STATUS.HOAN_THANH_CAP_NHAT, giaTri: 'Hoàn thành cập nhật' }
  ];
  searchFilter = {
    namKhoach: '',
    soQd: '',
    ngayQd: '',
    loaiVthh: '',
    maDvi: '',
    trichYeu: ''
  };

  filterTable: any = {
    namKhoach: '',
    tenGthau: '',
    tenDvi: '',
    soQdPdKhlcnt: '',
    ngayQd: '',
    trichYeu: '',
    tenVthh: '',
    tenCloaiVthh: '',
    thanhGiaGoiThau: '',
    tenTrangThai: '',
    trangThai: ''
  };

  dataTableAll: any[] = [];
  listVthh: any[] = [];
  allChecked = false;
  indeterminate = false;
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  async ngOnInit() {
    await this.spinner.show();
    this.listVthh = LIST_VAT_TU_HANG_HOA;
    try {
      this.userInfo = this.userService.getUserLogin();
      this.getTitleVthh();
      this.yearNow = dayjs().get('year');
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
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getTitleVthh() {
    let loatVthh = this.router.url.split('/')[4]
    this.searchFilter.loaiVthh = convertVthhToId(loatVthh);
  }

  async search() {
    this.dataTable = [];
    let body = {
      tuNgayQd: this.searchFilter.ngayQd
        ? dayjs(this.searchFilter.ngayQd[0]).format('YYYY-MM-DD')
        : null,
      denNgayQd: this.searchFilter.ngayQd
        ? dayjs(this.searchFilter.ngayQd[1]).format('YYYY-MM-DD')
        : null,
      loaiVthh: this.loaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      soQd: this.searchFilter.soQd,
      lastest: 1,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
    };
    let res = await this.thongTinDauThauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log(this.dataTable);
      this.totalRecord = data.totalElements;
      if (data && data.content && data.content.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable)
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai
    return this.danhSachDauThauService.search(body);
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(data) {
    // VẬt tư
    // if (this.loaiVthh.startsWith('02')) {
    //   this.selectedId = data.hhQdKhlcntHdr.id;
    // } else {
    //   this.selectedId = data.id;
    // }
    this.selectedId = data.id;
    this.isDetail = true;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.soQd = null;
    this.searchFilter.ngayQd = null;
    this.searchFilter.maDvi = null;
    this.searchFilter.trichYeu = null;
    this.searchFilter.loaiVthh = null;
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
          let body = {
            "id": item.id,
            "maDvi": ""
          }
          this.tongHopDeXuatKHLCNTService.delete(body).then(async () => {
            await this.search();
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

  convertDay(day: string) {
    if (day && day.length > 0) {
      return dayjs(day).format('DD/MM/YYYY');
    }
    return '';
  }

  statusGoiThau(status: string) {
    return convertTrangThaiGt(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayQd: this.searchFilter.ngayQd
            ? dayjs(this.searchFilter.ngayQd[0]).format('YYYY-MM-DD')
            : null,
          denNgayQd: this.searchFilter.ngayQd
            ? dayjs(this.searchFilter.ngayQd[1]).format('YYYY-MM-DD')
            : null,
          loaiVthh: this.searchFilter.loaiVthh,
          namKhoach: this.searchFilter.namKhoach,
          trichYeu: this.searchFilter.trichYeu,
          maDvi: this.userInfo.MA_DVI,
          soQd: this.searchFilter.soQd,
        }
        this.thongTinDauThauService
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


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai !== STATUS.TRUNG_THAU) {
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


  clearFilterTable() {
    this.filterTable = {
      namKhoach: '',
      trangThai: '',
      tenGthau: '',
      tenDvi: '',
      soQdPdKhlcnt: '',
      ngayQd: '',
      trichYeu: '',
      tenVthh: '',
      tenCloaiVthh: '',
      thanhGiaGoiThau: '',
      tenTrangThai: '',
    }
  }
}
