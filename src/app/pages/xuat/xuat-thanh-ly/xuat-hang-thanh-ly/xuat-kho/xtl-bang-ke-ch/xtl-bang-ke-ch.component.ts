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
  PhieuXuatKhoThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";

@Component({
  selector: 'app-xtl-bang-ke-ch',
  templateUrl: './xtl-bang-ke-ch.component.html',
  styleUrls: ['./xtl-bang-ke-ch.component.scss']
})
export class XtlBangKeChComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: PhieuXuatKhoThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      nam: null,
      soQdXh: null,
      soPhieuKtcl: null,
      ngayTu: null,
      ngayDen: null,
      phanLoai : null,
    })
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.formData.patchValue({
        phanLoai : urlList[4] == 'xuat-kho-lt' ? 'LT' : 'VT'
      })
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-bang-ke-ch';
    })
  }

  ngOnInit(): void {
    this.searchPage();
  }

  clearForm() {
    this.formData.reset();
    let routerUrl = this.router.url;
    const urlList = routerUrl.split("/");
    this.formData.patchValue({
      phanLoai : urlList[4] == 'xuat-kho-lt' ? 'LT' : 'VT'
    })
    this.searchPage();
  }

  async searchPage() {
    await this.search();
    this.dataTable.forEach(item => item.expandSet = true);
  }

}
