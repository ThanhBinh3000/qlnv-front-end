import {Component, Input, OnInit} from '@angular/core';
import {STATUS} from "../../../../../constants/status";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-thong-tin-dau-thau-scl',
  templateUrl: './thong-tin-dau-thau-scl.component.html',
  styleUrls: ['./thong-tin-dau-thau-scl.component.scss']
})
export class ThongTinDauThauSclComponent implements OnInit {
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


  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
