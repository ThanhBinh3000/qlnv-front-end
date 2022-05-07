import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-gui-duyet',
  templateUrl: './dialog-gui-duyet.component.html',
  styleUrls: ['./dialog-gui-duyet.component.scss'],
})
export class DialogGuiDuyetComponent implements OnInit {
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
