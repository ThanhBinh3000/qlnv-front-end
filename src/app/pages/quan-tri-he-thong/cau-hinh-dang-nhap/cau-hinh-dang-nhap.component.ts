import { Component, OnInit } from '@angular/core';
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { Base2Component } from "src/app/components/base2/base2.component";
import { QLThongTinTienIchService } from 'src/app/services/quantri-nguoidung/quan-ly-thong-tin/quan-ly-thong-tin-tien-ich';
import { CauHinhDangNhapService } from 'src/app/services/quantri-nguoidung/cau-hinh-dang-nhap';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-cau-hinh-dang-nhap',
  templateUrl: './cau-hinh-dang-nhap.component.html',
  styleUrls: ['./cau-hinh-dang-nhap.component.scss']
})
export class CauHinhDangNhapComponent extends Base2Component implements OnInit {
  isView: boolean

  switchValue = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cauHinhDangNhapService: CauHinhDangNhapService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, cauHinhDangNhapService);
    this.formData = this.fb.group({
      maxNumberLogin: null,
      passwordRecoveryByMail: [false],
      isSizePassword: [false],
      sizePassword: null,
      includeNumberAndChar: null,
      isMinSpecial: [false],
      minSpecial: null,
    })

  }

  async ngOnInit() {
    this.getData()

  }

  async getData() {
    try {
      let res = await this.cauHinhDangNhapService.chiTiet();
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data.length > 0) {
          const data = res.data[0]
          this.formData.patchValue({
            ...data,
            isSizePassword: !!data.sizePassword,
            isMinSpecial: !!data.minSpecial
          })
        }

      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async onMinSpecial(isMinSpecial) {

  }

  async save() {
    console.log('formData', this.formData.value)
    this.spinner.show();
    if (!this.formData.value.isMinSpecial) this.formData.value.minSpecial = null
    if (!this.formData.value.isSizePassword) this.formData.value.sizePassword = null
    try {
      let res = await this.cauHinhDangNhapService.capNhat(this.formData.value);
      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        this.getData()
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

}
