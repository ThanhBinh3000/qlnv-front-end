import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
  selector: 'app-dialog-copy-giao-du-toan',
  templateUrl: './dialog-copy-giao-du-toan.component.html',
  styleUrls: ['./dialog-copy-giao-du-toan.component.scss']
})
export class DialogCopyGiaoDuToanComponent implements OnInit {
  @Input() namBcao: number;
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
    if (
      !this.request.namBcao
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
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
