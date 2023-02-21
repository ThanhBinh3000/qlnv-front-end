import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {MmDxChiCucService} from "../../../services/mm-dx-chi-cuc.service";

@Component({
  selector: 'app-dialog-mm-mua-sam',
  templateUrl: './dialog-mm-mua-sam.component.html',
  styleUrls: ['./dialog-mm-mua-sam.component.scss']
})
export class DialogMmMuaSamComponent implements OnInit {
  @Input() listTh : any[] = []
  radioValue  : any
  constructor(
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit(): void {
  }

  handleOk() {
    this._modalRef.close(this.radioValue);
  }

  onCancel() {
    this._modalRef.close();
  }

}
