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
import { CapVon, Cvnc, Report } from '../de-nghi-cap-von-cac-don-vi.constant';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';

@Component({
    selector: 'dialog-tong-hop-cap-von',
    templateUrl: './dialog-tong-hop-cap-von.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss'],
})

export class DialogTongHopCapVonComponent implements OnInit {
    @Input() request: any;
    Cvnc = Cvnc;

    userInfo: any;
    response: Report = new Report();
    canCuGias: any[] = [];
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];
    lstQuyetDinh: any[] = [];

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
        if (this.userService.isCuc()) {
            this.canCuGias = Cvnc.CAN_CU_GIA.filter(e => e.id == Cvnc.DON_GIA);
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.THOC);
        } else if (this.userService.isTongCuc()) {
            this.canCuGias = Cvnc.CAN_CU_GIA;
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id != Cvnc.VTU);
        }
        this.lstNam = Utils.getListYear(5, 10);
    }

    changeModel() {
        if (this.response.canCuVeGia == Cvnc.DON_GIA) {
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.THOC);
            this.getSoQdChiTieu();
        } else {
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.GAO || e.id == Cvnc.MUOI);
            // this.response.soQdChiTieu = null;
            this.getSoQdHopDong();
        }
    }

    async checkReport() {
        if (!this.response.namDnghi || !this.response.canCuVeGia ||
            (this.response.canCuVeGia == Cvnc.DON_GIA && !this.response.soQdChiTieu)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.request.loaiTimKiem = '0';
        this.request.maDvi = this.userInfo.MA_DVI;
        this.request.namDnghi = this.response.namDnghi;
        this.request.canCuVeGia = this.response.canCuVeGia;
        this.request.loaiDnghi = this.response.loaiDnghi;
        this.request.soQdChiTieu = this.response.soQdChiTieu;
        this.request.maLoai = Cvnc.CAP_VON;
        this.request.trangThai = null;
        this.spinner.show();
        await this.capVonNguonChiService.timKiemDeNghi(this.request.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let lstBcao = [];
                    if (data.data.content?.length > 0) {
                        lstBcao = data.data.content;
                        lstBcao.sort((a, b) => b.dot - a.dot);
                        if ([Status.TT_02, Status.TT_04, Status.TT_01].includes(lstBcao[0].trangThai)) {
                            this.notification.warning(MESSAGE.WARNING, 'Trạng thái của lần trước không cho phép tạo mới!')
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
        this.response.soLan = dot;
        this.response.trangThai = Status.TT_01;
        this.response.maLoai = Cvnc.CAP_VON;
        this.response.nguoiTao = this.userInfo.sub;
        await this.getMaDnghi();
        await this.callSynthetic();
        if (id) {
            await this.capVonNguonChiService.ctietDeNghi(id).toPromise().then(
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

    //neu la de nghi theo don gia mua can lay ra so quyet dinh chi tieu;
    getSoQdChiTieu() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập năm');
            this.response.canCuVeGia = null;
        }
        const request = {
            namKHoach: this.response.namDnghi,
            maDvi: this.userInfo?.MA_DVI,
            maLoai: this.response.maLoai,
        }
        this.spinner.show();
        this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
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
    getSoQdHopDong() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập năm');
            this.response.canCuVeGia = null;
        }
        const request = {
            namKhoach: this.response.namDnghi,
            // maDvi: this.userInfo?.MA_DVI,
            maLoai: this.response.maLoai,
        }
        this.spinner.show();
        this.capVonNguonChiService.danhSachHopDong(request).toPromise().then(
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
            maLoai: Cvnc.DE_NGHI,
            maDvi: this.userInfo.MA_DVI,
            loaiDnghi: this.response.loaiDnghi,
            canCuVeGia: this.response.canCuVeGia,
        }
        await this.capVonNguonChiService.tongHopDeNghi(request).toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.lstCtiets.push(new CapVon({
                        id: uuid.v4() + 'FE',
                        stt: '0.1',
                        maDvi: this.userInfo.MA_DVI,
                        tenDvi: this.userInfo?.TEN_DVI,
                    }))
                    res.data.forEach(item => {
                        this.response.lstCtiets.push(new CapVon({
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
        if (!this.response.namDnghi || !this.response.canCuVeGia || !this.response.loaiDnghi ||
            (this.response.canCuVeGia == Cvnc.DON_GIA && !this.response.soQdChiTieu)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: this.response.canCuVeGia == Cvnc.DON_GIA ? Cvnc.CV_DON_GIA : Cvnc.CV_HOP_DONG,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
