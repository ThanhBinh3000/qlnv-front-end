import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { DonviService } from 'src/app/services/donvi.service';
import { QthtChotGiaNhapXuatService } from 'src/app/services/quantri-hethong/qthtChotGiaNhapXuat.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-ket-chuyen',
  templateUrl: './ket-chuyen.component.html',
  styleUrls: ['./ket-chuyen.component.scss']
})
export class KetChuyenComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private qthtChotGiaNhapXuatService: QthtChotGiaNhapXuatService,
    private donviService: DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, qthtChotGiaNhapXuatService);
    this.formData = this.fb.group({
      id: [],
      donViThien: [],
      ngayTu: [],
      ngayDen: [],
    });
  }

  ngOnInit(): void {
  }

  searchPage() {

  }

}
