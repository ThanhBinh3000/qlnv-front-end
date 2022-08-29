import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { HopDongXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/hop-dong/hopDongXuatHang.service';
import { QuanLyHopDongNhapXuatService } from 'src/app/services/quanLyHopDongNhapXuat.service';

@Component({
  selector: 'dialog-can-cu-hop-dong',
  templateUrl: './dialog-can-cu-hop-dong.component.html',
  styleUrls: ['./dialog-can-cu-hop-dong.component.scss'],
})
export class DialogCanCuHopDongComponent implements OnInit {
  @Input() isXuat: boolean = false;
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = "";
  hopDongList: any[] = [];
  data: any[] = [];
  dataVthh: string;
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private quanLyHopDongNhapXuatService: QuanLyHopDongNhapXuatService,
    private notification: NzNotificationService,
    private hopDongXuatHang: HopDongXuatHangService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.hopDongList = this.data;
      await this.showListHd();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async showListHd() {
    if (this.isXuat) {
      let body = {
        "loaiVthh": this.dataVthh,
        "pageable": {
          "offset": 0,
          "pageNumber": 0,
          "pageSize": 0,
          "paged": true,
          "sort": {
            "empty": true,
            "sorted": true,
            "unsorted": true
          },
          "unpaged": true
        },
        "paggingReq": {
          "limit": 10,
          "orderBy": "string",
          "orderType": "string",
          "page": 0
        }
      }
      let res = await this.quanLyHopDongNhapXuatService.danhSachHopDong(body);
      this.dataTable = res.data;
    }
    else {
      let body = {
        "loaiVthh": this.dataVthh ?? '',
        "paggingReq": {
          limit: 10,
          page: 0,
        }
      };
      let res = await this.hopDongXuatHang.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
    this.hopDongList.forEach(hd => {
      this.dataTable.forEach(dt => {
        if (hd.id === dt.id) {
          hd.hhDdiemNhapKhoList = dt.hhDdiemNhapKhoList
        }
      })
    })
    this._modalRef.close(this.hopDongList);
  }

  async search() {
    this.dataTable = [];
    this.totalRecord = 0;
    let res: any;
    if (this.isXuat) {
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
      res = await this.quanLyHopDongNhapXuatService.timKiem(body);
    }
    else {
      let body = {
        "loaiVthh": this.dataVthh ?? '',
        "paggingReq": {
          limit: this.pageSize,
          page: this.page - 1,
        }
      };
      res = await this.hopDongXuatHang.search(body);
    }
    if (res && res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
        this.dataTable.forEach(hd => {
          this.data.forEach(dt => {
            if (dt.id == hd.id) {
              hd.checked = true;
            }
          });
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
