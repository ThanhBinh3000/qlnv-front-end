import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss'],
})
export class HopDongComponent implements OnInit {
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
        this.selectTab(this.tabs[0].ma);
      }
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
