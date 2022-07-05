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
import { divMoney, DON_VI_TIEN, LOAI_VON, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DataService } from '../data.service';
import { TRANG_THAI_TIM_KIEM_CON } from '../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

export class ItemData {
    id: string;
    stt: string;
    dviNhan: string;
    ngayLap: string;
    ngayLapTemp: string;
    loai: string;
    ngayNhan: string;
    ngayNhanTemp: string;
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
    id: string;
    loai: string;
    userInfo: any;
    //thong tin chung bao cao
    maCvUvDuoi: string;
    maCvUvTren: string;
    ngayTao: string;
    ngayTaoTemp: string;
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
    trangThais: any[] = TRANG_THAI_TIM_KIEM_CON;
    loaiVons: any[] = LOAI_VON;
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
    //trang thai cac nut
    status = false;
    statusBtnDel;
    statusBtnSave = true;                      // trang thai an/hien nut luu
    statusBtnApprove = true;                   // trang thai an/hien nut trinh duyet
    statusBtnTBP = true;                       // trang thai an/hien nut truong bo phan
    statusBtnLD = true;                        // trang thai an/hien nut lanh dao
    statusBtnCopy = true;                      // trang thai copy
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
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
            console.log({ id: id, fileName: file?.name });
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
        private dataSource: DataService,
    ) { }

    async ngOnInit() {
        //lay id cua ban ghi
        this.loai = this.routerActive.snapshot.paramMap.get('loai');
        this.id = this.routerActive.snapshot.paramMap.get('id');
        //lay thong tin user
        const userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.donVis = res.data;
                    this.unitChilds = this.donVis.filter(e => e?.maDviCha == this.userInfo?.dvql);
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
            await this.dataSource.currentData.subscribe(obj => {
                this.maCvUvTren = obj?.maCvUv;
            })
            if (!this.maCvUvTren) {
                this.close();
            }
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
            this.unitChilds.forEach(item => {
                this.lstCtietBcao.push({
                    id: uuid.v4() + 'FE',
                    stt: '',
                    dviNhan: item.maDvi,
                    ngayLap: null,
                    ngayLapTemp: "",
                    loai: "",
                    ngayNhan: null,
                    ngayNhanTemp: "",
                    noiDung: "",
                    maNguonNs: "",
                    nienDoNs: "",
                    tongSoTien: 0,
                    nopThue: 0,
                    ttChoDviHuong: 0,
                    soTienBangChu: "",
                    checked: false,
                })
            })
            this.updateEditCache();
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
        const userRole = this.userInfo?.roles[0]?.code;
        if ((this.trangThai == Utils.TT_BC_1 || this.trangThai == Utils.TT_BC_3 || this.trangThai == Utils.TT_BC_5)
            && (ROLE_CAN_BO.includes(userRole))) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkChirld = false;
        const dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (dVi && dVi.maDvi == this.userInfo.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
        this.statusBtnDel = utils.getRoleDel(this.trangThai, checkChirld, userRole);
        this.statusBtnSave = utils.getRoleSave(this.trangThai, checkChirld, userRole);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThai, checkChirld, userRole);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThai, checkChirld, userRole);
        this.statusBtnLD = utils.getRoleLD(this.trangThai, checkChirld, userRole);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThai, checkChirld, userRole);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maCvUvDuoi);
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
        this.spinner.show();
        await this.quanLyVonPhiService.ctietCapVon(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.maDviTao = data.data.maDvi;
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao = data.data.capUngVonCtiets;
                    this.lstCtietBcao.forEach(item => {
                        item.ngayLapTemp = this.datePipe.transform(item.ngayLap, Utils.FORMAT_DATE_STR);
                        item.ngayNhanTemp = this.datePipe.transform(item.ngayNhan, Utils.FORMAT_DATE_STR);
                        item.tongSoTien = divMoney(item.tongSoTien, this.maDviTien);
                        item.nopThue = divMoney(item.nopThue, this.maDviTien);
                        item.ttChoDviHuong = divMoney(item.ttChoDviHuong, this.maDviTien);
                    })
                    this.maCvUvDuoi = data.data.maCapUngVonChoCapDuoi;
                    this.maCvUvTren = data.data.maCapUngVonTuCapTren;
                    this.ngayTaoTemp = data.data.ngayTao;
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
                maLoai: "0",
            };
            this.spinner.show();
            await this.quanLyVonPhiService.trinhDuyetCapVon(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThai = mcn;
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_3 || mcn == Utils.TT_BC_5) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    }
                    if (mcn == Utils.TT_BC_7) {
                        this.capToanBo();
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
        let checkMoneyRange = true;
        let checkSave = true;

        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
                return;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
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

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            if (mulMoney(item.tongSoTien, this.maDviTien) > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                tongSoTien: mulMoney(item.tongSoTien, this.maDviTien),
                nopThue: mulMoney(item.nopThue, this.maDviTien),
                ttChoDviHuong: mulMoney(item.ttChoDviHuong, this.maDviTien),
            })
        })

        if (!checkMoneyRange) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })
        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: listFile,
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
                            '/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/cap-von-ung-von-cho-don-vi-cap-duoi/0/' + data.data.id,
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
                        await this.getDetailReport();
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
        if (!this.editCache[id].data.dviNhan ||
            !this.editCache[id].data.loai ||
            (!this.editCache[id].data.ttChoDviHuong && this.editCache[id].data.ttChoDviHuong !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        if (this.editCache[id].data.ttChoDviHuong < 0 ||
            this.editCache[id].data.nopThue < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }

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

    changeDate(id: string) {
        this.editCache[id].data.ngayLapTemp = this.datePipe.transform(this.editCache[id].data.ngayLap, Utils.FORMAT_DATE_STR);
        this.editCache[id].data.ngayNhanTemp = this.datePipe.transform(this.editCache[id].data.ngayNhan, Utils.FORMAT_DATE_STR);
    }

    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName(id: string) {
        return this.trangThais.find(e => e.id == id)?.tenDm;
    }

    getMaDviTien() {
        return this.dviTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    close() {
        if (!this.loai) {
            this.loai = "0";
        }
        this.router.navigate([
            'qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/danh-sach-cap-von-ung-von-cho-don-vi-cap-duoi/' + this.loai
        ])
    }

    async capToanBo() {
        const request: any[] = [];
        this.lstCtietBcao.forEach(item => {
            request.push({
                id: null,
                fileDinhKemNhans: [],
                listIdDeleteFileNhans: [],
                maLoai: "1",
                maDvi: item.dviNhan,
                maDviTien: this.maDviTien,
                maCapUngVonTuCapTren: this.maCvUvDuoi,
                ngayLap: this.ngayTaoTemp,
                ngayNhan: null,
                loaiCap: item.loai,
                noiDung: item.noiDung,
                maNguonNs: item.maNguonNs,
                nienDoNs: item.nienDoNs,
                soTien: mulMoney(item.tongSoTien, this.maDviTien),
                nopThue: mulMoney(item.nopThue, this.maDviTien),
                ttChoDviHuong: mulMoney(item.ttChoDviHuong, this.maDviTien),
                soTienBangChu: item.soTienBangChu,
                tkNhan: null,
                trangThai: "1",
                thuyetMinh: "",
            })
        })
        this.quanLyVonPhiService.capTatCa(request).toPromise().then(
            async (data) => {
                if (data.statusCode != 0) {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    async showDialogCopy() {
        const requestReport = {
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
        let danhSach = [];
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
        const obj = {
            maCvUv: this.maCvUvTren,
            danhSach: danhSach,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Cấp vốn ứng cho đơn vị cấp dưới',
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
        let maCvUvNew: string;
        await this.quanLyVonPhiService.maCapVonUng().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maCvUvNew = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        let checkMoneyRange = true;
        let checkSave = true;

        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
                return;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            if (mulMoney(item.tongSoTien, this.maDviTien) > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                tongSoTien: mulMoney(item.tongSoTien, this.maDviTien),
                nopThue: mulMoney(item.nopThue, this.maDviTien),
                ttChoDviHuong: mulMoney(item.ttChoDviHuong, this.maDviTien),
                id: null,
            })
        })

        if (!checkMoneyRange) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: null,
            fileDinhKemGuis: [],
            listIdDeleteFileGuis: [],
            capUngVonCtiets: lstCtietBcaoTemp,
            maCapUngVonChoCapDuoi: maCvUvNew,
            maCapUngVonTuCapTren: response.maCvUv,
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            trangThai: "1",
            thuyetMinh: "",
        }));

        this.spinner.show();
        this.quanLyVonPhiService.taoMoiCapVon(request).toPromise().then(
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
