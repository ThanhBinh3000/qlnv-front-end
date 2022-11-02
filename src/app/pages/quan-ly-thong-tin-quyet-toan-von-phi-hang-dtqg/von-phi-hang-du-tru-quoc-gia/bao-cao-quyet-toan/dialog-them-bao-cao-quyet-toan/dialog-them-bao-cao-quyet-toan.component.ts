import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

@Component({
  selector: 'app-dialog-them-bao-cao-quyet-toan',
  templateUrl: './dialog-them-bao-cao-quyet-toan.component.html',
  styleUrls: ['./dialog-them-bao-cao-quyet-toan.component.scss']
})

export class DialogThemBaoCaoQuyetToanComponent implements OnInit {
  @Input() obj: any;

  response: any = {
    maPhanBcao: '1',
    namQtoan: null,
  };


  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {

  }

  async handleOk() {
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
