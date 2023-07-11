import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TAB_LIST } from './giao-du-toan.constant';

@Component({
    selector: 'app-giao-du-toan',
    templateUrl: './giao-du-toan.component.html',
    styleUrls: ['./giao-du-toan.component.scss']
})
export class GiaoDuToanComponent implements OnInit {
    tabSelected: string;
    data: any;
    tabList: any[] = TAB_LIST;
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
    };


    selectTab(tab) {
        this.tabSelected = tab;
        this.tabList.forEach(e => {
            e.isSelected = (tab == e.code);
        })
    }

    changeTab(obj: any) {
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
