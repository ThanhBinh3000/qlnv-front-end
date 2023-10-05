import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
  selector: 'app-dialog-copy-quyet-toan-von-phi-hang-dtqg',
  templateUrl: './dialog-copy-quyet-toan-von-phi-hang-dtqg.component.html',
  styleUrls: ['./dialog-copy-quyet-toan-von-phi-hang-dtqg.component.scss']
})

export class DialogCopyQuyetToanVonPhiHangDtqgComponent implements OnInit {

  @Input() namBcao: number;
  text: string = ""
  baoCaos: any = [];
  request = {
    namBcao: 0,
  }

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.request.namBcao = this.namBcao;
  }

  handleOk() {
    if (this.request.namBcao >= 3000 || this.request.namBcao < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    this._modalRef.close(this.request);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
