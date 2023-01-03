import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
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
                    } else {
                        this.getListContract();
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
    getListContract() {
        const request = {
            namKHoach: this.response.namBcao,
        }
        this.spinner.show();
        this.capVonNguonChiService.danhSachHopDong(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.lstHdongs = data.data;
                    let str: string = '';
                    for (let i = 0; i < this.lstHdongs.length; i++) {
                        if (i == 0) {
                            str += this.lstHdongs[i];
                        } else {
                            str += ', ' + this.lstHdongs[i];
                        }
                    }
                    this.response.hopDong.push({
                        ... new ItemContract(),
                        maDvi: this.userInfo?.MA_DVI,
                        tenDvi: this.userInfo?.TEN_DVI,
                        qdPheDuyetKqNhaThau: str,
                        isParent: true,
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
        this.spinner.hide();
    }
    //lay ra danh sach cac goi thau theo hop dong
    async getContract() {
        if (!this.response.loaiDeNghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        const request = {
            soQD: null,
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
        this.lstHdongs.forEach(async item => {
            request.soQD = item;
            await this.capVonNguonChiService.dsachHopDong(request).toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        //lay ra danh sach cac goi thau
                        //this.response.hopDong = data.data;
                    } else {
                        this.notification.warning(MESSAGE.WARNING, data?.msg);
                    }
                },
                (err) => {
                    this.notification.warning(MESSAGE.WARNING, MESSAGE.SYSTEM_ERROR);
                },
            );
        })
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
