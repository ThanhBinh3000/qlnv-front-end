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
      id:[null],
      endPoint: [null],
      portNumber:[null],
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
        if (res.data) {
          this.formData.patchValue(res.data);
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


  async save() {
    this.spinner.show();
    try {
      let res = await this.createUpdate(this.formData.value);
      if (res) {
        this.getData()
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
}
