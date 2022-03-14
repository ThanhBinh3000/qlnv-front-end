import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  data: string;
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
    this._modalRef.destroy();
  }
  onSave() {
    this._modalRef.close(this.data);
  }
}
