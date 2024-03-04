import {Component, OnInit, Input} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  PhieuKtraCluongBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import _ from 'lodash';
import * as uuid from "uuid";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-phieu-ktra-cluong-btt',
  templateUrl: './phieu-ktra-cluong-btt.component.html',
  styleUrls: ['./phieu-ktra-cluong-btt.component.scss']
})
export class PhieuKtraCluongBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idLayMau: number = 0;
  isViewLayMau: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      soPhieuKiemNghiem: null,
      ngayKiemNghiemMauTu: null,
      ngayKiemNghiemMauDen: null,
      soBbLayMau: null,
      soBbTinhKho: null,
      loaiVthh: null,
    })
    this.filterTable = {
      soQdNv: null,
      namKh: null,
      tgianGiaoNhan: null,
      tenDiemKho: null,
      tenNhakho: null,
      tenNganKho: null,
      tenLoKho: null,
      soPhieuKiemNghiem: null,
      ngayKiemNghiemMau: null,
      soBbLayMau: null,
      ngayLayMau: null,
      soBbTinhKho: null,
      ngayLapTinhKho: null,
      tenTrangThai: null,
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async search(): Promise<void> {
    await this.spinner.show();
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
    await super.search();
    this.dataTable.forEach(s => s.idVirtual = uuid.v4());
    this.buildTableView();
    await this.spinner.hide();
  }

  buildTableView() {
    this.tableDataView = _(this.dataTable).groupBy("soQdNv").map((soQdNvGroup, soQdNvKey) => {
      const firstRowInGroup = _.find(soQdNvGroup, (row) => row.tenDiemKho === soQdNvGroup[0].tenDiemKho);
      firstRowInGroup.idVirtual = uuid.v4();
      this.expandSetString.add(firstRowInGroup.idVirtual);
      const childData = _(soQdNvGroup).groupBy("tenDiemKho").map((tenDiemKhoGroup, tenDiemKhoKey) => ({
        idVirtual: firstRowInGroup.idVirtual,
        tenDiemKho: tenDiemKhoKey || "",
        childData: tenDiemKhoGroup,
      })).value();
      return {
        idVirtual: firstRowInGroup.idVirtual,
        soQdNv: soQdNvKey || "",
        namKh: firstRowInGroup.namKh || "",
        idQdNv: firstRowInGroup.idQdNv || "",
        tgianGiaoNhan: firstRowInGroup.tgianGiaoNhan || "",
        childData,
      };
    }).value();
    this.expandAll();
  }

  expandAll() {
    this.dataTable.forEach(row => {
      this.expandSetString.add(row.idVirtual);
    });
  }

  onExpandStringChange(idVirtual: string, isExpanded: boolean): void {
    if (isExpanded) {
      this.expandSetString.add(idVirtual);
    } else {
      this.expandSetString.delete(idVirtual);
    }
  }

  redirectDetail(id, isView: boolean) {
    if (id === 0 && this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdNv' :
        this.idQdNv = id;
        this.isViewQdNv = true;
        break;
      case 'layMau' :
        this.idLayMau = id;
        this.isViewLayMau = true;
        break;
      case 'tinhKho' :
        this.idTinhKho = id;
        this.isViewTinhKho = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdNv' :
        this.idQdNv = null;
        this.isViewQdNv = false;
        break;
      case 'layMau' :
        this.idLayMau = null;
        this.isViewLayMau = false;
        break;
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
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

  disabledStartngayKnghiemTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKiemNghiemMauDen, 'ngayKiemNghiemMau');
  };

  disabledStartngayKnghiemDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKiemNghiemMauDen, 'ngayKiemNghiemMau');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTTT_KTCL_VT_KNCL_XEM',
        THEM: 'XHDTQG_PTTT_KTCL_VT_KNCL_THEM',
        XOA: 'XHDTQG_PTTT_KTCL_VT_KNCL_XOA',
        DUYET_TP: 'XHDTQG_PTTT_KTCL_VT_KNCL_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTTT_KTCL_VT_KNCL_DUYET_LDCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTTT_KTCL_LT_KNCL_XEM',
        THEM: 'XHDTQG_PTTT_KTCL_LT_KNCL_THEM',
        XOA: 'XHDTQG_PTTT_KTCL_LT_KNCL_XOA',
        DUYET_TP: 'XHDTQG_PTTT_KTCL_LT_KNCL_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTTT_KTCL_LT_KNCL_DUYET_LDCUC',
      },
    };
    const permissions = this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? permissionMapping.VT : permissionMapping.LT;
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_TP,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.DA_DUYET_LDC,
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
