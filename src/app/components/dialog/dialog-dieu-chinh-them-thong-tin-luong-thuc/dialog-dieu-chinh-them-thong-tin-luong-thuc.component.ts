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
  tongSoQuyThocTonKhoDauNam: number = null;
  slThoc1: number = null;
  slThoc2: number = null;
  slThoc3: number = null;
  slGao1: number = null;
  slGao2: number = null;
  slGao3: number = null;
  tongSoQuyThocNhapTrongNam: number = null;
  slThocTruocDieuChinh: number = null;
  slThocGiam: number = null;
  slThocTang: number = null;
  slThocSauDieuChinh: number = null;
  slGaoTruocDieuChinh: number = null;
  slGaoGiam: number = null;
  slGaoTang: number = null;
  slGaoSauDieuChinh: number = null;
  tongSoQuyThocXuatTrongNam: number = null;
  xuatTongSLThoc: number = null;
  xuatSlThocTruocDieuChinh1: number = null;
  xuatSlThocGiam1: number = null;
  xuatSlThocTang1: number = null;
  xuatSlThocSauDieuChinh1: number = null;
  xuatSlThocTruocDieuChinh2: number = null;
  xuatSlThocGiam2: number = null;
  xuatSlThocTang2: number = null;
  xuatSlThocSauDieuChinh2: number = null;
  xuatSlThocTruocDieuChinh3: number = null;
  xuatSlThocGiam3: number = null;
  xuatSlThocTang3: number = null;
  xuatSlThocSauDieuChinh3: number = null;
  xuatSlGaoTruocDieuChinh1: number = null;
  xuatTongSLGao: number = null;
  xuatSlGaoGiam1: number = null;
  xuatSlGaoTang1: number = null;
  xuatSlGaoSauDieuChinh1: number = null;
  xuatSlGaoTruocDieuChinh2: number = null;
  xuatSlGaoGiam2: number = null;
  xuatSlGaoTang2: number = null;
  xuatSlGaoSauDieuChinh2: number = null;
  xuatSlGaoTruocDieuChinh3: number = null;
  xuatSlGaoGiam3: number = null;
  xuatSlGaoTang3: number = null;
  xuatSlGaoSauDieuChinh3: number = null;
  tongSoQuyThocTruocTonKhoCuoiNam: number = null;
  slThocTruocTonKho: number = null;
  slGaoTruocTonKho: number = null;
  tongSoQuyThocSauTonKhoCuoiNam: number = null;
  slThocSauTonKho: number = null;
  slGaoSauTonKho: number = null;

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];

  data: any = null;

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
      donViTinh: ["Tấn"],
    });
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

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
