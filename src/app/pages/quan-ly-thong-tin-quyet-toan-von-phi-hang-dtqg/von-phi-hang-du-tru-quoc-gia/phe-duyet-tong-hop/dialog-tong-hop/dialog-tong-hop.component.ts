import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
    selector: 'app-dialog-tong-hop',
    templateUrl: './dialog-tong-hop.component.html',
})

export class DialogTongHopComponent implements OnInit {
    @Input() obj: any;
    lstQuy: any[] = [
        {
            val: 1,
            ten: "quý 1"
        },
        {
            val: 2,
            ten: "quý 2"
        },
        {
            val: 3,
            ten: "quý 3"
        },
        {
            val: 4,
            ten: "quý 4"
        }
    ]
    lstNam: number[] = [];
    response: any = {
        maPhanBcao: '1',
        namQtoan: null,
        quyQtoan: null,
    };


    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        const thisYear = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    async handleOk() {
        if (!this.response.namQtoan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.quyQtoan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.response.namnamQtoanBcao >= 3000 || this.response.namQtoan < 1000) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
