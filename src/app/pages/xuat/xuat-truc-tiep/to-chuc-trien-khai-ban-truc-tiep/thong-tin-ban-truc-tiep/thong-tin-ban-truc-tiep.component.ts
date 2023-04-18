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
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdPdKq: number = 0;
  isViewQdPdKq: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật' },
    { ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật' },
    { ma: this.STATUS.HOAN_THANH_CAP_NHAT, giaTri: 'Hoàn thành cập nhật' },
  ];

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
      ngayCgiaTu: null,
      ngayCgiaDen: null,
      tochucCanhan: null,
      maDvi: null,
      maDviChiCuc: null,
      tenDvi: null,
      loaiVthh: null,
      trangThai: null,
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
      this.thimKiem();
      await Promise.all([
        this.search(),
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

  thimKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      trangThai: this.userService.isTongCuc() ? this.STATUS.HOAN_THANH_CAP_NHAT : null,
      lastest: 1
    })
  }
  clearFilter() {
    this.formData.reset();
    this.thimKiem();
    this.search();
  }

  redirectToChiTiet(isView: boolean, id: number, pthucBanTrucTiep: string) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.pthucBanTrucTiep = pthucBanTrucTiep;
  }

  openModalQdPdKh(id: number) {
    this.idQdPdKh = id;
    this.isViewQdPdKh = true;
  }

  closeModalQdPdKh() {
    this.idQdPdKh = null;
    this.isViewQdPdKh = false;
  }

  openModalQdPdKq(id: number) {
    this.idQdPdKq = id;
    this.isViewQdPdKq = true;
  }

  closeModalQdPdKq() {
    this.idQdPdKq = null;
    this.isViewQdPdKq = false;
  }

  disabledNgayChaoGiaTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayCgiaDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayCgiaDen.getTime();
  };

  disabledNgayChaoGiaDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayCgiaTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayCgiaTu.getTime();
  };
}
