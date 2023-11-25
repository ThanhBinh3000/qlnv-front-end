import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Cvmb, Search } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { Tab } from '../von-mua-von-ung.constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-danh-sach-tien-thua-tu-dvcd',
    templateUrl: './danh-sach-tien-thua-tu-dvcd.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss']
})
export class DanhSachTienThuaTuDvcdComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    Cvmb = Cvmb;
    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter: Search = new Search();
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];
    maDvi: string;
    synthStatus: boolean = false;
    //phan trang
    totalElements = 0;
    totalPages = 0;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        public userService: UserService,
        private modal: NzModalService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        // this.searchFilter.ngayTaoDen = new Date();
        // const newDate = new Date();
        // newDate.setMonth(newDate.getMonth() - 1);
        // this.searchFilter.ngayTaoTu = newDate;
        this.searchFilter.maDvi = this.userInfo?.MA_DVI;
        const request = {
            maDviCha: this.userInfo.MA_DVI,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        this.synthStatus = this.userService.isAccessPermisson(Roles.CVMB.SYNTH_VB)
        this.searchFilter.loaiTimKiem = '1';
        this.searchFilter.trangThai = Status.TT_07;
        this.searchFilter.maLoai = Cvmb.TIEN_THUA;
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(this.searchFilter.request()).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                        })
                    })
                    this.dataTableAll = cloneDeep(this.dataTable);
                    this.totalElements = data.data.totalElements;
                    this.totalPages = data.data.totalPages;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
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
        this.maDvi = null;
        this.searchFilter.maDvi = this.userInfo.MA_DVI;
        this.searchFilter.loaiTimKiem = '1';
        this.search();
    }

    changeModel() {
        if (this.maDvi) {
            this.searchFilter.loaiTimKiem = '0';
            this.searchFilter.maDvi = this.maDvi;
        } else {
            this.searchFilter.loaiTimKiem = '1';
            this.searchFilter.maDvi = this.userInfo.MA_DVI;
        }
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    //xem chi tiet bao cao
    async viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Tab.TIEN_THUA,
        }
        this.dataChange.emit(obj);
    }
}
