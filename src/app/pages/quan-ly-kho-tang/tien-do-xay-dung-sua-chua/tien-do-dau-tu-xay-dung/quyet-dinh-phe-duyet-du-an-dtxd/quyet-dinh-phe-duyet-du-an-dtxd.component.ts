import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from "../../../../../components/base2/base2.component";
import dayjs from "dayjs";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {STATUS} from "../../../../../constants/status";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {UserService} from 'src/app/services/user.service';

@Component({
  selector: 'app-quyet-dinh-phe-duyet-du-an-dtxd',
  templateUrl: './quyet-dinh-phe-duyet-du-an-dtxd.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-du-an-dtxd.component.scss']
})
export class QuyetDinhPheDuyetDuAnDtxdComponent implements OnInit {
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

  constructor(
    public userService: UserService,
  ) {
  }

  async ngOnInit() {
    if (this.itemQdPdDaDtxd) {
      this.selectedId = this.itemQdPdDaDtxd.id;
      this.isDetail = true;
      this.isViewDetail = this.itemQdPdDaDtxd.trangThai == STATUS.DU_THAO ? true : false;
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
