import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

@Component({
  selector: 'app-dialog-tong-hop',
  templateUrl: './dialog-tong-hop.component.html',
  styleUrls: ['./dialog-tong-hop.component.css']
})

export class DialogTongHopComponent implements OnInit {
  @Input() obj: any;

  response: any = {
    maPhanBcao: '1',
    namQtoan: null,
    thangBcao: null,
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
    if (this.response.namnamQtoanBcao >= 3000 || this.response.namQtoan < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    if (this.response.thangBcao < 1 || this.response.thangBcao > 12) {
      this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập tháng đúng định dạng số từ 1 đến 12");
      return;
    }
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}