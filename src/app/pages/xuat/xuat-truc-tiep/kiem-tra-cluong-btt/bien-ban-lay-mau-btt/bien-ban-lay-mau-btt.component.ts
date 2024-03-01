import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {
  BienBanLayMauBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import * as uuid from "uuid";
import _ from 'lodash';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-bien-ban-lay-mau-btt',
  templateUrl: './bien-ban-lay-mau-btt.component.html',
  styleUrls: ['./bien-ban-lay-mau-btt.component.scss']
})
export class BienBanLayMauBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;
  idHaoDoi: number = 0;
  isViewHaoDoi: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauBttService);
    this.formData = this.fb.group({
      soBbLayMau: null,
      soQdNv: null,
      donViKnghiem: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQdNv: null,
      namKh: null,
      tgianGiaoNhan: null,
      tenDiemKho: null,
      tenNhaKho: null,
      tenNganKho: null,
      tenLoKho: null,
      soBbLayMau: null,
      ngayLayMau: null,
      soBbTinhKho: null,
      ngayXuatDocKho: null,
      soBbHaoDoi: null,
      tenTrangThai: null,
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await this.search();
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

  redirectDetail(id, isView: boolean, idQdNv: number) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdNv = idQdNv
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdNv' :
        this.idQdNv = id;
        this.isViewQdNv = true;
        break;
      case 'tinhKho' :
        this.idTinhKho = id;
        this.isViewTinhKho = true;
        break;
      case 'haoDoi' :
        this.idHaoDoi = id;
        this.isViewHaoDoi = true;
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
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
        break;
      case 'haoDoi' :
        this.idHaoDoi = null;
        this.isViewHaoDoi = false;
        break;
      default:
        break;
    }
  }

  disabledNgayLayMauTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayLayMauDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayLayMauDen.getFullYear(), this.formData.value.ngayLayMauDen.getMonth(), this.formData.value.ngayLayMauDen.getDate());
    return startDay > endDay;
  };

  disabledNgayLayMauDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLayMauTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayLayMauTu.getFullYear(), this.formData.value.ngayLayMauTu.getMonth(), this.formData.value.ngayLayMauTu.getDate());
    return endDay < startDay;
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTTT_KTCL_VT_BBBGM_XEM',
        THEM: 'XHDTQG_PTTT_KTCL_VT_BBBGM_THEM',
        XOA: 'XHDTQG_PTTT_KTCL_VT_BBBGM_XOA',
        DUYET_LDCHICUC: 'XHDTQG_PTTT_KTCL_VT_BBBGM_DUYET_LDCCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTTT_KTCL_LT_BBLM_XEM',
        THEM: 'XHDTQG_PTTT_KTCL_LT_BBLM_THEM',
        XOA: 'XHDTQG_PTTT_KTCL_LT_BBLM_XOA',
        DUYET_LDCHICUC: 'XHDTQG_PTTT_KTCL_LT_BBLM_DUYET_LDCCUC',
      },
    };
    const permissions = this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? permissionMapping.VT : permissionMapping.LT;
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_LDCC,
                this.STATUS.DA_DUYET_LDCC,
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DU_THAO,
                this.STATUS.TU_CHOI_LDCC,
                this.STATUS.DA_DUYET_LDCC
              ].includes(data.trangThai) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDCC &&
                !this.userService.isAccessPermisson(permissions.DUYET_LDCHICUC))))
        );
      case 'SUA':
        return [
          this.STATUS.DU_THAO,
          this.STATUS.TU_CHOI_LDCC
        ].includes(data.trangThai) && this.userService.isAccessPermisson(permissions.THEM);
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissions.DUYET_LDCHICUC) &&
            data.trangThai === this.STATUS.CHO_DUYET_LDCC)
        );
      case 'XOA':
        return data.trangThai === this.STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissions.XOA);
      default:
        return false;
    }
  }
}
