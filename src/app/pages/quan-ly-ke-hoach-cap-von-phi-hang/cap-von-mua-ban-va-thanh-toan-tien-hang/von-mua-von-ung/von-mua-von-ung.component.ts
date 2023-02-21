import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { receivedInfo, Report, sendInfo, TienThua } from '../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { TAB_LIST } from './von-mua-von-ung.constant';

@Component({
    selector: 'app-von-mua-von-ung',
    templateUrl: './von-mua-von-ung.component.html',
    styleUrls: ['./von-mua-von-ung.component.scss']
})
export class VonMuaVonUngComponent implements OnInit {

    tabSelected!: string;
    data: any;
    isTongCuc = true;
    tabList: any[] = TAB_LIST;
    userInfo: any;

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();

        this.isTongCuc = this.userService.isTongCuc();
        this.tabList.forEach(item => {
            item.isSelected = false;
            item.status = this.userService.isAccessPermisson(item.role);
            if (!this.tabSelected && item.status) {
                this.tabSelected = item.code;
                item.isSelected = true;
            }
        })
        this.data = {
            tabSelected: this.tabSelected,
        }
    }

    selectTab(tab) {
        this.tabSelected = tab;
        this.tabList.forEach(e => {
            e.isSelected = (tab == e.code);
        })
        this.data = {
            tabSelected: this.tabSelected,
        }
    }

    async changeTab(obj: any) {
        this.data = {
            ...obj,
            preTab: this.tabSelected,
        };
        if (!this.data?.id && this.data.baoCao) {
            await this.addVonBanGuiDvct(this.data.baoCao.namDnghi);
        }
        this.tabSelected = obj?.tabSelected;
        if (this.tabList.findIndex(e => e.code == this.tabSelected) != -1) {
            this.tabList.forEach(e => {
                e.isSelected = (this.tabSelected == e.code);
            })
        }
    }

    //kiem tra ban ghi nop tien von ban hang len don vi cap tren da ton tai chua, neu chua thi thuc hien them moi
    async addVonBanGuiDvct(nam: number) {
        let check = false // ban ghi chua ton tai
        //kiem tra ban ghi da ton tai chua
        const request = {
            loaiTimKiem: '0',
            maLoai: 6,
            maDvi: this.userInfo?.MA_DVI,
            namBcao: nam,
            paggingReq: {
                limit: 10,
                page: 1,
            },
        }
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    if (data.data.content?.length > 0) {
                        check = true;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        //neu chua ton tai thi thuc hien them moi
        if (!check) {
            const response: Report = new Report();
            response.namDnghi = nam;
            response.ttGui = new sendInfo();
            response.ttGui.lstCtietBcaos = [];
            response.ttNhan = new receivedInfo();
            response.ttNhan.lstCtietBcaos = [];
            response.maDvi = this.userInfo?.MA_DVI;
            response.ngayTao = new Date();
            response.dot = 1;
            response.maLoai = 6;
            response.ttGui.trangThai = Utils.TT_BC_1;
            response.ttNhan.trangThai = Utils.TT_BC_1;
            response.ttGui.lstFiles = [];
            response.ttNhan.lstFiles = [];
            response.ttGui.lstCtietBcaos.push({
                ...new TienThua(),
                id: null,
                maHang: Utils.MUA_THOC,
                hangDtqg: 'Thóc',
            })
            if (!this.userService.isChiCuc()) {
                response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: null,
                    maHang: Utils.MUA_GAO,
                    hangDtqg: 'Gạo',
                })
                response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: null,
                    maHang: Utils.MUA_MUOI,
                    hangDtqg: 'Muối',
                })
            }
            if (this.userService.isTongCuc()) {
                response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: null,
                    maHang: Utils.MUA_VTU,
                    hangDtqg: 'Vật tư',
                })
            }
            await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        response.maCapUng = res.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
            this.capVonMuaBanTtthService.themMoiVonMuaBan(response).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        // this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
    }
}
