import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-nhap-kho',
  templateUrl: './nhap-kho.component.html',
  styleUrls: ['./nhap-kho.component.scss'],
})
export class NhapKhoComponent implements OnInit {
  loaiVthhSelected: string;

  tabs: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) { }

  ngOnInit() {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          element.count = 0;
          this.tabs.push(element);
        });
        this.selectTab(this.tabs[0].ma)
      }
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
