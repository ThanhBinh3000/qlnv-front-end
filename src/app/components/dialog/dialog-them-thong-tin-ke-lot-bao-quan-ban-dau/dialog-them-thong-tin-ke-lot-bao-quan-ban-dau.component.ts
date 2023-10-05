import { DanhSachGoiThau } from '../../../models/DeXuatKeHoachuaChonNhaThau';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import VNnum2words from 'vn-num2words';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'dialog-them-thong-tin-ke-lot-bao-quan-ban-dau',
  templateUrl: './dialog-them-thong-tin-ke-lot-bao-quan-ban-dau.component.html',
  styleUrls: ['./dialog-them-thong-tin-ke-lot-bao-quan-ban-dau.component.scss'],
})
export class DialogThongTinKeLotBaoQuanBanDauComponent implements OnInit {
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

  onCancel() {
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
