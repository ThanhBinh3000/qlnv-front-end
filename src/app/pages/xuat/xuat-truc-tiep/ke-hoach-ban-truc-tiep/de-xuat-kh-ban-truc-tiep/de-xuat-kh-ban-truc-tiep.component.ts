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

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
  ];

  listTrangThaiTh: any[] = [
    { ma: this.STATUS.CHUA_TONG_HOP, giaTri: 'Chưa Tổng Hợp' },
    { ma: this.STATUS.DA_TONG_HOP, giaTri: 'Đã Tổng Hợp' },
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' },
  ];
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
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      soQdCtieu: '',
      tenTrangThai: '',
      tenTrangThaiTh: this.listTrangThaiTh
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await Promise.all([
        this.timKiem(),
        this.initData()
      ]);
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
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
    })
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

  clearFilter() {
    this.formData.reset();
    this.timKiem();
  }
}
