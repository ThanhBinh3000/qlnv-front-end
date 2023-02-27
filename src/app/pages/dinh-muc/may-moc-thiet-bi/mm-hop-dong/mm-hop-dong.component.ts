import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import { saveAs } from 'file-saver';
import dayjs from "dayjs";
import {MmDxChiCucService} from "../../../../services/mm-dx-chi-cuc.service";
import {HopDongMmTbcdService} from "../../../../services/hop-dong-mm-tbcd.service";

@Component({
  selector: 'app-mm-hop-dong',
  templateUrl: './mm-hop-dong.component.html',
  styleUrls: ['./mm-hop-dong.component.scss']
})
export class MmHopDongComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongService: HopDongMmTbcdService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongService)
    super.ngOnInit()
    this.formData = this.fb.group({
      soHopDong: [''],
      tenHopDong: [''],
      soQdMuaSam: [''],
      strBenMua: [''],
      trangThai: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      loai: ['00'],
    });
    this.filterTable = {};
  }
  async ngOnInit() {
    this.spinner.show();
    try {
      await this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView;
  }

  async filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.patchValue({
        ngayKyTu : dayjs(this.formData.value.ngayKy[0]).format('DD/MM/YYYY'),
        ngayKyDen : dayjs(this.formData.value.ngayKy[1]).format('DD/MM/YYYY'),
      })
    }
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi : this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      capDvi : this.userService.isCuc() ? this.userInfo.CAP_DVI : (Number(this.userInfo.CAP_DVI) + 1).toString()
    })
    await this.search();
  }


  async showList() {
    this.isDetail = false;
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
        this.hopDongService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'hop-dong-mua-sam.xlsx'),
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

}
