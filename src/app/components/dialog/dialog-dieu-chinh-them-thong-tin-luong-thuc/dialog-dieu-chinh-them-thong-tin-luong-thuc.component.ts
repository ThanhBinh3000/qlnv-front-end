import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-luong-thuc',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-luong-thuc.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-luong-thuc.component.scss'],
})
export class DialogDieuChinhThemThongTinLuongThucComponent implements OnInit {
  formData: FormGroup;
  yearNow: number = 0;

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];

  optionsDonViTinh: any[] = [];
  inputDonViTinh: string = '';
  optionsDonViTinhShow: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    this.formData = this.fb.group({
      maDv: [null, [Validators.required]],
      donViTinh: [null],
      tenDonVi: [null],
      tongSoQuyThocTonKhoDauNam: [null],
      slThoc1: [null],
      slThoc2: [null],
      slThoc3: [null],
      slGao1: [null],
      slGao2: [null],
      slGao3: [null],
      tongSoQuyThocNhapTrongNam: [null],
      slThocTruocDieuChinh: [null],
      slThocGiam: [null],
      slThocTang: [null],
      slThocSauDieuChinh: [null],
      slGaoTruocDieuChinh: [null],
      slGaoGiam: [null],
      slGaoTang: [null],
      slGaoSauDieuChinh: [null],
      tongSoQuyThocXuatTrongNam: [null],
      xuatTongSLThoc: [null],
      xuatSlThocTruocDieuChinh1: [null],
      xuatSlThocGiam1: [null],
      xuatSlThocTang1: [null],
      xuatSlThocSauDieuChinh1: [null],
      xuatSlThocTruocDieuChinh2: [null],
      xuatSlThocGiam2: [null],
      xuatSlThocTang2: [null],
      xuatSlThocSauDieuChinh2: [null],
      xuatSlThocTruocDieuChinh3: [null],
      xuatSlThocGiam3: [null],
      xuatSlThocTang3: [null],
      xuatSlThocSauDieuChinh3: [null],
      xuatSlGaoTruocDieuChinh1: [null],
      xuatTongSLGao: [null],
      xuatSlGaoGiam1: [null],
      xuatSlGaoTang1: [null],
      xuatSlGaoSauDieuChinh1: [null],
      xuatSlGaoTruocDieuChinh2: [null],
      xuatSlGaoGiam2: [null],
      xuatSlGaoTang2: [null],
      xuatSlGaoSauDieuChinh2: [null],
      xuatSlGaoTruocDieuChinh3: [null],
      xuatSlGaoGiam3: [null],
      xuatSlGaoTang3: [null],
      xuatSlGaoSauDieuChinh3: [null],
      tongSoQuyThocTruocTonKhoCuoiNam: [null],
      slThocTruocTonKho: [null],
      slGaoTruocTonKho: [null],
      tongSoQuyThocSauTonKhoCuoiNam: [null],
      slThocSauTonKho: [null],
      slGaoSauTonKho: [null],
    });
    this.spinner.show();
    try {
      await this.loadDonVi();
      await this.loadDonViTinh();
      this.spinner.hide();
    }
    catch (err) {
      this.spinner.hide();
    }
  }

  async loadDonViTinh() {
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

  onInputDonViTinh(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViTinhShow = [];
    } else {
      this.optionsDonViTinhShow = this.optionsDonViTinh.filter(
        (x) => x.labelDonViTinh.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
