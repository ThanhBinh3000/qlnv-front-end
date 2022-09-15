import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../lap-tham-dinh.constant';


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
    id!: string;
    userInfo: any;
    roles: string[] = [];
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
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    //beforeUpload: any;
    listIdFilesDelete: string[] = [];                        // id file luc call chi tiet
    status = false;
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

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }


    constructor(
        private userService: UserService,
        private router: Router,
        private routerActive: ActivatedRoute,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
    ) {
        // this.namgiao = this.currentYear.getFullYear();
    }

    async ngOnInit() {
        this.id = this.routerActive.snapshot.paramMap.get('id');
        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();
        this.roles = this.userInfo?.roles;
        this.maDviTao = this.userInfo?.MA_DVI;

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
        this.spinner.hide();

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
        this.spinner.show()
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
        this.spinner.hide();
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maPa);
        const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
            (data) => {
                const objfile = {
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

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    }

    //download file về máy tính
    async downloadFile(id: string) {
        const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.lstFiles.find(element => element?.id == id);
            if (fileAttach) {
                await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
                    (data) => {
                        fileSaver.saveAs(data, fileAttach.fileName);
                    },
                    err => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    },
                );
            }
        } else {
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
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
            const file: any = this.fileDetail;
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
    }

    //luu
    async luu() {
        if (this.namGiao >= 3000 || this.namGiao < 1000) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.INVALIDFORMAT);
            return;
        }
        if (!this.soQdCv?.fileName || !this.maPa) {
            this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập đầy số QĐ/CV và mã phương án");
            return;
        }

        //get list file url
        let checkFile = true;
        for (const iterator of this.listFile) {
            if (iterator.size > Utils.FILE_SIZE) {
                checkFile = false;
            }
        }
        if (!checkFile) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }
        const listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }

        const request = JSON.parse(JSON.stringify(
            {
                id: this.id,
                fileDinhKems: this.lstFiles,
                listIdDeleteFiles: this.listIdFilesDelete,
                namGiao: this.namGiao,
                maPa: this.maPa,
                soQdCv: this.soQdCv,
                maGiao: this.maGiao,
            }
        ))

        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                request.soQdCv = await this.uploadFile(file);
            }
        }

        if (!request.soQdCv) {
            this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập số quyết định công văn");
            return;
        }

        if (!this.id) {
            this.quanLyVonPhiService.themMoiQdCv(request).toPromise().then(async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                    this.getIdPan(this.maPa);
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
            })
        }

    }

    dong() {
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/1'
        ]);
    }

    async getIdPan(maPa) {
        const requestReport = {
            loaiTimKiem: "0",
            maDviTao: this.maDviTao,
            maPa: maPa,
            trangThais: [],
            paggingReq: {
                limit: 10,
                page: 1,
            }
        };
        this.spinner.show();
        await this.quanLyVonPhiService.timKiemPhuongAn(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    const phuongAn = data.data.content[0];
                    this.router.navigate([
                        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + phuongAn?.id
                    ]);
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

}
