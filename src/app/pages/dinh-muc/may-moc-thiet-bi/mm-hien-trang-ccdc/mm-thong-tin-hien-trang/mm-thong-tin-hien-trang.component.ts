import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {MmHienTrangMmService} from "../../../../../services/mm-hien-trang-mm.service";
import {DonviService} from "../../../../../services/donvi.service";
import {MESSAGE} from "../../../../../constants/message";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
@Component({
  selector: 'app-mm-thong-tin-hien-trang',
  templateUrl: './mm-thong-tin-hien-trang.component.html',
  styleUrls: ['./mm-thong-tin-hien-trang.component.scss']
})
export class MmThongTinHienTrangComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;
  dsCuc : any[] = [];
  dsChiCuc : any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv : MmHienTrangMmService,
    private dviService : DonviService,
    private _modalRef : NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      namKeHoach: [null],
      tenCcdc: [null],
      maCcdc: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
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

  handleOk(data  :any) {
    this._modalRef.close(data);
  }

  onCancel() {
    this._modalRef.close();
  }
}
