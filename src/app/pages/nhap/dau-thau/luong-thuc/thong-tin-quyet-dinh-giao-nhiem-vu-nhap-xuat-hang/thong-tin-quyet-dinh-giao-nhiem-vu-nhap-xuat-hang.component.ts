import {
  ChangeDetectionStrategy, Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { LOAI_HANG_DTQG, LOAI_QUYET_DINH } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ChiTietGiaoNhiemVuNhapXuat } from 'src/app/models/ChiTietGiaoNhiemVuNhapXuat';
import { DonviService } from 'src/app/services/donvi.service';
import { TAB_SELECTED } from './../../../../ke-hoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam.constant';

@Component({
  selector: 'thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang',
  templateUrl:
    './thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component.html',
  styleUrls: [
    './thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongTinGiaoNhiemVuNhapXuatHangComponent implements OnInit {
  tabSelected: string = TAB_SELECTED.luongThuc;
  tab = TAB_SELECTED;

  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  optionsDVT: any[] = [];
  optionsDonViTinh: any[] = [];
  donViTinhModel: any = null;

  nhapIdDefault: string = LOAI_QUYET_DINH.NHAP;
  xuatIdDefault: string = LOAI_QUYET_DINH.XUAT;

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  loaiVTHH: string = null;
  donViTinh: string = null;
  soLuong: number = null;

  chiTiet: ChiTietGiaoNhiemVuNhapXuat = new ChiTietGiaoNhiemVuNhapXuat();

  constructor(
    private router: Router,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private donViService: DonviService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadDonVi(),
        this.loadDonViTinh(),
      ])
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

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.optionsDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.optionsDonViTinh.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  selectDonViTinh(donViTinh) {
    this.donViTinhModel = donViTinh;
  }

  reactToDonViThuchienQuyetDinh() {
    this.router.navigate([
      'nhap/dau-thau/quyet-dinh-giao-nhiem-vu-nhap-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang',
      0,
      'chi-tiet-don-vi-thuc-hien-quyet-dinh',
      0,
    ]);
  }

  back() {
    this.router.navigate(['/nhap/dau-thau/quyet-dinh-giao-nhiem-vu-nhap-hang']);
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
      }
    });
  }
}
