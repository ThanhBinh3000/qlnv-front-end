import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { TRANGTHAITIMKIEM, Utils } from "../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { min } from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';

@Component({
    selector: 'app-danh-sach-de-nghi-cap-von',
    templateUrl: './danh-sach-de-nghi-cap-von.component.html',
    styleUrls: ['./danh-sach-de-nghi-cap-von.component.scss'],
})

export class DanhSachDeNghiCapVonComponent implements OnInit {
    lstCTietBCao: any = [];                         // chi tiet nooi dung tim kiem
    totalElements: number = 0;
    totalPages: number = 0;
    trangThais: any = TRANGTHAITIMKIEM;
    userInfo!: any;

    phanLoais: any[] = [
        {
            id: 1,
            tenDm: "Đề nghị cấp vốn mua vật tư",
        },
        {
            id: 2,
            tenDm: "Đề nghị cấp vốn mua lương thực muối",
        }
    ];

    searchFilter = {
        tuNgay: "",
        denNgay: "",
        trangThai: "",
        maDviTao: "",
        phanLoai: 2,
    }

    pages = {
        size: 10,
        page: 1,
    };

    donVis: any = [];                            //don vi se hien thi

    constructor(private router: Router,
        private routerActive: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private userService: UserService,
        private notification: NzNotificationService,
        private danhMucService: DanhMucHDVService,
        private modal: NzModalService,
    ) {
    }

    async ngOnInit() {
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        this.searchFilter.maDviTao = this.userInfo?.dvql;

        //lay danh sach danh muc don vi
        await this.danhMucService.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.spinner.hide();
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
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    // // chuc nang check role
    // onSubmit(mcn: String, lyDoTuChoi: string) {
    //     this.lstCTietBCao.forEach(item => {
    //         if (item.checked) {
    //             const requestGroupButtons = {
    //                 id: item.id,
    //                 maChucNang: mcn,
    //                 lyDotuChoi: lyDoTuChoi,
    //             };
    //             this.spinner.show();
    //             this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(
    //                 (data) => {
    //                     if (data.statusCode == 0) {
    //                         //this.getDetailReport();
    //                         this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
    //                     } else {
    //                         this.notification.error(MESSAGE.ERROR, data?.msg);
    //                     }
    //                 },
    //                 err => {
    //                     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //                 }
    //             );
    //             this.spinner.hide();
    //         }
    //     })
    // }

    // tuChoi(mcn: string) {
    //     const modalTuChoi = this.modal.create({
    //         nzTitle: 'Từ chối',
    //         nzContent: DialogTuChoiComponent,
    //         nzMaskClosable: false,
    //         nzClosable: false,
    //         nzWidth: '900px',
    //         nzFooter: null,
    //         nzComponentParams: {},
    //     });
    //     modalTuChoi.afterClose.subscribe(async (text) => {
    //         if (text) {
    //             this.onSubmit(mcn, text);
    //         }
    //     });
    // }


    // call chi tiet bao cao
    getDetailReport() {
        this.spinner.show();

        let request = {
            maDvi: this.searchFilter.maDviTao,
            ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            namHienHanh: new Date().getFullYear(),
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThai: this.searchFilter.trangThai,
        }

        this.quanLyVonPhiService.timkiemDieuChinh(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.lstCTietBCao = data.data.content;
                    this.totalElements = data.data.totalElements;
                    this.totalPages = data.data.totalPages;

                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.spinner.hide();
    }



    // xoa dong
    deleteById(id: any): void {
        this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
    }

    // // lay ten don vi tao
    // getUnitName() {
    //     return this.donVis.find(item => item.maDvi == this.maDvi)?.tenDvi;
    // }

    // lay ten trang thai
    getStatusName(trangThaiBanGhi: string) {
        const utils = new Utils();
        return utils.getStatusName(trangThaiBanGhi);
    }

    taoMoi(){
        this.router.navigate([
            '/qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/lap-de-nghi-cap-von-mua-luong-thuc-muoi',
          ]);
    }

    redirectChiTieuKeHoachNam() {
        this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
    }

    xoaDieuKien(){
        this.searchFilter.tuNgay = null;
        this.searchFilter.denNgay = null;
        this.searchFilter.trangThai = null;
        this.searchFilter.maDviTao = null;
    }

    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.getDetailReport();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.getDetailReport();
    }

}