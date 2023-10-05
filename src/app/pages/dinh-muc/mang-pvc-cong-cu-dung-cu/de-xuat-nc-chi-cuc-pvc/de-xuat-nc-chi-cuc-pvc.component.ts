import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import { saveAs } from 'file-saver';
import {DxChiCucPvcService} from "../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service";
import {STATUS} from "../../../../constants/status";

@Component({
  selector: 'app-de-xuat-nc-chi-cuc-pvc',
  templateUrl: './de-xuat-nc-chi-cuc-pvc.component.html',
  styleUrls: ['./de-xuat-nc-chi-cuc-pvc.component.scss']
})
export class DeXuatNcChiCucPvcComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.DA_KY, giaTri: 'Đã ký' },
    { ma: this.STATUS.DADUYET_CB_CUC, giaTri: 'Đã duyệt - Cán bộ cục' },
    { ma: this.STATUS.TUCHOI_CB_CUC, giaTri: 'Từ chối - Cán bộ cục' }
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: DxChiCucPvcService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [''],
      soCv: [''],
      trichYeu: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
    });
    this.filterTable = {};
  }

  ngOnInit() {
    this.spinner.show();
    try {
      this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.patchValue({
        ngayKyTu : this.formData.value.ngayKy[0],
        ngayKyDen : this.formData.value.ngayKy[1]
      })
    }
    this.formData.patchValue({
      maDvi : this.userService.isChiCuc()  ? this.userInfo.MA_DVI : null,
      capDvi : 3
    })
    await this.search();
  }


  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView;
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi : this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
      capDvi : 3
    })
    await this.search();
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.dxChiCucService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'de-xuat-chi-cuc.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }
}
