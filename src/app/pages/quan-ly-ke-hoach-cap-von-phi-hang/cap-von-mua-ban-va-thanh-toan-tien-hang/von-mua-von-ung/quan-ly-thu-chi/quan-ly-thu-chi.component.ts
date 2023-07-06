import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { Const, TienThua } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'app-quan-ly-thu-chi',
    templateUrl: './quan-ly-thu-chi.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss']
})
export class QuanLyThuChiComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Op = Operator;
    namDnghi: number;
    lstCtiets: TienThua[] = [];
    scrollX: string;
    lstNam: number[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
    ) { }

    async ngOnInit() {
        this.scrollX = this.userService.isChiCuc() ? Table.tableWidth(200, 9, 1, 0) : Table.tableWidth(200, 12, 1, 0);
        this.namDnghi = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(this.namDnghi + i);
        }
        this.search();
    }

    async search() {
        // this.spinner.show();
        // await this.capVonMuaBanTtthService.timKiemVonMuaBan('').toPromise().then(
        //     (data) => {
        //         if (data.statusCode == 0) {
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     }
        // );
        // this.spinner.hide();
    }
}
