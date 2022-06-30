import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { uniqBy } from 'lodash';

@Component({
  selector: 'dialog-them-moi-goi-thau',
  templateUrl: './dialog-them-moi-goi-thau.component.html',
  styleUrls: ['./dialog-them-moi-goi-thau.component.scss'],
})
export class DialogThemMoiGoiThauComponent implements OnInit {
  data?: any;
  listVatTu?= [];
  vatTuChaId?: any;
  listChungLoai = [];
  listDonVi = [];
  cLoaiVThh
  constructor(private _modalRef: NzModalRef) { }

  ngOnInit(): void {
    this.listChungLoai = uniqBy(this.listVatTu.filter(item => item.maVatTuCha == this.vatTuChaId), 'maVatTu');
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }

  changeChungLoai(event) {
    this.listDonVi = uniqBy(this.listChungLoai.filter(item => item.maVatTu == event), 'maDvi');
  }
}
