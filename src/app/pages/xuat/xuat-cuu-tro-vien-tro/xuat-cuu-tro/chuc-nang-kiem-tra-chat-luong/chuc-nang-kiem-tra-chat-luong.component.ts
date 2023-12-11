import { ChucNangKiemTraComponent } from './../../../dau-gia/kiem-tra-chat-luong/main/chuc-nang-kiem-tra.component';
import { Component, Input, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
@Component({
    selector: 'app-chuc-nang-kiem-tra-chat-luong',
    templateUrl: './chuc-nang-kiem-tra-chat-luong.component.html',
    styleUrls: ['./chuc-nang-kiem-tra-chat-luong.component.scss'],
})
export class ChucNangKiemTraChatLuongComponent implements OnInit {
    loaiVthhSelected: string;
    tabs: any[] = [];

    constructor(
        private danhMucService: DanhMucService,
        public globals: Globals,
    ) { }

    ngOnInit() {
        this.loaiVTHHGetAll();
    }

    async loaiVTHHGetAll() {
        this.tabs = [];
        let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
        if (res.msg == MESSAGE.SUCCESS) {
            if (res.data && res.data.length > 0) {
                res.data.forEach((element) => {
                    element.count = 0;
                    this.tabs.push(element);
                });
                this.selectTab(this.tabs[0].ma);
            }
        }
    }

    selectTab(loaiVthh) {
        this.loaiVthhSelected = loaiVthh;
    }
}
