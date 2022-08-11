import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss'],
})
export class HopDongComponent implements OnInit {
  tabs: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
  ) { }

  ngOnInit() {
    this.loaiVTHHGetAll();
  }
  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        value: null,
      }
    ];
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
