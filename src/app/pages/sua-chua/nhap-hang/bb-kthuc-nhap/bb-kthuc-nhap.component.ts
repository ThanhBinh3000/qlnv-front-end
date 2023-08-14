import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ActivatedRoute, Router } from "@angular/router";
import { PhieuNhapKhoScService } from "../../../../services/sua-chua/phieuNhapKhoSc.service";
import { Base3Component } from "../../../../components/base3/base3.component";
import { BienBanKetThucNhapScService } from "../../../../services/sua-chua/bienBanKetThucNhapSc.service";

@Component({
  selector: 'app-bb-kthuc-nhap',
  templateUrl: './bb-kthuc-nhap.component.html',
  styleUrls: ['./bb-kthuc-nhap.component.scss']
})
export class BbKthucNhapComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private bienBanKetThucNhapScService: BienBanKetThucNhapScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, bienBanKetThucNhapScService);
    this.defaultURL = 'sua-chua/nhap-hang/bb-kt-nhap'
    this.formData = this.fb.group({
      nam: null,
      soQdNh: null,
      soBienBan: null,
      ngayTu: null,
      ngayDen: null,
      ngayNhapTu: null,
      ngayNhapDen: null,
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
