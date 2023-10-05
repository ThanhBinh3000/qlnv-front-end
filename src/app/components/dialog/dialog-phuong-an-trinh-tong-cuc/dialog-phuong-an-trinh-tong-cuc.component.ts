import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PhuongAnKeHoachLCNTService } from 'src/app/services/phuongAnKeHoachLCNT.service';

@Component({
  selector: 'dialog-phuong-an-trinh-tong-cuc',
  templateUrl: './dialog-phuong-an-trinh-tong-cuc.component.html',
  styleUrls: ['./dialog-phuong-an-trinh-tong-cuc.component.scss'],
})
export class DialogPhuongAnTrinhTongCucComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  yearNow: number = 0;
  value: string = null;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private phuongAnKeHoachLCNTService: PhuongAnKeHoachLCNTService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.yearNow = dayjs().get('year');
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  handleOk(item: any) {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    this._modalRef.close(item);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  onCancel() {
    this._modalRef.close();
  }

  async search() {
    this.dataTable = [];
    this.totalRecord = 0;
    let body = {
      "denNgayTao": null,
      "loaiVthh": "00",
      "namKhoach": this.yearNow,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page
      },
      "str": this.value,
      "trangThai": null,
      "tuNgayTao": null
    }
    let res = await this.phuongAnKeHoachLCNTService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
      }
      this.totalRecord = data.totalElements;
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
    }
    catch (e) {
      console.log('error: ', e)
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
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
