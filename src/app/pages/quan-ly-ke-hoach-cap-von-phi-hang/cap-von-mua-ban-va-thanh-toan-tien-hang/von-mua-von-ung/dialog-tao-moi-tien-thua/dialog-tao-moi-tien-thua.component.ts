import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { receivedInfo, Report, sendInfo, TienThua } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'dialog-tao-moi-tien-thua',
    templateUrl: './dialog-tao-moi-tien-thua.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss'],
})

export class DialogTaoMoiTienThuaComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
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
        this.response.maLoai = this.request.maLoai;
        this.userInfo = this.userService.getUserLogin();
    }

    //lay ra chi tiet cua de nghi
    async getDetail() {
        this.spinner.show();
        await this.checkRequest();

        if (this.isRequestExist == 2) {
            this.notification.warning(MESSAGE.WARNING, 'Trạng thái bản ghi không cho phép tạo đợt mới');
            // this.response.loaiDnghi = null;
            return;
        }
        if (this.isRequestExist == 0) {
            this.notification.warning(MESSAGE.WARNING, 'Chưa tồn tại bản ghi nộp tiền vốn thừa năm ' + this.response.namDnghi);
            // this.response.loaiDnghi = null;
            return;
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
            this.response.ttGui.lstCtietBcaos.push({
                ...new TienThua(),
                id: uuid.v4() + 'FE',
                maHang: Utils.MUA_THOC,
                hangDtqg: 'Thóc',
            })
            if (!this.userService.isChiCuc) {
                this.response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: uuid.v4() + 'FE',
                    maHang: Utils.MUA_GAO,
                    hangDtqg: 'Gạo',
                })
                this.response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: uuid.v4() + 'FE',
                    maHang: Utils.MUA_MUOI,
                    hangDtqg: 'Muối',
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
                item.listLuyKe.push({
                    id: uuid.v4() + 'FE',
                    uyNhiemChiNgay: item.uyNhiemChiNgay,
                    soNopLanNay: item.soNopLanNay,
                    dot: this.response.dot,
                })
                item.soDaNopTcLuyKeLanNay = item.luyKeSauLanNop;
                item.uyNhiemChiNgay = null;
                item.soNopLanNay = 0;
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
                    this.response.namDnghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.namDnghi = null;
            }
        );
        this.spinner.hide();
    }

    async handleOk() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        await this.getDetail();
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
