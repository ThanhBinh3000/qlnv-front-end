import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../../shared/globals";
import {NzModalRef} from "ng-zorro-antd/modal";
import {TongHopHangSuaChuaService} from "../../../services/tong-hop-hang-sua-chua.service";
import {MESSAGE} from "../../../constants/message";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {HelperService} from "../../../services/helper.service";
import {UserService} from "../../../services/user.service";
import dayjs from "dayjs";
import {UserLogin} from "../../../models/userlogin";

@Component({
  selector: 'app-dialog-tong-hop-hang-sua-chua-dtqg',
  templateUrl: './dialog-tong-hop-hang-sua-chua-dtqg.component.html',
  styleUrls: ['./dialog-tong-hop-hang-sua-chua-dtqg.component.scss']
})
export class DialogTongHopHangSuaChuaDtqgComponent implements OnInit {
  maTt: string;
  formData: FormGroup;
  userInfo: UserLogin;
   maDanhSach: string;
   timeNow: any
  @Input() idInput: number

  constructor(
    public globals: Globals,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
    private _modalRef: NzModalRef,
    private userService: UserService,
    private tongHopHangHongHoc: TongHopHangSuaChuaService
  ) {
    this.formData = this.fb.group({
      maDanhSach: [null, Validators.required],
      thoiGianTh: [null, Validators.required],
      soToTrinh: [null, Validators.required],
      tenDanhSach: [null, Validators.required],
      noiDung: [null, Validators.required],
      trangThai: ['00'],
    })
  }

  ngOnInit(): void {
    this.maTt = '/CCDTNT-KT'
    this.getMaDanhSach();
    this.userInfo = this.userService.getUserLogin()
  }

  async getMaDanhSach() {
    let id = await this.userService.getId('SC_TH_HHH_SEQ')
    this.maDanhSach = 'DS' + id
    this.formData.patchValue({
      maDanhSach: this.maDanhSach,
      thoiGianTh: (new Date()).toISOString()
    })
  }

  onCancel() {
    this._modalRef.close()
  }

  async tongHop() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      return;
    }
    let body = this.formData.value
    body.maDvi = this.userInfo.MA_DVI
    let res
    if (this.idInput) {
      res = await this.tongHopHangHongHoc.update(body);
    } else {
      res = await this.tongHopHangHongHoc.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.idInput) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    }
    this._modalRef.close()
  }
}
