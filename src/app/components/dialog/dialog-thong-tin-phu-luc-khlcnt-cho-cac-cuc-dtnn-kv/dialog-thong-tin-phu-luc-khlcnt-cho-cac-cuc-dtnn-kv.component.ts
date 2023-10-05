import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ChiTietDeXuatCuaCuc } from './../../../models/ChiTietDeXuatCuaCuc';

@Component({
  selector: 'dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv',
  templateUrl:
    './dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component.html',
  styleUrls: [
    './dialog-thong-tin-phu-luc-khlcnt-cho-cac-cuc-dtnn-kv.component.scss',
  ],
})
export class DialogThongTinPhuLucKHLCNTChoCacCucDTNNKVComponent
  implements OnInit
{
  data: ChiTietDeXuatCuaCuc = new ChiTietDeXuatCuaCuc();
  thongTinPhuLucClone: ChiTietDeXuatCuaCuc = new ChiTietDeXuatCuaCuc();
  constructor(private _modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.thongTinPhuLucClone = cloneDeep(this.data);
    this.thongTinPhuLucClone.trungThau = true;
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
