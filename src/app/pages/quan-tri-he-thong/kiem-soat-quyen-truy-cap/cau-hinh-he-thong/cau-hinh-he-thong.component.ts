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
      writeLogAll: [false, [Validators.required]],
      writeLogLogin: [false, [Validators.required]],
      writeLogLogout: [false, [Validators.required]],
      writeLogUserActivity: [false, [Validators.required]],
    }
    );
  }

  ngOnInit(): void {
    if (this.data) {
      this.formData.patchValue({
        writeLogAll: this.data.writeLogAll,
        writeLogLogin: this.data.writeLogLogin,
        writeLogLogout: this.data.writeLogLogout,
        writeLogUserActivity: this.data.writeLogUserActivity,
      })
    }
  }

  onAll(all) {
    if (all) {
      this.formData.patchValue({
        writeLogLogin: true,
        writeLogLogout: true,
        writeLogUserActivity: true,
      })
    } else {
      if (this.formData.value.writeLogLogin && this.formData.value.writeLogLogout && this.formData.value.writeLogUserActivity) {
        this.formData.patchValue({
          writeLogLogin: false,
          writeLogLogout: false,
          writeLogUserActivity: false,
        })
      }
    }
  }

  onChange() {
    setTimeout(() => {
      if (this.formData.value.writeLogLogin && this.formData.value.writeLogLogout && this.formData.value.writeLogUserActivity) {
        if (!this.formData.value.writeLogAll) {
          this.formData.patchValue({
            writeLogAll: true
          })
        }
        return
      } else {
        if (this.formData.value.writeLogAll) {
          this.formData.patchValue({
            writeLogAll: false
          })
        }
        return
      }
    }, 500);
  }



  handleOk(item: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

}

