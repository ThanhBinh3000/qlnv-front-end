import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-lua-chon-them-phu-luc',
  templateUrl: './dialog-lua-chon-them-phu-luc.component.html',
  styleUrls: ['./dialog-lua-chon-them-phu-luc.component.scss'],
})
export class DialogLuaChonThemPhuLucComponent implements OnInit {
  @Input() danhSachPhuLuc:any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {

  }

  handleOk() {
    this._modalRef.close(this.danhSachPhuLuc);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]