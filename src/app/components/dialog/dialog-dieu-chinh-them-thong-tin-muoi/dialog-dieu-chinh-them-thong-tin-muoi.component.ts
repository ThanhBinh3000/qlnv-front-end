import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-muoi',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-muoi.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-muoi.component.scss'],
})
export class DialogDieuChinhThemThongTinMuoiComponent implements OnInit {
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
      tongSoTonKho: [null],
      slMuoi1: [null],
      slMuoi2: [null],
      slMuoi3: [null],
      tongSoQuyThocNhapTrongNam: [null],
      slMuoiTruocDieuChinh: [null],
      slMuoiGiam: [null],
      slMuoiTang: [null],
      tongSoXuat: [null],
      xuatSLMuoiTruoc1: [null],
      xuatSLMuoiGiam1: [null],
      xuatSLMuoiTang1: [null],
      xuatSLMuoiTruoc2: [null],
      xuatSLMuoiGiam2: [null],
      xuatSLMuoiTang2: [null],
      xuatSLMuoiTruoc3: [null],
      xuatSLMuoiGiam3: [null],
      xuatSLMuoiTang3: [null],
      tongTruocCuoiNam: [null],
      tongSauCuoiNam: [null],
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
