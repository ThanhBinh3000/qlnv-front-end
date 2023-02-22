import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-hop-dong-btt',
  templateUrl: './hop-dong-btt.component.html',
  styleUrls: ['./hop-dong-btt.component.scss']
})
export class HopDongBttComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string;

  constructor(private danhMucService: DanhMucService, public globals: Globals) {
    this.loaiVTHHGetAll();
  }

  ngOnInit() { }
  async loaiVTHHGetAll() {
    this.tabs = [
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [
        ...this.tabs,
        ...res.data,
      ];
    }
    this.selectTab(this.tabs[0].ma)
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
