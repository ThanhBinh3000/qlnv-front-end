import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {STATUS} from "../../../../../constants/status";
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-quyet-dinh-phe-duyet-bao-cao-ktkt',
  templateUrl: './quyet-dinh-phe-duyet-bao-cao-ktkt.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-bao-cao-ktkt.component.scss']
})
export class QuyetDinhPheDuyetBaoCaoKtktComponent implements OnInit {
  @Input()
  itemDuAn: any;
  @Input() itemQdPdKtkt: any;
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  STATUS = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  @Output() dataItemPdKtkt = new EventEmitter<object>();

  constructor(
    public userService: UserService,
  ) {
  }

  async ngOnInit() {
    if (this.itemQdPdKtkt) {
      this.selectedId = this.itemQdPdKtkt.id;
      this.isDetail = true;
      this.isViewDetail = this.itemQdPdKtkt.trangThai == STATUS.BAN_HANH ? true : false;
    }
  }

  showList() {
    this.isDetail = false;
  }

  receivedData(data: any) {
    this.itemQdPdKtkt = data;
    this.emitDataDaDtxd(data);
  }

  emitDataDaDtxd(data) {
    this.dataItemPdKtkt.emit(data);
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
