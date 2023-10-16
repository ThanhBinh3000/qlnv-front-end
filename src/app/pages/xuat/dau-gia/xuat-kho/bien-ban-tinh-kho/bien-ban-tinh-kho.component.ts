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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
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
      soQdNv: '',
      nam: '',
      ngayKyQdNv: '',
      tenDiemKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soBbTinhKho: '',
      ngayLapBienBan: '',
      soPhieuKiemNghiem: '',
      tenTrangThai: '',
      soBangKeHang: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
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
        ngayKyQdNv: firstRowInGroup.ngayKyQdNv || "",
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

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledStartNgayLapBbTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayLapBienBanTu, 'ngayLapBienBan');
  };

  disabledStartNgayLapBbDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayLapBienBanDen, 'ngayLapBienBan');
  };

  disabledStartNgayBatDauXuatTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayBatDauXuatTu, 'ngayBatDauXuat');
  };

  disabledStartNgayBatDauXuatDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayBatDauXuatDen, 'ngayBatDauXuat');
  };

  disabledStartNgayKetThucXuatTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKetThucXuatTu, 'ngayKetThucXuat');
  };

  disabledStartNgayKetThucXuatDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKetThucXuatDen, 'ngayKetThucXuat');
  };

  disabledStartThoiHanXuatTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.thoiGianGiaoNhanTu, 'thoiGianGiaoNhan');
  };

  disabledStartThoiHanXuatTuDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.thoiGianGiaoNhanDen, 'thoiGianGiaoNhan');
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
    const permissions = this.loaiVthh === LOAI_HANG_DTQG.VAT_TU ? permissionMapping.VT : permissionMapping.LT;
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
