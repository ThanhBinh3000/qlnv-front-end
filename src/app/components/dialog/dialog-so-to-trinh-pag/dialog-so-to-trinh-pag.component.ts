import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../constants/message";
import {QuyetDinhGiaCuaBtcService} from "../../../services/quyetDinhGiaCuaBtc.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {NgxSpinnerService} from "ngx-spinner";
import {QuanLyHopDongNhapXuatService} from "../../../services/quanLyHopDongNhapXuat.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {QuyetDinhGiaTCDTNNService} from "../../../services/ke-hoach/phuong-an-gia/quyetDinhGiaTCDTNN.service";
import {STATUS} from "../../../constants/status";

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
  constructor(
    private quyetDinhGiaCuaBtcService: QuyetDinhGiaCuaBtcService,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quyetDinhGiaTCDTNNService: QuyetDinhGiaTCDTNNService
  ) {

  }

  async ngOnInit() {
    await Promise.all([
      this.loadToTrinhDeXuat(),
      this.findSoQd()
    ]);
  }


  async loadToTrinhDeXuat() {
    this.dsToTrinhDeXuat = [];
    let body =
    {
      "paggingReq": {
      "limit": 20,
        "page": 0
    },
      "type": this.type,
      "loaiHh" : this.pagtype
    }
    let res = await this.quyetDinhGiaCuaBtcService.loadToTrinhDcTcdtnn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsToTrinhDeXuat = res.data;
    }
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

  async findSoQd() {
    try {
      this.spinner.show();
      let body = {
        "pagType": this.pagtype,
        "paggingReq": {
          "limit": 20,
          "page": 0
        },
        "trangThai": STATUS.DA_DUYET_LDV
      }
      let res = await this.quyetDinhGiaTCDTNNService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsQD = res.data.content
      }
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
    }
    console.log(this.dsQD)
    console.log(this.pagtype)
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
    let res = await this.quyetDinhGiaCuaBtcService.search(body);
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



  handleCancel() {
    this._modalRef.close();
  }

  selectToTrinh(toTrinh: any) {
    this._modalRef.close(toTrinh);
  }

}
