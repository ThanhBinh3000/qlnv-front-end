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
        this.response.maLoai = this.request.maLoai;
    }

    async checkReport() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn năm đề nghị!')
            this.response.loaiDnghi = null;
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
                            this.response.loaiDnghi = null;
                            return;
                        } else {
                            const index = lstBcao.findIndex(e => !Status.check('reject', e.trangThai));
                            if (index != -1) {
                                this.initReport(lstBcao?.length + 1, lstBcao[index].id)
                            } else {
                                this.initReport(lstBcao?.length + 1);
                            }
                        }
                    } else {
                        this.initReport(lstBcao?.length + 1);
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

    async initReport(dot: number, id?: string) {
        this.response.ngayTao = new Date();
        this.response.maDvi = this.userInfo.MA_DVI;
        this.response.dot = dot;
        this.response.trangThai = Status.TT_01;
        this.response.nguoiTao = this.userInfo.sub;
        await this.getMaDnghi();
        await this.getThuChi();
        if (id) {
            await this.capVonMuaBanTtthService.ctietVonMuaBan(id).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.response.lstCtiets.forEach(item => {
                            const temp = data.data.lstCtiets.find(e => e.maHangDtqg == item.maHangDtqg);
                            item.daNopVonUng = Operator.sum([item.daNopVonUng, temp.nopVonUng]);
                            item.daNopVonCap = Operator.sum([item.daNopVonCap, temp.nopVonCap]);
                            item.daNopTong = Operator.sum([item.daNopVonUng, item.daNopVonCap]);
                            item.changeModel()
                        })
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                        this.response.namDnghi = null;
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    this.response.namDnghi = null;
                },
            );
        }
    }

    async getMaDnghi() {
        await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.response.maCapUng = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                    this.response.loaiDnghi = null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDnghi = null
            },
        );
    }

    async getThuChi() {
        await this.capVonMuaBanTtthService.ctietThuChi(this.response.namDnghi).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    data.data.forEach(item => {
                        this.response.lstCtiets.push(new TienThua({
                            ...item,
                            id: uuid.v4() + 'FE',
                        }));
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.response.loaiDnghi = null
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                this.response.loaiDnghi = null
            },
        );
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
