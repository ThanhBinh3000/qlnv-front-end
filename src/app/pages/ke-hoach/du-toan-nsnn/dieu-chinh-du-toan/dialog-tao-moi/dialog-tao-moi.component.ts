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
  styleUrls: ['./dialog-tao-moi.component.css']
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
  async tongHop() {
    this.spinner.show();
    await this.dieuChinhService.tongHopDieuChinhDuToan(this.response).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.response.lstDieuChinhs = data.data.lstDchinhs;
          this.response.lstDviTrucThuoc = data.data.lstDchinhDviTrucThuocs;
          this.response.lstDieuChinhs.forEach(item => {
            if (!item.id) {
              item.id = uuid.v4() + 'FE';
            }
            item.giaoCho = this.userInfo?.sub;
            item.maDviTien = '1';
            item.trangThai = '3';
          })
          this.response.lstDviTrucThuoc.forEach(item => {
            item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
            item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          })
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.spinner.hide();
  }

  async handleOk() {
    if (this.tab == 'tonghop') {
      await this.tongHop();
      if (this.response.lstDviTrucThuoc?.length == 0) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EXIST_REPORT);
        return;
      }
    }
    if (!this.response.namBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
