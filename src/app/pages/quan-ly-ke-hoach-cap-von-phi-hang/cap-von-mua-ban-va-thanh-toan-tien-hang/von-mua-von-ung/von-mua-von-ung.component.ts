import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCao } from 'src/app/pages/ke-hoach/du-toan-nsnn/dieu-chinh-du-toan/add-bao-cao/add-bao-cao.component';
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
        // if (this.data.baoCao) {
        //     if (this.data?.id || (this.data.baoCao.maLoai == 2 && this.data.baoCao.ttNhan.trangThai == Utils.TT_BC_1)) {
        //         await this.addVonBanGuiDvct(this.data.baoCao.namDnghi);
        //     }
        // }
        // if ((!this.data?.id && this.data.baoCao)) {

        // }
        this.tabSelected = obj?.tabSelected;
        if (this.tabList.findIndex(e => e.code == this.tabSelected) != -1) {
            this.tabList.forEach(e => {
                e.isSelected = (this.tabSelected == e.code);
            })
        }
    }


}
