import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import {QuyetDinhPheDuyetKQBanDauGiaService} from "../../../services/quyetDinhPheDuyetKQBanDauGia.service";

@Component({
  selector: 'dialog-can-cu-qd-phe-duyet-kqdg',
  templateUrl: './dialog-can-cu-qd-phe-duyet-kqdg.component.html',
  styleUrls: ['./dialog-can-cu-qd-phe-duyet-kqdg.component.scss'],
})
export class DialogCanCuQdPheDuyetKqdgComponent implements OnInit {
  page: number = 0;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string;
  loaiVthh: string;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhPheDuyetKQBanDauGiaService: QuyetDinhPheDuyetKQBanDauGiaService,
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
      "namKhoach": null,
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
      "trangThai": null,
      "tuNgayQd": null
    };
    let res = await this.quyetDinhPheDuyetKQBanDauGiaService.listData(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data) {
        this.dataTable = data.content;
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
