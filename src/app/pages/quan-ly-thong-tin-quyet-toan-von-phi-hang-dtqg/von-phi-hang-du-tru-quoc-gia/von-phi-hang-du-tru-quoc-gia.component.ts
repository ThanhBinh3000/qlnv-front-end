import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
    selector: 'app-von-phi-hang-du-tru-quoc-gia',
    templateUrl: './von-phi-hang-du-tru-quoc-gia.component.html',
})
export class VonPhiHangDuTruQuocGiaComponent implements OnInit {
    isVisibleChangeTab$ = new Subject();
    visibleTab: boolean = true;
    tabSelected: string = 'baoCaoQuyetToan';
    viewBaoCaoQuyetToan = true;
    viewDieuChinhSauQuyetToan = true;
    viewTongHopPheDuyet = true;
    data: any;
    userInfo: any;
    constructor(
        public userService: UserService,
        public globals: Globals
    ) { }

    ngOnInit(): void {
        this.userInfo = this.userService.getUserLogin();

        this.isVisibleChangeTab$.subscribe((value: boolean) => {
            this.visibleTab = value;
        });
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
