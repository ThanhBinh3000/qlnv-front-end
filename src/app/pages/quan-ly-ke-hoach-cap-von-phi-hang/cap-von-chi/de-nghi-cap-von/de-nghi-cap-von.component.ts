import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { TAB_LIST } from './de-nghi-cap-von.constant';

@Component({
    selector: 'app-de-nghi-cap-von',
    templateUrl: './de-nghi-cap-von.component.html',
    styleUrls: ['./de-nghi-cap-von.component.scss']
})
export class DeNghiCapVonComponent implements OnInit {

    tabSelected!: string;
    data: any;
    tabList: any[] = TAB_LIST;

    constructor(
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        if (this.userService.isChiCuc()) {
            this.tabList = this.tabList.filter(e => e.code != 'ds-hopdong' && e.code != 'ds-denghi-donvi-capduoi' && e.code != 'ds-tonghop-denghi-donvi-capduoi');
        } else if (this.userService.isTongCuc()) {
            this.tabList = this.tabList.filter(e => e.code == 'ds-capvon')
        } else {
            this.tabList[1].isSelected = false;
        }
        this.tabSelected = this.tabList[0].code;
        this.tabList[0].isSelected = true;
    }

    selectTab(tab) {
        this.tabSelected = tab;
        this.tabList.forEach(e => {
            e.isSelected = (tab == e.code);
        })
    }

    changeTab(obj: any) {
        if (obj?.preTab) {
            this.data = obj;
        } else {
            this.data = {
                ...obj,
                preTab: this.tabSelected,
            };
        }
        this.tabSelected = obj?.tabSelected;
        if (this.tabList.findIndex(e => e.code == this.tabSelected) != -1) {
            this.tabList.forEach(e => {
                e.isSelected = (this.tabSelected == e.code);
            })
        }
    }
}
