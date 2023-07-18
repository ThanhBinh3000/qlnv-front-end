import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { Form, Ltd, Report } from '../lap-ke-hoach-va-tham-dinh-du-toan.constant';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() tab: string;

    userInfo: any;
    response: Report = new Report();
    listAppendix: any[] = Ltd.PHU_LUC;
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private userService: UserService,
        private lapThamDinhService: LapThamDinhService,
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maDvi = this.userInfo.MA_DVI;

        const thisYear = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    async checkReport() {
        if (!this.response.namBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.listAppendix.forEach(e => {
            e.tenDm = Utils.getName(this.response.namBcao, e.tenDm);
        })
        this.response = {
            ...new Report(),
            namBcao: this.response.namBcao,
            maDvi: this.userInfo.MA_DVI,
        }
        const requestReport = {
            loaiTimKiem: "0",
            maDvi: this.response.maDvi,
            namBcao: this.response.namBcao,
            maBcaos: [],
            paggingReq: {
                limit: 1000,
                page: 1,
            },
            trangThais: [],
        };
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (data.data.content.length == 0) {
                        this.initNewReport(1);
                    } else {
                        let lstBcao = data.data.content;
                        lstBcao.sort((a, b) => {
                            if (a.lan < b.lan) {
                                return 1;
                            }
                            return -1
                        })
                        this.initNewReport(lstBcao[0].lan + 1);
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.response.namBcao = null;
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.namBcao = null;
            }
        )
    }

    async initNewReport(lan: number) {
        this.response.lan = lan;
        this.response.lstLapThamDinhs = [];
        this.response.lstBcaoDviTrucThuocs = [];
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo?.sub;
        this.response.ngayTao = new Date();
        this.response.lstFiles = [];
        await this.lapThamDinhService.sinhMaBaoCao().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.maBcao = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.namBcao = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.namBcao = null;
            }
        );
        if (this.tab == Ltd.DANH_SACH_BAO_CAO) {
            if (this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1) {
                const request = {
                    lan: lan,
                    maDvi: this.userInfo.MA_DVI,
                    namHienTai: this.response.namBcao,
                }
                await this.lapThamDinhService.soLuongVp(request).toPromise().then(
                    (data) => {
                        if (data.statusCode == 0) {
                            this.response.lstLapThamDinhs = data.data.lstLapThamDinhs;
                            this.response.lstLapThamDinhs.forEach(item => {
                                if (!item.id) {
                                    item.id = uuid.v4() + 'FE';
                                }
                                item.maDviTien = '1';
                                item.trangThai = '3';
                                const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                                item.tenPl = pl.tenPl;
                                item.tenDm = pl.tenDm;
                            })
                        } else {
                            this.notification.error(MESSAGE.ERROR, data?.msg);
                            this.response.namBcao = null;
                        }
                    },
                    (err) => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                        this.response.namBcao = null;
                    }
                );
            } else {
                this.listAppendix.forEach(item => {
                    this.response.lstLapThamDinhs.push({
                        ...new Form(),
                        id: uuid.v4() + 'FE',
                        maBieuMau: item.id,
                        tenPl: item.tenPl,
                        tenDm: item.tenDm,
                        trangThai: '3',
                        lstCtietLapThamDinhs: [],
                    })
                })
            }
        } else {
            this.synthetic();
        }
        this.response.lstLapThamDinhs.forEach(item => {
            item.nguoiBcao = this.userInfo?.sub;
        })
    }

    //tong hop theo nam bao cao
    async synthetic() {
        this.spinner.show();
        const request = {
            lan: this.response.lan,
            namHienTai: this.response.namBcao,
        }
        await this.lapThamDinhService.tongHop(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.lstLapThamDinhs = data.data.lstLapThamDinhs;
                    this.response.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
                    this.response.lstLapThamDinhs.forEach(item => {
                        if (!item.id) {
                            item.id = uuid.v4() + 'FE';
                        }
                        item.maDviTien = '1';
                        item.trangThai = Status.NEW;
                        const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                        item.tenPl = pl.tenPl;
                        item.tenDm = pl.tenDm;
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.namBcao = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.namBcao = null;
            }
        );
        this.spinner.hide();
    }

    async handleOk() {
        if (!this.response.namBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
