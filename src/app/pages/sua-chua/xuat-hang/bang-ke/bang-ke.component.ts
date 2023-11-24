import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { PhieuXuatKhoScService } from "../../../../services/sua-chua/phieuXuatKhoSc.service";
import { Base3Component } from "../../../../components/base3/base3.component";
import { BangKeXuatScService } from "../../../../services/sua-chua/bangKeXuatSc.service";

@Component({
  selector: 'app-bang-ke',
  templateUrl: './bang-ke.component.html',
  styleUrls: ['./bang-ke.component.scss']
})
export class BangKeComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private bangKeXuatScService: BangKeXuatScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bangKeXuatScService);
    this.defaultURL = 'sua-chua/xuat-hang/bang-ke';
    this.defaultPermisson = 'SCHDTQG_XH_BKXVT'
    this.formData = this.fb.group({
      nam: null,
      soQdXh: null,
      soBangKe: null,
      ngayTu: null,
      ngayTuXh: null,
      ngayDen: null,
      ngayDenXh: null,
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
