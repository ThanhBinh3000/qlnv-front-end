import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-van-ban-san-sang-ban-hanh',
  templateUrl: './dialog-van-ban-san-sang-ban-hanh.component.html',
  styleUrls: ['./dialog-van-ban-san-sang-ban-hanh.component.scss'],
})
export class DialogVanBanSanSangBanHanhComponent implements OnInit {
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(private _modalRef: NzModalRef) {}

  async ngOnInit() {}

  handleOk() {
    this._modalRef.close(this.options);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
