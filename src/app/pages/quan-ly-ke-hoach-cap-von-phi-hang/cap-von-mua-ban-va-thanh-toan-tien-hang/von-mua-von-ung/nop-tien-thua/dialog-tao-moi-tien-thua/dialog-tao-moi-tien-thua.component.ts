import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { Cvmb, Report, TienThua } from '../../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../../von-mua-von-ung.constant';

@Component({
    selector: 'dialog-tao-moi-tien-thua',
    templateUrl: './dialog-tao-moi-tien-thua.component.html',
    styleUrls: ['../../von-mua-von-ung.component.scss'],
})

export class DialogTaoMoiTienThuaComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
    thuChis: TienThua[] = [];
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        if (this.userService.isChiCuc()) {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC);
        } else if (this.userService.isCuc()) {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id != Cvmb.VTU);
        } else {
            this.loaiDns = Cvmb.LOAI_DE_NGHI
        }
        this.lstNam = Utils.getListYear(5, 10);
        this.response.maLoai = this.request.maLoai;
    }

    async checkReport() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn năm đề nghị!')
            this.response.loaiDnghi = null;
            return;
        }
        this.request.namDnghi = this.response.namDnghi;
        this.request.loaiDnghi = this.response.loaiDnghi;
        this.request.trangThai = null;
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.request.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let lstBcao = [];
                    if (data.data.content?.length > 0) {
                        lstBcao = data.data.content;
                        lstBcao.sort((a, b) => b.dot - a.dot);
                        if ([Status.TT_02, Status.TT_04, Status.TT_01].includes(lstBcao[0].trangThai) ||
                            (this.response.maLoai == Cvmb.TIEN_THUA && lstBcao[0].trangThai == Status.TT_07 && !this.userService.isTongCuc())) {
                            this.notification.warning(MESSAGE.WARNING, 'Trạng thái của đợt trước không cho phép tạo mới!')
                            this.response.loaiDnghi = null;
                            return;
                        } else {
                            const index = lstBcao.findIndex(e => !Status.check('reject', e.trangThai));
                            if (index != -1) {
                                this.initReport(lstBcao?.length + 1, lstBcao[index].id)
                            } else {
                                this.initReport(lstBcao?.length + 1);
                            }
                        }
                    } else {
                        this.initReport(lstBcao?.length + 1);
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.response.loaiDnghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDnghi = null;
            }
        );
        this.spinner.hide();
    }

    async initReport(dot: number, id?: string) {
        this.response.ngayTao = new Date();
        this.response.maDvi = this.userInfo.MA_DVI;
        this.response.dot = dot;
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo.sub;
        this.response.lstCtiets = [];
        await this.getMaDnghi();
        if (this.response.maLoai == Cvmb.TONG_HOP_TIEN_THUA) {
            await this.callSynthetic();
            return;
        }
        if (id) {
            await this.capVonMuaBanTtthService.ctietVonMuaBan(id).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        data.data.lstCtiets.forEach(item => {
                            const temp = new TienThua({
                                ...item,
                                id: uuid.v4() + 'FE',
                                daNopVonUng: Operator.sum([item.daNopVonUng, item.nopVonUng]),
                                daNopVonCap: Operator.sum([item.daNopVonCap, item.nopVonCap]),
                                nopUncNgay: null,
                                nopVonUng: null,
                                nopVonCap: null,
                                nopTong: null,
                            })
                            temp.daNopTong = Operator.sum([temp.daNopVonUng, temp.daNopVonCap]);
                            this.response.lstCtiets.push(temp)
                        })
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                        this.response.namDnghi = null;
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    this.response.namDnghi = null;
                },
            );
        } else {
            this.response.lstCtiets.push(new TienThua({
                id: uuid.v4() + 'FE',
                maHangDtqg: this.userInfo.MA_DVI,
                tenHangDtqg: this.userInfo.TEN_DVI,
            }))
        }
    }

    async getMaDnghi() {
        await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.maCapUng = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                    this.response.loaiDnghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDnghi = null
            },
        );
    }

    async callSynthetic() {
        const request = {
            namDnghi: this.response.namDnghi,
            maLoai: Cvmb.TIEN_THUA,
            maDvi: this.userInfo.MA_DVI,
            loaiDnghi: this.response.loaiDnghi,
        }
        await this.capVonMuaBanTtthService.tongHopVonBan(request).toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    res.data.forEach(item => {
                        this.response.lstCtiets.push(new TienThua({
                            ...item,
                            id: uuid.v4() + 'FE',
                        }))
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                    this.response.loaiDnghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDnghi = null;
            },
        );
        this.spinner.hide();
    }

    handleOk() {
        if (!this.response.namDnghi || !this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: this.response.maLoai == Cvmb.TIEN_THUA ? Tab.TIEN_THUA : Tab.TH_TIEN_THUA,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
