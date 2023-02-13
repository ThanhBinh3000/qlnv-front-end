import { Component, Input, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';

@Component({
  selector: 'app-thong-tin-ban-truc-tiep',
  templateUrl: './thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-ban-truc-tiep.component.scss']
})
export class ThongTinBanTrucTiepComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
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
      soDxuat: '',
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
}
