
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Dtc, Search } from '../bao-cao-thuc-hien-du-toan-chi.constant';

@Component({
    selector: 'app-danh-sach-bao-cao-tu-don-vi-cap-duoi',
    templateUrl: './danh-sach-bao-cao-tu-don-vi-cap-duoi.component.html',
    styleUrls: ['./danh-sach-bao-cao-tu-don-vi-cap-duoi.component.scss'],
})
export class DanhSachBaoCaoTuDonViCapDuoiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Utils = Utils;
    Dtc = Dtc;
    searchFilter: Search = new Search();

    userInfo: any;
    trangThai!: string;
    totalElements = 0;
    totalPages = 0;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];

    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private notification: NzNotificationService,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        const date = new Date();
        // this.searchFilter.namBcao = date.getFullYear();
        // this.searchFilter.thangBcao = date.getMonth();
        this.trangThai = Status.TT_07;
        // this.searchFilter.maLoaiBcao = Dtc.BC_DINH_KY;
        this.searchFilter.loaiTimKiem = '1';
        //lay danh sach ca don vi truc thuoc
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
        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        this.searchFilter.trangThais = this.trangThai ? [this.trangThai] : [Status.TT_07, Status.TT_08, Status.TT_09];
        await this.baoCaoThucHienDuToanChiService.timBaoCao(this.searchFilter.request()).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        congVan: JSON.parse(item.congVan),
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
        this.trangThai = null;
        this.search();
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Dtc.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }

    //download file về máy tính
    async downloadFileCv(doc) {
        this.quanLyVonPhiService.downFile(null, doc);
    }

    // lay ten don vi tao
    getUnitName(dvitao: any) {
        return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
    }
}
