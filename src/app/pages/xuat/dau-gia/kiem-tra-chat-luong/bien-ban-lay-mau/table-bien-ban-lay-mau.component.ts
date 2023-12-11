import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import * as uuid from "uuid";
import {
  BienBanLayMauXhService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import _ from 'lodash';

@Component({
  selector: 'app-table-bien-ban-lay-mau',
  templateUrl: './table-bien-ban-lay-mau.component.html',
  styleUrls: ['./table-bien-ban-lay-mau.component.scss'],
})
export class TableBienBanLayMauComponent extends Base2Component implements OnInit {
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
    private bienBanLayMauXhService: BienBanLayMauXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauXhService);
    this.formData = this.fb.group({
      soBbLayMau: null,
      soQdNv: null,
      donViKnghiem: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      loaiVthh: null,
      maDvi: null,
    })
    this.filterTable = {
      soQdNv: null,
      nam: null,
      tgianGiaoHang: null,
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
        nam: firstRowInGroup.nam || "",
        idQdNv: firstRowInGroup.idQdNv || "",
        tgianGiaoHang: firstRowInGroup.tgianGiaoHang || "",
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

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayLayMauTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayLayMauTu, 'ngayLayMau');
  };

  disabledNgayLayMauDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayLayMauTu, 'ngayLayMau');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTDG_KTCL_VT_BBBGM_XEM',
        THEM: 'XHDTQG_PTDG_KTCL_VT_BBBGM_THEM',
        XOA: 'XHDTQG_PTDG_KTCL_VT_BBBGM_XOA',
        DUYET_LDCHICUC: 'XHDTQG_PTDG_KTCL_VT_BBBGM_DUYET_LDCCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTDG_KTCL_LT_BBLM_XEM',
        THEM: 'XHDTQG_PTDG_KTCL_LT_BBLM_THEM',
        XOA: 'XHDTQG_PTDG_KTCL_LT_BBLM_XOA',
        DUYET_LDCHICUC: 'XHDTQG_PTDG_KTCL_LT_BBLM_DUYET_LDCCUC',
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
