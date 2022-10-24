import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-trienkhai-luachon-nhathau',
  templateUrl: './trienkhai-luachon-nhathau.component.html',
  styleUrls: ['./trienkhai-luachon-nhathau.component.scss'],
})
export class TrienkhaiLuachonNhathauComponent implements OnInit {
  tabs: any[] = [];
  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) {}
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
  loaiVthhSelected: string;
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }
}
