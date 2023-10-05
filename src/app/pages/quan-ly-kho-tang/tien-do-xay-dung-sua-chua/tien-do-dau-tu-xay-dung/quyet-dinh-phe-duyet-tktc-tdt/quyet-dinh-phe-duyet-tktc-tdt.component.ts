import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetduandtxd.service";
import dayjs from "dayjs";
import {
  QuyetdinhpheduyetTktcTdtService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetTktcTdt.service";
import {STATUS} from "../../../../../constants/status";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-tktc-tdt',
  templateUrl: './quyet-dinh-phe-duyet-tktc-tdt.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-tktc-tdt.component.scss']
})
export class QuyetDinhPheDuyetTktcTdtComponent implements OnInit {

  @Input()
  itemDuAn: any;
  @Input("itemQdPdTktcTdt")
  itemQdPdTktcTdt: any;
  @Input()
  itemQdPdDaDtxd: any;
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  STATUS = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  @Output() dataItemTktcTdt = new EventEmitter<object>();

  constructor(
    public userService: UserService,
  ) {
  }

  async ngOnInit() {
    if (this.itemQdPdTktcTdt) {
      this.selectedId = this.itemQdPdTktcTdt.id;
      this.isDetail = true;
      this.isViewDetail = this.itemQdPdTktcTdt.trangThai == STATUS.BAN_HANH ? true : false;
    }
  }

  showList() {
    this.isDetail = false;
  }

  receivedData(data: any) {
    this.itemQdPdTktcTdt = data;
    this.emitDataTktcTdt(data);
  }

  emitDataTktcTdt(data) {
    this.dataItemTktcTdt.emit(data);
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
