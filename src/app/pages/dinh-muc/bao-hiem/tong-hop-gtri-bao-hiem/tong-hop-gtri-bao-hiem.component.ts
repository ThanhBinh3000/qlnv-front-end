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
import {TongHopGtriBaoHiemService} from "../../../../services/tong-hop-gtri-bao-hiem.service";

@Component({
  selector: 'app-tong-hop-gtri-bao-hiem',
  templateUrl: './tong-hop-gtri-bao-hiem.component.html',
  styleUrls: ['./tong-hop-gtri-bao-hiem.component.scss']
})
export class TongHopGtriBaoHiemComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt LĐ-Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt LĐ-Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối LĐ-Vụ' },
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private gtriBaoHiemService: TongHopGtriBaoHiemService
  ) {
    super(httpClient, storageService, notification, spinner, modal, gtriBaoHiemService)
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [''],
      soTh: [''],
      trichYeu: [''],
      ngayTongHop: [''],
      ngayTongHopTu: [''],
      ngayTongHopDen: [''],
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
    if (this.formData.value.ngayTongHop && this.formData.value.ngayTongHop.length > 0) {
      this.formData.patchValue({
        ngayTongHopTu :  dayjs(this.formData.value.ngayTongHop[0]).format('DD/MM/YYYY'),
        ngayTongHopDen : dayjs(this.formData.value.ngayTongHop[1]).format('DD/MM/YYYY')
      })
    }
    this.formData.patchValue({
      maDvi : this.userInfo.MA_DVI,
      capDvi : this.userInfo.CAP_DVI
    })
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi : this.userInfo.MA_DVI,
      capDvi : this.userInfo.CAP_DVI,
      loai : '01',
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
        this.gtriBaoHiemService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'gia-tri-bao-hiem.xlsx'),
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
