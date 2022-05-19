import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DeXuatDieuChinhService } from 'src/app/services/deXuatDieuChinh.service';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import {
  DE_XUAT_DIEU_CHINH, MAIN_ROUTE_KE_HOACH, THONG_TIN_DE_XUAT_DIEU_CHINH
} from './../ke-hoach.constant';

@Component({
  selector: 'app-de-xuat-dieu-chinh',
  templateUrl: './de-xuat-dieu-chinh.component.html',
  styleUrls: ['./de-xuat-dieu-chinh.component.scss'],
})
export class DeXuatDieuChinhComponent implements OnInit {
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  namKeHoach: number = null;
  soQDGiao: string = null;
  trichYeuGiao: string = null;
  soQDDieuChinh: string = null;
  trichYeuDieuChinh: string = null;
  startValue: Date | null = null;
  endValue: Date | null = null;
  startValueDc: Date | null = null;
  endValueDc: Date | null = null;
  ngayKy: any;
  ngayKyDC: any;

  listNam: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  lastBreadcrumb: string;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private deXuatDieuChinhService: DeXuatDieuChinhService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private donViService: DonviService,
    public userService: UserService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.userService.isTongCuc()) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
      } else if (this.userService.isChiCuc()) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.userService.isCuc()) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
      }
      let dayNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayNow - i,
          text: dayNow - i,
        });
      }
      await Promise.all([this.search()]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
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

  disabledStartDateDc = (startValue: Date): boolean => {
    if (!startValue || !this.endValueDc) {
      return false;
    }
    return startValue.getTime() > this.endValueDc.getTime();
  };

  disabledEndDateDc = (endValue: Date): boolean => {
    if (!endValue || !this.startValueDc) {
      return false;
    }
    return endValue.getTime() <= this.startValueDc.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  redirectToChiTiet(id) {
    this.router.navigate([
      `/${MAIN_ROUTE_KE_HOACH}/${DE_XUAT_DIEU_CHINH}/${THONG_TIN_DE_XUAT_DIEU_CHINH}`,
      id,
    ]);
  }

  clearFilter() {
    this.namKeHoach = null;
    this.soQDGiao = null;
    this.trichYeuGiao = null;
    this.soQDDieuChinh = null;
    this.trichYeuDieuChinh = null;
    this.startValue = null;
    this.endValue = null;
    this.startValueDc = null;
    this.endValueDc = null;
    this.ngayKy = null;
    this.ngayKyDC = null;
    this.inputDonVi = '';
    this.selectedDonVi = {};
  }

  async search() {
    let param = {
      pageSize: this.pageSize,
      pageNumber: this.page,
      namKeHoach: this.namKeHoach,
      soVanBan: this.soQDDieuChinh,
      trichYeuDx: this.trichYeuDieuChinh,
      ngayKyDenNgayDx: this.ngayKyDC && this.ngayKyDC.length > 1
        ? dayjs(this.ngayKyDC[1]).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgayDx: this.ngayKyDC && this.ngayKyDC.length > 0
        ? dayjs(this.ngayKyDC[0]).format('YYYY-MM-DD')
        : null,
      soQuyetDinh: this.soQDGiao,
      trichYeuQd: this.trichYeuGiao,
      ngayKyDenNgayQd: this.ngayKy && this.ngayKy.length > 1
        ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgayQd: this.ngayKy && this.ngayKy.length > 0
        ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.deXuatDieuChinhService.timKiem(
      param,
    );
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
          this.deXuatDieuChinhService
            .deleteData(item.id)
            .then(async () => {
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          pageSize: null,
          pageNumber: null,
          namKeHoach: this.namKeHoach,
          soVanBan: this.soQDDieuChinh,
          trichYeuDx: this.trichYeuDieuChinh,
          ngayKyDenNgayDx: this.ngayKyDC && this.ngayKyDC.length > 1
            ? dayjs(this.ngayKyDC[1]).format('YYYY-MM-DD')
            : null,
          ngayKyTuNgayDx: this.ngayKyDC && this.ngayKyDC.length > 0
            ? dayjs(this.ngayKyDC[0]).format('YYYY-MM-DD')
            : null,
          soQuyetDinh: this.soQDGiao,
          trichYeuQd: this.trichYeuGiao,
          ngayKyDenNgayQd: this.ngayKy && this.ngayKy.length > 1
            ? dayjs(this.ngayKy[1]).format('YYYY-MM-DD')
            : null,
          ngayKyTuNgayQd: this.ngayKy && this.ngayKy.length > 0
            ? dayjs(this.ngayKy[0]).format('YYYY-MM-DD')
            : null,
        };
        this.deXuatDieuChinhService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-de-xuat-dieu-chinh.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }
}
