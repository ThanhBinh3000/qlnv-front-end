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
import { divMoney, DON_VI_TIEN, KHOAN_MUC, LA_MA, LOAI_VON, MONEY_LIMIT, mulMoney, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';


export class ItemGui {
    noiDung: string;
    soTien: number;
    ngayThanhToan: string;
}


@Component({
    selector: 'app-thanh-toan-cho-khach-hang',
    templateUrl: './thanh-toan-cho-khach-hang.component.html',
    styleUrls: ['./thanh-toan-cho-khach-hang.component.scss',
    ],
})
export class ThanhToanChoKhachHangComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    userInfo: any;
    //thong tin chung bao cao
    maThanhToan: string;
    maCvUv: string;
    ngayTao: string;
    ngayThanhToan: string;
    maDviTao: string;
    khachHang: string;
    ngayTrinhDuyet: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ttGui: ItemGui = new ItemGui();
    ttGuiCache: ItemGui = new ItemGui();
    thuyetMinh: string;
    trangThaiBanGhi: string = "1";
    newDate = new Date();
    maDviTien: string;
    //danh muc
    donVis: any[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status: boolean = false;
    statusEdit: boolean = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusBtnCopy: boolean;
    allChecked = false;
    //khac
    listId: string = '';
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
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
    ) { }

    async ngOnInit() {
        //lay id cua ban ghi
        this.id = this.routerActive.snapshot.paramMap.get('id');
        this.maCvUv = this.routerActive.snapshot.paramMap.get('maCvUv');
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
            this.maDviTao = this.userInfo?.dvql;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.spinner.show();
            this.quanLyVonPhiService.maThanhToan().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maThanhToan = res.data;
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
        if (
            this.trangThaiBanGhi == Utils.TT_BC_1 ||
            this.trangThaiBanGhi == Utils.TT_BC_3 ||
            this.trangThaiBanGhi == Utils.TT_BC_5 ||
            this.trangThaiBanGhi == Utils.TT_BC_8
        ) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkChirld = false;
        let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (dVi && dVi.maDvi == this.userInfo?.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
        this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maThanhToan);
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
                    this.maDviTao = data.data.maDvi;      
                    this.maDviTien = data.data.maDviTien;
                    this.maThanhToan = data.data.maThanhToan;
                    this.maCvUv = data.data.maCapUngVonTuCapTren;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.ttGui.noiDung = data.data.noiDung;
                    this.ttGui.soTien = data.data.soTien;
                    this.ttGui.ngayThanhToan = data.data.ngayThanhToan;
                    this.ngayThanhToan = this.datePipe.transform(this.ttGui.ngayThanhToan, Utils.FORMAT_DATE_STR); 
                    this.trangThaiBanGhi = data.data.trangThai; 
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
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
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
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        // gui du lieu trinh duyet len server
        if (mulMoney(this.ttGui.soTien, this.maDviTien) > MONEY_LIMIT){
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
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
            maLoai: "4",
            fileDinhKemGuis: this.lstFiles,
            listIdDeleteFileGuis: this.listIdFilesDelete,
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien, 
            maThanhToan: this.maThanhToan,
            maCapUngVonTuCapTren: this.maCvUv,
            ngayThanhToan: this.ttGui.ngayThanhToan,
            noiDung: this.ttGui.noiDung,
            soTien: this.ttGui.soTien,
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
                            'qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/thanh-toan-cho-khach-hang/'
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
        this.statusEdit = false;
        this.ttGui = this.ttGuiCache;
    }


    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName() {
        const utils = new Utils();
        return utils.getStatusName(this.trangThaiBanGhi);
    }

    close() {
        this.router.navigate([
            '/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/danh-sach-thanh-toan-cho-khach-hang/0'
        ]);
    }

    async doCopy(){
        
    }

    changeDate(){
        this.ngayThanhToan = this.datePipe.transform(this.ttGui.ngayThanhToan, Utils.FORMAT_DATE_STR);
    }

    getMaDviTien(){
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
