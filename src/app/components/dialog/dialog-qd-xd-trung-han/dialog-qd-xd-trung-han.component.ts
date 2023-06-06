import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-qd-xd-trung-han',
  templateUrl: './dialog-qd-xd-trung-han.component.html',
  styleUrls: ['./dialog-qd-xd-trung-han.component.scss']
})
export class DialogQdXdTrungHanComponent implements OnInit {

  @Input() dsPhuongAn: any[] = [];

  @Input() type  :string


  constructor(
    private _modalRef: NzModalRef,
  ) {

  }

  async ngOnInit() {
  }


  handleOk(data  :any) {
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.close();
  }
}
