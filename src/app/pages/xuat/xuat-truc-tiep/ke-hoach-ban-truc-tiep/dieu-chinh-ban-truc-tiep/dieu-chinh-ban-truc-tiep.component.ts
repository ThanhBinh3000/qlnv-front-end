import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhDcBanttService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/dieuchinh-kehoach-bantt/quyet-dinh-dc-bantt.service";
import {UserService} from "../../../../../services/user.service";
import {MESSAGE} from "../../../../../constants/message";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-dieu-chinh-ban-truc-tiep',
  templateUrl: './dieu-chinh-ban-truc-tiep.component.html',
  styleUrls: ['./dieu-chinh-ban-truc-tiep.component.scss']
})
export class DieuChinhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
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
    private quyetDinhDcBanttService: QuyetDinhDcBanttService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDcBanttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdDc: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      trichYeu: null,
      loaiVthh: null,
    })

    this.filterTable = {
      namKh: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdPd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
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
      await Promise.all([
        this.timKiem(),
        this.search(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  timKiem() {
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

  openModal(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModal() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayKyQdDcTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKyDcDen, 'ngayKyDc');
  };

  disabledNgayKyQdDcDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKyDcTu, 'ngayKyDc');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissions = {
      XEM: 'XHDTQG_PTTT_DCKHBTT_XEM',
      THEM: 'XHDTQG_PTTT_DCKHBTT_THEM',
      BAN_HANH: 'XHDTQG_PTTT_DCKHBTT_BANHANH',
      XOA: 'XHDTQG_PTTT_DCKHBTT_XOA',
    };
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_LDV, this.STATUS.CHO_DUYET_LDTC, this.STATUS.BAN_HANH
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DA_LAP, this.STATUS.TU_CHOI_LDV, this.STATUS.TU_CHOI_LDTC,
                this.STATUS.BAN_HANH
              ].includes(data.trangThai) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDV) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDTC && !this.userService.isAccessPermisson(permissions.BAN_HANH))))
        );
      case 'SUA':
        return [
          this.STATUS.DA_LAP, this.STATUS.TU_CHOI_LDV, this.STATUS.TU_CHOI_LDTC
        ].includes(data.trangThai) && this.userService.isAccessPermisson(permissions.THEM);
      case 'PHEDUYET':
        return (
          (data.trangThai === this.STATUS.CHO_DUYET_LDV) ||
          (this.userService.isAccessPermisson(permissions.BAN_HANH) && data.trangThai === this.STATUS.CHO_DUYET_LDTC)
        );
      case 'XOA':
        return data.trangThai === this.STATUS.DA_LAP && this.userService.isAccessPermisson(permissions.XOA);
      default:
        return false;
    }
  }
}
