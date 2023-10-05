import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { Cvmb, Report, ThanhToan } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../von-ban.constant';

@Component({
    selector: 'dialog-tong-hop',
    templateUrl: './dialog-tong-hop.component.html',
    styleUrls: ['../von-ban.component.scss'],
})

export class DialogTongHopComponent implements OnInit {
    @Input() request: any;
    Cvmb = Cvmb;

    userInfo: any;
    response: Report = new Report();
    canCuGias: any[] = [];
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];
    lstQuyetDinh: string[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maLoai = this.request.maLoai;
        if (this.userService.isCuc()) {
            this.canCuGias = Cvmb.CAN_CU_GIA.filter(e => e.id == Cvmb.DON_GIA);
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC);
        } else if (this.userService.isTongCuc()) {
            this.canCuGias = Cvmb.CAN_CU_GIA;
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id != Cvmb.VTU);
        }
        this.lstNam = Utils.getListYear(5, 10);
    }

    async changeModel() {
        if (this.response.canCuVeGia == Cvmb.DON_GIA) {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC);
            await this.getSoQdChiTieu();
        } else {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.GAO || e.id == Cvmb.MUOI);
            this.response.quyetDinh = null;
        }
    }

    async checkReport() {
        if (!this.response.namDnghi || !this.response.canCuVeGia || (this.response.canCuVeGia == Cvmb.DON_GIA && !this.response.quyetDinh)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.request.loaiTimKiem = '0';
        this.request.maDvi = this.userInfo.MA_DVI;
        this.request.namDnghi = this.response.namDnghi;
        this.request.canCuVeGia = this.response.canCuVeGia;
        this.request.loaiDnghi = this.response.loaiDnghi;
        this.request.quyetDinh = this.response.quyetDinh;
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
                            (Status.TT_07 == lstBcao[0].trangThai && !this.userService.isTongCuc())) {
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
        await this.getMaDnghi();
        await this.callSynthetic();
        if (id) {
            await this.capVonMuaBanTtthService.ctietVonMuaBan(id).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        const temp = data.data.lstCtiets.find(e => e.stt == '0.1');
                        const index = this.response.lstCtiets.findIndex(e => e.stt == '0.1');
                        if (index != -1 && temp) {
                            this.response.lstCtiets[index].lkUng = Operator.sum([temp.lkUng, temp.ung]);
                            this.response.lstCtiets[index].lkCap = Operator.sum([temp.lkCap, temp.cap]);
                            this.response.lstCtiets[index].lkCong = Operator.sum([temp.lkCong, temp.cong]);
                        }
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                        this.response.loaiDnghi = null;
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    this.response.loaiDnghi = null;
                },
            );
        }
    }

    async getMaDnghi() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.maCapUng = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    //neu la de nghi theo don gia mua can lay ra so quyet dinh chi tieu;
    getSoQdChiTieu() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập năm');
            this.response.canCuVeGia = null;
        }
        const request = {
            namKHoach: this.response.namDnghi,
            maDvi: this.userInfo?.MA_DVI,
        }
        this.spinner.show();
        this.capVonMuaBanTtthService.soQdChiTieu(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.lstQuyetDinh = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.canCuVeGia = null;
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.canCuVeGia = null;
            }
        )
        this.spinner.hide();
    }

    async callSynthetic() {
        const request = {
            namDnghi: this.response.namDnghi,
            maLoai: this.response.maLoai,
            maDvi: this.userInfo.MA_DVI,
            loaiDnghi: this.response.loaiDnghi,
            canCuVeGia: this.response.canCuVeGia,
            quyetDinh: this.response.quyetDinh,
        }
        await this.capVonMuaBanTtthService.tongHopVonBan(request).toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.lstCtiets = [];
                    this.response.lstCtiets.push(new ThanhToan({
                        id: uuid.v4() + 'FE',
                        stt: '0.1',
                        maDvi: this.userInfo.MA_DVI,
                        tenDvi: this.userInfo?.TEN_DVI,
                    }))
                    res.data.forEach(item => {
                        this.response.lstCtiets.push(new ThanhToan({
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
        if (!this.response.namDnghi || !this.response.canCuVeGia || (this.response.canCuVeGia == Cvmb.DON_GIA && !this.response.quyetDinh) || !this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: this.response.canCuVeGia == Cvmb.DON_GIA ? Tab.VB_DON_GIA : Tab.VB_HOP_DONG,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
