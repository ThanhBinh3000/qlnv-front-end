import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
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
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
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
      soQdNv: '',
      nam: '',
      ngayKyQdNv: '',
      tenDiemKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soPhieuKiemNghiem: '',
      ngayKiemNghiemMau: '',
      soPhieuXuatKho: '',
      soBangKeHang: '',
      ngayLapPhieu: '',
      tenTrangThai: '',
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

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledStartNgayTaoBangKeTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayLapBangKeTu, 'ngayLapBangKe');
  };

  disabledStartNgayTaoBangKeDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayLapBangKeDen, 'ngayLapBangKe');
  };

  disabledStartThoiHanGiaoNhanTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.thoiGianGiaoNhanTu, 'thoiGianGiaoNhan');
  };

  disabledStartThoiHanGiaoNhanDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.thoiGianGiaoNhanDen, 'thoiGianGiaoNhan');
  };

  disabledStartNgayXuatKhoTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayXuatKhoTu, 'ngayXuatKho');
  };

  disabledStartNgayXuatKhoDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayXuatKhoDen, 'ngayXuatKho');
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
    const permissions = this.loaiVthh === LOAI_HANG_DTQG.VAT_TU ? permissionMapping.VT : permissionMapping.LT;
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
