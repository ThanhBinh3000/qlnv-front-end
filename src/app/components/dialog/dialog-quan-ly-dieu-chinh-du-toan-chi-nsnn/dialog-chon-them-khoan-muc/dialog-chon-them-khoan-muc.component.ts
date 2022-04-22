import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-chon-them-khoan-muc',
  templateUrl: './dialog-chon-them-khoan-muc.component.html',
  styleUrls: ['./dialog-chon-them-khoan-muc.component.scss'],
})
export class DialogChonThemKhoanMucComponent implements OnInit {
  @Input() danhSachKhoanMuc:any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {
    console.log(this.danhSachKhoanMuc);
  }

  handleOk() {
    this._modalRef.close(this.danhSachKhoanMuc);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]