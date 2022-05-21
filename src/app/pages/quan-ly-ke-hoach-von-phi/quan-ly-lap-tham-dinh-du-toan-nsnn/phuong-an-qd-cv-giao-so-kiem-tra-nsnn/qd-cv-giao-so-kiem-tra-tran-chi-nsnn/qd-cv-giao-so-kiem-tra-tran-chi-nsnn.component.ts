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
    ngayNhap: string;
    maDviTao: string;
    maDviNhan: string;
    soQdCv: string;
    maPa: string;
    namGiao: number;
    newDate = new Date();
    //cac danh muc
    donVis: any[] = [];
    phuongAns: any[] = [];
    //file
    lstFile: any[] = [];
    listFile: File[] = [];
    fileUrl: any;
    fileList: NzUploadFile[] = [];
    fileToUpload!: File;
    listIdDeleteFiles: string = "";

    beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// upload file
	addFile() {
		const id = this.fileToUpload?.lastModified.toString();
		this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
		this.listFile.push(this.fileToUpload);
	}

	handleUpload(): void {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.lstFile.push({ id: id, fileName: file?.name });
			this.listFile.push(file);
		});
		this.fileList = [];
	}

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
        private fb: FormBuilder
    ) {
        // this.namgiao = this.currentYear.getFullYear();
    }

    async ngOnInit() {
        this.id = this.routerActive.snapshot.paramMap.get('id');
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);

        if (this.id){

        } else {
            this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
        }

        this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
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
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    //luu
    async luu() {
        // lay id file dinh kem (gửi file theo danh sách )
        let listFileUploaded: any = [];
        for (const iterator of this.listFile) {
            listFileUploaded.push(await this.uploadFile(iterator));
        }
        let request = {
            fileDinhKems: listFileUploaded,
            listIdFiles: "",
            maDvi: this.maDviTao,
            maDviNhan: this.maDviNhan,
            maPa: this.maPa,
            namGiao: this.namGiao,
            soQdCv: this.soQdCv,
            ngayTao: this.ngayNhap,
        }

        this.quanLyVonPhiService.nhapsoqdcv(request).toPromise().then(data => {
            if (data.statusCode == 0) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        })
    }



    // //xem thong tin PA
    // xemphuongan() {
    //     this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/' + this.mapa])
    // }
    // //lay ten don vi tạo
    // getUnitName(mdv: any): string {
    //     return this.donviTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
    // }

    //upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maPa + '/' + this.maDviTao);
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


    // xoa file trong bang file
	deleteFile(id: string): void {
		this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		// set list for delete
		this.listIdDeleteFiles += id + ",";
	}


    //download file về máy tính
	async downloadFile(id: string) {
		let file!: File;
		file = this.listFile.find(element => element?.lastModified.toString() == id);
		if (!file) {
			let fileAttach = this.lstFile.find(element => element?.id == id);
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

    //event ng dung thay doi file
    selectFile(files: FileList): void {
        this.fileToUpload = files.item(0);
    }


    //
    dong() {
        // this.router.navigate(['/'])
        this.location.back()
    }

}
