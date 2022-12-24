import { Component, Input, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from "../../../../../../constants/message";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';

@Component({
  selector: 'app-thong-tin-dau-gia',
  templateUrl: './thong-tin-dau-gia.component.html',
  styleUrls: ['./thong-tin-dau-gia.component.scss']
})
export class ThongTinDauGiaComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      soDxuat: null,
      soQdPd: null,
      soQdPdKhBdg: null,
      thoiGianThucHien: null,
      soQdPdKqBdg: null,
      trichYeu: null,
      loaiVthh: null,
      ngayKyQd: null,
      soTrHdr: null,
      lastest: 1
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
    try {
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

}
