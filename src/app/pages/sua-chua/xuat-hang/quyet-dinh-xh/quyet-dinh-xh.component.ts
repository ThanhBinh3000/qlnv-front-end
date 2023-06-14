import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MmHienTrangMmService } from 'src/app/services/mm-hien-trang-mm.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quyet-dinh-xh',
  templateUrl: './quyet-dinh-xh.component.html',
  styleUrls: ['./quyet-dinh-xh.component.scss']
})
export class QuyetDinhXhComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private hienTrangSv: MmHienTrangMmService,
    private danhMucSv: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, hienTrangSv);
    this.defaultURL = 'sua-chua/xuat-hang/giao-nv-xh'
    this.formData = this.fb.group({
      nam: null,
      maSc: null,
      maCc: null,
      ngayTu: null,
      ngayDen: null,
    })
  }

  ngOnInit(): void {
  }

}
