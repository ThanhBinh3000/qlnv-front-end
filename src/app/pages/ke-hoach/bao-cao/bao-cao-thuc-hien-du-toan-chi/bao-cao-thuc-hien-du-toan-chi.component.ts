import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-bao-cao-thuc-hien-du-toan-chi',
    templateUrl: './bao-cao-thuc-hien-du-toan-chi.component.html',
    styleUrls: ['./bao-cao-thuc-hien-du-toan-chi.component.scss']
})
export class BaoCaoThucHienDuToanChiComponent implements OnInit {
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
