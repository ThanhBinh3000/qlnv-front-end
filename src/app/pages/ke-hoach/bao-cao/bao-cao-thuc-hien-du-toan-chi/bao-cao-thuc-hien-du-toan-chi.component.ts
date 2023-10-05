import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Dtc } from './bao-cao-thuc-hien-du-toan-chi.constant';

@Component({
    selector: 'app-bao-cao-thuc-hien-du-toan-chi',
    templateUrl: './bao-cao-thuc-hien-du-toan-chi.component.html',
})
export class BaoCaoThucHienDuToanChiComponent implements OnInit {
    Dtc = Dtc;
    tabSelected!: string;
    data: any;
    tabList: any[] = Dtc.TAB_LIST;

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
