import {Component, OnInit, SimpleChanges} from '@angular/core';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss'],
})
export class HopDongComponent implements OnInit{
  tabs: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
  ) {
    this.loaiVTHHGetAll();
  }

  ngOnInit() {

  }
  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: null,
      }
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [...this.tabs, ...res.data.filter(item => item.ma !== '02')];
    }
  }
  loaiVthhSelected: string
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
