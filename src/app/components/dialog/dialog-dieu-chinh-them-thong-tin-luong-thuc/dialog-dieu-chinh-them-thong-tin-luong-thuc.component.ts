import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DonviService } from 'src/app/services/donvi.service';

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
  selectedDonVi: any = null;

  data: any = null;

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    this.spinner.show();
    try {
      await this.loadDonVi();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
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

  selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
    this.chiTieuKeHoachNamService
      .tonKhoDauNam({ maDvi: donVi.maDvi, maVthhList: ['010103', '010101'] })
      .then((res) => {
        res.data.forEach((tonKho) => {
          if (tonKho.maVthh == '010101') {
            switch (tonKho.nam) {
              case (this.yearNow - 1).toString():
                this.slThoc3 = 0;
                break;
              case (this.yearNow - 2).toString():
                this.slThoc2 = 0;
                break;
              case (this.yearNow - 3).toString():
                this.slThoc1 = 0;
                break;
              default:
                break;
            }
          } else if (tonKho.maVthh == '010103') {
            switch (tonKho.nam) {
              case (this.yearNow - 1).toString():
                this.slThoc1 = 0;
                break;
              case (this.yearNow - 2).toString():
                this.slThoc1 = 0;
                break;
              default:
                break;
            }
          }
        });
      });
  }

  caculatorData() {
    this.tongSoQuyThocTonKhoDauNam = this.slThoc1 + this.slThoc2 + this.slThoc3 + this.slGao2 * 2 + this.slGao3 * 2;

    this.tongSoQuyThocNhapTrongNam = this.slThocSauDieuChinh + this.slGaoSauDieuChinh;
  }

  caculatorThocDieuChinh() {
    this.slThocSauDieuChinh = this.slThocTruocDieuChinh + this.slThocTang - this.slThocGiam;
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
