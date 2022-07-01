import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-giao-nhap-hang',
  templateUrl: './giao-nhap-hang.component.html',
  styleUrls: ['./giao-nhap-hang.component.scss']
})
export class GiaoNhapHangComponent implements OnInit {
  tabs: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
  ) { }

  ngOnInit() {
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
