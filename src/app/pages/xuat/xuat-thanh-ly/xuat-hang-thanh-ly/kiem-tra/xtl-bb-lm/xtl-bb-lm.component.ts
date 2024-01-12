import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {KiemTraChatLuongScService} from "../../../../../../services/sua-chua/kiemTraChatLuongSc";
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {
  BienBanLayMauThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/BienBanLayMauThanhLy.service";

@Component({
  selector: 'app-xtl-bb-lm',
  templateUrl: './xtl-bb-lm.component.html',
  styleUrls: ['./xtl-bb-lm.component.scss']
})
export class XtlBbLmComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: BienBanLayMauThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      nam: null,
      soBbQd: null,
      soBienBan: null,
      ngayTu: null,
      ngayDen: null,
      phanLoai : null,
    })
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.formData.patchValue({
          phanLoai : urlList[4] == 'kiem-tra-lt' ? 'LT' : 'VT'
      })
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-bb-lm';
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
