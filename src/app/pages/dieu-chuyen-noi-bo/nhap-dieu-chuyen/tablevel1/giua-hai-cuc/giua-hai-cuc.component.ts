import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-giua-hai-cuc',
  templateUrl: './giua-hai-cuc.component.html',
  styleUrls: ['./giua-hai-cuc.component.scss']
})
export class GiuaHaiCucComponent extends Base2Component implements OnInit {

  loaiDc: string = "CUC"

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);

  }

  tabSelected: string = 'DCNB_NHAP_2CUC_KTCL_LT';

  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }

}
