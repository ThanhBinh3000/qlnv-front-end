import { Component, Input, OnInit } from '@angular/core';
import { MESSAGE } from "../../../../../constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { HoSoKyThuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/ho-so-ky-thuat-btt.service';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-ho-so-ky-thuat-btt',
  templateUrl: './ho-so-ky-thuat-btt.component.html',
  styleUrls: ['./ho-so-ky-thuat-btt.component.scss']
})
export class HoSoKyThuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private hoSoKyThuatBttService: HoSoKyThuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatBttService);
    this.formData = this.fb.group({
      namKh: null,
      maDvi: null,
      maDiemKho: null,
      soQd: null,
      loaiVthh: null,
      trichYeu: null,
      ngayTao: null,
    })

    this.filterTable = {
      nam: '',
      soQd: '',
      ngayTao: '',
      soHd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGnhan: '',
      trichYeu: '',
      bbTinhKho: '',
      bbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


}
