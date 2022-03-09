import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-luong-thuc',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-luong-thuc.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-luong-thuc.component.scss'],
})
export class DialogDieuChinhThemThongTinLuongThucComponent implements OnInit {
  formData: FormGroup;
  constructor(private fb: FormBuilder, private _modalRef: NzModalRef) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      maDv: [null, [Validators.required]],
      donViTinh: [null],
      tenDonVi: [null],
      tongSoQuyThocTonKhoDauNam: [null],
      slThoc1: [null],
      slThoc2: [null],
      slThoc3: [null],
      slGao1: [null],
      slGao2: [null],
      slGao3: [null],
      tongSoQuyThocNhapTrongNam: [null],
      slThocTruocDieuChinh: [null],
      slThocGiam: [null],
      slThocTang: [null],
      slThocSauDieuChinh: [null],
      slGaoTruocDieuChinh: [null],
      slGaoGiam: [null],
      slGaoTang: [null],
      slGaoSauDieuChinh: [null],
      tongSoQuyThocXuatTrongNam: [null],
      xuatTongSLThoc: [null],
      xuatSlThocTruocDieuChinh1: [null],
      xuatSlThocGiam1: [null],
      xuatSlThocTang1: [null],
      xuatSlThocSauDieuChinh1: [null],
      xuatSlThocTruocDieuChinh2: [null],
      xuatSlThocGiam2: [null],
      xuatSlThocTang2: [null],
      xuatSlThocSauDieuChinh2: [null],
      xuatSlThocTruocDieuChinh3: [null],
      xuatSlThocGiam3: [null],
      xuatSlThocTang3: [null],
      xuatSlThocSauDieuChinh3: [null],
      xuatSlGaoTruocDieuChinh1: [null],
      xuatTongSLGao: [null],
      xuatSlGaoGiam1: [null],
      xuatSlGaoTang1: [null],
      xuatSlGaoSauDieuChinh1: [null],
      xuatSlGaoTruocDieuChinh2: [null],
      xuatSlGaoGiam2: [null],
      xuatSlGaoTang2: [null],
      xuatSlGaoSauDieuChinh2: [null],
      xuatSlGaoTruocDieuChinh3: [null],
      xuatSlGaoGiam3: [null],
      xuatSlGaoTang3: [null],
      xuatSlGaoSauDieuChinh3: [null],
      tongSoQuyThocTruocTonKhoCuoiNam: [null],
      slThocTruocTonKho: [null],
      slGaoTruocTonKho: [null],
      tongSoQuyThocSauTonKhoCuoiNam: [null],
      slThocSauTonKho: [null],
      slGaoSauTonKho: [null],
    });
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
