
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
    selector: 'app-danh-sach-bao-cao-tu-don-vi-cap-duoi',
    templateUrl: './danh-sach-bao-cao-tu-don-vi-cap-duoi.component.html',
    styleUrls: ['./danh-sach-bao-cao-tu-don-vi-cap-duoi.component.scss'],
})
export class DanhSachBaoCaoTuDonViCapDuoiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Utils = Utils;

    searchFilter = {
        loaiTimKiem: '1',
        nam: null,
        tuNgay: null,
        denNgay: null,
        maBaoCao: "",
        donViTao: "",
        trangThai: Utils.TT_BC_7,
    };

    userInfo: any;
    donVis: any[] = [];
    dataTable: any[] = [];
    dataTableAll: any[] = [];

    pages = {
        size: 10,
        page: 1,
    }
    totalElements = 0;
    totalPages = 0;
    allChecked = false;

    constructor(
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.searchFilter.denNgay = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.tuNgay = newDate;
        //lay danh sach ca don vi truc thuoc
        await this.danhMuc.dMDviCon().toPromise().then(
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
        let trangThais = [];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        } else {
            trangThais = [Status.TT_07, Status.TT_08, Status.TT_09];
        }
        const requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            maBcaos: !this.searchFilter.maBaoCao ? [] : [this.searchFilter.maBaoCao],
            maDvi: this.searchFilter.donViTao,
            namBcao: this.searchFilter.nam,
            ngayTaoDen: Utils.fmtDate(this.searchFilter.denNgay),
            ngayTaoTu: Utils.fmtDate(this.searchFilter.tuNgay),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(res => {
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
        this.pages.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    }

    //reset tim kiem
    clearFilter() {
        this.searchFilter.nam = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.maBaoCao = null
        this.searchFilter.trangThai = null
        this.searchFilter.donViTao = null
        this.search();
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    //them moi bao cao
    addNewReport() {

    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'baocao',
        }
        this.dataChange.emit(obj);
    }

    //download file về máy tính
    async downloadFileCv(fileUrl, fileName) {
        await this.quanLyVonPhiService.downloadFile(fileUrl).toPromise().then(
            (data) => {
                fileSaver.saveAs(data, fileName);
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }
}
