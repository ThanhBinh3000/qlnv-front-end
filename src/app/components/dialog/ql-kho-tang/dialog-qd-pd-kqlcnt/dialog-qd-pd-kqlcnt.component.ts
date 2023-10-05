import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-dialog-qd-pd-khlcnt',
  templateUrl: './dialog-qd-pd-kqlcnt.component.html',
  styleUrls: ['./dialog-qd-pd-kqlcnt.component.scss']
})
export class DialogQdPdKqlcntComponent implements OnInit {
  @Input() listQdPdKqlcnt: any[] = []

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
