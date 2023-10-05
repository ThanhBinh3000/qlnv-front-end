import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {KiemTraChatLuongScService} from "../../../../../../services/sua-chua/kiemTraChatLuongSc";
import {Base3Component} from "../../../../../../components/base3/base3.component";

@Component({
  selector: 'app-xtl-hs-kt',
  templateUrl: './xtl-hs-kt.component.html',
  styleUrls: ['./xtl-hs-kt.component.scss']
})
export class XtlHsKtComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: KiemTraChatLuongScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      nam: null,
      soQdXh: null,
      soPhieuKtcl: null,
      ngayTu: null,
      ngayDen: null,
    })
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-hs-kt';
      console.log(this.defaultURL)
    })
  }

  ngOnInit(): void {
    // this.searchPage();
  }

  async searchPage() {
    await this.search();
    this.dataTable.forEach(item => item.expandSet = true);
  }

}
