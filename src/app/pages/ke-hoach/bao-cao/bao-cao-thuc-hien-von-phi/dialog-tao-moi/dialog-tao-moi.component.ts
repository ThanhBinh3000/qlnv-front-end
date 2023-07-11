import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BAO_CAO_DOT, LBC_KET_QUA_THUC_HIEN_HANG_DTQG, Status, Utils } from 'src/app/Utility/utils';
import * as dayjs from 'dayjs';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { Form, Report } from '../bao-cao-thuc-hien-von-phi.constant';
import { BC_DOT, LBC_VON_PHI } from '../../bao-cao.constant';
import { Vp } from '../bao-cao-thuc-hien-von-phi.constant';
import * as uuid from 'uuid';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() isSynth: boolean;
    Vp = Vp;
    userInfo: any;
    response: Report = new Report();
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private userService: UserService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        const thisYear = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    changeModel() {
        if (this.response.maLoaiBcao == Vp.BC_NAM) {
            this.response.dotBcao = null;
        }
    }

    async checkReport() {
        const request = {
            maPhanBcao: '0',
            namBcao: this.response.namBcao,
            thangBcao: this.response.thangBcao,
            maLoaiBcao: this.response.maLoaiBcao,
            trangThais: [Status.TT_01, Status.TT_02, Status.TT_04, Status.TT_07, Status.TT_09],
            paggingReq: {
                limit: 10,
                page: 1
            },
            str: "",
            loaiTimKiem: '0',
        }
        await this.baoCaoThucHienVonPhiService.timBaoCao(request).toPromise().then(res => {
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
            Vp.PHU_LUC.forEach(item => {
                this.response.lstBcaos.push({
                    ...new Form(),
                    id: uuid.v4() + 'FE',
                    maLoai: item.id,
                    tenPhuLuc: item.tenPl,
                    tieuDe: item.tenDm,
                    nguoiBcao: this.userInfo?.sub,
                    trangThai: Status.NEW,
                    maDviTien: '1',
                    lstCtietBcaos: [],
                })
            })
        }
    }

    getMaBcao() {
        this.baoCaoThucHienVonPhiService.taoMaBaoCao().toPromise().then(
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
            thangBcao: null,
            dotBcao: this.response.dotBcao,
            maPhanBcao: '0',
        }
        await this.baoCaoThucHienVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.response.lstBcaos = data.data.lstBcaos;
                    this.response.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
                    this.response.lstBcaos.forEach(e => {
                        const appendix = Vp.PHU_LUC.find(item => item.id == e.maLoai);
                        e.tenPhuLuc = appendix.tenPl;
                        e.tieuDe = Vp.appendixName(e.maLoai, this.response.maLoaiBcao, this.response.namBcao, this.response.dotBcao);
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
        this.response.dotBcao = null;
    }

    async handleOk() {
        if (!this.response.namBcao || !this.response.maLoaiBcao ||
            (!this.response.dotBcao && this.response.maLoaiBcao == BAO_CAO_DOT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.checkReport();
        if (!this.response.namBcao) {
            this.clear();
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
