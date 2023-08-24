import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Dcdt } from './dieu-chinh-du-toan.constant';

@Component({
    selector: 'app-dieu-chinh-du-toan',
    templateUrl: './dieu-chinh-du-toan.component.html',
})
export class DieuChinhDuToanComponent implements OnInit {
    Dctd = Dcdt;
    tabSelected!: string;
    data: any;
    tabList: any[] = Dcdt.TAB_LIST;

    constructor(
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.tabList.forEach(item => {
            let check = false;
            item.role.forEach(e => {
                if (this.userService.isAccessPermisson(e)) {
                    check = true;
                }
            })
            item.status = check;
            item.isSelected = false;
            if (!this.tabSelected && item.status) {
                this.tabSelected = item.code;
                item.isSelected = true;
            }
        })
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
