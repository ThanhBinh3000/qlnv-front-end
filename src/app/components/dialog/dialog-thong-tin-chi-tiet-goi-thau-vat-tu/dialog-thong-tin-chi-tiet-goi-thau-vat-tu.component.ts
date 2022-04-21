import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-thong-tin-chi-tiet-goi-thau-vat-tu',
  templateUrl: './dialog-thong-tin-chi-tiet-goi-thau-vat-tu.component.html',
  styleUrls: ['./dialog-thong-tin-chi-tiet-goi-thau-vat-tu.component.scss'],
})
export class DialogThongTinChiTietGoiThauComponent implements OnInit {
  data: any;
  radioValue: string = "trung";

  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(private _modalRef: NzModalRef) { }

  ngOnInit(): void { }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
