import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { uniqBy } from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'dialog-them-moi-goi-thau',
  templateUrl: './dialog-them-moi-goi-thau.component.html',
  styleUrls: ['./dialog-them-moi-goi-thau.component.scss'],
})
export class DialogThemMoiGoiThauComponent implements OnInit {
  formGoiThau: FormGroup;
  data?: any;
  listVatTu?= [];
  vatTuChaId?: any;
  listChungLoai = [];
  listDonVi = [];
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder
  ) {
    this.formGoiThau = this.fb.group({
      tenGThau: [null],
      loaiHh: [null],
      cLoaiVThh: [null],
      dvTinh: [null],
      sLuong: [null],
      donGia: [null],
      thanhTien: [null],
      hThuc: [null],
      pThucLCNT: [null],
      tgianBatDau: [null],
      loaiHdong: [null],
      tgianThucHien: [null]
    });
  }

  ngOnInit(): void {
    this.listChungLoai = uniqBy(this.listVatTu.filter(item => item.maVatTuCha == this.vatTuChaId), 'maVatTu');
  }

  handleOk() {
    const body = this.formGoiThau.value;
    console.log("🚀 ~ file: dialog-them-moi-goi-thau.component.ts ~ line 44 ~ DialogThemMoiGoiThauComponent ~ handleOk ~ body", body)
    this._modalRef.close(body);
  }

  handleCancel() {
    this._modalRef.close();
  }

  changeChungLoai(event) {
    this.listDonVi = uniqBy(this.listChungLoai.filter(item => item.maVatTu == event), 'maDvi');
  }
}
