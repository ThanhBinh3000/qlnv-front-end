import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { cloneDeep } from 'lodash';
import {MESSAGE} from "../../../../../constants/message";
import {
  QuyetDinhThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
import {STATUS} from "../../../../../constants/status";
@Component({
  selector: 'app-thong-tin-dau-gia-thanh-ly',
  templateUrl: './thong-tin-dau-gia-thanh-ly.component.html',
  styleUrls: ['./thong-tin-dau-gia-thanh-ly.component.scss']
})
export class ThongTinDauGiaThanhLyComponent extends Base2Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhThanhLyService: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhThanhLyService);
    this.formData = this.fb.group({
      nam: null,
      soDxuat: null,
      soQdPd: null,
      soQdPdKqBdg: null,
      ngayKyQdPdKqBdgTu: null,
      ngayKyQdPdKqBdgDen: null,
      loaiVthh: null,
      maDvi: null,
      trangThai: STATUS.BAN_HANH,
      maCuc: this.userInfo.MA_DVI,
    })
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    let arr = [];
    try {
      await this.search();
      let dt = this.dataTable.flatMap(row => {
        return row.quyetDinhDtl.map(data => {
          return Object.assign(cloneDeep(row), data);
        })
      })
      if(this.userService.isCuc()){
        dt = dt.filter(s => s.maDiaDiem.substring(0, 6) === this.userInfo.MA_DVI);
      }
      this.dataTable = cloneDeep(dt);
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  showList() {
    this.isDetail = false;
    this.timKiem();
  }

  clearForm(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.timKiem();
  }


  disabledNgayPduyetKqTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdPdKqBdgDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyQdPdKqBdgDen.getTime();
  };

  disabledNgayPduyetKqDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdPdKqBdgTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdPdKqBdgTu.getTime();
  };
}
