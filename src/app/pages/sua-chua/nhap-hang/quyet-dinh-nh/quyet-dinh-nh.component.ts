import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {QuyetDinhXhService} from "../../../../services/sua-chua/quyetDinhXh.service";
import {Base3Component} from "../../../../components/base3/base3.component";

@Component({
  selector: 'app-quyet-dinh-nh',
  templateUrl: './quyet-dinh-nh.component.html',
  styleUrls: ['./quyet-dinh-nh.component.scss']
})
export class QuyetDinhNhComponent extends Base3Component implements OnInit {

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
    this.defaultURL = 'sua-chua/nhap-hang/giao-nv-nh'
    this.formData = this.fb.group({
      nam: null,
      soQd: null,
      trichYeu: null,
      ngayTu: null,
      ngayDen: null,
    })
  }

  ngOnInit(): void {
    this.search();
  }

}
