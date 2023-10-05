import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dialog-can-cu-thong-tin-chao-gia',
  templateUrl: './dialog-can-cu-thong-tin-chao-gia.component.html',
  styleUrls: ['./dialog-can-cu-thong-tin-chao-gia.component.scss']
})
export class DialogCanCuThongTinChaoGiaComponent implements OnInit {
  dataHeader: any[] = [];
  dataColumn: any[] = []
  dataTable: any[] = [];
  code: string;
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
    console.log(this.dataTable);
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

}
