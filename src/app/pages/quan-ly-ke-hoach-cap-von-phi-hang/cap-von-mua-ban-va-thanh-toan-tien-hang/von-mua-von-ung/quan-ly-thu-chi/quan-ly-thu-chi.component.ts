import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Table } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { Cvmb, Search, TienThua } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

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
    id: string;
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
        this.scrollX = this.userService.isChiCuc() ? Table.tableWidth(200, 12, 0, 0) : Table.tableWidth(200, 18, 0, 0);
        this.namDnghi = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(this.namDnghi + i);
        }
        this.search();
    }

    async search() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.ctietThuChi(this.namDnghi, Cvmb.QUAN_LY_THU_CHI).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.lstCtiets = [];
                    data.data.forEach(item => {
                        this.lstCtiets.push(new TienThua(item));
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
