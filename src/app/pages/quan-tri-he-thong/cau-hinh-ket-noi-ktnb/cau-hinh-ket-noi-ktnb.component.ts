import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CauHinhDangNhapService } from '../../../services/quantri-nguoidung/cau-hinh-dang-nhap';
import { MESSAGE } from '../../../constants/message';
import { Base2Component } from '../../../components/base2/base2.component';
import { CauHinhKetNoiKtnb } from '../../../services/quantri-hethong/cau-hinh-ket-noi-ktnb';

@Component({
  selector: 'app-cau-hinh-ket-noi-ktnb',
  templateUrl: './cau-hinh-ket-noi-ktnb.component.html',
  styleUrls: ['./cau-hinh-ket-noi-ktnb.component.scss']
})
export class CauHinhKetNoiKtnbComponent extends Base2Component implements OnInit {
  isView: boolean

  switchValue = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cauHinhKetNoiKtnb: CauHinhKetNoiKtnb,
  ) {
    super(httpClient, storageService, notification, spinner, modal, cauHinhKetNoiKtnb);
    this.formData = this.fb.group({
      endpoint: [null],
      port:[null],
      path: [null],
    })
  }

  async ngOnInit() {
    this.getData()

  }

  async getData() {
    try {
      let res = await this.cauHinhKetNoiKtnb.chiTiet();
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
      let res = await this.cauHinhKetNoiKtnb.capNhat(this.formData.value);
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
