import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
@Component({
    selector: 'app-dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() tab: string;

    response: any = {
        namPa: null,
    };
    userInfo: any;
    lstNam: number[] = [];
    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private userService: UserService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        // this.response.maDvi = this.userInfo?.MA_DVI;
        const thisYear = dayjs().get('year');
        for (let i = -50; i < 30; i++) {
            this.lstNam.push(thisYear + i);
        }
    };

    async handleOk() {
        if (!this.response.namPa) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.response.namPa < 999 && this.response.namPa > 3000) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
            return;
        }
        let data: any = {
            isStatus: "1",
            namPa: this.response.namPa
        }
        this._modalRef.close(
            data
        );
    };

    handleCancel() {
        this._modalRef.close();
    };
}
