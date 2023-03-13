import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-kiem-tra-cluong-btt',
  templateUrl: './kiem-tra-cluong-btt.component.html',
  styleUrls: ['./kiem-tra-cluong-btt.component.scss']
})
export class KiemTraCluongBttComponent implements OnInit {
  tabs: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) { }

  ngOnInit() {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {

    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          this.tabs.push(element);
        });
        this.selectTab(this.tabs[0].ma);
      }
    }
  }

  loaiVthhSelected: string;
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
