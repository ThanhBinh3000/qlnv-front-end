import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as fileSaver from 'file-saver';
import * as uuid from "uuid";
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-dialog-them-thong-tin-quyet-toan',
    templateUrl: './dialog-them-thong-tin-quyet-toan.component.html',
    styleUrls: ['./dialog-them-thong-tin-quyet-toan.component.scss']
})
export class DialogThemThongTinQuyetToanComponent implements OnInit {
    @Input() tab: string;
    //thong tin user
    userInfo: any;
    //thong tin chung bao cao
    ngayTao: string;
    maDviTao: string;
    soQd: ItemCongVan;
    maPa: string;
    maLoai: string;
    namGiao: number;
    maGiao: string;
    newDate = new Date();
    //danh muc va file
    phuongAns: any[] = [];
    loaiPas: any[] = [
        {
            id: '1',
            tenDm: 'Giao dự toán'
        },
        {
            id: '2',
            tenDm: 'Giao, diều chỉnh dự toán'
        }
    ];
    //file
    lstFiles: any[] = []; //show file ra man hinh
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    //beforeUpload: any;
    listIdFilesDelete: string[] = [];                        // id file luc call chi tiet

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.soQd = {
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
        private _modalRef: NzModalRef,
        private userService: UserService,
        private GiaoDuToanChiService: GiaoDuToanChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.maDviTao = this.userInfo?.MA_DVI;

        this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
        this.namGiao = this.newDate.getFullYear();
        this.GiaoDuToanChiService.maPhuongAnGiao("1").toPromise().then(
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

        await this.getPhuongAn();
    }



    async getPhuongAn() {
        this.spinner.show()
        await this.GiaoDuToanChiService.timKiemMaPaGiaoNSNN().toPromise().then(
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
        if (this.soQd?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.soQd?.fileName);
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

    async save() {
        if (!this.soQd?.fileName || !this.maPa) {
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
                id: null,
                fileDinhKems: listFile,
                listIdFiles: this.listIdFilesDelete,
                namDtoan: this.namGiao,
                maPa: this.maPa,
                soQd: this.soQd,
                maGiao: this.maGiao,
            }
        ))

        //get file cong van url
        const file: any = this.fileDetail;
        // if (file) {
        //   if (file.size > Utils.FILE_SIZE) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        //     return;
        //   } else {
        //     request.soQd = await this.uploadFile(file);
        //   }
        // }

        if (!request.soQd) {
            this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập số quyết định công văn");
            return;
        }

        this.GiaoDuToanChiService.themMoiQdCvGiaoNSNN(request).toPromise().then(async data => {
            if (data.statusCode == 0) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.handleOk();
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        })

    }

    async handleOk() {
        let phuongAn!: string;
        let loaiPa!: string;
        const requestReport = {
            loaiTimKiem: "0",
            maPhanGiao: '2',
            maLoai: '2',
            namPa: null,
            ngayTaoTu: "",
            ngayTaoDen: "",
            donViTao: this.maDviTao,
            loai: null,
            trangThais: ["1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9"],
            maPa: this.maPa,
            maLoaiDan: null,
            soQd: "",
            trangThaiGiaos: ["0",
                "1",
                "2"],
            paggingReq: {
                limit: 10,
                page: 1
            },

            // loaiTimKiem: "0",
            // maPhanGiao: "2",
            // maLoai: "2",
            // namPa: null,
            // ngayTaoTu: null,
            // ngayTaoDen: null,
            // donViTao: "0101",
            // loai: null,
            // trangThais: [
            //   "1",
            //   "2",
            //   "3",
            //   "4",
            //   "5",
            //   "6",
            //   "7",
            //   "8",
            //   "9"
            // ],
            // maPa: null,
            // maLoaiDan: null,
            // soQd: "",
            // trangThaiGiaos: [
            //   "0",
            //   "1",
            //   "2"
            // ],
            // paggingReq: {
            //   limit: 10,
            //   page: 1
            // }

        };
        this.spinner.show();
        await this.GiaoDuToanChiService.timBaoCaoGiao(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    phuongAn = data.data.content[0]?.id;
                    loaiPa = data.data.content[0]?.maLoaiDan;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        let data = {
            id: phuongAn,
            loaiPa: loaiPa
        }
        this._modalRef.close(data);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
