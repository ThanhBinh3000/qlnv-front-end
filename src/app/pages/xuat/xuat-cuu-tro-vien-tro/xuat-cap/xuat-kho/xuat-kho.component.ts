import { Component, OnInit } from '@angular/core';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-xc-xuat-kho ',
  templateUrl: './xuat-kho.component.html',
  styleUrls: ['./xuat-kho.component.scss']
})
export class XuatKhoComponent implements OnInit {
  tabs: any[] = [];

  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
  ) { }
  ngOnInit(): void {
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    // this.tabs = [
    //   {
    //     giaTri: 'Tất cả',
    //     ma: null,
    //   },
    // ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [
        ...this.tabs,
        ...res.data.filter((item) => item.ma == '0101'),
      ];
    }
  }

  loaiVthhSelected: string = '0101';
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

}

