import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LTD, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { PHU_LUC } from './bao-cao.constant';
import { PhuLuc01Component } from './phu-luc/phu-luc-01/phu-luc-01.component';
import { PhuLuc02Component } from './phu-luc/phu-luc-02/phu-luc-02.component';
import { PhuLuc03Component } from './phu-luc/phu-luc-03/phu-luc-03.component';
import { PhuLuc04Component } from './phu-luc/phu-luc-04/phu-luc-04.component';
import { PhuLuc05Component } from './phu-luc/phu-luc-05/phu-luc-05.component';
import { PhuLuc06Component } from './phu-luc/phu-luc-06/phu-luc-06.component';
import { PhuLuc07Component } from './phu-luc/phu-luc-07/phu-luc-07.component';
import { PhuLucDuAnComponent } from './phu-luc/phu-luc-du-an/phu-luc-du-an.component';
import { BieuMau131Component } from './thong-tu-342/bieu-mau-13-1/bieu-mau-13-1.component';
import { BieuMau1310Component } from './thong-tu-342/bieu-mau-13-10/bieu-mau-13-10.component';
import { BieuMau133Component } from './thong-tu-342/bieu-mau-13-3/bieu-mau-13-3.component';
import { BieuMau138Component } from './thong-tu-342/bieu-mau-13-8/bieu-mau-13-8.component';
import { BieuMau140Component } from './thong-tu-342/bieu-mau-14-0/bieu-mau-14-0.component';
import { BieuMau151Component } from './thong-tu-342/bieu-mau-15-1/bieu-mau-15-1.component';
import { BieuMau152Component } from './thong-tu-342/bieu-mau-15-2/bieu-mau-15-2.component';
import { BieuMau13Component } from './thong-tu-69/bieu-mau-13/bieu-mau-13.component';
import { BieuMau14Component } from './thong-tu-69/bieu-mau-14/bieu-mau-14.component';
import { BieuMau16Component } from './thong-tu-69/bieu-mau-16/bieu-mau-16.component';
import { BieuMau17Component } from './thong-tu-69/bieu-mau-17/bieu-mau-17.component';
import { BieuMau18Component } from './thong-tu-69/bieu-mau-18/bieu-mau-18.component';

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

export class ItemData {
    id: string;
    maBieuMau: string;
    tenPl: string;
    tenDm: string;
    trangThai: string;
    maDviTien: string;
    lyDoTuChoi: string;
    thuyetMinh: string;
    nguoiBcao: string;
    lstCtietBcaos: any[];
}
export class BaoCao {
    id: string;
    namBcao: number;
    lstBcaoDviTrucThuocs: any[];
    lstLapThamDinhs: ItemData[];
    lstFiles: any[];
    ngayTao: any;
    nguoiTao: string;
    maBcao: string;
    maDvi: string;
    maDviCha: string;
    trangThai: string;
    ngayTrinh: any;
    ngayDuyet: any;
    ngayPheDuyet: any;
    ngayTraKq: any;
    congVan: ItemCongVan;
    lyDoTuChoi: string;
    giaoSoTranChiId: string;
    thuyetMinh: string;
    fileDinhKems: any[];
    listIdDeleteFiles: string[];
    tongHopTuIds: string[];
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
    baoCao: BaoCao = new BaoCao();
    lstPhuLuc: ItemData[] = [];
    lstTt342: ItemData[] = [];
    lstTt69: ItemData[] = [];
    //danh muc
    listAppendix: any[] = PHU_LUC;
    childUnit: any[] = [];              // danh muc don vi con cua don vi tao bao cao
    tabs: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
    canBos: any[];
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
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
    isDataAvailable = false;
    //phan tab
    tabSelected: string;
    selectedIndex = 0;
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
        this.baoCao.congVan = {
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
            this.baoCao.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private lapThamDinhService: LapThamDinhService,
        private danhMucService: DanhMucHDVService,
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
        this.baoCao.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();

        //lay danh sach danh muc don vi
        await this.getChildUnit();
        this.getListUser();
        if (this.baoCao.id) {
            await this.getDetailReport();
            if (this.data?.idSoTranChi) {
                // this.lstLapThamDinhs = this.data?.lstLapThamDinhs ? this.data?.lstLapThamDinhs : [];
                this.baoCao.giaoSoTranChiId = this.data?.idSoTranChi;
            }
        } else {
            this.baoCao.namBcao = this.data?.namHienTai;
            this.baoCao.maDvi = this.data?.maDvi ? this.data?.maDvi : this.userInfo?.MA_DVI;
            this.baoCao.lstLapThamDinhs = this.data?.lstLapThamDinhs ? this.data?.lstLapThamDinhs : [];
            this.baoCao.lstBcaoDviTrucThuocs = this.data?.lstDviTrucThuoc ? this.data?.lstDviTrucThuoc : [];
            this.baoCao.trangThai = "1";
            this.baoCao.nguoiTao = this.userInfo?.sub;
            this.baoCao.ngayTao = new Date();
            await this.lapThamDinhService.sinhMaBaoCao().toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.baoCao.maBcao = data.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
            if (this.baoCao.lstBcaoDviTrucThuocs?.length == 0) {
                this.listAppendix.forEach(item => {
                    this.baoCao.lstLapThamDinhs.push({
                        ...new ItemData(),
                        id: uuid.v4() + 'FE',
                        maBieuMau: item.id,
                        tenPl: item.tenPl,
                        tenDm: item.tenDm,
                        trangThai: '3',
                    })
                })
                this.lstPhuLuc = this.baoCao.lstLapThamDinhs.filter(e => e.maBieuMau.startsWith('pl'));
                this.lstTt342 = this.baoCao.lstLapThamDinhs.filter(e => e.maBieuMau.startsWith('TT342'));
                this.lstTt69 = this.baoCao.lstLapThamDinhs.filter(e => e.maBieuMau.startsWith('TT69'));
            }
        }

        this.getStatusButton();
        this.spinner.hide();
    }

    async getChildUnit() {
        const request = {
            maDviCha: this.baoCao.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.childUnit = data.data;
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
        const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs.length != 0;
        const isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        const isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(LTD.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(LTD.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.APPROVE_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(LTD.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.DUYET_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(LTD.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.PHE_DUYET_REPORT);
        const checkAccept = this.userService.isAccessPermisson(LTD.TIEP_NHAN_REPORT);
        const checkCopy = isSynthetic ? this.userService.isAccessPermisson(LTD.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.COPY_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(LTD.PRINT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.PRINT_REPORT);
        if (Utils.statusSave.includes(this.baoCao.trangThai) && checkSave) {
            this.status = false;
        } else {
            this.status = true;
        }

        this.saveStatus = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave && isChild;
        this.submitStatus = Utils.statusApprove.includes(this.baoCao.trangThai) && checkSunmit && isChild && !(!this.baoCao.id);
        this.passStatus = Utils.statusDuyet.includes(this.baoCao.trangThai) && checkPass && isChild;
        this.approveStatus = Utils.statusPheDuyet.includes(this.baoCao.trangThai) && checkApprove && isChild;
        this.acceptStatus = Utils.statusTiepNhan.includes(this.baoCao.trangThai) && checkAccept && isParent;
        this.copyStatus = Utils.statusCopy.includes(this.baoCao.trangThai) && checkCopy && isChild;
        this.printStatus = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && isChild;

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
        return this.childUnit.find(item => item.maDvi == maDvi)?.tenDvi;
    }

    // lay ten trang thai ban ghi
    getStatusName(status: string) {
        const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
        if (statusMoi && this.userInfo.MA_DVI == this.baoCao.maDviCha) {
            return 'Mới';
        } else {
            return this.trangThais.find(e => e.id == status)?.tenDm;
        }
    }

    getDateTime(time: any) {
        return this.datePipe.transform(time, Utils.FORMAT_DATE_STR);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maBcao);
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
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }

    //download file về máy tính
    async downloadFile(id: string) {
        //let file!: File;
        const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.baoCao.lstFiles.find(element => element?.id == id);
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
        if (this.baoCao.congVan?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.baoCao.congVan?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.baoCao.congVan?.fileName);
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
        return TRANG_THAI_PHU_LUC.find(item => item.id == id)?.ten;
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.lapThamDinhService.bCLapThamDinhDuToanChiTiet(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao.lstLapThamDinhs.forEach(item => {
                        const appendix = this.listAppendix.find(e => e.id == item.maBieuMau);
                        item.tenPl = appendix.tenPl;
                        item.tenDm = appendix.tenDm;
                    })
                    this.listFile = [];
                    this.lstPhuLuc = this.baoCao.lstLapThamDinhs.filter(e => e.maBieuMau.startsWith('pl'));
                    this.lstTt342 = this.baoCao.lstLapThamDinhs.filter(e => e.maBieuMau.startsWith('TT342'));
                    this.lstTt69 = this.baoCao.lstLapThamDinhs.filter(e => e.maBieuMau.startsWith('TT69'));
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
        // if (mcn == Utils.TT_BC_2) {
        //     if (!this.congVan) {
        //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //         return;
        //     }
        //     let check = true;
        //     this.lstLapThamDinhs.forEach(item => {
        //         if (item.trangThai != '5') {
        //             check = false;
        //         }
        //     })
        //     if (!check) {
        //         this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
        //         return;
        //     }
        // } else {
        //     let check = true;
        //     if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
        //         this.lstLapThamDinhs.forEach(item => {
        //             if (item.trangThai == '2') {
        //                 check = false;
        //             }
        //         })
        //     }
        //     if (!check) {
        //         this.notification.warning(MESSAGE.ERROR, MESSAGE.RATE_FORM);
        //         return;
        //     }
        // }
        // const requestGroupButtons = {
        //     id: this.id,
        //     maChucNang: mcn,
        //     lyDoTuChoi: lyDoTuChoi,
        // };
        // await this.lapThamDinhService.approveThamDinh(requestGroupButtons).toPromise().then(async (data) => {
        //     if (data.statusCode == 0) {
        //         this.trangThaiBaoCao = mcn;
        //         this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
        //         this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
        //         this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
        //         this.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
        //         this.getStatusButton();
        //         if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
        //             this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
        //         } else {
        //             this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        //         }
        //         this.tabs = [];
        //     } else {
        //         this.notification.error(MESSAGE.ERROR, data?.msg);
        //     }
        // }, err => {
        //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        // });
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
        //kiem tra cac bao cao da duoc giao xuong chua
        let checkSave = true;
        checkSave = this.lstPhuLuc.every(e => e.nguoiBcao) && checkSave;
        checkSave = this.lstTt342.every(e => e.nguoiBcao) && checkSave;
        checkSave = this.lstTt69.every(e => e.nguoiBcao) && checkSave;
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        //kiem tra kich co cua file
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
        this.baoCao.lstLapThamDinhs = this.lstPhuLuc.concat(this.lstTt342, this.lstTt69);
        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
        this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })
        for (const iterator of this.listFile) {
            baoCaoTemp.fileDinhKems.push(await this.uploadFile(iterator));
        }
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = await this.uploadFile(file);
            }
        }

        if (!baoCaoTemp.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstLapThamDinhs.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        //call service them moi
        if (!this.baoCao.id) {
            this.lapThamDinhService.trinhDuyetService(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.getDetailReport();
                        const dataTemp = {
                            id: data.data.id,
                            tabSelected: this.data.tabSelected,
                            preTab: this.data.preTab,
                        }
                        this.data = dataTemp;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.lapThamDinhService.updateBieuMau(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        if (this.data?.idSoTranChi) {
                            this.data.idSoTranChi = null;
                        }
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
    addAppendix() {
        let danhMuc = [];
        let danhSach = [];
        let title = '';
        switch (this.selectedIndex) {
            case 0:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('pl'));
                danhSach = danhMuc.filter(item => this.lstPhuLuc.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách phụ lục';
                break;
            case 1:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('TT342'));
                danhSach = danhMuc.filter(item => this.lstTt342.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách biểu mẫu';
                break;
            case 2:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('TT69'));
                danhSach = danhMuc.filter(item => this.lstTt69.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách biểu mẫu';
                break;
            default:
                break;
        }

        const modalIn = this.modal.create({
            nzTitle: title,
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
                        const newItem = {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            maBieuMau: item.id,
                            tenPl: item.tenPl,
                            temDm: item.temDm,
                            trangThai: '3',
                        }
                        switch (this.selectedIndex) {
                            case 0:
                                this.lstPhuLuc.push(newItem);
                                break;
                            case 1:
                                this.lstTt342.push(newItem);
                                break;
                            case 2:
                                this.lstTt69.push(newItem);
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
        });
    }

    //xoa bieu mau
    deleteAppendix(id: string) {
        this.lstPhuLuc = this.lstPhuLuc.filter(item => item.id != id);
        this.lstTt342 = this.lstTt342.filter(item => item.id != id);
        this.lstTt69 = this.lstTt69.filter(item => item.id != id);
    }

    viewAppendix(formDetail: ItemData) {
        const dataInfo = {
            ...formDetail,
            maDvi: this.baoCao.maDvi,
            namBcao: this.baoCao.namBcao,
            statusBtnOk: this.okStatus,
            statusBtnFinish: this.finishStatus,
            statusBtnPrint: this.printStatus,
            status: this.status,
        }
        //const nzContent = BieuMau18Component;
        let nzContent: ComponentType<any>;
        switch (formDetail.maBieuMau) {
            //phu luc
            case 'pl01':
                nzContent = PhuLuc01Component;
                break;
            case 'pl02':
                nzContent = PhuLuc02Component;
                break;
            case 'pl03':
                nzContent = PhuLuc03Component;
                break;
            case 'pl04':
                nzContent = PhuLuc04Component;
                break;
            case 'pl05':
                nzContent = PhuLuc05Component;
                break;
            case 'pl06':
                nzContent = PhuLuc06Component;
                break;
            case 'pl07':
                nzContent = PhuLuc07Component;
                break;
            case 'plda':
                nzContent = PhuLucDuAnComponent;
                break;
            //thong tu 342
            case 'TT342_13.1':
                nzContent = BieuMau131Component;
                break;
            case 'TT342_13.3':
                nzContent = BieuMau133Component;
                break;
            case 'TT342_13.8':
                nzContent = BieuMau138Component;
                break;
            case 'TT342_13.10':
                nzContent = BieuMau1310Component;
                break;
            case 'TT342_14':
                nzContent = BieuMau140Component;
                break;
            case 'TT342_15.1':
                nzContent = BieuMau151Component;
                break;
            case 'TT342_15.2':
                nzContent = BieuMau152Component;
                break;
            // thong tu 69
            case 'TT69_13':
                nzContent = BieuMau13Component;
                break;
            case 'TT69_14':
                nzContent = BieuMau14Component;
                break;
            case 'TT69_16':
                nzContent = BieuMau16Component;
                break;
            case 'TT69_17':
                nzContent = BieuMau17Component;
                break;
            case 'TT69_18':
                nzContent = BieuMau18Component;
                break;
            default:
                break;
        }
        const modalAppendix = this.modal.create({
            nzTitle: formDetail.tenDm,
            nzContent: nzContent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '80%',
            nzFooter: null,
            nzComponentParams: {
                dataInfo: dataInfo
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
            }
        });
    }

    newTab(id: string): void {
        // const index: number = this.tabs.findIndex(e => e.id === id);
        // if (index != -1) {
        //     this.selectedIndex = index + 1;
        // } else {
        //     const item = this.lstLapThamDinhs.find(e => e.maBieuMau == id);
        //     this.tabData = {
        //         ...item,
        //         namHienHanh: this.namHienHanh,
        //         trangThaiBaoCao: this.trangThaiBaoCao,
        //         statusBtnOk: this.okStatus,
        //         statusBtnFinish: this.finishStatus,
        //         statusBtnPrint: this.printStatus,
        //         status: this.status,
        //     }
        //     this.tabs = [];
        //     this.tabs.push(PHU_LUC.find(e => e.id === id));
        //     this.selectedIndex = this.tabs.length + 1;
        // }
    }

    getNewData(obj: any) {
        // const index = this.lstLapThamDinhs.findIndex(e => e.maBieuMau == this.tabs[0].id);
        // if (obj?.trangThai == '-1') {
        //     this.getDetailReport();
        //     this.tabData = {
        //         ...this.lstLapThamDinhs[index],
        //         namHienHanh: this.namHienHanh,
        //         trangThaiBaoCao: this.trangThaiBaoCao,
        //         statusBtnOk: this.okStatus,
        //         statusBtnFinish: this.finishStatus,
        //         status: this.status,
        //     }
        //     this.tabs = [];
        //     this.tabs.push(PHU_LUC.find(e => e.id == this.lstLapThamDinhs[index].maBieuMau));
        //     this.selectedIndex = this.tabs.length + 1;
        // } else {
        //     this.lstLapThamDinhs[index].trangThai = obj?.trangThai;
        //     this.lstLapThamDinhs[index].lyDoTuChoi = obj?.lyDoTuChoi;
        // }
    }

    xemSoKiemTra() {
        if (this.userService.isTongCuc()) {
            const obj = {
                id: this.baoCao.giaoSoTranChiId,
                preData: this.data,
                tabSelected: 'skt-btc'
            }
            this.dataChange.emit(obj);
        } else {
            const obj = {
                id: this.baoCao.giaoSoTranChiId,
                preData: this.data,
                tabSelected: 'skt'
            }
            this.dataChange.emit(obj);
        }
    }

    showDialogCopy() {
        const obj = {
            namBcao: this.baoCao.namBcao,
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
        // let maBcaoNew: string;
        // await this.lapThamDinhService.sinhMaBaoCao().toPromise().then(
        //     (data) => {
        //         if (data.statusCode == 0) {
        //             maBcaoNew = data.data;
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, data?.msg);
        //             return;
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        //         return;
        //     }
        // );
        // const lstLapThamDinhTemps: any[] = [];
        // this.lstLapThamDinhs.forEach(data => {
        //     const lstCtietTemp: any[] = [];
        //     data.lstCtietLapThamDinhs.forEach(item => {
        //         lstCtietTemp.push({
        //             ...item,
        //             id: null,
        //         })
        //     })
        //     lstLapThamDinhTemps.push({
        //         ...data,
        //         nguoiBcao: this.userInfo?.sub,
        //         lstCtietLapThamDinhs: lstCtietTemp,
        //         id: null,
        //     })
        // })
        // const request = {
        //     id: null,
        //     fileDinhKems: [],
        //     listIdDeleteFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
        //     lstLapThamDinhs: lstLapThamDinhTemps,
        //     maBcao: maBcaoNew,
        //     maDvi: this.maDviTao,
        //     namBcao: response?.namBcao,
        //     namHienHanh: response?.namBcao,
        //     congVan: null,
        //     tongHopTuIds: [],
        // };
        // this.spinner.show();
        // this.lapThamDinhService.trinhDuyetService(request).toPromise().then(
        //     async data => {
        //         if (data.statusCode == 0) {
        //             const modalCopy = this.modal.create({
        //                 nzTitle: MESSAGE.ALERT,
        //                 nzContent: DialogCopyComponent,
        //                 nzMaskClosable: false,
        //                 nzClosable: false,
        //                 nzWidth: '900px',
        //                 nzFooter: null,
        //                 nzComponentParams: {
        //                     maBcao: maBcaoNew
        //                 },
        //             });
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, data?.msg);
        //         }
        //     },
        //     err => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     },
        // );
        // this.spinner.hide();
    }

    statusClass() {
        if (Utils.statusSave.includes(this.baoCao.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
