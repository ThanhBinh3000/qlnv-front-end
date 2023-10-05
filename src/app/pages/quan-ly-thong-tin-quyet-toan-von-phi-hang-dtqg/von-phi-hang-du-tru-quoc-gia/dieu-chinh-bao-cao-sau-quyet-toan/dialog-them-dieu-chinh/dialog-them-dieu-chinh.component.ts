import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
    selector: 'app-dialog-them-dieu-chinh',
    templateUrl: './dialog-them-dieu-chinh.component.html',
})

export class DialogThemDieuChinhComponent implements OnInit {
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
        maPhanBcao: '2',
        namQtoan: null,
        thangBcao: null,
    };


    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {

    };

    async handleOk() {
        if (!this.response.namQtoan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.response.namQtoan >= 3000 || this.response.namQtoan < 1000) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
            return;
        }
        this._modalRef.close(this.response);
    };

    handleCancel() {
        this._modalRef.close();
    };
}
