import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Dcdt } from '../dieu-chinh-du-toan.constant';
import * as fileSaver from 'file-saver';

@Component({
    selector: 'app-danh-sach-bao-cao-tu-don-vi-cap-duoi',
    templateUrl: './danh-sach-bao-cao-tu-don-vi-cap-duoi.component.html',
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
        trangThai: Status.TT_07,
    };

    userInfo: any;
    // trangThais: any[] = TRANG_THAI_GUI_DVCT;
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
        private dieuChinhService: DieuChinhService,
        private notification: NzNotificationService,
        private danhMuc: DanhMucHDVService,
        public userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
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
            trangThais = [Status.TT_07, Status.TT_08, Status.TT_09]
        }
        const requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            maBcao: !this.searchFilter.maBaoCao ? null : this.searchFilter.maBaoCao,
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
        await this.dieuChinhService.timKiemDieuChinh(requestReport).toPromise().then(res => {
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

    // getStatusName(trangThai: string) {
    //     return this.trangThais.find(e => e.id == trangThai)?.ten;
    // }

    ///xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: Dcdt.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }

    // Tìm kiếm trong bảng
    // filterInTable(key: string, value: string, isDate: boolean) {
    //     if (value && value != '') {
    //         this.dataTable = [];
    //         let temp = [];
    //         if (this.dataTableAll && this.dataTableAll.length > 0) {
    //             if (isDate) {
    //                 value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
    //             }
    //             this.dataTableAll.forEach((item) => {
    //                 if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
    //                     temp.push(item)
    //                 }
    //             });
    //         }
    //         this.dataTable = [...this.dataTable, ...temp];
    //     } else {
    //         this.dataTable = cloneDeep(this.dataTableAll);
    //     }
    // }

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
