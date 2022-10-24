import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from "../../../services/helper.service";
import { DanhMucDungChungService } from "../../../services/danh-muc-dung-chung.service";
import { Router } from "@angular/router";
import { QlNhomQuyenService } from 'src/app/services/quantri-nguoidung/qlNhomQuyen.service';

@Component({
  selector: 'dialog-nhom-quyen',
  templateUrl: './dialog-nhom-quyen.component.html',
  styleUrls: ['./dialog-nhom-quyen.component.scss'],
})
export class DialogNhomQuyenComponent implements OnInit {
  dataEdit: any;
  isView: boolean;
  formData: FormGroup;
  totalRecord: number = 10;
  danhMucList: any[] = [];
  submited: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private qlNhomQuyenService: QlNhomQuyenService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      status: ['01', [Validators.required]],
      ghiChu: [null]
    });
  }

  dsTrangThai: any = [
    {
      ma: '00',
      ten: 'Không hoạt động'
    },
    {
      ma: '01',
      ten: 'Hoạt động'
    }
  ]

  async ngOnInit() {
    this.bindingData(this.dataEdit)
  }

  async save() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.name = body.name.trim();
    let res
    if (this.dataEdit != null) {
      res = await this.qlNhomQuyenService.update(body);
    } else {
      res = await this.qlNhomQuyenService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.dataEdit != null) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this._modalRef.close(this.formData);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  handleCancel() {
    this._modalRef.destroy();
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      this.formData.patchValue({
        id: dataEdit.id,
        status: dataEdit.status,
        name: dataEdit.name,
        ghiChu: dataEdit.ghiChu
      })
    }
  }
}
