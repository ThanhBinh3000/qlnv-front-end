import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-muoi',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-muoi.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-muoi.component.scss'],
})
export class DialogDieuChinhThemThongTinMuoiComponent implements OnInit {
  formData: FormGroup;
  constructor(private fb: FormBuilder, private _modalRef: NzModalRef) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      maDv: [null, [Validators.required]],
      donViTinh: [null],
      tenDonVi: [null],
      tongSoTonKho: [null],
      slMuoi1: [null],
      slMuoi2: [null],
      slMuoi3: [null],
      tongSoQuyThocNhapTrongNam: [null],
      slMuoiTruocDieuChinh: [null],
      slMuoiGiam: [null],
      slMuoiTang: [null],
      tongSoXuat: [null],
      xuatSLMuoiTruoc1: [null],
      xuatSLMuoiGiam1: [null],
      xuatSLMuoiTang1: [null],
      xuatSLMuoiTruoc2: [null],
      xuatSLMuoiGiam2: [null],
      xuatSLMuoiTang2: [null],
      xuatSLMuoiTruoc3: [null],
      xuatSLMuoiGiam3: [null],
      xuatSLMuoiTang3: [null],
      tongTruocCuoiNam: [null],
      tongSauCuoiNam: [null],
    });
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
