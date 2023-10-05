import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-quyet-dinh-uyquen-banle-btt',
  templateUrl: './quyet-dinh-uyquen-banle-btt.component.html',
  styleUrls: ['./quyet-dinh-uyquen-banle-btt.component.scss']
})
export class QuyetDinhUyquenBanleBttComponent implements OnInit {
  tabs: any[] = [];
  count: Array<number> = [];
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
    this.tabs = [
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          element.count = 0;
          this.tabs.push(element);
        });
        this.selectTab(this.tabs[0].ma)
      }
    }
  }

  loaiVthhSelected: string;
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
