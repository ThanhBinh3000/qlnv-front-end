import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Subject } from 'rxjs';
import { QuanLyBangKeCanHangService } from 'src/app/services/quanLyBangKeCanHang.service';

@Component({
  selector: 'quan-ly-bang-ke-can-hang',
  templateUrl: './quan-ly-bang-ke-can-hang.component.html',
  styleUrls: ['./quan-ly-bang-ke-can-hang.component.scss'],
})
export class QuanLyBangKeCanHangComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  soPhieu: string = null;
  soHD: string = null;
  loaiVTHH: string = null;
  trangThai: string = null;
  startValue: Date | null = null;
  endValue: Date | null = null;

  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyBangKeCanHangService: QuanLyBangKeCanHangService,
    private notification: NzNotificationService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadDonVi(),
        this.search(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDonVi() {
    const res = await this.donViService.layTatCaDonVi();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = [];
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
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

  async search() {
    let param = {
      "denNgay": this.endValue ? dayjs(this.endValue).format('YYYY-MM-DD') : null,
      "maDonVi": this.selectedDonVi.maDvi,
      "maHang": this.loaiVTHH,
      "pageSize": this.pageSize,
      "pageNumber": this.page,
      "soBangKe": this.soPhieu,
      "tuNgay": this.startValue ? dayjs(this.startValue).format('YYYY-MM-DD') : null,
    }
    let res = await this.quanLyBangKeCanHangService.timKiem(param);
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

  clearFilter() {
    this.soPhieu = null;
    this.soHD = null;
    this.loaiVTHH = null;
    this.trangThai = null;
    this.startValue = null;
    this.endValue = null;
  }

  xoaItem(item: any) {
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

  redirectToChiTiet(id: number) {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/',
      id,
    ]);
  }
}
