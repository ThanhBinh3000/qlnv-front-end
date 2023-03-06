import { Component, Input, OnInit } from '@angular/core';
import { MESSAGE } from "../../../../../constants/message";
import * as dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../../services/user.service";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { QuyetDinhDcBanttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/dieuchinh-kehoach-bantt/quyet-dinh-dc-bantt.service';

@Component({
  selector: 'app-qd-dieuchinh-khbtt',
  templateUrl: './qd-dieuchinh-khbtt.component.html',
  styleUrls: ['./qd-dieuchinh-khbtt.component.scss']
})
export class QdDieuchinhKhbttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDcBanttService: QuyetDinhDcBanttService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDcBanttService);
    this.formData = this.fb.group({
      namKh: null,
      ngayKyDc: null,
      soQdDc: null,
      soQdPd: null,
      trichYeu: null,
      loaiVthh: null,
      soTrHdr: null,
    })

    this.filterTable = {
      namKh: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdGoc: '',
      trichYeu: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      trangThai: '',
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
