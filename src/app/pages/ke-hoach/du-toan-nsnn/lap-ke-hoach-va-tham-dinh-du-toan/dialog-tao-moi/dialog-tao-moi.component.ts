import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as dayjs from 'dayjs';

@Component({
    selector: 'dialog-tao-moi',
    templateUrl: './dialog-tao-moi.component.html',
    styleUrls: ['./dialog-tao-moi.component.scss'],
})

export class DialogTaoMoiComponent implements OnInit {
    @Input() tab: string;

    userInfo: any;
    response: any = {
        namHienTai: null,
        maDvi: null,
        lstLapThamDinhs: [],
        lstDviTrucThuoc: [],
        maBcao: null,
        loai: null,
        maPa: null,
        idSoTranChi: null,
    };

    syntheticType = [
        {
            id: 2,
            tenDm: 'Tổng hợp báo cáo từ đơn vị cấp dưới',
        },
        {
            id: 1,
            tenDm: 'Tổng hợp theo phương án giao số kiểm',
        }
    ]
    lstNam: number[] = [];
    lstPa: any[] = [];
    checkReport: boolean;


    constructor(
        private _modalRef: NzModalRef,
        private userService: UserService,
        private lapThamDinhService: LapThamDinhService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maDvi = this.userInfo?.MA_DVI;

        const thisYear = dayjs().get('year');
        for (let i = -10; i < 30; i++) {
            this.lstNam.push(thisYear + i);
        }
    }
    //tong hop theo nam bao cao
    async tongHop() {
        this.spinner.show();
        await this.lapThamDinhService.tongHop(this.response).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.lstLapThamDinhs = data.data.lstLapThamDinhs;
                    this.response.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
                    this.response.lstLapThamDinhs.forEach(item => {
                        if (!item.id) {
                            item.id = uuid.v4() + 'FE';
                        }
                        item.nguoiBcao = this.userInfo?.sub;
                        item.maDviTien = '1';
                        item.trangThai = '3';
                    })
                    this.response.lstDviTrucThuoc.forEach(item => {
                        item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                        item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.spinner.hide();
    }
    // tong hop theo ma phuong an
    async tongHopPa() {
        const request = {
            maPA: this.response.maPa,
        }
        this.spinner.show();
        await this.lapThamDinhService.tongHopPa(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.lstLapThamDinhs = data.data.lstLapThamDinhs;
                    this.response.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
                    this.response.lstLapThamDinhs.forEach(item => {
                        if (!item.id) {
                            item.id = uuid.v4() + 'FE';
                        }
                        item.nguoiBcao = this.userInfo?.sub;
                        item.maDviTien = '1';
                        item.trangThai = '3';
                    })
                    this.response.lstDviTrucThuoc.forEach(item => {
                        item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                        item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.spinner.hide();
    }
    //kiem tra ma bao cao de tao moi phuong an
    async baoCao() {
        const requestReport = {
            loaiTimKiem: "0",
            maBcaos: !this.response.maBcao ? [] : [this.response.maBcao],
            maDvi: this.response.maDvi,
            namBcao: "",
            ngayTaoDen: "",
            ngayTaoTu: "",
            paggingReq: {
                limit: 10,
                page: 1,
            },
            trangThais: [Utils.TT_BC_7],
        };
        this.spinner.show();
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    const danhSach = data.data.content;
                    if (danhSach.length > 0) {
                        this.response.namHienTai = danhSach[0].namBcao;
                    } else {
                        this.response.namHienTai = null;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.response.namHienTai = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.namHienTai = null;
            }
        );
        this.spinner.hide();
    }

    changeModel() {
        if (this.response.loai == 1) {
            this.getListPA();
        }
    }
    //lay danh sach cac phuong an co the tong hop lai
    async getListPA() {
        const requestReport = {
            loaiTimKiem: '0',
            maDviTao: this.userInfo.MA_DVI,
            trangThais: [Utils.TT_BC_6],
            paggingReq: {
                limit: 1000,
                page: 1,
            }
        };
        await this.lapThamDinhService.timKiemPhuongAn(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.lstPa = res.data.content;
                this.lstPa = this.lstPa.filter(item => item.listTtCtiet.every(e => e.trangThai == '1'));
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }

    //kiem tra cac bao cao trong phuong an da dc tiep nhan lai chua
    async checkReportStatus() {
        this.checkReport = true;
        let message = '';
        const data = this.lstPa.find(e => e.maPa == this.response.maPa);
        let lstMaBcao = [];
        data.listTtCtiet.forEach(e => {
            lstMaBcao.push(e.maBcao);
        })
        const requestReport = {
            loaiTimKiem: "0",
            maBcaos: lstMaBcao,
            maDvi: null,
            namBcao: null,
            paggingReq: {
                limit: 1000,
                page: 1,
            },
            trangThais: [],
        };
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    res.data.content.forEach(item => {
                        if (item.trangThai != Utils.TT_BC_9) {
                            message += item.maBcao;
                        }
                    })
                    if (message) {
                        this.notification.warning(MESSAGE.WARNING, 'Báo cáo: ' + message + 'còn thiếu');
                        this.checkReport = false;
                    } else {
                        this.response.maBcao = data.maBcao;
                        this.response.idSoTranChi = data.idSoTranChi;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.checkReport = false;
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.checkReport = false;
            }
        )
    }

    async handleOk() {
        if (this.tab == 'danhsach') {
            if (!this.response.namHienTai) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
            if (this.response.namHienTai < 1000 || this.response.namHienTai > 2999) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }

        if (this.tab == 'tonghop') {
            if (!this.response.loai) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            } else {
                if ((this.response.loai == 1 && !this.response.maPa) || (this.response.loai == 2 && !this.response.namHienTai)) {
                    this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                    return;
                }
            }
            if (this.response.loai == 2) {
                await this.tongHop();
            } else {
                await this.checkReportStatus();
                if (!this.checkReport) {
                    return;
                }
                await this.tongHopPa();
            }

            if (this.response.lstDviTrucThuoc?.length == 0) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EXIST_REPORT);
                return;
            }
        }

        if (this.tab == 'ds-skt-btc') {
            if (!this.response.maBcao) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
            await this.baoCao();
            if (!this.response.namHienTai) {
                this.notification.warning(MESSAGE.WARNING, "Không tìm thấy mã báo cáo: " + this.response.maBcao);
                return;
            }
        }
        this._modalRef.close(this.response);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
