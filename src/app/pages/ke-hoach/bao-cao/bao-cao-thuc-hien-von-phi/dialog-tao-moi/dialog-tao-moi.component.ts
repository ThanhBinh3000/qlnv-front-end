import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BAO_CAO_DOT, LBC_KET_QUA_THUC_HIEN_HANG_DTQG, Utils } from 'src/app/Utility/utils';
import * as dayjs from 'dayjs';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';

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
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
    ) { }

    async ngOnInit() {
        const thisYear = dayjs().get('year');
        for (let i = -10; i < 20; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    async handleOk() {
        if (!this.response.namBcao || !this.response.maLoaiBcao ||
            (!this.response.dotBcao && this.response.maLoaiBcao == BAO_CAO_DOT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        let check = false;
        const request = {
            maPhanBcao: '1',
            trangThais: [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_4, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_9],
            maLoaiBcao: this.response.maLoaiBcao,
            namBcao: this.response.namBcao,
            dotBcao: this.response.dotBcao,
            paggingReq: {
                limit: 10,
                page: 1
            },
            str: "",
            loaiTimKiem: '0',
        }
        await this.baoCaoThucHienVonPhiService.timBaoCao(request).toPromise().then(res => {
            if (res.statusCode == 0) {
                check = !res.data?.empty;
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })

        if (check) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_REPORT);
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
