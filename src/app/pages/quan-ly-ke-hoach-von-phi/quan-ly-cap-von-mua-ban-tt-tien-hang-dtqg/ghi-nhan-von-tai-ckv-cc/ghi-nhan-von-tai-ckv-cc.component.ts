import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DON_VI_TIEN, KHOAN_MUC, LA_MA, LOAI_VON, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DataService } from '../data.service';
import { TRANG_THAI_TIM_KIEM_CON } from '../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';


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
    selector: 'app-ghi-nhan-von-tai-ckv-cc',
    templateUrl: './ghi-nhan-von-tai-ckv-cc.component.html',
    styleUrls: ['./ghi-nhan-von-tai-ckv-cc.component.scss',
    ],
})
export class GhiNhanVonTaiCkvCcComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    loai: any;
    userInfo: any;
    //thong tin chung bao cao
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
    trangThaiBanGhi: string = "1";
    newDate = new Date();
    maDviTien: string;
    thuyetMinh: string;
    //danh muc
    donVis: any[] = [];
    loaiVons: any[] = LOAI_VON;
    trangThais: any[] = TRANG_THAI_TIM_KIEM_CON;
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status: boolean = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusBtnCopy: boolean;
    allChecked = false;
    //khac
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    //beforeUpload: any;
    listIdFilesDelete: any = [];                        // id file luc call chi tiet

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
        //lay thong tin user
        let userName = this.userService.getUserName();
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

        await this.getDetailReport();

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
            && (ROLE_CAN_BO.includes(userRole))) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkParent = false;
        let checkChirld = false;
        let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
        if (dVi && dVi.maDvi == this.userInfo.dvql) {
            checkChirld = true;
        }
        if (dVi && dVi.maDviCha == this.userInfo.dvql) {
            checkParent = true;
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
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    }

    //download file về máy tính
    async downloadFile(id: string) {
        let file!: File;
        file = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            let fileAttach = this.lstFiles.find(element => element?.id == id);
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
                    this.ttGui.soTien = divMoney(data.data.soTien, this.maDviTien);
                    this.ttGui.nopThue = divMoney(data.data.nopThue, this.maDviTien);
                    this.ttGui.ttChoDviHuong = divMoney(data.data.ttChoDviHuong, this.maDviTien);
                    this.ttGui.soTienBangChu = data.data.soTienBangChu;
                    this.ttNhan.taiKhoanNhan = data.data.tkNhan;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.trangThaiBanGhi = data.data.trangThai;
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
        this.spinner.hide();
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
        //get list file url
        let listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }
        // gui du lieu trinh duyet len server
        let request = {
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
            soTien: mulMoney(this.ttGui.soTien, this.maDviTien),
            nopThue: mulMoney(this.ttGui.nopThue, this.maDviTien),
            ttChoDviHuong: mulMoney(this.ttGui.ttChoDviHuong, this.maDviTien),
            soTienBangChu: this.ttGui.soTienBangChu,
            tkNhan: this.ttNhan.taiKhoanNhan,
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
        };

        this.spinner.show();
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
        this.spinner.hide();
    }

    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
    }

    close() {
        if (!this.loai) {
            this.loai = "0";
        }
        this.router.navigate([
            '/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/ghi-nhan-tai-cuc-kv-chi-cuc/' + this.loai
        ]);
    }

    async doCopy() {

    }

    getMaDviTien() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    modelChange() {
        this.ngayNhan = this.datePipe.transform(this.ttNhan.ngayNhan, Utils.FORMAT_DATE_STR);
    }



}
