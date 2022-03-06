import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-quyet-dinh-giao-chi-tieu',
  templateUrl: './dialog-quyet-dinh-giao-chi-tieu.component.html',
  styleUrls: ['./dialog-quyet-dinh-giao-chi-tieu.component.scss'],
})
export class DialogQuyetDinhGiaoChiTieuComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(private _modalRef: NzModalRef) {}

  ngOnInit(): void {}

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
