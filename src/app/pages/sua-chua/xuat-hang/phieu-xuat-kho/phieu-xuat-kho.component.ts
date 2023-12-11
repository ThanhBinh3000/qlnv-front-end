import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { QuyetDinhXhService } from "../../../../services/sua-chua/quyetDinhXh.service";
import { Base3Component } from "../../../../components/base3/base3.component";
import { PhieuXuatKhoScService } from "../../../../services/sua-chua/phieuXuatKhoSc.service";

@Component({
  selector: 'app-phieu-xuat-kho',
  templateUrl: './phieu-xuat-kho.component.html',
  styleUrls: ['./phieu-xuat-kho.component.scss']
})
export class PhieuXuatKhoComponent extends Base3Component implements OnInit {
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
    this.defaultURL = 'sua-chua/xuat-hang/phieu-xuat-kho'
    this.defaultPermisson = 'SCHDTQG_XH_PXK';
    this.formData = this.fb.group({
      nam: null,
      soQdXh: null,
      soPhieuXuatKho: null,
      ngayTu: null,
      ngayDen: null,
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
