import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/tong-hop-de-xuat-ke-hoach-ban-dau-gia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      ngayThop: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDungThop: ''
    })
  }

  filterTable: any = {
    id: '',
    ngayTao: '',
    noiDungThop: '',
    namKh: '',
    soQdPd: '',
    tenLoaiVthh: '',
    tenTrangThai: '',
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

}
