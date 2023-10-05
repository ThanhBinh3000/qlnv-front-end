import { QuyetDinhPheDuyetKeHoachLCNTService } from '../../../services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/quyetDinhPheDuyetKeHoachLCNT.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'dialog-can-cu-qd-phe-duyet-khlcnt',
  templateUrl: './dialog-can-cu-qd-phe-duyet-khlcnt.component.html',
  styleUrls: ['./dialog-can-cu-qd-phe-duyet-khlcnt.component.scss'],
})
export class DialogCanCuQDPheDuyetKHLCNTComponent implements OnInit {
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = '';
  status: string = '11';
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhPheDuyetKeHoachLCNTService: QuyetDinhPheDuyetKeHoachLCNTService,
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
    const yearNow = new Date().getUTCFullYear();
    let body = {
      denNgayQd: null,
      // loaiVthh: '00',
      namKhoach: yearNow,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
      soQd: '',
      str: null,
      trangThai: this.status,
      tuNgayQd: null,
    };
    let res = await this.quyetDinhPheDuyetKeHoachLCNTService.getAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.length > 0) {
        this.dataTable = data;
      }
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
