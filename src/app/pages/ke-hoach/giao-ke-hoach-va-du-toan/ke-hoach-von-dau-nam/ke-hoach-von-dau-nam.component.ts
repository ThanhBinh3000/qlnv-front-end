import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { GiaoKeHoachVonDauNamService } from 'src/app/services/giaoKeHoachVonDauNam.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ke-hoach-von-dau-nam',
  templateUrl: './ke-hoach-von-dau-nam.component.html',
  styleUrls: ['./ke-hoach-von-dau-nam.component.scss']
})
export class KeHoachVonDauNamComponent implements OnInit {
  countQuyetDinh: number = 0;
  countChiTieu: number = 0;
  countDieuChinh: number = 0;
  countDuToan: number = 0;
  tabSelected = '';
  constructor(
    private spinner: NgxSpinnerService,
    private giaoKeHoachVonDauNamService: GiaoKeHoachVonDauNamService,
    private notification: NzNotificationService,
    public userService: UserService,
  ) { }

  async ngOnInit() {
    // this.spinner.show();
    // try {
    //   let res = await this.giaoKeHoachVonDauNamService.countSoLuong();
    //   if (res.msg == MESSAGE.SUCCESS) {
    //     if (res.data) {
    //       if (res.data.chiTieuKeHoach) {
    //         this.countChiTieu = res.data.chiTieuKeHoach;
    //       }
    //       if (res.data.dieuChinhChiTieu) {
    //         this.countDieuChinh = res.data.dieuChinhChiTieu;
    //       }
    //     }
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.msg);
    //   }
    //   this.spinner.hide();
    // } catch (e) {
    //   console.log('error: ', e);
    //   this.spinner.hide();
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    // }
  }
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
