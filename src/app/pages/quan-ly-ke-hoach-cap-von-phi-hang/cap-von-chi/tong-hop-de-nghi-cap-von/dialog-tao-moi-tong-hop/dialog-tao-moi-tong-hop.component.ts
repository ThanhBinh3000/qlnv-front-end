import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi-tong-hop',
    templateUrl: './dialog-tao-moi-tong-hop.component.html',
    styleUrls: ['./dialog-tao-moi-tong-hop.component.scss'],
})

export class DialogTaoMoiTongHopComponent implements OnInit {
    @Input() nguonBcaos: any;

    response: any = {
        qdChiTieu: null,
        nguonBcao: null,
    };

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
    }

    handleOk() {
        if (!this.response.qdChiTieu) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.nguonBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
