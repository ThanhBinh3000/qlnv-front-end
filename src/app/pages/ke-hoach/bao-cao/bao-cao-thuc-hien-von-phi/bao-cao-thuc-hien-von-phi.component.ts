import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { BCVP } from 'src/app/Utility/utils';

@Component({
    selector: 'app-bao-cao-thuc-hien-von-phi',
    templateUrl: './bao-cao-thuc-hien-von-phi.component.html',
    styleUrls: ['./bao-cao-thuc-hien-von-phi.component.scss']
})
export class BaoCaoThucHienVonPhiComponent implements OnInit {

    tabSelected: string;
    data: any;
    isList = false;
    isAccept = false;
    isCheck = false;
    isSynthetic = false;
    isExploit = false;

    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.isList = this.userService.isAccessPermisson(BCVP.VIEW_REPORT) || this.userService.isAccessPermisson(BCVP.VIEW_SYNTHETIC_REPORT);
        this.isAccept = this.userService.isAccessPermisson(BCVP.TIEP_NHAN_REPORT);
        this.isCheck = this.userService.isAccessPermisson(BCVP.TIEP_NHAN_REPORT);
        this.isSynthetic = this.userService.isAccessPermisson(BCVP.SYNTHETIC_REPORT);
        this.isExploit = this.userService.isAccessPermisson(BCVP.EXPORT_EXCEL_REPORT);
        if (this.isList) {
            this.tabSelected = 'danhsach';
        } else {
            if (this.isAccept) {
                this.tabSelected = 'capduoi';
            } else {
                if (this.isSynthetic) {
                    this.tabSelected = 'tonghop';
                } else {
                    if (this.isExploit) {
                        this.tabSelected = 'khaithac'
                    }
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
