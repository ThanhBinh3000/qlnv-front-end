import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet',
  templateUrl: './dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.scss'],
})
export class DialogThongTinPhuLucQuyetDinhPheDuyetComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(private _modalRef: NzModalRef) { }

  ngOnInit(): void { }

  handleOk() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  onCancel() {
    this._modalRef.close();
  }
}
