import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { divNumber, mulNumber, sumNumber } from 'src/app/Utility/func';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { receivedInfo, Report, sendInfo, ThanhToan } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'dialog-tao-moi-von-ban',
    templateUrl: './dialog-tao-moi-von-ban.component.html',
    styleUrls: ['../von-ban.component.scss'],
})

export class DialogTaoMoiVonBanComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    isRequestExist!: number;
    idRequest: string;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        if (!this.userService.isCuc()) {
            this.response.canCuVeGia = Utils.QD_DON_GIA;
        }
        this.changeLoaiDn();
        this.userInfo = this.userService.getUserLogin();
    }

    changeLoaiDn() {
        this.loaiDns = LOAI_DE_NGHI.filter(e => e.id != Utils.MUA_VTU);
        if (this.userService.isChiCuc()) {
            this.loaiDns = this.loaiDns.filter(e => e.id == Utils.MUA_THOC);
        }
        if (this.response.canCuVeGia == Utils.QD_DON_GIA) {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_GAO && e.id != Utils.MUA_MUOI);
        } else {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_THOC);
        }
    }

    //lay ra chi tiet cua de nghi
    async getDetail() {
        if (!this.response.namDnghi || !this.response.canCuVeGia) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            this.response.loaiDnghi = null;
            return;
        }
        this.spinner.show();
        await this.checkRequest();
        if (this.isRequestExist == 2) {
            this.notification.warning(MESSAGE.WARNING, 'Trạng thái bản ghi không cho phép tạo đợt mới');
            this.response.loaiDnghi = null;
            return;
        }
        if (this.isRequestExist == 0) {
            this.response.ttGui = new sendInfo();
            this.response.ttGui.lstCtietBcaos = [];
            this.response.ttNhan = new receivedInfo();
            this.response.ttNhan.lstCtietBcaos = [];
            this.response.maDvi = this.userInfo?.MA_DVI;
            this.response.ngayTao = new Date();
            this.response.dot = 1;
            this.response.maLoai = 4;
            this.response.ttGui.trangThai = Utils.TT_BC_1;
            this.response.ttNhan.trangThai = Utils.TT_BC_1;
            this.response.ttGui.lstFiles = [];
            this.response.ttNhan.lstFiles = [];
            //bao cao chua ton tai
            if (this.response.canCuVeGia == Utils.HD_TRUNG_THAU) {
                await this.getContractData();
            } else {
                this.response.ttGui.lstCtietBcaos.push({
                    ...new ThanhToan(),
                    id: uuid.v4() + 'FE',
                    maDvi: this.userInfo?.MA_DVI,
                    tenDvi: this.userInfo?.TEN_DVI,
                })
            }
            await this.getMaDnghi();
        } else {
            //them lan moi cho de nghi
            await this.capVonMuaBanTtthService.ctietVonMuaBan(this.idRequest).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.response = data.data;
                        this.response.ttGui.listFile = [];
                        this.response.ttNhan.listFile = [];
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
            this.response.ttGui.lstCtietBcaos.forEach(item => {
                if (item.maDvi == this.userInfo?.MA_DVI || item.isParent) {
                    item.listLuyKe.push({
                        id: uuid.v4() + 'FE',
                        uyNhiemChiNgay: item.uyNhiemChiNgay,
                        uyNhiemChiSoTien: item.uyNhiemChiSoTien,
                        dot: this.response.dot,
                    })
                    item.soDaNopTc = item.luyKeSauLanNopNay;
                    item.uyNhiemChiNgay = null;
                    item.uyNhiemChiSoTien = 0;
                }
            })
            this.response.ttNhan.lstCtietBcaos.push({
                id: uuid.v4() + 'FE',
                ngayNhanLenhChuyenCo: this.response.ttNhan.ngayNhanLenhChuyenCo,
                tkNhan: this.response.ttNhan.tkNhan,
                dot: this.response.dot,
            })
            this.response.ttNhan.ngayNhanLenhChuyenCo = null;
            this.response.ttNhan.tkNhan = null;
            this.response.dot += 1;
            this.response.ttGui.trangThai = Utils.TT_BC_1;
            this.response.ttNhan.trangThai = Utils.TT_BC_1;
        }
        this.spinner.hide();
    }

    async getContractData() {
        const request = {
            namKHoach: this.response.namDnghi,
            maDvi: this.userInfo.MA_DVI,
            loaiVthh: null,
        }
        switch (this.response.loaiDnghi) {
            case Utils.MUA_THOC:
                request.loaiVthh = "0101"
                break;
            case Utils.MUA_GAO:
                request.loaiVthh = "0102"
                break;
            case Utils.MUA_MUOI:
                request.loaiVthh = "04"
                break;
            case Utils.MUA_VTU:
                request.loaiVthh = "02"
                break;
        }
        await this.capVonMuaBanTtthService.dsachHopDong(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    data.data.forEach(item => {
                        const temp: ThanhToan = {
                            ... new ThanhToan(),
                            id: uuid.v4() + 'FE',
                            tenKhachHang: item.tenNhaThau,
                            isParent: false,
                            qdPdKqNhaThau: item.soHd,
                            soLuongKeHoach: item.soLuongKehoach,
                            soLuongHopDong: item.soLuong,
                            donGia: item.donGia,
                            giaTriHd: mulNumber(item.soLuong, item.donGia),
                        }
                        this.response.ttGui.lstCtietBcaos.push(temp);
                        const index = this.response.ttGui.lstCtietBcaos.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
                        if (index == -1) {
                            this.response.ttGui.lstCtietBcaos.push({
                                ...temp,
                                id: uuid.v4() + 'FE',
                                isParent: true,
                                qdPdKqNhaThau: item.soQdPdKhlcnt,
                            })
                        } else {
                            if (this.response.ttGui.lstCtietBcaos[index].qdPdKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
                                this.response.ttGui.lstCtietBcaos[index].qdPdKqNhaThau += ', ' + item.sosoQdPdKhlcnt;
                            }
                            this.response.ttGui.lstCtietBcaos[index].soLuongHopDong = sumNumber([this.response.ttGui.lstCtietBcaos[index].soLuongHopDong, temp.soLuongHopDong]);
                            this.response.ttGui.lstCtietBcaos[index].soLuongKeHoach = sumNumber([this.response.ttGui.lstCtietBcaos[index].soLuongKeHoach, temp.soLuongKeHoach]);
                            this.response.ttGui.lstCtietBcaos[index].giaTriHd = sumNumber([this.response.ttGui.lstCtietBcaos[index].giaTriHd, temp.giaTriHd]);
                            this.response.ttGui.lstCtietBcaos[index].donGia = divNumber(this.response.ttGui.lstCtietBcaos[index].giaTriHd, this.response.ttGui.lstCtietBcaos[index].soLuongHopDong);
                        }
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

    async getMaDnghi() {
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
    }

    async checkRequest() {
        this.isRequestExist = 0;
        this.request.namDnghi = this.response.namDnghi;
        this.request.loaiDnghi = this.response.loaiDnghi;
        this.request.canCuVeGia = this.response.canCuVeGia;
        this.request.ngayTaoTu = null;
        this.request.ngayTaoDen = null;
        this.request.trangThai = null;
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    if (data.data.content?.length > 0) {
                        if (data.data.content[0].ttGui.trangThai == Utils.TT_BC_7) {
                            this.isRequestExist = 1;
                            this.idRequest = data.data.content[0].id;
                        } else {
                            this.isRequestExist = 2;
                        }
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

    handleOk() {
        if (!this.response.canCuVeGia) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        if (!this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
