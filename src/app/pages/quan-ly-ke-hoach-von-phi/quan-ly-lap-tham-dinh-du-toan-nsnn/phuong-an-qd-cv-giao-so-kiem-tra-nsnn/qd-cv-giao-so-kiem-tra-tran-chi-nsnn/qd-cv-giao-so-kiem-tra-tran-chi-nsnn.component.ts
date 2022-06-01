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
    selector: 'app-qd-cv-giao-so-kiem-tra-tran-chi-nsnn',
    templateUrl: './qd-cv-giao-so-kiem-tra-tran-chi-nsnn.component.html',
    styleUrls: ['./qd-cv-giao-so-kiem-tra-tran-chi-nsnn.component.scss']
})
export class QdCvGiaoSoKiemTraTranChiNsnnComponent implements OnInit {
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

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maPa);
        let temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
            (data) => {
                let objfile = {
                    fileName: data.filename,
                    fileSize: data.size,
                    fileUrl: data.url,
                }
                return objfile;
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        return temp;
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

        let request = JSON.parse(JSON.stringify(
            {
                id: this.id,
                namGiao: this.namGiao,
                maPa: this.maPa,
                soQdCv: this.soQdCv,
                maGiao: this.maGiao,
            }
        ))

        //get file cong van url
		let file: any = this.fileDetail;
		if (file) {
		  request.soQdCv = await this.uploadFile(file);
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




    dong() {
        // this.router.navigate(['/'])
        this.location.back()
    }

}
