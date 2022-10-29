import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-bao-cao-thuc-hien-von-phi',
    templateUrl: './bao-cao-thuc-hien-von-phi.component.html',
    styleUrls: ['./bao-cao-thuc-hien-von-phi.component.scss']
})
export class BaoCaoThucHienVonPhiComponent implements OnInit {
    countQuyetDinh: number = 0;
    countChiTieu: number = 0;
    countDieuChinh: number = 0;
    countDuToan: number = 0;
    tabSelected = 'danhsach';

    data: any;
    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
    ) { }

    async ngOnInit() {
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
