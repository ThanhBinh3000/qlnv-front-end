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
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'dialog-tu-choi',
  templateUrl: './dialog-tu-choi.component.html',
  styleUrls: ['./dialog-tu-choi.component.scss'],
})
export class DialogTuChoiComponent implements OnInit {
  text: string = ""
  globals: Globals = new Globals();
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  helperService: HelperService
  notification: NzNotificationService


  constructor(
    private _modalRef: NzModalRef,
    notification: NzNotificationService,
    httpClient: HttpClient,
    private userService: UserService
  ) {
    this.notification = notification
    this.helperService = new HelperService(httpClient,this.userService, this.notification);
    this.formData = this.fb.group({
      text: [, [Validators.required]],
    });

  }

  async ngOnInit() {
    this.formData.get("text").setValue(this.text);
  }

  handleOk() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    this._modalRef.close(this.formData.get("text").value);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
