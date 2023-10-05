import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { KeHoachMuoi } from 'src/app/models/KeHoachMuoi';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-muoi',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-muoi.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-muoi.component.scss'],
})
export class DialogDieuChinhThemThongTinMuoiComponent implements OnInit {
  formData: FormGroup;
  yearNow: number = 0;

  maDv: string = "";
  donViTinh: string = "Tấn";
  tenDonVi: number = 0;
  tongSoTonKho: number = 0;
  slMuoi1: number = 0;
  slMuoi2: number = 0;
  slMuoi3: number = 0;
  tongSoQuyThocNhapTrongNam: number = 0;
  slMuoiTruocDieuChinh: number = 0;
  slMuoiGiam: number = 0;
  slMuoiTang: number = 0;
  tongSoXuat: number = 0;
  xuatSLMuoiTruoc1: number = 0;
  xuatSLMuoiGiam1: number = 0;
  xuatSLMuoiTang1: number = 0;
  xuatSLMuoiTruoc2: number = 0;
  xuatSLMuoiGiam2: number = 0;
  xuatSLMuoiTang2: number = 0;
  xuatSLMuoiTruoc3: number = 0;
  xuatSLMuoiGiam3: number = 0;
  xuatSLMuoiTang3: number = 0;
  tongTruocCuoiNam: number = 0;
  tongSauCuoiNam: number = 0;

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};
  errorDonVi: boolean = false;

  data: any = null;
  qdGocId: number = 0;

  thocIdDefault: number = 2;
  gaoIdDefault: number = 6;
  muoiIdDefault: number = 78;

  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.loadDonVi(),
        this.loadChiTiet(),
      ]);
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet() {
    this.isEdit = false;
    if (this.data) {
      this.isEdit = true;
      this.selectedDonVi.tenDvi = this.data.tenDonvi ?? this.data.tenDonVi;
      this.selectedDonVi.maDvi = this.data.maDonVi;
      this.selectedDonVi.donViId = this.data.donViId;
      this.inputDonVi = this.data.tenDonvi ?? this.data.tenDonVi;
      await this.getSoLuongTruocDieuChinh(this.selectedDonVi.donViId);

      this.data.tkdnMuoi.forEach(element => {
        switch (element.nam) {
          case (this.yearNow - 1):
            this.slMuoi3 = element.soLuong;
            break;
          case (this.yearNow - 2):
            this.slMuoi2 = element.soLuong;
            break;
          case (this.yearNow - 3):
            this.slMuoi1 = element.soLuong;
            break;
          default:
            break;
        }
      });

      this.data.xtnMuoi.forEach(element => {
        switch (element.nam) {
          case (this.yearNow - 1):
            if (this.xuatSLMuoiTruoc3 - element.soLuong > 0) {
              this.xuatSLMuoiGiam3 = this.xuatSLMuoiTruoc3 - element.soLuong;
            }
            else {
              this.xuatSLMuoiTang3 = element.soLuong - this.xuatSLMuoiTruoc3;
            }
            break;
          case (this.yearNow - 2):
            if (this.xuatSLMuoiTruoc2 - element.soLuong > 0) {
              this.xuatSLMuoiGiam2 = this.xuatSLMuoiTruoc2 - element.soLuong;
            }
            else {
              this.xuatSLMuoiTang2 = element.soLuong - this.xuatSLMuoiTruoc2;
            }
            break;
          case (this.yearNow - 3):
            if (this.xuatSLMuoiTruoc1 - element.soLuong > 0) {
              this.xuatSLMuoiGiam1 = this.xuatSLMuoiTruoc1 - element.soLuong;
            }
            else {
              this.xuatSLMuoiTang1 = element.soLuong - this.xuatSLMuoiTruoc1;
            }
            break;
          default:
            break;
        }
      });

      if (this.data.ntnTongSoMuoi && this.data.ntnTongSoMuoi - this.slMuoiTruocDieuChinh > 0) {
        this.slMuoiTang = this.data.ntnTongSoMuoi - this.slMuoiTruocDieuChinh;
      }
      else {
        this.slMuoiGiam = this.slMuoiTruocDieuChinh - this.data.ntnTongSoMuoi;
      }
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

  async selectDonVi(donVi) {
    this.errorDonVi = false;
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
    await this.getSoLuongTruocDieuChinh(this.selectedDonVi.id);
  }

  async getSoLuongTruocDieuChinh(donviId: number) {
    this.spinner.show();
    try {
      let body = {
        "donViId": donviId,
        "ctkhnId": this.qdGocId,
        "vatTuIds": [this.muoiIdDefault]
      }
      let data = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.soLuongTruocDieuChinh(body);
      if (data && data.msg == MESSAGE.SUCCESS) {
        if (data.data && data.data.tonKhoDauNam && data.data.tonKhoDauNam.length > 0) {
          data.data.tonKhoDauNam.forEach((tonKho) => {
            switch (tonKho.nam) {
              case (this.yearNow - 1):
                this.slMuoi3 = tonKho.soLuong;
                break;
              case (this.yearNow - 2):
                this.slMuoi2 = tonKho.soLuong;
                break;
              case (this.yearNow - 3):
                this.slMuoi1 = tonKho.soLuong;
                break;
              default:
                break;
            }
          });
        }
        if (data.data && data.data.nhapTrongNam && data.data.nhapTrongNam.length > 0) {
          data.data.nhapTrongNam.forEach((tonKho) => {
            this.slMuoiTruocDieuChinh = tonKho.soLuong;
          });
        }
        if (data.data && data.data.xuatTrongNam && data.data.xuatTrongNam.length > 0) {
          data.data.xuatTrongNam.forEach((tonKho) => {
            switch (tonKho.nam) {
              case (this.yearNow - 1):
                this.xuatSLMuoiTruoc3 = tonKho.soLuong;
                break;
              case (this.yearNow - 2):
                this.xuatSLMuoiTruoc2 = tonKho.soLuong;
                break;
              case (this.yearNow - 3):
                this.xuatSLMuoiTruoc1 = tonKho.soLuong;
                break;
              default:
                break;
            }
          });
        }
      }
      else {
        this.notification.error(MESSAGE.ERROR, data.msg);
      }
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  handleOk() {
    this.errorDonVi = false;
    if (!this.selectedDonVi || !this.selectedDonVi.maDvi) {
      this.errorDonVi = true;
      return;
    }

    if (!this.data) {
      this.data = new KeHoachMuoi();
    }

    this.data.tenDonVi = this.selectedDonVi.tenDvi;
    this.data.maDonVi = this.selectedDonVi.maDvi;
    this.data.donViId = this.selectedDonVi.donViId ?? this.selectedDonVi.id;
    this.data.khGaoId = this.data ? this.data.khGaoId : null;
    this.data.khThocId = this.data ? this.data.khThocId : null;
    this.data.donViTinh = "Tấn";

    //ton kho dau nam
    const tkdnMuoi1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: (this.slMuoi3 ?? 0),
      vatTuId: null,
    };
    const tkdnMuoi2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: (this.slMuoi2 ?? 0),
      vatTuId: null,
    };
    const tkdnMuoi3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: (this.slMuoi1 ?? 0),
      vatTuId: null,
    };
    this.data.tkdnMuoi = [tkdnMuoi1, tkdnMuoi2, tkdnMuoi3];
    this.data.tkdnTongSoMuoi = (this.slMuoi3 ?? 0) + (this.slMuoi2 ?? 0) + (this.slMuoi1 ?? 0);

    //nhap trong nam
    this.data.nhapTrongNam = (this.slMuoiTruocDieuChinh ?? 0) + (this.slMuoiTang ?? 0) - (this.slMuoiGiam ?? 0);
    this.data.ntnTongSoMuoi = this.data.nhapTrongNam;

    //xuat trong nam
    const xtnMuoi1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: (this.xuatSLMuoiTruoc3 ?? 0) + (this.xuatSLMuoiTang3 ?? 0) - (this.xuatSLMuoiGiam3 ?? 0),
      vatTuId: null,
    };
    const xtnMuoi2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: (this.xuatSLMuoiTruoc2 ?? 0) + (this.xuatSLMuoiTang2 ?? 0) - (this.xuatSLMuoiGiam2 ?? 0),
      vatTuId: null,
    };
    const xtnMuoi3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: (this.xuatSLMuoiTruoc1 ?? 0) + (this.xuatSLMuoiTang1 ?? 0) - (this.xuatSLMuoiGiam1 ?? 0),
      vatTuId: null,
    };
    this.data.xuatTrongNam = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
    this.data.xtnMuoi = [xtnMuoi1, xtnMuoi2, xtnMuoi3];
    this.data.xtnTongSoMuoi = (this.xuatSLMuoiTruoc1 ?? 0) + (this.xuatSLMuoiTang1 ?? 0) - (this.xuatSLMuoiGiam1 ?? 0) + (this.xuatSLMuoiTruoc2 ?? 0) + (this.xuatSLMuoiTang2 ?? 0) - (this.xuatSLMuoiGiam2 ?? 0) + (this.xuatSLMuoiTruoc3 ?? 0) + (this.xuatSLMuoiTang3 ?? 0) - (this.xuatSLMuoiGiam3 ?? 0);

    //ton kho cuoi nam
    this.data.tkcnTongSoMuoi = this.data.tkdnTongSoMuoi + this.data.ntnTongSoMuoi - this.data.xtnTongSoMuoi;
    this._modalRef.close(this.data);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
