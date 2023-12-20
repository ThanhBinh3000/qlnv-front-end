import { Component, Input, OnInit } from '@angular/core';
import { CuuTroVienTroComponent } from "src/app/pages/xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import { MESSAGE } from "src/app/constants/message";
import dayjs from "dayjs";
import { Base2Component } from "src/app/components/base2/base2.component";
import { CHUC_NANG, STATUS } from "src/app/constants/status";

@Component({
  selector: 'app-quyet-dinh-gnv',
  templateUrl: './quyet-dinh-gnv.component.html',
  styleUrls: ['./quyet-dinh-gnv.component.scss'],
  providers: [CuuTroVienTroComponent]
})
export class QuyetDinhGnvComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() loaiXuat: any;
  isDetail: boolean = false;

  isView = false;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  listTrangThaiXh: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' }
  ];
  idQdPd: number = 0;
  openQdPd: boolean = false;
  id: number = 0;
  openQdGnv: boolean = false;
  idQdXc: number = 0;
  openQdXc: boolean = false;
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      nam: [''],
      soQd: [''],
      maDvi: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      loaiVthh: [''],
      trichYeu: [''],
      trangThai: [''],
      type: [''],
      types: ['']
      // types: [['TH', 'TTr']]
    });
    this.filterTable = {
      nam: '',
      soQd: '',
      ngayKy: '',
      soQdPd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      thoiGianGiaoNhan: '',
      soBbHaoDoi: '',
      soBbTinhKho: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }

  disabledStartNgayKy = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
    }
    return false;
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({ type: this.loaiXuat });
      if (this.userService.isChiCuc()) {
        this.formData.patchValue({ trangThai: this.STATUS.BAN_HANH })
      }
      await this.timKiem()
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async timKiem() {
    if (this.formData.value.type === "XC") {
      this.formData.patchValue({ types: ['XC'] })
    } else {
      this.formData.patchValue({ types: ['TH', 'TTr'] })
    }
    await this.spinner.show();
    try {
      await this.search();
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }

  }

  openQdPdModal(id: number) {
    this.idQdPd = id;
    this.openQdPd = true;
  }

  closeQdPdModal() {
    this.idQdPd = null;
    this.openQdPd = false;
  }
  openQdXCModal(id: number) {
    this.idQdXc = id;
    this.openQdXc = true;
  }
  closeQdXCModal() {
    this.idQdXc = null;
    this.openQdXc = false;
  }
  openQdGnvModal(id: any) {
    this.id = id;
    this.openQdGnv = true;
  }

  closeQdGnvModal() {
    this.id = null;
    this.openQdGnv = false;
  }
  checkRoleAdd() {
    if (this.userService.isCuc() && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_THEM')) {
      return true
    }
    return false
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    if ([this.STATUS.DU_THAO, this.STATUS.TU_CHOI_TP, this.STATUS.TU_CHOI_LDC].includes(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_THEM')) {
      return true
    }
    return false
  }
  checkRoleApprove(trangThai: STATUS): boolean {
    if ((trangThai === this.STATUS.CHO_DUYET_TP && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_DUYET_TP')) || (trangThai === this.STATUS.CHO_DUYET_LDC && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_DUYET_LDCUC'))) {
      return true
    }
    return false
  }
  checkRoleXoa(trangThai: STATUS): boolean {
    if ([this.STATUS.DU_THAO].includes(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_XOA')) {
      return true
    }
    return false

  }
  checkRoleXoaDs(): boolean {
    if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_XOA') && this.userService.isCuc()) {
      return true
    }
    return false

  }
  checkRoleView(trangThai: STATUS): boolean {
    if (!this.checkRoleEdit(trangThai) && !this.checkRoleXoa(trangThai) && !this.checkRoleApprove(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH_XEM')) {
      return true
    }
    return false
  }
}
