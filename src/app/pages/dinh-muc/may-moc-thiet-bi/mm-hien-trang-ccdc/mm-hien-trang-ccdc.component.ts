import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {KtKhXdHangNamService} from "../../../../services/kt-kh-xd-hang-nam.service";
import {DonviService} from "../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {MESSAGE} from "../../../../constants/message";
@Component({
  selector: 'app-mm-hien-trang-ccdc',
  templateUrl: './mm-hien-trang-ccdc.component.html',
  styleUrls: ['./mm-hien-trang-ccdc.component.scss']
})
export class MmHienTrangCcdcComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;
  dsCuc : any[] = [];
  dsChiCuc : any[] = [];
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
      tenCcdc: [null],
      maCcdc: [null],
      maCuc: [null],
      maChiCuc: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.userService.isTongCuc()) {
        this.loadDsCuc()
      }
      if (this.userService.isCuc()) {
        this.loadDsChiCuc()
      }
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }


  async loadDsCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.dsCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.dsCuc = this.dsCuc.filter(item => item.type != "PB")
  }

  async loadDsChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.dsChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.dsChiCuc = this.dsCuc.filter(item => item.type != "PB")
  }
}
