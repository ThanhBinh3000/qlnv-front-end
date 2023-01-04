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
import { ItemContract } from '../../de-nghi-cap-von.constant';

export class ItemData {
    namBcao: number;
    soQdChiTieu: string;
    loaiDeNghi: string;
    hopDong: ItemContract[];
}

@Component({
    selector: 'dialog-tao-moi-hop-dong',
    templateUrl: './dialog-tao-moi-hop-dong.component.html',
    styleUrls: ['./dialog-tao-moi-hop-dong.component.scss'],
})

export class DialogTaoMoiHopDongComponent implements OnInit {
    @Input() obj: any;

    userInfo: any;
    response: ItemData = new ItemData();
    maHopDong: string;
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
        if (this.userService.isTongCuc()) {
            this.loaiDns = this.loaiDns.filter(e => e.id == Utils.MUA_VTU);
        } else {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        }
        this.response.hopDong = [];
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
    //lay ra danh sach cac hop dong cho bao cao
    // getListContract() {
    //     const request = {
    //         namKHoach: this.response.namBcao,
    //     }
    //     this.spinner.show();
    //     this.capVonNguonChiService.danhSachHopDong(request).toPromise().then(
    //         data => {
    //             if (data.statusCode == 0) {
    //                 this.lstHdongs = data.data;
    //                 let str: string = '';
    //                 for (let i = 0; i < this.lstHdongs.length; i++) {
    //                     if (i == 0) {
    //                         str += this.lstHdongs[i];
    //                     } else {
    //                         str += ', ' + this.lstHdongs[i];
    //                     }
    //                 }
    //                 this.response.hopDong.push({
    //                     ... new ItemContract(),
    //                     id: uuid.v4() + 'FE',
    //                     maDvi: this.userInfo?.MA_DVI,
    //                     tenDvi: this.userInfo?.TEN_DVI,
    //                     qdPheDuyetKqNhaThau: str,
    //                     isParent: true,
    //                 })
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data.msg);
    //             }
    //         },
    //         err => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         }
    //     )
    //     this.spinner.hide();
    // }
    //lay chi tiet cua bao cao
    getDetail() {
        if (!this.response.loaiDeNghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.userService.isTongCuc() && this.response.loaiDeNghi != Utils.MUA_VTU) {

        } else {
            this.getContract();
        }
    }
    //lay ra danh sach cac goi thau theo hop dong
    async getContract() {
        const request = {
            namKHoach: this.response.namBcao,
            maDvi: this.userInfo.MA_DVI,
            loaiVthh: "",
        }
        switch (this.response.loaiDeNghi) {
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
                            slThucHien: item.soLuongThien,
                            donGia: item.donGia,
                            gtHopDong: mulNumber(item.soLuong, item.donGia),
                            gtriThucHien: mulNumber(item.soLuongThien, item.donGia),
                            soTtLuyKe: item.soTtLuyKe,
                            daGiaoDuToan: item.daGiaoDuToan,
                        }
                        this.response.hopDong.push(temp);
                        let index: number;
                        if (this.response.loaiDeNghi != Utils.MUA_VTU) {
                            index = this.response.hopDong.findIndex(e => e.maDvi == temp.maDvi && e.isParent);
                        } else {
                            index = this.response.hopDong.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
                        }
                        if (index == -1) {
                            this.response.hopDong.push({
                                ...temp,
                                id: uuid.v4() + 'FE',
                                isParent: true,
                                qdPheDuyetKqNhaThau: item.soQdPdKhlcnt,
                            })
                        } else {
                            if (this.response.hopDong[index].qdPheDuyetKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
                                this.response.hopDong[index].qdPheDuyetKqNhaThau += ', ' + item.sosoQdPdKhlcnt;
                            }
                            this.response.hopDong[index].slHopDong = sumNumber([this.response.hopDong[index].slHopDong, temp.slHopDong]);
                            this.response.hopDong[index].slKeHoach = sumNumber([this.response.hopDong[index].slKeHoach, temp.slKeHoach]);
                            this.response.hopDong[index].slThucHien = sumNumber([this.response.hopDong[index].slThucHien, temp.slThucHien]);
                            this.response.hopDong[index].gtHopDong = sumNumber([this.response.hopDong[index].gtHopDong, temp.gtHopDong]);
                            this.response.hopDong[index].gtriThucHien = sumNumber([this.response.hopDong[index].gtriThucHien, temp.gtriThucHien]);
                            this.response.hopDong[index].daGiaoDuToan = sumNumber([this.response.hopDong[index].daGiaoDuToan, temp.daGiaoDuToan]);
                            this.response.hopDong[index].soTtLuyKe = sumNumber([this.response.hopDong[index].soTtLuyKe, temp.soTtLuyKe]);
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

    handleOk() {
        if (!this.response.namBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.loaiDeNghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
