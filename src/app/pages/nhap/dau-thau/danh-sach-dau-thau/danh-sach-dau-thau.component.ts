import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';

@Component({
  selector: 'danh-sach-dau-thau',
  templateUrl: './danh-sach-dau-thau.component.html',
  styleUrls: ['./danh-sach-dau-thau.component.scss'],
})
export class DanhSachDauThauComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  searchValue = '';
  searchFilter = {
    soDxuat: '',
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

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private notification: NzNotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.donViService.layTatCaDonVi().then((res) => {
      this.optionsDonVi = [];
      if (res.msg == 'Thành công') {
        this.spinner.hide();
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
    });
    this.search();
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

  redirectToThemMoi() {
    this.router.navigate([
      '/nhap/dau-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau',
      1,
    ]);
  }

  clearFilter() {
    this.searchFilter = {
      soDxuat: '',
      trichYeu: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
  }

  search() {
    let maDonVi = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
      }
    }
    let body = {
      denNgayKy: this.endValue
        ? dayjs(this.endValue).format('DD/MM/YYYY')
        : null,
      id: 0,
      loaiVthh: '00',
      maDvi: maDonVi,
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soDxuat: this.searchFilter.soDxuat,
      str: null,
      trangThai: '00',
      trichYeu: this.searchFilter.trichYeu,
      tuNgayKy: this.startValue
        ? dayjs(this.startValue).format('DD/MM/YYYY')
        : null,
    };
    this.totalRecord = 10;
    this.danhSachDauThauService.timKiem(body).then((res) => {
      console.log('res', res);
    });
  }

  changePageIndex(event) {
    this.page = event;
    this.search();
  }

  changePageSize(event) {
    this.pageSize = event;
    this.search();
  }
}
