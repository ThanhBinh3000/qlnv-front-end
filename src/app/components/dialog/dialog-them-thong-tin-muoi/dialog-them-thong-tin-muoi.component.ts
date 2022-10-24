import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { KeHoachMuoi } from './../../../models/KeHoachMuoi';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';

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
  thongTinMuoi: KeHoachMuoi;
  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private globals: Globals,
  ) {}

  async ngOnInit() {
    this.oninitForm();

    this.spinner.show();
    try {
      await this.loadDonVi();
      await this.loadDonViTinh();
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }
  oninitForm() {
    this.formData = this.fb.group({
      donViId: [this.thongTinMuoi ? this.thongTinMuoi.donViId : null],
      id: [this.thongTinMuoi ? this.thongTinMuoi.id : null],
      maDonVi: [
        this.thongTinMuoi ? this.thongTinMuoi.maDonVi : null,
        [Validators.required],
      ],
      donViTinh: ['Tấn'],
      tenDonVi: [this.thongTinMuoi ? this.thongTinMuoi.tenDonVi : null],
      tkdnTongSo: [this.thongTinMuoi ? this.thongTinMuoi.tkdnTongSoMuoi : null],
      tkdnSoLuong1: [
        this.thongTinMuoi ? this.thongTinMuoi.tkdnMuoi[0].soLuong : null,
      ],
      tkdnSoLuong2: [
        this.thongTinMuoi ? this.thongTinMuoi.tkdnMuoi[1].soLuong : null,
      ],
      tkdnSoLuong3: [
        this.thongTinMuoi ? this.thongTinMuoi.tkdnMuoi[2].soLuong : null,
      ],
      ntnTongSo: [this.thongTinMuoi ? this.thongTinMuoi.ntnTongSoMuoi : null],
      xtnTongSo: [this.thongTinMuoi ? this.thongTinMuoi.xtnTongSoMuoi : null],
      xtnSoLuong1: [
        this.thongTinMuoi ? this.thongTinMuoi.xtnMuoi[0].soLuong : null,
      ],
      xtnSoLuong2: [
        this.thongTinMuoi ? this.thongTinMuoi.xtnMuoi[1].soLuong : null,
      ],
      xtnSoLuong3: [
        this.thongTinMuoi ? this.thongTinMuoi.xtnMuoi[2].soLuong : null,
      ],
      tkcnTongSo: [this.thongTinMuoi ? this.thongTinMuoi.tkcnTongSoMuoi : null],
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
      tenDonVi: donVi.tenDvi,
      donViId: donVi.id,
    });
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({
        maDvi: donVi.maDvi,
        maVthhList: [this.globals.prop.MA_VTHH],
      })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          res?.data.forEach((tonKho) => {
            if (tonKho.maVthh == this.globals.prop.MA_VTHH) {
              switch (tonKho.nam) {
                case (this.yearNow - 1).toString():
                  this.formData.patchValue({
                    tkdnSoLuong1: tonKho.slHienThoi,
                  });
                  break;
                case (this.yearNow - 2).toString():
                  this.formData.patchValue({
                    tkdnSoLuong2: tonKho.slHienThoi,
                  });
                  break;
                case (this.yearNow - 3).toString():
                  this.formData.patchValue({
                    tkdnSoLuong3: tonKho.slHienThoi,
                  });
                  break;
                default:
                  break;
              }
            }
            this.calculatorTkdnTongMuoi();
            this.loadTonKhoCuoiNam();
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
  calculatorTkdnTongMuoi() {
    this.formData.patchValue({
      tkdnTongSo:
        +this.formData.get('tkdnSoLuong1').value +
        +this.formData.get('tkdnSoLuong2').value +
        +this.formData.get('tkdnSoLuong3').value,
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

  handleOk() {
    this._modalRef.close(this.formData);
  }

  handleCancel() {
    this._modalRef.destroy();
  }

  calculatorXtnTongSoMuoi() {
    this.formData.patchValue({
      xtnTongSo:
        +this.formData.get('xtnSoLuong1').value +
        +this.formData.get('xtnSoLuong2').value +
        +this.formData.get('xtnSoLuong3').value,
    });
    this.calculatorTonKhoCuoiNam();
  }
  calculatorTonKhoCuoiNam() {
    this.formData.patchValue({
      tkcnTongSo:
        +this.formData.get('tkdnTongSo').value +
        +this.formData.get('ntnTongSo').value -
        +this.formData.get('xtnTongSo').value,
    });
  }

  loadTonKhoCuoiNam() {
    this.formData.patchValue({
      tkcnTongSo: +this.formData.get('tkdnTongSo').value,
    });
  }
}
