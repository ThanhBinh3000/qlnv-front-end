import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-dieuchinh-kehoach-muatt',
  templateUrl: './dieuchinh-kehoach-muatt.component.html',
  styleUrls: ['./dieuchinh-kehoach-muatt.component.scss']
})
export class DieuchinhKehoachMuattComponent implements OnInit {
  loaiVthhSelected: string;
  tabs: any[] = [];
  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) { }
  ngOnInit(): void {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: null,
      },
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          element.count = 0;
          this.tabs.push(element);
        });
      }
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
