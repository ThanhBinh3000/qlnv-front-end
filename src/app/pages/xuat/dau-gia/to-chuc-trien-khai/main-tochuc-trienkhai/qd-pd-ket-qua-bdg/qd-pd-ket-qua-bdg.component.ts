import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';

@Component({
  selector: 'app-qd-pd-ket-qua-bdg',
  templateUrl: './qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./qd-pd-ket-qua-bdg.component.scss']
})
export class QdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  typeLoaiVthh: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành' },
  ];

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
    super.ngOnInit();
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
      hinhThucDauGia: '',
      pthucDauGia: '',
      soTbKhongThanh: '',
      soBienBan: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      this.thimKiem();
      await Promise.all([
        this.search(),
        this.onChangeCLoaiVthh(),
      ])
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  thimKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
    })

  }

  clearFilter() {
    this.formData.reset();
    this.thimKiem();
    this.search();
  }

  async onChangeCLoaiVthh() {
    if (this.loaiVthh && this.typeLoaiVthh) {
      this.listVthh = [];
      let body = {
        "str": this.loaiVthh
      };
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        this.listVthh = this.typeLoaiVthh.filter(s => s.ma === LOAI_HANG_DTQG.VAT_TU)
      } else {
        this.listVthh = this.typeLoaiVthh;
      }
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data.filter(s => s.ten != null && s.ma != null);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  disabledNgayKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
  };

  disabledNgayKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };

}
