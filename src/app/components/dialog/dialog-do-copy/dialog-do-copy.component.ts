import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-do-copy',
    templateUrl: './dialog-do-copy.component.html',
    styleUrls: ['./dialog-do-copy.component.scss'],
})
export class DialogDoCopyComponent implements OnInit {
    @Input() obj: any;

    response: any;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.response = {
            ...this.obj,
        };
    }

    handleOk() {
        if (this.obj.namBcao){
            if (!this.response.namBcao){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
            if (this.response.namBcao > 2999 || this.response.namBcao < 1000){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
            }
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
