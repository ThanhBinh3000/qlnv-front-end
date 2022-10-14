import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  DATEPICKER_CONFIG,
  LEVEL,
  LIST_VAT_TU_HANG_HOA,
  LOAI_HANG_DTQG,
  PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { HelperService } from 'src/app/services/helper.service';
import { QuyetDinhPheDuyetKeHoachLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import { UserService } from 'src/app/services/user.service';
import {
  convertTrangThai,
  convertTrangThaiGt,
  convertVthhToId,
} from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {
  ThongTinDauThauService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/thongTinDauThau.service";
@Component({
  selector: 'app-thongtin-dauthau',
  templateUrl: './thongtin-dauthau.component.html',
  styleUrls: ['./thongtin-dauthau.component.scss'],
})
export class ThongtinDauthauComponent implements OnInit {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private danhSachDauThauService: DanhSachDauThauService,
    private dauThauService: ThongTinDauThauService,
    private modal: NzModalService,
    public userService: UserService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    public globals: Globals,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
  ) {
    router.events.subscribe((val) => {
      this.getTitleVthh();
    });
  }
  tabSelected: string = 'phuong-an-tong-hop';
  searchValue = '';
  visibleTab: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;

  searchFilter = {
    namKhoach: dayjs().get('year'),
    soQdPd: '',
    ngayQd: '',
    loaiVthh: '',
    maDvi: '',
    trichYeu: '',
  };
  filterTable: any = {
    goiThau: '',
    tenDvi: '',
    soQdPdKhlcnt: '',
    ngayQd: '',
    trichYeu: '',
    tenVthh: '',
    tenCloaiVthh: '',
    thanhGiaGoiThau: '',
    statusConvert: '',
  };
  dataTableAll: any[] = [];
  listVthh: any[] = [];

  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  lastBreadcrumb: string;
  userInfo: UserLogin;
  datePickerConfig = DATEPICKER_CONFIG;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  async ngOnInit() {
    this.spinner.show();
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getTitleVthh() {
    let loatVthh = this.router.url.split('/')[4];
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

      loaiVthh: this.searchFilter.loaiVthh,
      namKhoach: this.searchFilter.namKhoach,
      trichYeu: this.searchFilter.trichYeu,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      soQdPd: this.searchFilter.soQdPd,
      maDvi: this.searchFilter.maDvi,
    };
    let res = await this.dauThauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
        this.dataTable.forEach((item) => {
          item.checked = false;
          item.statusConvert = this.statusGoiThau(item.trangThai);
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  searchDanhSachDauThau(body, trangThai) {
    body.trangThai = trangThai;
    return this.danhSachDauThauService.search(body);
  }

  async selectTabData(tab: string) {
    this.spinner.show();
    try {
      this.tabSelected = tab;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number) {
    this.selectedId = id;
    this.isDetail = true;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  clearFilter() {
    // this.namKeHoach = null;
    // this.loaiVthh = null;
    // this.startValue = null;
    // this.endValue = null;
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
            id: item.id,
            maDvi: '',
          };
          this.tongHopDeXuatKHLCNTService.delete(body).then(async () => {
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
    // if (this.totalRecord > 0) {
    //   this.spinner.show();
    //   try {
    //     let body = {
    //       // "denNgayTao": this.endValue
    //       //   ? dayjs(this.endValue).format('YYYY-MM-DD')
    //       //   : null,
    //       // "loaiVthh": this.searchFilter.loaiVthh,
    //       // "namKhoach": this.searchFilter.namKh,
    //       // "paggingReq": null,
    //       // "str": "",
    //       // "trangThai": "",
    //       // "tuNgayTao": this.startValue
    //       //   ? dayjs(this.startValue).format('YYYY-MM-DD')
    //       //   : null,
    //     };
    //     this.tongHopDeXuatKHLCNTService
    //       .exportList(body)
    //       .subscribe((blob) =>
    //         saveAs(blob, 'danh-sach-tong-hop-ke-hoach-lcnt.xlsx'),
    //       );
    //     this.spinner.hide();
    //   } catch (e) {
    //     console.log('error: ', e);
    //     this.spinner.hide();
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //   }
    // } else {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    // }
  }

  dateChange() {
    this.helperService.formatDate();
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
      goiThau: '',
      tenDvi: '',
      soQdPdKhlcnt: '',
      ngayQd: '',
      trichYeu: '',
      tenVthh: '',
      tenCloaiVthh: '',
      thanhGiaGoiThau: '',
      statusConvert: '',
    };
  }
}
