import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { CapVon, Cvnc, Report } from '../de-nghi-cap-von-cac-don-vi.constant';

@Component({
    selector: 'dialog-tao-moi-de-nghi',
    templateUrl: './dialog-tao-moi-de-nghi.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss'],
})

export class DialogTaoMoiDeNghiComponent implements OnInit {
    @Input() request: any;
    Cvnc = Cvnc;

    userInfo: any;
    response: Report = new Report();
    canCuGias: any[] = [];
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonNguonChiService: CapVonNguonChiService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maLoai = this.request.maLoai;
        if (this.userService.isChiCuc()) {
            this.canCuGias = Cvnc.CAN_CU_GIA.filter(e => e.id == Cvnc.DON_GIA);
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.THOC);
        } else if (this.userService.isCuc()) {
            this.canCuGias = Cvnc.CAN_CU_GIA;
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id != Cvnc.VTU);
        } else {
            this.canCuGias = Cvnc.CAN_CU_GIA;
            this.loaiDns = Cvnc.LOAI_DE_NGHI;
        }
        this.lstNam = Utils.getListYear(5, 10);
    }

    changeModel() {
        if (this.response.canCuVeGia == Cvnc.DON_GIA) {
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.THOC);
        } else {
            if (this.userService.isCuc()) {
                this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.GAO || e.id == Cvnc.MUOI);
            } else {
                this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id != Cvnc.THOC);
            }
            this.response.soQdChiTieu = null;
        }
    }

    async checkReport() {
        if (!this.response.namDnghi || !this.response.canCuVeGia) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.request.namDnghi = this.response.namDnghi;
        this.request.canCuVeGia = this.response.canCuVeGia;
        this.request.loaiDnghi = this.response.loaiDnghi;
        this.request.trangThai = null;
        this.spinner.show();
        await this.capVonNguonChiService.timKiemDeNghi(this.request.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let lstBcao = [];
                    if (data.data.content?.length > 0) {
                        lstBcao = data.data.content;
                        lstBcao.sort((a, b) => b.soLan - a.soLan);
                        if ([Status.TT_02, Status.TT_04, Status.TT_01].includes(lstBcao[0].trangThai)) {
                            this.notification.warning(MESSAGE.WARNING, 'Trạng thái của đợt trước không cho phép tạo mới!')
                            this.response.loaiDnghi = null;
                            return;
                        }
                    }
                    this.initReport(lstBcao.length + 1);
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

    async initReport(dot: number) {
        this.response.ngayTao = new Date();
        this.response.maDvi = this.userInfo.MA_DVI;
        this.response.soLan = dot;
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo.sub;
        this.response.lstCtiets = [];
        this.request.maLoai = Cvnc.CAP_VON;
        this.request.trangThai = Status.TT_07
        let id = null;
        await this.getMaDnghi();
        await this.capVonNguonChiService.timKiemDeNghi(this.request.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let lstBcao = [];
                    if (data.data.content?.length > 0) {
                        lstBcao = data.data.content;
                        lstBcao.sort((a, b) => b.soLan - a.soLan);
                        id = lstBcao[0].id;
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
        if (!id) {
            this.notification.warning(MESSAGE.WARNING, "Không tìm thấy bản ghi cấp vốn!")
            this.response.loaiDnghi = null;
            return;
        } else {
            await this.capVonNguonChiService.ctietDeNghi(id).toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.response.soQdChiTieu = data.data.soQdChiTieu;
                        data.data.lstCtiets.forEach(item => {
                            if (item.stt == '0.1') {
                                const temp = new CapVon({
                                    ...item,
                                    id: uuid.v4() + 'FE',
                                    lkUng: Operator.sum([item.lkUng, item.ung]),
                                    lkCap: Operator.sum([item.lkCap, item.cap]),
                                    lkCong: Operator.sum([item.lkCong, item.cong]),
                                    ung: null,
                                    cap: null,
                                    cong: null,
                                })
                                temp.tongVonVaDtoanDaCap = Operator.sum([temp.lkCong, temp.dtoanDaGiao]);
                                if (this.response.loaiDnghi == Cvnc.THOC || this.response.loaiDnghi == Cvnc.VTU) {
                                    temp.vonDnCapLanNay = Operator.sum([temp.gtThucHien - temp.tongVonVaDtoanDaCap]);
                                } else {
                                    temp.vonDnCapLanNay = Operator.sum([temp.gtHopDong - temp.tongVonVaDtoanDaCap]);
                                }
                                this.response.lstCtiets.push(temp);
                            } else {
                                this.response.lstCtiets.push(new CapVon({
                                    ...item,
                                    id: uuid.v4() + 'FE',
                                }));
                            }
                        })
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
        }
    }

    async getMaDnghi() {
        this.spinner.show();
        await this.capVonNguonChiService.maDeNghi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.maDnghi = res.data;
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

    handleOk() {
        if (!this.response.namDnghi || !this.response.canCuVeGia || !this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: this.response.canCuVeGia == Cvnc.DON_GIA ? Cvnc.DN_DON_GIA : Cvnc.DN_HOP_DONG,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
