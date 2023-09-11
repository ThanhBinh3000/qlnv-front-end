import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  DeXuatKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/de-xuat-kh-ban-truc-tiep.service';
import {isEmpty} from 'lodash';
import {DonviService} from 'src/app/services/donvi.service';
import {CHUC_NANG} from "../../../../../constants/status";
import {XuatTrucTiepComponent} from "../../xuat-truc-tiep.component";

@Component({
  selector: 'app-de-xuat-kh-ban-truc-tiep',
  templateUrl: './de-xuat-kh-ban-truc-tiep.component.html',
  styleUrls: ['./de-xuat-kh-ban-truc-tiep.component.scss']
})

export class DeXuatKhBanTrucTiepComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTrucTiepComponent
  dsDonvi: any[] = [];
  userdetail: any = {};
  isView = false;
  idChiTieu: number = 0;
  isViewChiTieu: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idThop: number = 0;
  isViewThop: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
  ];
  listTrangThaiTh: any[] = [
    {ma: this.STATUS.CHUA_TONG_HOP, giaTri: 'Chưa Tổng Hợp'},
    {ma: this.STATUS.DA_TONG_HOP, giaTri: 'Đã Tổng Hợp'},
    {ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ'},
    {ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ'},
    {ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
    private xuatTrucTiepComponent: XuatTrucTiepComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanTrucTiepService);
    this.vldTrangThai = this.xuatTrucTiepComponent;
    this.formData = this.fb.group({
      namKh: null,
      soDxuat: null,
      maDvi: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      ngayDuyetTu: null,
      ngayDuyetDen: null,
      trichYeu: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      soTrHdr: null,
      loaiVthh: null,
    });

    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      slDviTsan: '',
      soHdongDaKy: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search(),
        this.initData()
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
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
    this.dsDonvi = isEmpty(dsTong) ? [] : dsTong.data;
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([this.timKiem(), this.search()]);
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(modalName: string, id: number) {
    switch (modalName) {
      case 'ChiTieu':
        this.idChiTieu = id;
        this.isViewChiTieu = true;
        break;
      case 'QdPd':
        this.idQdPd = id;
        this.isViewQdPd = true;
        break;
      case 'Th':
        this.idThop = id;
        this.isViewThop = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalName: string) {
    switch (modalName) {
      case 'ChiTieu':
        this.idChiTieu = null;
        this.isViewChiTieu = false;
        break;
      case 'QdPd':
        this.idQdPd = null;
        this.isViewQdPd = false;
        break;
      case 'Th':
        this.idThop = null;
        this.isViewThop = false;
        break;
      default:
        break;
    }
  }

  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayTaoDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
  };

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayDuyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayDuyetDen.getTime();
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetTu.getTime();
  };

  disabledNgayKyQdTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyQdDen.getTime();
  };

  disabledNgayKyQdDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdTu.getTime();
  };
}
