import {
  LOAI_QUYET_DINH,
  LOAI_HANG_DTQG,
  PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';

@Component({
  selector: 'quyet-dinh-giao-nhiem-vu-nhap-hang',
  templateUrl: './quyet-dinh-giao-nhiem-vu-nhap-hang.component.html',
  styleUrls: ['./quyet-dinh-giao-nhiem-vu-nhap-hang.component.scss'],
})
export class QuyetDinhGiaoNhiemVuNhapHangComponent implements OnInit {
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  startValue: Date | null = null;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  nhapIdDefault: string = LOAI_QUYET_DINH.NHAP;
  xuatIdDefault: string = LOAI_QUYET_DINH.XUAT;

  loaiVTHH: string = null;
  soQD: string = null;
  canCu: string = null;
  loaiQd: string = null;
  soHd: string = null;

  selectedCanCu: any = null;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialogHopDong() {
    // const modalQD = this.modal.create({
    //   nzTitle: 'Thông tin căn cứ trên hợp đồng',
    //   nzContent: DialogCanCuHopDongComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '900px',
    //   nzFooter: null,
    //   nzComponentParams: {},
    // });
    // modalQD.afterClose.subscribe((data) => {
    //   if (data) {
    //     this.soHd = data.soHdong;
    //   }
    // });
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

  redirectToChiTiet(id: number) {
    this.router.navigate([
      '/nhap/dau-thau/vat-tu/quyet-dinh-giao-nhiem-vu-nhap-hang/them-quyet-dinh-giao-nhiem-vu-nhap-hang',
      id,
    ]);
  }

  clearFilter() {
    this.soQD = null;
    this.startValue = null;
    this.canCu = null;
    this.inputDonVi = null;
    this.loaiVTHH = null;
    this.loaiQd = null;
  }

  async search() {
    let maDonVi = null;
    this.dataTable = [];
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
      }
    }
    let body = {
      loaiQd: this.loaiQd,
      maDvi: maDonVi,
      maVthh: this.loaiVTHH ?? '00',
      ngayQd: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
      orderBy: null,
      orderDirection: null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soHd: this.soHd,
      soQd: this.soQD,
      str: null,
      trangThai: null,
    };
    this.totalRecord = 10;
    // let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    // if (res.msg == MESSAGE.SUCCESS) {
    //   let data = res.data;
    //   if (data && data.content && data.content.length > 0) {
    //     this.dataTable = data.content;
    //   }
    //   this.totalRecord = data.totalElements;
    // } else {
    //   this.notification.error(MESSAGE.ERROR, res.msg);
    // }
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
    return this.convertTrangThai(status);
  }

  xoaItem(item: any) {}

  export() {}
}
