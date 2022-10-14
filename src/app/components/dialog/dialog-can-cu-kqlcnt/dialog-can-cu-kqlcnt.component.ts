import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhPheDuyetKetQuaLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/tochuc-trienkhai/quyetDinhPheDuyetKetQuaLCNT.service';
import * as dayjs from 'dayjs';
import {STATUS} from "../../../constants/status";

@Component({
  selector: 'dialog-can-cu-kqlcnt',
  templateUrl: './dialog-can-cu-kqlcnt.component.html',
  styleUrls: ['./dialog-can-cu-kqlcnt.component.scss'],
})
export class DialogCanCuKQLCNTComponent implements OnInit {
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string;
  loaiVthh: string;
  namKhoach: number;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhPheDuyetKetQuaLCNTService: QuyetDinhPheDuyetKetQuaLCNTService,
  ) { }

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

  handleOk(item: any) {
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }

  async search() {
    this.dataTable = [];
    this.totalRecord = 0;
    let body = {
      "denNgayQd": null,
      "loaiVthh": this.loaiVthh,
      "maDvi": null,
      "namKhoach": this.namKhoach,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": null,
        "orderType": null,
        "page": this.page
      },
      "soQd": this.text,
      "str": null,
      "trangThai": STATUS.BAN_HANH,
      "tuNgayQd": null
    };
    let res = await this.quyetDinhPheDuyetKetQuaLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.length > 0) {
        this.dataTable = data;
      }
      this.totalRecord = data.length;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
