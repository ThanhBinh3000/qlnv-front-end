import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { BCDTC } from 'src/app/Utility/utils';
import { TAB_LIST } from './von-mua-von-ung.constant';

@Component({
    selector: 'app-von-mua-von-ung',
    templateUrl: './von-mua-von-ung.component.html',
    styleUrls: ['./von-mua-von-ung.component.scss']
})
export class VonMuaVonUngComponent implements OnInit {

    tabSelected!: string;
    data: any;
    isList = false;
    isAccept = false;
    isCheck = false;
    isSynthetic = false;
    isTongCuc = true;
    tabList: any[] = TAB_LIST;

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.isTongCuc = this.userService.isTongCuc();
        this.tabList.forEach(item => {
            item.isSelected = false;
            item.status = this.userService.isAccessPermisson(item.role);
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
