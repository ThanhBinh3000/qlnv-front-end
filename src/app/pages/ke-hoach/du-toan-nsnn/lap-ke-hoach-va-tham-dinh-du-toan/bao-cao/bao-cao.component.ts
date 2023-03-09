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
import { sumNumber } from 'src/app/Utility/func';
import { LTD, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { PHU_LUC } from './bao-cao.constant';
import { BaoHiemHangComponent } from './phu-luc/bao-hiem-hang/bao-hiem-hang.component';
import { BaoHiemKhoComponent } from './phu-luc/bao-hiem-kho/bao-hiem-kho.component';
import { BaoHiemComponent } from './phu-luc/bao-hiem/bao-hiem.component';
import { KhoComponent } from './phu-luc/bao-hiem/kho/kho.component';
import { PhuLuc01XuatComponent } from './phu-luc/phu-luc-01-xuat/phu-luc-01-xuat.component';
import { PhuLuc01Component } from './phu-luc/phu-luc-01/phu-luc-01.component';
import { PhuLuc02Component } from './phu-luc/phu-luc-02/phu-luc-02.component';
import { PhuLuc03Component } from './phu-luc/phu-luc-03/phu-luc-03.component';
import { PhuLuc04Component } from './phu-luc/phu-luc-04/phu-luc-04.component';
import { PhuLuc05Component } from './phu-luc/phu-luc-05/phu-luc-05.component';
import { PhuLuc06Component } from './phu-luc/phu-luc-06/phu-luc-06.component';
import { PhuLucDuAnComponent } from './phu-luc/phu-luc-du-an/phu-luc-du-an.component';
import { BieuMau131Component } from './thong-tu-342/bieu-mau-13-1/bieu-mau-13-1.component';
import { BieuMau1310Component } from './thong-tu-342/bieu-mau-13-10/bieu-mau-13-10.component';
import { BieuMau133Component } from './thong-tu-342/bieu-mau-13-3/bieu-mau-13-3.component';
import { BieuMau138Component } from './thong-tu-342/bieu-mau-13-8/bieu-mau-13-8.component';
import { BieuMau140Component } from './thong-tu-342/bieu-mau-14-0/bieu-mau-14-0.component';
import { BieuMau151Component } from './thong-tu-342/bieu-mau-15-1/bieu-mau-15-1.component';
import { BieuMau152Component } from './thong-tu-342/bieu-mau-15-2/bieu-mau-15-2.component';
import { BieuMau160Component } from './thong-tu-342/bieu-mau-16-0/bieu-mau-16-0.component';
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
    lstCtietLapThamDinhs: any[];
    hsBhDuoi: number;
    hsBhTu: number;
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
    tongHopTuIds: any[];
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
    viewAppraisalValue = true;
    isDataAvailable = false;
    //phan tab
    tabSelected: string;
    selectedIndex = 0;
    //truyen du lieu sang tab con
    tabData: any;
    listVattu: any[] = [];
    lstVatTuFull: any[] = [];
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
        await this.getListUser();
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
            this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
            this.baoCao.tongHopTuIds = [];
            this.baoCao.lstFiles = [];
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
                        lstCtietLapThamDinhs: [],
                    })
                })
            } else {
                this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
                    if (item.ngayDuyet.includes("/")) {
                        item.ngayDuyet = item.ngayDuyet;
                        item.ngayPheDuyet = item.ngayPheDuyet;
                    } else {
                        item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                        item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    }
                })
                this.baoCao.lstLapThamDinhs.forEach(item => {
                    const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                    item.tenPl = pl.tenPl;
                    item.tenDm = pl.tenDm;
                })
            }
        }

        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVattu = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        await this.addVatTu();
        await this.getChildUnit();

        this.getStatusButton();
        this.spinner.hide();
    }

    async addVatTu() {
        const vatTuTemp = []
        this.listVattu.forEach(vatTu => {
            if (vatTu.child) {
                vatTu.child.forEach(vatTuCon => {
                    vatTuTemp.push({
                        ...vatTuCon
                    })
                })
            }
        })

        this.lstVatTuFull = vatTuTemp;
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
        const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs && this.baoCao.lstBcaoDviTrucThuocs.length != 0;
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

        this.viewAppraisalValue = Utils.statusAppraisal.includes(this.baoCao.trangThai);
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
                    this.baoCao.ngayTao = this.datePipe.transform(this.baoCao.ngayTao, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTrinh = this.datePipe.transform(this.baoCao.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayDuyet = this.datePipe.transform(this.baoCao.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayPheDuyet = this.datePipe.transform(this.baoCao.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTraKq = this.datePipe.transform(this.baoCao.ngayTraKq, Utils.FORMAT_DATE_STR);
                    this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
                        item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                        item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    })
                    this.listFile = [];
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
        if (mcn == Utils.TT_BC_2) {
            if (!this.baoCao.congVan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
                return;
            }
            if (!this.baoCao.lstLapThamDinhs.every(e => e.trangThai == '5')) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            let check = true;
            if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
                this.baoCao.lstLapThamDinhs.forEach(item => {
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
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.lapThamDinhService.approveThamDinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
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
        if (!this.baoCao.lstLapThamDinhs.every(e => e.nguoiBcao)) {
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
        const tongHopTuIds = []
        const baoCaoTemp = JSON.parse(JSON.stringify({
            ...this.baoCao,
            tongHopTuIds
        }));
        this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })

        if (!baoCaoTemp.fileDinhKems) {
            baoCaoTemp.fileDinhKems = [];
        }
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
                danhSach = danhMuc.filter(item => this.baoCao.lstLapThamDinhs.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách phụ lục';
                break;
            case 1:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('TT342'));
                danhSach = danhMuc.filter(item => this.baoCao.lstLapThamDinhs.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách biểu mẫu';
                break;
            case 2:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('TT69'));
                danhSach = danhMuc.filter(item => this.baoCao.lstLapThamDinhs.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách biểu mẫu';
                break;
            default:
                break;
        }

        const modalIn = this.modal.create({
            nzTitle: title,
            nzContent: DialogChonThemBieuMauComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
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
                        const newItem: ItemData = {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            maBieuMau: item.id,
                            tenPl: item.tenPl,
                            tenDm: item.tenDm,
                            trangThai: '3',
                            lstCtietLapThamDinhs: [],
                        }
                        this.baoCao.lstLapThamDinhs.push(newItem);
                    }
                })
            }
        });
    }

    getIndex(maBieuMau: string) {
        let header = '';
        if (maBieuMau.startsWith('pl')) {
            header = 'pl';
        };
        if (maBieuMau.startsWith('TT342')) {
            header = 'TT342';
        };
        if (maBieuMau.startsWith('TT69')) {
            header = 'TT69';
        };
        let index = 0;
        for (let i = 0; i < this.baoCao.lstLapThamDinhs.length; i++) {
            if (this.baoCao.lstLapThamDinhs[i].maBieuMau.startsWith(header)) {
                index += 1;
            }
            if (this.baoCao.lstLapThamDinhs[i].maBieuMau == maBieuMau) {
                break;
            }
        }
        return index;
    }

    //xoa bieu mau
    deleteAppendix(id: string) {
        this.baoCao.lstLapThamDinhs = this.baoCao.lstLapThamDinhs.filter(item => item.id != id);
    }
    viewAppendix(formDetail: ItemData) {
        const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs && this.baoCao.lstBcaoDviTrucThuocs.length != 0;
        const dataInfo = {
            data: formDetail,
            extraData: null,
            maDvi: this.baoCao.maDvi,
            namBcao: this.baoCao.namBcao,
            statusBtnOk: this.okStatus,
            statusBtnFinish: this.finishStatus,
            statusBtnPrint: this.printStatus,
            status: this.status || !(this.userInfo?.sub == formDetail.nguoiBcao),
            viewAppraisalValue: this.viewAppraisalValue,
            editAppraisalValue: this.acceptStatus,
            isSynthetic: isSynthetic
        }
        dataInfo.data.maDviTien = '1';
        //const nzContent = BieuMau18Component;
        let nzContent: ComponentType<any>;
        switch (formDetail.maBieuMau) {
            //phu luc
            case 'pl01N':
                nzContent = PhuLuc01Component;
                break;
            case 'pl01X':
                nzContent = PhuLuc01XuatComponent;
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
            case 'plda':
                nzContent = PhuLucDuAnComponent;
                break;
            case 'pl_bh_hang':
                nzContent = BaoHiemHangComponent;
                break;
            case 'pl_bh_kho':
                nzContent = KhoComponent;
                break;
            case 'pl_bh':
                nzContent = BaoHiemComponent;
                // dataInfo.extraData = [];
                // //phu luc bao hiem hang 
                // const dataBaoHiemHang = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl_bh_hang').lstCtietLapThamDinhs;
                // const lstMuoi = []
                // dataBaoHiemHang.forEach(item => {
                //     const loaiHang = this.lstVatTuFull.find(v => v.ten == item.tenHang)?.loaiHang;
                //     const tenHang = this.lstVatTuFull.find(v => v.ten == item.tenHang)?.ten;
                //     const maDviTinh = this.lstVatTuFull.find(v => v.ten == item.tenHang)?.maDviTinh;
                //     if (loaiHang == "LT") {
                //         let tongSoLuongTu = 0
                //         let tongSoLuongDuoi = 0
                //         let tongGiaTriTu = 0
                //         let tongGiaTriDuoi = 0
                //         if (item.khoiTich >= 5000) {
                //             tongSoLuongTu += item.soLuong;
                //             tongGiaTriTu += item.giaTri;
                //         }
                //         if (item.khoiTich < 5000) {
                //             tongSoLuongDuoi += item.soLuong;
                //             tongGiaTriDuoi += item.giaTri
                //         }

                //         if (dataInfo.extraData.length == 0) {
                //             dataInfo.extraData.push({
                //                 stt: '0.3.1.1',
                //                 maVtu: '0.3.1.1',
                //                 tenVtu: item.tenHang,
                //                 maDviTinh: maDviTinh,
                //                 slTuM3: tongSoLuongTu,
                //                 slDuoiM3: tongSoLuongDuoi,
                //                 slTong: tongSoLuongTu + tongSoLuongDuoi,
                //                 gtTuM3: tongGiaTriTu,
                //                 gtDuoiM3: tongGiaTriDuoi,
                //                 gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //                 level: "2",
                //             })
                //         } else {
                //             let stt = dataInfo.extraData[dataInfo.extraData.length - 1]?.stt;
                //             let sttObj = Number(stt.substring(stt.lastIndexOf('.') + 1, stt.length)) + 1
                //             dataInfo.extraData.push({
                //                 stt: '0.3.1.' + sttObj,
                //                 maVtu: '0.3.1.' + sttObj,
                //                 tenVtu: item.tenHang,
                //                 maDviTinh: maDviTinh,
                //                 slTuM3: tongSoLuongTu,
                //                 slDuoiM3: tongSoLuongDuoi,
                //                 slTong: tongSoLuongTu + tongSoLuongDuoi,
                //                 gtTuM3: tongGiaTriTu,
                //                 gtDuoiM3: tongGiaTriDuoi,
                //                 gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //                 level: "2",
                //             })
                //         }
                //     }


                //     if (loaiHang == "M") {
                //         let tongSoLuongTu = 0
                //         let tongSoLuongDuoi = 0
                //         let tongGiaTriTu = 0
                //         let tongGiaTriDuoi = 0
                //         if (item.khoiTich >= 5000) {
                //             tongSoLuongTu += item.soLuong;
                //             tongGiaTriTu += item.giaTri
                //         }
                //         if (item.khoiTich < 5000) {
                //             tongSoLuongDuoi += item.soLuong;
                //             tongGiaTriDuoi += item.giaTri
                //         }
                //         lstMuoi.push({
                //             stt: '0.3.3',
                //             maVtu: '0.3.3',
                //             tenVtu: 'Muối',
                //             maDviTinh: "kg",
                //             slTuM3: tongSoLuongTu,
                //             slDuoiM3: tongSoLuongDuoi,
                //             slTong: tongSoLuongTu + tongSoLuongDuoi,
                //             gtTuM3: tongGiaTriTu,
                //             gtDuoiM3: tongGiaTriDuoi,
                //             gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //             level: "2",
                //         })
                //     }

                //     let checkCS = tenHang.includes("cứu sinh")
                //     if (checkCS && loaiHang == "VT") {
                //         let tongSoLuongTu = 0
                //         let tongSoLuongDuoi = 0
                //         let tongGiaTriTu = 0
                //         let tongGiaTriDuoi = 0
                //         let stt = '0.3.2.1.1';
                //         if (item.khoiTich >= 5000) {
                //             tongSoLuongTu += item.soLuong;
                //             tongGiaTriTu += item.giaTri
                //         }
                //         if (item.khoiTich < 5000) {
                //             tongSoLuongDuoi += item.soLuong;
                //             tongGiaTriDuoi += item.giaTri
                //         }

                //         if (dataInfo.extraData[dataInfo.extraData.length - 1]?.stt !== stt) {
                //             dataInfo.extraData.push({
                //                 stt: '0.3.2.1.1',
                //                 maVtu: '0.3.2.1.1',
                //                 tenVtu: item.tenHang,
                //                 maDviTinh: maDviTinh,
                //                 slTuM3: tongSoLuongTu,
                //                 slDuoiM3: tongSoLuongDuoi,
                //                 slTong: tongSoLuongTu + tongSoLuongDuoi,
                //                 gtTuM3: tongGiaTriTu,
                //                 gtDuoiM3: tongGiaTriDuoi,
                //                 gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //                 level: "3",
                //             })
                //         } else {
                //             let stt = dataInfo.extraData[dataInfo.extraData.length - 1]?.stt;
                //             let sttObj = Number(stt.substring(stt.lastIndexOf('.') + 1, stt.length)) + 1
                //             dataInfo.extraData.push({
                //                 stt: '0.3.2.1.' + sttObj,
                //                 maVtu: '0.3.2.1.' + sttObj,
                //                 tenVtu: item.tenHang,
                //                 maDviTinh: maDviTinh,
                //                 slTuM3: tongSoLuongTu,
                //                 slDuoiM3: tongSoLuongDuoi,
                //                 slTong: tongSoLuongTu + tongSoLuongDuoi,
                //                 gtTuM3: tongGiaTriTu,
                //                 gtDuoiM3: tongGiaTriDuoi,
                //                 gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //                 level: "3",
                //             })
                //         }

                //     } else if (loaiHang == "VT" && !item.tenHang.includes('cứu sinh')) {
                //         let tongSoLuongTu = 0
                //         let tongSoLuongDuoi = 0
                //         let tongGiaTriTu = 0
                //         let tongGiaTriDuoi = 0
                //         let stt = '0.3.2.2.1';
                //         if (item.khoiTich >= 5000) {
                //             tongSoLuongTu += item.soLuong;
                //             tongGiaTriTu += item.giaTri
                //         }
                //         if (item.khoiTich < 5000) {
                //             tongSoLuongDuoi += item.soLuong;
                //             tongGiaTriDuoi += item.giaTri
                //         }

                //         if (dataInfo.extraData[dataInfo.extraData.length - 1]?.stt !== stt) {
                //             dataInfo.extraData.push({
                //                 stt: '0.3.2.2.1',
                //                 maVtu: '0.3.2.2.1',
                //                 tenVtu: item.tenHang,
                //                 maDviTinh: maDviTinh,
                //                 slTuM3: tongSoLuongTu,
                //                 slDuoiM3: tongSoLuongDuoi,
                //                 slTong: tongSoLuongTu + tongSoLuongDuoi,
                //                 gtTuM3: tongGiaTriTu,
                //                 gtDuoiM3: tongGiaTriDuoi,
                //                 gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //                 level: "3",
                //             })
                //         } else {
                //             let stt = dataInfo.extraData[dataInfo.extraData.length - 1]?.stt;
                //             let sttObj = Number(stt.substring(stt.lastIndexOf('.') + 1, stt.length)) + 1
                //             dataInfo.extraData.push({
                //                 stt: '0.3.2.2.' + sttObj,
                //                 maVtu: '0.3.2.2.' + sttObj,
                //                 tenVtu: item.tenHang,
                //                 maDviTinh: maDviTinh,
                //                 slTuM3: tongSoLuongTu,
                //                 slDuoiM3: tongSoLuongDuoi,
                //                 slTong: tongSoLuongTu + tongSoLuongDuoi,
                //                 gtTuM3: tongGiaTriTu,
                //                 gtDuoiM3: tongGiaTriDuoi,
                //                 gtTong: tongGiaTriTu + tongGiaTriDuoi,
                //                 level: "3",
                //             })
                //         }
                //     }


                // })
                // let slTuM31 = 0;
                // let slDuoiM31 = 0;
                // let slTong1 = 0;
                // let gtTuM31 = 0;
                // let gtDuoiM31 = 0;
                // let gtTong1 = 0;
                // lstMuoi.forEach(item => {
                //     slTuM31 += item.slTuM3;
                //     slDuoiM31 += item.slDuoiM3;
                //     slTong1 += item.slTong;
                //     gtTuM31 += item.gtTuM3;
                //     gtDuoiM31 += item.gtDuoiM3;
                //     gtTong1 += item.gtTong;
                // })
                // dataInfo.extraData.push({
                //     stt: '0.3.3',
                //     maVtu: '0.3.3',
                //     tenVtu: 'Muối',
                //     maDviTinh: "kg",
                //     slTuM3: slTuM31,
                //     slDuoiM3: slDuoiM31,
                //     slTong: slTuM31 + slDuoiM31,
                //     gtTuM3: gtTuM31,
                //     gtDuoiM3: gtDuoiM31,
                //     gtTong: gtTuM31 + gtDuoiM31,
                //     level: "2",
                // })

                // //phu luc bao hiem kho
                // let dataBaoHiemKho = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl_bh_kho').lstCtietLapThamDinhs;
                // let lstLv1 = []
                // dataBaoHiemKho.forEach(item => {
                //     if (item.maNhaKho == null && item.diaChiKho == null && item.tenNhaKho == null) {
                //         lstLv1.push({
                //             ...item,
                //             level: "1"
                //         })
                //     }
                // })
                // for (let i = 1; i <= lstLv1.length; i++) {
                //     lstLv1.forEach(item => {
                //         item.stt = "0." + i;
                //     })
                // }
                // let lstCon = [];
                // dataBaoHiemKho.forEach(item => {
                //     if (item.maNhaKho !== null && item.diaChiKho !== null && item.tenNhaKho !== null) {
                //         lstCon.push({
                //             ...item,
                //             level: "2"
                //         })
                //     }
                // })
                // let indexArr = []
                // lstLv1.forEach(item => {
                //     lstCon.forEach(itm => {
                //         if (itm.maDvi.startsWith(item.maDvi)) {
                //             indexArr.push(itm)
                //             for (let i = 1; i <= indexArr.length; i++) {
                //                 itm.stt = item.stt + "." + i;
                //             }
                //         }
                //     })
                // })
                // let a = lstLv1.concat(lstCon);
                // dataBaoHiemKho = a

                // const lstTemp = []

                // dataBaoHiemKho.forEach(item => {
                //     const level = item.stt.split('.').length - 2;
                //     let tongGtTu = 0;
                //     let tongDtDuoi = 0;
                //     let slNhaKhoTu1 = 0;
                //     let slNhaKhoDuoi1 = 0;
                //     if (level == 0) {
                //         tongGtTu += item.tuTongGtKho;
                //         tongDtDuoi += item.duoiTongGtKho;
                //         slNhaKhoTu1 += item.slNhaKhoTu;
                //         slNhaKhoDuoi1 += item.slNhaKhoDuoi;
                //     }
                //     lstTemp.push({
                //         stt: '0.2',
                //         maVtu: '0.2',
                //         tenVtu: 'Kho Hàng DTQG',
                //         maDviTinh: "",
                //         slTuM3: slNhaKhoTu1,
                //         slDuoiM3: slNhaKhoDuoi1,
                //         slTong: slNhaKhoTu1 + slNhaKhoDuoi1,
                //         gtTuM3: tongGtTu,
                //         gtDuoiM3: tongDtDuoi,
                //         gtTong: tongGtTu + tongDtDuoi,
                //         level: "0",
                //     })
                // })
                // let slTuM3 = 0;
                // let slDuoiM3 = 0;
                // let slTong = 0;
                // let gtTuM3 = 0;
                // let gtDuoiM3 = 0;
                // let gtTong = 0;
                // lstTemp.forEach(item => {
                //     slTuM3 += item.slTuM3;
                //     slDuoiM3 += item.slDuoiM3;
                //     slTong += item.slTong;
                //     gtTuM3 += item.gtTuM3;
                //     gtDuoiM3 += item.gtDuoiM3;
                //     gtTong += item.gtTong;
                // })

                // dataInfo.extraData.push({
                //     stt: '0.2',
                //     maVtu: '0.2',
                //     tenVtu: 'Kho Hàng DTQG',
                //     maDviTinh: "",
                //     slTuM3: slTuM3,
                //     slDuoiM3: slDuoiM3,
                //     slTong: slTuM3 + slDuoiM3,
                //     gtTuM3: gtTuM3,
                //     gtDuoiM3: gtDuoiM3,
                //     gtTong: gtTuM3 + gtDuoiM3,
                //     level: "0",
                // })
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
                if (Utils.statusSave.includes(this.baoCao.trangThai) || Utils.statusTiepNhan.includes(this.baoCao.trangThai)) {
                    dataInfo.extraData = [];
                    //phu luc 3
                    const data1 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl03');
                    if (data1?.trangThai != '3') {
                        data1?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                dataInfo.extraData.push({
                                    stt: '0.1.1.1.' + item.stt.substring(item.stt.lastIndexOf('.') + 1, item.stt.length),
                                    tenNdung: item.tenMatHang,
                                    thienNtruoc: item.thucHienNamTruoc,
                                    namDtoan: item.dtoanNamHtai,
                                    namUocThien: item.uocThNamHtai,
                                    namKh: item.ttienNamDtoan,
                                    giaTriThamDinh: item.ttienNamN1Td,
                                })
                            }
                        })
                    }
                    //phu luc 1
                    const data2 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl01N');
                    const data21 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl01X');
                    if (data2?.trangThai != '3' && data21?.trangThai != '3') {
                        let obj1 = {
                            stt: "",
                            level: 0,
                            tenNdung: "",
                            thienNtruoc: 0,
                            namDtoan: 0,
                            namUocThien: 0,
                            namKh: 0,
                            giaTriThamDinh: 0,
                        }
                        let obj2 = {
                            stt: "",
                            level: 0,
                            tenNdung: "",
                            thienNtruoc: 0,
                            namDtoan: 0,
                            namUocThien: 0,
                            namKh: 0,
                            giaTriThamDinh: 0,
                        }
                        data21?.lstCtietLapThamDinhs?.forEach(itm => {
                            const level = itm.stt.split('.').length - 2;
                            if (level == 0) {
                                obj1.stt = itm.stt;
                                obj1.level = itm.level;
                                obj1.thienNtruoc = itm.thienNamTruoc;
                                obj1.namDtoan = itm.dtoanNamHtai;
                                obj1.namUocThien = itm.uocNamHtai;
                                obj1.namKh = itm.ttienNamDtoan;
                                obj1.giaTriThamDinh = itm.ttienTd
                            }

                        })
                        data2?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                obj2.stt = item.stt;
                                obj2.level = item.level;
                                obj2.tenNdung = item.tenDanhMuc;
                                obj2.thienNtruoc = item.thienNamTruoc;
                                obj2.namDtoan = item.dtoanNamHtai;
                                obj2.namUocThien = item.uocNamHtai;
                                obj2.namKh = item.ttienNamDtoan;
                                obj2.giaTriThamDinh = item.ttienTd
                            }
                        })
                        if (obj2.level == 0 && obj1.level == 0) {
                            dataInfo.extraData.push({
                                stt: '0.1.1.2.' + obj2.stt.substring(obj2.stt.lastIndexOf('.') + 1, obj2.stt.length),
                                tenNdung: obj2.tenNdung,
                                thienNtruoc: obj2.thienNtruoc + obj1.thienNtruoc,
                                namDtoan: obj2.namDtoan + obj1.namDtoan,
                                namUocThien: obj2.namUocThien + obj1.namUocThien,
                                namKh: obj2.namKh + obj1.namKh,
                                giaTriThamDinh: obj2.giaTriThamDinh + obj1.giaTriThamDinh,
                            })
                        }
                    }
                    //phu luc 2
                    const data3 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl02');
                    if (data3?.trangThai != '3') {
                        data3?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 1) {
                                dataInfo.extraData.push({
                                    stt: '0.1.1.3.' + item.stt.substring(item.stt.lastIndexOf('.') + 1, item.stt.length),
                                    tenNdung: item.tenDanhMuc,
                                    thienNtruoc: item.thNamTruoc,
                                    namDtoan: item.namDtoan,
                                    namUocThien: item.namUocTh,
                                    namKh: item.tongCong,
                                    giaTriThamDinh: null,
                                })
                            }
                        })
                    }
                    //phu luc 4
                    const data4 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl04');
                    if (data4?.trangThai != '3') {
                        let tong4 = 0;
                        let td4 = 0;
                        data4?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                tong4 = sumNumber([tong4, item.duToanKhNamNCbDauTu, item.duToanKhNamNThDauTu]);
                                td4 = sumNumber([td4, item.duToanKhNamNCbDauTuTd, item.duToanKhNamNThDauTuTd]);
                            }
                        })
                        dataInfo.extraData.push({
                            stt: '0.1.2',
                            maNdung: '0.1.2',
                            namKh: tong4,
                            giaTriThamDinh: td4,
                        })
                    }
                    //phu luc 5
                    const data5 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl05');
                    if (data5?.trangThai != '3') {
                        let tong5 = 0;
                        let td5 = 0;
                        data5?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                tong5 += item.keHoachVon ? item.keHoachVon : 0;
                                td5 += item.keHoachVonTd ? item.keHoachVonTd : 0;
                            }
                        })
                        dataInfo.extraData.push({
                            stt: '0.1.3',
                            maNdung: '0.1.3',
                            namKh: tong5,
                            giaTriThamDinh: td5,
                        })
                    }
                    //phu luc 6
                    const data6 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl06');
                    if (data6?.trangThai != '3') {
                        let tong6 = 0;
                        let td6 = 0;
                        data6?.lstCtietLapThamDinhs?.forEach(item => {
                            tong6 += item.ncauTbiNamNTtien ? item.ncauTbiNamNTtien : 0;
                            td6 += item.ncauTbiNamNTtienTd ? item.ncauTbiNamNTtienTd : 0;
                        })
                        dataInfo.extraData.push({
                            stt: '0.1.4',
                            maNdung: '0.1.4',
                            namKh: tong6,
                            giaTriThamDinh: td6,
                        })
                    }
                    //phu luc bao hiem
                    const data7 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'pl_bh');
                    if (data7?.trangThai != '3') {
                        let tongTu = 0;
                        let tongDuoi = 0;
                        let tong = 0
                        data7?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                // tongTu = sumNumber([tongTu, item.gtTuM3]);
                                // tongDuoi = sumNumber([tongDuoi, item.gtDuoiM3])
                                tong = sumNumber([tong, item.gtTong])
                            }
                        })
                        dataInfo.extraData.push({
                            stt: '0.1.5',
                            maNdung: '0.1.5',
                            // namKh: sumNumber([mulNumber(divNumber(data7.hsBhDuoi, 100), tongDuoi), mulNumber(divNumber(data7.hsBhTu, 100), tongTu)]),
                            namKh: tong,
                            giaTriThamDinh: null,
                        })
                    }
                }
                break;
            case 'TT342_13.10':
                nzContent = BieuMau1310Component;
                break;
            case 'TT342_14':
                nzContent = BieuMau140Component;
                //bieu mau 15.1
                if (Utils.statusSave.includes(this.baoCao.trangThai)) {
                    dataInfo.extraData = [];
                    const data151 = this.baoCao.lstLapThamDinhs.find(item => item.maBieuMau == 'TT342_15.1');
                    if (data151?.trangThai != '3') {
                        const duocGiao = {
                            maNdung: '0.1.1',
                            thienNtruoc: 0,
                            namDtoan: 0,
                            namUocThien: 0,
                            namKh: 0,
                        }
                        const thucTe = {
                            maNdung: '0.1.2',
                            thienNtruoc: 0,
                            namDtoan: 0,
                            namUocThien: 0,
                            namKh: 0,
                        }
                        const quyLuong = {
                            maNdung: '0.2.1',
                            thienNtruoc: 0,
                            namDtoan: 0,
                            namUocThien: 0,
                            namKh: 0,
                        }
                        data151?.lstCtietLapThamDinhs?.forEach(item => {
                            duocGiao.thienNtruoc += item.thienTsoBcTqGiao ? item.thienTsoBcTqGiao : 0;
                            duocGiao.namDtoan += item.dtoanTsoBcheTqGiao ? item.dtoanTsoBcheTqGiao : 0;
                            duocGiao.namUocThien += item.uocThTsoBcTqGiao ? item.uocThTsoBcTqGiao : 0;
                            duocGiao.namKh += item.namKhTsoBcTqGiao ? item.namKhTsoBcTqGiao : 0;
                            thucTe.thienNtruoc += item.thienTsoBcTdiem ? item.thienTsoBcTdiem : 0;
                            thucTe.namDtoan += item.uocThTsoBcTdiem ? item.uocThTsoBcTdiem : 0;
                            thucTe.namUocThien += item.uocThTsoBcTdiem ? item.uocThTsoBcTdiem : 0;
                            thucTe.namKh += item.uocThTsoBcTdiem ? item.uocThTsoBcTdiem : 0;
                            quyLuong.thienNtruoc += item.thienQlPcap ? item.thienQlPcap : 0;
                            quyLuong.namDtoan += item.dtoanQluongPcap ? item.dtoanQluongPcap : 0;
                            quyLuong.namUocThien += item.uocThQlPcap ? item.uocThQlPcap : 0;
                            quyLuong.namKh += item.namKhQlPcap ? item.namKhQlPcap : 0;
                        })
                        dataInfo.extraData.push(duocGiao);
                        dataInfo.extraData.push(thucTe);
                        dataInfo.extraData.push(quyLuong);
                    }
                }
                break;
            case 'TT342_15.1':
                nzContent = BieuMau151Component;
                break;
            case 'TT342_15.2':
                nzContent = BieuMau152Component;
                break;
            case 'TT342_16':
                nzContent = BieuMau160Component;
                break;
            // thong tu 69
            case 'TT69_13':
                nzContent = BieuMau13Component;
                if (Utils.statusSave.includes(this.baoCao.trangThai)) {
                    dataInfo.extraData = {
                        nhucauDan: 0,
                        lstBieuMau: [],
                    }
                    //thong tin phu luc du an
                    const dataDa = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'plda');
                    if (dataDa?.trangThai != '3') {
                        dataDa?.lstCtietLapThamDinhs?.forEach(e => {
                            const level = e.stt.split('.').length - 2;
                            if (level == 0) {
                                dataInfo.extraData.nhucauDan = sumNumber([dataInfo.extraData.nhucauDan, e.khTongSoNamN])
                            }
                        })
                    }
                    //bieu mau 13.1
                    const temp1 = {
                        maNdung: '0.1.2.1',
                        namHienHanhDtoan: 0,
                        namHienHanhUocThien: 0,
                        ncauChiN: 0,
                    }
                    const data131 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT342_13.1');
                    if (data131?.trangThai != '3') {
                        data131?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                temp1.namHienHanhDtoan = sumNumber([temp1.namHienHanhDtoan, item.namDtoan]);
                                temp1.namHienHanhUocThien = sumNumber([temp1.namHienHanhUocThien, item.namUocThien]);
                                temp1.ncauChiN = sumNumber([temp1.ncauChiN, item.giaTriThamDinh ? item.giaTriThamDinh : item.namKh]);
                            }
                        })
                        dataInfo.extraData.lstBieuMau.push(temp1);
                    }
                    //bieu mau 13.3
                    const temp2 = {
                        maNdung: '0.1.2.2',
                        namHienHanhDtoan: 0,
                        namHienHanhUocThien: 0,
                        ncauChiN: 0,
                    }
                    const data133 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT342_13.3');
                    if (data133?.trangThai != '3') {
                        data133?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                temp2.namHienHanhDtoan = sumNumber([temp2.namHienHanhDtoan, item.kphiThienNamNsnnDtoan]);
                                temp2.namHienHanhUocThien = sumNumber([temp2.namHienHanhUocThien, item.kphiThienNamNsnnUth]);
                                temp2.ncauChiN = sumNumber([temp2.ncauChiN, item.kphiThienDtoanTso]);
                            }
                        })
                        dataInfo.extraData.lstBieuMau.push(temp2);
                    }
                    //bieu mau 13.8
                    const temp3 = {
                        maNdung: '0.1.2.3',
                        namHienHanhDtoan: 0,
                        namHienHanhUocThien: 0,
                        ncauChiN: 0,
                    }
                    const data138 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT342_13.8');
                    if (data138?.trangThai != '3') {
                        data138?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                temp3.namHienHanhDtoan = sumNumber([temp3.namHienHanhDtoan, item.namDtoan]);
                                temp3.namHienHanhUocThien = sumNumber([temp3.namHienHanhUocThien, item.namUocThien]);
                                temp3.ncauChiN = sumNumber([temp3.ncauChiN, item.giaTriThamDinh ? item.giaTriThamDinh : item.namKh]);
                            }
                        })
                        dataInfo.extraData.lstBieuMau.push(temp3);
                    }
                    //bieu mau 13.10
                    const temp4 = {
                        maNdung: '0.1.2.4',
                        namHienHanhDtoan: 0,
                        namHienHanhUocThien: 0,
                        ncauChiN: 0,
                    }
                    const data1310 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT342_13.10');
                    if (data1310?.trangThai != '3') {
                        data1310?.lstCtietLapThamDinhs?.forEach(item => {
                            const level = item.stt.split('.').length - 2;
                            if (level == 0) {
                                temp4.namHienHanhDtoan = sumNumber([temp4.namHienHanhDtoan, item.namDtoanGiao]);
                                temp4.namHienHanhUocThien = sumNumber([temp4.namHienHanhUocThien, item.namUocThien]);
                                temp4.ncauChiN = sumNumber([temp4.ncauChiN, item.gtriTdinhDtoanNam ? item.gtriTdinhDtoanNam : item.khDtoanNam]);
                            }
                        })
                        dataInfo.extraData.lstBieuMau.push(temp4);
                    }
                    //bieu mau 14
                    const temp5 = {
                        maNdung: '0.1.2.5',
                        namHienHanhDtoan: 0,
                        namHienHanhUocThien: 0,
                        ncauChiN: 0,
                    }
                    const data14 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT342_14');
                    const dataTemp = data14?.lstCtietLapThamDinhs?.find(e => e.maNdung == '0.2');
                    if (dataTemp) {
                        temp5.namHienHanhDtoan = dataTemp.namDtoan;
                        temp5.namHienHanhUocThien = dataTemp.namUocThien;
                        temp5.ncauChiN = dataTemp.giaTriThamDinh ? dataTemp.giaTriThamDinh : dataTemp.namKh;
                    }
                    dataInfo.extraData.lstBieuMau.push(temp5);
                    //bieu mau 16
                    const temp6 = {
                        maNdung: '0.1.3',
                        namHienHanhDtoan: 0,
                        namHienHanhUocThien: 0,
                        ncauChiN: 0,
                    }
                    const data16 = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT342_16')?.lstCtietLapThamDinhs;
                    data16?.forEach(item => {
                        temp6.namHienHanhDtoan = sumNumber([temp6.namHienHanhDtoan, item.khTtien]);
                        temp6.namHienHanhUocThien = sumNumber([temp6.namHienHanhUocThien, item.uocThTtien]);
                        temp6.ncauChiN = sumNumber([temp6.ncauChiN, item.tdinhTtien ? item.tdinhTtien : item.namKhTtien]);
                    })
                    dataInfo.extraData.lstBieuMau.push(temp6);
                }
                break;
            case 'TT69_14':
                nzContent = BieuMau14Component;
                break;
            case 'TT69_16':
                nzContent = BieuMau16Component;
                //bieu mau 13
                dataInfo.extraData = [];
                const dataChiNs = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT69_13');
                if (dataChiNs?.trangThai != '3') {
                    dataChiNs?.lstCtietLapThamDinhs.forEach(item => {
                        if (item.maNdung.startsWith('0.1.2') && item.maNdung != '0.1.2') {
                            dataInfo.extraData.push({
                                ...item,
                                maNdung: '0.' + item.maNdung.substring(item.maNdung.lastIndexOf('.') + 1, item.maNdung.length),
                            })
                        }
                    })
                }
                break;
            case 'TT69_17':
                nzContent = BieuMau17Component;
                //bieu mau 16
                dataInfo.extraData = [];
                const dataCtx = this.baoCao.lstLapThamDinhs.find(e => e.maBieuMau == 'TT69_16');
                if (dataCtx?.trangThai != '3') {
                    dataCtx?.lstCtietLapThamDinhs.forEach(item => {
                        const level = item.stt.split('.').length - 2;
                        if (level == 0) {
                            dataInfo.extraData.push({
                                maNdung: item.maNdung,
                                thNamHienHanhN1: item.thNamHienHanhN1,
                                ncauChiN: item.ncauChiN,
                                ncauChiN1: item.ncauChiN1,
                                ncauChiN2: item.ncauChiN2,
                            });
                        }
                    })
                }
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
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '90%',
            nzFooter: null,
            nzComponentParams: {
                dataInfo: dataInfo
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                //gan lai thong tin sau khi bieu mau duoc luu
                const index = this.baoCao.lstLapThamDinhs.findIndex(e => e.maBieuMau == res.formDetail.maBieuMau);
                this.baoCao.lstLapThamDinhs[index] = res.formDetail;
                this.baoCao.lstLapThamDinhs[index].tenPl = formDetail.tenPl;
                this.baoCao.lstLapThamDinhs[index].tenDm = formDetail.tenDm;
            }
        });
    }

    saveAppendix(formDetail: ItemData) {
        this.lapThamDinhService.updateLapThamDinh(formDetail).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
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
