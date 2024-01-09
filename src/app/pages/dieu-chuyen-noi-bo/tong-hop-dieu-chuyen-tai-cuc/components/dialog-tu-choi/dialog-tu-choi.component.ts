import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'dialog-tu-choi',
  templateUrl: './dialog-tu-choi.component.html',
  styleUrls: ['./dialog-tu-choi.component.scss'],
})
export class DialogTuChoiTongHopDieuChuyenComponent implements OnInit {
  @Input() data: any[];
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
      listCucNhan: [],
    });

  }

  async ngOnInit() {
    this.formData.get("text").setValue(this.text);
    this.formData.get('listCucNhan').setValue(this.data)
  }
  customValidatorCheck(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      let isEmpty = true;
      control.value.forEach(element => {
        if (element.checked) {
          isEmpty = false
        }
      });
      return !isEmpty ? null : { isEmptyCheck: true }
      // return valid ? null : { isEmtyCheck: true };
    };
  }
  handleChosen(event) {
    // this.formData.controls['listCucNhan'].clearValidators()
  }
  handleOk() {
    this.formData.controls["listCucNhan"].setValidators(Validators.compose([Validators.required, this.customValidatorCheck()]))
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    };
    this._modalRef.close({ lyDoTuChoi: this.formData.get("text").value, listTuChoi: this.formData.get("listCucNhan").value });
  }

  handleCancel() {
    this._modalRef.close();
  }
}
