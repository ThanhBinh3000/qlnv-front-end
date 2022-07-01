import { DanhSachGoiThau } from '../../../models/DeXuatKeHoachuaChonNhaThau';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import VNnum2words from 'vn-num2words';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'dialog-thong-tin-lenh-nhap-kho',
  templateUrl: './dialog-thong-tin-lenh-nhap-kho.component.html',
  styleUrls: ['./dialog-thong-tin-lenh-nhap-kho.component.scss'],
})
export class DialogThongTinLenhNhapKhoComponent implements OnInit {
  formData: FormGroup;
  thongtinDauThau: DanhSachGoiThau;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  save() {
    this._modalRef.close(this.formData);
  }

  huy() {
    this._modalRef.destroy();
  }
  initForm() {
    this.formData = this.fb.group({
      diaDiemNhap: [
        this.thongtinDauThau ? this.thongtinDauThau.diaDiemNhap : null,
      ],
      donGia: [this.thongtinDauThau ? this.thongtinDauThau.donGia : null],
      goiThau: [
        this.thongtinDauThau ? this.thongtinDauThau.goiThau : null,
        [Validators.required],
      ],
      id: [this.thongtinDauThau ? this.thongtinDauThau.id : null],
      soLuong: [
        this.thongtinDauThau ? this.thongtinDauThau.soLuong : null,
        [Validators.required],
      ],
      thanhTien: [this.thongtinDauThau ? this.thongtinDauThau.thanhTien : null],
      bangChu: [this.thongtinDauThau ? this.thongtinDauThau.bangChu : null],
    });
  }
  calculatorThanhTien() {
    this.formData.patchValue({
      thanhTien:
        +this.formData.get('soLuong').value *
        1000 *
        +this.formData.get('donGia').value,
    });
    this.formData.patchValue({
      bangChu: VNnum2words(+this.formData.get('thanhTien').value),
    });
  }
}
