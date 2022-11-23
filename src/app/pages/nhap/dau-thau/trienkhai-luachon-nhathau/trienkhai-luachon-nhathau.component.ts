import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-trienkhai-luachon-nhathau',
  templateUrl: './trienkhai-luachon-nhathau.component.html',
  styleUrls: ['./trienkhai-luachon-nhathau.component.scss']
})
export class TrienkhaiLuachonNhathauComponent implements OnInit {
  loaiVthhSelected: string
  tabs: any[] = [];
  constructor(
    private danhMucService: DanhMucService,
  ) { }
  ngOnInit(): void {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [...this.tabs, ...res.data];
      this.selectTab(this.tabs[0].ma);
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
