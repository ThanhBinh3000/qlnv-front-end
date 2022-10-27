import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-bao-cao-thuc-hien-du-toan-chi',
    templateUrl: './bao-cao-thuc-hien-du-toan-chi.component.html',
    styleUrls: ['./bao-cao-thuc-hien-du-toan-chi.component.scss']
})
export class BaoCaoThucHienDuToanChiComponent implements OnInit {
    countQuyetDinh: number = 0;
    countChiTieu: number = 0;
    countDieuChinh: number = 0;
    countDuToan: number = 0;
    tabSelected = 'baocao';
    constructor(
        private spinner: NgxSpinnerService,
        // private giaoKeHoachVonDauNamService: GiaoKeHoachVonDauNamService,
        // private notification: NzNotificationService,
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
