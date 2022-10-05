import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-cuc',
  templateUrl: './cuc.component.html',
  styleUrls: ['./cuc.component.scss']
})
export class CucComponent implements OnInit {
  constructor(private danhMucService: DanhMucService, public globals: Globals) {
    this.loaiVTHHGetAll();
  }

  ngOnInit() { }
  tabs: any = [];
  async loaiVTHHGetAll() {

    // this.tabs = [
    //   {
    //     giaTri: 'Tất cả',
    //     ma: null,
    //   },
    // ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [
        ...this.tabs,
        ...res.data.filter((item) => item.ma == '0101'),
      ];
    }
  }

  loaiVthhSelected: string = '0101';
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
