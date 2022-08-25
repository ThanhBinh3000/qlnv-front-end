import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DeXuatDieuChinhService } from 'src/app/services/deXuatDieuChinh.service';
import { QuyetDinhDieuChinhChiTieuKeHoachNamService } from 'src/app/services/quyetDinhDieuChinhChiTieuKeHoachNam.service';
import {QuyetDinhGiaCuaBtcService} from "../../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaCuaBtc.service";

@Component({
  selector: 'dialog-to-trinh-tong-hop',
  templateUrl: './dialog-to-trinh-tong-hop.component.html',
  styleUrls: ['./dialog-to-trinh-tong-hop.component.scss'],
})
export class DialogToTrinhTongHopComponent implements OnInit {
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = '';
  isDexuat: boolean = false;
  type?: string;
  maDVi?: string;
  namKeHoach?: number;
  capDonVi: number;
  dsToTrinhDeXuat: any[] = [];
  radioValue = [];
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhDieuChinhChiTieuKeHoachNamService: QuyetDinhDieuChinhChiTieuKeHoachNamService,
    private notification: NzNotificationService,
    private deXuatDieuChinhService: DeXuatDieuChinhService,
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.search();
      await this.loadToTrinhDeXuat();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // handleOk(item: any) {
  //   this.isVisible = false;
  //   this.isVisibleChange.emit(this.isVisible);
  //   this._modalRef.close(item);
  // }

  handleOk() {
    this._modalRef.close(this.radioValue);
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
      ngayKyDenNgay: null,
      id: 0,
      donViId: null,
      maDvi: this.maDVi ?? null,
      namKeHoach: this.namKeHoach ?? null,
      tenDvi: null,
      pageNumber: this.page,
      pageSize: this.pageSize,
      soQD: this.text,
      soQuyetDinh: this.text,
      trichYeu: null,
      ngayKyTuNgay: null,
      trangThai: '02',
      capDvi: this.capDonVi,
    };
    if (this.type && this, this.type == 'de-xuat') {
      let res = await this.deXuatDieuChinhService.timKiem(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        if (data && data.content && data.content.length > 0) {
          this.dataTable = data.content;
        }
        this.totalRecord = data.totalElements;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } else if (this.type && this, this.type == 'dieu-chinh') {
      let res = await this.quyetDinhDieuChinhChiTieuKeHoachNamService.timKiem(body);
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
    else {
      let res = await this.chiTieuKeHoachNamService.timKiem(body);
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

  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let res = await this.quyetDinhGiaCuaBtcService.loadToTrinhTongHop({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }
}
