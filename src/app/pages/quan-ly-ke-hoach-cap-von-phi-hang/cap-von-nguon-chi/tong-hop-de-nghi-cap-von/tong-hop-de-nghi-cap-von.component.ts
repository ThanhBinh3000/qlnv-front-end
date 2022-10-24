import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
    selector: 'app-tong-hop-de-nghi-cap-von',
    templateUrl: './tong-hop-de-nghi-cap-von.component.html',
    styleUrls: ['./tong-hop-de-nghi-cap-von.component.scss']
})
export class TongHopDeNghiCapVonComponent implements OnInit {

    tabSelected = 'tonghop';            //chọn tab để hiển thị
    id: string;                          //id cua ban ghi duoc chon
    data: any;

    constructor(
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
    }

    changeTab(obj: any) {
        this.data = obj;
        this.tabSelected = obj.tabSelected;
    }
}
