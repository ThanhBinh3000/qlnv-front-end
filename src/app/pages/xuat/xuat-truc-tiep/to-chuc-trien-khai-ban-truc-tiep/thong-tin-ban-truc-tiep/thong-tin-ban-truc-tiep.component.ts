import { Component, Input, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhPdKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
@Component({
  selector: 'app-thong-tin-ban-truc-tiep',
  templateUrl: './thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-ban-truc-tiep.component.scss']
})
export class ThongTinBanTrucTiepComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  isView: boolean = false;
  dsDonvi: any[] = [];
  userdetail: any = {};
  pthucBanTrucTiep: string;
  selectedId: number = 0;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.formData = this.fb.group({
      namKh: null,
      ngayChaoGia: null,
      toChucCaNhan: null,
      maDvi: null,
      tenDvi: null,
      loaiVthh: null,
      lastest: 1
    })

    this.filterTable = {
      soQdPd: '',
      pthucBanTrucTiep: '',
      ngayNhanCgia: '',
      soQdKq: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
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
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
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

    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      lastest: 1
    })

    await this.search();
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
  }

  redirectToChiTiet(isView: boolean, id: number, pthucBanTrucTiep: string) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.pthucBanTrucTiep = pthucBanTrucTiep;
  }
}
