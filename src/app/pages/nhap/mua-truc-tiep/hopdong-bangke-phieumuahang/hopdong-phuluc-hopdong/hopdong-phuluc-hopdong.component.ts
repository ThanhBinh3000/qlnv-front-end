import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { STATUS } from "../../../../../constants/status";
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { HopdongPhulucHopdongService } from 'src/app/services/hopdong-phuluc-hopdong.service';
import { Base2Component } from './../../../../../components/base2/base2.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-hopdong-phuluc-hopdong',
  templateUrl: './hopdong-phuluc-hopdong.component.html',
  styleUrls: ['./hopdong-phuluc-hopdong.component.scss']
})
export class HopdongPhulucHopdongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  idChaoGia: number = 0;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,

    private hopdongPhulucHopdongService: HopdongPhulucHopdongService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongPhulucHopdongService);
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      soHd: [],
      tenHd: [],
      maDvi: [],
      tenDvi: [],
      ngayKy: [],
    });

    this.filterTable = {
      nam: '',
      soQdPdKhMtt: '',
      soQdKqMtt: '',
      tgianNkho: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',

    };
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  showList() {
    this.isDetail = false;
    this.search()
  }


}
