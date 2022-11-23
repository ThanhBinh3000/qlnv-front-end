import {Component, OnInit, SimpleChanges} from '@angular/core';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-ke-hoach-ban-dau-gia',
  templateUrl: './ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./ke-hoach-ban-dau-gia.component.scss']
})
export class KeHoachBanDauGiaComponent implements OnInit {
  tabs: any[]=[];
  loaiVthhSelected: string;

  constructor(private danhMucService: DanhMucService) {
    this.loaiVTHHGetAll();
  }

  ngOnInit() {
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
/*
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }*/

}
