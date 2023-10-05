import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {STATUS} from "../../../../../constants/status";
import {MESSAGE} from "../../../../../constants/message";
import {HopdongTdscService} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/hopdongTdsc.service";

@Component({
  selector: 'app-hop-dong-sctx',
  templateUrl: './hop-dong-sctx.component.html',
  styleUrls: ['./hop-dong-sctx.component.scss']
})
export class HopDongSctxComponent implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  flagInfo: string = 'addnew';
  STATUS = STATUS;
  @Input()
  itemQdPdKhLcnt: any;
  @Input() itemQdPdKtkt: any;
  @Input()   itemDuAn: any;
  @Input()
  itemTtdt: any;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private modal: NzModalService,
    private hopdongService: HopdongTdscService
  ) {

  }

  showList() {
    this.isDetail = false;
  }

  async ngOnInit() {
    this.loadItemHopDong();
  }

  async loadItemHopDong() {
    if (this.itemQdPdKhLcnt && this.itemTtdt.trangThaiDt == STATUS.HOAN_THANH_CAP_NHAT) {
      let body = {
        "namKh": this.itemTtdt.namKh,
        "idDuAn": this.itemTtdt.idDuAn,
        "idQdPdKtkt": this.itemQdPdKtkt.id,
        "idQdPdKhLcnt": this.itemQdPdKhLcnt.id,
        "loai" : "01"
      }
      let res = await this.hopdongService.detailQdPdKhLcnt(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.redirectToChiTiet(res.data, 'addnew', false);
        } else {
          this.notification.warning(MESSAGE.WARNING, "Không tìm thấy thông tin hợp đồng cho dự án này, vui lòng kiểm tra lại.");
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  // filter() {
  //   if (this.formData.value.ngayKyQdPdKqlct && this.formData.value.ngayKyQdPdKqlct.length > 0) {
  //     this.formData.value.ngayKyTu = this.formData.value.ngayKyQdPdKqlct[0];
  //     this.formData.value.ngayKyDen = this.formData.value.ngayKyQdPdKqlct[1];
  //   }
  //   this.search();
  // }

  redirectToChiTiet(data: any, action, isView?: boolean) {
    this.selectedId = data.id;
    this.itemQdPdKhLcnt = data;
    this.isDetail = true;
    this.flagInfo = action;
    this.isViewDetail = isView ?? false;
  }
}
