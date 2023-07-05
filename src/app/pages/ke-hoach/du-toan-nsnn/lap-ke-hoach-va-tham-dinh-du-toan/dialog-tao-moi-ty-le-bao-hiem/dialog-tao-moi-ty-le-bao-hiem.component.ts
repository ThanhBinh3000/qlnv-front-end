import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Status } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { CoeffIns, Insurance } from '../lap-ke-hoach-va-tham-dinh-du-toan.class';

@Component({
    selector: 'dialog-tao-moi-ty-le-bao-hiem',
    templateUrl: './dialog-tao-moi-ty-le-bao-hiem.component.html',
    styleUrls: ['./dialog-tao-moi-ty-le-bao-hiem.component.scss'],
})

export class DialogTaoMoiTyLeBaoHiemComponent implements OnInit {
    userInfo: any;
    response: Insurance = new Insurance();
    lstNam: number[] = [];
    danhMucs: any[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private userService: UserService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private danhMucService: DanhMucDungChungService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maDvi = this.userInfo.MA_DVI;

        const thisYear = dayjs().get('year');
        for (let i = 0; i < 10; i++) {
            this.lstNam.push(thisYear - i);
        }
    }

    async checkReport() {
        if (!this.response.nam) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.response = {
            ...new Insurance(),
            nam: this.response.nam,
            maDvi: this.userInfo.MA_DVI,
        }
        const requestReport = {
            namBcao: this.response.nam,
            paggingReq: {
                limit: 1000,
                page: 1,
            },
            trangThais: [],
        };
        await this.lapThamDinhService.danhSachHeSoBh(requestReport).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (data.data.content.length == 0) {
                        this.initNewReport();
                    } else {
                        this.notification.warning(MESSAGE.WARNING, 'Hệ số bảo hiểm năm ' + this.response.nam.toString() + ' đã tồn tại');
                        this.response.nam = null;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.response.nam = null;
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.nam = null;
            }
        )
    }

    async initNewReport() {
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo?.sub;
        this.response.ngayTao = new Date().toString();
        this.response.lstFiles = [];
        this.response.khoiTich = 5000;
        this.response.lstCtiets = [];
        const category = await this.danhMucService.danhMucChungGetAll('LTD_BH');
        if (category) {
            this.danhMucs = category.data;
        }
        this.danhMucs.forEach(e => {
            this.response.lstCtiets.push({
                ... new CoeffIns(),
                id: uuid.v4() + 'FE',
                stt: e.ma,
                maDmuc: e.ma,
                tenDmuc: e.giaTri,
                maDviTinh: e.ghiChu,
            })
        })
    }

    async handleOk() {
        if (!this.response.nam) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
