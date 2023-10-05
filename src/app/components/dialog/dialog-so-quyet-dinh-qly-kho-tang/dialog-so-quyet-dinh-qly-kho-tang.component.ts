import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-so-quyet-dinh-qly-kho-tang',
  templateUrl: './dialog-so-quyet-dinh-qly-kho-tang.component.html',
  styleUrls: ['./dialog-so-quyet-dinh-qly-kho-tang.component.scss']
})
export class DialogSoQuyetDinhQlyKhoTangComponent implements OnInit {
  @Input() loai: string;
  @Input() dsQdGoc: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
  ) {
  }

  ngOnInit(): void {
  }

  handleOk(data: any) {
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.close();
  }

}

