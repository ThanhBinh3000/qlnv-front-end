import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import { saveAs } from 'file-saver';
import {MmDxChiCucService} from "../../../../services/mm-dx-chi-cuc.service";
import {DxChiCucPvcService} from "../../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/dx-chi-cuc-pvc.service";

@Component({
  selector: 'app-tong-hop-de-xuat-nhu-cau-chi-cuc',
  templateUrl: './tong-hop-de-xuat-nhu-cau-chi-cuc.component.html',
  styleUrls: ['./tong-hop-de-xuat-nhu-cau-chi-cuc.component.scss']
})
export class TongHopDeXuatNhuCauChiCucComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.DA_KY, giaTri: 'Đã ký' },
    { ma: this.STATUS.DA_DUYET_CBV, giaTri: 'Đã duyệt - Cán bộ Vụ' },
    { ma: this.STATUS.TU_CHOI_CBV, giaTri: 'Từ chối - Cán bộ Vụ' }
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
        ngayKyTu : this.formData.value.ngayKy[0],
        ngayKyDen : this.formData.value.ngayKy[1]
      })
    }
    this.formData.patchValue({
      maDvi : this.userService.isCuc()  ? this.userInfo.MA_DVI : null,
      capDvi : this.userService.isCuc() ? this.userInfo.CAP_DVI : (Number(this.userInfo.CAP_DVI) + 1).toString()
    })
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
        this.dxChiCucService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'tong-hop-dx-chi-cuc.xlsx'),
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
