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
    selector: 'dialog-tao-moi-cap-von',
    templateUrl: './dialog-tao-moi-cap-von.component.html',
    styleUrls: ['../de-nghi-cap-von-cac-don-vi.component.scss'],
})

export class DialogTaoMoiCapVonComponent implements OnInit {
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
            this.canCuGias = Cvnc.CAN_CU_GIA.filter(e => e.id == Cvnc.HOP_DONG);
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.GAO || e.id == Cvnc.MUOI);
        } else {
            this.canCuGias = Cvnc.CAN_CU_GIA.filter(e => e.id == Cvnc.HOP_DONG);
            this.loaiDns = Cvnc.LOAI_DE_NGHI.filter(e => e.id == Cvnc.VTU);
        }
        this.lstNam = Utils.getListYear(5, 10);
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
        this.response.nguoiTao = this.userInfo.sub;
        if (this.response.canCuVeGia == Cvnc.DON_GIA) {
            this.getSoQdChiTieu();
        }
        await this.getMaDnghi();
        if (!id) {
            if (this.response.canCuVeGia == Cvnc.DON_GIA) {
                this.response.lstCtiets.push(new CapVon({
                    id: uuid.v4() + 'FE',
                    stt: '0.1',
                    maDvi: this.userInfo.MA_DVI,
                    tenDvi: this.userInfo?.TEN_DVI,
                }))
            } else {
                this.getContractData();
            }
        } else {
            await this.capVonNguonChiService.ctietDeNghi(id).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.response.lstCtiets = [];
                        data.data.lstCtiets?.forEach(item => {
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
                            temp.vonDnCapLanNay = Operator.sum([temp.gtThucHien, -temp.tongVonVaDtoanDaCap]);
                            this.response.lstCtiets.push(temp);
                        })
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
        const request = {
            namKHoach: this.response.namDnghi,
            maDvi: this.userInfo?.MA_DVI,
        }
        this.spinner.show();
        this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.response.soQdChiTieu = data.data[0];
                    if (!this.response.soQdChiTieu) {
                        this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy số quyết định chỉ tiêu cho năm ' + this.response.namDnghi);
                        this.response.loaiDnghi = null;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.loaiDnghi = null;
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.loaiDnghi = null;
            }
        )
        this.spinner.hide();
    }

    async getContractData() {
        const request = {
            namKHoach: this.response.namDnghi,
            maDvi: this.userInfo.MA_DVI,
            loaiVthh: null,
        }
        switch (this.response.loaiDnghi) {
            case Cvnc.THOC:
                request.loaiVthh = "0101"
                break;
            case Cvnc.GAO:
                request.loaiVthh = "0102"
                break;
            case Cvnc.MUOI:
                request.loaiVthh = "04"
                break;
            case Cvnc.VTU:
                request.loaiVthh = "02"
                break;
        }
        await this.capVonNguonChiService.dsachHopDong(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let unitId = uuid.v4() + 'FE';
                    this.response.lstCtiets.push(new CapVon({
                        id: unitId,
                        stt: '0.1',
                        maDvi: this.userInfo.MA_DVI,
                        tenDvi: this.userInfo?.TEN_DVI,
                    }))
                    data.data.forEach(item => {
                        if (this.response.lstCtiets.findIndex(e => e.qdPheDuyet == item.soQdPdKhlcnt) == -1) {
                            const temp: CapVon = new CapVon({
                                id: uuid.v4() + 'FE',
                                maDvi: this.userInfo.MA_DVI,
                                tenDvi: this.userInfo?.TEN_DVI,
                                tenKhachHang: item.tenNhaThau,
                                qdPheDuyet: item.soQdPdKhlcnt,
                            })
                            this.response.lstCtiets = Table.addChild(unitId, temp, this.response.lstCtiets);
                        }
                        const temp: CapVon = new CapVon({
                            id: uuid.v4() + 'FE',
                            qdPheDuyet: item.tenGoiThau + '/' + item.soHd,
                            slKeHoach: item.soLuongKehoach,
                            slHopDong: item.soLuong,
                            donGia: item.donGia,
                            gtHopDong: Operator.mul(item.soLuong, item.donGia),
                        })
                        const index = this.response.lstCtiets.findIndex(e => e.qdPheDuyet == item.soQdPdKhlcnt);
                        this.response.lstCtiets = Table.addChild(this.response.lstCtiets[index].id, temp, this.response.lstCtiets);
                        this.response.lstCtiets[index].slKeHoach = Operator.sum([this.response.lstCtiets[index].slKeHoach, temp.slKeHoach]);
                        this.response.lstCtiets[index].slHopDong = Operator.sum([this.response.lstCtiets[index].slHopDong, temp.slHopDong]);
                        this.response.lstCtiets[index].gtHopDong = Operator.sum([this.response.lstCtiets[index].gtHopDong, temp.gtHopDong]);
                    })
                } else {
                    this.notification.warning(MESSAGE.WARNING, data?.msg);
                }
            },
            (err) => {
                this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    handleOk() {
        if (!this.response.namDnghi || !this.response.canCuVeGia || !this.response.loaiDnghi) {
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
