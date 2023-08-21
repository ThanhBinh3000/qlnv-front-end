import { Component, OnInit } from '@angular/core';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Globals} from "../../../../shared/globals";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-quyetdinh-ketqua-lcnt',
  templateUrl: './quyetdinh-ketqua-lcnt.component.html',
  styleUrls: ['./quyetdinh-ketqua-lcnt.component.scss']
})
export class QuyetdinhKetquaLcntComponent implements OnInit {
  loaiVthhSelected: string;
  tabs: any[] = [];
  listVthh: any[] = []
  constructor(
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.loaiVTHHGetAll();
  }
  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.listVthh = res.data;
        res.data.forEach((element) => {
          this.tabs.push(element);
        });
        this.selectTab(this.tabs[0].ma);
      }
    }
  }

  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

}
