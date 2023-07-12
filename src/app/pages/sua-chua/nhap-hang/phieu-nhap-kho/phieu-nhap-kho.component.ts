import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {PhieuXuatKhoScService} from "../../../../services/sua-chua/phieuXuatKhoSc.service";
import {Base3Component} from "../../../../components/base3/base3.component";

@Component({
  selector: 'app-phieu-nhap-kho',
  templateUrl: './phieu-nhap-kho.component.html',
  styleUrls: ['./phieu-nhap-kho.component.scss']
})
export class PhieuNhapKhoComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private phieuXuatKhoScService: PhieuXuatKhoScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, phieuXuatKhoScService);
    this.defaultURL = 'sua-chua/nhap-hang/phieu-nhap-kho'
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
