import {Component, OnInit} from '@angular/core';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-quyet-dinh-uyquen-banle-btt',
  templateUrl: './quyet-dinh-uyquen-banle-btt.component.html',
  styleUrls: ['./quyet-dinh-uyquen-banle-btt.component.scss']
})
export class QuyetDinhUyquenBanleBttComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string

  constructor(
    public userService: UserService,
    private danhMucService: DanhMucService,
  ) {
  }

  async ngOnInit() {
    await this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg === MESSAGE.SUCCESS && res.data && res.data.length > 0) {
      this.tabs = res.data.map(element => {
        return {...element, count: 0};
      });
      this.selectTab(this.tabs[0].ma);
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
