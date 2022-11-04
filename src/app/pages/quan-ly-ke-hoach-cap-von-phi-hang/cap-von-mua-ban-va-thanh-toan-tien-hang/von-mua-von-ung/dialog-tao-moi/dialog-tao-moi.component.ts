import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { LOAI_VON } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() obj: any;

    userInfo: any;
    response: any = {
        loaiCap: null,
        ngayLap: null,
        soLenhChiTien: null,
        maCvUv: null,
        khachHang: null,
    };

    loaiVons: any[] = LOAI_VON;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
    }

    handleOk() {
        if (this.obj?.tab == 'gnv') {
            if (!this.response.ngayLap || !this.response.soLenhChiTien || !this.response.loaiCap) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        } else {
            if (!this.response.maCvUv) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
            if (this.obj?.tab == 'thanhtoan' && !this.response.khachHang) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
