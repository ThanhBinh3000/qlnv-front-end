import { DonviService } from 'src/app/services/donvi.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-dialog-thong-tin-luong-thuc',
  templateUrl: './dialog-thong-tin-luong-thuc.component.html',
  styleUrls: ['./dialog-thong-tin-luong-thuc.component.scss'],
})
export class DialogThongTinLuongThucComponent implements OnInit {
  formData: FormGroup;
  options: any[] = [];
  optionsDonVi: any[] = [];
  optionsDVT: any[] = [];
  optionsDonViTinh: any[] = [];
  yearNow: number;
  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private donViService: DonviService,
  ) {}
  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    this.initForm();
    this.spinner.show();
    try {
      await this.loadDonVi();
      await this.loadDonViTinh();
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }
  initForm() {
    this.formData = this.fb.group({
      maDonVi: [null, [Validators.required]],
      donViTinh: [null],
      tenDonvi: [null, [Validators.required]],
      tkdnTongSoQuyThoc: [null],
      tkdnThocSoLuong1: [null],
      tkdnThocSoLuong2: [null],
      tkdnThocSoLuong3: [null],
      tkdnGaoSoLuong1: [null],
      tkdnGaoSoLuong2: [null],
      ntnTongSoQuyThoc: [null],
      ntnThoc: [null],
      ntnGao: [null],
      xtnTongSoQuyThoc: [null],
      xtnThocSoLuong1: [null],
      xtnThocSoLuong2: [null],
      xtnThocSoLuong3: [null],
      xtnGaoSoLuong1: [null],
      xtnGaoSoLuong2: [null],
      tkcnTongSoQuyThoc: [null],
      tkcnTongThoc: [null],
      tkcnTongGao: [null],
    });
  }
  cancel() {
    this._modalRef.destroy();
  }
  save() {
    this._modalRef.close(this.formData);
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
    this.formData.patchValue({
      maDonVi: donVi.maDvi,
      tenDonvi: donVi.tenDvi,
    });
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
  calculatorTkdnTongQuyThoc() {
    this.formData.patchValue({
      tkdnTongSoQuyThoc:
        +this.formData.get('tkdnThocSoLuong1').value +
        +this.formData.get('tkdnThocSoLuong2').value +
        +this.formData.get('tkdnThocSoLuong3').value +
        +this.formData.get('tkdnGaoSoLuong1').value * 2 +
        +this.formData.get('tkdnGaoSoLuong2').value * 2,
    });
  }
  calculatorXtnTongQuyThoc() {
    this.formData.patchValue({
      xtnTongSoQuyThoc:
        +this.formData.get('xtnThocSoLuong1').value +
        +this.formData.get('xtnThocSoLuong2').value +
        +this.formData.get('xtnThocSoLuong3').value +
        +this.formData.get('xtnGaoSoLuong1').value * 2 +
        +this.formData.get('xtnGaoSoLuong2').value * 2,
    });
  }
  calculatorTkcnTongQuyThoc() {
    this.formData.patchValue({
      tkcnTongSoQuyThoc:
        +this.formData.get('tkcnTongThoc').value +
        +this.formData.get('tkcnTongGao').value * 2,
    });
  }
  calculatorNtnTongQuyThoc() {
    this.formData.patchValue({
      ntnTongSoQuyThoc:
        +this.formData.get('ntnThoc').value +
        +this.formData.get('ntnGao').value * 2,
    });
  }
}
