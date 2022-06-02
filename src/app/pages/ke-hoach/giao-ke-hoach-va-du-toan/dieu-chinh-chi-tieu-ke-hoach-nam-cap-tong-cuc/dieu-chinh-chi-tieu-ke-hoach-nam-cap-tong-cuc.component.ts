import { cloneDeep } from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LEVEL, LEVEL_USER, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import {
  DIEU_CHINH_CHI_TIEU_KE_HOACH_NAM,
  DIEU_CHINH_THONG_TIN_CHI_TIEU_KE_HOACH_NAM,
  MAIN_ROUTE_KE_HOACH,
} from './../../ke-hoach.constant';

@Component({
  selector: 'app-dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class DieuChinhChiTieuKeHoachNamComponent implements OnInit {
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
  userInfo: UserLogin;

  titleCard: string = '';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private donViService: DonviService,
    private userService: UserService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();

      if (this.userService.isTongCuc()) {
        this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
        this.titleCard =
          'Danh sách điều chỉnh chỉ tiêu kế hoạch năm tổng cục giao';
      } else if (this.userService.isChiCuc()) {
        this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
      } else if (this.userService.isCuc()) {
        this.lastBreadcrumb = LEVEL.CUC_SHOW;
        this.titleCard = 'Danh sách điều chỉnh chỉ tiêu kế hoạch năm cục giao';
      }
      let dayNow = dayjs().get('year');
      // this.namKeHoach = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayNow - i,
          text: dayNow - i,
        });
      }
      await Promise.all([this.loadDonVi(), this.search()]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDonVi() {
    if (this.lastBreadcrumb == LEVEL.TONG_CUC_SHOW) {
      if (this.userInfo.CAP_DVI === LEVEL_USER.CUC) {
        const res = await this.donViService.layTatCaDonVi();
        this.optionsDonVi = [];
        if (res.msg == MESSAGE.SUCCESS) {
          for (let i = 0; i < res.data.length; i++) {
            if (this.userInfo.MA_DVI === res.data[i].maDvi) {
              this.inputDonVi = res.data[i].tenDvi;
              this.selectedDonVi = res.data[i];
              break;
            }
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
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
          this.optionsDonViShow = cloneDeep(this.optionsDonVi);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
    } else if (this.lastBreadcrumb == LEVEL.CUC_SHOW) {
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
        this.optionsDonViShow = cloneDeep(this.optionsDonVi);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = cloneDeep(this.optionsDonVi);
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
      `/${MAIN_ROUTE_KE_HOACH}/${DIEU_CHINH_CHI_TIEU_KE_HOACH_NAM}/${DIEU_CHINH_THONG_TIN_CHI_TIEU_KE_HOACH_NAM}`,
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
    this.inputDonVi = '';
    this.selectedDonVi = {};
  }

  async search() {
    let param = {
      pageSize: this.pageSize,
      pageNumber: this.page,
      namKeHoach: this.namKeHoach,
      soQD: this.soQDDieuChinh,
      trichYeu: this.trichYeuDieuChinh,
      ngayKyDenNgay: this.endValueDc
        ? dayjs(this.endValueDc).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgay: this.startValueDc
        ? dayjs(this.startValueDc).format('YYYY-MM-DD')
        : null,
      soCT: this.soQDGiao,
      trichYeuCT: this.trichYeuGiao,
      ngayKyDenNgayCT: this.endValue
        ? dayjs(this.endValue).format('YYYY-MM-DD')
        : null,
      ngayKyTuNgayCT: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
    };
    let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.timKiem(
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
          this.quyetDinhDieuChinhChiTieuKeHoachNamService
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
          soQD: this.soQDGiao,
          namKeHoach: this.namKeHoach,
          trichYeu: this.trichYeuGiao,
          ngayKyDenNgay: this.endValue
            ? dayjs(this.endValue).format('YYYY-MM-DD')
            : null,
          ngayKyTuNgay: this.startValue
            ? dayjs(this.startValue).format('YYYY-MM-DD')
            : null,
        };
        this.quyetDinhDieuChinhChiTieuKeHoachNamService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-dieu-chinh-chi-tieu-ke-hoach-nam.xlsx'),
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
