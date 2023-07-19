import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { Report, TienThua } from '../../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../../von-mua-von-ung.constant';

@Component({
    selector: 'dialog-tao-moi-tien-thua',
    templateUrl: './dialog-tao-moi-tien-thua.component.html',
    styleUrls: ['../../von-mua-von-ung.component.scss'],
})

export class DialogTaoMoiTienThuaComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
    thuChis: TienThua[] = [];
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];

    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private spinner: NgxSpinnerService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.lstNam = Utils.getListYear(5, 10);
    }

    async checkReport() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn năm đề nghị!')
            this.response.loaiDeNghi = null;
            return;
        }
        this.request.namDnghi = this.response.namDnghi;
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    let initItem = new Report();
                    let lstBcao = [];
                    if (data.data.content?.length > 0) {
                        lstBcao = data.data.content;
                        lstBcao.sort((a, b) => b.dot - a.dot);
                        if ([Status.TT_02, Status.TT_04, Status.TT_01].includes(lstBcao[0].trangThai)) {
                            this.notification.warning(MESSAGE.WARNING, 'Trạng thái của đợt trước không cho phép tạo mới!')
                            this.response.loaiDeNghi = null;
                            return;
                        } else {
                            const index = lstBcao.findIndex(e => !Status.check('reject', e.trangThai));
                            if (index != -1) {
                                Object.assign(initItem, lstBcao[index]);
                            }
                        }
                    }
                    this.initReport(lstBcao?.length + 1, initItem);
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    this.response.loaiDeNghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDeNghi = null;
            }
        );
        this.spinner.hide();
    }

    async initReport(dot: number, initItem: Report) {
        this.response.ngayTao = new Date();
        this.response.maDvi = this.userInfo.MA_DVI;
        this.response.dot = dot;
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo.sub;
        await this.getMaDnghi();
        await this.getThuChi();
        this.thuChis.forEach(item => {
            const hangDtqg = new TienThua({
                ...item,
                id: uuid.v4() + 'FE',
            })
            const data = initItem.lstCtiets?.find(e => e.maHangDtqg == item.maHangDtqg);
            if (data) {
                hangDtqg.daNopVonUng = Operator.sum([data.daNopVonUng, data.nopVonUng]);
                hangDtqg.daNopVonCap = Operator.sum([data.daNopVonCap, data.nopVonCap]);
                hangDtqg.daNopTong = Operator.sum([hangDtqg.daNopVonUng, hangDtqg.daNopVonCap]);
                hangDtqg.changeModel();
            }
            this.response.lstCtiets.push(hangDtqg);
        })
    }

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

    async getThuChi() {
    }

    handleOk() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: Tab.TIEN_THUA,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
