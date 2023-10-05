import { Component, OnInit } from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-pvc-bb-giao-nhan',
  templateUrl: './dialog-pvc-bb-giao-nhan.component.html',
  styleUrls: ['./dialog-pvc-bb-giao-nhan.component.scss']
})
export class DialogPvcBbGiaoNhanComponent implements OnInit {

  dataHeader: any[] = [];
  dataColumn: any[] = []
  dataTable: any[] = [];
  code: string;
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
  }


  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }
}
