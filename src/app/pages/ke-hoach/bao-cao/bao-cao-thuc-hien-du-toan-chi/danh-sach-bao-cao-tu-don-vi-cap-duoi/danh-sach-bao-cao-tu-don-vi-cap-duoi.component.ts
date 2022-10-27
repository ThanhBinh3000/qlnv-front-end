
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as fileSaver from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'app-danh-sach-bao-cao-tu-don-vi-cap-duoi',
    templateUrl: './danh-sach-bao-cao-tu-don-vi-cap-duoi.component.html',
    styleUrls: ['./danh-sach-bao-cao-tu-don-vi-cap-duoi.component.scss'],
})
export class DanhSachBaoCaoTuDonViCapDuoiComponent implements OnInit {
    searchFilter = {
        ngayTaoTu: '',
        ngayTaoDen: '',
        trangThais: [],
        maBcao: '',
        maLoaiBcao: '',
        namBcao: null,
        thangBcao: null,
        dotBcao: '',
        paggingReq: {
            limit: 10,
            page: 1
        },
        str: '',
        maDvi: '',
        maPhanBcao: '0',
        loaiTimKiem: '1',
    };

    userInfo: any;
    trangThais: any = TRANG_THAI_GUI_DVCT;
    trangThai!: string;
    baoCaos: any = LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI;
    totalElements = 0;
    totalPages = 0;
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];

    filterTable: any = {
        soQd: '',
        ngayKy: '',
        namKeHoach: '',
        trichYeu: '',
        tenTrangThai: '',
    };

    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMuc: DanhMucHDVService,
        private datePipe: DatePipe,
        public userService: UserService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        const date = new Date();
        this.searchFilter.namBcao = date.getFullYear();
        this.searchFilter.thangBcao = date.getMonth();
        this.trangThai = '7';
        this.searchFilter.maLoaiBcao = '526';
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
        const searchFilterTemp = Object.assign({}, this.searchFilter);
        searchFilterTemp.trangThais = [];
        searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
        searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
        if (this.trangThai) {
            searchFilterTemp.trangThais.push(this.trangThai)
        } else {
            searchFilterTemp.trangThais = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
        }
        await this.baoCaoThucHienDuToanChiService.timBaoCao(searchFilterTemp).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        congVan: JSON.parse(item.congVan),
                        ngayDuyet: this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR),
                        ngayTao: this.datePipe.transform(item.ngayTao, Utils.FORMAT_DATE_STR),
                        ngayTrinh: this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR),
                        ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                        ngayTraKq: this.datePipe.transform(item.ngayTraKq, Utils.FORMAT_DATE_STR),
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
        this.searchFilter.maBcao = null
        this.searchFilter.namBcao = null
        this.searchFilter.thangBcao = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.maDvi = null
        this.searchFilter.maLoaiBcao = null
        this.trangThai = null
        this.search();
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.ten;
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {

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

    // lay ten don vi tao
    getUnitName(dvitao: any) {
        return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
    }

    // Tìm kiếm trong bảng
    filterInTable(key: string, value: string, isDate: boolean) {
        if (value && value != '') {
            this.dataTable = [];
            let temp = [];
            if (this.dataTableAll && this.dataTableAll.length > 0) {
                if (isDate) {
                    value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
                }
                this.dataTableAll.forEach((item) => {
                    if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                        temp.push(item)
                    }
                });
            }
            this.dataTable = [...this.dataTable, ...temp];
        } else {
            this.dataTable = cloneDeep(this.dataTableAll);
        }
    }
}
