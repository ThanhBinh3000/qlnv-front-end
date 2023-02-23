import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-mm-mua-sam',
  templateUrl: './dialog-mm-mua-sam.component.html',
  styleUrls: ['./dialog-mm-mua-sam.component.scss']
})
export class DialogMmMuaSamComponent implements OnInit {
  @Input() listTh : any[] = []
  @Input() type : string
  radioValue  : any
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
  }

  handleOk() {
    let result;
    if (this.type == '00') {
      result = this.listTh.find(element => element.id == this.radioValue);
    } else {
      result = this.listTh.find(element => element.soQd == this.radioValue);
    }
    this._modalRef.close(result);
  }

  onCancel() {
    this._modalRef.close();
  }

}
