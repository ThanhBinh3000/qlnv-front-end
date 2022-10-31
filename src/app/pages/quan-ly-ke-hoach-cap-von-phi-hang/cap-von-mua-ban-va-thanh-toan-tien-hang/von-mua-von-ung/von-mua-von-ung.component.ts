import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { BCDTC } from 'src/app/Utility/utils';

@Component({
    selector: 'app-von-mua-von-ung',
    templateUrl: './von-mua-von-ung.component.html',
    styleUrls: ['./von-mua-von-ung.component.scss']
})
export class VonMuaVonUngComponent implements OnInit {

    tabSelected = 'danhsach';
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
    }
    selectTab(tab) {
        this.tabSelected = tab;
    }

    changeTab(obj: any) {
        this.data = {
            ...obj,
            preTab: this.tabSelected,
        };
        this.tabSelected = obj?.tabSelected;
    }
}
