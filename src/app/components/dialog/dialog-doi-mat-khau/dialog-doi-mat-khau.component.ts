import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { Globals } from 'src/app/shared/globals';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from '../../../services/helper.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-dialog-doi-mat-khau',
  templateUrl: './dialog-doi-mat-khau.component.html',
  styleUrls: ['./dialog-doi-mat-khau.component.scss']
})
export class DialogDoiMatKhauComponent implements OnInit {
  formData: FormGroup;
  isOld: boolean;
  pattern: any
  username: string
  regexComplex: string

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    private helperService: HelperService,
    private notification: NzNotificationService,
  ) {
    this.formData = this.fb.group({
      username: [null, [Validators.required]],
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      renewPassword: [null, [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.formData.patchValue({
      username: this.username
    })

    if (this.pattern) {
      this.regexComplex = ` Mật khẩu yêu cầu ${this.pattern.sizePassword ? 'tối thiểu ' + this.pattern.sizePassword + ' ký tự ' : ''}${this.pattern.includeNumberAndChar ? 'cả số và chữ, chữ hoa và chữ thường ' : ''}${this.pattern.minSpecial ? this.pattern.minSpecial + ' ký tự đặc biệt' : ''}`
      this.formData.controls["newPassword"].setValidators([Validators.pattern(this.pattern.regexComplex)]);
    }

  }

  handleCancel() {
    this._modalRef.destroy();
  }

  save() {
    if (!this.isOld) {
      this.formData.controls["oldPassword"].clearValidators();
      delete this.formData.value.oldPassword
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    if (this.formData.value.newPassword !== this.formData.value.renewPassword) {
      this.notification.error(MESSAGE.ERROR, "Mật khẩu mới không giống nhau");
      return;
    }
    this._modalRef.close(this.formData.value);
  }

}
