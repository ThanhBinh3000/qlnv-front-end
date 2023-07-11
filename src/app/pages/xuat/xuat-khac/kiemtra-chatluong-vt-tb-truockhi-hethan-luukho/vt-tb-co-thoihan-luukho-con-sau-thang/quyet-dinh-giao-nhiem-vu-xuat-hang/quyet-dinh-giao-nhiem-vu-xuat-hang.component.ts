import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  DanhSachVttbTruocHethanLuuKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/DanhSachVttbTruocHethanLuuKho.service";
import {
  QuyetDinhGiaoNvXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/QuyetDinhGiaoNvXuatHang.service";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";

@Component({
  selector: 'app-quyet-dinh-giao-nhiem-vu-xuat-hang',
  templateUrl: './quyet-dinh-giao-nhiem-vu-xuat-hang.component.html',
  styleUrls: ['./quyet-dinh-giao-nhiem-vu-xuat-hang.component.scss']
})
export class QuyetDinhGiaoNhiemVuXuatHangComponent extends Base2Component implements OnInit {

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
              private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.formData = this.fb.group({
      namKeHoach: [],
      trichYeu: [],
      soQuyetDinh: [],
      ngayKyQdTu: [],
      ngayKyQdDen: [],
    })
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
