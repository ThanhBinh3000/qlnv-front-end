import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi-de-nghi',
    templateUrl: './dialog-tao-moi-de-nghi.component.html',
    styleUrls: ['./dialog-tao-moi-de-nghi.component.scss'],
})

export class DialogTaoMoiDeNghiComponent implements OnInit {
    @Input() obj: any;

    response: any = {
        qdChiTieu: null,
        canCuGia: null,
        loaiDn: null,
    };

    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;


    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private userService: UserService,
    ) { }

    async ngOnInit() {
        if (this.userService.isTongCuc()) {
            this.loaiDns = this.loaiDns.filter(e => e.id == Utils.MUA_VTU);
            this.canCuGias = this.canCuGias.filter(e => e.id == Utils.HD_TRUNG_THAU);
        } else {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        }
    }

    handleOk() {
        if (!this.response.qdChiTieu) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.canCuGia) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.loaiDn) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
