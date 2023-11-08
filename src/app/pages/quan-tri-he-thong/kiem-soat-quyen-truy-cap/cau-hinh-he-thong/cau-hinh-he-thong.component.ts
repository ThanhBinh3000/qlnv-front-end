import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Base2Component } from "src/app/components/base2/base2.component";
import dayjs from "dayjs";
import moment from "moment";

@Component({
  selector: 'app-cau-hinh-he-thong',
  templateUrl: './cau-hinh-he-thong.component.html',
  styleUrls: ['./cau-hinh-he-thong.component.scss']
})
export class CauHinhHeThongComponent extends Base2Component implements OnInit {

  formData: FormGroup
  fb: FormBuilder = new FormBuilder();
  isView = false
  data?: any

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyHangTrongKhoService);
    this.formData = this.fb.group({
      all: [false, [Validators.required]],
      login: [false, [Validators.required]],
      logout: [false, [Validators.required]],
      access: [false, [Validators.required]],
    }
    );
  }

  ngOnInit(): void {
    // this.formData.patchValue({ ...this.data, startDate: moment(this.data.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD'), endDate: moment(this.data.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD') })
  }

  onAll(all) {
    console.log("onAll", all, this.formData.value.all)
    if (all) {
      this.formData.patchValue({
        login: true,
        logout: true,
        access: true,
      })
    } else {
      if (this.formData.value.login && this.formData.value.logout && this.formData.value.access) {
        this.formData.patchValue({
          login: false,
          logout: false,
          access: false,
        })
      }
    }
  }

  onChange() {
    setTimeout(() => {
      if (this.formData.value.login && this.formData.value.logout && this.formData.value.access) {
        if (!this.formData.value.all) {
          this.formData.patchValue({
            all: true
          })
        }
        return
      } else {
        if (this.formData.value.all) {
          this.formData.patchValue({
            all: false
          })
        }
        return
      }
    }, 500);
  }



  handleOk(item: any) {
    console.log("handleOk", this.formData.value)
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    this._modalRef.close({
      ...item,
      isUpdate: !!this.data
    });
  }

  onCancel() {
    this._modalRef.close();
  }

}

