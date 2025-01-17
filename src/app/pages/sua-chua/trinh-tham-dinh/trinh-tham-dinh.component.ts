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
import { TrinhThamDinhScService } from "../../../services/sua-chua/trinhThamDinhSc.service";

@Component({
  selector: 'app-trinh-tham-dinh',
  templateUrl: './trinh-tham-dinh.component.html',
  styleUrls: ['./trinh-tham-dinh.component.scss']
})
export class TrinhThamDinhComponent extends Base3Component implements OnInit {

  listTrangThai: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private trinhThamDinhScService: TrinhThamDinhScService,
    private danhMucSv: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, trinhThamDinhScService);
    this.defaultURL = 'sua-chua/trinh-tham-dinh'
    this.formData = this.fb.group({
      soTtr: null,
      soQdScSr: null,
      ngayTuCuc: null,
      ngayDenCuc: null,
      ngayTuTc: null,
      ngayDenTc: null,
      ngayDen: null,
      trangThai: null,
    });
    this.listTrangThai = [
      {
        value: this.STATUS.DU_THAO,
        text: 'Dự thảo'
      },
      {
        value: this.STATUS.CHO_DUYET_TP,
        text: 'Chờ duyệt - TP'
      },
      {
        value: this.STATUS.CHO_DUYET_LDC,
        text: 'Chờ duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.DA_DUYET_LDC,
        text: 'Đã duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.DANG_DUYET_CB_VU,
        text: 'Đang duyệt - CB Vụ'
      },
      {
        value: this.STATUS.CHO_DUYET_LDV,
        text: 'Chờ duyệt - LĐ Vụ'
      },
      {
        value: this.STATUS.CHO_DUYET_LDTC,
        text: 'Chờ duyệt - LĐ Tổng cục'
      },
      {
        value: this.STATUS.DA_DUYET_LDTC,
        text: 'Đã duyệt - LĐ Tổng cục'
      },
    ]
  }

  ngOnInit(): void {
    this.search();
  }

  showEdit(data) {
    let trangThai = data.trangThai
    if (this.userService.isCuc()) {
      this.STATUS.DU_THAO || trangThai == this.STATUS.TU_CHOI_TP || trangThai == this.STATUS.TU_CHOI_LDC
        || trangThai == this.STATUS.TU_CHOI_CBV || trangThai == this.STATUS.TU_CHOI_LDV
    }
    if (this.userService.isTongCuc()) {
      return trangThai == this.STATUS.DA_DUYET_LDC || trangThai == this.STATUS.DANG_DUYET_CB_VU;
    }
  }
}
