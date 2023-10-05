import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
  selector: 'app-dialog-tao-moi-bao-cao-quyet-toan',
  templateUrl: './dialog-tao-moi-bao-cao-quyet-toan.component.html',
  styleUrls: ['./dialog-tao-moi-bao-cao-quyet-toan.component.scss']
})

export class DialogTaoMoiBaoCaoQuyetToanComponent implements OnInit {
  @Input() obj: any;

  response: any = {
    maPhanBcao: null,
    namQtoan: null,
  };


  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {

  }

  handleOk() {
    if (!this.response.maPhanBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (!this.response.namQtoan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
