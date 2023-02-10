import { Component, OnInit } from '@angular/core';
import { DanhMucService } from "../../../../services/danhmuc.service";
import { MESSAGE } from "../../../../constants/message";

@Component({
  selector: 'app-to-chuc-trien-khai-ban-truc-tiep',
  templateUrl: './to-chuc-trien-khai-ban-truc-tiep.component.html',
  styleUrls: ['./to-chuc-trien-khai-ban-truc-tiep.component.scss']
})
export class ToChucTrienKhaiBanTrucTiepComponent implements OnInit {
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
