import { Component, OnInit } from '@angular/core';
import { DanhMucService } from "../../../../services/danhmuc.service";
import { MESSAGE } from "../../../../constants/message";

@Component({
  selector: 'app-to-chuc-trien-khai',
  templateUrl: './to-chuc-trien-khai.component.html',
  styleUrls: ['./to-chuc-trien-khai.component.scss']
})
export class ToChucTrienKhaiComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string;

  constructor(private danhMucService: DanhMucService) {
    this.loaiVTHHGetAll();
  }

  ngOnInit(): void {
    this.loaiVthhSelected = '0101';
  }

  async loaiVTHHGetAll() {
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

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
