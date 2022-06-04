import { UserService } from '../../../../services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { cloneDeep } from 'lodash';
import { LEVEL, LEVEL_USER, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  CHI_TIEU_KE_HOACH_NAM,
  MAIN_ROUTE_KE_HOACH,
  THONG_TIN_CHI_TIEU_KE_HOACH_NAM,
} from '../../ke-hoach.constant';
@Component({
  selector: 'app-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class ChiTieuKeHoachNamComponent implements OnInit {
  searchValue = '';
  searchFilter = {
    soQD: '',
    donViId: '',
    tenDonVi: '',
    trichYeu: '',
    namKeHoach: '',
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
  listNam: any[] = [];
  lastBreadcrumb: string;
  userInfo: UserLogin;
  donViIdSearch: number;
  maDonViSearch: string;
  labelDonViSearch: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if (this.userService.isTongCuc()) {
      this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
    } else if (this.userService.isChiCuc()) {
      this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
    } else if (this.userService.isCuc()) {
      this.lastBreadcrumb = LEVEL.CUC_SHOW;
    }

    this.spinner.show();
    try {
      let dayNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayNow - i,
          text: dayNow - i,
        });
      }
      const res = await this.donViService.layDonViCon();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
        this.options = cloneDeep(this.optionsDonVi);
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

  redirectThongTinChiTieuKeHoachNam(id: number) {
    this.selectedId = id;
    this.isDetail = true;
  }

  showList() {
    this.isDetail = false;
  }
  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value.trim();
    if (value !== this.labelDonViSearch) {
      this.donViIdSearch = -1;
    }
    if (!value || value.indexOf('@') >= 0) {
      this.options = this.optionsDonVi;
      this.donViIdSearch = null;
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
        (x) => x.labelDonVi == this.inputDonVi.trim(),
      );
      if (getDonVi && getDonVi.length > 0) {
        this.labelDonViSearch = this.inputDonVi;
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
      donViId: donviId ?? this.donViIdSearch,
      tenDvi: tenDvi,
      pageNumber: this.page,
      pageSize: this.pageSize,
      soQD: this.searchFilter.soQD,
      trichYeu: this.searchFilter.trichYeu,
      namKeHoach: this.searchFilter.namKeHoach,
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
      if (this.page === 1) {
        await this.search();
      }
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
      namKeHoach: '',
    };
    this.startValue = null;
    this.endValue = null;
    this.inputDonVi = '';
    this.search();
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
          this.chiTieuKeHoachNamService.deleteData(item.id).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
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
        let maDonVi = null;
        let tenDvi = null;
        if (this.inputDonVi && this.inputDonVi.length > 0) {
          let getDonVi = this.optionsDonVi.filter(
            (x) => x.labelDonVi == this.inputDonVi,
          );
          if (getDonVi && getDonVi.length > 0) {
            maDonVi = getDonVi[0].maDvi;
            tenDvi = getDonVi[0].tenDvi;
          }
        }
        let body = {
          ngayKyDenNgay: this.endValue
            ? dayjs(this.endValue).format('YYYY-MM-DD')
            : null,
          id: 0,
          donViId: maDonVi,
          tenDvi: tenDvi,
          pageNumber: null,
          pageSize: null,
          soQD: this.searchFilter.soQD,
          trichYeu: this.searchFilter.trichYeu,
          ngayKyTuNgay: this.startValue
            ? dayjs(this.startValue).format('YYYY-MM-DD')
            : null,
        };
        this.chiTieuKeHoachNamService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chi-tieu-ke-hoach-nam.xlsx'),
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

  keyDownFunction(event) {
    if (event.keyCode === this.globals.prop.KEY_ENTER) {
      this.search();
    }
  }
  selectDonVi(donVi) {
    this.maDonViSearch = donVi.maDvi;
    this.labelDonViSearch = donVi.labelDonVi;
  }
}
