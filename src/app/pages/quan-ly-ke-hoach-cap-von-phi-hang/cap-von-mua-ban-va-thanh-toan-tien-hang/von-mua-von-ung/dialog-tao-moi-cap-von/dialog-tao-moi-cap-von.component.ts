import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { CapUng, receivedInfo, Report, sendInfo } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'dialog-tao-moi-cap-von',
    templateUrl: './dialog-tao-moi-cap-von.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss'],
})

export class DialogTaoMoiCapVonComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    donVis: any[];
    isRequestExist!: number;
    idRequest: string;

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        if (!this.userService.isTongCuc() || this.request.maLoai == 3) {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        }
        if (this.request.maLoai == 3) {
            this.loaiDns = this.loaiDns.filter(e => e.id == Utils.MUA_THOC);
        }
        this.response.maLoai = this.request.maLoai;
        this.userInfo = this.userService.getUserLogin();
    }

    //lay ra chi tiet cua de nghi
    async getDetail() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            this.response.loaiDnghi = null;
            return;
        }
        await this.checkRequest();
        //bao cao da ton tai nhung chua duoc phe duyet
        if (this.isRequestExist == 2) {
            this.notification.warning(MESSAGE.WARNING, 'Trạng thái bản ghi không cho phép tạo đợt mới');
            this.response.loaiDnghi = null;
            return;
        }
        //bao cao chua ton tai
        if (this.isRequestExist == 0) {
            this.response.ttGui = new sendInfo();
            this.response.ttGui.lstCtietBcaos = [];
            this.response.ttNhan = new receivedInfo();
            this.response.ttNhan.lstCtietBcaos = [];
            this.response.maDvi = this.userInfo?.MA_DVI;
            this.response.ngayTao = new Date();
            this.response.dot = 1;
            this.response.ttGui.trangThai = Utils.TT_BC_1;
            this.response.ttNhan.trangThai = Utils.TT_BC_1;
            this.response.ttGui.lstFiles = [];
            this.response.ttNhan.lstFiles = [];
            if (this.response.maLoai == 2) {
                this.response.ttGui.lstCtietBcaos.push({
                    ...new CapUng(),
                    id: uuid.v4() + 'FE',
                })
            } else {
                await this.getChildUnit();
                this.donVis.forEach(item => {
                    this.response.ttGui.lstCtietBcaos.push({
                        ...new CapUng(),
                        id: uuid.v4() + 'FE',
                        maDvi: item.maDvi,
                        tenDvi: item.tenDvi,
                    })
                })
            }
            await this.getMaDnghi();
        }
        //bao cao da ton tai va duoc phe duyet
        if (this.isRequestExist == 1) {
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
                item.listLuyKe.push({
                    id: uuid.v4() + 'FE',
                    vonUng: item.vonUng,
                    vonCap: item.vonCap,
                    tong: item.tong,
                    dot: this.response.dot,
                })
                item.vonUng = 0;
                item.vonCap = 0;
                item.tong = 0;
            })
            if (this.response.maLoai == 2) {
                this.response.ttNhan.lstCtietBcaos.push({
                    id: uuid.v4() + 'FE',
                    ngayNhanLenhChuyenCo: this.response.ttNhan.ngayNhanLenhChuyenCo,
                    tkNhan: this.response.ttNhan.tkNhan,
                    dot: this.response.dot,
                })
                this.response.ttNhan.ngayNhanLenhChuyenCo = null;
                this.response.ttNhan.tkNhan = null;

            } else {
                this.response.ttGui.trangThai = Utils.TT_BC_1;
            }
            this.response.dot += 1;
            this.response.ttNhan.trangThai = Utils.TT_BC_1;
        }
    }

    // async getContractData() {
    //     const request = {
    //         namKHoach: this.response.namDnghi,
    //         maDvi: this.userInfo.MA_DVI,
    //         loaiVthh: null,
    //     }
    //     switch (this.response.loaiDnghi) {
    //         case Utils.MUA_THOC:
    //             request.loaiVthh = "0101"
    //             break;
    //         case Utils.MUA_GAO:
    //             request.loaiVthh = "0102"
    //             break;
    //         case Utils.MUA_MUOI:
    //             request.loaiVthh = "04"
    //             break;
    //         case Utils.MUA_VTU:
    //             request.loaiVthh = "02"
    //             break;
    //     }
    //     await this.capVonMuaBanTtthService.dsachHopDong(request).toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 data.data.forEach(item => {
    //                     const temp: ThanhToan = {
    //                         ... new ThanhToan(),
    //                         id: uuid.v4() + 'FE',
    //                         tenKhachHang: item.tenNhaThau,
    //                         isParent: false,
    //                         qdPdKqNhaThau: item.soHd,
    //                         soLuongKeHoach: item.soLuongKehoach,
    //                         soLuongHopDong: item.soLuong,
    //                         donGia: item.donGia,
    //                         giaTriHd: mulNumber(item.soLuong, item.donGia),
    //                     }
    //                     this.response.ttGui.lstCtietBcaos.push(temp);
    //                     const index = this.response.ttGui.lstCtietBcaos.findIndex(e => e.tenKhachHang == temp.tenKhachHang && e.isParent);
    //                     if (index == -1) {
    //                         this.response.ttGui.lstCtietBcaos.push({
    //                             ...temp,
    //                             id: uuid.v4() + 'FE',
    //                             isParent: true,
    //                             qdPdKqNhaThau: item.soQdPdKhlcnt,
    //                         })
    //                     } else {
    //                         if (this.response.ttGui.lstCtietBcaos[index].qdPdKqNhaThau.indexOf(item.soQdPdKhlcnt) == -1) {
    //                             this.response.ttGui.lstCtietBcaos[index].qdPdKqNhaThau += ', ' + item.sosoQdPdKhlcnt;
    //                         }
    //                         this.response.ttGui.lstCtietBcaos[index].soLuongHopDong = sumNumber([this.response.ttGui.lstCtietBcaos[index].soLuongHopDong, temp.soLuongHopDong]);
    //                         this.response.ttGui.lstCtietBcaos[index].soLuongKeHoach = sumNumber([this.response.ttGui.lstCtietBcaos[index].soLuongKeHoach, temp.soLuongKeHoach]);
    //                         this.response.ttGui.lstCtietBcaos[index].giaTriHd = sumNumber([this.response.ttGui.lstCtietBcaos[index].giaTriHd, temp.giaTriHd]);
    //                         this.response.ttGui.lstCtietBcaos[index].donGia = divNumber(this.response.ttGui.lstCtietBcaos[index].giaTriHd, this.response.ttGui.lstCtietBcaos[index].soLuongHopDong);
    //                     }
    //                 })
    //             } else {
    //                 this.notification.warning(MESSAGE.WARNING, data?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
    //         },
    //     );
    // }

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

    async getChildUnit() {
        this.spinner.show();
        const request = {
            maDviCha: this.response.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (this.userService.isTongCuc()) {
                        this.donVis = data.data.filter(e => e.tenVietTat && e.tenVietTat.startsWith('CDT'));
                    } else {
                        this.donVis = data.data.filter(e => e.tenVietTat && e.tenVietTat.startsWith('CCDT'))
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
        this.spinner.hide();
    }

    async checkRequest() {
        this.spinner.show();
        this.isRequestExist = 0;
        this.request.namDnghi = this.response.namDnghi;
        this.request.loaiDnghi = this.response.loaiDnghi;
        this.request.ngayTaoTu = null;
        this.request.ngayTaoDen = null;
        this.request.trangThai = null;
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    if (data.data.content?.length > 0) {
                        if ((data.data.content[0].ttGui.trangThai == Utils.TT_BC_7 && this.response.maLoai == 3) ||
                            (data.data.content[0].ttNhan.trangThai == Utils.TT_BC_7 && this.response.maLoai == 2)) {
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
        if (!this.response.namDnghi || !this.response.loaiDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
