import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thong-tin-muoi',
  templateUrl: './thong-tin-muoi.component.html',
  styleUrls: ['./thong-tin-muoi.component.scss'],
})
export class ThongTinMuoiComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  formData: FormGroup;
  constructor(private fb: FormBuilder) { }

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
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }
}
