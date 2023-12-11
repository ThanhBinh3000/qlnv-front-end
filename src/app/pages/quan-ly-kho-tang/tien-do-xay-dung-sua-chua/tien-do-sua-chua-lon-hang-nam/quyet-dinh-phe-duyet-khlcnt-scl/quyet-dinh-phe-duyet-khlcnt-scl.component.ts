import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {STATUS} from "../../../../../constants/status";
import {UserService} from "../../../../../services/user.service";
import {
  QdPheDuyetKhlcntTdsclService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/qd-phe-duyet-khlcnt-tdscl.service";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-khlcnt-scl',
  templateUrl: './quyet-dinh-phe-duyet-khlcnt-scl.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-khlcnt-scl.component.scss']
})
export class QuyetDinhPheDuyetKhlcntSclComponent implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  @Input()
  itemDuAn: any;
  @Input("itemQdPdBcKtkt") itemQdPdBcKtkt: any;
  @Input("itemQdPdKhLcnt") itemQdPdKhLcnt: any;
  STATUS = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  @Output() dataItemKhLcnt = new EventEmitter<object>();

  constructor(
    public userService: UserService,
    public quyetdinhpheduyetKhlcntService: QdPheDuyetKhlcntTdsclService
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
