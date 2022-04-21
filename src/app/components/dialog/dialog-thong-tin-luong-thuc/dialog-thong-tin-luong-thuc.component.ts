import { ChiTieuKeHoachNamCapTongCucService } from './../../../services/chiTieuKeHoachNamCapTongCuc.service';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
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
  keHoachLuongThuc: KeHoachLuongThuc = new KeHoachLuongThuc();
  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
  ) {}
  async ngOnInit() {
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
      donViId: [this.keHoachLuongThuc ? this.keHoachLuongThuc.donViId : null],
      khGaoId: [this.keHoachLuongThuc ? this.keHoachLuongThuc.khGaoId : null],
      khThocId: [this.keHoachLuongThuc ? this.keHoachLuongThuc.khThocId : null],
      maDonVi: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.maDonVi : null,
        [Validators.required],
      ],
      donViTinh: ['Tấn'],
      tenDonvi: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tenDonvi : null,
        [Validators.required],
      ],
      tkdnTongSoQuyThoc: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tkdnTongSoQuyThoc : null,
      ],
      tkdnThocSoLuong1: [
        this.keHoachLuongThuc
          ? this.keHoachLuongThuc.tkdnThoc[0].soLuong
          : null,
      ],
      tkdnThocSoLuong2: [
        this.keHoachLuongThuc
          ? this.keHoachLuongThuc.tkdnThoc[1].soLuong
          : null,
      ],
      tkdnThocSoLuong3: [
        this.keHoachLuongThuc
          ? this.keHoachLuongThuc.tkdnThoc[2].soLuong
          : null,
      ],
      tkdnGaoSoLuong1: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tkdnGao[0].soLuong : null,
      ],
      tkdnGaoSoLuong2: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tkdnGao[1].soLuong : null,
      ],
      ntnTongSoQuyThoc: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.ntnTongSoQuyThoc : null,
      ],
      ntnThoc: [this.keHoachLuongThuc ? this.keHoachLuongThuc.ntnThoc : null],
      ntnGao: [this.keHoachLuongThuc ? this.keHoachLuongThuc.ntnGao : null],
      xtnTongSoQuyThoc: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.xtnTongSoQuyThoc : null,
      ],
      xtnThocSoLuong1: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.xtnThoc[0].soLuong : null,
      ],
      xtnThocSoLuong2: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.xtnThoc[1].soLuong : null,
      ],
      xtnThocSoLuong3: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.xtnThoc[2].soLuong : null,
      ],
      xtnGaoSoLuong1: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.xtnGao[0].soLuong : null,
      ],
      xtnGaoSoLuong2: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.xtnGao[1].soLuong : null,
      ],
      tkcnTongSoQuyThoc: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tkcnTongSoQuyThoc : null,
      ],
      tkcnTongThoc: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tkcnTongThoc : null,
      ],
      tkcnTongGao: [
        this.keHoachLuongThuc ? this.keHoachLuongThuc.tkcnTongGao : null,
      ],
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
      donViId: donVi.id,
    });
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({ maDvi: donVi.maDvi, maVthhList: ['010103', '010101'] })
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          res.data.forEach((tonKho) => {
            if (tonKho.maVthh == '010101') {
              switch (tonKho.nam) {
                case (this.yearNow - 1).toString():
                  this.formData.patchValue({
                    tkdnThocSoLuong1: tonKho.slHienThoi,
                  });
                  break;
                case (this.yearNow - 2).toString():
                  this.formData.patchValue({
                    tkdnThocSoLuong2: tonKho.slHienThoi,
                  });
                  break;
                case (this.yearNow - 3).toString():
                  this.formData.patchValue({
                    tkdnThocSoLuong3: tonKho.slHienThoi,
                  });
                  break;
                default:
                  break;
              }
            } else if (tonKho.maVthh == '010103') {
              switch (tonKho.nam) {
                case (this.yearNow - 1).toString():
                  this.formData.patchValue({
                    tkdnGaoSoLuong1: tonKho.slHienThoi,
                  });
                  break;
                case (this.yearNow - 2).toString():
                  this.formData.patchValue({
                    tkdnGaoSoLuong2: tonKho.slHienThoi,
                  });
                  break;
                default:
                  break;
              }
            }
            this.calculatorTkdnTongQuyThoc();
            this.loadTonKhoCuoiNam();
          });
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
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
    this.calculatorTonKhoCuoiNam();
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
    this.calculatorTonKhoCuoiNam();
  }
  loadTonKhoDauNam() {
    this.formData.patchValue({
      tkdnTongSoQuyThoc: 0,
      tkdnThocSoLuong1: 0,
      tkdnThocSoLuong2: 0,
      tkdnThocSoLuong3: 0,
      tkdnGaoSoLuong1: 0,
      tkdnGaoSoLuong2: 0,
      tkcnTongSoQuyThoc:
        +this.formData.get('tkdnTongSoQuyThoc').value +
        +this.formData.get('ntnTongSoQuyThoc').value -
        +this.formData.get('xtnTongSoQuyThoc').value,
      tkcnTongThoc:
        +this.formData.get('tkdnThocSoLuong1').value +
        +this.formData.get('tkdnThocSoLuong2').value +
        +this.formData.get('tkdnThocSoLuong3').value,
      tkcnTongGao:
        +this.formData.get('tkdnGaoSoLuong1').value +
        +this.formData.get('tkdnGaoSoLuong2').value,
    });
  }
  loadTonKhoCuoiNam() {
    this.formData.patchValue({
      tkcnTongThoc:
        +this.formData.get('tkdnThocSoLuong1').value +
        +this.formData.get('tkdnThocSoLuong2').value +
        +this.formData.get('tkdnThocSoLuong3').value,
      tkcnTongGao:
        +this.formData.get('tkdnGaoSoLuong1').value +
        +this.formData.get('tkdnGaoSoLuong2').value,
      tkcnTongSoQuyThoc:
        +this.formData.get('tkcnTongThoc').value +
        +this.formData.get('tkcnTongGao').value * 2,
    });
    this.formData.patchValue({
      tkcnTongSoQuyThoc:
        +this.formData.get('tkcnTongThoc').value +
        +this.formData.get('tkcnTongGao').value * 2,
    });
  }

  calculatorTonKhoCuoiNam() {
    this.formData.patchValue({
      tkcnTongThoc:
        +this.formData.get('tkdnThocSoLuong1').value +
        +this.formData.get('tkdnThocSoLuong2').value +
        +this.formData.get('tkdnThocSoLuong3').value +
        this.formData.get('ntnThoc').value -
        (+this.formData.get('xtnThocSoLuong1').value +
          +this.formData.get('xtnThocSoLuong2').value +
          +this.formData.get('xtnThocSoLuong3').value),
      tkcnTongGao:
        +this.formData.get('tkdnGaoSoLuong1').value +
        +this.formData.get('tkdnGaoSoLuong2').value +
        this.formData.get('ntnGao').value -
        (+this.formData.get('xtnGaoSoLuong1').value +
          +this.formData.get('xtnGaoSoLuong2').value),
    });
    this.formData.patchValue({
      tkcnTongSoQuyThoc:
        +this.formData.get('tkcnTongThoc').value +
        +this.formData.get('tkcnTongGao').value * 2,
    });
  }
}
