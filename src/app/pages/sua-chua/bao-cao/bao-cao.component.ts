import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from "@angular/router";
import { QuyetDinhScService } from "../../../services/sua-chua/quyetDinhSc.service";
import { Base3Component } from "../../../components/base3/base3.component";
import { BaoCaoScService } from "../../../services/sua-chua/baoCaoSc.service";

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
      soBaoCao: null,
      soQdXh: null,
      trangThai: null,
      ngayTu: null,
      ngayDen: null,
    });
    this.listTrangThai = [
      { value: this.STATUS.DU_THAO, text: 'Dự thảo' },
      { value: this.STATUS.CHO_DUYET_TP, text: 'Chờ duyệt - TP' },
      { value: this.STATUS.TU_CHOI_TP, text: 'Từ chối - TP' },
      { value: this.STATUS.CHO_DUYET_LDC, text: 'Chờ duyệt - LĐ Cục' },
      { value: this.STATUS.TU_CHOI_LDC, text: 'Từ chối - LĐ Cục' },
      { value: this.STATUS.DA_DUYET_LDC, text: 'Đã duyệt - LĐ Cục' },
    ]
  }

  ngOnInit(): void {
    this.search();
  }


}
