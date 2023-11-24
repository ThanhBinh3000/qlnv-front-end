import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import dayjs from "dayjs";
import { chain, cloneDeep } from 'lodash';
import * as uuid from "uuid";
import { CHUC_NANG, STATUS } from "src/app/constants/status";

@Component({
  selector: 'app-bien-ban-lay-mau',
  templateUrl: './bien-ban-lay-mau.component.html',
  styleUrls: ['./bien-ban-lay-mau.component.scss']
})
export class BienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() loaiXuat: any;
  @Input() loaiVthh: any;
  @Input() inputService: any;
  @Input() inputServiceGnv: any;
  @Input() loaiChon: string;
  @Input() maQuyen: MA_QUYEN_BBLM = { XEM: '', THEM: '', XOA: '', EXPORT: '', IN: '', DUYET_LDCC: '' };
  inputData: any;
  expandSetString = new Set<string>();
  isView: any = false;
  // public vldTrangThai: CuuTroVienTroComponent;
  // CHUC_NANG = CHUC_NANG;
  idQdGnv: any;
  showQdGnv: boolean = false;
  tableDataView: any = [];
  CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    // this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      soBienBan: null,
      soQdGiaoNvXh: null,
      dviKiemNghiem: null,
      tenDvi: null,
      maDvi: null,
      ngayLayMau: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      type: null,
      loaiVthh: null,
      loaiXuat: null
    })
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        type: this.loaiXuat
      });
      super.service = this.inputService;
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    try {
      await this.spinner.show();
      if (this.formData.value.ngayLayMau) {
        this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
        this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
      }
      await super.search();
      this.dataTable.forEach(s => s.idVirtual = uuid.v4());
      this.buildTableView();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  buildTableView() {
    this.tableDataView = chain(this.dataTable)
      .groupBy("soQdGnv")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenDiemKho")
          .map((v, k) => {
            let r = value.find(s => s.tenDiemKho === k);
            if (r) {
              r.idVirtual = uuid.v4();
              this.expandSetString.add(r.idVirtual);
              return {
                idVirtual: r.idVirtual,
                tenDiemKho: k,
                childData: v
              };
            }
          }).value();
        let row = value.find(s => s.soQdGnv === key)
        this.expandSetString.add(row.idVirtual);
        return {
          idVirtual: row.idVirtual,
          soQdGnv: key,
          nam: row.nam,
          idQdGnv: row.idQdGnv,
          ngayKyQdGnv: row.ngayKyQdGnv,
          childData: rs
        };
      }).value();
    this.expandAll()

  }


  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean, data?: any) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
    this.inputData = data;
    // this.isViewDetail = isView ?? false;
  }

  openQdGnvModal(id: number) {
    this.idQdGnv = id;
    this.showQdGnv = true;
  }

  closeQdGnvModal() {
    this.idQdGnv = null;
    this.showQdGnv = false;
  }

  disabledStartNgayLayMau = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayLayMauDen) {
      return startValue.getTime() > this.formData.value.ngayLayMauDen.getTime();
    }
    return false;
  };

  disabledEndNgayLayMau = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLayMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayLayMauDen.getTime();
  };

  checkStatusPermission(data: any, action: any) {
    let mapQuyen = {
      XEM: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH,
      ],
      SUA: [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDTC, STATUS.TU_CHOI_LDV, STATUS.TU_CHOI_LDC, STATUS.TU_CHOI_LDCC],
      XOA: [STATUS.DU_THAO],
      DUYET_LDTC: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP: [STATUS.CHO_DUYET_TP],
      DUYET_LDV: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC: [STATUS.CHO_DUYET_LDC],
      DUYET_LDCC: [STATUS.CHO_DUYET_LDCC],
      DUYET_KTVBQ: [STATUS.CHO_DUYET_KTVBQ],
      DUYET_KT: [STATUS.CHO_DUYET_KT],
      TAO_QD: [STATUS.DA_DUYET_LDV],

      XEM_NO: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH,
      ],
      SUA_NO: [],
      XOA_NO: [],
      DUYET_LDTC_NO: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP_NO: [STATUS.CHO_DUYET_TP],
      DUYET_LDV_NO: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC_NO: [STATUS.CHO_DUYET_LDC],
      DUYET_LDCC_NO: [STATUS.CHO_DUYET_LDCC],
      DUYET_KTVBQ_NO: [STATUS.CHO_DUYET_KTVBQ],
      DUYET_KT_NO: [STATUS.CHO_DUYET_KT],
      TAO_QD_NO: []
    };
    let actionTmp = cloneDeep(action);
    if (data.maDvi !== this.userService.getUserLogin().MA_PHONG_BAN) {
      actionTmp = actionTmp + "_NO";
    }
    if (data) {
      return mapQuyen[actionTmp].includes(data.trangThai)
    } else {
      return false;
    }
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    if (this.userService.isChiCuc() && [STATUS.DU_THAO, STATUS.TU_CHOI_LDCC].includes(trangThai) && this.userService.isAccessPermisson(this.maQuyen.THEM)) {
      return true
    }
    return false
  };
  checkRoleApprove(trangThai: STATUS): boolean {
    if (this.userService.isChiCuc() && (STATUS.CHO_DUYET_LDCC === trangThai && this.userService.isAccessPermisson(this.maQuyen.DUYET_LDCC))) {
      return true
    }
    return false
  }
  checkRoleDelete(trangThai: STATUS): boolean {
    if (this.userService.isChiCuc() && ([STATUS.DU_THAO].includes(trangThai) && this.userService.isAccessPermisson(this.maQuyen.XOA))) {
      return true
    }
    return false
  };
  checkRoleView(trangThai: STATUS): boolean {
    if (!this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson(this.maQuyen.XEM)) {
      return true
    }
    return false
  }
  checkRoleAdd(): boolean {
    if (this.userService.isChiCuc() && this.userService.isAccessPermisson(this.maQuyen.THEM)) {
      return true;
    }
    return false
  }
  checkRoleXoaDs(): boolean {
    if (this.userService.isChiCuc() && this.userService.isAccessPermisson(this.maQuyen.XOA)) {
      return true;
    }
    return false
  }
  checkRoleExport() {
    if (this.userService.isAccessPermisson(this.maQuyen.EXPORT)) {
      return true;
    }
    return false
  }
}
export interface MA_QUYEN_BBLM {
  THEM: string;
  XOA: string;
  XEM: string;
  DUYET_LDCC: string;
  IN: string;
  EXPORT: string
}

