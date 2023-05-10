import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import { saveAs } from 'file-saver';
import {
  TongHopDxScLonService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";

@Component({
  selector: 'app-quyet-dinh-sc-lon-tcdt',
  templateUrl: './quyet-dinh-sc-lon-tcdt.component.html',
  styleUrls: ['./quyet-dinh-sc-lon-tcdt.component.scss']
})
export class QuyetDinhScLonTcdtComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.CHO_DUYET_LDTC, giaTri: 'Chờ duyệt - LĐ Tổng cục' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối LĐ-Vụ' },
    { ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối - LĐ Tổng cục' },
    { ma: this.STATUS.DA_DUYET_LDTC, giaTri: 'Đã duyệt - LĐ Tổng cục' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDxScLon : TongHopDxScLonService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDxScLon)
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [''],
      maTh: [''],
      noiDung: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      trangThai: [''],
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
      maDvi :this.userInfo.MA_DVI ,
      capDvi :this.userInfo.CAP_DVI
    })
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi :this.userInfo.MA_DVI ,
      capDvi :this.userInfo.CAP_DVI
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
        this.tongHopDxScLon
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'tong-hop-sua-chua-lon.xlsx'),
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
