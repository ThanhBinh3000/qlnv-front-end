import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
    selector: 'app-cap-von-mua-ban-va-thanh-toan-tien-hang',
    templateUrl: './cap-von-mua-ban-va-thanh-toan-tien-hang.component.html',
    styleUrls: ['./cap-von-mua-ban-va-thanh-toan-tien-hang.component.scss'],
})
export class CapVonMuaBanVaThanhToanTienHangComponent implements OnInit {
    isVisibleChangeTab$ = new Subject();
    visibleTab: boolean = true;
    tabSelected: number = 0;
    viewDeNghi = true;
    viewTongHop = true;

    constructor(
        public userService: UserService,
        public globals: Globals
    ) { }

    ngOnInit(): void {
        this.isVisibleChangeTab$.subscribe((value: boolean) => {
            this.visibleTab = value;
        });
        // this.viewDeNghi = this.userService.isAccessPermisson(CVNC.VIEW_DN_MLT) || this.userService.isAccessPermisson(CVNC.VIEW_DN_MVT);
        // if (this.viewDeNghi) {
        //     this.tabSelected = 0;
        // }
        // this.viewTongHop = this.userService.isAccessPermisson(CVNC.VIEW_SYNTHETIC_CKV) || this.userService.isAccessPermisson(CVNC.VIEW_SYNTHETIC_TC);
    }

    selectTab(tab: number) {
        this.tabSelected = tab;
    }
}
