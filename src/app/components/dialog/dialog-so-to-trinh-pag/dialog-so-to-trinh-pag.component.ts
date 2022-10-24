import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../constants/message";
import {NzModalRef} from "ng-zorro-antd/modal";
import {PAGE_SIZE_DEFAULT, TYPE_PAG} from "../../../constants/config";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {STATUS} from "../../../constants/status";
import {TongHopPhuongAnGiaService} from "../../../services/ke-hoach/phuong-an-gia/tong-hop-phuong-an-gia.service";

@Component({
  selector: 'app-dialog-so-to-trinh-pag',
  templateUrl: './dialog-so-to-trinh-pag.component.html',
  styleUrls: ['./dialog-so-to-trinh-pag.component.scss']
})
export class DialogSoToTrinhPagComponent implements OnInit {
  @Input() pagtype: string;
  @Input() type: string;
  @Input() loai: string;
  dsToTrinhDeXuat: any[] = [];
  dsQD: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = "";
  data: any[] = [];
  radioValue: any;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService,
    private tongHopPhuongAnGiaService: TongHopPhuongAnGiaService,
  ) {

  }

  async ngOnInit() {
    await Promise.all([
      this.loadToTrinhDeXuat(),
    ]);
  }


  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];

    if (this.pagtype == 'LT' && this.loai == 'STT') {
      let body = {
        "type": this.type,
        "pagType": this.pagtype,
        "dsTrangThai": [STATUS.DA_DUYET_LDV, STATUS.DA_TAO_TT]
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsToTrinhDeXuat = res.data;
      }
    } else if (this.pagtype == 'VT' && this.loai == 'STT') {
      let body = {
        "type": this.type,
        "pagType": this.pagtype,
        "dsTrangThai": [STATUS.DA_DUYET_LDV]
      }
      let res = await this.tongHopPhuongAnGiaService.loadToTrinhDeXuat(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsToTrinhDeXuat = res.data;
      }
    } else if (this.pagtype == 'LT' && this.loai == 'SQD') {
      let body = {
        "pagType": this.pagtype,
        "trangThai": STATUS.BAN_HANH
      }
      let res = await this.tongHopPhuongAnGiaService.loadQuyetDinhGia(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsToTrinhDeXuat = res.data;
      }
    } else if (this.pagtype == 'VT' && this.loai == 'SQD') {
      let body = {
        "pagType": this.pagtype,
        "trangThai": STATUS.BAN_HANH
      }
      let res = await this.tongHopPhuongAnGiaService.loadQuyetDinhGia(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsToTrinhDeXuat = res.data;
      }
    }

  }

  handleOk() {
    let result;
    if (this.loai == 'STT') {
      if (!this.loai.startsWith("02")) {
        result = this.dsToTrinhDeXuat.find(element => element.soToTrinh == this.radioValue);
      } else {
        result = this.dsToTrinhDeXuat.find(element => element.soDeXuat == this.radioValue);
      }
    }
    if (this.loai == 'SQD') {
      result = this.dsToTrinhDeXuat.find(element => element.soQd == this.radioValue);
    }
    this._modalRef.close(result);
  }

  onCancel() {
    this._modalRef.close();
  }

  /*  handleOk(item: any) {
      if (item.checked) {
        if (this.dsToTrinhDeXuat.findIndex(tt => tt.id == item.id) == -1) {
          this.dsToTrinhDeXuat.push(item);
        }
      } else {
        this.dsToTrinhDeXuat = this.dsToTrinhDeXuat.filter(tt => tt.id !== item.id);
      }
    }*/

  async findSoQd() {
    try {
      this.spinner.show();
      let body = {
        "trangThai": STATUS.BAN_HANH,
        "pagType": this.loai
      }
      let res = await this.quyetDinhGiaTCDTNNService.dsSoQd(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsQD = res.data
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    }
  }

  async search() {
  }


  handleCancel() {
    this._modalRef.close();
  }

  selectToTrinh(toTrinh: any) {
    this._modalRef.close(toTrinh);
  }

}
