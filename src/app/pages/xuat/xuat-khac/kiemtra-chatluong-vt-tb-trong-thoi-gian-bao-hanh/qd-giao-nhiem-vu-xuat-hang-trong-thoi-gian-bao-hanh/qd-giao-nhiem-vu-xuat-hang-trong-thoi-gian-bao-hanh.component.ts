import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {STATUS} from "../../../../../constants/status";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../services/storage.service";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {
  QdGiaoNvXuatHangTrongThoiGianBaoHanhService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/QdGiaoNvXuatHangTrongThoiGianBaoHanh.service";
import {MESSAGE} from "../../../../../constants/message";


@Component({
  selector: 'app-qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh',
  templateUrl: './qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh.component.scss']
})
export class QdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent extends Base2Component implements OnInit {

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
              private qdGiaoNvXuatHangTrongThoiGianBaoHanhService: QdGiaoNvXuatHangTrongThoiGianBaoHanhService) {
    super(httpClient, storageService, notification, spinner, modal, qdGiaoNvXuatHangTrongThoiGianBaoHanhService);
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
