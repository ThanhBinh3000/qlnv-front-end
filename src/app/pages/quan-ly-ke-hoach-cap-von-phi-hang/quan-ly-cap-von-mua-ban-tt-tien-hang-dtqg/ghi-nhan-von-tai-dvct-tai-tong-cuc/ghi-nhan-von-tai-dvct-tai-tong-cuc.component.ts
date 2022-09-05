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
import { displayNumber, divMoney, DON_VI_TIEN, exchangeMoney, LOAI_VON, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import { CAP_VON_MUA_BAN, MAIN_ROUTE_CAPVON } from '../../quan-ly-ke-hoach-von-phi-hang.constant';
import { DataService } from 'src/app/services/data.service';
import { TRANG_THAI_TIM_KIEM_CON } from '../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';


export class ItemGui {
    noiDung: string;
    maNguonNs: number;
    maChuong: number;
    maNdkt: number;
    soTien: number;
    soTienChu: string;
    taiKhoan: number;
}

export class ItemNhan {
    ngayNhan: string;
    taiKhoanNhan: string;
}

@Component({
    selector: 'app-ghi-nhan-von-tai-dvct-tai-tong-cuc',
    templateUrl: './ghi-nhan-von-tai-dvct-tai-tong-cuc.component.html',
    styleUrls: ['./ghi-nhan-von-tai-dvct-tai-tong-cuc.component.scss',
    ],
})
export class GhiNhanVonTaiDvctTaiTongCucComponent implements OnInit {
    //thong tin dang nhap
    id: string;
    loai: string;
    userInfo: any;
    //thong tin chung bao cao
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
    moneyUnit: string;
    thuyetMinh: string;
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM_CON;
    loaiVons: any[] = LOAI_VON;
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status = false;
    statusEdit = true;
    statusBtnDel: boolean;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusBtnCopy: boolean;
    statusBtnPrint: boolean;
    statusBtnGiao: boolean;
    statusBtnBtc: boolean;
    allChecked = false;
    //khac
    listId = '';
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    //beforeUpload: any;
    listIdFilesDelete: string[] = [];                        // id file luc call chi tiet
    formatter = value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;

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
        this.spinner.show();
        //lay thong tin user
        const userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        this.maDonViTao = this.userInfo?.dvql;

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
            this.maDonViTao = this.userInfo?.dvql;
            this.maDviTien = '3';
            this.moneyUnit = this.maDviTien;
            await this.dataSource.currentData.subscribe(obj => {
                this.loaiVon = obj?.loaiCap;
                this.soLenhChiTien = obj?.soLenhChiTien;
                this.ngayLapTemp = obj?.ngayLap;
                this.ngayLap = this.datePipe.transform(this.ngayLapTemp, Utils.FORMAT_DATE_STR);
            })
            this.quanLyVonPhiService.maCapVonUng().toPromise().then(
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
            && (ROLE_CAN_BO.includes(userRole))) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkChirld = false;
        const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
        if (dVi && dVi.maDvi == this.userInfo.dvql) {
            checkChirld = true;
        }

        const utils = new Utils();
        this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, userRole);
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
        await this.quanLyVonPhiService.ctietVonMuaBan(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.statusEdit = false;
                    this.maCvUv = data.data.maCapUngVonTuCapTren;
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
                    this.ttGui.soTien = divMoney(data.data.soTien, this.maDviTien);
                    this.ttGui.soTienChu = data.data.soTienBangChu;
                    this.ttGui.taiKhoan = data.data.tuTk;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.ttGuiCache = this.ttGui;
                    this.lstFiles = data.data.lstFileNhans;
                    this.listFile = [];
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
            await this.quanLyVonPhiService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
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
        if (!this.maDviTien || !this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.statusEdit) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        // gui du lieu trinh duyet len server
        if (mulMoney(this.ttGui.soTien, this.maDviTien) > MONEY_LIMIT) {
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
            soTien: mulMoney(this.ttGui.soTien, this.maDviTien),
            soTienBangChu: this.ttGui.soTienChu,
            tuTk: this.ttGui.taiKhoan,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
        };

        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiVonMuaBan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.router.navigate([
                            MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/ghi-nhan-von-tai-dvct-tai-tong-cuc/0/'
                            + data.data.id
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

    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
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

    close() {
        if (!this.loai) {
            this.loai = "0";
        }
        this.router.navigate([
            MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/ghi-nhan-tai-tong-cuc/' + this.loai
        ]);
    }

    getMaDviTien() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
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
        await this.quanLyVonPhiService.maCapVonUng().toPromise().then(
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
        if (!this.maDviTien || !this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.statusEdit) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        // gui du lieu trinh duyet len server
        if (mulMoney(this.ttGui.soTien, this.maDviTien) > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        // gui du lieu trinh duyet len server
        const request = {
            id: null,
            maLoai: '1',
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
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
            soTien: mulMoney(this.ttGui.soTien, this.maDviTien),
            soTienBangChu: this.ttGui.soTienChu,
            tuTk: this.ttGui.taiKhoan,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: "1",
            thuyetMinh: "",
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
        return displayNumber(num);
    }

    changeMoney() {
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_MONEY);
            return;
        }
        this.ttGui.soTien = exchangeMoney(this.ttGui.soTien, this.maDviTien, this.moneyUnit);
        this.ttGuiCache.soTien = this.ttGui.soTien;
        this.maDviTien = this.moneyUnit;
    }

}
