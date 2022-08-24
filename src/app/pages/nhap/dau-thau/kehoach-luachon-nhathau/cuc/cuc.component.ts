import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_VAT_TU_HANG_HOA } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import {
  convertIdToLoaiVthh,
  convertTenVthh,
} from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-cuc',
  templateUrl: './cuc.component.html',
  styleUrls: ['./cuc.component.scss'],
})
export class CucComponent implements OnInit {
  constructor(private danhMucService: DanhMucService, public globals: Globals) {
    this.loaiVTHHGetAll();
  }

  ngOnInit() { }
  tabs: any;
  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: null,
      },
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = [
        ...this.tabs,
        ...res.data.filter((item) => item.ma !== '02'),
      ];
    }
  }

  loaiVthhSelected: string;
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
