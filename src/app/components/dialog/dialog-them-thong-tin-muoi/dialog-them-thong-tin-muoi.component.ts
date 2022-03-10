import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';

@Component({
  selector: 'dialog-them-thong-tin-muoi',
  templateUrl: './dialog-them-thong-tin-muoi.component.html',
  styleUrls: ['./dialog-them-thong-tin-muoi.component.scss'],
})
export class DialogThemThongTinMuoiComponent implements OnInit {
  formData: FormGroup;
  yearNow: number = 0;

  options: any[] = [];
  optionsDonVi: any[] = [];
  optionsDVT: any[] = [];
  optionsDonViTinh: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) {}

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    this.formData = this.fb.group({
      maDonVi: [null, [Validators.required]],
      donViTinh: [null],
      tenDonVi: [null],
      tkdnTongSo: [null],
      tkdnSoLuong1: [null],
      tkdnSoLuong2: [null],
      tkdnSoLuong3: [null],
      ntnTongSo: [null],
      xtnTongSo: [null],
      xtnSoLuong1: [null],
      xtnSoLuong2: [null],
      xtnSoLuong3: [null],
      tkcnTongSo: [null],
    });
    this.spinner.show();
    try {
      await this.loadDonVi();
      await this.loadDonViTinh();
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
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
    } catch (error) {
      this.spinner.hide();
    }
  }
  async loadDonVi() {
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
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
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
  selectDonVi(donVi) {
    console.log(donVi);

    this.formData.patchValue({
      maDonVi: donVi.maDvi,
      tenDonVi: donVi.tenDvi,
    });

    console.log(this.formData.value);
  }

  onInputDonViTinh(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDVT = [];
    } else {
      this.optionsDVT = this.optionsDonViTinh.filter(
        (x) => x.tenDviTinh.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }
  selectDonViTinh(donViTinh) {
    this.formData.patchValue({
      donViTinh: donViTinh.tenDviTinh,
    });
  }

  handleOk() {
    this._modalRef.close(this.formData);
  }

  handleCancel() {
    this._modalRef.destroy();
  }
}
