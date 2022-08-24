import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thong-tin-luong-thuc',
  templateUrl: './thong-tin-luong-thuc.component.html',
  styleUrls: ['./thong-tin-luong-thuc.component.scss'],
})
export class ThongTinLuongThucComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() handleOk: () => void;
  @Input() handleCancel: () => void;

  formData: FormGroup;
  constructor(private fb: FormBuilder) {}

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
      slThocNhap: [null],
      slGaoNhap: [null],
      tongSoQuyThocXuatTrongNam: [null],
      xuatSlThoc1: [null],
      xuatSlThoc2: [null],
      xuatSlThoc3: [null],
      xuatSlGao1: [null],
      xuatSlGao2: [null],
      xuatSlGao3: [null],
      tongSoQuyThocTonKhoCuoiNam: [null],
      slThocTonKho: [null],
      slGaoTonKho: [null],
    });
  }
}
