import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Cvnc } from './de-nghi-cap-von-cac-don-vi.constant';

@Component({
    selector: 'app-de-nghi-cap-von-cac-don-vi',
    templateUrl: './de-nghi-cap-von-cac-don-vi.component.html',
    styleUrls: ['./de-nghi-cap-von-cac-don-vi.component.scss']
})
export class DeNghiCapVonCacDonViComponent implements OnInit {
    Cvnc = Cvnc;
    tabSelected!: string;
    data: any;
    tabList: any[] = Cvnc.TAB_LIST;
    userInfo: any;
    donVis: any[];

    constructor(
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();

        this.tabList.forEach(item => {
            item.isSelected = false;
            item.status = this.userService.isAccessPermisson(item.role);
            if (!this.tabSelected && item.status) {
                this.tabSelected = item.code;
                item.isSelected = true;
            }
        })
        this.data = {
            tabSelected: this.tabSelected,
            // unit: this.donVis,
        }
    }

    selectTab(tab) {
        this.tabSelected = tab;
        this.tabList.forEach(e => {
            e.isSelected = (tab == e.code);
        })
        this.data = {
            tabSelected: this.tabSelected,
            // unit: this.donVis,
        }
    }

    async changeTab(obj: any) {
        this.data = {
            ...obj,
            // unit: this.donVis,
            preTab: this.tabSelected,
        };
        // if (!this.data?.id && this.data.baoCao) {
        //     await this.addVonBanGuiDvct(this.data.baoCao.namDnghi, this.data.baoCao.loaiDnghi, this.data.baoCao.canCuVeGia);
        // }
        this.tabSelected = obj?.tabSelected;
        if (this.tabList.findIndex(e => e.code == this.tabSelected) != -1) {
            this.tabList.forEach(e => {
                e.isSelected = (this.tabSelected == e.code);
            })
        }
    }

}
