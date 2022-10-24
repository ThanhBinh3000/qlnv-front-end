import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-tochuc-trienkhai-muatructiep',
  templateUrl: './tochuc-trienkhai-muatructiep.component.html',
  styleUrls: ['./tochuc-trienkhai-muatructiep.component.scss']
})
export class TochucTrienkhaiMuatructiepComponent implements OnInit {
  tabs: any[] = [];
  constructor(
    private danhMucService: DanhMucService,
  ) { }
  ngOnInit(): void {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    // this.tabs = [
    //   {
    //     giaTri: 'Tất cả',
    //     ma: null,
    //   }
    // ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [...this.tabs, ...res.data.filter((item) => item.ma == '0101'),
      ];
    }
  }

  loaiVthhSelected: string = '0101';
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
