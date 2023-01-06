import { Component, Input, OnInit } from '@angular/core';
import { MaxLengthValidator } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, mulNumber, sumNumber, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { BaoCao, ItemContract } from '../../de-nghi-cap-von.constant';

@Component({
    selector: 'dialog-tao-moi-hop-dong',
    templateUrl: './dialog-tao-moi-hop-dong.component.html',
    styleUrls: ['./dialog-tao-moi-hop-dong.component.scss'],
})

export class DialogTaoMoiHopDongComponent implements OnInit {
    @Input() obj: any;

    userInfo: any;
    response: BaoCao = new BaoCao();
    lstHdongs: any[] = [];
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    isContract = false;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private userService: UserService,
        private capVonNguonChiService: CapVonNguonChiService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.ngayTao = new Date();
        this.response.maDvi = this.userInfo?.MA_DVI;
        this.response.trangThai = Utils.TT_BC_1;
        this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        this.response.dnghiCvHopDongCtiets = [];
    }
    //lay ra so quyet dinh chi tieu cho de nghi
    getSoQdChiTieu() {
        const request = {
            namKHoach: this.response.namBcao,
            maDvi: this.userInfo?.MA_DVI,
        }
        this.spinner.show();
        this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.response.soQdChiTieu = data.data[0];
                    if (!this.response.soQdChiTieu) {
                        this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy số quyết định chỉ tiêu cho năm ' + this.response.namBcao);
                        this.response.namBcao = null;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.namBcao = null;
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.namBcao = null;
            }
        )
        this.spinner.hide();
    }

    //lay chi tiet cua bao cao
    async getDetail() {
        if (!this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        let isExist = false;
        const request = {
            maDvi: this.userInfo?.MA_DVI,
            namHdong: this.response.namBcao,
            loaiDnghi: this.response.loaiDnghi,
            paggingReq: {
                limit: 10,
                page: 1,
            },
        }
        await this.capVonNguonChiService.timKiemHopDong(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    data.data.content.forEach(item => {
                        if (item.trangThai == Utils.TT_BC_2 || item.trangThai == Utils.TT_BC_7) {
                            isExist = true;
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
        if (isExist) {
            this.notification.warning(MESSAGE.WARNING, 'Hợp đồng cấp vốn đã tồn tại');
            return;
        }
        if (!this.userService.isTongCuc() || this.response.loaiDnghi == Utils.MUA_VTU) {
            this.getContract();
        } else {
            this.callSynthetic();
        }
    }

    //tong hop hop dong mua luong thuc
    async callSynthetic() {
        const request = {
            loaiDnghi: this.response.loaiDnghi,
            maDvi: this.userInfo?.MA_DVI,
            namHdong: this.response.namBcao,
        }
        await this.capVonNguonChiService.tongHopHopDong(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.response.dnghiCvHopDongCtiets = data.data;
                    this.response.dnghiCvHopDongCtiets.forEach(item => {
                        item.id = uuid.v4() + 'FE';
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }
    //lay ra danh sach cac goi thau theo hop dong
    async getContract() {
        const request = {
            namKHoach: this.response.namBcao,
            maDvi: this.userInfo.MA_DVI,
            loaiVthh: "",
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
        await this.capVonNguonChiService.dsachHopDong(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    data.data.forEach(item => {
                        const temp: ItemContract = {
                            ... new ItemContract(),
                            id: uuid.v4() + 'FE',
                            maDvi: this.userInfo?.MA_DVI,
                            tenDvi: this.userInfo?.TEN_DVI,
                            tenKhachHang: item.tenNhaThau,
                            isParent: false,
                            qdPheDuyetKqNhaThau: item.soHd,
                            slKeHoach: item.soLuongKehoach,
                            slHopDong: item.soLuong,
                            // slThucHien: item.soLuongThien,
                            donGia: item.donGia,
                            gtHopDong: mulNumber(item.soLuong, item.donGia),
                            // gtriThucHien: mulNumber(item.soLuongThien, item.donGia),
                            soTtLuyKe: item.soTtLuyKe,
                            daGiaoDuToan: item.daGiaoDuToan,
                        }
                        this.response.dnghiCvHopDongCtiets.push(temp);
                        let index: number;
                        if (this.response.loaiDnghi != Utils.MUA_VTU) {
                            index = this.response.dnghiCvHopDongCtiets.findIndex(e => e.maDvi == temp.maDvi && e.isParent);
                        } else {
                            index = this.response.dnghiCvHopDongCtiets.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
                        }
                        if (index == -1) {
                            this.response.dnghiCvHopDongCtiets.push({
                                ...temp,
                                id: uuid.v4() + 'FE',
                                isParent: true,
                                qdPheDuyetKqNhaThau: item.soQdPdKhlcnt,
                            })
                        } else {
                            if (this.response.dnghiCvHopDongCtiets[index].qdPheDuyetKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
                                this.response.dnghiCvHopDongCtiets[index].qdPheDuyetKqNhaThau += ', ' + item.sosoQdPdKhlcnt;
                            }
                            this.response.dnghiCvHopDongCtiets[index].slHopDong = sumNumber([this.response.dnghiCvHopDongCtiets[index].slHopDong, temp.slHopDong]);
                            this.response.dnghiCvHopDongCtiets[index].slKeHoach = sumNumber([this.response.dnghiCvHopDongCtiets[index].slKeHoach, temp.slKeHoach]);
                            this.response.dnghiCvHopDongCtiets[index].slThucHien = sumNumber([this.response.dnghiCvHopDongCtiets[index].slThucHien, temp.slThucHien]);
                            this.response.dnghiCvHopDongCtiets[index].gtHopDong = sumNumber([this.response.dnghiCvHopDongCtiets[index].gtHopDong, temp.gtHopDong]);
                            this.response.dnghiCvHopDongCtiets[index].gtriThucHien = sumNumber([this.response.dnghiCvHopDongCtiets[index].gtriThucHien, temp.gtriThucHien]);
                            this.response.dnghiCvHopDongCtiets[index].daGiaoDuToan = sumNumber([this.response.dnghiCvHopDongCtiets[index].daGiaoDuToan, temp.daGiaoDuToan]);
                            this.response.dnghiCvHopDongCtiets[index].soTtLuyKe = sumNumber([this.response.dnghiCvHopDongCtiets[index].soTtLuyKe, temp.soTtLuyKe]);
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

    async getMaHd() {
        await this.capVonNguonChiService.maHopDong().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.maHopDong = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    async handleOk() {
        if (!this.response.namBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        await this.getMaHd();
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
