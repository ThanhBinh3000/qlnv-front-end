import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { TAB_LIST } from './von-ban.constant';

@Component({
    selector: 'app-von-ban',
    templateUrl: './von-ban.component.html',
    styleUrls: ['./von-ban.component.scss']
})
export class VonBanComponent implements OnInit {

    tabSelected!: string;
    data: any;
    tabList: any[] = TAB_LIST;
    userInfo: any;
    donVis: any[];

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();

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
            // unit: this.donVis,
        }
    }

    selectTab(tab) {
        this.tabSelected = tab;
        this.tabList.forEach(e => {
            e.isSelected = (tab == e.code);
        })
        this.data = {
            tabSelected: this.tabSelected,
            // unit: this.donVis,
        }
    }

    async changeTab(obj: any) {
        this.data = {
            ...obj,
            // unit: this.donVis,
            preTab: this.tabSelected,
        };
        // if (!this.data?.id && this.data.baoCao) {
        //     await this.addVonBanGuiDvct(this.data.baoCao.namDnghi, this.data.baoCao.loaiDnghi, this.data.baoCao.canCuVeGia);
        // }
        this.tabSelected = obj?.tabSelected;
        if (this.tabList.findIndex(e => e.code == this.tabSelected) != -1) {
            this.tabList.forEach(e => {
                e.isSelected = (this.tabSelected == e.code);
            })
        }
    }

    //lay danh sach don vi cap duoi cua don vi hien tai
    async getChildUnit() {
        this.spinner.show();
        const request = {
            maDviCha: this.userInfo?.DON_VI.maDviCha,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (this.userService.isCuc()) {
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

    //kiem tra ban ghi nop tien von ban hang len don vi cap tren da ton tai chua, neu chua thi thuc hien them moi
    // async addVonBanGuiDvct(nam: number, loai: string, canCu: string) {
    //     await this.getChildUnit();
    //     let check = false // ban ghi chua ton tai
    //     //kiem tra ban ghi da ton tai chua
    //     const request = {
    //         loaiTimKiem: '0',
    //         maLoai: 1,
    //         maDvi: this.userInfo?.DON_VI?.maDviCha,
    //         loaiDnghi: loai,
    //         canCuVeGia: canCu,
    //         namDnghi: nam,
    //         paggingReq: {
    //             limit: 10,
    //             page: 1,
    //         },
    //     }
    //     await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 if (data.data.content?.length > 0) {
    //                     check = true;
    //                 }
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         }
    //     );
    //     //neu chua ton tai thi thuc hien them moi
    //     if (!check) {
    //         const response: Report = new Report();
    //         response.canCuVeGia = canCu;
    //         response.loaiDnghi = loai;
    //         response.namDnghi = nam;
    //         response.ttGui = new sendInfo();
    //         response.ttGui.lstCtietBcaos = [];
    //         response.ttNhan = new receivedInfo();
    //         response.ttNhan.lstCtietBcaos = [];
    //         response.maDvi = this.userInfo?.DON_VI?.maDviCha;
    //         response.ngayTao = new Date();
    //         response.dot = 1;
    //         response.maLoai = 1;
    //         response.ttGui.trangThai = Utils.TT_BC_1;
    //         response.ttNhan.trangThai = Utils.TT_BC_1;
    //         response.ttGui.lstFiles = [];
    //         response.ttNhan.lstFiles = [];
    //         this.donVis.forEach(item => {
    //             response.ttGui.lstCtietBcaos.push({
    //                 ...new ThanhToan(),
    //                 id: null,
    //                 maDvi: item.maDvi,
    //                 tenDvi: item.tenDvi,
    //             })
    //         })
    //         await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
    //             (res) => {
    //                 if (res.statusCode == 0) {
    //                     response.maCapUng = res.data;
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, res?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //             },
    //         );
    //         this.capVonMuaBanTtthService.themMoiVonMuaBan(response).toPromise().then(
    //             async (data) => {
    //                 if (data.statusCode == 0) {
    //                     // this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //             },
    //         );
    //     }
    // }
}
