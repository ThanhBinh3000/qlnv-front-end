import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, Utils } from 'src/app/Utility/utils';
import * as dayjs from 'dayjs';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';

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
        thangBcao: null,
        maLoaiBcao: null,
    };
    baoCaos: any = LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI;
    lstNam: number[] = [];
    isDisable = false;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
    ) { }

    async ngOnInit() {
        const thisYear = dayjs().get('year');
        for (let i = -10; i < 30; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    changeModel() {
        if (this.response.maLoaiBcao == '528') {
            this.response.thangBcao = 1;
            this.isDisable = true;
        } else {
            this.isDisable = false;
        }
    }

    async handleOk() {
        if (!this.response.namBcao || !this.response.maLoaiBcao ||
            (!this.response.thangBcao && this.response.maLoaiBcao != '527')) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        let check = false;					//kiem tra bao cao da ton tai chua
        const request = {
            maPhanBcao: '0',
            namBcao: this.response.namBcao,
            thangBcao: this.response.thangBcao,
            maLoaiBcao: this.response.maLoaiBcao,
            trangThais: [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_4, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_9],
            paggingReq: {
                limit: 10,
                page: 1
            },
            str: "",
            loaiTimKiem: '0',
        }

        if (request.maLoaiBcao == '527') {
            request.thangBcao = null
        }

        await this.baoCaoThucHienDuToanChiService.timBaoCao(request).toPromise().then(res => {
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
        if (this.response.maLoaiBcao == '527') {
            this.response.thangBcao = 0;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
