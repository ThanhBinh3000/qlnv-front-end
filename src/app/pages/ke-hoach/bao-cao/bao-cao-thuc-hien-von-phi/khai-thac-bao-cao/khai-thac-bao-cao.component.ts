
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Search, Vp } from '../bao-cao-thuc-hien-von-phi.constant';

@Component({
    selector: 'app-khai-thac-bao-cao',
    templateUrl: './khai-thac-bao-cao.component.html',
    // styleUrls: ['./khai-thac-bao-cao.component.scss'],
})
export class KhaiThacBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Vp = Vp;
    Utils = Utils;
    searchFilter: Search = new Search();
    userInfo: any;
    trangThai = Status.TT_07;
    totalElements = 0;
    totalPages = 0;
    dataTable: any[] = [];
    dataTableAll: any[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private notification: NzNotificationService,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        if (this.userService.isTongCuc()) {
            this.trangThai = Status.TT_07;
        } else {
            this.trangThai = Status.TT_09;
        }
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        this.searchFilter.trangThais = this.trangThai ? [this.trangThai] : [Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_07, Status.TT_08, Status.TT_09];
        await this.baoCaoThucHienVonPhiService.timBaoCao(this.searchFilter.request()).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                    })
                })
                this.dataTableAll = cloneDeep(this.dataTable);
                this.totalElements = res.data.totalElements;
                this.totalPages = res.data.totalPages;
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.spinner.hide();
    }

    //doi so trang
    onPageIndexChange(page) {
        this.searchFilter.paggingReq.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.searchFilter.paggingReq.limit = size;
        this.search();
    }

    //reset tim kiem
    clearFilter() {
        this.searchFilter.clear();
        this.search();
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Vp.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }
}
