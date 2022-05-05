import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import * as dayjs from 'dayjs';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'quan-ly-phieu-nhap-day-kho',
  templateUrl: './quan-ly-phieu-nhap-day-kho.component.html',
  styleUrls: ['./quan-ly-phieu-nhap-day-kho.component.scss'],
})
export class QuanLyPhieuNhapDayKhoComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  soBB: number = null;
  startValue: Date | null = null;
  endValue: Date | null = null;
  loaiVTHH: string = null;

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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
      "denNgay": this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      "maDonVi": maDonVi,
      "maHang": this.loaiVTHH,
      "pageSize": this.pageSize,
      "pageNumber": this.page,
      "soBienBan": this.soBB,
      "tuNgay": this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
    }
    let res = await this.quanLyPhieuNhapDayKhoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
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

  clearFilter() {
    this.soBB = null;
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
          this.quanLyPhieuNhapDayKhoService.xoa(body).then(async () => {
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

  redirectToChiTiet(id: number) {
    this.router.navigate([
      'nhap/dau-thau/quan-ly-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho/',
      id,
    ]);
  }
}
