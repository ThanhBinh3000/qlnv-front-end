import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {BaoCaoKqTieuHuyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/BaoCaoKqTieuHuy.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Base3Component} from "../../../../components/base3/base3.component";

@Component({
  selector: 'app-bao-cao-ket-qua-tieu-huy',
  templateUrl: './bao-cao-ket-qua-tieu-huy.component.html',
  styleUrls: ['./bao-cao-ket-qua-tieu-huy.component.scss']
})
export class BaoCaoKetQuaTieuHuyComponent extends Base3Component implements OnInit {
  listTrangThai: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: BaoCaoKqTieuHuyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.defaultURL = 'xuat/xuat-tieu-huy/bao-cao-kq';
    this.defaultPermisson = 'XHDTQG_XTH_BCKQ'
    this.formData = this.fb.group({
      nam: null,
      soBaoCao: null,
      soQd: null,
      trangThai: null,
      ngayBaoCaoTu: null,
      ngayBaoCaoDen: null,
    })
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
        value: this.STATUS.TU_CHOI_TP,
        text: 'Từ chối - TP'
      },
      {
        value: this.STATUS.TU_CHOI_LDC,
        text: 'Từ chối - LĐ Cục '
      },
    ]
  }

  ngOnInit(): void {
    this.search();
  }
}
