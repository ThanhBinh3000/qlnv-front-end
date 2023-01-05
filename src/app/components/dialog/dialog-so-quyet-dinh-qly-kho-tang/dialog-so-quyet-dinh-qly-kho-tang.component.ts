import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-so-quyet-dinh-qly-kho-tang',
  templateUrl: './dialog-so-quyet-dinh-qly-kho-tang.component.html',
  styleUrls: ['./dialog-so-quyet-dinh-qly-kho-tang.component.scss']
})
export class DialogSoQuyetDinhQlyKhoTangComponent implements OnInit {
  @Input() loai: string;
  @Input() dsQdGoc: any[] = [];

  radioValue: any;

  constructor(
    private _modalRef: NzModalRef,
  ) {

  }

  async ngOnInit() {
  }

  onCancel() {
    this._modalRef.close();
  }

  handleOk() {
    this._modalRef.close(this.radioValue);
  }
}

