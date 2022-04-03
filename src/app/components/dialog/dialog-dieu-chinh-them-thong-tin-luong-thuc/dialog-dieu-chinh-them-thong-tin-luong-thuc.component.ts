import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-luong-thuc',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-luong-thuc.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-luong-thuc.component.scss'],
})
export class DialogDieuChinhThemThongTinLuongThucComponent implements OnInit {
  yearNow: number = 0;
  tongSoQuyThocTonKhoDauNam: number = 0;
  slThoc1: number = 0;
  slThoc2: number = 0;
  slThoc3: number = 0;
  slGao1: number = 0;
  slGao2: number = 0;
  slGao3: number = 0;
  tongSoQuyThocNhapTrongNam: number = 0;
  slThocTruocDieuChinh: number = 0;
  slThocGiam: number = 0;
  slThocTang: number = 0;
  slThocSauDieuChinh: number = 0;
  slGaoTruocDieuChinh: number = 0;
  slGaoGiam: number = 0;
  slGaoTang: number = 0;
  slGaoSauDieuChinh: number = 0;
  tongSoQuyThocXuatTrongNam: number = 0;
  xuatTongSLThoc: number = 0;
  xuatSlThocTruocDieuChinh1: number = 0;
  xuatSlThocGiam1: number = 0;
  xuatSlThocTang1: number = 0;
  xuatSlThocSauDieuChinh1: number = 0;
  xuatSlThocTruocDieuChinh2: number = 0;
  xuatSlThocGiam2: number = 0;
  xuatSlThocTang2: number = 0;
  xuatSlThocSauDieuChinh2: number = 0;
  xuatSlThocTruocDieuChinh3: number = 0;
  xuatSlThocGiam3: number = 0;
  xuatSlThocTang3: number = 0;
  xuatSlThocSauDieuChinh3: number = 0;
  xuatSlGaoTruocDieuChinh1: number = 0;
  xuatTongSLGao: number = 0;
  xuatSlGaoGiam1: number = 0;
  xuatSlGaoTang1: number = 0;
  xuatSlGaoSauDieuChinh1: number = 0;
  xuatSlGaoTruocDieuChinh2: number = 0;
  xuatSlGaoGiam2: number = 0;
  xuatSlGaoTang2: number = 0;
  xuatSlGaoSauDieuChinh2: number = 0;
  xuatSlGaoTruocDieuChinh3: number = 0;
  xuatSlGaoGiam3: number = 0;
  xuatSlGaoTang3: number = 0;
  xuatSlGaoSauDieuChinh3: number = 0;
  tongSoQuyThocTruocTonKhoCuoiNam: number = 0;
  slThocTruocTonKho: number = 0;
  slGaoTruocTonKho: number = 0;
  tongSoQuyThocSauTonKhoCuoiNam: number = 0;
  slThocSauTonKho: number = 0;
  slGaoSauTonKho: number = 0;
  donViTinh: string = 'Tấn';

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};
  errorDonVi: boolean = false;

  thocIdDefault: number = 2;
  gaoIdDefault: number = 6;
  muoiIdDefault: number = 78;

  data: any = null;
  qdGocId: number = 0;

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

      this.data.tkdnThoc.forEach(element => {
        switch (element.nam) {
          case (this.yearNow - 1):
            this.slThoc3 = element.soLuong;
            break;
          case (this.yearNow - 2):
            this.slThoc2 = element.soLuong;
            break;
          case (this.yearNow - 3):
            this.slThoc1 = element.soLuong;
            break;
          default:
            break;
        }
      });

      this.data.tkdnGao.forEach(element => {
        switch (element.nam) {
          case (this.yearNow - 1):
            this.slGao3 = element.soLuong;
            break;
          case (this.yearNow - 2):
            this.slGao2 = element.soLuong;
            break;
          case (this.yearNow - 3):
            this.slGao1 = element.soLuong;
            break;
          default:
            break;
        }
      });

      this.data.xtnThoc.forEach(element => {
        switch (element.nam) {
          case (this.yearNow - 1):
            if (this.xuatSlThocTruocDieuChinh3 - element.soLuong > 0) {
              this.xuatSlThocGiam3 = this.xuatSlThocTruocDieuChinh3 - element.soLuong;
            }
            else {
              this.xuatSlThocTang3 = element.soLuong - this.xuatSlThocTruocDieuChinh3;
            }
            break;
          case (this.yearNow - 2):
            if (this.xuatSlThocTruocDieuChinh2 - element.soLuong > 0) {
              this.xuatSlThocGiam2 = this.xuatSlThocTruocDieuChinh2 - element.soLuong;
            }
            else {
              this.xuatSlThocTang2 = element.soLuong - this.xuatSlThocTruocDieuChinh2;
            }
            break;
          case (this.yearNow - 3):
            if (this.xuatSlThocTruocDieuChinh1 - element.soLuong > 0) {
              this.xuatSlThocGiam1 = this.xuatSlThocTruocDieuChinh1 - element.soLuong;
            }
            else {
              this.xuatSlThocTang1 = element.soLuong - this.xuatSlThocTruocDieuChinh1;
            }
            break;
          default:
            break;
        }
      });

      this.data.xtnGao.forEach(element => {
        switch (element.nam) {
          case (this.yearNow - 1):
            if (this.xuatSlGaoTruocDieuChinh3 - element.soLuong > 0) {
              this.xuatSlGaoGiam3 = this.xuatSlGaoTruocDieuChinh3 - element.soLuong;
            }
            else {
              this.xuatSlGaoTang3 = element.soLuong - this.xuatSlGaoTruocDieuChinh3;
            }
            break;
          case (this.yearNow - 2):
            if (this.xuatSlGaoTruocDieuChinh2 - element.soLuong > 0) {
              this.xuatSlGaoGiam2 = this.xuatSlGaoTruocDieuChinh2 - element.soLuong;
            }
            else {
              this.xuatSlGaoTang2 = element.soLuong - this.xuatSlGaoTruocDieuChinh2;
            }
            break;
          case (this.yearNow - 3):
            if (this.xuatSlGaoTruocDieuChinh1 - element.soLuong > 0) {
              this.xuatSlGaoGiam1 = this.xuatSlGaoTruocDieuChinh1 - element.soLuong;
            }
            else {
              this.xuatSlGaoTang1 = element.soLuong - this.xuatSlGaoTruocDieuChinh1;
            }
            break;
          default:
            break;
        }
      });

      if (this.data.ntnThoc && this.data.ntnThoc - this.slThocTruocDieuChinh > 0) {
        this.slThocTang = this.data.ntnThoc - this.slThocTruocDieuChinh;
      }
      else {
        this.slThocGiam = this.slThocTruocDieuChinh - this.data.ntnThoc;
      }

      if (this.data.ntnGao && this.data.ntnGao - this.slGaoTruocDieuChinh > 0) {
        this.slGaoTang = this.data.ntnGao - this.slGaoTruocDieuChinh;
      }
      else {
        this.slGaoGiam = this.slGaoTruocDieuChinh - this.data.ntnGao;
      }

      this.caculatorXuatThocSdc1();
      this.caculatorXuatThocSdc2();
      this.caculatorXuatThocSdc3();
      this.caculatorXuatGaoSdc2();
      this.caculatorXuatGaoSdc3();
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
        "vatTuIds": [this.thocIdDefault, this.gaoIdDefault]
      }
      let data = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.soLuongTruocDieuChinh(body);
      if (data && data.msg == MESSAGE.SUCCESS) {
        if (data.data && data.data.tonKhoDauNam && data.data.tonKhoDauNam.length > 0) {
          data.data.tonKhoDauNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.thocIdDefault) {
              switch (tonKho.nam) {
                case (this.yearNow - 1):
                  this.slThoc3 = tonKho.soLuong;
                  break;
                case (this.yearNow - 2):
                  this.slThoc2 = tonKho.soLuong;
                  break;
                case (this.yearNow - 3):
                  this.slThoc1 = tonKho.soLuong;
                  break;
                default:
                  break;
              }
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              switch (tonKho.nam) {
                case (this.yearNow - 1):
                  this.slThoc1 = tonKho.soLuong;
                  break;
                case (this.yearNow - 2):
                  this.slThoc1 = tonKho.soLuong;
                  break;
                default:
                  break;
              }
            }
          });
        }
        if (data.data && data.data.nhapTrongNam && data.data.nhapTrongNam.length > 0) {
          data.data.nhapTrongNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.thocIdDefault) {
              this.slThocTruocDieuChinh = tonKho.soLuong;
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              this.slGaoTruocDieuChinh = tonKho.soLuong;
            }
          });
        }
        if (data.data && data.data.xuatTrongNam && data.data.xuatTrongNam.length > 0) {
          data.data.xuatTrongNam.forEach((tonKho) => {
            if (tonKho.vatTuId == this.thocIdDefault) {
              switch (tonKho.nam) {
                case (this.yearNow - 1):
                  this.xuatSlThocTruocDieuChinh3 = tonKho.soLuong;
                  this.caculatorXuatThocSdc3();
                  break;
                case (this.yearNow - 2):
                  this.xuatSlThocTruocDieuChinh2 = tonKho.soLuong;
                  this.caculatorXuatThocSdc2();
                  break;
                case (this.yearNow - 3):
                  this.xuatSlThocTruocDieuChinh1 = tonKho.soLuong;
                  this.caculatorXuatThocSdc1();
                  break;
                default:
                  break;
              }
            } else if (tonKho.vatTuId == this.gaoIdDefault) {
              switch (tonKho.nam) {
                case (this.yearNow - 1):
                  this.xuatSlGaoTruocDieuChinh3 = tonKho.soLuong;
                  this.caculatorXuatGaoSdc3();
                  break;
                case (this.yearNow - 2):
                  this.xuatSlGaoTruocDieuChinh2 = tonKho.soLuong;
                  this.caculatorXuatGaoSdc2();
                  break;
                default:
                  break;
              }
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
    if (!this.selectedDonVi || !this.selectedDonVi.maDvi) {
      this.errorDonVi = true;
      return;
    }

    if (!this.data) {
      this.data = new KeHoachLuongThuc();
    }

    this.data.tenDonvi = this.selectedDonVi.tenDvi;
    this.data.maDonVi = this.selectedDonVi.maDvi;
    this.data.donViId = this.selectedDonVi.donViId ?? this.selectedDonVi.id;
    this.data.khGaoId = this.data ? this.data.khGaoId : null;
    this.data.khThocId = this.data ? this.data.khThocId : null;
    this.data.donViTinh = "Tấn";

    //ton kho dau nam
    this.data.tkdnTongThoc =
      (this.slThoc1 ?? 0) +
      (this.slThoc2 ?? 0) +
      (this.slThoc3 ?? 0);

    const tkdnThoc1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: (this.slThoc3 ?? 0),
      vatTuId: null,
    };
    const tkdnThoc2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: (this.slThoc2 ?? 0),
      vatTuId: null,
    };
    const tkdnThoc3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: (this.slThoc1 ?? 0),
      vatTuId: null,
    };
    this.data.tkdnThoc = [
      tkdnThoc1,
      tkdnThoc2,
      tkdnThoc3,
    ];

    this.data.tkdnTongGao = (this.slGao2 ?? 0) + (this.slGao3 ?? 0);

    const tkdnGao1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: (this.slGao2 ?? 0),
      vatTuId: null,
    };
    const tkdnGao2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: (this.slGao3 ?? 0),
      vatTuId: null,
    };
    this.data.tkdnGao = [tkdnGao1, tkdnGao2];

    this.data.tkdnTongSoQuyThoc = this.data.tkdnTongThoc + this.data.tkdnTongGao * 2;

    //nhap trong nam
    this.data.ntnThoc = (this.slThocTruocDieuChinh ?? 0) + (this.slThocTang ?? 0) - (this.slThocGiam ?? 0);
    this.data.ntnGao = (this.slGaoTruocDieuChinh ?? 0) + (this.slGaoTang ?? 0) - (this.slGaoGiam ?? 0);
    this.data.ntnTongSoQuyThoc = this.data.ntnThoc + this.data.ntnGao * 2;

    //xuat trong nam
    this.data.xtnTongThoc = (this.xuatSlThocSauDieuChinh1 ?? 0) + (this.xuatSlThocSauDieuChinh2 ?? 0) + (this.xuatSlThocSauDieuChinh3 ?? 0);

    const xtnThoc1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: (this.xuatSlThocSauDieuChinh3 ?? 0),
      vatTuId: null,
    };
    const xtnThoc2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: (this.xuatSlThocSauDieuChinh2 ?? 0),
      vatTuId: null,
    };
    const xtnThoc3 = {
      id: null,
      nam: this.yearNow - 3,
      soLuong: (this.xuatSlThocSauDieuChinh1 ?? 0),
      vatTuId: null,
    };
    this.data.xtnThoc = [xtnThoc1, xtnThoc2, xtnThoc3];

    this.data.xtnTongGao = (this.xuatSlGaoSauDieuChinh2 ?? 0) + (this.xuatSlGaoSauDieuChinh3 ?? 0);
    const xtnGao1 = {
      id: null,
      nam: this.yearNow - 1,
      soLuong: (this.xuatSlGaoSauDieuChinh3 ?? 0),
      vatTuId: null,
    };
    const xtnGao2 = {
      id: null,
      nam: this.yearNow - 2,
      soLuong: (this.xuatSlGaoSauDieuChinh2 ?? 0),
      vatTuId: null,
    };
    this.data.xtnGao = [xtnGao1, xtnGao2];

    this.data.xtnTongSoQuyThoc = this.data.xtnTongThoc + this.data.xtnTongGao * 2;

    //ton kho cuoi nam
    this.data.tkcnTongSoQuyThoc = this.data.tkdnTongSoQuyThoc + this.data.ntnTongSoQuyThoc - this.data.xtnTongSoQuyThoc;

    this.data.tkcnTongThoc = this.data.tkcnTongSoQuyThoc / 3;

    this.data.tkcnTongGao = this.data.tkcnTongThoc * 2;

    this.data.stt = 1;

    this._modalRef.close(this.data);
  }

  caculatorXuatThocSdc1() {
    this.xuatSlThocSauDieuChinh1 = (this.xuatSlThocTruocDieuChinh1 ?? 0) + (this.xuatSlThocTang1 ?? 0) - (this.xuatSlThocGiam1 ?? 0);
  }

  caculatorXuatThocSdc2() {
    this.xuatSlThocSauDieuChinh2 = (this.xuatSlThocTruocDieuChinh2 ?? 0) + (this.xuatSlThocTang2 ?? 0) - (this.xuatSlThocGiam2 ?? 0);
  }

  caculatorXuatThocSdc3() {
    this.xuatSlThocSauDieuChinh3 = (this.xuatSlThocTruocDieuChinh3 ?? 0) + (this.xuatSlThocTang3 ?? 0) - (this.xuatSlThocGiam3 ?? 0);
  }

  caculatorXuatGaoSdc2() {
    this.xuatSlGaoSauDieuChinh2 = (this.xuatSlGaoTruocDieuChinh2 ?? 0) + (this.xuatSlGaoTang2 ?? 0) - (this.xuatSlGaoGiam2 ?? 0);
  }

  caculatorXuatGaoSdc3() {
    this.xuatSlGaoSauDieuChinh3 = (this.xuatSlGaoTruocDieuChinh3 ?? 0) + (this.xuatSlGaoTang3 ?? 0) - (this.xuatSlGaoGiam3 ?? 0);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
