import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKhlcnt.service";
import {STATUS} from "../../../../../../constants/status";
import {UserService} from "../../../../../../services/user.service";

@Component({
  selector: 'app-thong-tin-dau-thau',
  templateUrl: './thong-tin-dau-thau.component.html',
  styleUrls: ['./thong-tin-dau-thau.component.scss']
})
export class ThongTinDauThauComponent implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  @Input("itemTtdt")
  itemTtdt: any;
  @Input()
  itemDuAn: any;
  @Input()
  itemQdPdDaDtxd: any;
  STATUS  = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật'},
    {ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Hoàn thành'},
  ];

  constructor(
    public userService: UserService,
  ) {

  }

  async ngOnInit() {
    if (this.itemTtdt) {
      this.selectedId = this.itemTtdt.id;
      this.isDetail = true;
      this.isViewDetail = this.itemTtdt.trangThai == STATUS.DA_HOAN_THANH ? true : false;
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
