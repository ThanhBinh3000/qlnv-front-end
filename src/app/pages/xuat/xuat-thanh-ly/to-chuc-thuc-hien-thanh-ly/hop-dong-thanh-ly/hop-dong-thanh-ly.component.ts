import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {DonviService} from "../../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {
  QuyetDinhPheDuyetKetQuaService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";


@Component({
  selector: 'app-hop-dong-thanh-ly',
  templateUrl: './hop-dong-thanh-ly.component.html',
  styleUrls: ['./hop-dong-thanh-ly.component.scss']
})
export class HopDongThanhLyComponent extends Base2Component implements OnInit {
  isQuanLy: boolean;
  isAddNew: boolean;
  dsDonvi: any[] = [];

  listTrangThaiHd: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];
  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaService);
    this.formData = this.fb.group({
      ngayKy: '',
      ngayKyTu: '',
      ngayKyDen: '',
      soHd: '',
      tenHd: '',
      nhaCungCap: '',
      trangThai: this.STATUS.BAN_HANH,
      loaiVthh: '',
      nam: '',
      tenDviThucHien: '',
      tenDviMua: '',
      maDvi: ''
    });

    this.filterTable = {
      nam: '',
      soQdPd: '',
      soQdKq: '',
      tongDvts: '',
      tongDvtsDg: '',
      slHdDaKy: '',
      thoiHanTt: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenDviThucHien: '',
      tenDviMua: '',
      soLuong: '',
      thanhTien: '',
    }
  }

  disabledStartNgayKy = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() >= this.formData.value.ngayKyDen.getTime();
    }
    return false;
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.loadDsDonVi()
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
      })
      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsDonVi() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    }
    let res = await this.donviService.layDonViTheoCapDo(body);
    this.dsDonvi = res[DANH_MUC_LEVEL.CUC];
    this.dsDonvi = this.dsDonvi.filter(item => item.type != "PB");
  }

  goDetail(id: number, roles?: any, isQuanLy?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = isQuanLy;
    this.isAddNew = !isQuanLy;
  }
}
