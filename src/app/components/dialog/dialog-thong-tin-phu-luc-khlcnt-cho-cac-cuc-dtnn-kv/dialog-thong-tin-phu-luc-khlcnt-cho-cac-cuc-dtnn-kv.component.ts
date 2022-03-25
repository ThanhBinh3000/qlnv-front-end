import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv',
  templateUrl: './dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component.scss'],
})
export class DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent implements OnInit {
  constructor(private _modalRef: NzModalRef) { }

  ngOnInit(): void { }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
