import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LEVEL, LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertIdToLoaiVthh, convertTenVthh, convertTrangThai } from 'src/app/shared/commonFunction';


@Component({
  selector: 'app-tong-cuc',
  templateUrl: './tong-cuc.component.html',
  styleUrls: ['./tong-cuc.component.scss']
})
export class TongCucComponent implements OnInit {
  constructor(
    private danhMucService: DanhMucService
  ) {
    this.loaiVTHHGetAll();
  }
  ngOnInit() {

  }
  tabs: any
  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        value: null,
        ma: ""
      }
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [...this.tabs, ...res.data];
    }
  }

}
