import { Component, Input, OnInit } from '@angular/core';
import { MESSAGE } from "../../../../../constants/message";
import * as dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../../services/user.service";

import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qd-dieuchinh-khbdg',
  templateUrl: './qd-dieuchinh-khbdg.component.html',
  styleUrls: ['./qd-dieuchinh-khbdg.component.scss']
})
export class QdDieuchinhKhbdgComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  idQdPdGoc: number = 0;
  isViewQdPdGoc: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ Chối - LĐ Vụ' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ Duyệt - LĐ Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã Duyệt - LĐ Vụ' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hanh' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDchinhKhBdgService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      soQdDc: null,
      trichYeu: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      loaiVthh: null,
      trangThai: null,
    })

    this.filterTable = {
      nam: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdGoc: '',
      trichYeu: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      slDviTsan: '',
    };

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      trangThai: this.userService.isCuc() ? this.STATUS.BAN_HANH : null
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }


  disabledNgayKyQdDcTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDcDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDcDen.getTime();
  };

  disabledNgayKyQdDcDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyDcTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyDcTu.getTime();
  };


  openModalQdPdGoc(id: number) {
    this.idQdPdGoc = id;
    this.isViewQdPdGoc = true;
  }

  closeModalQdPdGoc() {
    this.idQdPdGoc = null;
    this.isViewQdPdGoc = false;
  }
}
