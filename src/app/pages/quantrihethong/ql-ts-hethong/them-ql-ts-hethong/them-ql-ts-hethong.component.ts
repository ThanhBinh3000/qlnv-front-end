import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STATUS_USER } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QlNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNguoiSuDung.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { QlTShethongService } from 'src/app/services/quantri-nguoidung/qlTshethong.service';


interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'app-them-ql-ts-hethong',
  templateUrl: './them-ql-ts-hethong.component.html',
  styleUrls: ['./them-ql-ts-hethong.component.scss'],
})
export class ThemQlTSHethongComponent implements OnInit {
  public formGroup: FormGroup;
  statusValue = "A"
  data: any;
  detail: any;
  comfirmPass: any;
  options: any[] = [];
  optionsDonVi: any[] = [];
  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private router: Router,
    // private userInfo: UserLogin,
    private qlNSDService: QlNguoiSuDungService,
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private modal: NzModalRef,
    private _qlTShethongService: QlTShethongService

  ) {



  }



  ngOnInit(): void {
    // console.log(this.userInfo)

    this.initForm()
    if (this.data) {
      this.chitietthamso()
    }
  }


  async chitietthamso() {
    this.spinner.show();
    try {
      let res = await this._qlTShethongService.find({ id: this.data.id });

      if (res.data) {

        this.data = res.data;
        this.initForm()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }


  initForm() {
    this.formGroup = this.fb.group({
      "description": [this.data?.moTa ?? null],
      "paramId": [this.data?.ma ?? null, Validators.required],
      "paramName": [this.data?.ten ?? null, Validators.required],
      "paramValue": [this.data?.giaTri ?? null, Validators.required],
      "status": [this.data?.trangThai ?? STATUS_USER.HOAT_DONG],
      "str": [null],
      "trangThai": [null],

    });
  }


  async themmoi() {
    this.helperService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.invalid) {
      return;
    }
    let body = this.formGroup.value
    let res
    if (this.data) {
      body.id = this.data.id
      res = await this._qlTShethongService.update(body);
      debugger
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } else {
      res = await this._qlTShethongService.create(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.modal.close(true);
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }



  }

  huy() {
    this.modal.close();
  }













}
