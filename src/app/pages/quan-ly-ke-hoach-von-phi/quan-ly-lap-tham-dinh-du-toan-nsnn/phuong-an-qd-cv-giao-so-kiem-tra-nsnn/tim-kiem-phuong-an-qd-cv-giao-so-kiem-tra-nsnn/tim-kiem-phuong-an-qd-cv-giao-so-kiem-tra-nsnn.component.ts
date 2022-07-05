import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';

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
        loaiTimKiem: "",
        namPa: null,
        tuNgay: null,
        denNgay: null,
        donViTao: "",
        trangThai: "",
        maBaoCao: "",
        maPa: "",
        maPaBtc: "",
    };
    newDate = new Date();
    //danh muc
    danhSachBaoCao: any = [];
    donViTaos: any[] = [];
    donVis: any[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_2,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_3,
            tenDm: "Trưởng BP từ chối",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Trưởng BP chấp nhận",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Utils.TT_BC_6,
            tenDm: "Lãnh đạo chấp nhận",
        },
    ];
    //phan trang
    totalElements = 0;
    totalPages = 0;
    pages = {
        size: 10,
        page: 1,
    }//
    status: boolean;
    statusBtnBcao: boolean = true;
    statusTaoMoi: boolean = true;

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
        private location: Location,
    ) {
    }

    async ngOnInit() {
        this.loai = this.routerActive.snapshot.paramMap.get('loai');
        if (this.loai == "0") {
            this.status = true;
            this.searchFilter.loaiTimKiem = "1";
        } else {
            this.status = false;
            this.searchFilter.loaiTimKiem = "0";
        }
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName); //get user info
        this.searchFilter.donViTao = this.userInfo?.dvql;

        this.searchFilter.denNgay = new Date();
        this.newDate.setMonth(this.newDate.getMonth() - 1);
        this.searchFilter.tuNgay = this.newDate;
        //lay danh sach danh muc
        this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                    this.donViTaos = this.donVis.filter(e => e?.maDviCHa === this.userInfo?.dvql);
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)){
			this.statusTaoMoi = false;
		}
        
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
        let lstTrangThai = [];
        if (this.searchFilter.trangThai){
            lstTrangThai = [this.searchFilter.trangThai];
        }
        let requestReport = {
            loaiTimKiem: this.searchFilter.loaiTimKiem,
            maDviTao: this.searchFilter.donViTao,
            maPa: this.searchFilter.maPa,
            maPaBtc: this.searchFilter.maPaBtc,
            namPa: this.searchFilter.namPa,
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            maBcao: this.searchFilter.maBaoCao,
            str: null,
            trangThais: lstTrangThai,
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

    xoaDieuKien(){
        this.searchFilter.namPa = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.trangThai = null
        this.searchFilter.maBaoCao = null
        this.searchFilter.maPa = null
        this.searchFilter.maPaBtc = null
    }

    async taoMoi() {
        this.statusBtnBcao = false;
        if (this.loai == "0" && !this.searchFilter.maBaoCao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.loai == "0") {
            let checkBcao = false;
            let requestReport = {
                loaiTimKiem: "0",
                maBcao: this.searchFilter.maBaoCao,
                maDvi: this.searchFilter.donViTao,
                namBcao: "",
                ngayTaoDen: "",
                ngayTaoTu: "",
                paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
                },
                trangThais: [Utils.TT_BC_7],
            };
            this.spinner.show();
            await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        if (data.data.content.length > 0) {
                            checkBcao = true;
                        }
                    } else {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            );
            this.spinner.hide();
            if (!checkBcao){
                this.notification.warning(MESSAGE.WARNING, "Không tìm thấy mã báo cáo: " + this.searchFilter.maBaoCao);
                return;
            }
        }
        if (this.loai == "0") {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-tran-chi-tu-btc/0/' + this.searchFilter.maBaoCao,
            ]);
        } else {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn',
            ]);
        }
    }

    xemChiTiet(id: string) {
        if (this.loai == "0") {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-tran-chi-tu-btc/' + id,
            ])
        } else {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + id,
            ])
        }
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

    checkDeleteReport(item: any): boolean {
        var check: boolean = false;
        if (this.userInfo?.username == item.nguoiTao) {
            if (this.status) {
                check = true;
            } else {
                if (item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) {
                    check = true;
                }
            }
        }
        return check;
    }

    xoaPA(id: any) {
        const request: string[] = [id];
        this.quanLyVonPhiService.xoaPhuongAn(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                    this.onSubmit();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    close() {
        this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn',
		])
    }

}
