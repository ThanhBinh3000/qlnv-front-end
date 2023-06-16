import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-danhsach-kehoach-muatructiep',
  templateUrl: './danhsach-kehoach-muatructiep.component.html',
  styleUrls: ['./danhsach-kehoach-muatructiep.component.scss']
})
export class DanhsachKehoachMuatructiepComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  dsDonvi: any[] = [];
  userdetail: any = {};
  idThop: number = 0;
  isViewThop: boolean = false;
  idChiTieu: number = 0;
  isViewChiTieu: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  isViewChiTiet: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_CBV, giaTri: 'Từ chối - CB Vụ' },
    { ma: this.STATUS.DA_DUYET_CBV, giaTri: 'Đã duyệt - CB vụ' },
  ];

  listTrangThaiTh: any[] = [
    { ma: this.STATUS.CHUA_TONG_HOP, giaTri: 'Chưa Tổng Hợp' },
    { ma: this.STATUS.DA_TONG_HOP, giaTri: 'Đã Tổng Hợp' },
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhSachMuaTrucTiepService);
    this.formData = this.fb.group({
      namKh: [],
      maDvi: [],
      tenDvi: [],
      soDxuat: [],
      ngayTaoTu: [],
      ngayTaoDen: [],
      ngayDuyetTu: [],
      ngayDuyetDen: [],
      trichYeu: [],
      noiDungThop: [],
      trangThaiTh: [],
    });

    this.filterTable = {
      soDxuat: '',
      namKh: '',
      ngayTao: '',
      ngayPduyet: '',
      trichYeu: '',
      soQd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tongSoLuong: '',
      soQdPduyet: '',
      tenTrangThai: '',
      tenTrangThaiTh: '',
    };
  }

  listChiCuc: any[] = [];

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await Promise.all([
        this.search(),
        this.initData()
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }


  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.danhSachMuaTrucTiepService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, 'Danh-sach-de-xuat-ke-hoach-mua-truc-tiep.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  openModalTh(id: number) {
    this.idThop = id;
    this.isViewThop = true;
  }

  closeModalTh() {
    this.idThop = null;
    this.isViewThop = false;
  }

  openModalChiTieu(id: number) {
    this.idChiTieu = id;
    this.isViewChiTieu = true;
  }

  closeModalChiTieu() {
    this.idChiTieu = null;
    this.isViewChiTieu = false;
  }

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }


  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayTaoDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
  };

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayDuyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayDuyetDen.getTime();
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetTu.getTime();
  };

  xemChiTiet(id: number, isView: boolean, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.isViewChiTiet = isView;
    this.idSelected = id;
    this.isDetail = true;
  }

  goDetail(id: number, roles?: any) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.idSelected = id;
    this.isViewChiTiet = false;
    this.isDetail = true;
  }

  checkQuyenXem(trangThai: string) {
    if (this.userService.isAccessPermisson('NHDTQG_PTMTT_KHMTT_LT_DEXUAT_XEM')) {
      if (this.userService.isAccessPermisson('NHDTQG_PTMTT_KHMTT_LT_DEXUAT_THEM')) {
        switch (trangThai) {
          case this.STATUS.DU_THAO:
          case this.STATUS.TU_CHOI_TP:
          case this.STATUS.TU_CHOI_LDC:
          case this.STATUS.TU_CHOI_CBV:
            return false;
          case this.STATUS.CHO_DUYET_TP:
          case this.STATUS.CHO_DUYET_LDC:
          case this.STATUS.DA_DUYET_LDC:
          case this.STATUS.DA_DUYET_CBV:
            return true;
        }
      } else {
        switch (trangThai) {
          case this.STATUS.DU_THAO:
          case this.STATUS.TU_CHOI_TP:
          case this.STATUS.TU_CHOI_LDC:
          case this.STATUS.TU_CHOI_CBV:
          case this.STATUS.DA_DUYET_CBV:
            return true;
          case this.STATUS.CHO_DUYET_TP:
            return !this.userService.isAccessPermisson("NHDTQG_PTMTT_KHMTT_LT_DEXUAT_DUYET_TP");
          case this.STATUS.CHO_DUYET_LDC:
            return !this.userService.isAccessPermisson("NHDTQG_PTMTT_KHMTT_LT_DEXUAT_DUYET_LDC");
          case this.STATUS.DA_DUYET_LDC:
            return !this.userService.isAccessPermisson("NHDTQG_PTMTT_KHMTT_LT_DEXUAT_DUYET_CANBOVU");
        }
      }
    }
    return false;
  }
}
