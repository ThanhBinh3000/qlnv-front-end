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
import * as uuid from 'uuid';
import { CVMB, displayNumber, DON_VI_TIEN, exchangeMoney, LOAI_VON, MONEY_LIMIT, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';

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
    selector: 'app-cap-ung-von-cho-don-vi-cap-duoi',
    templateUrl: './cap-ung-von-cho-don-vi-cap-duoi.component.html',
    styleUrls: ['./cap-ung-von-cho-don-vi-cap-duoi.component.scss'],
})
export class CapUngVonChoDonViCapDuoiComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    id: string;
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
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    loaiVons: any[] = LOAI_VON;
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
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

    //khac 
    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

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
        return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
    }

    async initialization() {
        //lay id cua de nghi
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        //lay danh sach danh muc
        await this.danhMuc.dMDviCon().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.donVis = res.data;
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
            this.trangThai = Utils.TT_BC_1;
            this.maDviTao = this.userInfo?.MA_DVI;
            this.maDviTien = '1';
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.maCvUvTren = this.data?.maCvUv;

            this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
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
            this.donVis.forEach(item => {
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
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (Utils.statusSave.includes(this.trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_CV)) {
            this.status = false;
        } else {
            this.status = true;
        }
        const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
        this.saveStatus = this.getBtnStatus(Utils.statusSave, CVMB.EDIT_REPORT_CV, checkChirld);
        this.submitStatus = this.getBtnStatus(Utils.statusApprove, CVMB.APPROVE_REPORT_CV, checkChirld);
        this.passStatus = this.getBtnStatus(Utils.statusDuyet, CVMB.DUYET_REPORT_CV, checkChirld);
        this.approveStatus = this.getBtnStatus(Utils.statusPheDuyet, CVMB.PHE_DUYET_REPORT_CV, checkChirld);
        this.copyStatus = this.getBtnStatus(Utils.statusCopy, CVMB.COPY_REPORT_CV, checkChirld);
    }

    getBtnStatus(status: string[], role: string, check: boolean) {
        return status.includes(this.trangThai) && this.userService.isAccessPermisson(role) && check;
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
        await this.capVonMuaBanTtthService.ctietCapVon(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.maDviTao = data.data.maDvi;
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao = data.data.capUngVonCtiets;
                    this.lstCtietBcao.forEach(item => {
                        item.ngayLapTemp = this.datePipe.transform(item.ngayLap, Utils.FORMAT_DATE_STR);
                        item.ngayNhanTemp = this.datePipe.transform(item.ngayNhan, Utils.FORMAT_DATE_STR);
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
            await this.capVonMuaBanTtthService.trinhDuyetCapVon(requestGroupButtons).toPromise().then(async (data) => {
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
            if (item.tongSoTien > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
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
        if (!this.id) {
            this.capVonMuaBanTtthService.taoMoiCapVon(request).toPromise().then(
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
            this.capVonMuaBanTtthService.updateCapVon(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
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
                soTien: item.tongSoTien,
                nopThue: item.nopThue,
                ttChoDviHuong: item.ttChoDviHuong,
                soTienBangChu: item.soTienBangChu,
                tkNhan: null,
                trangThai: "1",
                thuyetMinh: "",
            })
        })
        this.capVonMuaBanTtthService.capTatCa(request).toPromise().then(
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
            maDvi: this.userInfo?.MA_DVI,
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
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(requestReport).toPromise().then(
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
        await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
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
            if (item.tongSoTien > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
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
        this.capVonMuaBanTtthService.taoMoiCapVon(request).toPromise().then(
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
        return this.dviTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    statusClass() {
        if (Utils.statusSave.includes(this.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
