import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../../services/storage.service";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";

import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  QdGiaoNvNhapHangTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvNhapHangTrongThoiGianBaoHanh.service";



@Component({
  selector: 'app-qd-giao-nhiem-vu-nhap-hang',
  templateUrl: './qd-giao-nhiem-vu-nhap-hang.component.html',
  styleUrls: ['./qd-giao-nhiem-vu-nhap-hang.component.scss']
})
export class QdGiaoNhiemVuNhapHangComponent extends Base2Component implements OnInit {

  STATUS = STATUS;
  isDetail: boolean = false;
  selectedId: number;
  isView: boolean = false;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private qdGiaoNvNhapHangTrongThoiGianBaoHanhService: QdGiaoNvNhapHangTrongThoiGianBaoHanhService) {
    super(httpClient, storageService, notification, spinner, modal, qdGiaoNvNhapHangTrongThoiGianBaoHanhService);
    this.formData = this.fb.group({
      nam: [''],
      soQuyetDinh: [''],
      maDvi: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      loaiVthh: [''],
      trichYeu: [''],
      loaiXn: ['NHAP'],
    });
    this.filterTable = {
      nam: '',
      soQuyetDinh: '',
      ngayKy: '',
      loaiXn: '',
      soCanCu: '',
      soBbKtNk: '',
      soPhieuNk: '',
      ngayTao: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }
  disabledStartNgayKy = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
    }
    return false;
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
  ];
  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];
  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await Promise.all([]);
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async timKiem() {
    await this.search();
  }

  themMoi(id, isView) {
    this.isDetail = true;
    this.selectedId = id;
    this.isView = isView;
  };

}
