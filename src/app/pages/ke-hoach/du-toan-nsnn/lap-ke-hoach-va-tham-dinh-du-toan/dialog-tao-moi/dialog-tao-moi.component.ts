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
    };

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
    }

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

    async baoCao() {
        const requestReport = {
            loaiTimKiem: "0",
            maBcao: this.response.maBcao,
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

    async handleOk() {
        if (this.tab != 'ds-skt-btc') {
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
            await this.tongHop();
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
