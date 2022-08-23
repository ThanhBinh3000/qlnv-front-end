import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-chon-them-bieu-mau',
  templateUrl: './dialog-chon-them-bieu-mau.component.html',
  styleUrls: ['./dialog-chon-them-bieu-mau.component.scss'],
})
export class DialogChonThemBieuMauComponent implements OnInit {
  @Input() danhSachBieuMau:any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {
  }

  handleOk() {
    this._modalRef.close(this.danhSachBieuMau);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]