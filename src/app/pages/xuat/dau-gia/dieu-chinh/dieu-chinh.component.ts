import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-dieu-chinh',
  templateUrl: './dieu-chinh.component.html',
  styleUrls: ['./dieu-chinh.component.scss']
})
export class DieuChinhComponent implements OnInit , OnChanges {
  tabs: any[] = [];
  constructor(
    private danhMucService: DanhMucService,
  ) { }
  ngOnInit(): void {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: ""
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

  loaiVthhSelected: string
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }
}
