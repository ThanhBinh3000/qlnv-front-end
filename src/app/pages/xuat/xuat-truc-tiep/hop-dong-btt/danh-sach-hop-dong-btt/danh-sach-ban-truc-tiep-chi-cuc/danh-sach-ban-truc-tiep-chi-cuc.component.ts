import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { ChaoGiaMuaLeUyQuyenService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';

@Component({
  selector: 'app-danh-sach-ban-truc-tiep-chi-cuc',
  templateUrl: './danh-sach-ban-truc-tiep-chi-cuc.component.html',
  styleUrls: ['./danh-sach-ban-truc-tiep-chi-cuc.component.scss']
})
export class DanhSachBanTrucTiepChiCucComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isQuanLy: boolean;
  isAddNew: boolean;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: null,
      soHd: null,
      tenHd: null,
      ngayPduyetTu: null,
      ngayPduyetDen: null,
      loaiVthh: null,
      trangThai: null,
      phanLoai: null
    });
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayMkho: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThaiHd: '',
    }
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
      await Promise.all([
        this.search(),
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goDetail(id: number, roles?: any, isQuanLy?: boolean) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = isQuanLy;
    this.isAddNew = !isQuanLy;
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.BAN_HANH,
      phanLoai: 'QDDX'
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  disabledNgayPduyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayPduyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayPduyetDen.getTime();
  };

  disabledNgayPduyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayPduyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayPduyetTu.getTime();
  };
}
