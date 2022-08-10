import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';

@Component({
  selector: 'app-giao-nhap-hang',
  templateUrl: './giao-nhap-hang.component.html',
  styleUrls: ['./giao-nhap-hang.component.scss']
})
export class GiaoNhapHangComponent implements OnInit {
  tabs: any[] = [];
  count: Array<number> = [];
  constructor(
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
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
        value: null,
        ma: ""
      }
    ];
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
  async getCount() {
    try {
      let res = await this.quyetDinhNhapXuatService.getCount();
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.count = [res.data.tatCa, res.data.thoc, res.data.gao, res.data.muoi, res.data.vatTu];
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loaiVthhSelected: string
  selectTab(loaiVthh) {
    this.loaiVthhSelected = loaiVthh;
  }

}
