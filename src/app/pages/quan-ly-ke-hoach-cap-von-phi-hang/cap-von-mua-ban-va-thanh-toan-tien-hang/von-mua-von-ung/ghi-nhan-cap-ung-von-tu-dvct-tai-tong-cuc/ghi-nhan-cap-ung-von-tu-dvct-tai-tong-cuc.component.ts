import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { CVMB, displayNumber, DON_VI_TIEN, exchangeMoney, LOAI_VON, MONEY_LIMIT, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';

export class ItemGui {
    noiDung: string;
    maNguonNs: string;
    maChuong: string;
    maNdkt: string;
    soTien: number;
    soTienChu: string;
    taiKhoan: number;
}

export class ItemNhan {
    ngayNhan: string;
    taiKhoanNhan: string;
}

@Component({
    selector: 'app-ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc',
    templateUrl: './ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc.component.html',
    styleUrls: ['./ghi-nhan-cap-ung-von-tu-dvct-tai-tong-cuc.component.scss'],
})
export class GhiNhanCapUngVonTuDvctTaiTongCucComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    id: string;
    maCvUv: string;
    ngayTao: string;
    maDonViTao: string;
    loaiVon: string;
    soLenhChiTien: string;
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
    newDate = new Date();
    maDviTien: string;
    thuyetMinh: string;
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    loaiVons: any[] = LOAI_VON;
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status = false;
    statusEdit = true;
    saveStatus = false;
    submitStatus = false;
    passStatus = false;
    approveStatus = false;
    copyStatus = false;
    printStatus = false;
    editMoneyUnit = false;
    isDataAvailable = false;
    //file
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: string[] = [];
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
        private quanLyVonPhiService: QuanLyVonPhiService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private danhMuc: DanhMucHDVService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.action('init');
    }

    async action(code: string) {
        this.spinner.show();
        this.isDataAvailable = false;
        switch (code) {
            case 'init':
                await this.initialization().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'detail':
                await this.getDetailReport().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'save':
                await this.save().then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'submit':
                await this.onSubmit('2', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonpass':
                await this.tuChoi('3').then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'pass':
                await this.onSubmit('4', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonapprove':
                await this.tuChoi('5').then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'approve':
                await this.onSubmit('7', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.spinner.hide();
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
    }

    async initialization() {
        //lay id cua de nghi
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.trangThaiBanGhi = Utils.TT_BC_1;
            this.maDonViTao = this.userInfo?.MA_DVI;
            this.maDviTien = '1';
            this.loaiVon = this.data.loaiCap;
            this.soLenhChiTien = this.data.soLenhChiTien;
            this.ngayLapTemp = this.data.ngayLap;
            this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
            this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maCvUv = res.data;
                        const mm = this.maCvUv.split('.');
                        this.maCvUv = mm[0] + "TCDT" + '.' + mm[1];
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
        }
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (Utils.statusSave.includes(this.trangThaiBanGhi) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_GNV)) {
            this.status = false;
        } else {
            this.status = true;
        }
        const checkChirld = this.maDonViTao == this.userInfo?.MA_DVI;
        this.saveStatus = this.getBtnStatus(Utils.statusSave, CVMB.EDIT_REPORT_GNV, checkChirld);
        this.submitStatus = this.getBtnStatus(Utils.statusApprove, CVMB.APPROVE_REPORT_GNV, checkChirld);
        this.passStatus = this.getBtnStatus(Utils.statusDuyet, CVMB.DUYET_REPORT_GNV, checkChirld);
        this.approveStatus = this.getBtnStatus(Utils.statusPheDuyet, CVMB.PHE_DUYET_REPORT_GNV, checkChirld);
        this.copyStatus = this.getBtnStatus(Utils.statusCopy, CVMB.COPY_REPORT_GNV, checkChirld);
    }

    getBtnStatus(status: string[], role: string, check: boolean) {
        return status.includes(this.trangThaiBanGhi) && this.userService.isAccessPermisson(role) && check;
    }

    back() {
        const obj = {
            tabSelected: this.data?.preTab,
        }
        this.dataChange.emit(obj);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDonViTao + '/' + this.maCvUv);
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

    // call chi tiet bao cao
    async getDetailReport() {
        await this.capVonMuaBanTtthService.ctietVonMuaBan(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.statusEdit = false;
                    this.maCvUv = data.data.maCapUngVonTuCapTren;
                    this.maDonViTao = data.data.maDvi;
                    this.maDviTien = data.data.maDviTien;
                    this.loaiVon = data.data.loaiCap;
                    this.soLenhChiTien = data.data.soLenhChiTien;
                    this.ngayLapTemp = data.data.ngayLap;
                    this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
                    this.ttNhan.ngayNhan = data.data.ngayNhan;
                    this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.ttGui.noiDung = data.data.noiDung;
                    this.ttGui.maNguonNs = data.data.maNguonNs;
                    this.ttGui.maChuong = data.data.maChuong;
                    this.ttGui.maNdkt = data.data.maNdkt;
                    this.ttGui.soTien = data.data.soTien;
                    this.ttGui.soTienChu = data.data.soTienBangChu;
                    this.ttGui.taiKhoan = data.data.tuTk;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.ttGuiCache = this.ttGui;
                    this.lstFiles = data.data.lstFileNhans;
                    this.listFile = [];
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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
                maLoai: "0",
            };
            this.spinner.show();
            await this.capVonMuaBanTtthService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiBanGhi = mcn;
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
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
    async tuChoi(mcn: string) {
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
        if (!this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
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
        // gui du lieu trinh duyet len server
        const request = {
            id: this.id,
            maLoai: '1',
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            fileDinhKemNhans: listFile,
            listIdDeleteFileNhans: this.listIdFilesDelete,
            maCapUngVonTuCapTren: this.maCvUv,
            loaiCap: this.loaiVon,
            soLenhChiTien: this.soLenhChiTien,
            ngayLap: this.ngayLapTemp,
            ngayNhan: this.ttNhan.ngayNhan,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            maChuong: this.ttGui.maChuong,
            maNdkt: this.ttGui.maNdkt,
            soTien: this.ttGui.soTien,
            soTienBangChu: this.ttGui.soTienChu,
            tuTk: this.ttGui.taiKhoan,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
        };
        if (!this.id) {
            this.capVonMuaBanTtthService.themMoiVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.id = data.data.id;
                        this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.capVonMuaBanTtthService.capNhatVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
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
        if ((!this.ttGuiCache.soTien && this.ttGuiCache.soTien !== 0) ||
            !this.ttGuiCache.taiKhoan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.ttGuiCache.soTien < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }
        this.statusEdit = false;
        this.ttGui = this.ttGuiCache;
    }

    changeDate() {
        this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
    }

    async showDialogCopy() {
        const obj = {
            loaiVon: this.loaiVon,
            soLenhChiTien: this.soLenhChiTien,
            ngayLap: this.ngayLapTemp,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy  Nhận cấp ứng vốn từ đơn vị cấp trên',
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
        let maCVUvNew: string;
        await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maCVUvNew = res.data;
                    const mm = maCVUvNew.split('.');
                    maCVUvNew = mm[0] + "TCDT" + '.' + mm[1];
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        if (!this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
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
        // gui du lieu trinh duyet len server
        const request = {
            id: null,
            maLoai: '1',
            maDvi: this.maDonViTao,
            maDviTien: '1',
            fileDinhKemNhans: [],
            listIdDeleteFileNhans: [],
            maCapUngVonTuCapTren: maCVUvNew,
            loaiCap: response.loaiVon,
            soLenhChiTien: response.soLenhChiTien,
            ngayLap: response.ngayLap,
            ngayNhan: this.ttNhan.ngayNhan,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            maChuong: this.ttGui.maChuong,
            maNdkt: this.ttGui.maNdkt,
            soTien: this.ttGui.soTien,
            soTienBangChu: this.ttGui.soTienChu,
            tuTk: this.ttGui.taiKhoan,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: "1",
            thuyetMinh: "",
        };

        this.spinner.show();
        this.capVonMuaBanTtthService.themMoiVonMuaBan(request).toPromise().then(
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
                            maBcao: maCVUvNew
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

    statusClass() {
        if (Utils.statusSave.includes(this.trangThaiBanGhi)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
