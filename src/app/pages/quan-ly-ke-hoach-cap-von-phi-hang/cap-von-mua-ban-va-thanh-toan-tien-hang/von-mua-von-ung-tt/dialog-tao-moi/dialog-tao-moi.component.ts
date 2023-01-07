import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { LOAI_DE_NGHI, LOAI_VON, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() obj: any;

    userInfo: any;
    response: any = {
        namBcao: null,
        loaiDnghi: null,
    };

    loaiDns: any[] = LOAI_DE_NGHI;

    constructor(
        private _modalRef: NzModalRef,
        private userService: UserService,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        if (!this.userService.isTongCuc()) {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        }
    }

    handleOk() {
        if (!this.response.namBcao || !this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
