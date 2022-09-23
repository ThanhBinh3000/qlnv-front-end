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
  constructor(public userService: UserService,
    private danhMucService: DanhMucService,) { }

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
      }
    }
  }
}