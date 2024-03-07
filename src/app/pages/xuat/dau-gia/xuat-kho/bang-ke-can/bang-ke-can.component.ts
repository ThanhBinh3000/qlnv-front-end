import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {MESSAGE} from "src/app/constants/message";
import {BangKeCanService} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BangKeCan.service';
import _ from 'lodash';
import * as uuid from "uuid";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-bdg-bang-ke-can',
  templateUrl: './bang-ke-can.component.html',
  styleUrls: ['./bang-ke-can.component.scss']
})
export class BangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idKiemnghiem: number = 0;
  isViewKiemnghiem: boolean = false;
  idXuatKho: number = 0;
  isViewXuatKho: boolean = false;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private bangKeCanService: BangKeCanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanService);
    this.formData = this.fb.group({
      nam: null,
      soQdNv: null,
      soBangKeHang: null,
      ngayLapBangKeTu: null,
      ngayLapBangKeDen: null,
      thoiGianGiaoNhanTu: null,
      thoiGianGiaoNhanDen: null,
      ngayXuatKhoTu: null,
      ngayXuatKhoDen: null,
      loaiVthh: null,
    })
    this.filterTable = {
      soQdNv: null,
      nam: null,
      thoiGianGiaoNhan: null,
      tenDiemKho: null,
      tenNhaKho: null,
      tenNganKho: null,
      tenLoKho: null,
      soPhieuKiemNghiem: null,
      ngayKiemNghiemMau: null,
      soBangKeHang: null,
      soPhieuXuatKho: null,
      ngayLapPhieu: null,
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
      const childData = _(soQdNvGroup).groupBy("tenDiemKho").map((tenDiemKhoGroup, tenDiemKhoKey) => {
        const lv1IdVirtual = uuid.v4();
        this.expandSetString.add(lv1IdVirtual);
        const lv1ChildData = _(tenDiemKhoGroup).groupBy((row) => row.soPhieuKiemNghiem).map((group, key) => {
          const lv2IdVirtual = uuid.v4();
          this.expandSetString.add(lv2IdVirtual);
          return {
            idVirtual: lv2IdVirtual,
            tenLoKho: group[0].tenLoKho || "",
            tenNganKho: group[0].tenNganKho || "",
            tenNhaKho: group[0].tenNhaKho || "",
            soPhieuKiemNghiem: key || "",
            idPhieuKiemNghiem: group[0].idPhieuKiemNghiem || "",
            ngayKiemNghiemMau: group[0].ngayKiemNghiemMau || "",
            childData: group,
          };
        }).value();
        return {
          idVirtual: lv1IdVirtual,
          tenDiemKho: tenDiemKhoKey || "",
          childData: lv1ChildData || "",
        };
      }).value();
      return {
        idVirtual: firstRowInGroup.idVirtual,
        soQdNv: soQdNvKey,
        nam: firstRowInGroup.nam || "",
        idQdNv: firstRowInGroup.idQdNv || "",
        thoiGianGiaoNhan: firstRowInGroup.thoiGianGiaoNhan || "",
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
    if (id === 0 && this.checkPrice && this.checkPrice.booleanNhapXuat) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
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
      case 'kiemNghiem' :
        this.idKiemnghiem = id;
        this.isViewKiemnghiem = true;
        break;
      case 'xuatKho' :
        this.idXuatKho = id;
        this.isViewXuatKho = true;
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
      case 'kiemNghiem' :
        this.idKiemnghiem = null;
        this.isViewKiemnghiem = false;
        break;
      case 'xuatKho' :
        this.idXuatKho = null;
        this.isViewXuatKho = false;
        break;
      default:
        break;
    }
  }

  disabledStartNgayTaoBangKeTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayLapBangKeDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayLapBangKeDen.getFullYear(), this.formData.value.ngayLapBangKeDen.getMonth(), this.formData.value.ngayLapBangKeDen.getDate());
    return startDay > endDay;
  };

  disabledStartNgayTaoBangKeDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLapBangKeTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayLapBangKeTu.getFullYear(), this.formData.value.ngayLapBangKeTu.getMonth(), this.formData.value.ngayLapBangKeTu.getDate());
    return endDay < startDay;
  };

  disabledStartThoiHanGiaoNhanTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.thoiGianGiaoNhanDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.thoiGianGiaoNhanDen.getFullYear(), this.formData.value.thoiGianGiaoNhanDen.getMonth(), this.formData.value.thoiGianGiaoNhanDen.getDate());
    return startDay > endDay;
  };

  disabledStartThoiHanGiaoNhanDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.thoiGianGiaoNhanTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.thoiGianGiaoNhanTu.getFullYear(), this.formData.value.thoiGianGiaoNhanTu.getMonth(), this.formData.value.thoiGianGiaoNhanTu.getDate());
    return endDay < startDay;
  };

  disabledStartNgayXuatKhoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayXuatKhoDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayXuatKhoDen.getFullYear(), this.formData.value.ngayXuatKhoDen.getMonth(), this.formData.value.ngayXuatKhoDen.getDate());
    return startDay > endDay;
  };

  disabledStartNgayXuatKhoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatKhoTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayXuatKhoTu.getFullYear(), this.formData.value.ngayXuatKhoTu.getMonth(), this.formData.value.ngayXuatKhoTu.getDate());
    return endDay < startDay;
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTDG_XK_VT_BKXVT_XEM',
        THEM: 'XHDTQG_PTDG_XK_VT_BKXVT_THEM',
        XOA: 'XHDTQG_PTDG_XK_VT_BKXVT_XOA',
        DUYET_LDCHICUC: 'XHDTQG_PTDG_XK_VT_BKXVT_DUYET_LDCCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTDG_XK_LT_BKCH_XEM',
        THEM: 'XHDTQG_PTDG_XK_LT_BKCH_THEM',
        XOA: 'XHDTQG_PTDG_XK_LT_BKCH_XOA',
        DUYET_LDCHICUC: 'XHDTQG_PTDG_XK_LT_BKCH_DUYET_LDCCUC',
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
