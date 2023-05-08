import { Component, OnInit } from '@angular/core';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BcBnTt108Service } from "../../../../../services/bao-cao/BcBnTt108.service";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";

@Component({
  selector: 'app-them-moi-nguon-hinh-thanh-dtqg',
  templateUrl: './them-moi-nguon-hinh-thanh-dtqg.component.html',
  styleUrls: ['./them-moi-nguon-hinh-thanh-dtqg.component.scss']
})
export class ThemMoiNguonHinhThanhDtqgComponent extends Base2Component implements OnInit {

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcBnTt108Service: BcBnTt108Service,
              ) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt108Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        quy: [null],
        tuNgayTao: [null],
        tuNgayKyGui: [null],
        denNgayTao: [null],
        denNgayKyGui: [null],
      }
    );
  }

  ngOnInit(): void {
  }

}
