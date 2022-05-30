import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_GIAO, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
import { MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN } from '../../../quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.constant';

@Component({
    selector: 'app-tim-kiem-so-kiem-tra-chi-nsnn',
    templateUrl: './tim-kiem-so-kiem-tra-chi-nsnn.component.html',
    styleUrls: ['./tim-kiem-so-kiem-tra-chi-nsnn.component.scss'],
})
export class TimKiemSoKiemTraChiNsnnComponent implements OnInit {
    //thong tin nguoi dang nhap
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        namGiao: null,
        tuNgay: "",
        denNgay: "",
        maDviTao: "",
        maDviNhan: "",
        trangThai: "",
        maPa: "",
        maBcao: "",
    };
    //danh muc
    danhSachBaoCao: any = [];
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_GIAO;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {                           
        size: 10,
        page: 1,
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        private router: Router,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private userService: UserService,
    ) {
    }

    async ngOnInit() {
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName); //get user info
        this.searchFilter.maDviTao = this.userInfo?.dvql;
        //lay danh sach danh muc
        this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                    this.donVis = this.donVis.filter(e => e?.parent?.maDvi == this.userInfo?.dvql);
                    console.log(this.donVis);
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        this.onSubmit();
    }

    //get user info
    async getUserInfo(username: string) {
        await this.userService.getUserInfo(username).toPromise().then(
            (data) => {
                if (data?.statusCode == 0) {
                    this.userInfo = data?.data
                    return data?.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
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
        let requestReport = {
            maDviNhan: this.searchFilter.maDviNhan,
            maDviTao: this.searchFilter.maDviTao,
            maPa: this.searchFilter.maPa,
            namGiao: this.searchFilter.namGiao,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            str: null,
            maBcao: this.searchFilter.maBcao,
            trangThai: this.searchFilter.trangThai,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            }
        };
        this.spinner.show();
        await this.quanLyVonPhiService.timKiemSoKiemTraTranChi(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.danhSachBaoCao = data.data.content;
                    this.danhSachBaoCao.forEach(e => {
                        e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
                    })
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
        this.onSubmit();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.onSubmit();
    }
    // xoaDieuKien() {
    //     this.searchFilter.nam = null
    //     this.searchFilter.tuNgay = null
    //     this.searchFilter.denNgay = null
    //     this.searchFilter.maBaoCao = null
    //     this.searchFilter.donViTao = null
    //     this.searchFilter.loaiBaoCao = null
    //     this.searchFilter.trangThai = null
    // }

    taoMoi() {
        this.router.navigate([
            '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-chi-nsnn/',
        ])
    }

    xemChiTiet(id: string) {
        this.router.navigate([
            '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-chi-nsnn/' + id,
        ])
    }

    getStatusName(trangThai: any){
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }
}
