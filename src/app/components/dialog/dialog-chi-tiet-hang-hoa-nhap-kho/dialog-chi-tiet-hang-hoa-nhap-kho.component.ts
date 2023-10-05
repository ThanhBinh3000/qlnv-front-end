import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-chi-tiet-hang-hoa-nhap-kho',
  templateUrl: './dialog-chi-tiet-hang-hoa-nhap-kho.component.html',
  styleUrls: ['./dialog-chi-tiet-hang-hoa-nhap-kho.component.scss'],
})
export class DialogChiTietHangHoaNhapKhoComponent implements OnInit {
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
