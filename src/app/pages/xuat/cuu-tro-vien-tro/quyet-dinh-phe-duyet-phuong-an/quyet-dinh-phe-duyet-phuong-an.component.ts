import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../services/storage.service';
import { QuyetDinhPheDuyetPhuongAnCuuTroService } from './../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service';

@Component({
  selector: 'app-quyet-dinh-phe-duyet-phuong-an',
  templateUrl: './quyet-dinh-phe-duyet-phuong-an.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-phuong-an.component.scss']
})
export class QuyetDinhPheDuyetPhuongAnComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({
      soDx: null,
      tenDvi: null,
      maDvi: null,
      ngayDx: null,
      ngayDxTu: null,
      ngayDxDen: null,
      ngayKetThuc: null,
      type: null
    })
    this.filterTable = {
      soQd: '',
      ngayKy: '',
      maTongHop: '',
      ngayThop: '',
      soDx: '',
      ngayDx: '',
      tenLoaiVthh: '',
      tongSoLuongDx: '',
      tongSoLuong: '',
      soLuongXuaCap: '',
      trichYeu: '',
      tenTrangThai: '',

    };
  }
  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;

  async ngOnInit() {
    try {
      this.initData()
      await this.timKiem();
      await this.spinner.hide();

    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    /*const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };*/
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }
  }
  async timKiem() {
    if (this.formData.value.ngayDx) {
      this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKetThucDx) {
      this.formData.value.ngayKetThucDxTu = dayjs(this.formData.value.ngayKetThucDx[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKetThucDxDen = dayjs(this.formData.value.ngayKetThucDx[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    // this.isViewDetail = isView ?? false;
  }
}
