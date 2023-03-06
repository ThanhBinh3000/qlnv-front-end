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
