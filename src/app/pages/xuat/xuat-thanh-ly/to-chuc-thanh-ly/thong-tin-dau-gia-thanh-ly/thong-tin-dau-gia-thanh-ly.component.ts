import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {ActivatedRoute, Router} from "@angular/router";
import {
  ThongBaoKqThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ThongBaoKqThanhLy.service";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {
  QuyetDinhThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service";
@Component({
  selector: 'app-thong-tin-dau-gia-thanh-ly',
  templateUrl: './thong-tin-dau-gia-thanh-ly.component.html',
  styleUrls: ['./thong-tin-dau-gia-thanh-ly.component.scss']
})
export class ThongTinDauGiaThanhLyComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: QuyetDinhThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/thong-tin-dau-gia'
    this.formData = this.fb.group({
      nam: null,
      soHoSo: null,
      soQd: null,
      ngayKyTu: null,
      ngayKyDen: null,
    })
    this.listTrangThai = [
      {
        value: this.STATUS.DU_THAO,
        text: 'Dự thảo'
      },
      {
        value: this.STATUS.CHO_DUYET_TP,
        text: 'Chờ duyệt - TP'
      },
      {
        value: this.STATUS.CHO_DUYET_LDC,
        text: 'Chờ duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.DA_DUYET_LDC,
        text: 'Đã duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.DANG_DUYET_CB_VU,
        text: 'Đang duyệt - CB Vụ'
      },
      {
        value: this.STATUS.CHO_DUYET_LDV,
        text: 'Chờ duyệt - LĐ Vụ'
      },
      {
        value: this.STATUS.CHO_DUYET_LDTC,
        text: 'Chờ duyệt - LĐ Tổng cục'
      },
      {
        value: this.STATUS.DA_DUYET_LDTC,
        text: 'Đã duyệt - LĐ Tổng cục'
      },
    ]
  }

  ngOnInit(): void {
    this.search();
  }
}
