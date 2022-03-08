import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-them-moi-vat-tu',
  templateUrl: './dialog-them-moi-vat-tu.component.html',
  styleUrls: ['./dialog-them-moi-vat-tu.component.scss'],
})
export class DialogThemMoiVatTuComponent implements OnInit {
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
