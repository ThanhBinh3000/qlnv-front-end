import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'dialog-tao-moi-de-nghi',
    templateUrl: './dialog-tao-moi-de-nghi.component.html',
    styleUrls: ['./dialog-tao-moi-de-nghi.component.scss'],
})

export class DialogTaoMoiDeNghiComponent implements OnInit {
    @Input() obj: any;

    userInfo: any;
    response: any = {
        namDn: null,
        qdChiTieu: null,
        canCuGia: null,
        loaiDn: null,
        hopDong: [],
    };
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
            this.canCuGias = this.canCuGias.filter(e => e.id == Utils.HD_TRUNG_THAU);
        } else {
            this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
        }
    }

    getSoQdChiTieu() {
        const request = {
            namKHoach: this.response.namDn,
            maDvi: this.userInfo?.MA_DVI,
        }
        this.spinner.show();
        this.capVonNguonChiService.soQdChiTieu(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.response.qdChiTieu = data.data[0];
                    if (!this.response.qdChiTieu) {
                        this.notification.warning(MESSAGE.WARNING, 'Không tìm thấy số quyết định chỉ tiêu cho năm ' + this.response.namDn);
                        this.response.namDn = null;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.namDn = null;
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                this.response.namDn = null;
            }
        )
        this.spinner.hide();
    }

    getListContract() {
        if (!this.response.namDn) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập năm');
            this.response.canCuGia = null;
            return;
        }
        if (this.response.canCuGia == Utils.HD_TRUNG_THAU) {
            const request = {
                namKHoach: this.response.namDn,
            }
            this.spinner.show();
            this.capVonNguonChiService.danhSachHopDong(request).toPromise().then(
                data => {
                    if (data.statusCode == 0) {
                        this.lstHdongs = data.data;
                        this.isContract = true;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data.msg);
                        this.response.canCuGia = null;
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    this.response.canCuGia = null;
                }
            )
            this.spinner.hide();
        } else {
            this.isContract = false;
        }
    }

    async getContract() {
        if (!this.response.loaiDn || !this.maHopDong) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            this.maHopDong = null;
            return;
        }
        const request = {
            soQD: this.maHopDong,
            maDvi: this.userInfo.MA_DVI,
            loaiVthh: "",
        }
        switch (this.response.loaiDn) {
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
                    this.response.hopDong = data.data;
                } else {
                    this.notification.warning(MESSAGE.WARNING, data?.msg);
                    this.maHopDong = null;
                }
            },
            (err) => {
                this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
                this.maHopDong = null;
            },
        );
    }

    handleOk() {
        if (!this.response.namDn) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.canCuGia) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!this.response.loaiDn) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.response.canCuGia == Utils.HD_TRUNG_THAU && !this.maHopDong) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
