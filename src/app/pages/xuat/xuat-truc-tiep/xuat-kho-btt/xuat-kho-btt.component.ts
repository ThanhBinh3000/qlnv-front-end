import { Component, OnInit } from '@angular/core';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-xuat-kho-btt',
  templateUrl: './xuat-kho-btt.component.html',
  styleUrls: ['./xuat-kho-btt.component.scss']
})
export class XuatKhoBttComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string;
  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) { }
  ngOnInit(): void {
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
        this.selectTab(this.tabs[0].ma);
      }
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

}

