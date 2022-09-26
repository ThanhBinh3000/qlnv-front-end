import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-tong-hop-giao',
  templateUrl: './dialog-tong-hop-giao.component.html',
  styleUrls: ['./dialog-tong-hop-giao.component.scss'],
})
export class DialogTongHopGiaoComponent implements OnInit {
  @Input() maBcao: any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {

  }

  handleCancel() {
    this._modalRef.close();
  }
}
