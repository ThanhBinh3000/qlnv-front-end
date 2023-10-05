import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-qd-sc-btc',
  templateUrl: './dialog-qd-sc-btc.component.html',
  styleUrls: ['./dialog-qd-sc-btc.component.scss']
})
export class DialogQdScBtcComponent implements OnInit {

  @Input() listTh : any[] = []
  @Input() type : string
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
  }

  handleOk(data  :any) {
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.close();
  }


}
