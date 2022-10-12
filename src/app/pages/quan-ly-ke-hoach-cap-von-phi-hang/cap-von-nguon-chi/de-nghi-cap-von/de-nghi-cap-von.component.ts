import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
    selector: 'app-de-nghi-cap-von',
    templateUrl: './de-nghi-cap-von.component.html',
    styleUrls: ['./de-nghi-cap-von.component.scss']
})
export class DeNghiCapVonComponent implements OnInit {

    tabSelected = 'danhsach';            //chọn tab để hiển thị
    id: string;                          //id cua ban ghi duoc chon
    data: any;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        // try {
        //     // this.listVthh = LIST_VAT_TU_HANG_HOA;
        //     this.yearNow = dayjs().get('year');
        //     for (let i = -3; i < 23; i++) {
        //         this.listNam.push({
        //             value: this.yearNow - i,
        //             text: this.yearNow - i,
        //         });
        //     }
        //     this.initData()
        //     await this.search();
        // } catch (e) {
        //     console.log('error: ', e);
        //     this.spinner.hide();
        //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        // }
    }

    changeTab(obj: any) {
        this.data = obj;
        this.tabSelected = obj.tabSelected;
    }
}
