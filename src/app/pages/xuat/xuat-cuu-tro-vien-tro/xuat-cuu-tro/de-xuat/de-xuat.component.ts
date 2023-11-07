import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuuTroVienTroComponent } from "src/app/pages/xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { UserLogin } from "src/app/models/userlogin";
import { MESSAGE } from "src/app/constants/message";
import dayjs from "dayjs";
import { isEmpty } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { Base2Component } from "src/app/components/base2/base2.component";
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-de-xuat',
  templateUrl: './de-xuat.component.html',
  styleUrls: ['./de-xuat.component.scss']
})
export class DeXuatComponent extends Base2Component implements OnInit {


  @Input() loaiVthh: string;
  @Input() loaiVthhCache: string;
  @Output() eventTaoQd: EventEmitter<any> = new EventEmitter<any>();
  CHUC_NANG = CHUC_NANG;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ' },
  ];
  listTrangThaiTh: any[] = [
    { ma: this.STATUS.CHUA_TONG_HOP, giaTri: 'Chưa tổng hợp' },
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - CĐ Vụ' },
  ];

  listTrangThaiQd: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  public vldTrangThai: CuuTroVienTroComponent;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    private dataService: DataService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
    this.vldTrangThai = cuuTroVienTroComponent;
    this.formData = this.fb.group({
      nam: null,
      soDx: null,
      tenDvi: null,
      maDvi: null,
      ngayDx: null,
      ngayDxTu: null,
      ngayDxDen: null,
      ngayKetThuc: null,
      ngayKetThucTu: null,
      ngayKetThucDen: null,
    })
    this.filterTable = {
      nam: '',
      tenLoaiNhapXuat: '',
      soDx: '',
      tenDonVi: '',
      ngayDx: '',
      ngayPduyet: '',
      tenLoaiVthh: '',
      tongSoLuong: '',
      trichYeu: '',
      tenTrangThai: '',
      maTongHop: '',
      soQd: '',
    };
  }


  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;

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
    return endValue.getTime() <= this.formData.value.ngayDxTu.getTime();
  };

  disabledStartNgayKt = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKetThucDen) {
      return startValue.getTime() > this.formData.value.ngayKetThucDen.getTime();
    }
    return false;
  };

  disabledEndNgayKt = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKetThucTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKetThucTu.getTime();
  };

  async ngOnInit() {
    try {
      this.initData()
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
      if (this.userService.isTongCuc()) {
        this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
      } else {
        this.dsDonvi = dsTong.data.filter(s => s.type === 'PB');
      }

    }

  }

  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async timKiem() {
    if (this.formData.value.ngayDx) {
      this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKetThuc) {
      this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  taoQuyetDinh(data) {
    this.eventTaoQd.emit(data);
  }
  taoQuyetDinhPdPa(data) {
    const dataSend = {
      ...data,
      type: "TTr",
      isTaoQdPdPa: true
    }
    this.dataService.changeData(dataSend);
    this.eventTaoQd.emit(2);
  }
}
