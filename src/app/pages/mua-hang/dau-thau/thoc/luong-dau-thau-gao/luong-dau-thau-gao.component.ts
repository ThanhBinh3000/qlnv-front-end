import { saveAs } from 'file-saver';
import { LEVEL, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/tongHopDeXuatKHLCNT.service';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: ' ',
  templateUrl: './luong-dau-thau-gao.component.html',
  styleUrls: ['./luong-dau-thau-gao.component.scss'],
})
export class LuongDauThauGaoComponent implements OnInit {
  searchValue = '';
  tabSelected: string = 'phuong-an-tong-hop';
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  loaiVTHH: string = null;
  namKeHoach: number = dayjs().get('year');
  listNam: any[] = [];
  yearNow: number = 0;
  startValue: Date | null = null;
  endValue: Date | null = null;

  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'tong-hop';
  index = 0;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private modal: NzModalService,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.isVisibleChangeTab$.subscribe((value: boolean) => {
        this.visibleTab = value;
      });
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    if (this.tabSelected == 'phuong-an-tong-hop') {
      let param = {
        "denNgayTao": this.endValue
          ? dayjs(this.endValue).format('YYYY-MM-DD')
          : null,
        "loaiVthh": this.loaiVTHH,
        "namKhoach": this.namKeHoach,
        "paggingReq": {
          "limit": this.pageSize,
          "page": this.page
        },
        "str": "",
        "trangThai": "",
        "tuNgayTao": this.startValue
          ? dayjs(this.startValue).format('YYYY-MM-DD')
          : null,
      }
      let res = await this.tongHopDeXuatKHLCNTService.timKiem(param);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    else {
      let trangThai = "00";
      if (this.tabSelected == 'danh-sach-tong-hop') {
        trangThai = "05";
      } else if (this.tabSelected == 'danh-sach-chua-tong-hop') {

      }
      let param = {
        "loaiVthh": this.loaiVTHH,
        "namKhoach": this.namKeHoach,
        "trangThai": trangThai,
      }
      let res = await this.tongHopDeXuatKHLCNTService.dsChuaTongHop(param);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async selectTabData(tab: string) {
    this.spinner.show();
    try {
      this.tabSelected = tab;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
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

  redirectToChiTiet(id) {
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        id,
      ]);
    } else if (this.router.url.includes(LEVEL.CUC)) {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        id,
      ]);
    }
  }

  clearFilter() {
    this.namKeHoach = null;
    this.loaiVTHH = null;
    this.startValue = null;
    this.endValue = null;
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
          this.tongHopDeXuatKHLCNTService.xoa(body).then(async () => {
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "denNgayTao": this.endValue
            ? dayjs(this.endValue).format('YYYY-MM-DD')
            : null,
          "loaiVthh": this.loaiVTHH,
          "namKhoach": this.namKeHoach,
          "paggingReq": null,
          "str": "",
          "trangThai": "",
          "tuNgayTao": this.startValue
            ? dayjs(this.startValue).format('YYYY-MM-DD')
            : null,
        };
        this.tongHopDeXuatKHLCNTService
          .exportList(body)
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

  selectTabMenu(tab) {
    if (tab == this.selectedTab) {
      return;
    }
    if (tab == 'tong-hop') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    } else if (tab == 'phuong-an') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    } else if (tab == 'phe-duyet') {
      if (this.router.url.includes(LEVEL.TONG_CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-tong-cuc',
        ]);
      } else if (this.router.url.includes(LEVEL.CUC)) {
        this.router.navigate([
          '/mua-hang/dau-thau/thoc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau-cuc',
        ]);
      }
    }
  }
  onIndexChange(event: number): void {
    this.index = event;
  }
}
