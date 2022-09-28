import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-tong-cuc',
  templateUrl: './tong-cuc.component.html',
  styleUrls: ['./tong-cuc.component.scss']
})
export class TongCucComponent implements OnInit {
  constructor(
    private danhMucService: DanhMucService
  ) {
    this.loaiVTHHGetAll();
  }
  ngOnInit() {

  }
  tabs: any
  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: null
      }
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [...this.tabs, ...res.data];
    }
  }

  loaiVthhSelected: string
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

}
