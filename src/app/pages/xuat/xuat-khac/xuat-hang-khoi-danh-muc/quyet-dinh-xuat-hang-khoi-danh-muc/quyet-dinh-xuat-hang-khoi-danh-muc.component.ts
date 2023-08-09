import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service";
import {MESSAGE} from "../../../../../constants/message";
import {STATUS} from "../../../../../constants/status";
import {
  QuyetDinhXuatHangKhoiDmService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuathangkhoidm/QuyetDinhXuatHangKhoiDm.service";

@Component({
  selector: 'app-quyet-dinh-xuat-hang-khoi-danh-muc',
  templateUrl: './quyet-dinh-xuat-hang-khoi-danh-muc.component.html',
  styleUrls: ['./quyet-dinh-xuat-hang-khoi-danh-muc.component.scss']
})
export class QuyetDinhXuatHangKhoiDanhMucComponent extends Base2Component implements OnInit {

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
              private quyetDinhXuatHangKhoiDmService: QuyetDinhXuatHangKhoiDmService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhXuatHangKhoiDmService);
    this.formData = this.fb.group({
      trichYeu: [],
      soQd: [],
      ngayKyTu: [],
      ngayKyDen: [],
      ngayHieuLucTu: [],
      ngayHieuLucDen: [],
    });
  }

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
