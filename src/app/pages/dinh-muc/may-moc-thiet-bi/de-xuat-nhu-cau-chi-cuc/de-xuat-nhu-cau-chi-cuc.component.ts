import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {MmDxChiCucService} from "../../../../services/mm-dx-chi-cuc.service";
import dayjs from "dayjs";
import {toNumber} from "ng-zorro-antd/core/util";

@Component({
  selector: 'app-de-xuat-nhu-cau-chi-cuc',
  templateUrl: './de-xuat-nhu-cau-chi-cuc.component.html',
  styleUrls: ['./de-xuat-nhu-cau-chi-cuc.component.scss']
})
export class DeXuatNhuCauChiCucComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    dxChiCucService: MmDxChiCucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.filterTable = {};
  }

  ngOnInit() {
    this.spinner.show();
    try {
      this.initFormSearch();
      this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initFormSearch(){
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [''],
      soCv: [''],
      trichYeu: [''],
      ngayKy: [''],
    });
  }

  async filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('DD/MM/YYYY');
      this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('DD/MM/YYYY');
    }
    this.formData.patchValue({
      maDvi : this.userService.isChiCuc()  ? this.userInfo.MA_DVI : null,
      capDvi : this.userService.isChiCuc() ? this.userInfo.CAP_DVI : (Number(this.userInfo.CAP_DVI) + 1).toString()
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
      capDvi : this.userService.isChiCuc() ? this.userInfo.CAP_DVI : (Number(this.userInfo.CAP_DVI) + 1).toString()
    })
    await this.search();
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }
}
