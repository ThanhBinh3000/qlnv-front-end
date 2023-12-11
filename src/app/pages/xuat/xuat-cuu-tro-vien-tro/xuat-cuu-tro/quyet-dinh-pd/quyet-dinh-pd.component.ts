import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import { UserLogin } from "src/app/models/userlogin";
import { MESSAGE } from "src/app/constants/message";
import dayjs from "dayjs";
import { isEmpty } from 'lodash';
import { TEN_LOAI_VTHH } from "src/app/constants/config";
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-quyet-dinh-pd',
  templateUrl: './quyet-dinh-pd.component.html',
  styleUrls: ['./quyet-dinh-pd.component.scss']
})
export class QuyetDinhPdComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Input() loaiXuat: any;
  @Input() chuyenXuatCap: Boolean = null;
  @Input() isView = false;
  @Output() eventTaoQdXc: EventEmitter<any> = new EventEmitter<any>();

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  dataInit: any = {};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private dataService: DataService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.formData = this.fb.group({
      soDx: null,
      tenDvi: null,
      maDvi: null,
      maDviDx: null,
      ngayDx: null,
      ngayDxTu: null,
      ngayDxDen: null,
      ngayKetThucDx: null,
      ngayKetThucDxTu: null,
      ngayKetThucDxDen: null,
      type: null,
      xuatCap: null,
      trangThai: null,
      types: [['TH', 'TTr']]
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
      soLuongXuatCap: '',
      trichYeu: '',
      tenTrangThai: '',

    };
  }

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  isVatTu: boolean = false;
  idDx: number = 0;
  openDxPa = false;
  idTh: number = 0;
  openTh = false;

  disabledStartNgayDX = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDxDen) {
      return startValue.getTime() > this.formData.value.ngayDxDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayDx = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDxTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDxDen.getTime();
  };

  disabledStartNgayKt = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKetThucDxDen) {
      return startValue.getTime() > this.formData.value.ngayKetThucDxDen.getTime();
    }
    return false;
  };

  disabledEndNgayKt = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKetThucDxTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKetThucDxTu.getTime();
  };

  async ngOnInit() {
    try {
      await this.dataService.currentData.subscribe(data => {
        if (data && data.isTaoQdPdPa) {
          this.redirectDetail(0, false);
          this.dataInit = { ...data };
        }
      });
      await this.dataService.removeData();
      this.formData.patchValue({ type: this.loaiXuat, xuatCap: this.chuyenXuatCap, trangThai: (!!!this.chuyenXuatCap) ? null : '29' });
      if (this.chuyenXuatCap) {
        this.formData.patchValue({ tenVthh: TEN_LOAI_VTHH.GAO });
      }
      await this.initData();
      await this.timKiem();
      await this.spinner.hide();

    } catch (e) {
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
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  openDxPaModal(id: number) {
    this.idDx = id;
    this.openDxPa = true;
  }

  closeDxPaModal() {
    this.idDx = null;
    this.openDxPa = false;
  }

  openThModal(id: number) {
    this.idTh = id;
    this.openTh = true;
  }

  closeThModal() {
    this.idTh = null;
    this.openTh = false;
  }
  taoQuyetDinhXc(data) {
    this.eventTaoQdXc.emit(data);
  }
  removeDataInit() {
    this.dataInit = {};
  }
}
