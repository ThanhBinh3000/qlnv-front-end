import {Component, OnInit} from '@angular/core';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-dieuchinh-khbdg',
  templateUrl: './dieuchinh-khbdg.component.html',
  styleUrls: ['./dieuchinh-khbdg.component.scss']
})
export class DieuchinhKhbdgComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string;

  constructor(private danhMucService: DanhMucService) {
    this.loaiVTHHGetAll();
  }

  ngOnInit(): void {
    this.loaiVthhSelected = '0101';
  }

  async loaiVTHHGetAll() {
    /*this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: ""
      }
    ];*/
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
