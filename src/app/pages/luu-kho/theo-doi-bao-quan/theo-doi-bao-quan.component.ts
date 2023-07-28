import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DonviService} from 'src/app/services/donvi.service';
import {UserService} from 'src/app/services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {DANH_MUC_LEVEL} from 'src/app/pages/luu-kho/luu-kho.constant';
import {saveAs} from 'file-saver';
import {cloneDeep} from 'lodash';
import {NzModalService} from "ng-zorro-antd/modal";
import {Globals} from "../../../shared/globals";
import {STATUS} from "../../../constants/status";
import * as dayjs from "dayjs";
import {TheoDoiBqService} from "../../../services/theo-doi-bq.service";
import {Base3Component} from "../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "../../../services/storage.service";
import {HttpClient} from "@angular/common/http";


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
