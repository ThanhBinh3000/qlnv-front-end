import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {XuatThanhLyComponent} from "../../xuat-thanh-ly.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../../constants/message";
import {CHUC_NANG} from "src/app/constants/status";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-quyet-dinh-giao-nhiem-vu-thanh-ly',
  templateUrl: './quyet-dinh-giao-nhiem-vu-thanh-ly.component.html',
  styleUrls: ['./quyet-dinh-giao-nhiem-vu-thanh-ly.component.scss']
})
export class QuyetDinhGiaoNhiemVuThanhLyComponent extends Base3Component implements OnInit {
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành'},
  ];
  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private danhMucService: DanhMucService,
    private xuatThanhLyComponent: XuatThanhLyComponent,
    private _service: QuyetDinhGiaoNhiemVuThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal,route,router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/qd-giao-nv-xh'
    this.formData = this.fb.group({
      nam: [null],
      soBbQd: [null],
      loaiVthh: [null],
      trichYeu: [null],
      ngayKyQdTu: [null],
      ngayKyQdDen: [null]
    });
    this.filterTable = {
      nam: '',
      soBbQd: '',
      ngayKyQd: '',
      soHopDong: '',
      tenCloaiVthh: '',
      thoiGianGiaoNhan: '',
      trichYeu: '',
      soBbTinhKho: '',
      soBbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show()
    try {
      await Promise.all([
        this.search(),
      ])
      await this.spinner.hide()
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledNgayKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
  };

  disabledNgayKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };
}
