import {Component, OnInit, Input} from '@angular/core';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import _ from 'lodash';
import * as uuid from "uuid";
import {PhieuXuatKhoService} from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import {
  BienBanTinhKhoService
} from './../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BienBanTinhKho.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {checkPrice} from "../../../../../models/KeHoachBanDauGia";
import {QthtChotGiaNhapXuatService} from "../../../../../services/quantri-hethong/qthtChotGiaNhapXuat.service";

@Component({
  selector: 'app-bdg-bien-ban-tinh-kho',
  templateUrl: './bien-ban-tinh-kho.component.html',
  styleUrls: ['./bien-ban-tinh-kho.component.scss']
})
export class BienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idKiemnghiem: number = 0;
  isViewKiemnghiem: boolean = false;
  idBangKe: number = 0;
  isViewBangKe: boolean = false;
  idXuatKho: number = 0;
  isViewXuatKho: boolean = false;
  checkPrice: checkPrice;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private qthtChotGiaNhapXuatService: QthtChotGiaNhapXuatService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoService);
    this.formData = this.fb.group({
      nam: null,
      soQdNv: null,
      soBbTinhKho: null,
      ngayLapBienBanTu: null,
      ngayLapBienBanDen: null,
      ngayBatDauXuatTu: null,
      ngayBatDauXuatDen: null,
      ngayKetThucXuatTu: null,
      ngayKetThucXuatDen: null,
      thoiGianGiaoNhanTu: null,
      thoiGianGiaoNhanDen: null,
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
      soBbTinhKho: null,
      ngayLapBienBan: null,
      soPhieuKiemNghiem: null,
      tenTrangThai: null,
      soBangKeHang: null,
      soPhieuXuatKho: null,
      ngayXuatKho: null,
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await this.search();
      await this.checkChotDieuChinhGia();
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
        const lv1ChildData = _(tenDiemKhoGroup).groupBy((row) => row.soBbTinhKho).map((group, key) => {
          const lv2IdVirtual = uuid.v4();
          this.expandSetString.add(lv2IdVirtual);
          return {
            idVirtual: lv2IdVirtual,
            tenLoKho: group[0].tenLoKho || "",
            tenNganKho: group[0].tenNganKho || "",
            tenNhaKho: group[0].tenNhaKho || "",
            soPhieuKiemNghiem: group[0].soPhieuKiemNghiem || "",
            idPhieuKiemNghiem: group[0].idPhieuKiemNghiem || "",
            id: group[0].id || "",
            soBbTinhKho: key || "",
            ngayLapBienBan: group[0].ngayLapBienBan || "",
            trangThai: group[0].trangThai || "",
            tenTrangThai: group[0].tenTrangThai || "",
            childData: group[0].children || "",
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

  async checkChotDieuChinhGia() {
    try {
      this.checkPrice = new checkPrice();
      this.spinner.show();
      const res = await this.qthtChotGiaNhapXuatService.checkChotGia({});
      if (res && res.msg === MESSAGE.SUCCESS && res.data) {
        this.checkPrice.boolean = res.data;
        this.checkPrice.msgSuccess = 'Việc xuất hàng đang được tạm dừng để chốt điều chỉnh giá. Vui lòng quay lại thực hiện sau!.';
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      this.spinner.hide();
    }
  }

  redirectDetail(id, isView: boolean) {
    if (id === 0 && this.checkPrice.boolean) {
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
      case 'kiemNghiem' :
        this.idKiemnghiem = id;
        this.isViewKiemnghiem = true;
        break;
      case 'bangKe' :
        this.idBangKe = id;
        this.isViewBangKe = true;
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
      case 'bangKe' :
        this.idBangKe = null;
        this.isViewBangKe = false;
        break;
      case 'xuatKho' :
        this.idXuatKho = null;
        this.isViewXuatKho = false;
        break;
      default:
        break;
    }
  }

  disabledStartNgayLapBbTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayLapBienBanDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayLapBienBanDen.getFullYear(), this.formData.value.ngayLapBienBanDen.getMonth(), this.formData.value.ngayLapBienBanDen.getDate());
    return startDay > endDay;
  };

  disabledStartNgayLapBbDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLapBienBanTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayLapBienBanTu.getFullYear(), this.formData.value.ngayLapBienBanTu.getMonth(), this.formData.value.ngayLapBienBanTu.getDate());
    return endDay < startDay;
  };

  disabledStartNgayBatDauXuatTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayBatDauXuatDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayBatDauXuatDen.getFullYear(), this.formData.value.ngayBatDauXuatDen.getMonth(), this.formData.value.ngayBatDauXuatDen.getDate());
    return startDay > endDay;
  };

  disabledStartNgayBatDauXuatDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBatDauXuatTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayBatDauXuatTu.getFullYear(), this.formData.value.ngayBatDauXuatTu.getMonth(), this.formData.value.ngayBatDauXuatTu.getDate());
    return endDay < startDay;
  };

  disabledStartNgayKetThucXuatTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKetThucXuatDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKetThucXuatDen.getFullYear(), this.formData.value.ngayKetThucXuatDen.getMonth(), this.formData.value.ngayKetThucXuatDen.getDate());
    return startDay > endDay;
  };

  disabledStartNgayKetThucXuatDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKetThucXuatTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKetThucXuatTu.getFullYear(), this.formData.value.ngayKetThucXuatTu.getMonth(), this.formData.value.ngayKetThucXuatTu.getDate());
    return endDay < startDay;
  };

  disabledStartThoiHanXuatTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.thoiGianGiaoNhanDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.thoiGianGiaoNhanDen.getFullYear(), this.formData.value.thoiGianGiaoNhanDen.getMonth(), this.formData.value.thoiGianGiaoNhanDen.getDate());
    return startDay > endDay;
  };

  disabledStartThoiHanXuatTuDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.thoiGianGiaoNhanTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.thoiGianGiaoNhanTu.getFullYear(), this.formData.value.thoiGianGiaoNhanTu.getMonth(), this.formData.value.thoiGianGiaoNhanTu.getDate());
    return endDay < startDay;
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTDG_XK_VT_BBTK_XEM',
        THEM: 'XHDTQG_PTDG_XK_VT_BBTK_THEM',
        XOA: 'XHDTQG_PTDG_XK_VT_BBTK_XOA',
        DUYET_KTVBAOQUAN: 'XHDTQG_PTDG_XK_VT_BBTK_DUYET_KTVBQ',
        DUYET_KETOAN: 'XHDTQG_PTDG_XK_VT_BBTK_DUYET_KT',
        DUYET_LDCHICUC: 'XHDTQG_PTDG_XK_VT_BBTK_DUYET_LDCCUC',
      },
      LT: {
        XEM: 'XHDTQG_PTDG_XK_LT_BBTK_XEM',
        THEM: 'XHDTQG_PTDG_XK_LT_BBTK_THEM',
        XOA: 'XHDTQG_PTDG_XK_LT_BBTK_XOA',
        DUYET_KTVBAOQUAN: 'XHDTQG_PTDG_XK_LT_BBTK_DUYET_KTVBQ',
        DUYET_KETOAN: 'XHDTQG_PTDG_XK_LT_BBTK_DUYET_KT',
        DUYET_LDCHICUC: 'XHDTQG_PTDG_XK_LT_BBTK_DUYET_LDCCUC',
      },
    };
    const permissions = this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU) ? permissionMapping.VT : permissionMapping.LT;
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_KTVBQ,
                this.STATUS.CHO_DUYET_KT,
                this.STATUS.CHO_DUYET_LDCC,
                this.STATUS.DA_DUYET_LDCC,
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DU_THAO,
                this.STATUS.TU_CHOI_KTVBQ,
                this.STATUS.TU_CHOI_KT,
                this.STATUS.TU_CHOI_LDCC,
                this.STATUS.DA_DUYET_LDCC
              ].includes(data.trangThai) ||
              (data.trangThai === this.STATUS.CHO_DUYET_KTVBQ &&
                !this.userService.isAccessPermisson(permissions.DUYET_KTVBAOQUAN)) ||
              (data.trangThai === this.STATUS.CHO_DUYET_KT &&
                !this.userService.isAccessPermisson(permissions.DUYET_KETOAN)) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDCC &&
                !this.userService.isAccessPermisson(permissions.DUYET_LDCHICUC))))
        );
      case 'SUA':
        return [
          this.STATUS.DU_THAO,
          this.STATUS.TU_CHOI_KTVBQ,
          this.STATUS.TU_CHOI_KT,
          this.STATUS.TU_CHOI_LDCC
        ].includes(data.trangThai) && this.userService.isAccessPermisson(permissions.THEM);
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissions.DUYET_KTVBAOQUAN) &&
            data.trangThai === this.STATUS.CHO_DUYET_KTVBQ) ||
          (this.userService.isAccessPermisson(permissions.DUYET_KETOAN) &&
            data.trangThai === this.STATUS.CHO_DUYET_KT) ||
          (this.userService.isAccessPermisson(permissions.DUYET_LDCHICUC) &&
            data.trangThai === this.STATUS.CHO_DUYET_LDCC));
      case 'XOA':
        return data.trangThai === this.STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissions.XOA);
      default:
        return false;
    }
  }
}
