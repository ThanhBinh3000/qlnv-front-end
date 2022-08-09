import { PAGE_SIZE_DEFAULT } from './../../../constants/config';
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

@Component({
  selector: 'dialog-phan-quyen',
  templateUrl: './dialog-phan-quyen.component.html',
  styleUrls: ['./dialog-phan-quyen.component.scss'],
})
export class DialogPhanQuyenComponent implements OnInit {
  dataEdit: any;
  isView: boolean;
  formData: FormGroup;
  totalRecord: number = 10;
  danhMucList: any[] = [];
  submited: boolean = false;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dmService: DanhMucDungChungService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group({
      id: [null],
      loai: [null, [Validators.required]],
      ma: [null, [Validators.required]],
      maCha: [null],
      trangThai: ['01'],
      giaTri: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  async ngOnInit() {
    await Promise.all([
      this.getDmList()
    ])
    this.bindingData(this.dataEdit)
    console.log(this.dataEdit)
    console.log(this.isView)
    console.log(this.formData.value)
  }

  async save() {
    this.submited = true;
    if (this.formData.valid) {
      this.spinner.show();
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      console.log(this.formData.value)
      let res
      if (this.dataEdit != null) {
        res = await this.dmService.update(body);
      } else {
        res = await this.dmService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (this.dataEdit != null) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
      this._modalRef.close(this.formData);
    }
  }

  async getDmList() {
    let data = await this.dmService.danhMucChungGetAll("DANH_MUC_DC");
    this.danhMucList = data.data;
  }



  handleCancel() {
    this._modalRef.destroy();
  }

  bindingData(dataEdit) {
    if (dataEdit) {
      this.formData.get('id').setValue(dataEdit.id);
      this.formData.get('loai').setValue(dataEdit.loai);
      this.formData.get('ma').setValue(dataEdit.ma);
      this.formData.get('maCha').setValue(dataEdit.maCha);
      this.formData.get('ghiChu').setValue(dataEdit.ghiChu);
      this.formData.get('trangThai').setValue(dataEdit.trangThai);
      this.formData.get('giaTri').setValue(dataEdit.giaTri);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
