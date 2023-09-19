import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Table } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { Cvmb, ThanhToan } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'app-quan-ly-von-ban',
    templateUrl: './quan-ly-von-ban.component.html',
    styleUrls: ['../von-ban.component.scss']
})
export class QuanLyVonBanComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Op = Operator;
    Cvmb = Cvmb;
    namDnghi: number;
    id: string;
    lstCtiets: ThanhToan[] = [];
    scrollX: string;
    lstNam: number[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
    ) { }

    async ngOnInit() {
        this.scrollX = this.userService.isChiCuc() ? Table.tableWidth(200, 6, 0, 0) : Table.tableWidth(200, 6, 0, 0);
        this.namDnghi = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(this.namDnghi + i);
        }
        this.search();
    }

    async search() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.ctietThuChi(this.namDnghi, Cvmb.QUAN_LY_VON_BAN).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.lstCtiets = [];
                    data.data.forEach(item => {
                        this.lstCtiets.push(new ThanhToan(item));
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }
}
