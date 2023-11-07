import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {
  BienBanHaoDoiBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-hao-doi-btt.service';
import _ from 'lodash';
import * as uuid from "uuid";

@Component({
  selector: 'app-bien-ban-hao-doi-btt',
  templateUrl: './bien-ban-hao-doi-btt.component.html',
  styleUrls: ['./bien-ban-hao-doi-btt.component.scss']
})
export class BienBanHaoDoiBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;
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
    private bienBanHaoDoiBttService: BienBanHaoDoiBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      soBbHaoDoi: null,
      ngayLapBienBanTu: null,
      ngayLapBienBanDen: null,
      ngayBatDauXuatTu: null,
      ngayBatDauXuatDen: null,
      ngayKetThucXuatTu: null,
      ngayKetThucXuatDen: null,
      tgianGiaoNhanTu: null,
      tgianGiaoNhanDen: null,
      loaiVthh: null,
    })
    this.filterTable = {
      soQdNv: '',
      namKh: '',
      tgianGiaoNhan: '',
      tenDiemKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soBbHaoDoi: '',
      ngayLapBienBan: '',
      soBbTinhKho: '',
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
        const lv1ChildData = _(tenDiemKhoGroup).groupBy((row) => row.soBbHaoDoi).map((group, key) => {
          const lv2IdVirtual = uuid.v4();
          this.expandSetString.add(lv2IdVirtual);
          return {
            idVirtual: lv2IdVirtual,
            tenLoKho: group[0].tenLoKho || "",
            tenNganKho: group[0].tenNganKho || "",
            tenNhaKho: group[0].tenNhaKho || "",
            soBbHaoDoi: key || "",
            ngayLapBienBan: group[0].ngayLapBienBan || "",
            idBbTinhKho: group[0].idBbTinhKho || "",
            soBbTinhKho: group[0].soBbTinhKho || "",
            idPhieuKiemNghiem: group[0].idPhieuKiemNghiem || "",
            soPhieuKiemNghiem: group[0].soPhieuKiemNghiem || "",
            id: group[0].id || "",
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
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
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

  disabledStartNgayLapBienBanTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayLapBienBanTu, 'ngayLapBienBan');
  };

  disabledStartNgayLapBienBanDen = (endValue: Date): boolean => {
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

  disabledStartTgianGiaoNhanTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.tgianGiaoNhanTu, 'tgianGiaoNhan');
  };

  disabledStartTgianGiaoNhanDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.tgianGiaoNhanDen, 'tgianGiaoNhan');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissions = {
      XEM: 'XHDTQG_PTTT_XK_LT_BBHD_XEM',
      THEM: 'XHDTQG_PTTT_XK_LT_BBHD_THEM',
      XOA: 'XHDTQG_PTTT_XK_LT_BBHD_XOA',
      DUYET_KTVBAOQUAN: 'XHDTQG_PTTT_XK_LT_BBHD_DUYET_KTVBQ',
      DUYET_KETOAN: 'XHDTQG_PTTT_XK_LT_BBHD_DUYET_KT',
      DUYET_LDCHICUC: 'XHDTQG_PTTT_XK_LT_BBHD_DUYET_LDCCUC',
    };
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
