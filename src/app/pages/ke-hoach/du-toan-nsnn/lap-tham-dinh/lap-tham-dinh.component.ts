import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST } from './lap-tham-dinh.constant';

@Component({
    selector: 'app-lap-tham-dinh',
    templateUrl: './lap-tham-dinh.component.html',
    styleUrls: ['./lap-tham-dinh.component.scss'],
})
export class LapThamDinhComponent implements OnInit {
    @ViewChild('nzTreeComponent', { static: false })

    //thong tin dang nhap
    userInfo: any;
    donVis: any[] = [];
    capDvi: string;


    QuanLyLapThamDinhDuToanNSNNList = QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST;
    danhSach: any[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();

        this.QuanLyLapThamDinhDuToanNSNNList.forEach(data => {
            let check = false;
            data.Role.forEach(item => {
                if (this.userService.isAccessPermisson(item)) {
                    check = true;
                    return;
                }
            })
            if (check) {
                this.danhSach.push(data);
            }
        })
        this.spinner.hide();
    }

    redirectThongTinChiTieuKeHoachNam() {
        this.router.navigate([
            '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
            1,
        ]);
    }
}
