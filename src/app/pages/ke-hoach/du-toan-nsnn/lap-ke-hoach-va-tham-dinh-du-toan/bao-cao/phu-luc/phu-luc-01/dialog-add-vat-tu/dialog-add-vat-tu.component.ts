import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-add-vat-tu',
  templateUrl: './dialog-add-vat-tu.component.html',
  styleUrls: ['./dialog-add-vat-tu.component.scss']
})

export class DialogAddVatTuComponent implements OnInit {
  @Input() obj: any;

  userInfo: any;
  response: any = {
    maVatTu: null,
    loaiDinhMuc: null,
  };
  listVatTu: any[] = [];
  listDinhMuc: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
  ) { }

  async ngOnInit() {
    this.listVatTu = this.obj.listVatTu;
    this.listDinhMuc = [
      {
        loaiDinhMuc: "01",
        tenDm: "Nhập"
      },
      {
        loaiDinhMuc: "02",
        tenDm: "Xuất"
      }
    ]
  }

  changeModel() {
  }


  async handleOk() {
    this._modalRef.close(this.response);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
