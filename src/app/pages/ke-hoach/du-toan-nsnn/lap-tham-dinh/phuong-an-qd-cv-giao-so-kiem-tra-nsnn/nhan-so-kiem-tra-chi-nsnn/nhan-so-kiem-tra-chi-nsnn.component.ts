import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_GIAO, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../../services/quanLyVonPhi.service';
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../lap-tham-dinh.constant';

@Component({
    selector: 'app-nhan-so-kiem-tra-chi-nsnn',
    templateUrl: './nhan-so-kiem-tra-chi-nsnn.component.html',
    styleUrls: ['./nhan-so-kiem-tra-chi-nsnn.component.scss'],
})
export class NhanSoKiemTraChiNsnnComponent implements OnInit {
    //thong tin nguoi dang nhap
    userInfo: any;
    roles: string[] = [];
    //thong tin tim kiem
    searchFilter = {
        namGiao: null,
        tuNgay: null,
        denNgay: null,
        maDviTao: "",
        maDviNhan: "",
        trangThai: "",
        maPa: "",
        maBcao: "",
    };
    newDate = new Date();
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
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private dataSource: DataService,
    ) {
    }

    async ngOnInit() {

        this.searchFilter.denNgay = new Date();
        this.newDate.setMonth(this.newDate.getMonth() - 1);
        this.searchFilter.tuNgay = this.newDate;

        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();
        this.roles = this.userInfo?.roles;
        this.searchFilter.maDviNhan = this.userInfo?.MA_DVI;
        // //lay danh sach danh muc
        // this.danhMuc.dMDonVi().toPromise().then(
        //     data => {
        //         if (data.statusCode == 0) {
        //             this.donVis = data.data;
        //             this.donVis = this.donVis.filter(e => e?.maDviCha == this.userInfo?.dvql);
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        //         }
        //     },
        //     err => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     }
        // );
        this.spinner.hide();

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

    //search list bao cao theo tieu chi
    async onSubmit() {
        if (this.searchFilter.namGiao || this.searchFilter.namGiao === 0) {
            if (this.searchFilter.namGiao >= 3000 || this.searchFilter.namGiao < 1000) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }
        const requestReport = {
            maDviNhan: this.searchFilter.maDviNhan,
            maDviGui: this.searchFilter.maDviTao,
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

    xoaDieuKien() {
        this.searchFilter.namGiao = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.trangThai = null
        this.searchFilter.maPa = null
        this.searchFilter.maBcao = null
    }

    taoMoi() {
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-chi-nsnn/',
        ])
    }

    xemChiTiet(id: string) {
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-chi-nsnn/' + id,
        ])
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    // getUnitName(maDvi: string) {
    //     return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    // }

    close() {
        const obj = {
            tabSelected: 'lapthamdinh',
        }
        this.dataSource.changeData(obj);
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
        ])
    }
}
