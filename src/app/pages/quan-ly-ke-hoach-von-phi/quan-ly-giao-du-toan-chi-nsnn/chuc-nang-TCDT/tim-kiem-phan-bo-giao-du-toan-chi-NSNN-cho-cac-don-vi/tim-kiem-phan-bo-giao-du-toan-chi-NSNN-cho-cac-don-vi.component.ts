import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzResultUnauthorizedComponent } from 'ng-zorro-antd/result/partial/unauthorized';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
// import { TRANGTHAIBAOCAO } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
@Component({
  selector: 'app-tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViComponent implements OnInit {
    //thong tin dang nhap
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        namPa: null,
        tuNgay: "",
        denNgay: "",
        donViTao: "",
        loai: null,
        trangThai: "",
        maPa: "",
        loaiDuAn: null,
        soQd: "",
    };
    //danh muc
    danhSachBaoCao: any = [];
    loais: any[] = [
        {
            id: '1',
            tenDm: 'PA',
        },
        {
            id: '2',
            tenDm: 'QĐ',
        }
    ];
    loaiDuAns: any[] = [
      {
        id: '1',
        tenDm: 'Giao dự toán'
      },
      {
        id: '2',
        tenDm: 'Giao, diều chỉnh dự toán'
      }
    ];
    donViTaos: any[] = [];
    donVis: any[] = [];
    trangThais: any = TRANG_THAI_TIM_KIEM;
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
    // xoaDieuKien() {
    //     this.searchFilter.nam = null
    //     this.searchFilter.tuNgay = null
    //     this.searchFilter.denNgay = null
    //     this.searchFilter.maBaoCao = null
    //     this.searchFilter.donViTao = null
    //     this.searchFilter.loaiBaoCao = null
    //     this.searchFilter.trangThai = null
    // }

    // async taoMoi() {
    //     if (!this.searchFilter.loai ||
    //         (this.searchFilter.loai == '2' && !this.searchFilter.maBaoCao)) {
    //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
    //         return;
    //     }

    //     if (this.searchFilter.loai == '2') {
    //         let requestReport = {
    //             loaiTimKiem: "0",
    //             maBcao: this.searchFilter.maBaoCao,
    //             maDvi: this.searchFilter.donViTao,
    //             namBcao: null,
    //             ngayTaoDen: "",
    //             ngayTaoTu: "",
    //             paggingReq: {
    //                 limit: 10,
    //                 page: 1,
    //             },
    //             trangThais: [],
    //         };
    //         await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
    //             (data) => {
    //                 if (data.statusCode == 0) {
    //                     if (!data.data.empty) {
    //                         this.router.navigate([
    //                             '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/0/'+ this.searchFilter.maBaoCao,
    //                         ]);
    //                     } else {
    //                         this.notification.warning(MESSAGE.WARNING, "Không tìm thấy mã báo cáo :" + this.searchFilter.maBaoCao);
    //                     }
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             }
    //         );

    //     } else {
    //         this.router.navigate([
    //             '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn',
    //         ]);
    //     }

    // }

    async taoMoi() {
      if (!this.searchFilter.loai && !this.searchFilter.loaiDuAn) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        return;
      }

      if (this.searchFilter.loai == '1' && this.searchFilter.loaiDuAn == '1') {
        this.router.navigate([
          'qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi',
        ]);
      }
      else if (this.searchFilter.loai == '1' && this.searchFilter.loaiDuAn == '2') {
        this.router.navigate([
          'qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
        ]);
      }
      else if (this.searchFilter.loai == '2' && this.searchFilter.loaiDuAn == '1') {
        this.router.navigate([
          'qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi',
        ]);
      }
      else if (this.searchFilter.loai == '2' && this.searchFilter.loaiDuAn == '2') {
        this.router.navigate([
          'qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
        ]);
      }
    }

    xemChiTiet(id: string) {
        this.router.navigate([
            '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + id,
        ])
    }

    // async checkMaBcao() {
    //     let requestReport = {
    //         loaiTimKiem: "0",
    //         // maBcao: this.searchFilter.maBaoCao,
    //         maDvi: this.searchFilter.donViTao,
    //         namBcao: null,
    //         ngayTaoDen: "",
    //         ngayTaoTu: "",
    //         paggingReq: {
    //             limit: 10,
    //             page: 1,
    //         },
    //         trangThais: [],
    //     };
    //     await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 return !data.data.empty;
    //             } else {
    //                 return false;
    //             }
    //         },
    //         (err) => {
    //             return false;
    //         }
    //     );
    // }

    getStatusName(trangThai: string){
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    getUnitName(maDvi: string){
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

}
