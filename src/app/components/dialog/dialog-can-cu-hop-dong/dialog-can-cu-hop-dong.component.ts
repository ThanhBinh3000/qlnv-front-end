import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyHopDongNhapXuatService } from 'src/app/services/quanLyHopDongNhapXuat.service';

@Component({
  selector: 'dialog-can-cu-hop-dong',
  templateUrl: './dialog-can-cu-hop-dong.component.html',
  styleUrls: ['./dialog-can-cu-hop-dong.component.scss'],
})
export class DialogCanCuHopDongComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = "";
  hopDongList: any[] = [];
  data: any[] = [];
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private quanLyHopDongNhapXuatService: QuanLyHopDongNhapXuatService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  handleOk(item: any) {
    if (item.checked) {
      if (this.hopDongList.findIndex(hd => hd.id == item.id) == -1) {
        this.hopDongList.push(item);
      }
    } else {
      this.hopDongList = this.hopDongList.filter(hd => hd.id !== item.id);
    }
  }


  onCancel() {
    this._modalRef.close(this.hopDongList);
  }

  async search() {
    this.dataTable = [];
    this.totalRecord = 0;

    let body = {
      "denNgayKy": "",
      "loaiVthh": "",
      "maDvi": "",
      "maDviB": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1
      },
      "soHd": this.text,
      "str": "",
      "trangThai": "02",
      "tuNgayKy": ""
    }
    let res = await this.quanLyHopDongNhapXuatService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
        this.dataTable.forEach(hd => {

        })
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
