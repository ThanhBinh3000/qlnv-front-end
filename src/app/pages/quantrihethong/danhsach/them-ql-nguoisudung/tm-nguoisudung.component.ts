import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { STATUS_USER } from 'src/app/constants/config';
import { HelperService } from 'src/app/services/helper.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QlNguoiSuDungService } from 'src/app/services/quantri-nguoidung/qlNguoiSuDung.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { LoaiDanhMuc } from 'src/app/constants/status';


@Component({
  selector: 'app-tm-nguoisudung',
  templateUrl: './tm-nguoisudung.component.html',
  styleUrls: ['./tm-nguoisudung.component.scss'],
})
export class ThemMoiNSDComponent implements OnInit {
  public formGroup: FormGroup;
  statusValue = "A"
  antruongkhichinhsua = true;
  data: any;
  detail: any;
  comfirmPass: any;
  options: any[] = [];
  optionsDonVi: any[] = [];
  LoaiNSD: any;
  inputDonVi: string = '';
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
    private _danhmucService: DanhMucService
  ) {
    this._danhmucService.danhMucChungGetAll(LoaiDanhMuc.VAI_TRO).then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.LoaiNSD = res.data
      }
    });


  }

  ngOnInit(): void {
    this.initForm()
    this.laytatcadonvi()
    if (this.data) {
      this.qlNSDService.userInfo({ "str": this.data }).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.data = res.data;
          this.antruongkhichinhsua = false;
          this.initForm()
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
        this.spinner.hide();
      })
    }



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
          // nếu dữ liệu detail có 
          if (this.data) {
            if (res.data[i].maDvi == this.data.dvql) {
              this.data.dvql = res.data[i].maDvi + ' - ' + res.data[i].tenDvi
              debugger
              this.initForm()
            }
          }
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
      "email": [this.data?.email ?? "", Validators.required],
      "fullName": [this.data?.fullName ?? "", Validators.required],
      "groupId": [this.data?.groupId ?? 0, Validators.required],
      "groupsArr": [this.data?.groupsArr ?? "string"],
      "password": [this.data?.password ?? "", Validators.required],
      "checkPassword": [null, [Validators.required, this.confirmationValidator]],
      "phoneNo": [this.data?.phoneNo ?? null],
      "status": [this.data?.status ?? STATUS_USER.HOAT_DONG],
      "str": [this.data?.str ?? null],
      "sysType": [this.data?.sysType ?? "AD", Validators.required],
      "token": [this.data?.token ?? null],
      "trangThai": [this.data?.trangThai ?? null],
      "username": [this.data?.username ?? "", Validators.required],
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.formGroup.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };


  async themmoi() {
    this.helperService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.invalid) {
      return;
    }
    let maDonVi = this.formGroup.value.dvql.split('-')[0];

    let body = this.formGroup.value

    body.dvql = maDonVi;
    delete body.checkPassword
    if (this.data) {
      body.id = this.data.id
    };

    let res = await this.qlNSDService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, this.data ? MESSAGE.UPDATE_SUCCESS : MESSAGE.ADD_SUCCESS);
      this.modal.close(true);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

  }

  huy() {
    this.modal.close();
  }

}
