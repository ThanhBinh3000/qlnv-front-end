import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { BangKeXuatScService } from "../../../../services/sua-chua/bangKeXuatSc.service";
import { Base3Component } from "../../../../components/base3/base3.component";
import { BangKeNhapScService } from "../../../../services/sua-chua/bangKeNhapSc.service";

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
    private bangKeNhapScService: BangKeNhapScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bangKeNhapScService);
    this.defaultURL = 'sua-chua/nhap-hang/bang-ke-nhap'
    this.defaultPermisson = 'SCHDTQG_NH_BKNVT'
    this.formData = this.fb.group({
      nam: null,
      soQdNh: null,
      soBangKe: null,
      ngayTu: null,
      ngayTuNh: null,
      ngayDen: null,
      ngayDenNh: null,
    })
  }

  ngOnInit(): void {
    this.searchPage();
  }


  async searchPage() {
    await this.search();
    this.dataTable.forEach(item => item.expandSet = true);
  }

}
