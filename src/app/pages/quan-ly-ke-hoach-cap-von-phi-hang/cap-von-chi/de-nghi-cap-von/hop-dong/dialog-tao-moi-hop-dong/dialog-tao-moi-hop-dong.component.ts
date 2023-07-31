import { Component, Input, OnInit } from '@angular/core';
import { MaxLengthValidator } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { mulNumber, sumNumber } from 'src/app/Utility/func';
import { CAN_CU_GIA, LOAI_DE_NGHI, Operator, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { BaoCao, ItemContract } from '../../de-nghi-cap-von.constant';
import dayjs from "dayjs";

@Component({
    selector: 'dialog-tao-moi-hop-dong',
    templateUrl: './dialog-tao-moi-hop-dong.component.html',
    styleUrls: ['./dialog-tao-moi-hop-dong.component.scss'],
})

export class DialogTaoMoiHopDongComponent implements OnInit {
    @Input() obj: any;

    userInfo: any;
    response: BaoCao;
    lstHdongs: any[] = [];
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    isContract = false;
    listNam: any[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private userService: UserService,
        private capVonNguonChiService: CapVonNguonChiService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.response = new BaoCao();
        this.userInfo = this.userService.getUserLogin();
        this.response.ngayTao = new Date();
        this.loadDsNam();
        this.response.maDvi = this.userInfo?.MA_DVI;
        this.response.trangThai = Utils.TT_BC_1;
        if (this.userService.isTongCuc()) {
            this.loaiDns = this.loaiDns.filter(e => e.id == Utils.MUA_VTU);
        } else {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        }
        this.response.lstCtiets = [];
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

    loadDsNam() {
        for (let i = -3; i < 23; i++) {
            this.listNam.push({
                value: dayjs().get("year") - i,
                text: dayjs().get("year") - i
            });
        }
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
            loaiTimKiem: '0',
            maLoai: '3',
            paggingReq: {
                limit: 10,
                page: 1,
            },
        }
        await this.capVonNguonChiService.timKiemDeNghi(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    data.data.content.forEach(item => {
                        if (item.trangThai == Utils.TT_BC_2 || item.trangThai == Utils.TT_BC_7) {
                            isExist = true;
                        }
                    })
                    const demSoLan = data.data.content.length;
                    this.response.soLan = demSoLan + 1;
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
                    this.response.lstCtiets = data.data;
                    this.response.lstCtiets.forEach(item => {
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
                        this.response.lstCtiets.push(temp);
                        let index: number;
                        if (this.response.loaiDnghi != Utils.MUA_VTU) {
                            index = this.response.lstCtiets.findIndex(e => e.maDvi == temp.maDvi && e.isParent);
                        } else {
                            index = this.response.lstCtiets.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
                        }
                        if (index == -1) {
                            this.response.lstCtiets.push({
                                ...temp,
                                id: uuid.v4() + 'FE',
                                isParent: true,
                                qdPheDuyetKqNhaThau: item.soQdPdKhlcnt,
                                donGia: null,
                            })
                        } else {
                            if (this.response.lstCtiets[index].qdPheDuyetKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
                                this.response.lstCtiets[index].qdPheDuyetKqNhaThau += ', ' + item.soQdPdKhlcnt;
                            }
                            this.response.lstCtiets[index].slHopDong = Operator.sum([this.response.lstCtiets[index].slHopDong, temp.slHopDong]);
                            this.response.lstCtiets[index].slKeHoach = Operator.sum([this.response.lstCtiets[index].slKeHoach, temp.slKeHoach]);
                            this.response.lstCtiets[index].slThucHien = Operator.sum([this.response.lstCtiets[index].slThucHien, temp.slThucHien]);
                            this.response.lstCtiets[index].gtHopDong = Operator.sum([this.response.lstCtiets[index].gtHopDong, temp.gtHopDong]);
                            this.response.lstCtiets[index].gtriThucHien = Operator.sum([this.response.lstCtiets[index].gtriThucHien, temp.gtriThucHien]);
                            this.response.lstCtiets[index].daGiaoDuToan = Operator.sum([this.response.lstCtiets[index].daGiaoDuToan, temp.daGiaoDuToan]);
                            this.response.lstCtiets[index].soTtLuyKe = Operator.sum([this.response.lstCtiets[index].soTtLuyKe, temp.soTtLuyKe]);
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
        await this.getSoQdChiTieu();
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
