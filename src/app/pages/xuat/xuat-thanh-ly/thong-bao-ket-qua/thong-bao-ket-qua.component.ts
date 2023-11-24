import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { MESSAGE } from "../../../../constants/message";
import dayjs from "dayjs";
import { XuatThanhLyComponent } from "../xuat-thanh-ly.component";
import { CHUC_NANG } from "../../../../constants/status";
import {
  ThongBaoKqThanhLyService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ThongBaoKqThanhLy.service";
import { Base3Component } from 'src/app/components/base3/base3.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QuyetDinhThanhLyService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhThanhLyService.service';

@Component({
  selector: 'app-thong-bao-ket-qua',
  templateUrl: './thong-bao-ket-qua.component.html',
  styleUrls: ['./thong-bao-ket-qua.component.scss']
})
export class ThongBaoKetQuaComponent extends Base3Component implements OnInit {
  listTrangThai: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: ThongBaoKqThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-thanh-ly/thong-bao-kq'
    this.formData = this.fb.group({
      nam: null,
      soThongBao: null,
      soHoSo: null,
      ngayTu: null,
      ngayDen: null,
      trangThai : null,
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
