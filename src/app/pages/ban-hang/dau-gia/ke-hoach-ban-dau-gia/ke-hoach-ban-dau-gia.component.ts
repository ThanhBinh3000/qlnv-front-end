import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';

@Component({
  selector: 'app-ke-hoach-ban-dau-gia',
  templateUrl: './ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./ke-hoach-ban-dau-gia.component.scss']
})
export class KeHoachBanDauGiaComponent implements OnInit {
  tabs: any[] = [];
  count: Array<number> = [];
  constructor(
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    console.log("KeHoachBanDauGiaComponent");

    this.spinner.show();
    this.loaiVTHHGetAll();
    this.getCount();
  }
  async loaiVTHHGetAll() {
    this.tabs = [];
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
      let res = await this.quyetDinhGiaoNhapHangService.getCount();
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

}
