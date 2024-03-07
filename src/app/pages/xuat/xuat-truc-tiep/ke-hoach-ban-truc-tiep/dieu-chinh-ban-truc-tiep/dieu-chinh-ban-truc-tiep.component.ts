import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-dieu-chinh-ban-truc-tiep',
  templateUrl: './dieu-chinh-ban-truc-tiep.component.html',
  styleUrls: ['./dieu-chinh-ban-truc-tiep.component.scss']
})
export class DieuChinhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  lanDieuChinh: boolean = false;
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);
    this.formData = this.fb.group({
      namKh: null,
      soQdDc: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      trichYeu: null,
      loaiVthh: null,
      maDvi: null,
      type: null,
    })

    this.filterTable = {
      namKh: null,
      soQdDc: null,
      ngayKyDc: null,
      soQdCanDc: null,
      trichYeu: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      slDviTsan: null,
      tenTrangThai: null,
    };

    this.listTrangThai = [
      {
        value: this.STATUS.DA_LAP,
        text: 'Đã lập'
      },
      {
        value: this.STATUS.CHO_DUYET_LDV,
        text: 'Chờ Duyệt - LĐ Vụ'
      },
      {
        value: this.STATUS.TU_CHOI_LDV,
        text: 'Từ Chối - LĐ Vụ'
      },
      {
        value: this.STATUS.CHO_DUYET_LDTC,
        text: 'Chờ Duyệt - LĐ Tổng Cục'
      },
      {
        value: this.STATUS.TU_CHOI_LDTC,
        text: 'Từ Chối - LĐ Tổng Cục'
      },
      {
        value: this.STATUS.BAN_HANH,
        text: 'Ban Hanh'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        type: 'QDDC',
      })
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id, isView: boolean) {
    if (id === 0 && this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (id === 0 && this.checkPrice && this.checkPrice.booleanNhapXuat) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
      return;
    }
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, lanDieuChinh: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
    this.lanDieuChinh = lanDieuChinh === 1;
  }

  closeModal() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  disabledNgayKyQdDcTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDcDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKyDcDen.getFullYear(), this.formData.value.ngayKyDcDen.getMonth(), this.formData.value.ngayKyDcDen.getDate());
    return startDay > endDay;
  };

  disabledNgayKyQdDcDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyDcTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKyDcTu.getFullYear(), this.formData.value.ngayKyDcTu.getMonth(), this.formData.value.ngayKyDcTu.getDate());
    return endDay < startDay;
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissions = {
      XEM: 'XHDTQG_PTTT_DCKHBTT_XEM',
      THEM: 'XHDTQG_PTTT_DCKHBTT_THEM',
      XOA: 'XHDTQG_PTTT_DCKHBTT_XOA',
      DUYET_LDVU: 'XHDTQG_PTTT_DCKHBTT_DUYET_LDVU',
      BAN_HANH: 'XHDTQG_PTTT_DCKHBTT_BANHANH',
    };
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_LDV,
                this.STATUS.DA_DUYET_LDV,
                this.STATUS.BAN_HANH
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DA_LAP,
                this.STATUS.TU_CHOI_LDV,
                this.STATUS.TU_CHOI_LDTC,
                this.STATUS.BAN_HANH
              ].includes(data.trangThai) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDV &&
                !this.userService.isAccessPermisson(permissions.DUYET_LDVU)) ||
              (data.trangThai === this.STATUS.DA_DUYET_LDV &&
                !this.userService.isAccessPermisson(permissions.BAN_HANH))))
        );
      case 'SUA':
        return [
          this.STATUS.DA_LAP,
          this.STATUS.TU_CHOI_LDV,
          this.STATUS.TU_CHOI_LDTC
        ].includes(data.trangThai) && this.userService.isAccessPermisson(permissions.THEM);
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissions.DUYET_LDVU) &&
            data.trangThai === this.STATUS.CHO_DUYET_LDV) ||
          (this.userService.isAccessPermisson(permissions.BAN_HANH) &&
            data.trangThai === this.STATUS.DA_DUYET_LDV)
        );
      case 'XOA':
        return data.trangThai === this.STATUS.DA_LAP &&
          this.userService.isAccessPermisson(permissions.XOA);
      default:
        return false;
    }
  }
}
