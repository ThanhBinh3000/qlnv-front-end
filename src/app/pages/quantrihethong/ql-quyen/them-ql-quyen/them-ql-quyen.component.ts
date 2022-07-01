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


@Component({
  selector: 'app-them-ql-quyen',
  templateUrl: './them-ql-quyen.component.html',
  styleUrls: ['./them-ql-quyen.component.scss'],
})
export class ThemQlQuyenComponent implements OnInit {
  public formGroup: FormGroup;
  statusValue = "A"
  data: any;
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
  ) {




  }

  ngOnInit(): void {
    // console.log(this.userInfo)

    this.initForm()
    this.laytatcadonvi()

  }


  async laytatcadonvi() {
    this.spinner.show();
    try {
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
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
      "chucvuId": [this.data?.chucvuId ?? 0],
      "dvql": [this.data?.dvql ?? "", Validators.required],
      "email": [this.data?.email ?? ""],
      "fullName": [this.data?.fullName ?? ""],
      "groupId": [this.data?.groupId ?? 0, Validators.required],
      "groupsArr": [this.data?.groupsArr ?? ""],
      "password": [this.data?.password ?? "", Validators.required],
      "cfpassword": ["", Validators.required],
      "phoneNo": [this.data?.phoneNo ?? ""],
      "status": [this.data?.status ?? ""],
      "str": [this.data?.str ?? ""],
      "sysType": [this.data?.sysType ?? "AD", Validators.required],
      "token": [this.data?.token ?? ""],
      "trangThai": [this.data?.trangThai ?? STATUS_USER.HOAT_DONG],
      "username": [this.data?.username ?? "", Validators.required],
    });
  }


  async themmoi() {
    this.helperService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.invalid) {
      return;
    }
    let body = this.formGroup.value
    body.paggingReq = {
      "limit": 20,
      "page": 1
    },
      delete body.cfpassword
    debugger
    let res = await this.qlNSDService.create(body);
    debugger
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

  }

  huy() {
    this.modal.close();
  }

}
