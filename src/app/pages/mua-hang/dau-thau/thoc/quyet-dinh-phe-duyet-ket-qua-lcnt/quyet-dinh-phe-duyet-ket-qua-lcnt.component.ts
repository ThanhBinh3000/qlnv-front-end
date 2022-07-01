import { QuyetDinhPheDuyetKetQuaLCNTService } from './../../../../../services/quyetDinhPheDuyetKetQuaLCNT.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'quyet-dinh-phe-duyet-ket-qua-lcnt',
  templateUrl: './quyet-dinh-phe-duyet-ket-qua-lcnt.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-ket-qua-lcnt.component.scss'],
})
export class QuyetDinhPheDuyetKetQuaLCNTComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  searchValue = '';
  searchFilter = {
    soQd: '',
    loaiHang: '',
    namKeHoach: '',
    donViId: '',
    tenDonVi: '',
    trichYeu: '',
  };
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  visibleTab: boolean = false;
  thocIdDefault: string = '01';
  gaoIdDefault: string = '00';
  listNam: any[] = [];
  yearNow: number = 0;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'ket-qua';

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
    private notification: NzNotificationService,
    private router: Router,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
    } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
      this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
    } else if (this.router.url.includes(LEVEL.CUC)) {
      this.lastBreadcrumb = LEVEL.CUC_SHOW;
    }
    this.spinner.show();
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
    try {
      this.loadTatCaDonVi();
      this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async loadTatCaDonVi() {
    let res = await this.donViService.layTatCaDonVi();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        var item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
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

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  redirectToChiTiet(id: number) {
    this.router.navigate([
      '/mua-hang/dau-thau/thoc/nhap-quyet-dinh-ket-qua-nha-thau-cuc/thong-tin-nhap-quyet-dinh-ket-qua-nha-thau-cuc',
      id,
    ]);
  }

  clearFilter() {
    this.searchFilter = {
      soQd: '',
      loaiHang: '',
      namKeHoach: '',
      donViId: '',
      tenDonVi: '',
      trichYeu: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
  }

  async search() {
    let maDonVi = null;
    let tenDvi = null;
    let donviId = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
        tenDvi = getDonVi[0].tenDvi;
        donviId = getDonVi[0].id;
      }
    }
    let body = {
      denNgayQd: this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      id: 0,
      maDvi: maDonVi,
      loaiVthh: this.searchFilter.loaiHang,
      namKhoach: this.searchFilter.namKeHoach,
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soQd: this.searchFilter.soQd,
      str: null,
      tuNgayQd: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log('dataTable: ', this.dataTable);

      this.totalRecord = data.totalElements;
    } else {
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  selectNam() { }

  selectTabMenu(tab) {
    if (tab == this.selectedTab) {
      return;
    }
    if (tab == 'thong-tin') {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/nhap-thong-tin-dau-thau-cuc',
      ]);
    } else if (tab == 'ket-qua') {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/nhap-quyet-dinh-ket-qua-nha-thau-cuc',
      ]);
    }
  }
}
