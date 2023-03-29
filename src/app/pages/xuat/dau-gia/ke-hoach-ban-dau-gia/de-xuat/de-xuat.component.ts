import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DeXuatKhBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-de-xuat',
  templateUrl: './de-xuat.component.html',
  styleUrls: ['./de-xuat.component.scss']
})
export class DeXuatComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  idQdChiTieu: any;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanDauGiaService);
    this.formData = this.fb.group({
      namKh: [dayjs().get('year')],
      soDxuat: [],
      ngayTao: [],
      ngayPduyet: [],
      loaiVthh: [],
      trichYeu: [],
      maDvi: [],
      trangThaiList: []
    });

    this.filterTable = {
      namKh: '',
      soDxuat: '',
      ngayTao: '',
      ngayPduyet: '',
      ngayKyQd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      soQdCtieu: '',
      soQdPd: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
        trangThaiList: this.userService.isTongCuc() ? [this.STATUS.DA_DUYET_LDC, this.STATUS.DA_DUYET_CBV, this.STATUS.TU_CHOI_CBV] : null
      })
      await this.search();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openViewChiTieu(idQdChiTieu: number) {
    this.idQdChiTieu = idQdChiTieu;
  }

  closeViewChiTieu() {
    this.idQdChiTieu = null;
  }
}
