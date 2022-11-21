import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { CVNC, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';

@Component({
    selector: 'app-danh-sach-de-nghi-tu-cuc-khu-vuc',
    templateUrl: './danh-sach-de-nghi-tu-cuc-khu-vuc.component.html',
    styleUrls: ['./danh-sach-de-nghi-tu-cuc-khu-vuc.component.scss']
})
export class DanhSachDeNghiTuCucKhuVucComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();

    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        loaiTimKiem: '1',
        trangThai: Utils.TT_BC_7,
        namDn: null,
        tuNgay: "",
        denNgay: "",
        qdChiTieu: "",
        loaiDn: "",
        maDviTao: "",
    };
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_7,
            tenDm: "Lãnh đạo cấp dưới duyệt",
        }
    ];
    donVis: any[] = [];
    loaiDns: any[] = LOAI_DE_NGHI;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }
    //trang thai
    statusNewReport = true;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private danhMuc: DanhMucHDVService,
        private capVonNguonChiService: CapVonNguonChiService,
        private datePipe: DatePipe,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        this.searchFilter.maDviTao = this.userInfo?.MA_DVI;
        this.statusNewReport = !this.userService.isAccessPermisson(CVNC.ADD_SYNTHETIC_CKV);

        this.searchFilter.qdChiTieu = this.data?.qdChiTieu;
        this.searchFilter.namDn = this.data?.namDn;
        //lay danh sach danh muc
        this.danhMuc.dMDviCon().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
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
        let trangThais = [];
        if (this.searchFilter.trangThai) {
            trangThais = [this.searchFilter.trangThai];
        }
        const requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            maDvi: "",
            ngayTaoDen: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            soQdChiTieu: this.searchFilter.qdChiTieu,
            loaiDn: this.searchFilter.loaiDn,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        this.spinner.show();
        await this.capVonNguonChiService.timKiemDeNghi(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = data.data.content;
                    this.dataTable.forEach(e => {
                        e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
                        e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
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
        this.pages.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    //them bao cao moi
    addNewReport() {
        const obj = {
            id: null,
            namDn: this.data.namDn,
            qdChiTieu: this.data.qdChiTieu,
            tabSelected: 'ckv',
        }
        this.dataChange.emit(obj);
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: data.canCuVeGia == Utils.HD_TRUNG_THAU ? 'hopdong' : 'dongia',
        }
        this.dataChange.emit(obj);
    }

    // Tìm kiếm trong bảng
    filterInTable(key: string, value: string, date: boolean) {
        if (value && value != '') {
            this.dataTable = [];
            let temp = [];
            if (this.dataTableAll && this.dataTableAll.length > 0) {
                if (date) {
                    this.dataTableAll.forEach((item) => {
                        if (item[key] && item[key].toString().toLowerCase() === dayjs(value).format('YYYY-MM-DD')) {
                            temp.push(item)
                        }
                    });
                } else {
                    this.dataTableAll.forEach((item) => {
                        if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                            temp.push(item)
                        }
                    });
                }
            }
            this.dataTable = [...this.dataTable, ...temp];
        } else {
            this.dataTable = cloneDeep(this.dataTableAll);
        }
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    back() {
        const obj = {
            tabSelected: 'tonghop',
        }
        this.dataChange.emit(obj);
    }

}
