import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';

@Component({
    selector: 'dialog-chon-loai-bao-quan',
    templateUrl: './dialog-chon-loai-bao-quan.component.html',
    // styleUrls: ['./dialog-them-khoan-muc.component.scss'],
})
export class DialogChonLoaiBaoQuanComponent implements OnInit {
    @Input() dsBaoQuan: any[];
    loaiBaoQuan: any;
    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
    }

    changeModel() {
    }

    handleOk() {
        if (this.dsBaoQuan.length > 0 && !this.loaiBaoQuan) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn loại bảo quản');
            return;
        }
        this._modalRef.close(this.loaiBaoQuan);
    }

    handleCancel() {
        this._modalRef.close();
    }
}