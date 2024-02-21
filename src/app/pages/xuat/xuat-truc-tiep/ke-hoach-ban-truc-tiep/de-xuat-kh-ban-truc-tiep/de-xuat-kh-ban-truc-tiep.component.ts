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
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-de-xuat-kh-ban-truc-tiep',
  templateUrl: './de-xuat-kh-ban-truc-tiep.component.html',
  styleUrls: ['./de-xuat-kh-ban-truc-tiep.component.scss']
})

export class DeXuatKhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  dsDonvi: any[] = [];
  isView = false;
  idChiTieu: number = 0;
  isViewChiTieu: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idThop: number = 0;
  isViewThop: boolean = false;
  listTrangThai: any = [];
  listTrangThaiTh: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatKhBanTrucTiepService: DeXuatKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanTrucTiepService);
    this.formData = this.fb.group({
      namKh: null,
      soDxuat: null,
      maDviCuc: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      ngayDuyetTu: null,
      ngayDuyetDen: null,
      trichYeu: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      loaiVthh: null,
    });

    this.filterTable = {
      namKh: null,
      soDxuat: null,
      ngayTao: null,
      ngayPduyet: null,
      soQdPd: null,
      ngayKyQd: null,
      trichYeu: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      slDviTsan: null,
      soQdCtieu: null,
      tenTrangThai: null,
      tenTrangThaiTh: null,
      idThop: null,
    };

    this.listTrangThai = [
      {
        value: this.STATUS.DU_THAO,
        text: 'Dự thảo'
      },
      {
        value: this.STATUS.CHO_DUYET_TP,
        text: 'Chờ duyệt - TP'
      },
      {
        value: this.STATUS.TU_CHOI_TP,
        text: 'Từ chối - TP'
      },
      {
        value: this.STATUS.CHO_DUYET_LDC,
        text: 'Chờ duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.TU_CHOI_LDC,
        text: 'Từ chối - LĐ Cục'
      },
      {
        value: this.STATUS.DA_DUYET_LDC,
        text: 'Đã duyệt - LĐ Cục'
      },
    ]

    this.listTrangThaiTh = [
      {
        value: this.STATUS.CHUA_TONG_HOP,
        text: 'Chưa Tổng Hợp'
      },
      {
        value: this.STATUS.DA_TONG_HOP,
        text: 'Đã Tổng Hợp'
      },
      {
        value: this.STATUS.CHUA_TAO_QD,
        text: 'Chưa Tạo QĐ'
      },
      {
        value: this.STATUS.DA_DU_THAO_QD,
        text: 'Đã Dự Thảo QĐ'
      },
      {
        value: this.STATUS.DA_BAN_HANH_QD,
        text: 'Đã Ban Hành QĐ'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
      })
      await this.loadDsTong();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    this.dsDonvi = isEmpty(dsTong) ? [] : dsTong.data;
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
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayTaoDen.getFullYear(), this.formData.value.ngayTaoDen.getMonth(), this.formData.value.ngayTaoDen.getDate());
    return startDay > endDay;
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayTaoTu.getFullYear(), this.formData.value.ngayTaoTu.getMonth(), this.formData.value.ngayTaoTu.getDate());
    return endDay < startDay;
  };

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayDuyetDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayDuyetDen.getFullYear(), this.formData.value.ngayDuyetDen.getMonth(), this.formData.value.ngayDuyetDen.getDate());
    return startDay > endDay;
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayDuyetTu.getFullYear(), this.formData.value.ngayDuyetTu.getMonth(), this.formData.value.ngayDuyetTu.getDate());
    return endDay < startDay;
  };

  disabledNgayKyQdTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKyQdDen.getFullYear(), this.formData.value.ngayKyQdDen.getMonth(), this.formData.value.ngayKyQdDen.getDate());
    return startDay > endDay;
  };

  disabledNgayKyQdDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKyQdTu.getFullYear(), this.formData.value.ngayKyQdTu.getMonth(), this.formData.value.ngayKyQdTu.getDate());
    return endDay < startDay;
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTTT_KHBTT_VT_DEXUAT_XEM',
        THEM: 'XHDTQG_PTTT_KHBTT_VT_DEXUAT_THEM',
        XOA: 'XHDTQG_PTTT_KHBTT_VT_DEXUAT_XOA',
        DUYET_TP: 'XHDTQG_PTTT_KHBTT_VT_DEXUAT_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTTT_KHBTT_VT_DEXUAT_DUYET_LDCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTTT_KHBTT_LT_DEXUAT_XEM',
        THEM: 'XHDTQG_PTTT_KHBTT_LT_DEXUAT_THEM',
        XOA: 'XHDTQG_PTTT_KHBTT_LT_DEXUAT_XOA',
        DUYET_TP: 'XHDTQG_PTTT_KHBTT_LT_DEXUAT_DUYET_TP',

        DUYET_LDCUC: 'XHDTQG_PTTT_KHBTT_LT_DEXUAT_DUYET_LDCUC',
      },
    };
    const permissions = this.loaiVthh === LOAI_HANG_DTQG.VAT_TU ? permissionMapping.VT : permissionMapping.LT;
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_TP,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.DA_DUYET_LDC
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DU_THAO,
                this.STATUS.TU_CHOI_TP,
                this.STATUS.TU_CHOI_LDC,
                this.STATUS.DA_DUYET_LDC
              ].includes(data.trangThai) ||
              (data.trangThai === this.STATUS.CHO_DUYET_TP &&
                !this.userService.isAccessPermisson(permissions.DUYET_TP)) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDC &&
                !this.userService.isAccessPermisson(permissions.DUYET_LDCUC))))
        );
      case 'SUA':
        return [
          this.STATUS.DU_THAO,
          this.STATUS.TU_CHOI_TP,
          this.STATUS.TU_CHOI_LDC
        ].includes(data.trangThai) && this.userService.isAccessPermisson(permissions.THEM);
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissions.DUYET_TP) &&
            data.trangThai === this.STATUS.CHO_DUYET_TP) ||
          (this.userService.isAccessPermisson(permissions.DUYET_LDCUC) &&
            data.trangThai === this.STATUS.CHO_DUYET_LDC)
        );
      case 'XOA':
        return data.trangThai === this.STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissions.XOA);
      default:
        return false;
    }
  }
}
