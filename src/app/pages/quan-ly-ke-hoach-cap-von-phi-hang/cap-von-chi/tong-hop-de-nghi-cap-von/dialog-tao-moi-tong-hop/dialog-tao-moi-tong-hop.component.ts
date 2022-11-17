import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi-tong-hop',
    templateUrl: './dialog-tao-moi-tong-hop.component.html',
    styleUrls: ['./dialog-tao-moi-tong-hop.component.scss'],
})

export class DialogTaoMoiTongHopComponent implements OnInit {
    @Input() nguonBcaos: any;

    userInfo: any;
    response: any = {
        namDn: null,
        qdChiTieu: null,
        nguonBcao: null,
    };

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private userService: UserService,
        private capVonNguonChiService: CapVonNguonChiService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
    }

    getSoQdChiTieu() {
        const request = {
            namKHoach: this.response.namDn,
            maDvi: this.userInfo?.MA_DVI,
        }
        this.spinner.show();
        this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.response.qdChiTieu = data.data[0];
                    if (!this.response.qdChiTieu) {
                        this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy số quyết định chỉ tiêu cho năm ' + this.response.namDn);
                        this.response.namDn = null;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.namDn = null;
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.namDn = null;
            }
        )
        this.spinner.hide();
    }

    handleOk() {
        if (!this.response.namDn) {
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
