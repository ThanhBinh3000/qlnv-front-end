import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
  selector: 'app-dialog-them-dieu-chinh',
  templateUrl: './dialog-them-dieu-chinh.component.html',
  styleUrls: ['./dialog-them-dieu-chinh.component.scss']
})

export class DialogThemDieuChinhComponent implements OnInit {
  @Input() obj: any;

  response: any = {
    maPhanBcao: '2',
    namQtoan: null,
  };


  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {

  };

  async handleOk() {
    if (!this.response.namQtoan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this._modalRef.close(this.response);
  };

  handleCancel() {
    this._modalRef.close();
  };
}
