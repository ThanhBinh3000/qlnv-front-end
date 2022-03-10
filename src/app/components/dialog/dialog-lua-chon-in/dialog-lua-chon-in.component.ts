import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-lua-chon-in',
  templateUrl: './dialog-lua-chon-in.component.html',
  styleUrls: ['./dialog-lua-chon-in.component.scss'],
})
export class DialogLuaChonInComponent implements OnInit {
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {

  }

  handleOk() {
    this._modalRef.close(this.options);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
