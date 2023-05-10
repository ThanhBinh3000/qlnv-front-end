import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DonviService} from 'src/app/services/donvi.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {XuatDieuChuyenService} from "./xuat-dieu-chuyen.service";

@Component({
  selector: 'app-ke-hoach-dieu-chuyen',
  templateUrl: './xuat-dieu-chuyen.component.html',
  styleUrls: ['./xuat-dieu-chuyen.component.scss']
})
export class XuatDieuChuyenComponent extends Base2Component implements OnInit {

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private keHoachDieuChuyenService: XuatDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, keHoachDieuChuyenService);
  }
}
