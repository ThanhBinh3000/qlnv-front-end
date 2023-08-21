import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
    selector: 'dialog-cong-van',
    templateUrl: './dialog-cong-van.component.html',
    styleUrls: ['./dialog-cong-van.component.scss'],
})
export class DialogCongVanComponent implements OnInit {
    soCv: string;
    ngayCv: any;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    ngOnInit() {

    }

    async handleOk() {
        if (!this.soCv || !this.ngayCv) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close({
            soCongVan: this.soCv,
            ngayCongVan: this.ngayCv,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
