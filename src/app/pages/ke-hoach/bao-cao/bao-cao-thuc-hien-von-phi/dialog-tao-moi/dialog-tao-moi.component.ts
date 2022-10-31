import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BAO_CAO_DOT, LBC_KET_QUA_THUC_HIEN_HANG_DTQG } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() obj: any;

    nam: number;
    userInfo: any;
    response: any = {
        namBcao: null,
        dotBcao: null,
        maLoaiBcao: null,
    };
    baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
    }

    handleOk() {
        if (!this.response.namBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.maLoaiBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.dotBcao && this.response.maLoaiBcao == BAO_CAO_DOT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.response.maLoaiBcao != BAO_CAO_DOT) {
            this.response.dotBcao = 0;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
