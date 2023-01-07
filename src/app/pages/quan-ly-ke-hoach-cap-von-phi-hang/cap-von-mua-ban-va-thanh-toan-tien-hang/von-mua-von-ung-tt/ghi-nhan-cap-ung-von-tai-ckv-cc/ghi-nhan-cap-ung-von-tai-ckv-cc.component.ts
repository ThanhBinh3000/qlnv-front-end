import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { CVMB, displayNumber, DON_VI_TIEN, exchangeMoney, LOAI_VON, numberOnly, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';

export class ItemGui {
    loaiCap: string;
    noiDung: string;
    maNguonNs: string;
    nienDoNs: string;
    soTien: number;
    soTienBangChu: string;
    nopThue: number;
    ttChoDviHuong: number;
}

export class ItemNhan {
    ngayNhan: string;
    taiKhoanNhan: string;
}

@Component({
    selector: 'app-ghi-nhan-cap-ung-von-tai-ckv-cc',
    templateUrl: './ghi-nhan-cap-ung-von-tai-ckv-cc.component.html',
    styleUrls: ['./ghi-nhan-cap-ung-von-tai-ckv-cc.component.scss'],
})
export class GhiNhanCapUngVonTaiCkvCcComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    id: string;
    maCvUv: string;
    maCvUvTren: string;
    ngayTao: string;
    maDonViTao: string;
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
    loaiVons: any[] = LOAI_VON;
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
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
    isFirstSave = true;
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
        return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
    }

    async initialization() {
        //lay id cua de nghi
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        await this.getDetailReport();
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
        this.submitStatus = this.getBtnStatus(Utils.statusApprove, CVMB.APPROVE_REPORT_GNV, checkChirld) && !this.isFirstSave;
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
                    this.maDonViTao = data.data.maDvi;
                    this.maDviTien = data.data.maDviTien;
                    this.maCvUv = data.data.maCapUngVonTuCapTren;
                    this.ngayLapTemp = data.data.ngayLap;
                    this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
                    this.ttNhan.ngayNhan = data.data.ngayNhan;
                    this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.ttGui.loaiCap = data.data.loaiCap;
                    this.ttGui.noiDung = data.data.noiDung;
                    this.ttGui.maNguonNs = data.data.maNguonNs;
                    this.ttGui.nienDoNs = data.data.nienDoNs;
                    this.ttGui.soTien = data.data.soTien;
                    this.ttGui.nopThue = data.data.nopThue;
                    this.ttGui.ttChoDviHuong = data.data.ttChoDviHuong;
                    this.ttGui.soTienBangChu = data.data.soTienBangChu;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.lstFiles = data.data.lstFileNhans;
                    this.listFile = [];
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
            nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây mất dữ liệu)',
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
                maLoai: "0",
            };
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

        if (!numberOnly(this.ttNhan.taiKhoanNhan)) {
            this.notification.warning(MESSAGE.WARNING, 'Trường chỉ chứa ký tự số');
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
            fileDinhKemNhans: listFile,
            listIdDeleteFileNhans: this.listIdFilesDelete,
            maLoai: "1",
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maCapUngVonTuCapTren: this.maCvUv,
            ngayLap: this.ngayLapTemp,
            ngayNhan: this.ttNhan.ngayNhan,
            loaiCap: this.ttGui.loaiCap,
            noiDung: this.ttGui.noiDung,
            maNguonNs: this.ttGui.maNguonNs,
            nienDoNs: this.ttGui.nienDoNs,
            soTien: this.ttGui.soTien,
            nopThue: this.ttGui.nopThue,
            ttChoDviHuong: this.ttGui.ttChoDviHuong,
            soTienBangChu: this.ttGui.soTienBangChu,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
        };
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

    modelChange() {
        this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
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
