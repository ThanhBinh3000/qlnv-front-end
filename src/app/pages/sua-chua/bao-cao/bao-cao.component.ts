import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage.service';
import {ActivatedRoute, Router} from "@angular/router";
import {QuyetDinhScService} from "../../../services/sua-chua/quyetDinhSc.service";
import {Base3Component} from "../../../components/base3/base3.component";
import {BaoCaoScService} from "../../../services/sua-chua/baoCaoSc.service";

@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private baoCaoScService: BaoCaoScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, baoCaoScService);
    this.defaultURL = 'sua-chua/bao-cao'
    this.formData = this.fb.group({
      nam: null,
      maSc: null,
      maCc: null,
      ngayTu: null,
      ngayDen: null,
    })
  }

  ngOnInit(): void {
    this.search();
  }


}
