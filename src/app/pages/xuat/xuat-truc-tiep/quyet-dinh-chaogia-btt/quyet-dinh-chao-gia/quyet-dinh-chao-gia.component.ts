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
import {LOAI_HANG_DTQG} from "../../../../../constants/config";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-quyet-dinh-chao-gia',
  templateUrl: './quyet-dinh-chao-gia.component.html',
  styleUrls: ['./quyet-dinh-chao-gia.component.scss']
})
export class QuyetDinhChaoGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView = false;
  userdetail: any = {};
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
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
      soQdKq: '',
      ngayKy: '',
      maDvi: '',
      tenDvi: '',
      soQdPd: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      trangThai: '',
      tenTrangThai: '',
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
        value: this.STATUS.BAN_HANH,
        text: 'Ban hành'
      },
    ]
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
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([
      this.timKiem(),
      this.search()
    ]);
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModalQdPdKh(id: number) {
    this.idQdPdKh = id;
    this.isViewQdPdKh = true;
  }

  closeModalQdPdKh() {
    this.idQdPdKh = null;
    this.isViewQdPdKh = false;
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
        XEM: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_XEM',
        THEM: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_THEM',
        XOA: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_XOA',
        DUYET_TP: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQDG_DUYET_TP',
        BAN_HANH: 'XHDTQG_PTTT_TCKHBTT_VT_QDKQCG_BANHANH',
      },
      LT: {
        XEM: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_XEM',
        THEM: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_THEM',
        XOA: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_XOA',
        DUYET_TP: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQDG_DUYET_TP',
        BAN_HANH: 'XHDTQG_PTTT_TCKHBTT_LT_QDKQCG_BANHANH',
      },
    };
    const permissions = this.loaiVthh === LOAI_HANG_DTQG.VAT_TU ? permissionMapping.VT : permissionMapping.LT;
    switch (action) {
      case 'XEM':
        return this.userService.isAccessPermisson(permissions.XEM) &&
          (data.trangThai !== STATUS.DU_THAO &&
            data.trangThai !== STATUS.TU_CHOI_TP &&
            data.trangThai !== STATUS.TU_CHOI_LDC);
      case 'SUA':
        return (
          (data.trangThai === STATUS.DU_THAO ||
            data.trangThai === STATUS.TU_CHOI_TP ||
            data.trangThai === STATUS.TU_CHOI_LDC) &&
          this.userService.isAccessPermisson(permissions.THEM)
        );
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissions.DUYET_TP) &&
            data.trangThai === STATUS.CHO_DUYET_TP) ||
          (this.userService.isAccessPermisson(permissions.BAN_HANH) &&
            data.trangThai === STATUS.CHO_DUYET_LDC)
        );
      case 'XOA':
        return (
          data.trangThai === STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissions.XOA)
        );
      default:
        return false;
    }
  }
}
