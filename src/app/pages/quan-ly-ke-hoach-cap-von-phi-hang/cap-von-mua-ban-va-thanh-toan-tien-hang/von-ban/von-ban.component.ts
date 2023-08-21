import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Tab } from './von-ban.constant';

@Component({
    selector: 'app-von-ban',
    templateUrl: './von-ban.component.html',
    styleUrls: ['./von-ban.component.scss']
})
export class VonBanComponent implements OnInit {
    Tab = Tab;
    tabSelected!: string;
    data: any;
    tabList: any[] = Tab.TAB_LIST;
    userInfo: any;
    donVis: any[];

    constructor(
        public userService: UserService,
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

}
