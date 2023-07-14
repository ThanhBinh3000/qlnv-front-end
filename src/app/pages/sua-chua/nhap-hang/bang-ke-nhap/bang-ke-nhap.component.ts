import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {BangKeXuatScService} from "../../../../services/sua-chua/bangKeXuatSc.service";
import {Base3Component} from "../../../../components/base3/base3.component";

@Component({
  selector: 'app-bang-ke-nhap',
  templateUrl: './bang-ke-nhap.component.html',
  styleUrls: ['./bang-ke-nhap.component.scss']
})
export class BangKeNhapComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private bangKeXuatScService : BangKeXuatScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bangKeXuatScService);
    this.defaultURL = 'sua-chua/xuat-hang/bang-ke'
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
