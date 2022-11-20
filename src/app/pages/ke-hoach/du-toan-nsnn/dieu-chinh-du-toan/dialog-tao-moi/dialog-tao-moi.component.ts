import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
@Component({
  selector: 'app-dialog-tao-moi',
  templateUrl: './dialog-tao-moi.component.html',
})

export class DialogTaoMoiComponent implements OnInit {
  @Input() tab: string;

  response: any = {
    dotBcao: null,
    namBcao: null,
    lstDieuChinhs: [],
    lstDviTrucThuoc: [],
  };
  userInfo: any;

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private dieuChinhService: DieuChinhService,
    private userService: UserService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    this.response.maDvi = this.userInfo?.MA_DVI;
  }

  async handleOk() {
    if (!this.response.namBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.response.namBcao < 999 && this.response.namBcao > 3000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
