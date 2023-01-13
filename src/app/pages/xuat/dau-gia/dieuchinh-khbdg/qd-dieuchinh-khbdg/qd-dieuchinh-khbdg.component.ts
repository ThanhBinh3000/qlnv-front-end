import { Component, Input, OnInit } from '@angular/core';
import { MESSAGE } from "../../../../../constants/message";
import * as dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../../services/user.service";

import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qd-dieuchinh-khbdg',
  templateUrl: './qd-dieuchinh-khbdg.component.html',
  styleUrls: ['./qd-dieuchinh-khbdg.component.scss']
})
export class QdDieuchinhKhbdgComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDchinhKhBdgService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      soQdPd: null,
      trichYeu: null,
      loaiVthh: null,
      ngayKyQd: null,
      soTrHdr: null,
      soQdDc: null,
    })

    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      tenTrangThai: '',
    };

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

}
