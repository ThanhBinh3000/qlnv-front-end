import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {KtKhXdHangNamService} from "../../../../services/kt-kh-xd-hang-nam.service";
import {DonviService} from "../../../../services/donvi.service";
@Component({
  selector: 'app-hien-trang-ccdc-pvc',
  templateUrl: './hien-trang-ccdc-pvc.component.html',
  styleUrls: ['./hien-trang-ccdc-pvc.component.scss']
})
export class HienTrangCcdcPvcComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
    private dviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      namKeHoach: [null],
      loaiTaiSan: [null],
    });
    this.filterTable = {
      soCongVan: '',
      namKeHoach: '',
      trichYeu: '',
      ngayKy: '',
      soQdKh: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

}