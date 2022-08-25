import { Component, OnInit } from '@angular/core';
import {MESSAGE} from "../../../constants/message";
import {QuyetDinhGiaCuaBtcService} from "../../../services/quyetDinhGiaCuaBtc.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {NgxSpinnerService} from "ngx-spinner";
import {QuanLyHopDongNhapXuatService} from "../../../services/quanLyHopDongNhapXuat.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-dialog-so-to-trinh-pag',
  templateUrl: './dialog-so-to-trinh-pag.component.html',
  styleUrls: ['./dialog-so-to-trinh-pag.component.scss']
})
export class DialogSoToTrinhPagComponent implements OnInit {
  dsToTrinhDeXuat: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = "";
  data: any[] = [];
  constructor(
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private quanLyHopDongNhapXuatService: QuanLyHopDongNhapXuatService,
    private notification: NzNotificationService
  ) {

  }

  async ngOnInit() {
    await Promise.all([
      this.loadToTrinhDeXuat()
    ]);
  }


  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let res = await this.quyetDinhGiaCuaBtcService.loadToTrinhTongHop({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
    console.log(this.dsToTrinhDeXuat)
  }

  handleOk(item: any) {
    if (item.checked) {
      if (this.dsToTrinhDeXuat.findIndex(tt => tt.id == item.id) == -1) {
        this.dsToTrinhDeXuat.push(item);
      }
    } else {
      this.dsToTrinhDeXuat = this.dsToTrinhDeXuat.filter(tt => tt.id !== item.id);
    }
  }

  handleCancel() {
    this._modalRef.close();
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

  selectToTrinh(toTrinh: any) {
    this._modalRef.close(toTrinh);
  }

}
