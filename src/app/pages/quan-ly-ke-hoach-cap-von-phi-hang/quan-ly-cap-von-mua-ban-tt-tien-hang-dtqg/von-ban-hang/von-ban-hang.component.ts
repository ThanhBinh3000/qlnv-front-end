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
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, divMoney, DON_VI_TIEN, exchangeMoney, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, sumNumber, Utils } from 'src/app/Utility/utils';
import { CAP_VON_MUA_BAN, MAIN_ROUTE_CAPVON } from '../../quan-ly-ke-hoach-von-phi-hang.constant';
import { DataService } from 'src/app/services/data.service';
import { TRANG_THAI_TIM_KIEM_CHA, TRANG_THAI_TIM_KIEM_CON } from '../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';


export class ItemGui {
    tuTk: number;
    noiDung: string;
    maNguonNs: number;
    nienDoNs: number;
    soTien: number;
    soTienBangChu: string;
    nopThue: number;
    ttChoDviHuong: number;
    thuyetMinh: string;
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    listIdFilesDelete: string[] = [];
}

export class ItemNhan {
    ngayNhan: string;
    taiKhoanNhan: number;
    thuyetMinh: string;
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    listIdFilesDelete: string[] = [];
}

@Component({
    selector: 'app-von-ban-hang',
    templateUrl: './von-ban-hang.component.html',
    styleUrls: ['./von-ban-hang.component.scss',
    ],
})
export class VonBanHangComponent implements OnInit {
    //thong tin dang nhap
    id: string;
    loai: string;
    userInfo: any;
    //thong tin chung bao cao
    maNopTien: string;
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
    trangThaiBanGhi = "1";
    trangThaiCha = "1";
    newDate = new Date();
    maDviTien: string;
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM_CON;
    trangThaiChas: any[] = TRANG_THAI_TIM_KIEM_CHA;
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    statusGui = false;
    statusNhan = false;
    statusEdit = true;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusSaveParent: boolean;
    statusApproveParent: boolean;
    statusTBPParent: boolean;
    statusLDParent: boolean;
    statusBtnCopy: boolean;
    statusBtnParent: boolean;
    allChecked = false;
    editMoneyUnit = false;
    formatter = value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : null;

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
        this.spinner.show();
        const userName = this.userService.getUserName();
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
            this.maDviTien = '1';
            this.statusBtnParent = true;
            this.maDviTao = this.userInfo?.dvql;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.dataSource.currentData.subscribe(obj => {
                this.ngayLapTemp = obj?.ngayLap;
            })
            if (!this.ngayLapTemp) {
                this.close();
            }
            this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
            this.quanLyVonPhiService.maNopTienVon().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        const capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
                        let str: string;
                        if (capDvi == Utils.CUC_KHU_VUC) {
                            str = "CKV";
                        } else {
                            str = "CC";
                        }
                        this.maNopTien = res.data;
                        const mm: string[] = this.maNopTien.split('.');
                        this.maNopTien = mm[0] + str + '.' + mm[1];
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
        const userRole = this.userInfo?.roles[0]?.code;
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
        const dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (dVi && dVi.maDvi == this.userInfo?.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
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
        upfile.append('folder', this.maDviTao + '/' + this.maNopTien);
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
        const file: File = this.ttGui.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.ttGui.lstFiles.find(element => element?.id == id);
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
        const file: File = this.ttNhan.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.ttNhan.lstFiles.find(element => element?.id == id);
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
        await this.quanLyVonPhiService.ctietVonMuaBan(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.statusEdit = false;
                    this.maDviTao = data.data.maDvi;
                    const dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
                    if (dVi && dVi?.maDviCha == this.userInfo?.dvql) {
                        this.statusBtnParent = false;
                    } else {
                        this.statusBtnParent = true;
                    }
                    this.maDviTien = data.data.maDviTien;
                    this.maNopTien = data.data.maNopTienVon;
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
                    this.ttGui.tuTk = data.data.tuTk;
                    this.ttGui.maNguonNs = data.data.maNguonNs;
                    this.ttGui.nienDoNs = data.data.nienDoNs;
                    this.ttGui.soTien = data.data.soTien;
                    this.ttGui.nopThue = data.data.nopThue;
                    this.ttGui.ttChoDviHuong = data.data.ttChoDviHuong;
                    this.ttGui.soTienBangChu = data.data.soTienBangChu;
                    this.ttGui.thuyetMinh = data.data.thuyetMinh;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.trangThaiCha = data.data.trangThaiDviCha;
                    this.ttGuiCache = this.ttGui;
                    this.ttNhan.thuyetMinh = data.data.thuyetMinhDviCha;
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
                        this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                        this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                        this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    } else {
                        this.trangThaiCha = mcn;
                        this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinhDviCha, Utils.FORMAT_DATE_STR);
                        this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyetDviCha, Utils.FORMAT_DATE_STR);
                        this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyetDviCha, Utils.FORMAT_DATE_STR);
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

        // gui du lieu trinh duyet len server
        if (this.ttGui.soTien > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        //get list file url
        let checkFile = true;
        for (const iterator of this.ttGui.listFile) {
            if (iterator.size > Utils.FILE_SIZE) {
                checkFile = false;
            }
        }
        for (const iterator of this.ttNhan.listFile) {
            if (iterator.size > Utils.FILE_SIZE) {
                checkFile = false;
            }
        }
        if (!checkFile) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }
        const listFileGui: any = [];
        for (const iterator of this.ttGui.listFile) {
            listFileGui.push(await this.uploadFile(iterator));
        }
        //get list file url
        const listFileNhan: any = [];
        for (const iterator of this.ttNhan.listFile) {
            listFileNhan.push(await this.uploadFile(iterator));
        }
        // gui du lieu trinh duyet len server
        const request = {
            id: this.id,
            fileDinhKemGuis: listFileGui,
            listIdDeleteFileGuis: this.ttGui.listIdFilesDelete,
            fileDinhKemNhans: listFileNhan,
            listIdDeleteFileNhans: this.ttNhan.listIdFilesDelete,
            maLoai: "2",
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            maNopTienVon: this.maNopTien,
            ngayLap: this.ngayLapTemp,
            ngayNhan: this.ttNhan.ngayNhan,
            tuTk: this.ttGui.tuTk,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            nienDoNs: this.ttGui.nienDoNs,
            soTien: this.ttGui.soTien,
            nopThue: this.ttGui.nopThue,
            ttChoDviHuong: this.ttGui.ttChoDviHuong,
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
                            MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/von-ban-hang/0/'
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
        if (!this.ttGuiCache.tuTk ||
            (!this.ttGuiCache.ttChoDviHuong && this.ttGuiCache.ttChoDviHuong !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.ttGuiCache.nopThue < 0 ||
            this.ttGuiCache.ttChoDviHuong < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
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
        if (!this.loai) {
            this.loai = "0";
        }
        if (this.statusBtnParent) {
            this.router.navigate([
                MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/danh-sach-nhap-von-ban-hang/' + this.loai
            ]);
        } else {
            this.router.navigate([
                MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/danh-sach-ghi-nhan-von-ban-hang/' + this.loai
            ]);
        }

    }

    changeDate() {
        this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
    }

    changeModel() {
        this.ttGuiCache.soTien = sumNumber([this.ttGuiCache.nopThue, this.ttGuiCache.ttChoDviHuong]);
    }

    async doCopy() {
        let maCvUvNew: string;
        await this.quanLyVonPhiService.maNopTienVon().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    const capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
                    let str: string;
                    if (capDvi == Utils.CUC_KHU_VUC) {
                        str = "CKV";
                    } else {
                        str = "CC";
                    }
                    maCvUvNew = res.data;
                    const mm: string[] = maCvUvNew.split('.');
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

        // gui du lieu trinh duyet len server
        if (this.ttGui.soTien > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // gui du lieu trinh duyet len server
        const request = {
            id: null,
            fileDinhKemGuis: [],
            listIdDeleteFileGuis: [],
            fileDinhKemNhans: [],
            listIdDeleteFileNhans: [],
            maLoai: "2",
            maDvi: this.maDviTao,
            maDviTien: '1',
            maNopTienVon: maCvUvNew,
            ngayLap: this.ngayLapTemp,
            ngayNhan: null,
            tuTk: this.ttGui.tuTk,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            nienDoNs: this.ttGui.nienDoNs,
            soTien: this.ttGui.soTien,
            nopThue: this.ttGui.nopThue,
            ttChoDviHuong: this.ttGui.ttChoDviHuong,
            soTienBangChu: this.ttGui.soTienBangChu,
            tkNhan: "",
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

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    // changeMoney() {
    //     if (!this.moneyUnit) {
    //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_MONEY);
    //         return;
    //     }
    //     this.ttGui.soTien = exchangeMoney(this.ttGui.soTien, this.maDviTien, this.moneyUnit);
    //     this.ttGui.ttChoDviHuong = exchangeMoney(this.ttGui.ttChoDviHuong, this.maDviTien, this.moneyUnit);
    //     this.ttGui.nopThue = exchangeMoney(this.ttGui.nopThue, this.maDviTien, this.moneyUnit);

    //     this.ttGuiCache.soTien = this.ttGui.soTien;
    //     this.ttGuiCache.ttChoDviHuong = this.ttGui.ttChoDviHuong;
    //     this.ttGuiCache.nopThue = this.ttGui.nopThue;

    //     this.maDviTien = this.moneyUnit;
    // }

}
