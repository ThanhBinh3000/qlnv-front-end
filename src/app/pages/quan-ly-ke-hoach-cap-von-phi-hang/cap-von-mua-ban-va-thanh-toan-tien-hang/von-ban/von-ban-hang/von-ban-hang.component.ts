import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { CVMB, displayNumber, DON_VI_TIEN, exchangeMoney, MONEY_LIMIT, sumNumber, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';

export class ItemGui {
    tuTk: number;
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
    listIdFilesDelete: string[] = [];
    status = true;
    trangThai: string;
}

export class ItemNhan {
    ngayNhan: string;
    taiKhoanNhan: number;
    thuyetMinh: string;
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    listIdFilesDelete: string[] = [];
    status = true;
    trangThai: string;
}

@Component({
    selector: 'app-von-ban-hang',
    templateUrl: './von-ban-hang.component.html',
    styleUrls: ['./von-ban-hang.component.scss',
    ],
})
export class VonBanHangComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    id: string;
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
    newDate = new Date();
    maDviTien: string;
    checkChild: boolean;
    checkParent: boolean;
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    saveStatus = false;
    submitStatus = false;
    passStatus = false;
    approveStatus = false;
    copyStatus = false;
    editMoneyUnit = false;
    isDataAvailable = false;
    statusEdit = true;
    isFirstSave = true;
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
                await this.submitReport().then(() => {
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
        if (this.checkParent) {
            return this.trangThais.find(e => e.id == this.ttNhan.trangThai).tenDm;
        } else {
            return this.trangThais.find(e => e.id == this.ttGui.trangThai).tenDm;
        }
    }

    async initialization() {
        //lay id cua de nghi
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        //lay danh sach danh muc
        await this.danhMuc.dMDviCon().toPromise().then(
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
            this.isFirstSave = true;
            this.ttGui.trangThai = Utils.TT_BC_1;
            this.ttNhan.trangThai = Utils.TT_BC_1;
            this.maDviTien = '1';
            this.checkChild = true;
            this.checkParent = false;
            this.maDviTao = this.userInfo?.MA_DVI;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.ngayLapTemp = this.data.ngayLap;
            this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
            this.capVonMuaBanTtthService.maNopTienVon().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        const str = this.userService.isCuc() ? 'CKV' : 'CC';
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
        this.ttGuiCache = this.ttGui;
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (this.checkChild) {
            this.ttGui.status = !(Utils.statusSave.includes(this.ttGui.trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_NTV_BH));
            this.ttNhan.status = true;
            this.saveStatus = Utils.statusSave.includes(this.ttGui.trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_NTV_BH);
            this.submitStatus = Utils.statusApprove.includes(this.ttGui.trangThai) && this.userService.isAccessPermisson(CVMB.APPROVE_REPORT_NTV_BH);
            this.passStatus = Utils.statusDuyet.includes(this.ttGui.trangThai) && this.userService.isAccessPermisson(CVMB.DUYET_REPORT_NTV_BH);
            this.approveStatus = Utils.statusPheDuyet.includes(this.ttGui.trangThai) && this.userService.isAccessPermisson(CVMB.PHE_DUYET_REPORT_NTV_BH);
            this.copyStatus = Utils.statusCopy.includes(this.ttGui.trangThai) && this.userService.isAccessPermisson(CVMB.COPY_REPORT_NTV_BH);
        }
        if (this.checkParent) {
            this.ttNhan.status = !(Utils.statusSave.includes(this.ttNhan.trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_GNV_BH));
            this.ttGui.status = true;
            this.saveStatus = Utils.statusSave.includes(this.ttNhan.trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_GNV_BH);
            this.submitStatus = Utils.statusApprove.includes(this.ttNhan.trangThai) && this.userService.isAccessPermisson(CVMB.APPROVE_REPORT_GNV_BH) && !this.isFirstSave;
            this.passStatus = Utils.statusDuyet.includes(this.ttNhan.trangThai) && this.userService.isAccessPermisson(CVMB.DUYET_REPORT_GNV_BH);
            this.approveStatus = Utils.statusPheDuyet.includes(this.ttNhan.trangThai) && this.userService.isAccessPermisson(CVMB.PHE_DUYET_REPORT_GNV_BH);
            this.copyStatus = false;
        }
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
        await this.capVonMuaBanTtthService.ctietVonMuaBan(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.statusEdit = false;
                    this.maDviTao = data.data.maDvi;
                    this.checkChild = this.maDviTao == this.userInfo?.MA_DVI;
                    this.checkParent = this.donVis.findIndex(e => e.maDvi == this.maDviTao) != -1;
                    this.maDviTien = data.data.maDviTien;
                    this.maNopTien = data.data.maNopTienVon;
                    this.ngayLapTemp = data.data.ngayLap;
                    this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
                    this.ttNhan.ngayNhan = data.data.ngayNhan;
                    this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    if (!this.checkParent) {
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
                    this.ttGui.trangThai = data.data.trangThai;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.ttNhan.trangThai = data.data.trangThaiDviCha;
                    this.ttGuiCache = this.ttGui;
                    this.ttNhan.thuyetMinh = data.data.thuyetMinhDviCha;
                    this.ttGui.lstFiles = data.data.lstFileGuis;
                    this.ttGui.listFile = [];
                    this.ttNhan.lstFiles = data.data.lstFileNhans;
                    this.ttNhan.listFile = [];
                    if (!this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
                        this.isFirstSave = true;
                    } else {
                        this.isFirstSave = false;
                    }
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

    async submitReport() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây lỗi dữ liệu)',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 500,
            nzOnOk: () => {
                this.onSubmit(Utils.TT_BC_2, '')
            },
        });
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
            if (!this.checkParent) {
                requestGroupButtons.maLoai = "0";
            } else {
                requestGroupButtons.maLoai = "1";
            }
            this.spinner.show();
            await this.capVonMuaBanTtthService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    if (!this.checkParent) {
                        this.ttGui.trangThai = mcn;
                        this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                        this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                        this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    } else {
                        this.ttNhan.trangThai = mcn;
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
        if (this.checkParent) {
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
            trangThai: this.ttGui.trangThai,
            trangThaiDviCha: this.ttNhan.trangThai,
            thuyetMinh: this.ttGui.thuyetMinh,
            thuyetMinhDviCha: this.ttNhan.thuyetMinh,
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

    changeDate() {
        this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
    }

    changeModel() {
        this.ttGuiCache.soTien = sumNumber([this.ttGuiCache.nopThue, this.ttGuiCache.ttChoDviHuong]);
    }

    async doCopy() {
        let maCvUvNew: string;
        await this.capVonMuaBanTtthService.maNopTienVon().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    const str = this.userService.isCuc() ? 'CKV' : 'CC';
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

    statusClass() {
        const trangThai = this.checkParent ? this.ttNhan.trangThai : this.ttGui.trangThai;
        if (Utils.statusSave.includes(trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
