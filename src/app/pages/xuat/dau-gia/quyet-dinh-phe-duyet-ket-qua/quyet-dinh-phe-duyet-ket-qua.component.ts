import {Component, OnInit} from '@angular/core';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../constants/message";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-ket-qua',
  templateUrl: './quyet-dinh-phe-duyet-ket-qua.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-ket-qua.component.scss']
})
export class QuyetDinhPheDuyetKetQuaComponent implements OnInit {
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
