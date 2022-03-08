import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv',
  templateUrl: './dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component.scss'],
})
export class DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent implements OnInit {
  // @Input() isVisible: boolean;
  // @Output() isVisibleChange = new EventEmitter<boolean>();

  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(private _modalRef: NzModalRef) { }

  ngOnInit(): void { }

  handleOk() {
    // this.isVisible = false;
    // this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    // this.isVisible = false;
    // this.isVisibleChange.emit(this.isVisible);
  }

  onCancel() {
    this._modalRef.close();
  }
}
