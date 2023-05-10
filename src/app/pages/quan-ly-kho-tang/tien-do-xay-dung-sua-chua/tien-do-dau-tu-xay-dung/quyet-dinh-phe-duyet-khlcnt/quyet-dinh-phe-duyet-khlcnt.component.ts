import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {STATUS} from "../../../../../constants/status";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-khlcnt',
  templateUrl: './quyet-dinh-phe-duyet-khlcnt.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-khlcnt.component.scss']
})
export class QuyetDinhPheDuyetKhlcntComponent implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  @Input()
  itemDuAn: any;
  @Input("itemQdPdTktcTdt") itemQdPdTktcTdt: any;
  @Input("itemQdPdKhLcnt") itemQdPdKhLcnt: any;
  STATUS = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  @Output() dataItemKhLcnt = new EventEmitter<object>();

  constructor(
    public userService: UserService,
    public quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService
  ) {
  }

  async ngOnInit() {
    if (this.itemQdPdKhLcnt) {
      this.selectedId = this.itemQdPdKhLcnt.id;
      this.isDetail = true;
      this.isViewDetail = this.itemQdPdKhLcnt.trangThai == STATUS.BAN_HANH ? true : false;
    }
  }

  showList() {
    this.isDetail = false;
  }

  receivedData(data: any) {
    this.itemQdPdKhLcnt = data;
    this.emitDataKhLcnt(data);
  }

  emitDataKhLcnt(data) {
    this.dataItemKhLcnt.emit(data);
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
