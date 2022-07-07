import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI } from 'src/app/Utility/utils';

@Component({
  selector: 'app-dialog-dieu-chinh-copy',
  templateUrl: './dialog-dieu-chinh-copy.component.html',
  styleUrls: ['./dialog-dieu-chinh-copy.component.scss']
})
export class DialogDieuChinhCopyComponent implements OnInit {
    @Input() obj: any;

    response: any;
    dotBcao: number;
    id: any;
    dotBcaos: any[] = [
        {
          id: 1
        },
        {
          id: 2
        }
      ]

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.response = {
            ...this.obj,
        };
        this.response.loaiCopy = 'C'
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
