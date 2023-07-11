import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { cloneDeep } from 'lodash';
export const TRANG_THAI_GIAO_DU_TOAN = [
    {
        id: '0',
        tenDm: "Chưa giao",
    },
    {
        id: '1',
        tenDm: "Mới",
    },
    {
        id: '2',
        tenDm: "Đã nhận",
    },
]
@Component({
    selector: 'app-danh-sach-du-toan-giao-tu-cap-tren',
    templateUrl: './danh-sach-du-toan-giao-tu-cap-tren.component.html',
    styleUrls: ['./danh-sach-du-toan-giao-tu-cap-tren.component.scss']
})
export class DanhSachDuToanGiaoTuCapTrenComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    //thong tin nguoi dang nhap
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        loaiTimKiem: '1',
        maPhanGiao: '2',
        maLoai: '1',
        namGiao: null,
        ngayTaoTu: "",
        ngayTaoDen: "",
        maDviTao: "",
        loaiDuAn: null,
        maLoaiDan: [1, 2],
        maDviNhan: "",
        maPa: null,
        trangThais: [],
        paggingReq: {
            limit: 10,
            page: 1
        },
    };
    //danh muc
    danhSachBaoCao: any[] = [];
    dataTableAll: any[] = [];
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_GIAO_DU_TOAN;
    trangThai!: string;
    loaiDuAns: any[] = [
        {
            id: [1],
            tenDm: 'Giao dự toán'
        },
        {
            id: [2],
            tenDm: 'Giao, diều chỉnh dự toán'
        }
    ];
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }
    date: any = new Date()
    roleUser: string;

    filterTable: any = {
        maPa: "",
        ngayTao: "",
        namDtoan: "",
        trangThai: "",
    };

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private danhMuc: DanhMucHDVService,
        private router: Router,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private dataSource: DataService,
    ) {
    }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.searchFilter.maDviNhan = this.userInfo?.MA_DVI;
        //lay danh sach danh muc
        this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data?.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        this.onSubmit()
    }

    redirectThongTinTimKiem() {
        this.router.navigate([
            '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
            0,
        ]);
    }

    redirectSuaThongTinTimKiem(id) {
        this.router.navigate([
            '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
            id,
        ]);
    }

    //search list bao cao theo tieu chi
    async onSubmit() {
        if (this.searchFilter.namGiao || this.searchFilter.namGiao === 0) {
            if (this.searchFilter.namGiao >= 3000 || this.searchFilter.namGiao < 1000) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }
        const searchFilterTemp = Object.assign({}, this.searchFilter);
        searchFilterTemp.trangThais = [];
        searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
        searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
        if (this.trangThai) {
            searchFilterTemp.trangThais.push(this.trangThai)
        } else {
            searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
        }
        this.spinner.show();
        await this.giaoDuToanChiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.danhSachBaoCao = [];
                    data.data.content.forEach(s => {
                        this.danhSachBaoCao.push({
                            ...s
                        })
                    })
                    this.danhSachBaoCao.forEach(e => {
                        e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
                        e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
                        e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                        e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
                    })
                    this.dataTableAll = cloneDeep(this.danhSachBaoCao);
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
        this.onSubmit();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.searchFilter.paggingReq.limit = size;
        this.onSubmit();
    }

    xemChiTiet(id: string) {
        const obj = {
            id: id,
            tabSelected: 'chiTietDuToanCapTren',
        }
        this.dataChange.emit(obj);
    }

    getStatusName(trangThai: any) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    xoaDieuKien() {
        this.searchFilter.namGiao = null;
        this.searchFilter.ngayTaoTu = null;
        this.searchFilter.ngayTaoDen = null;
        this.searchFilter.loaiDuAn = null;
        this.searchFilter.maLoaiDan = [1, 2];
        this.trangThai = null;
        this.searchFilter.maPa = null;
        this.onSubmit();
    }

    close() {
        const obj = {
            tabSelected: 'giaodutoan',
        }
        this.dataSource.changeData(obj);
    }

    filterInTable(key: string, value: string, isDate: boolean) {
        if (value && value != '') {
            this.danhSachBaoCao = [];
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
            this.danhSachBaoCao = [...this.danhSachBaoCao, ...temp];
        } else {
            this.danhSachBaoCao = cloneDeep(this.dataTableAll);
        }
    };

}
