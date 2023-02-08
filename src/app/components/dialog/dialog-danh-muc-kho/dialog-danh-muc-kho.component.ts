import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-danh-muc-kho',
  templateUrl: './dialog-danh-muc-kho.component.html',
  styleUrls: ['./dialog-danh-muc-kho.component.scss']
})
export class DialogDanhMucKhoComponent implements OnInit {
  @Input()
  item : any;

  constructor(
    private _modalRef : NzModalRef
  ) { }

  ngOnInit() {
  }

  handleCancel() {
    this._modalRef.close();
  }
}
