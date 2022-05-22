import { N } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { ThongTinDmTieuChuanHangDtqgComponent } from './thong-tin-dm-tieu-chuan-hang-dtqg/thong-tin-dm-tieu-chuan-hang-dtqg.component';

@Component({
  selector: 'app-danh-muc-tieu-chuan-hang-dtqg',
  templateUrl: './danh-muc-tieu-chuan-hang-dtqg.component.html',
  styleUrls: ['./danh-muc-tieu-chuan-hang-dtqg.component.scss']
})
export class DanhMucTieuChuanHangDtqgComponent implements OnInit {
  searchFilter: any = {
    maHang: null,
    namQchuan: null,
    tenQchuan: null,
    trangThai: null,
  }

  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  search() {

  }

  clearFilter() {
    this.searchFilter = {
      maHang: null,
      namQchuan: null,
      tenQchuan: null,
      trangThai: null,
    };
  }

  convertTrangThai(status) {
    return status;
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

  redirectToChiTiet(data?: number) {
    if (!data) {
      let modal = this.modal.create({
        nzTitle: data
          ? 'Cập nhập nhóm quyền'
          : 'Thêm mới nhóm quyền',
        nzContent: ThongTinDmTieuChuanHangDtqgComponent,
        nzClosable: true,
        nzFooter: null,
        nzStyle: { top: '50px' },
        nzWidth: 600,
        nzComponentParams: { data },
      });
      modal.afterClose.subscribe((b) => {
        if (b) {

        }
      });
    }
  }
}
