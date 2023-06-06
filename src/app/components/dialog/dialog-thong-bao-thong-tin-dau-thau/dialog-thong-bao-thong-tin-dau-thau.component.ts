import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from "../../base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Globals } from "../../../shared/globals";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MESSAGE } from "../../../constants/message";
import { HelperService } from "../../../services/helper.service";

@Component({
  selector: 'dialog-thong-bao-thong-tin-dau-thau',
  templateUrl: './dialog-thong-bao-thong-tin-dau-thau.component.html',
  styleUrls: ['./dialog-thong-bao-thong-tin-dau-thau.component.scss'],
})
export class DialogThongBaoThongTinDauThauComponent implements OnInit {
  text: string = ""
  globals: Globals = new Globals();
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  helperService: HelperService
  notification: NzNotificationService

  isSave: boolean = false


  constructor(
    private _modalRef: NzModalRef,
    notification: NzNotificationService,
    httpClient: HttpClient,
  ) {
    this.notification = notification
    this.helperService = new HelperService(httpClient, notification);

  }

  async ngOnInit() {
  }

  handleOk() {
    this.isSave = true
    this._modalRef.close(this.isSave);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
