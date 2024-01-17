import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {HoSoTieuHuyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/HoSoTieuHuy.service";
import {Base3Component} from "../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-ho-so-tieu-huy',
  templateUrl: './ho-so-tieu-huy.component.html',
  styleUrls: ['./ho-so-tieu-huy.component.scss']
})
export class HoSoTieuHuyComponent extends Base3Component implements OnInit {
  listTrangThai: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: HoSoTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-tieu-huy/trinh-tham-dinh'
    this.defaultPermisson = 'XHDTQG_XTH_HSTH'
    this.formData = this.fb.group({
      nam: null,
      soHoSo: null,
      soQdSr: null,
      soTbSr: null,
      trangThai: null,
      soTtr: null,
      soQdScSr: null,
      ngayTuCuc: null,
      ngayDenCuc: null,
      ngayTuTc: null,
      ngayDenTc: null,
      ngayDen: null,
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

  showEdit(data){
    if(data){
      let trangThai = data.trangThai;
      let result;
      if (this.userService.isCuc()) {
        result = trangThai == this.STATUS.DU_THAO || trangThai == this.STATUS.TU_CHOI_TP || trangThai == this.STATUS.TU_CHOI_LDC
          || trangThai == this.STATUS.TU_CHOI_CBV || trangThai == this.STATUS.TU_CHOI_LDV
      }
      if (this.userService.isTongCuc()) {
        result = trangThai == this.STATUS.DA_DUYET_LDC || trangThai == this.STATUS.DANG_DUYET_CB_VU;
      }
      return result && this.isAccessPermisson(this.defaultPermisson+"_THEM");
    }
    return false
  }


}
