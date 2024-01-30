import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {DonviService} from "../../../../../services/donvi.service";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBttService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service";
import {MESSAGE} from "../../../../../constants/message";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-quyet-dinh-chao-gia',
  templateUrl: './quyet-dinh-chao-gia.component.html',
  styleUrls: ['./quyet-dinh-chao-gia.component.scss']
})
export class QuyetDinhChaoGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView = false;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdPdDc: number = 0;
  isViewQdPdDc: boolean = false;
  listTrangThai: any = [];

  constructor(
    private httpClient: HttpClient,
    private donviService: DonviService,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      namKh: null,
      loaiVthh: null,
      ngayCgiaTu: null,
      ngayCgiaDen: null,
    });
    this.filterTable = {
      soQdKq: null,
      ngayKy: null,
      trichYeu: null,
      tenDvi: null,
      soQdPd: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tenTrangThai: null,
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
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
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

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'QdDc':
        this.idQdPdDc = id;
        this.isViewQdPdDc = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = null;
        this.isViewQdPdKh = false;
        break;
      case 'QdDc':
        this.idQdPdDc = null;
        this.isViewQdPdDc = false;
        break;
      default:
        break;
    }
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayChaoGiaTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayCgiaDen, 'ngayCgia');
  };

  disabledNgayChaoGiaDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayCgiaTu, 'ngayCgia');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_XEM',
        THEM: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_THEM',
        XOA: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_XOA',
        DUYET_TP: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_DUYET_LDCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_XEM',
        THEM: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_THEM',
        XOA: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_XOA',
        DUYET_TP: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_DUYET_LDCUC',
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
