import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HopDongXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';

@Component({
  selector: 'app-danh-sach-hop-dong',
  templateUrl: './danh-sach-hop-dong.component.html',
  styleUrls: ['./danh-sach-hop-dong.component.scss']
})
export class DanhSachHopDongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isQuanLy: boolean;
  isAddNew: boolean;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      ngayKy: '',
      soHd: '',
      tenHd: '',
      nhaCungCap: '',
      trangThai: this.STATUS.BAN_HANH,
      maDvi: this.userInfo.MA_DVI
    });
    this.filterTable = {
      soHd: '',
      tenHd: '',
      ngayKy: '',
      loaiVthh: '',
      chungLoaiVthh: '',
      chuDauTu: '',
      nhaCungCap: '',
      gtriHdSauVat: '',
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goDetail(id: number, roles?: any, isQuanLy?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = isQuanLy;
    this.isAddNew = !isQuanLy;
  }

}
