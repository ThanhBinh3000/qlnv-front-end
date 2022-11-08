import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LTD, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { PHU_LUC } from '../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
    id: string;
    maBieuMau: string;
    trangThai: string;
    maDviTien: string;
    lyDoTuChoi: string;
    thuyetMinh: string;
    nguoiBcao: string;
    lstCtietLapThamDinhs: any[];
    checked: boolean;
}
export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-bao-cao',
    templateUrl: './bao-cao.component.html',
    styleUrls: ['./bao-cao.component.scss',
    ],
})
export class BaoCaoComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    id!: string;
    maBaoCao!: string;
    namHienHanh!: number;
    ngayNhap!: string;
    nguoiNhap!: string;
    congVan!: ItemCongVan;
    ngayTrinh!: string;
    ngayDuyet!: string;
    ngayPheDuyet!: string;
    ngayTraKq!: string;
    trangThaiBaoCao = Utils.TT_BC_1;
    maDviTao!: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    giaoSoTranChiId: string;
    //danh muc
    lstLapThamDinhs: ItemData[] = [];
    phuLucs: any[] = PHU_LUC;
    donVis: any[] = [];						//danh muc don vi con cua don vi dang nhap
    tabs: any[] = [];
    lstDviTrucThuoc: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
    canBos: any[];
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: any = [];                        // id file luc call chi tiet
    //trang thai cac nut
    status = false;                             // trang thai an/ hien cua trang thai
    saveStatus = true;                          // trang thai an/hien nut luu
    submitStatus = true;                        // trang thai an/hien nut trinh duyet
    passStatus = true;                          // trang thai an/hien nut truong bo phan
    approveStatus = true;                       // trang thai an/hien nut lanh dao
    acceptStatus = true;                        // trang thai nut don vi cap tren
    copyStatus = true;                          // trang thai copy
    printStatus = true;                         // trang thai print
    okStatus = true;                            // trang thai ok/ not ok
    finishStatus = true;                        // trang thai hoan tat nhap lieu
    isChild = false;
    isParent = false;
    isDataAvailable = false;
    //khac
    allChecked = false;
    //phan tab
    tabSelected: string;
    selectedIndex = 1;
    //truyen du lieu sang tab con
    tabData: any;

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


    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private lapThamDinhService: LapThamDinhService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        public userService: UserService,
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
            case 'nonaccept':
                await this.tuChoi('8').then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'accept':
                await this.onSubmit('9', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.tabs = [];
        this.spinner.hide();
    }

    async initialization() {
        //lay thong tin chung bao cao
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();

        this.getListUser();
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.isChild = true;
            this.isParent = false;
            this.namHienHanh = this.data?.namHienTai;
            this.maDviTao = this.data?.maDvi ? this.data?.maDvi : this.userInfo?.MA_DVI;
            this.lstLapThamDinhs = this.data?.lstLapThamDinhs ? this.data?.lstLapThamDinhs : [];
            this.lstDviTrucThuoc = this.data?.lstDviTrucThuoc ? this.data?.lstDviTrucThuoc : [];
            this.trangThaiBaoCao = "1";
            this.nguoiNhap = this.userInfo?.sub;
            await this.lapThamDinhService.sinhMaBaoCao().toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.maBaoCao = data.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
            if (this.lstDviTrucThuoc?.length == 0) {
                this.phuLucs.forEach(item => {
                    this.lstLapThamDinhs.push({
                        id: uuid.v4() + 'FE',
                        maBieuMau: item.id,
                        trangThai: '3',
                        maDviTien: '',
                        lyDoTuChoi: "",
                        thuyetMinh: "",
                        nguoiBcao: "",
                        lstCtietLapThamDinhs: [],
                        checked: false,
                    })
                })
            }
        }

        //lay danh sach danh muc don vi
        await this.getDviCon();
        this.getStatusButton();
        this.spinner.hide();
    }

    async getDviCon() {
        const request = {
            maDviCha: this.userInfo?.MA_DVI,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

    getListUser() {
        this.quanLyVonPhiService.getListUser().toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.canBos = res.data;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isSynthetic = this.lstDviTrucThuoc.length != 0;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(LTD.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(LTD.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.APPROVE_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(LTD.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.DUYET_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(LTD.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.PHE_DUYET_REPORT);
        const checkAccept = this.userService.isAccessPermisson(LTD.TIEP_NHAN_REPORT);
        const checkCopy = isSynthetic ? this.userService.isAccessPermisson(LTD.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.COPY_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(LTD.PRINT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.PRINT_REPORT);
        if (Utils.statusSave.includes(this.trangThaiBaoCao) && checkSave) {
            this.status = false;
        } else {
            this.status = true;
        }

        this.saveStatus = Utils.statusSave.includes(this.trangThaiBaoCao) && checkSave && this.isChild;
        this.submitStatus = Utils.statusApprove.includes(this.trangThaiBaoCao) && checkSunmit && this.isChild;
        this.passStatus = Utils.statusDuyet.includes(this.trangThaiBaoCao) && checkPass && this.isChild;
        this.approveStatus = Utils.statusPheDuyet.includes(this.trangThaiBaoCao) && checkApprove && this.isChild;
        this.acceptStatus = Utils.statusTiepNhan.includes(this.trangThaiBaoCao) && checkAccept && this.isParent;
        this.copyStatus = Utils.statusCopy.includes(this.trangThaiBaoCao) && checkCopy && this.isChild;
        this.printStatus = Utils.statusPrint.includes(this.trangThaiBaoCao) && checkPrint && this.isChild;

        if (this.acceptStatus || this.approveStatus || this.passStatus) {
            this.okStatus = true;
        } else {
            this.okStatus = false;
        }
        if (this.saveStatus) {
            this.finishStatus = false;
        } else {
            this.finishStatus = true;
        }
    }

    back() {
        if (this.data?.preData) {
            this.dataChange.emit(this.data?.preData)
        } else {
            const obj = {
                tabSelected: this.data?.preTab,
            }
            this.dataChange.emit(obj);
        }
    }

    // lay ten don vi tao
    getUnitName(maDvi: string) {
        return this.donVis.find(item => item.maDvi == maDvi)?.tenDvi;
    }

    // lay ten trang thai ban ghi
    getStatusName(status: string) {
        const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
        if (statusMoi && this.isParent) {
            return 'Mới';
        } else {
            return this.trangThais.find(e => e.id == status)?.tenDm;
        }
    }

    //upload file
    async uploadFile(file: File) {
        debugger
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maBaoCao);
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
        //let file!: File;
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

    getStatusAppendixName(id) {
        const utils = new Utils();
        return utils.getStatusAppendixName(id);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.lapThamDinhService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.lstLapThamDinhs = data.data.lstLapThamDinhs;
                    this.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
                    // set thong tin chung bao cao
                    this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.nguoiNhap = data.data.nguoiTao;
                    this.maBaoCao = data.data.maBcao;
                    this.maDviTao = data.data.maDvi;
                    this.isChild = this.userInfo.MA_DVI == this.maDviTao;
                    this.isParent = this.donVis.findIndex(e => e.maDvi == this.maDviTao) != -1;
                    this.namHienHanh = data.data.namHienHanh;
                    this.trangThaiBaoCao = data.data.trangThai;
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
                    this.congVan = data.data.congVan;
                    this.lyDoTuChoi = data.data.lyDoTuChoi;
                    this.giaoSoTranChiId = data.data.giaoSoTranChiId;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.lstDviTrucThuoc.forEach(item => {
                        item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                        item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    })
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (mcn == Utils.TT_BC_2) {
            let check = true;
            this.lstLapThamDinhs.forEach(item => {
                if (item.trangThai != '5') {
                    check = false;
                }
            })
            if (!check) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            let check = true;
            if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
                this.lstLapThamDinhs.forEach(item => {
                    if (item.trangThai == '2') {
                        check = false;
                    }
                })
            }
            if (!check) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.RATE_FORM);
                return;
            }
        }
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.lapThamDinhService.approveThamDinh(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiBaoCao = mcn;
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    }
                    this.tabs = [];
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
        modalTuChoi.afterClose.toPromise().then(async (text) => {
            if (text) {
                this.onSubmit(mcn, text);
            }
        });
    }

    // luu
    async save() {
        let checkSave = true;
        this.lstLapThamDinhs.forEach(e => {
            if (!e.nguoiBcao) {
                checkSave = false;
            }
        })

        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        const tongHopTuIds = [];
        this.lstDviTrucThuoc.forEach(item => {
            tongHopTuIds.push(item.id);
        })

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

        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: this.lstFiles,
            listIdDeleteFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
            lstLapThamDinhs: this.lstLapThamDinhs,
            maBcao: this.maBaoCao,
            maDvi: this.maDviTao,
            namBcao: this.namHienHanh,
            namHienHanh: this.namHienHanh,
            congVan: this.congVan,
            thuyetMinh: this.thuyetMinh,
            tongHopTuIds: tongHopTuIds,
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

        // replace nhung ban ghi dc them moi id thanh null
        request.lstLapThamDinhs.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        //call service them moi
        if (!this.id) {
            this.lapThamDinhService.trinhDuyetService(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.id = data.data.id;
                        this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.lapThamDinhService.updateBieuMau(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                })
        }
    }

    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: 'next' + this.data?.tabSelected,
        }
        this.dataChange.emit(obj);
    }

    // them phu luc
    addBieuMau() {
        this.phuLucs.forEach(item => item.status = false);
        const danhSach = this.phuLucs.filter(item => this.lstLapThamDinhs.findIndex(e => e.maBieuMau == item.id) == -1);

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách biểu mẫu',
            nzContent: DialogChonThemBieuMauComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                danhSachBieuMau: danhSach
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        this.lstLapThamDinhs.push({
                            id: uuid.v4() + 'FE',
                            maBieuMau: item.id,
                            trangThai: '3',
                            maDviTien: '',
                            lyDoTuChoi: "",
                            thuyetMinh: "",
                            nguoiBcao: "",
                            lstCtietLapThamDinhs: [],
                            checked: false,
                        });
                    }
                })
            }
        });
    }

    // xóa với checkbox
    deleteSelected() {
        this.lstLapThamDinhs.forEach(item => {
            if (this.tabs.findIndex(e => e.id == item.maBieuMau) != -1) {
                this.tabs = [];
            }
        })
        // delete object have checked = true
        this.lstLapThamDinhs = this.lstLapThamDinhs.filter(item => item.checked != true)
        this.allChecked = false;
    }

    // click o checkbox all
    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstLapThamDinhs.checked = true
            this.lstLapThamDinhs = this.lstLapThamDinhs.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstLapThamDinhs = this.lstLapThamDinhs.map(item => ({    // checkboxall == false thi set lai lstLapThamDinhs.checked = false
                ...item,
                checked: false
            }));
        }
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstLapThamDinhs.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
            this.allChecked = false;
        } else if (this.lstLapThamDinhs.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        }
    }

    // lay trang thai cua bieu mau
    getStatusBM(trangThai: string) {
        return this.trangThaiBieuMaus.find(e => e.id == trangThai)?.ten;
    }

    closeTab({ index }: { index: number }): void {
        this.tabs.splice(index - 1, 1);
    }

    newTab(id: string): void {
        const index: number = this.tabs.findIndex(e => e.id === id);
        if (index != -1) {
            this.selectedIndex = index + 1;
        } else {
            const item = this.lstLapThamDinhs.find(e => e.maBieuMau == id);
            this.tabData = {
                ...item,
                namHienHanh: this.namHienHanh,
                trangThaiBaoCao: this.trangThaiBaoCao,
                statusBtnOk: this.okStatus,
                statusBtnFinish: this.finishStatus,
                statusBtnPrint: this.printStatus,
                status: this.status,
            }
            this.tabs = [];
            this.tabs.push(PHU_LUC.find(e => e.id === id));
            this.selectedIndex = this.tabs.length + 1;
        }
    }

    getNewData(obj: any) {
        const index = this.lstLapThamDinhs.findIndex(e => e.maBieuMau == this.tabs[0].id);
        if (obj?.trangThai == '-1') {
            this.getDetailReport();
            this.tabData = {
                ...this.lstLapThamDinhs[index],
                namHienHanh: this.namHienHanh,
                trangThaiBaoCao: this.trangThaiBaoCao,
                statusBtnOk: this.okStatus,
                statusBtnFinish: this.finishStatus,
                status: this.status,
            }
            this.tabs = [];
            this.tabs.push(PHU_LUC.find(e => e.id == this.lstLapThamDinhs[index].maBieuMau));
            this.selectedIndex = this.tabs.length + 1;
        } else {
            this.lstLapThamDinhs[index].trangThai = obj?.trangThai;
            this.lstLapThamDinhs[index].lyDoTuChoi = obj?.lyDoTuChoi;
        }
    }

    xemSoKiemTra() {
        if (this.userService.isTongCuc()) {
            // this.router.navigate([
            //     MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-tran-chi-tu-btc/' + this.giaoSoTranChiId
            // ]);
        } else {
            // this.router.navigate([
            //     MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-chi-nsnn/' + this.giaoSoTranChiId
            // ]);
        }
    }

    showDialogCopy() {
        const obj = {
            namBcao: this.namHienHanh,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Báo Cáo',
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
        let maBcaoNew: string;
        await this.lapThamDinhService.sinhMaBaoCao().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    maBcaoNew = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    return;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                return;
            }
        );
        const lstLapThamDinhTemps: any[] = [];
        this.lstLapThamDinhs.forEach(data => {
            const lstCtietTemp: any[] = [];
            data.lstCtietLapThamDinhs.forEach(item => {
                lstCtietTemp.push({
                    ...item,
                    id: null,
                })
            })
            lstLapThamDinhTemps.push({
                ...data,
                nguoiBcao: this.userInfo?.sub,
                lstCtietLapThamDinhs: lstCtietTemp,
                id: null,
            })
        })
        const request = {
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
            lstLapThamDinhs: lstLapThamDinhTemps,
            maBcao: maBcaoNew,
            maDvi: this.maDviTao,
            namBcao: response?.namBcao,
            namHienHanh: response?.namBcao,
            congVan: null,
            tongHopTuIds: [],
        };
        this.spinner.show();
        this.lapThamDinhService.trinhDuyetService(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    const modalCopy = this.modal.create({
                        nzTitle: MESSAGE.ALERT,
                        nzContent: DialogCopyComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzWidth: '900px',
                        nzFooter: null,
                        nzComponentParams: {
                            maBcao: maBcaoNew
                        },
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    statusClass() {
        if (Utils.statusSave.includes(this.trangThaiBaoCao)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
