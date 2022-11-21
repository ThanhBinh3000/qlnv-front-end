import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { STORAGE_KEY } from 'src/app/constants/config';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { BCDTC } from 'src/app/Utility/utils';
import { TAB_LIST } from './bao-cao-thuc-hien-du-toan-chi.constant';

@Component({
    selector: 'app-bao-cao-thuc-hien-du-toan-chi',
    templateUrl: './bao-cao-thuc-hien-du-toan-chi.component.html',
    styleUrls: ['./bao-cao-thuc-hien-du-toan-chi.component.scss']
})
export class BaoCaoThucHienDuToanChiComponent implements OnInit {

    tabSelected!: string;
    data: any;
    tabList: any[] = TAB_LIST;
    isList = false;
    isAccept = false;
    isCheck = false;
    isSynthetic = false;

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private storageService: StorageService
    ) { }

    async ngOnInit() {
        let listPermission = [];
        var jsonPermission = this.storageService.get(STORAGE_KEY.PERMISSION);
        if (jsonPermission && jsonPermission.length > 0) {
            listPermission = JSON.parse(jsonPermission);
        }
        console.log(listPermission)
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
