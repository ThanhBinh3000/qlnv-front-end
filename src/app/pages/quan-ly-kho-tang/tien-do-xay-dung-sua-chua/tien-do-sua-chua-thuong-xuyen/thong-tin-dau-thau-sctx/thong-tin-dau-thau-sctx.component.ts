import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {STATUS} from "../../../../../constants/status";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-thong-tin-dau-thau-sctx',
  templateUrl: './thong-tin-dau-thau-sctx.component.html',
  styleUrls: ['./thong-tin-dau-thau-sctx.component.scss']
})
export class ThongTinDauThauSctxComponent implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  @Input() itemQdPdKhLcnt: any;
  @Input() itemDuAn: any;
  STATUS  = STATUS;
  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật'},
    {ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Hoàn thành'},
  ];
  @Output() dataItemTtdt = new EventEmitter<object>();

  constructor(
    public userService: UserService,
  ) {

  }

  async ngOnInit() {
    if (this.itemQdPdKhLcnt) {
      this.selectedId = this.itemQdPdKhLcnt.id;
      this.isDetail = true;
    }
  }

  showList() {
    this.isDetail = false;
  }
  receivedData(data: any) {
    this.itemQdPdKhLcnt = data;
    this.emitDataTtdt(data);
  }
  emitDataTtdt(data) {
    this.dataItemTtdt.emit(data);
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
