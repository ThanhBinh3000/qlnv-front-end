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
import dayjs from "dayjs";
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-qd-pd-ket-qua-bdg',
  templateUrl: './qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./qd-pd-ket-qua-bdg.component.scss']
})
export class QdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  listVthh: any[] = [];

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
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    super.ngOnInit();
    this.formData = this.fb.group({
      nam: [null],
      loaiVthh: [null],
      soQdKq: [null],
      trichYeu: [null],
      ngayPduyetTu: [null],
      ngayPduyetDen: [null],
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
      await this.search();
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

  disabledNgayKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayPduyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayPduyetDen.getTime();
  };

  disabledNgayKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayPduyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayPduyetTu.getTime();
  };

}
