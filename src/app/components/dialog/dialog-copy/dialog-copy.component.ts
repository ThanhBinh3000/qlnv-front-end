import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-copy',
  templateUrl: './dialog-copy.component.html',
  styleUrls: ['./dialog-copy.component.scss'],
})
export class DialogCopyComponent implements OnInit {
  @Input() maBcao:any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {

  }

  handleCancel() {
    this._modalRef.close();
  }
}
