import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-tu-choi',
  templateUrl: './dialog-tu-choi.component.html',
  styleUrls: ['./dialog-tu-choi.component.scss'],
})
export class DialogTuChoiComponent implements OnInit {
  text: string = ""

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {

  }

  handleOk() {
    this._modalRef.close(this.text);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
