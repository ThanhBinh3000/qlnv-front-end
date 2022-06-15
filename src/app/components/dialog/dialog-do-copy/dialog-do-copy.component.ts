import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CAN_CU_GIA, LBC_KET_QUA_THUC_HIEN_HANG_DTQG, LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, LOAI_DE_NGHI, LOAI_VON, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-do-copy',
    templateUrl: './dialog-do-copy.component.html',
    styleUrls: ['./dialog-do-copy.component.scss'],
})
export class DialogDoCopyComponent implements OnInit {
    @Input() obj: any;

    response: any;
    danhSach: any[];
    loaiVons: any[] = LOAI_VON;


    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.response = {
            ...this.obj,
        };
        this.danhSach = this.obj?.danhSach;
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
        if (this.obj.qdChiTieu){
            if (!this.response.qdChiTieu){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }
        if (this.obj.maCvUv){
            if (!this.response.maCvUv){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }

        if (this.obj.khachHang){
            if (!this.response.khachHang){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }

        if (this.obj.maCvUvBtc){
            if (!this.response.maCvUvBtc){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }

        if (this.obj.loaiVon){
            if (!this.response.loaiVon){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }

        if (this.obj.soLenhChiTien){
            if (!this.response.soLenhChiTien){
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }

        if (this.obj.ngayLap){
            if (!this.response.ngayLap){
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
