import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import {MESSAGE} from "../../../../../constants/message";
import {LOAI_HANG_DTQG} from "../../../../../constants/config";

@Component({
  selector: 'app-danh-sach-quyet-dinh-phe-duyet-ket-qua',
  templateUrl: './danh-sach-quyet-dinh-phe-duyet-ket-qua.component.html',
  styleUrls: ['./danh-sach-quyet-dinh-phe-duyet-ket-qua.component.scss']
})
export class DanhSachQuyetDinhPheDuyetKetQuaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idThongTin: number = 0;
  isViewThongTin: boolean = false;
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      nam: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      soQdKq: [null],
      trichYeu: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      maDvi: [null]
    });
    this.filterTable = {
      nam: '',
      soQdKq: '',
      ngayPduyet: '',
      trichYeu: '',
      ngayKy: '',
      soQdPd: '',
      maThongBao: '',
      tenHinhThucDauGia: '',
      tenPthucDauGia: '',
      soTbKhongThanh: '',
      soBienBan: '',
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
        this.loadDsVthh(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
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
    ])
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async loadDsVthh() {
    const res = await this.danhMucService.loadDanhMucHangHoa().toPromise();
    if (res.msg !== MESSAGE.SUCCESS) return;
    const matchingItem = res.data.find(item => (
      (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) ?
        item.children.some(child => child.ma === this.loaiVthh) :
        item.ma === this.loaiVthh
    ));
    if (!matchingItem) return;
    if (this.loaiVthh === LOAI_HANG_DTQG.GAO || this.loaiVthh === LOAI_HANG_DTQG.THOC) {
      this.listCloaiVthh = matchingItem.children.find(child => child.ma === this.loaiVthh)?.children || [];
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.MUOI)) {
      this.listCloaiVthh = matchingItem.children || [];
    } else if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.listVthh = matchingItem.children || [];
    }
  }

  onChangeCloaiVthh(event) {
    this.formData.patchValue({
      cloaiVthh: null,
      tenCloaiVthh: null,
    });
    const selectedData = this.listVthh.find(item => item.ma === event);
    this.listCloaiVthh = selectedData ? selectedData.children : [];
  }

  openModal(id: number, modalType: string) {
    if (modalType === 'QdPd') {
      this.idQdPd = id;
      this.isViewQdPd = true;
    } else if (modalType === 'MaThongBao') {
      this.idThongTin = id;
      this.isViewThongTin = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'QdPd') {
      this.idQdPd = null;
      this.isViewQdPd = false;
    } else if (modalType === 'MaThongBao') {
      this.idThongTin = null;
      this.isViewThongTin = false;
    }
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayKyTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKyDen, 'ngayKy');
  };

  disabledNgayKyDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKyTu, 'ngayKy');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      VT: {
        XEM: 'XHDTQG_PTDG_TCKHBDG_VT_QDKQDG_XEM',
        THEM: 'XHDTQG_PTDG_TCKHBDG_VT_QDKQDG_THEM',
        XOA: 'XHDTQG_PTDG_TCKHBDG_VT_QDKQDG_XOA',
        DUYET_TP: 'XHDTQG_PTDG_TCKHBDG_VT_QDKQDG_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTDG_TCKHBDG_VT_QDKQDG_DUYET_LDC',
      },
      LT: {
        XEM: 'XHDTQG_PTDG_TCKHBDG_LT_QDKQDG_XEM',
        THEM: 'XHDTQG_PTDG_TCKHBDG_LT_QDKQDG_THEM',
        XOA: 'XHDTQG_PTDG_TCKHBDG_LT_QDKQDG_XOA',
        DUYET_TP: 'XHDTQG_PTDG_TCKHBDG_LT_QDKQDG_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTDG_TCKHBDG_LT_QDKQDG_DUYET_LDC',
      },
    };
    const permissions = this.loaiVthh === LOAI_HANG_DTQG.VAT_TU ? permissionMapping.VT : permissionMapping.LT;
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_TP,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.BAN_HANH,
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DU_THAO,
                this.STATUS.TU_CHOI_TP,
                this.STATUS.TU_CHOI_LDC,
                this.STATUS.BAN_HANH
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
