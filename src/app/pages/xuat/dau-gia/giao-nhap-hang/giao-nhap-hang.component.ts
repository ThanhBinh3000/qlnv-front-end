import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-giao-nhap-hang',
  templateUrl: './giao-nhap-hang.component.html',
  styleUrls: ['./giao-nhap-hang.component.scss'],
})
export class GiaoNhapHangComponent implements OnInit {
  tabs: any[] = [];
  count: Array<number> = [];
  constructor(
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
    public globals: Globals,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.loaiVTHHGetAll();
    this.getCount();
  }
  async loaiVTHHGetAll() {
    this.tabs = [
      {
        giaTri: 'Tất cả',
        ma: null,
      },
    ];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          element.count = 0;
          this.tabs.push(element);
        });
      }
    }
  }
  async getCount() {

  }

  loaiVthhSelected: string;
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }
}
