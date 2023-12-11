import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { Base2Component } from "src/app/components/base2/base2.component";
import { CHUC_NANG } from 'src/app/constants/status';
import { XuatThanhLyComponent } from "src/app/pages/xuat/xuat-thanh-ly/xuat-thanh-ly.component";
import { HoSoThanhLyService } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";
import dayjs from "dayjs";
import { MESSAGE } from "src/app/constants/message";
import { Base3Component } from 'src/app/components/base3/base3.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ho-so-thanh-ly',
  templateUrl: './ho-so-thanh-ly.component.html',
  styleUrls: ['./ho-so-thanh-ly.component.scss']
})
export class HoSoThanhLyComponent extends Base3Component implements OnInit {
  listTrangThai: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: HoSoThanhLyService,
    private danhMucSv: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-thanh-ly/trinh-tham-dinh'
    this.formData = this.fb.group({
      nam : null,
      soHoSo: null,
      soQd: null,
      trangThai: null,
      ngayTuCuc: null,
      ngayDenCuc: null,
      ngayTuTc: null,
      ngayDenTc: null,
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
