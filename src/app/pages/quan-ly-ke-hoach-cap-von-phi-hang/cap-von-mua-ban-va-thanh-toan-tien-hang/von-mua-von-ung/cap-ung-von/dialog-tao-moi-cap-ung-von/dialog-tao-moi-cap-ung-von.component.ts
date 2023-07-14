import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { CapUng, Cvmb, Report } from '../../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../../von-mua-von-ung.constant';

@Component({
    selector: 'dialog-tao-moi-cap-ung-von',
    templateUrl: './dialog-tao-moi-cap-ung-von.component.html',
    styleUrls: ['../../von-mua-von-ung.component.scss'],
})

export class DialogTaoMoiCapUngVonComponent implements OnInit {
    @Input() request: any;

    userInfo: any;
    response: Report = new Report();
    loaiDns: any[] = [];
    donVis: any[];
    lstNam: number[] = [];

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
        if (this.userService.isTongCuc()) {
            this.loaiDns = this.response.maLoai == Cvmb.CU_VON_DVCD ? Cvmb.LOAI_DE_NGHI.filter(e => e.id != Cvmb.VTU) : Cvmb.LOAI_DE_NGHI;
        } else if (this.userService.isCuc()) {
            this.loaiDns = this.response.maLoai == Cvmb.CU_VON_DVCD ? Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC) : Cvmb.LOAI_DE_NGHI.filter(e => e.id != Cvmb.VTU);
        } else {
            this.loaiDns = Cvmb.LOAI_DE_NGHI.filter(e => e.id == Cvmb.THOC);
        }
        this.userInfo = this.userService.getUserLogin();

        const thisYear = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(thisYear + i);
        }
    }

    async checkReport() {
        if (!this.response.namDnghi) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn năm đề nghị!')
            this.response.loaiDeNghi = null;
            return;
        }
        this.request.namDnghi = this.response.namDnghi;
        this.request.loaiDnghi = this.response.loaiDeNghi;
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
        this.response.lstFiles = [];
        this.response.lstCtiets = [];
        await this.getMaDnghi();
        if (initItem.lstCtiets?.length == 0) {
            if (this.response.maLoai == Cvmb.GHI_NHAN_CU_VON) {
                this.response.lstCtiets.push(new CapUng({
                    id: uuid.v4() + 'FE',
                    maDvi: this.response.maDvi,
                    tenDvi: this.userInfo.TEN_DVI,
                }))
            } else {
                await this.getChildUnit();
                this.donVis.forEach(item => {
                    this.response.lstCtiets.push(new CapUng({
                        id: uuid.v4() + 'FE',
                        maDvi: item.maDvi,
                        tenDvi: item.tenDvi,
                    }))
                })
            }
        } else {
            initItem.lstCtiets.forEach(item => {
                this.response.lstCtiets.push(new CapUng({
                    ...item,
                    id: uuid.v4() + 'FE',
                    uncVonUng: 0,
                    uncVonCap: 0,
                    uncCong: 0,
                    ghiChu: null,
                }))
            })
        }
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

    handleOk() {
        if (!this.response.namDnghi || !this.response.loaiDeNghi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        this._modalRef.close({
            baoCao: this.response,
            id: null,
            tabSelected: Tab.CUV,
        });
    }

    handleCancel() {
        this._modalRef.close();
    }
}
