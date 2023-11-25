import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { Dcdt, Form, Report } from '../dieu-chinh-du-toan.constant';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() tab: string;

    userInfo: any;
    response: Report = new Report();
    listAppendix: any[] = Dcdt.PHU_LUC;
    listAppendixTH: any[] = Dcdt.PHU_LUC_TH;
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private userService: UserService,
        private dieuChinhService: DieuChinhService,
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

            loaiTimKiem: "1",
            maBcao: null,
            maDvi: this.response.maDvi,
            namBcao: this.response.namBcao,
            ngayTaoDen: null,
            ngayTaoTu: null,
            paggingReq: {
                limit: 1000,
                page: 1,
            },
            trangThais: ["9"],
        };
        await this.dieuChinhService.timKiemDieuChinh(requestReport).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (this.tab == Dcdt.DANH_SACH_BAO_CAO) {
                        if (data.data.content.length == 0) {
                            this.initNewReport(1);
                        } else {
                            let lstBcao = data.data.content;
                            lstBcao.sort((a, b) => {
                                if (a.dotBcao < b.dotBcao) {
                                    return 1;
                                }
                                return -1
                            })
                            this.initNewReport(lstBcao[0].dotBcao + 1);
                        }
                    } else {
                        let lstBcao = data.data.content;
                        lstBcao.sort((a, b) => {
                            if (a.dotBcao < b.dotBcao) {
                                return 1;
                            }
                            return -1
                        })
                        if (data.data.content.length != 0) {
                            this.initNewReport(lstBcao[0].dotBcao);
                        } else {
                            this.notification.error(MESSAGE.WARNING, `Chưa có báo trong năm ${this.response.namBcao}`);
                        }
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

    async initNewReport(dotBcao: number) {
        this.response.dotBcao = dotBcao;
        this.response.lstDchinh = [];
        this.response.lstDviTrucThuoc = [];
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo?.sub;
        this.response.ngayTao = new Date();
        this.response.lstFiles = [];
        await this.dieuChinhService.sinhMaBaoCaoDieuChinh().toPromise().then(
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
        if (this.tab == Dcdt.DANH_SACH_BAO_CAO) {
            if (this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1) {
                const request = {
                    dotBcao: dotBcao,
                    namBcao: this.response.namBcao,
                }
                await this.dieuChinhService.soLuongVp(request).toPromise().then(
                    (data) => {
                        if (data.statusCode == 0) {
                            this.response.lstDchinh = data.data.lstDchinhs;
                            this.response.lstDchinh.forEach(item => {
                                if (!item.id) {
                                    item.id = uuid.v4() + 'FE';
                                }
                                item.maDviTien = '1';
                                item.trangThai = '3';
                                const pl = this.listAppendix.find(e => e.id == item.maLoai);
                                item.tenPl = pl.tenPl;
                                item.tenDm = pl.tenDm;
                                item.giaoCho = this.userInfo?.sub
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
                    this.response.lstDchinh.push({
                        ...new Form(),
                        id: uuid.v4() + 'FE',
                        maLoai: item.id,
                        tenPl: item.tenPl,
                        tenDm: item.tenDm,
                        trangThai: '3',
                        lstCtietDchinh: [],
                    })
                })
            }
        } else {
            this.synthetic();
        }
        this.response.lstDchinh.forEach(item => {
            item.giaoCho = this.userInfo?.sub;
        })
    }

    //tong hop theo nam bao cao
    async synthetic() {
        this.spinner.show();
        const requestReport = {
            dotBcao: this.response.dotBcao,
            namBcao: this.response.namBcao,
        };
        await this.dieuChinhService.tongHopDieuChinhDuToan(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.lstDchinh = data.data?.lstDchinhs;
                    this.response.lstDviTrucThuoc = data.data?.lstDchinhDviTrucThuocs;
                    this.response.lstDchinh.forEach(item => {
                        if (!item.id) {
                            item.id = uuid.v4() + 'FE';
                        }
                        item.maDviTien = '1';
                        item.trangThai = Status.NEW;
                        if (this.userInfo.CAP_DVI == "1") {
                            const pl = this.listAppendixTH.find(e => e.id == item.maLoai);
                            item.tenPl = pl.tenPl;
                            item.tenDm = pl.tenDm;
                            item.giaoCho = this.userInfo.sub
                        } else {
                            const pl = this.listAppendix.find(e => e.id == item.maLoai);
                            item.tenPl = pl.tenPl;
                            item.tenDm = pl.tenDm;
                            item.giaoCho = this.userInfo.sub

                        }
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.namBcao = null;
                    this.response.dotBcao = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.namBcao = null;
                this.response.dotBcao = null;
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
