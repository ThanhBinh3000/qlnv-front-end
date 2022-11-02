import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { BCDTC } from 'src/app/Utility/utils';

@Component({
    selector: 'app-bao-cao-thuc-hien-du-toan-chi',
    templateUrl: './bao-cao-thuc-hien-du-toan-chi.component.html',
    styleUrls: ['./bao-cao-thuc-hien-du-toan-chi.component.scss']
})
export class BaoCaoThucHienDuToanChiComponent implements OnInit {

    tabSelected: string;
    data: any;
    isList = false;
    isAccept = false;
    isCheck = false;
    isSynthetic = false;

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.isList = this.userService.isAccessPermisson(BCDTC.VIEW_REPORT) || this.userService.isAccessPermisson(BCDTC.VIEW_SYNTHETIC_REPORT);
        this.isAccept = this.userService.isAccessPermisson(BCDTC.TIEP_NHAN_REPORT);
        this.isCheck = this.userService.isAccessPermisson(BCDTC.TIEP_NHAN_REPORT);
        this.isSynthetic = this.userService.isAccessPermisson(BCDTC.SYNTHETIC_REPORT);
        if (this.isList) {
            this.tabSelected = 'danhsach';
        } else {
            if (this.isAccept) {
                this.tabSelected = 'capduoi';
            } else {
                if (this.isSynthetic) {
                    this.tabSelected = 'tonghop';
                }
            }
        }
    }
    selectTab(tab) {
        this.tabSelected = tab;
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
    }
}
