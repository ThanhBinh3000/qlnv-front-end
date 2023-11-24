import {
  Component,
  OnInit,
} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {
  KtKhSuaChuaBtcService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import { Router } from "@angular/router";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-qd-thong-bao-sua-chua-lon',
  templateUrl: './qd-thong-bao-sua-chua-lon.component.html',
  styleUrls: ['./qd-thong-bao-sua-chua-lon.component.scss']
})
export class QdThongBaoSuaChuaLonComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'}
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdScBtcService: KtKhSuaChuaBtcService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScBtcService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      soQd: [null],
      trichYeu: [null],
      ngayKy: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      namKeHoach: [null],
      trangThai: [null],
      type: ['01']
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUALON_QDTCDT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.filter()
      ]);
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

  async filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.patchValue({
        ngayKyTu: this.formData.value.ngayKy[0],
        ngayKyDen: this.formData.value.ngayKy[1]
      })
    }
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI
    })
    await this.search();
  }

  clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      type: "01"
    })
    this.search();
  }

}
