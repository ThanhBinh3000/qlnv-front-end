import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as fileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';


export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
  selector: 'app-nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent implements OnInit {
    //thong tin nguoi dang nhap
    id!: any;
    userInfo: any;
    //thong tin chung bao cao
    ngayTao: string;
    maDviTao: string;
    soQdCv: ItemCongVan;
    maPa: string;
    namGiao: number;
    maGiao: string;
    newDate = new Date();
    //cac danh muc
    donVis: any[] = [];
    phuongAns: any[] = [];
    //file
    fileDetail: NzUploadFile;
    status: boolean = false;
    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.soQdCv = {
            fileName: file.name,
            fileSize: null,
            fileUrl: null,
        };
        return false;
    };

    constructor(
        private userService: UserService,
        private router: Router,
        private routerActive: ActivatedRoute,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private notification: NzNotificationService,
        private location: Location,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
    ) {
        // this.namgiao = this.currentYear.getFullYear();
    }

    async ngOnInit() {
        this.id = this.routerActive.snapshot.paramMap.get('id');
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        this.maDviTao = this.userInfo?.dvql;

        this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
        this.namGiao = this.newDate.getFullYear();
        this.quanLyVonPhiService.maGiao().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.maGiao = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        this.getPhuongAn();

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

    async getPhuongAn() {
        await this.quanLyVonPhiService.timKiemMaPaDuyet().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.phuongAns = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    //download file về máy tính
    async downloadFileCv() {
        if (this.soQdCv?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.soQdCv?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.soQdCv?.fileName);
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

    //luu
    async luu() {
        if (!this.soQdCv.fileName || !this.maPa) {
            this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập đầy số QĐ/CV và mã phương án");
            return;
        }
        let request = {
            id: this.id,
            namGiao: this.namGiao,
            maPa: this.maPa,
            soQdCv: this.soQdCv,
            maGiao: this.maGiao,
        }
        if (!this.id) {
            this.quanLyVonPhiService.themMoiQdCv(request).toPromise().then(async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
            })
        }

    }



    // //xem thong tin PA
    // xemphuongan() {
    //     this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/' + this.mapa])
    // }
    // //lay ten don vi tạo
    // getUnitName(mdv: any): string {
    //     return this.donviTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
    // }
    //
    dong() {
        // this.router.navigate(['/'])
        this.location.back()
    }

}
