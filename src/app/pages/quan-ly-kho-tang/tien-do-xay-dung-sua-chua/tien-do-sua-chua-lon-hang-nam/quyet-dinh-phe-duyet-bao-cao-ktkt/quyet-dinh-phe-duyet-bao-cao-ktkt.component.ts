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
  @Input("itemQdPdDaDtxd")
  itemQdPdDaDtxd: any;
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  STATUS = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  @Output() dataItemDaDtxd = new EventEmitter<object>();

  constructor(
    public userService: UserService,
  ) {
  }

  async ngOnInit() {
    if (this.itemQdPdDaDtxd) {
      this.selectedId = this.itemQdPdDaDtxd.id;
      this.isDetail = true;
      this.isViewDetail = this.itemQdPdDaDtxd.trangThai == STATUS.BAN_HANH ? true : false;
    }
  }

  showList() {
    this.isDetail = false;
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
