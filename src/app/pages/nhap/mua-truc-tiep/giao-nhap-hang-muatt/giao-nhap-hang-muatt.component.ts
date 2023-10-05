import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-giao-nhap-hang-muatt',
  templateUrl: './giao-nhap-hang-muatt.component.html',
  styleUrls: ['./giao-nhap-hang-muatt.component.scss']
})
export class GiaoNhapHangMuattComponent implements OnInit {

  tabs: any[] = [];
  count: Array<number> = [];
  constructor(
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
    public globals: Globals,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.loaiVTHHGetAll();
    this.spinner.hide();

  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.tabs = res.data.filter(item => item.ma == '0101');
    }
  }

  loaiVthhSelected: string = '0101';
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }




}