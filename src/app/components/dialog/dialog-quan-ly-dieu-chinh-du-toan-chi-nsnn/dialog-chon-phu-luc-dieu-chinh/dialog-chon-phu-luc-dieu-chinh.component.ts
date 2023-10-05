import { NzModalRef } from 'ng-zorro-antd/modal';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-chon-phu-luc-dieu-chinh',
  templateUrl: './dialog-chon-phu-luc-dieu-chinh.component.html',
  styleUrls: ['./dialog-chon-phu-luc-dieu-chinh.component.scss']
})
export class DialogChonPhuLucDieuChinhComponent implements OnInit {

  @Input() danhSachPhuLuc:any;

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {

  }

  handleOk() {
    this._modalRef.close(this.danhSachPhuLuc);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
