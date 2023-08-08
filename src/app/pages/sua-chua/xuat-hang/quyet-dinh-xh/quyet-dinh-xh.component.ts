import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhXhService } from "../../../../services/sua-chua/quyetDinhXh.service";

@Component({
  selector: 'app-quyet-dinh-xh',
  templateUrl: './quyet-dinh-xh.component.html',
  styleUrls: ['./quyet-dinh-xh.component.scss']
})
export class QuyetDinhXhComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private quyetDinhXhService: QuyetDinhXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, quyetDinhXhService);
    this.defaultURL = 'sua-chua/xuat-hang/giao-nv-xh'
    this.formData = this.fb.group({
      nam: null,
      soQd: null,
      trichYeu: null,
      ngayTu: null,
      ngayDen: null,
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
        value: this.STATUS.BAN_HANH,
        text: 'Ban hành'
      },
    ]
  }

  ngOnInit(): void {
    this.search();
  }

}
