import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Tab } from './von-mua-von-ung.constant';

@Component({
    selector: 'app-von-mua-von-ung',
    templateUrl: './von-mua-von-ung.component.html',
    styleUrls: ['./von-mua-von-ung.component.scss']
})
export class VonMuaVonUngComponent implements OnInit {
    Tab = Tab;

    tabSelected!: string;
    data: any;
    tabList: any[] = Tab.TAB_LIST;

    constructor(
        public userService: UserService,
    ) { }

    async ngOnInit() {
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

        this.tabSelected = obj?.tabSelected;
        if (this.tabList.findIndex(e => e.code == this.tabSelected) != -1) {
            this.tabList.forEach(e => {
                e.isSelected = (this.tabSelected == e.code);
            })
        }
    }
}
