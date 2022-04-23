import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { HelperService } from 'src/app/services/helper.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { convertTrangThai } from 'src/app/shared/commonFunction';
@Component({
  selector: 'ds-thong-tin-mua-truc-tiep-tc',
  templateUrl: './ds-thong-tin-mua-truc-tiep-tc.component.html',
  styleUrls: ['./ds-thong-tin-mua-truc-tiep-tc.component.scss'],
})
export class DsThongTinMuaTrucTiepTCComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
    donViId: '',
    tenDonVi: '',
    trichYeu: '',
  };
  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  type: number = 1; //1-TC, 2-C, 3-CC

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private helperService: HelperService,
    private modal: NzModalService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.router.url.indexOf('ds-thong-tin-mua-truc-tiep-tc') != -1) {
        this.type = 1;
      } else if (this.router.url.indexOf('ds-thong-tin-mua-truc-tiep-cuc') != -1) {
        this.type = 2;
      }
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

  redirectThongTinChiTieuKeHoachNam() {
    if (this.type == 1) {
      this.router.navigate([
        'mua-hang/mua-truc-tiep/thoc/ds-thong-tin-mua-truc-tiep-tc/thong-tin-mua-truc-tiep-tc',
        0,
      ]);
    } else if (this.type == 2) {
      this.router.navigate([
        'mua-hang/mua-truc-tiep/thoc/ds-thong-tin-mua-truc-tiep-cuc/thong-tin-mua-truc-tiep-cuc',
        0,
      ]);
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
      ngayKyDenNgay: this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      id: 0,
      donViId: donviId,
      tenDvi: tenDvi,
      pageNumber: this.page,
      pageSize: this.pageSize,
      soQD: this.searchFilter.soQD,
      trichYeu: this.searchFilter.trichYeu,
      ngayKyTuNgay: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.chiTieuKeHoachNamService.timKiem(body);
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

  clearFilter() {
    this.searchFilter = {
      soQD: '',
      donViId: '',
      tenDonVi: '',
      trichYeu: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }
}
