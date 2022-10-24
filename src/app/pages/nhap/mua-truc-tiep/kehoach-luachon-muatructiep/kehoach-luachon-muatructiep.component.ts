import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-kehoach-luachon-muatructiep',
  templateUrl: './kehoach-luachon-muatructiep.component.html',
  styleUrls: ['./kehoach-luachon-muatructiep.component.scss']
})
export class KehoachLuachonMuatructiepComponent implements OnInit {
  tabs: any[] = [];


  constructor(
    private danhMucService: DanhMucService
  ) {
    this.loaiVTHHGetAll();
  }
  ngOnInit() {

  }
  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [...this.tabs,
      ...res.data.filter((item) => item.ma == '0101'),
      ];
    }
  }
  loaiVthhSelected: string = '0101';
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}