import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Base2Component} from "../../../../components/base2/base2.component";
import {StorageService} from "../../../../services/storage.service";
import {CHUC_NANG, STATUS} from "../../../../constants/status";
import {UserLogin} from "../../../../models/userlogin";
import {MESSAGE} from "../../../../constants/message";
import {
  QuyetDinhDieuChuyenService
} from "../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/QuyetDinhDieuChuyen.service";


@Component({
  selector: 'app-quyet-dinh-dieu-chuyen-sap-nhap-kho',
  templateUrl: './quyet-dinh-dieu-chuyen-sap-nhap-kho.component.html',
  styleUrls: ['./quyet-dinh-dieu-chuyen-sap-nhap-kho.component.scss']
})
export class QuyetDinhDieuChuyenSapNhapKhoComponent extends Base2Component implements OnInit {

  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenService);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      soQuyetDinh: [],
      trichYeu: [],
      ngayKyTu: [],
      ngayKyDen: [],
      trangThai: [],
      trangThaiSn: [],
    })
  }

  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  soQdGiaoNvXhSelected: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  listTrangThaiSn: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa hoàn thành"},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang hoàn thành"},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành"},
  ];
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: "Dự thảo"},
    {ma: this.STATUS.BAN_HANH, giaTri: "Ban hành"},
  ];
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

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayKy) {
        this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

}