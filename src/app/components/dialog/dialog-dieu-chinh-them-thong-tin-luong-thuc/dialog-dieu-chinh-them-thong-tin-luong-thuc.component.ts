import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { KeHoachLuongThuc } from 'src/app/models/KeHoachLuongThuc';
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

  loadChiTiet() {

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
                this.slThoc3 = 10;
                this.caculatorXuatThocSdc3();
                this.caculatorXuatGaoSdc3();
                break;
              case (this.yearNow - 2).toString():
                this.slThoc2 = 10;
                this.xuatSlThocTruocDieuChinh2 = 5;
                this.caculatorXuatThocSdc2();
                this.caculatorXuatGaoSdc2();
                break;
              case (this.yearNow - 3).toString():
                this.slThoc1 = 10;
                this.xuatSlThocTruocDieuChinh1 = 5;
                this.caculatorXuatThocSdc1();
                break;
              default:
                break;
            }
          } else if (tonKho.maVthh == '010103') {
            switch (tonKho.nam) {
              case (this.yearNow - 1).toString():
                this.slThoc1 = 10;
                break;
              case (this.yearNow - 2).toString():
                this.slThoc1 = 10;
                break;
              default:
                break;
            }
          }
        });
      });
  }

  handleOk() {
    let data: KeHoachLuongThuc = new KeHoachLuongThuc();

    this._modalRef.close(data);
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
