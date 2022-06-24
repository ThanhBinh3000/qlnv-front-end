import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import { DataService } from '../data.service';
import { TRANG_THAI_TIM_KIEM_CHA, TRANG_THAI_TIM_KIEM_CON } from '../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';


export class ItemGui {
    noiDung: string;
    maNguonNs: string;
    nienDoNs: string;
    soTien: number;
    soTienBangChu: string;
    nopThue: number;
    ttChoDviHuong: number;
    thuyetMinh: string;
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    listIdFilesDelete: any = [];
}

export class ItemNhan {
    ngayNhan: string;
    taiKhoanNhan: string;
    thuyetMinh: string;
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    listIdFilesDelete: any = [];
}

@Component({
    selector: 'app-tien-thua',
    templateUrl: './tien-thua.component.html',
    styleUrls: ['./tien-thua.component.scss',
    ],
})
export class TienThuaComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    loai: any;
    userInfo: any;
    //thong tin chung bao cao
    maTienThua: string;
    maCvUv: string;
    ngayTao: string;
    maDviTao: string;
    ngayLap: string;
    ngayLapTemp: string;
    ngayNhan: string;
    ngayTrinhDuyet: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ttGui: ItemGui = new ItemGui();
    ttGuiCache: ItemGui = new ItemGui();
    ttNhan: ItemNhan = new ItemNhan();
    trangThaiBanGhi: string = "1";
    trangThaiCha: string = "1";
    newDate = new Date();
    maDviTien: string;
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM_CON;
    trangThaiChas: any[] = TRANG_THAI_TIM_KIEM_CHA;
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    statusGui: boolean = false;
    statusNhan: boolean = false;
    statusEdit: boolean = true;
    statusBtnDel: boolean;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusBtnCopy: boolean;
    statusSaveParent: boolean;
    statusApproveParent: boolean;
    statusTBPParent: boolean;
    statusLDParent: boolean;
    statusBtnParent: boolean;
    allChecked = false;

    // before uploaf file
    beforeUploadGui = (file: NzUploadFile): boolean => {
        this.ttGui.fileList = this.ttGui.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadNhan = (file: NzUploadFile): boolean => {
        this.ttNhan.fileList = this.ttNhan.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUploadGui(): void {
        this.ttGui.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.ttGui.lstFiles.push({ id: id, fileName: file?.name });
            this.ttGui.listFile.push(file);
        });
        this.ttGui.fileList = [];
    }

    // them file vao danh sach
    handleUploadNhan(): void {
        this.ttNhan.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.ttNhan.lstFiles.push({ id: id, fileName: file?.name });
            this.ttNhan.listFile.push(file);
        });
        this.ttNhan.fileList = [];
    }


    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        private spinner: NgxSpinnerService,
        private routerActive: ActivatedRoute,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private router: Router,
        private userService: UserService,
        private notification: NzNotificationService,
        private location: Location,
        private modal: NzModalService,
        private dataSource: DataService,
    ) { }

    async ngOnInit() {
        //lay id cua ban ghi
        this.loai = this.routerActive.snapshot.paramMap.get('loai');
        this.id = this.routerActive.snapshot.paramMap.get('id');

        //lay thong tin user
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);

        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
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
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.trangThaiBanGhi = '1';
            this.statusBtnParent = true;
            this.dataSource.currentData.subscribe(obj => {
                this.maCvUv = obj?.maCvUv;
            })
            if (!this.maCvUv) {
                this.close();
            }
            this.maDviTao = this.userInfo?.dvql;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.ngayLap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.ngayLapTemp = this.datePipe.transform(this.newDate, "yyyy-MM-dd");
            this.spinner.show();
            this.quanLyVonPhiService.maNopTienVon().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        let capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
                        var str: string;
                        if (capDvi == Utils.CUC_KHU_VUC) {
                            str = "CKV";
                        } else {
                            str = "CC";
                        }
                        this.maTienThua = res.data;
                        let mm = this.maTienThua.split('.');
                        this.maTienThua = mm[0] + str + '.' + mm[1];
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }

        this.getStatusButton();
        this.spinner.hide();

    }

    redirectkehoachvonphi() {
        // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
        this.location.back()
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

    //check role cho các nut trinh duyet
    getStatusButton() {
        let userRole = this.userInfo?.roles[0]?.code;
        if ((this.trangThaiBanGhi == Utils.TT_BC_1 || this.trangThaiBanGhi == Utils.TT_BC_3 || this.trangThaiBanGhi == Utils.TT_BC_5)
            && (ROLE_CAN_BO.includes(userRole)) && this.statusBtnParent) {
            this.statusGui = false;
        } else {
            this.statusGui = true;
        }
        if ((this.trangThaiCha == Utils.TT_BC_1 || this.trangThaiCha == Utils.TT_BC_3 || this.trangThaiCha == Utils.TT_BC_5)
            && (ROLE_CAN_BO.includes(userRole)) && !this.statusBtnParent) {
            this.statusNhan = false;
        } else {
            this.statusNhan = true;
        }
        let checkChirld = false;
        let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (dVi && dVi.maDvi == this.userInfo?.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
        this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, userRole);
        if (this.statusBtnParent) {
            this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, userRole);
        } else {
            this.statusBtnCopy = true;
        }
        //
        this.statusSaveParent = utils.getRoleSave(this.trangThaiCha, !this.statusBtnParent, userRole);
        this.statusApproveParent = utils.getRoleApprove(this.trangThaiCha, !this.statusBtnParent, userRole);
        this.statusTBPParent = utils.getRoleTBP(this.trangThaiCha, !this.statusBtnParent, userRole);
        this.statusLDParent = utils.getRoleLD(this.trangThaiCha, !this.statusBtnParent, userRole);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maTienThua);
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
    deleteFileGui(id: string): void {
        this.ttGui.lstFiles = this.ttGui.lstFiles.filter((a: any) => a.id !== id);
        this.ttGui.listFile = this.ttGui.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.ttGui.listIdFilesDelete.push(id);
    }

    // xoa file trong bang file
    deleteFileNhan(id: string): void {
        this.ttNhan.lstFiles = this.ttNhan.lstFiles.filter((a: any) => a.id !== id);
        this.ttNhan.listFile = this.ttNhan.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.ttNhan.listIdFilesDelete.push(id);
    }

    //download file về máy tính
    async downloadFileGui(id: string) {
        let file!: File;
        file = this.ttGui.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            let fileAttach = this.ttGui.lstFiles.find(element => element?.id == id);
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
    async downloadFileNhan(id: string) {
        let file!: File;
        file = this.ttNhan.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            let fileAttach = this.ttNhan.lstFiles.find(element => element?.id == id);
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

    // call chi tiet bao cao
    async getDetailReport() {
        this.spinner.show();
        await this.quanLyVonPhiService.ctietVonMuaBan(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.statusEdit = false;
                    this.maDviTao = data.data.maDvi;
                    let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
                    if (dVi && dVi?.maDviCha == this.userInfo?.dvql) {
                        this.statusBtnParent = false;
                    } else {
                        this.statusBtnParent = true;
                    }
                    this.maDviTien = data.data.maDviTien;
                    this.maTienThua = data.data.maNopTienThua;
                    this.maCvUv = data.data.maCapUngVonTuCapTren;
                    this.ngayLapTemp = data.data.ngayLap;
                    this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
                    this.ttNhan.ngayNhan = data.data.ngayNhan;
                    this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    if (this.statusBtnParent) {
                        this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                        this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                        this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    } else {
                        this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinhDviCha, Utils.FORMAT_DATE_STR);
                        this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyetDviCha, Utils.FORMAT_DATE_STR);
                        this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyetDviCha, Utils.FORMAT_DATE_STR);
                    }
                    this.ttGui.noiDung = data.data.noiDung;
                    this.ttGui.maNguonNs = data.data.maNguonNs;
                    this.ttGui.nienDoNs = data.data.nienDoNs;
                    this.ttGui.soTien = divMoney(data.data.soTien, this.maDviTien);
                    this.ttGui.nopThue = divMoney(data.data.nopThue, this.maDviTien);
                    this.ttGui.ttChoDviHuong = divMoney(data.data.ttChoDviHuong, this.maDviTien);
                    this.ttGui.soTienBangChu = data.data.soTienBangChu;
                    this.ttGui.thuyetMinh = data.data.thuyetMinh;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.trangThaiCha = data.data.trangThaiDviCha;
                    this.ttNhan.thuyetMinh = data.data.thuyetMinhDviCha;
                    this.ttGuiCache = this.ttGui;
                    this.ttGui.lstFiles = data.data.lstFileGuis;
                    this.ttGui.listFile = [];
                    this.ttNhan.lstFiles = data.data.lstFileNhans;
                    this.ttNhan.listFile = [];
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
                maLoai: null,
            };
            if (this.statusBtnParent) {
                requestGroupButtons.maLoai = "0";
            } else {
                requestGroupButtons.maLoai = "1";
            }
            this.spinner.show();
            await this.quanLyVonPhiService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    if (this.statusBtnParent) {
                        this.trangThaiBanGhi = mcn;
                    } else {
                        this.trangThaiCha = mcn;
                    }
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
            this.spinner.hide();
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
        }
    }

    //show popup tu choi
    tuChoi(mcn: string) {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Từ chối',
            nzContent: DialogTuChoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (text) => {
            if (text) {
                this.onSubmit(mcn, text);
            }
        });
    }


    // luu
    async save() {
        if (!this.statusBtnParent) {
            if (!this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }

        if (this.statusEdit) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        // gui du lieu trinh duyet len server
        if (mulMoney(this.ttGui.soTien, this.maDviTien) > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        //get list file url
        let listFileGui: any = [];
        for (const iterator of this.ttGui.listFile) {
            listFileGui.push(await this.uploadFile(iterator));
        }
        //get list file url
        let listFileNhan: any = [];
        for (const iterator of this.ttNhan.listFile) {
            listFileNhan.push(await this.uploadFile(iterator));
        }
        // gui du lieu trinh duyet len server
        let request = {
            id: this.id,
            maLoai: "3",
            fileDinhKemGuis: listFileGui,
            listIdDeleteFileGuis: this.ttGui.listIdFilesDelete,
            fileDinhKemNhans: listFileNhan,
            listIdDeleteFileNhans: this.ttNhan.listIdFilesDelete,
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            maNopTienThua: this.maTienThua,
            maCapUngVonTuCapTren: this.maCvUv,
            ngayLap: this.ngayLapTemp,
            ngayNhan: this.ttNhan.ngayNhan,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            nienDoNs: this.ttGui.nienDoNs,
            soTien: mulMoney(this.ttGui.soTien, this.maDviTien),
            nopThue: mulMoney(this.ttGui.nopThue, this.maDviTien),
            ttChoDviHuong: mulMoney(this.ttGui.ttChoDviHuong, this.maDviTien),
            soTienBangChu: this.ttGui.soTienBangChu,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: this.trangThaiBanGhi,
            trangThaiDviCha: this.trangThaiCha,
            thuyetMinh: this.ttGui.thuyetMinh,
            thuyetMinhDviCha: this.ttNhan.thuyetMinh,
        };

        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.router.navigate([
                            'qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/tien-thua/0/'
                            + data.data.id,
                        ]);
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.quanLyVonPhiService.capNhatVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
        this.spinner.hide();
    }

    // start edit
    startEdit(): void {
        this.statusEdit = true;
    }

    // huy thay doi
    cancelEdit(): void {
        this.statusEdit = false;
        this.ttGuiCache = this.ttGui;
    }

    // luu thay doi
    saveEdit(): void {
        if (!this.ttGuiCache.ttChoDviHuong && this.ttGuiCache.ttChoDviHuong !== 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.statusEdit = false;
        this.ttGui = this.ttGuiCache;
    }


    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName() {
        if (this.statusBtnParent) {
            return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
        } else {
            return this.trangThaiChas.find(e => e.id == this.trangThaiCha)?.tenDm;
        }
    }

    close() {
        if (!this.loai){ 
            this.loai = "0";
        }
        if (this.statusBtnParent) {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/danh-sach-nop-tien-thua/' + this.loai
            ]);
        } else {
            this.router.navigate([
                '/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/danh-sach-ghi-nhan-tien-von-thua/' + this.loai
            ]);
        }
    }

    changeDate() {
        this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
    }

    getMaDviTien() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    changeModel() {
        var nopThue: number = 0;
        var ttChoDviHuong: number = 0;
        if (this.ttGuiCache.nopThue) {
            nopThue = Number(this.ttGuiCache.nopThue);
        }
        if (this.ttGuiCache.ttChoDviHuong) {
            ttChoDviHuong = Number(this.ttGuiCache.ttChoDviHuong);
        }
        this.ttGuiCache.soTien = nopThue + ttChoDviHuong;
    }

    async showDialogCopy() {
        let danhSach = [];

        let requestReport = {
            loaiTimKiem: "0",
            maCapUngVonTuCapTren: "",
            maDvi: this.userInfo?.dvql,
            maLoai: "1",
            ngayLap: "",
            ngayTaoDen: "",
            ngayTaoTu: "",
            paggingReq: {
                limit: 1000,
                page: 1,
            },
            trangThais: [Utils.TT_BC_7],
        };
        this.spinner.show();
        await this.quanLyVonPhiService.timKiemVonMuaBan(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    danhSach = data.data.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        this.spinner.hide();
        let obj = {
            maCvUv: this.maCvUv,
            danhSach: danhSach,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy  Nộp tiền thừa lên đơn vị cấp trên',
            nzContent: DialogDoCopyComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.doCopy(res);
            }
        });
    }

    async doCopy(response: any) {
        var maCvUvNew: string;
        await this.quanLyVonPhiService.maNopTienVon().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    let capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
                    var str: string;
                    if (capDvi == Utils.CUC_KHU_VUC) {
                        str = "CKV";
                    } else {
                        str = "CC";
                    }
                    maCvUvNew = res.data;
                    let mm = maCvUvNew.split('.');
                    maCvUvNew = mm[0] + str + '.' + mm[1];
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        if (this.statusEdit) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        // gui du lieu trinh duyet len server
        if (mulMoney(this.ttGui.soTien, this.maDviTien) > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // gui du lieu trinh duyet len server
        let request = {
            id: null,
            maLoai: "3",
            fileDinhKemGuis: [],
            listIdDeleteFileGuis: [],
            fileDinhKemNhans: [],
            listIdDeleteFileNhans: [],
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            maNopTienThua: maCvUvNew,
            maCapUngVonTuCapTren: response.maCvUv,
            ngayLap: this.ngayLapTemp,
            ngayNhan: null,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            nienDoNs: this.ttGui.nienDoNs,
            soTien: mulMoney(this.ttGui.soTien, this.maDviTien),
            nopThue: mulMoney(this.ttGui.nopThue, this.maDviTien),
            ttChoDviHuong: mulMoney(this.ttGui.ttChoDviHuong, this.maDviTien),
            soTienBangChu: this.ttGui.soTienBangChu,
            tkNhan: null,
            trangThai: "1",
            trangThaiDviCha: "1",
            thuyetMinh: "",
            thuyetMinhDviCha: "",
        };

        this.spinner.show();
        this.quanLyVonPhiService.themMoiVonMuaBan(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    const modalCopy = this.modal.create({
                        nzTitle: MESSAGE.ALERT,
                        nzContent: DialogCopyComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzWidth: '900px',
                        nzFooter: null,
                        nzComponentParams: {
                            maBcao: maCvUvNew
                        },
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }


}
