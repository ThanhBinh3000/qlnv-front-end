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
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { CAN_CU_GIA, CVNC, displayNumber, DON_VI_TIEN, exchangeMoney, LOAI_DE_NGHI, MONEY_LIMIT, NGUON_BAO_CAO, sumNumber, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
    id: string;
    maCucKv: string;
    vonCapThoc: number;
    vonUngThoc: number;
    tongSoThoc: number;
    giaoDuToanGao: number;
    vonCapGao: number;
    vonUngGao: number;
    tongSoGao: number;
    giaoDuToanMuoi: number;
    vonCapMuoi: number;
    vonUngMuoi: number;
    tongSoMuoi: number;
    capVonVttb: number;
    tcGiaoVonHoanUngNam: number;
    checked: boolean;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-tong-hop-tai-tong-cuc',
    templateUrl: './tong-hop-tai-tong-cuc.component.html',
    styleUrls: ['./tong-hop-tai-tong-cuc.component.scss',
    ],
})
export class TongHopTaiTongCucComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    id: string;
    maDeNghi: string;
    qdChiTieu: string;
    nguonBcao: string = Utils.THOP_TAI_TC;
    congVan: ItemCongVan;
    ngayTao: string;
    ngayTrinhDuyet: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    trangThai: string;
    maDviTao: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    maDviTien: string;
    tongSo: ItemData = {
        id: null,
        maCucKv: "",
        vonCapThoc: 0,
        vonUngThoc: 0,
        tongSoThoc: 0,
        giaoDuToanGao: 0,
        vonCapGao: 0,
        vonUngGao: 0,
        tongSoGao: 0,
        giaoDuToanMuoi: 0,
        vonCapMuoi: 0,
        vonUngMuoi: 0,
        tongSoMuoi: 0,
        capVonVttb: 0,
        tcGiaoVonHoanUngNam: 0,
        checked: false,
    };
    newDate = new Date();
    titleStatus: string;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    cucKhuVucs: any[] = [];
    dviTinhs: any[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_2,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_3,
            tenDm: "Từ chối duyệt",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Từ chối phê duyệt",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Phê duyệt",
        },
    ]
    nguonBcaos: any[] = NGUON_BAO_CAO;
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
    //trang thai cac nut
    status = false;
    saveStatus = true;
    submitStatus = true;
    passStatus = true;
    approveStatus = true;
    copyStatus = true;
    editMoneyUnit = false;
    isDataAvailable = false;
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

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.congVan = {
            fileName: file.name,
            fileSize: null,
            fileUrl: null,
        };
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
        private capVonNguonChiService: CapVonNguonChiService,
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
        this.titleStatus = this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
        this.spinner.hide();
    }

    async initialization() {
        //lay id cua de nghi
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        //lay danh muc don vi con
        await this.danhMuc.dMDviCon().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.cucKhuVucs = res.data;
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
            this.maDviTao = this.userInfo?.MA_DVI;
            this.maDviTien = '1';
            this.qdChiTieu = this.data?.qdChiTieu;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.cucKhuVucs.forEach(item => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + "FE",
                    maCucKv: item.maDvi,
                    checked: false,
                })
            })
            this.updateEditCache();
            this.capVonNguonChiService.maDeNghi().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maDeNghi = res.data;
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
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (Utils.statusSave.includes(this.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_SYNTHETIC_TC)) {
            this.status = false;
        } else {
            this.status = true;
        }
        const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
        this.saveStatus = this.getBtnStatus(Utils.statusSave, CVNC.EDIT_SYNTHETIC_TC, checkChirld);
        this.submitStatus = this.getBtnStatus(Utils.statusApprove, CVNC.APPROVE_SYNTHETIC_TC, checkChirld);;
        this.passStatus = this.getBtnStatus(Utils.statusDuyet, CVNC.DUYET_SYNTHETIC_TC, checkChirld);;
        this.approveStatus = this.getBtnStatus(Utils.statusPheDuyet, CVNC.PHE_DUYET_SYNTHETIC_TC, checkChirld);;
        this.copyStatus = this.getBtnStatus(Utils.statusCopy, CVNC.COPY_SYNTHETIC_TC, checkChirld);;
    }

    getBtnStatus(status: string[], role: string, check: boolean) {
        return status.includes(this.trangThai) && this.userService.isAccessPermisson(role) && check;
    }

    back() {
        const obj = {
            tabSelected: 'danhsach',
        }
        this.dataChange.emit(obj);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maDeNghi);
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

    //download file về máy tính
    async downloadFileCv() {
        if (this.congVan?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.congVan?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.congVan?.fileName);
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            const file: any = this.fileDetail;
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.quanLyVonPhiService.ctietDeNghiThop(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.total(-1, this.tongSo);
                    this.maDviTao = data.data.maDvi;
                    this.lstCtietBcao = data.data.thopTcCtiets;
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao.forEach(item => {
                        this.total(1, item);
                    })
                    this.updateEditCache();
                    this.maDeNghi = data.data.maDnghi;
                    this.qdChiTieu = data.data.soQdChiTieu;
                    this.congVan = data.data.congVan;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.trangThai = data.data.trangThai;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.lstFiles = data.data.lstFiles;
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
        if (!this.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            await this.capVonNguonChiService.trinhDuyetDeNghiTongHop(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThai = mcn;
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5) {
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
        if (this.tongSo.tongSoGao > MONEY_LIMIT ||
            this.tongSo.tongSoThoc > MONEY_LIMIT ||
            this.tongSo.tongSoMuoi > MONEY_LIMIT ||
            this.tongSo.capVonVttb > MONEY_LIMIT ||
            this.tongSo.tcGiaoVonHoanUngNam > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        const lstCTietBCaoTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCTietBCaoTemp.push({
                ...item,
            })
        })

        lstCTietBCaoTemp.forEach(item => {
            if (item.id.length == 38) {
                item.id = null;
            }
        })
        //get list file url
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

        const listFile = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }

        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: listFile,
            listIdDeleteFiles: this.listIdFilesDelete,
            thopTcCtiets: lstCTietBCaoTemp,
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            maDnghi: this.maDeNghi,
            loaiDnghi: this.nguonBcao,
            congVan: this.congVan,
            soQdChiTieu: this.qdChiTieu,
            trangThai: this.trangThai,
            thuyetMinh: this.thuyetMinh,
        }));
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                request.congVan = await this.uploadFile(file);
            }
        }
        if (!request.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        if (!this.id) {
            this.capVonNguonChiService.themMoiDnghiThop(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.id = data.data.id;
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
        } else {
            this.capVonNguonChiService.capNhatDnghiThop(request).toPromise().then(
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
        if (this.editCache[id].data.vonCapThoc < 0 ||
            this.editCache[id].data.vonUngThoc < 0 ||
            this.editCache[id].data.giaoDuToanGao < 0 ||
            this.editCache[id].data.vonUngGao < 0 ||
            this.editCache[id].data.vonCapGao < 0 ||
            this.editCache[id].data.giaoDuToanMuoi < 0 ||
            this.editCache[id].data.vonUngMuoi < 0 ||
            this.editCache[id].data.vonCapMuoi < 0 ||
            this.editCache[id].data.capVonVttb < 0 ||
            this.editCache[id].data.tcGiaoVonHoanUngNam < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
        this.total(-1, this.lstCtietBcao[index]);
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
        this.total(1, this.lstCtietBcao[index]);
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

    changeModel(id: any) {
        this.editCache[id].data.tongSoThoc = sumNumber([this.editCache[id].data.vonCapThoc, this.editCache[id].data.vonUngThoc]);
        this.editCache[id].data.tongSoGao = sumNumber([this.editCache[id].data.giaoDuToanGao, this.editCache[id].data.vonCapGao, this.editCache[id].data.vonUngGao]);
        this.editCache[id].data.tongSoMuoi = sumNumber([this.editCache[id].data.giaoDuToanMuoi, this.editCache[id].data.vonCapMuoi, this.editCache[id].data.vonUngMuoi]);
    }

    total(heSo: number, item: ItemData) {
        this.tongSo.vonCapThoc = sumNumber([this.tongSo.vonCapThoc, this.mulNumber(heSo, item.vonCapThoc)]);
        this.tongSo.vonUngThoc = sumNumber([this.tongSo.vonUngThoc, this.mulNumber(heSo, item.vonUngThoc)]);
        this.tongSo.tongSoThoc = sumNumber([this.tongSo.tongSoThoc, this.mulNumber(heSo, item.tongSoThoc)]);
        this.tongSo.giaoDuToanGao = sumNumber([this.tongSo.giaoDuToanGao, this.mulNumber(heSo, item.giaoDuToanGao)]);
        this.tongSo.vonCapGao = sumNumber([this.tongSo.vonCapGao, this.mulNumber(heSo, item.vonCapGao)]);
        this.tongSo.vonUngGao = sumNumber([this.tongSo.vonUngGao, this.mulNumber(heSo, item.vonUngGao)]);
        this.tongSo.tongSoGao = sumNumber([this.tongSo.tongSoGao, this.mulNumber(heSo, item.tongSoGao)]);
        this.tongSo.giaoDuToanMuoi = sumNumber([this.tongSo.giaoDuToanMuoi, this.mulNumber(heSo, item.giaoDuToanMuoi)]);
        this.tongSo.vonCapMuoi = sumNumber([this.tongSo.vonCapMuoi, this.mulNumber(heSo, item.vonCapMuoi)]);
        this.tongSo.vonUngMuoi = sumNumber([this.tongSo.vonUngMuoi, this.mulNumber(heSo, item.vonUngMuoi)]);
        this.tongSo.tongSoMuoi = sumNumber([this.tongSo.tongSoMuoi, this.mulNumber(heSo, item.tongSoMuoi)]);
        this.tongSo.capVonVttb = sumNumber([this.tongSo.capVonVttb, this.mulNumber(heSo, item.capVonVttb)]);
        this.tongSo.tcGiaoVonHoanUngNam = sumNumber([this.tongSo.tcGiaoVonHoanUngNam, this.mulNumber(heSo, item.tcGiaoVonHoanUngNam)]);
    }

    mulNumber(num1: number, num2: number) {
        if ((!num1 && num1 !== 0) || (!num2 && num2 !== 0)) {
            return null;
        }
        return num1 * num2;
    }

    showDialogCopy() {
        const obj = {
            qdChiTieu: this.qdChiTieu,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Đề nghị tổng hợp tại tổng cục',
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
        let maDeNghiNew: string;
        await this.capVonNguonChiService.maDeNghi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maDeNghiNew = res.data;
                }
            },
        );
        if (!maDeNghiNew) {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            return;
        }

        const lstCtietBcaoTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                id: null,
            })
        })
        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            thopTcCtiets: lstCtietBcaoTemp,
            maDvi: this.maDviTao,
            maDnghi: maDeNghiNew,
            loaiDnghi: this.nguonBcao,
            maDviTien: "1",
            soQdChiTieu: response.qdChiTieu,
            trangThai: "1",
            thuyetMinh: "",
        }));

        this.spinner.show();
        this.capVonNguonChiService.themMoiDnghiThop(request).toPromise().then(
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
                            maBcao: maDeNghiNew
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

    displayMoney(num: number): string {
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
