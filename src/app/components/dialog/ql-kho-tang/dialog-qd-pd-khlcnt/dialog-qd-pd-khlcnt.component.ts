import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-qd-pd-khlcnt',
  templateUrl: './dialog-qd-pd-khlcnt.component.html',
  styleUrls: ['./dialog-qd-pd-khlcnt.component.scss']
})
export class DialogQdPdKhlcntComponent implements OnInit {
  @Input() listQdPdKhlcnt : any[] = []
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
