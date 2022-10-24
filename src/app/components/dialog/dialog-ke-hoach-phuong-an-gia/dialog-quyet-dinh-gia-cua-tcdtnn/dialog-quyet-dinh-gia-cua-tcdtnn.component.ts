import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhGiaTCDTNNService } from 'src/app/services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service';
import { STATUS } from "../../../../constants/status";
import { TongHopPhuongAnGiaService } from "../../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";

@Component({
  selector: 'app-dialog-quyet-dinh-gia-cua-tcdtnn',
  templateUrl: './dialog-quyet-dinh-gia-cua-tcdtnn.component.html',
  styleUrls: ['./dialog-quyet-dinh-gia-cua-tcdtnn.component.scss']
})
export class DialogQuyetDinhGiaCuaTcdtnnComponent implements OnInit {
  @Input() pagtype: string;
  @Input() type: string;
  @Input() loai: string;

  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = '';
  isDexuat: boolean = false;
  maDVi?: string;
  namKeHoach?: number;
  capDonVi: number;
  dsToTrinhDeXuat: any[] = [];
  radioValue: any;
  // pagtype: string;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadToTrinhDeXuat();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  handleOk() {
    let result;
    if (this.pagtype == 'LT') {
      result = this.dsToTrinhDeXuat.find(element => element.soToTrinh == this.radioValue);
    }
    if (this.pagtype == 'VT') {
      result = this.dsToTrinhDeXuat.find(element => element.soDeXuat == this.radioValue);
    }
    this._modalRef.close(result);
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  onCancel() {
    this._modalRef.close();
  }

  /*async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let res = await this.quyetDinhGiaTCDTNNService.loadToTrinhTongHop({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
  }*/

  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    if (this.pagtype == 'LT') {
      let body = {
        "type": this.type,
        "pagType": this.pagtype,
        "dsTrangThai": [STATUS.DA_DUYET_LDV, STATUS.DA_TAO_TT]
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsToTrinhDeXuat = res.data;
      }
    } else if (this.pagtype == 'VT') {
      let body = {
        "type": this.type,
        "pagType": this.pagtype,
        "dsTrangThai": [STATUS.DA_DUYET_LDV]
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsToTrinhDeXuat = res.data;
      }

    }

  }
}

