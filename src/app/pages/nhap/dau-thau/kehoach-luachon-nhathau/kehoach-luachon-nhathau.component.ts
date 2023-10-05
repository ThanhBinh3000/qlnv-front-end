import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-kehoach-luachon-nhathau',
  templateUrl: './kehoach-luachon-nhathau.component.html',
  styleUrls: ['./kehoach-luachon-nhathau.component.scss']
})
export class KeHoachLuachonNhathauComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string
  constructor(
    public userService: UserService,
    private danhMucService: DanhMucService,
  ) { }
  ngOnInit(): void {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          element.count = 0;
          this.tabs.push(element);
        });
        this.selectTab(this.tabs[0].ma);
      }
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

}
