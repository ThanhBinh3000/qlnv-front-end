import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, divMoney, DON_VI_TIEN, KHOAN_MUC, LA_MA, LOAI_DE_NGHI, LOAI_VON, MONEY_LIMIT, mulMoney, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
    id: any;
    stt: string;
    dviNhan: string;
    ngayLap: string;
    loai: string;
    ngayNhan: string;
    noiDung: string;
    maNguonNs: string;
    nienDoNs: string;
    tongSoTien: number;
    nopThue: number;
    ttChoDviHuong: number;
    soTienBangChu: string;
    checked: boolean;
}

@Component({
    selector: 'app-cap-von-ung-von-cho-don-vi-cap-duoi',
    templateUrl: './cap-von-ung-von-cho-don-vi-cap-duoi.component.html',
    styleUrls: ['./cap-von-ung-von-cho-don-vi-cap-duoi.component.scss',
    ],
})
export class CapVonUngVonChoDonViCapDuoiComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    userInfo: any;
    //thong tin chung bao cao
    maCvUvDuoi: string;
    maCvUvTren: string;
    ngayTao: string;
    ngayTrinhDuyet: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    trangThai: string;
    maDviTien: string;
    maDviTao: string;
    thuyetMinh: string;
    newDate = new Date();
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    unitChilds: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    loaiVons: any[] = LOAI_VON;
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
    //trang thai cac nut
    status: boolean = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
    statusBtnApprove: boolean = true;                   // trang thai an/hien nut trinh duyet
    statusBtnTBP: boolean = true;                       // trang thai an/hien nut truong bo phan
    statusBtnLD: boolean = true;                        // trang thai an/hien nut lanh dao
    statusBtnGuiDVCT: boolean = true;                   // trang thai nut gui don vi cap tren
    statusBtnDVCT: boolean = true;                      // trang thai nut don vi cap tren
    statusBtnCopy: boolean = true;                      // trang thai copy
    statusBtnPrint: boolean = true;                     // trang thai print
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: any = [];

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

    //khac 
    allChecked = false;                         // check all checkbox
    indeterminate = true;                       // properties allCheckBox
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
        this.maCvUvTren = this.routerActive.snapshot.paramMap.get('maTren');
        //lay thong tin user
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.donVis = res.data;
                    this.unitChilds = this.donVis.filter(e => e?.parent?.maDvi == this.userInfo?.dvql);
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            },
        );
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.trangThai = '1';
            this.maDviTao = this.userInfo?.dvql;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.spinner.show();
            this.quanLyVonPhiService.maCapVonUng().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maCvUvDuoi = res.data;
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
        if (this.trangThai == Utils.TT_BC_1 ||
            this.trangThai == Utils.TT_BC_3 ||
            this.trangThai == Utils.TT_BC_5 ||
            this.trangThai == Utils.TT_BC_8 ||
            this.trangThai == Utils.TT_BC_10) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkParent = false;
        let checkChirld = false;
        let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (dVi && dVi.maDvi == this.userInfo.dvql) {
            checkChirld = true;
        }
        if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
            checkParent = true;
        }
        let roleNguoiTao = this.userInfo?.roles[0]?.code;
        const utils = new Utils();
        this.statusBtnSave = utils.getRoleSave(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThai, checkChirld, roleNguoiTao);
        if (this.trangThai == Utils.TT_BC_2) {
            this.statusBtnLD = utils.getRoleLD(Utils.TT_BC_4, checkChirld, roleNguoiTao);
        } else {
            this.statusBtnLD = utils.getRoleLD(this.trangThai, checkChirld, roleNguoiTao);
        }

        this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnDVCT = utils.getRoleDVCT(this.trangThai, checkParent, roleNguoiTao);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnPrint = utils.getRolePrint(this.trangThai, checkChirld, roleNguoiTao);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maCvUvDuoi);
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
        await this.quanLyVonPhiService.ctietCapVon(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.lstCtietBcao = data.data.capUngVonCtiets;
                    this.lstCtietBcao.forEach(item => {
                        item.ngayLap = this.datePipe.transform(item.ngayLap, Utils.FORMAT_DATE_STR);
                        item.ngayNhan = this.datePipe.transform(item.ngayNhan, Utils.FORMAT_DATE_STR);
                    })
                    this.maDviTao = data.data.maDvi;
                    this.maDviTien = data.data.maDviTien;
                    this.maCvUvDuoi = data.data.maCapUngVonChoCapDuoi;
                    this.maCvUvTren = data.data.maCapUngVonTuCapTren;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.trangThai = data.data.trangThai;
                    this.thuyetMinh = data.data.thuyetMinh,
                        this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
                    this.updateEditCache();
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
            };
            this.spinner.show();
            await this.quanLyVonPhiService.trinhDuyetCapVon(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThai = mcn;
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5) {
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
        //get list file url
        let listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }
        let lstCtietBcaoTemp = [];
        this.lstCtietBcao.forEach(item => {
            if (item.id.length == 38) {
                lstCtietBcaoTemp.push({
                    ...item,
                    id: null,
                    ngayLap: this.datePipe.transform(item.ngayLap, 'yyyy-MM-dd'),
                    ngayNhan: this.datePipe.transform(item.ngayNhan, 'yyyy-MM-dd'),
                })
            } else {
                lstCtietBcaoTemp.push({
                    ...item,
                    ngayLap: this.datePipe.transform(item.ngayLap, 'yyyy-MM-dd'),
                    ngayNhan: this.datePipe.transform(item.ngayNhan, 'yyyy-MM-dd'),
                });
            }

        })
        // gui du lieu trinh duyet len server
        let request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: [],
            listIdDeleteFiles: this.listIdFilesDelete,
            capUngVonCtiets: lstCtietBcaoTemp,
            maCapUngVonChoCapDuoi: this.maCvUvDuoi,
            maCapUngVonTuCapTren: this.maCvUvTren,
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            trangThai: this.trangThai,
            thuyetMinh: this.thuyetMinh,
        }));

        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.taoMoiCapVon(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                            this.router.navigate([
                                '/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/cap-von-ung-von-cho-don-vi-cap-duoi/' + data.data.id,
                            ])
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.quanLyVonPhiService.updateCapVon(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        this.getDetailReport();
                        this.getStatusButton();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
        this.spinner.hide();
    }

    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: '',
            dviNhan: '',
            ngayLap: "",
            loai: "",
            ngayNhan: "",
            noiDung: "",
            maNguonNs: "",
            nienDoNs: "",
            tongSoTien: 0,
            nopThue: 0,
            ttChoDviHuong: 0,
            soTienBangChu: "",
            checked: false,
        }

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // xoa dong
    deleteById(id: any): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    }

    // xóa với checkbox
    deleteSelected() {
        // delete object have checked = true
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
        this.allChecked = false;
    }

    // click o checkbox all
    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                ...item,
                checked: false
            }));
        }
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    redirectChiTieuKeHoachNam() {
        this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
        this.location.back()
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
        // if (!this.lstCTietBCao[index].maNdung) {
        //     this.deleteById(id);
        //     return;
        // }
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        // if (!this.editCache[id].data.maNdung ||
        //     !this.editCache[id].data.tenDan ||
        //     !this.editCache[id].data.maLoaiChi ||
        //     !this.editCache[id].data.maKhoanChi ||
        //     !this.editCache[id].data.maMucChi ||
        //     !this.editCache[id].data.maLoaiChiTx ||
        //     (!this.editCache[id].data.dtoanN && this.editCache[id].data.dtoanN !== 0) ||
        //     (!this.editCache[id].data.uocThienN && this.editCache[id].data.uocThienN !== 0) ||
        //     (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0) ||
        //     (!this.editCache[id].data.ncauChiN2 && this.editCache[id].data.ncauChiN2 !== 0)) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        //     return;
        // }

        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
    }

    // gan editCache.data == lstCTietBCao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.tongSoTien = this.editCache[id].data.nopThue + this.editCache[id].data.ttChoDviHuong;
    }

    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName(id: string) {
        return this.trangThais.find(e => e.id == id)?.tenDm;
    }

    close() {
        this.router.navigate([
            'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tim-kiem/0'
        ])
    }



}
