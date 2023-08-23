import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Status } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { Dtc, Form, Report } from '../bao-cao-thuc-hien-du-toan-chi.constant';
import * as uuid from 'uuid';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() isSynth: boolean;
    Dtc = Dtc;
    userInfo: any;
    response: Report = new Report();
    lstNam: number[] = [];
    lstThang: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    isDisable = false;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private userService: UserService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        const thisYear = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    changeModel() {
        if (this.response.maLoaiBcao == Dtc.BC_CA_NAM) {
            this.response.thangBcao = 1;
            this.checkReport();
        }
    }

    async checkReport() {
        if (!this.response.namBcao || !this.response.maLoaiBcao || !this.response.thangBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        const request = {
            maPhanBcao: '0',
            namBcao: this.response.namBcao,
            thangBcao: this.response.thangBcao,
            maLoaiBcao: this.response.maLoaiBcao,
            trangThais: [Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_07, Status.TT_08, Status.TT_09],
            paggingReq: {
                limit: 10,
                page: 1
            },
            str: "",
            loaiTimKiem: '0',
        }
        await this.baoCaoThucHienDuToanChiService.timBaoCao(request).toPromise().then(res => {
            if (res.statusCode == 0) {
                if (res.data?.empty) {
                    this.initReport();
                } else {
                    this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_REPORT);
                    this.clear();
                }
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.clear();
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            this.clear();
        })
    }

    async initReport() {
        this.response.maDvi = this.userInfo?.MA_DVI;
        this.response.nguoiTao = this.userInfo.sub;
        this.response.ngayTao = new Date();
        this.response.trangThai = Status.TT_01;
        this.response.lstBcaos = [];
        this.response.lstBcaoDviTrucThuocs = [];
        this.response.lstFiles = [];
        this.response.listIdDeleteFiles = [];
        await this.getMaBcao();
        if (this.isSynth) {
            this.callSynthtic();
        } else {
            Dtc.PHU_LUC.forEach(item => {
                this.response.lstBcaos.push({
                    ...new Form(),
                    id: uuid.v4() + 'FE',
                    maLoai: item.id,
                    tenPhuLuc: item.tenPl,
                    tieuDe: item.tenDm,
                    nguoiBcao: this.userInfo.sub,
                    trangThai: Status.NEW,
                    maDviTien: '1',
                    lstCtietBcaos: [],
                })
            })
        }
    }

    getMaBcao() {
        this.baoCaoThucHienDuToanChiService.taoMaBaoCao().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.maBcao = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.clear()
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.clear();
            }
        );
    }

    async callSynthtic() {
        const request = {
            maLoaiBcao: this.response.maLoaiBcao,
            namBcao: this.response.namBcao,
            thangBcao: this.response.thangBcao,
            dotBcao: null,
            maPhanBcao: '0',
        }
        await this.baoCaoThucHienDuToanChiService.tongHopBaoCaoKetQua(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.response.lstBcaos = data.data.lstBcaos.filter(e => e !== null);
                    this.response.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
                    this.response.lstBcaos.forEach(e => {
                        [e.tenPhuLuc, e.tieuDe] = Dtc.appendixName(e.maLoai);
                        e.trangThai = Status.NEW;
                        e.id = uuid.v4() + 'FE';
                        e.nguoiBcao = this.userInfo?.sub;
                        e.maDviTien = '1';
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.clear();
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.clear();
            }
        );
    }

    clear() {
        this.response.namBcao = null;
        this.response.maLoaiBcao = null;
    }

    async handleOk() {
        if (!this.response.namBcao || !this.response.maLoaiBcao || !this.response.thangBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
