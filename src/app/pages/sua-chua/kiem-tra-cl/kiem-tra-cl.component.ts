import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MmHienTrangMmService } from 'src/app/services/mm-hien-trang-mm.service';
import { StorageService } from 'src/app/services/storage.service';
import {BangKeXuatScService} from "../../../services/sua-chua/bangKeXuatSc.service";
import {KiemTraChatLuongSc} from "../../../services/sua-chua/kiemTraChatLuongSc";

@Component({
  selector: 'app-kiem-tra-cl',
  templateUrl: './kiem-tra-cl.component.html',
  styleUrls: ['./kiem-tra-cl.component.scss']
})
export class KiemTraClComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private kiemTraChatLuongSc : KiemTraChatLuongSc,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, kiemTraChatLuongSc);
    this.defaultURL = 'sua-chua/kiem-tra-cl'
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
