import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { LEVEL, LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { PhuongAnKeHoachLCNTService } from 'src/app/services/phuongAnKeHoachLCNT.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'phuong-an-trinh-tong-cuc',
  templateUrl: './phuong-an-trinh-tong-cuc.component.html',
  styleUrls: ['./phuong-an-trinh-tong-cuc.component.scss'],
})
export class PhuongAnTrinhTongCucComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;
  formData: FormGroup;
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  listNam: any[] = [];
  yearNow: number = null;
  namKeHoach: number = null;
  loaiVTHH: number = null;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  dataTable: any[] = [];

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'phuong-an';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private phuongAnKeHoachLCNTService: PhuongAnKeHoachLCNTService,
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
      this.namKeHoach = this.yearNow;
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

  clearFilter() {
    this.namKeHoach = this.yearNow;
    this.loaiVTHH = null;
    this.startValue = null;
    this.endValue = null;
  }

  async search() {
    let param = {
      "denNgayTao": this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      "loaiVthh": this.loaiVTHH ?? "00",
      "namKhoach": this.namKeHoach,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page
      },
      "str": null,
      "trangThai": null,
      "tuNgayTao": this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
    }
    let res = await this.phuongAnKeHoachLCNTService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content) {
        this.dataTable = data.content;
        if (this.dataTable.length > 0) {
          this.dataTable.forEach((item: any) => {
            item.ngayTao = dayjs(item.ngayTao).format('DD/MM/YYYY')
          });
        }
      }
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  redirectToChiTiet(id: number) {
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-phuong-an-ke-hoach-lua-chon-nha-thau-tong-cuc',
        id,
      ]);
    } else if (this.router.url.includes(LEVEL.CUC)) {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/phuong-an-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-phuong-an-ke-hoach-lua-chon-nha-thau-cuc',
        id,
      ]);
    }
  }

  convertTrangThai(status: string) {
    if (status == '01') {
      return "Đã duyệt";
    }
    else {
      return "Chưa duyệt";
    }
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
          this.phuongAnKeHoachLCNTService.xoa(body).then(async () => {
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
}
