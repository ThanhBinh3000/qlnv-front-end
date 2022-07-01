import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyHopDongNhapXuatService } from 'src/app/services/quanLyHopDongNhapXuat.service';

@Component({
  selector: 'dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep',
  templateUrl:
    './dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component.html',
  styleUrls: [
    './dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component.scss',
  ],
})
export class DialogChiTietQuyetDinhKhMuaTrucTiepComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = '';

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private quanLyHopDongNhapXuatService: QuanLyHopDongNhapXuatService,
    private notification: NzNotificationService,
  ) {}

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
    this._modalRef.destroy(item);
  }

  onCancel() {
    this._modalRef.close();
  }

  async search() {
    this.dataTable = [];
    this.totalRecord = 0;
    let body = {
      denNgayHdong: '',
      loaiHdong: '',
      maDvi: '',
      maHhoa: '',
      orderBy: '',
      orderDirection: '',
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soHdong: this.text,
      str: '',
      trangThai: '02',
      tthaiHdong: '',
      tuNgayHdong: '',
    };
    let res = await this.quanLyHopDongNhapXuatService.timKiem(body);
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
