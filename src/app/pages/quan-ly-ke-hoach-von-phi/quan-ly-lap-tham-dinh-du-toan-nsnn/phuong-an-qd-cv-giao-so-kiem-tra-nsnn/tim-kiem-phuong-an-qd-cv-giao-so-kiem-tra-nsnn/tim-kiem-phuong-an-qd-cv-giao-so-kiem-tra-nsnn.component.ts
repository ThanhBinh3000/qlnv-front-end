import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzResultUnauthorizedComponent } from 'ng-zorro-antd/result/partial/unauthorized';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as fileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
import { TRANGTHAIBAOCAO } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}
@Component({
    selector: 'app-tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn',
    templateUrl: './tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn.component.html',
    styleUrls: ['./tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn.component.scss'],
})
export class TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnComponent implements OnInit {
    //thong tin dang nhap
    userInfo: any;
    loai: any;
    //thong tin tim kiem
    searchFilter = {
        namPa: null,
        tuNgay: "",
        denNgay: "",
        donViTao: "",
        loai: null,
        trangThai: "",
        maBaoCao: "",
        maPa: "",
    };
    //danh muc
    danhSachBaoCao: any = [];
    donViTaos: any[] = [];
    donVis: any[] = [];
    trangThais: any = TRANG_THAI_TIM_KIEM;
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }//
    status: boolean;
    statusBtnBcao: boolean = true;

    fileDetail: NzUploadFile;

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        private router: Router,
        private routerActive: ActivatedRoute,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private userService: UserService,
    ) {
    }

    async ngOnInit() {
        this.loai = this.routerActive.snapshot.paramMap.get('loai');
        if (this.loai == "0") {
            this.status = true;
        } else {
            this.status = false;
        }
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName); //get user info
        this.searchFilter.donViTao = this.userInfo?.dvql;
        //lay danh sach danh muc
        this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                    this.donViTaos = this.donVis.filter(e => e.parent?.maDvi === this.userInfo?.dvql);
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

    //download file về máy tính
    async downloadFileCv(soQdCv: ItemCongVan) {
        if (soQdCv?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(soQdCv?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, soQdCv?.fileName);
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            let file: any = this.fileDetail;
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
    }

    //search list bao cao theo tieu chi
    async onSubmit() {
        this.statusBtnBcao = true;
        if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
            if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
                return;
            }
        }
        let requestReport = {
            maDviTao: this.searchFilter.donViTao,
            maPa: this.searchFilter.maPa,
            namPa: this.searchFilter.namPa,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            maBaoCao: this.searchFilter.maBaoCao,
            str: null,
            trangThai: this.searchFilter.trangThai,
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            }
        };
        this.spinner.show();
        await this.quanLyVonPhiService.timKiemPhuongAn(requestReport).toPromise().then(
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

    async taoMoi() {
        this.statusBtnBcao = false;
        if (this.loai == "0" && !this.searchFilter.maBaoCao){
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.loai == "0"){
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-tran-chi-tu-btc/0/' +this.searchFilter.maBaoCao,
            ]);
        } else {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn',
            ]);
        }
    }

    xemChiTiet(id: string) {
        this.router.navigate([
            '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + id,
        ])
    }

    async checkMaBcao() {
        let requestReport = {
            loaiTimKiem: "0",
            maBcao: this.searchFilter.maBaoCao,
            maDvi: this.searchFilter.donViTao,
            namBcao: null,
            ngayTaoDen: "",
            ngayTaoTu: "",
            paggingReq: {
                limit: 10,
                page: 1,
            },
            trangThais: [],
        };
        await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    return !data.data.empty;
                } else {
                    return false;
                }
            },
            (err) => {
                return false;
            }
        );
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

}
