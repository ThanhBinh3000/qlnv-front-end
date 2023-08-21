import {Component, OnInit} from '@angular/core';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Globals} from "../../../../shared/globals";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-ket-qua',
  templateUrl: './quyet-dinh-phe-duyet-ket-qua.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-ket-qua.component.scss']
})
export class QuyetDinhPheDuyetKetQuaComponent implements OnInit {
  tabs: any[] = [];
  count: Array<number> = [];

  constructor(
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    public globals: Globals,
  ) {
  }

  ngOnInit() {
    this.spinner.show();
    this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [];
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
