import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { TAB_LIST } from './lap-ke-hoach-va-tham-dinh-du-toan.constant';

@Component({
    selector: 'app-lap-ke-hoach-va-tham-dinh-du-toan',
    templateUrl: './lap-ke-hoach-va-tham-dinh-du-toan.component.html',
    styleUrls: ['./lap-ke-hoach-va-tham-dinh-du-toan.component.scss']
})
export class LapKeHoachVaThamDinhDuToanComponent implements OnInit {

    tabSelected!: string;
    data: any;
    tabList: any[] = TAB_LIST;

    constructor(
        private spinner: NgxSpinnerService,
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
