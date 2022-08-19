import { Component, OnInit } from '@angular/core';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'dialog-chi-tiet-giao-dich-hang-trong-kho',
  templateUrl: './dialog-chi-tiet-giao-dich-hang-trong-kho.component.html',
  styleUrls: ['./dialog-chi-tiet-giao-dich-hang-trong-kho.component.scss']
})
export class DialogChiTietGiaoDichHangTrongKhoComponent implements OnInit {
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;

  dataView: any;
  isView: boolean;
  dataTable: any = []
  dataTableAll: any = []

  filterTable: any = {
    ngayPheDuyet: null,
    soPhieu: null,
    tongSoLuong: null,
    tonCuoiKy: null,
  }
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private notification: NzNotificationService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show()
      await this.loadData()
      this.spinner.hide();

    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }


  async loadData() {
    let body = {
      "denNgay": "2025-08-26",
      "tuNgay": "2000-08-17",
      "maLokho": "0101020101010102",
      "maVatTu": "010101",
      "paggingReq": {
        "limit": 100000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      }
    }
    let res = await this.quanLyHangTrongKhoService.searchDetail(body)

    if (res.msg === MESSAGE.SUCCESS) {
      this.dataTable = [...res.data.content]
      this.totalRecord = res.data.totalElements;
      this.dataTableAll = cloneDeep(this.dataTable);
      console.log(this.dataTableAll);

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
  }
  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.loadData();
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
      if (this.page === 1) {
        await this.loadData();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = {
          "denNgay": "2025-08-26",
          "tuNgay": "2000-08-17",
          "maLokho": "0101020101010102",
          "maVatTu": "010101",
          "paggingReq": {
            "limit": 100000,
            "orderBy": "",
            "orderType": "",
            "page": 0
          }
        }

        this.quanLyHangTrongKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-chi-tiet-hang-trong-kho.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    }
  }
  filterInTable(key: string, value: any) {
    if (value && value != '') {
      if (typeof value == 'number') {
        console.log(value);
      }
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp]
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }
  onCancel() {
    this._modalRef.close();
  }
}
