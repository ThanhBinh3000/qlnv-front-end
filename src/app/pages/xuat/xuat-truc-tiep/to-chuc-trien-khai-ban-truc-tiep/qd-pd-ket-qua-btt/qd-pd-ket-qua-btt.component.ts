import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { DonviService } from 'src/app/services/donvi.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-qd-pd-ket-qua-btt',
  templateUrl: './qd-pd-ket-qua-btt.component.html',
  styleUrls: ['./qd-pd-ket-qua-btt.component.scss']
})
export class QdPdKetQuaBttComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành' },
  ];
  constructor(
    private httpClient: HttpClient,
    private donviService: DonviService,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: null,
      loaiVthh: null,
      ngayCgiaTu: null,
      ngayCgiaDen: null,
      trangThai: null,
    });
    this.filterTable = {
      soQdKq: '',
      ngayKy: '',
      maDvi: '',
      tenDvi: '',
      soQdPd: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      trangThai: '',
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
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      loaiVthh: this.loaiVthh,
      trangThai: this.userService.isTongCuc() ? this.STATUS.BAN_HANH : null,
    })
  }

  clearFilter() {
    this.formData.reset();
    this.thimKiem();
    this.search();
  }

  disabledNgayChaoGiaTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayCgiaDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayCgiaDen.getTime();
  };

  disabledNgayChaoGiaDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayCgiaTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayCgiaTu.getTime();
  };

  openModalQdPdKh(id: number) {
    this.idQdPdKh = id;
    this.isViewQdPdKh = true;
  }

  closeModalQdPdKh() {
    this.idQdPdKh = null;
    this.isViewQdPdKh = false;
  }
}
