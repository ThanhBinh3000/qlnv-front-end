import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {
  QuyetDinhPdKhBdgService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-dieu-chinh',
  templateUrl: './dieu-chinh.component.html',
  styleUrls: ['./dieu-chinh.component.scss']
})
export class DieuChinhComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      nam: null,
      soQdDc: null,
      trichYeu: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      loaiVthh: null,
      maDvi: null,
      type: null,
    })

    this.filterTable = {
      nam: null,
      soCongVan: null,
      soQdDc: null,
      ngayKyDc: null,
      soQdCanDc: null,
      soQdPd: null,
      trichYeuDieuChinh: null,
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
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
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
      XEM: 'XHDTQG_PTDG_DCKHBDG_XEM',
      THEM: 'XHDTQG_PTDG_DCKHBDG_THEM',
      XOA: 'XHDTQG_PTDG_DCKHBDG_XOA',
      DUYET_LDVU: 'XHDTQG_PTDG_DCKHBDG_DUYET_LDVU',
      BAN_HANH: 'XHDTQG_PTDG_DCKHBDG_BANHANH',
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
