import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DeXuatKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
@Component({
  selector: 'app-de-xuat-kh-ban-truc-tiep',
  templateUrl: './de-xuat-kh-ban-truc-tiep.component.html',
  styleUrls: ['./de-xuat-kh-ban-truc-tiep.component.scss']
})
export class DeXuatKhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  dsDonvi: any[] = [];
  userdetail: any = {};
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    private donviService: DonviService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanTrucTiepService);
    this.formData = this.fb.group({
      namKh: [],
      soDxuat: [],
      maDvi: [],
      tenDvi: [],
      trichYeu: [],
      ngayTao: [],
      ngayKyQd: [],
      ngayPduyet: [],
      loaiVthh: [],

    });

    this.filterTable = {
      namKh: '',
      soDxuat: '',
      tenDvi: '',
      maDvi: '',
      ngayTao: '',
      ngayPduyet: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soQdCtieu: '',
      tenTrangThai: '',
      tenTrangThaiTh: ''
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      this.initData()
      await this.timKiem();
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }
  }

  async timKiem() {
    if (this.formData.value.ngayTao) {
      this.formData.value.ngayTaoTu = dayjs(this.formData.value.ngayTao[0]).format('YYYY-MM-DD')
      this.formData.value.ngayTaoDen = dayjs(this.formData.value.ngayTao[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayPduyet) {
      this.formData.value.ngayDuyetTu = dayjs(this.formData.value.ngayPduyet[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDuyetDen = dayjs(this.formData.value.ngayPduyet[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKyQd) {
      this.formData.value.ngayKyQdTu = dayjs(this.formData.value.ngayKyQd[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKyQdDen = dayjs(this.formData.value.ngayKyQd[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }
}
