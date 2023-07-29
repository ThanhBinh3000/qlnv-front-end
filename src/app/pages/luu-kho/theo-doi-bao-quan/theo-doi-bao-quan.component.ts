import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalService} from "ng-zorro-antd/modal";
import {Base3Component} from "../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../../services/storage.service";
import {HttpClient} from "@angular/common/http";
import {TheoDoiBqService} from "../../../services/luu-kho/theo-doi-bq.service";


@Component({
  selector: 'app-theo-doi-bao-quan',
  templateUrl: './theo-doi-bao-quan.component.html',
  styleUrls: ['./theo-doi-bao-quan.component.scss']
})
export class TheoDoiBaoQuanComponent extends Base3Component implements OnInit {
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqService: TheoDoiBqService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqService);
    this.defaultURL = 'luu-kho/theo-doi-bao-quan'
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
