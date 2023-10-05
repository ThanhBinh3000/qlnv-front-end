import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';

@Component({
  selector: 'dialog-phieu-nhap-kho',
  templateUrl: './dialog-phieu-nhap-kho.component.html',
  styleUrls: ['./dialog-phieu-nhap-kho.component.scss'],
})
export class DialogPhieuNhapKhoComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = "";

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
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
      "denNgay": null,
      "maDonVi": null,
      "maKhoNgan": null,
      "pageSize": this.pageSize,
      "pageNumber": this.page,
      "soPhieu": this.text,
      "tuNgay": null,
      "trangThai": "02",
      "vatTuId": null,
    };
    let res = await this.quanLyPhieuNhapKhoService.timKiem(body);
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
