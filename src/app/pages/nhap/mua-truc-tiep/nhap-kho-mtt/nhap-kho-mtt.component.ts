import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-nhap-kho-mtt',
  templateUrl: './nhap-kho-mtt.component.html',
  styleUrls: ['./nhap-kho-mtt.component.scss']
})
export class NhapKhoMttComponent implements OnInit {
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