import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Operator, Table, Utils, Status } from 'src/app/Utility/utils';
import { DialogCopyGiaoDuToanComponent } from 'src/app/components/dialog/dialog-copy-giao-du-toan/dialog-copy-giao-du-toan.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';


export const TRANG_THAI_TIM_KIEM = [
    {
        id: "1",
        tenDm: 'Đang soạn'
    },
    {
        id: "2",
        tenDm: 'Trình duyệt'
    },
    {
        id: "3",
        tenDm: 'Từ chối duyệt'
    },
    {
        id: "4",
        tenDm: 'Duyệt'
    },
    {
        id: "5",
        tenDm: 'Từ chối phê duyệt'
    },
    {
        id: "6",
        tenDm: 'Phê duyệt',
    },
    {
        id: "7",
        tenDm: 'Phê duyệt'
    },
    {
        id: "8",
        tenDm: 'Từ chối tiếp nhận'
    },
    {
        id: "9",
        tenDm: 'Tiếp nhận'
    },
    // {
    //     id: "10",
    //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
    // },
]

export class ItemData {
    id!: any;
    stt: any;
    level: number;
    maNdung: number;
    idKm: number;
    tongCong: number;
    nguonNsnn: number;
    nguonKhac: number;
    checked!: boolean;
}

export class ItemDvi {
    id: any;
    maDviNhan: string;
    soTranChi: number;
    trangThai: string;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-tao-moi-quyet-dinh-btc',
    templateUrl: './tao-moi-quyet-dinh-btc.component.html',
    styleUrls: ['./tao-moi-quyet-dinh-btc.component.scss']
})

export class TaoMoiQuyetDinhBtcComponent implements OnInit {
    @Input() data;
    // @Input() isStatus;
    @Output() dataChange = new EventEmitter();
    Op = new Operator("1")
    id: string;
    userInfo: any;
    //thong tin chung bao cao
    userRole: string; // role người dùng
    ngayTao: string;
    maDonViTao: string;
    maPa: string;
    maPaCha: string;
    lstDvi: any[] = [];                                         //danh sach don vi da duoc chon
    namPa: any;
    soQd: ItemCongVan = new ItemCongVan();
    isStatus: any;
    newDate = new Date();
    maDviTien: string;
    thuyetMinh: string;
    maLoai = '2';
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    noiDungs: any[] = [];
    donViTiens: any[] = Utils.DVI_TIEN;
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    soLaMa: any[] = Utils.LA_MA;
    initItem: ItemData = {
        id: null,
        stt: "0",
        level: null,
        maNdung: 0,
        idKm: null,
        tongCong: null,
        nguonNsnn: null,
        nguonKhac: null,
        checked: false,
    };
    total: ItemData = {
        id: null,
        stt: "0",
        level: null,
        maNdung: 0,
        idKm: null,
        tongCong: null,
        nguonNsnn: null,
        nguonKhac: null,
        checked: false,
    };
    //trang thai cac nut
    status = false;
    statusBtnSave: boolean;
    statusBtnNew: boolean;
    statusBtnEdit: boolean;
    statusBtnCopy: boolean;
    statusBtnPrint: boolean;
    allChecked = false;

    //khac
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
    listId = '';
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    //beforeUpload: any;
    listIdFilesDelete: any = [];                        // id file luc call chi tiet
    editMoneyUnit = false;
    isDataAvailable = false;
    amount = Operator.amount;
    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };
    Status = Status
    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({ id: id, fileName: file?.name, fileUrl: file?.url, fileSize: file?.size });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    // before upload file so quyet dinh
    beforeUploadSoQuyetDinh = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.soQd = {
            fileName: file.name,
            fileSize: null,
            fileUrl: null,
        };
        return false;
    };

    constructor(
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
        public giaoDuToanChiService: GiaoDuToanChiService,
        public quanLyVonPhiService: QuanLyVonPhiService,
        private userService: UserService,
        private danhMucService: DanhMucService,
    ) { }

    ngOnInit() {
        this.action('init');
    };

    async action(code: string) {
        this.spinner.show();
        this.isDataAvailable = false;
        switch (code) {
            case 'init':
                await this.initialization().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'save':
                await this.save().then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'detail':
                await this.getDetailReport().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            default:
                break;
        }
        this.spinner.hide();
    };


    async initialization() {
        this.spinner.show();
        const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL1');
        if (category) {
            this.noiDungs = category.data;
        }
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        this.maDonViTao = this.userInfo?.MA_DVI;
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.isStatus = this.data.isStatus;
            this.maDonViTao = this.userInfo?.MA_DVI;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.maDviTien = '1';
            this.namPa = this.data?.namPa;
            this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maPa = res.data;
                        const sub = "BTC";
                        this.maPa = this.maPa.slice(0, 2) + sub + this.maPa.slice(2);
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }

        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNdung: e.ma,
                    idKm: e.id
                })
            })
            this.setLevel();
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNdung;
            })
        }
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        if (this.userInfo.CAP_DVI != "1") {
            this.statusBtnSave = true;
            this.statusBtnNew = true;
            this.statusBtnCopy = true;
            this.statusBtnPrint = true;
            this.status = true;
        }
        await this.getChildUnit();
        this.getStatusButton();
        this.updateEditCache();
        this.spinner.hide();
    };

    // get danh sách đơn vị con 
    async getChildUnit() {
        const request = {
            maDviCha: this.maDonViTao,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.lstDvi = data.data;
                    this.lstDvi = this.lstDvi.filter(e => e.tenVietTat && (e.tenVietTat.includes("CDT") || e.tenVietTat.includes("CNTT") || e.tenVietTat.includes("_VP")))
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    // check điều kiện ẩn hiện nút trong màn hình 
    getStatusButton() {
        if (this.id && this.userService.isAccessPermisson(Roles.GDT.ADD_REPORT_PA_PBDT)) {
            this.status = true;
        } else {
            this.status = false;
        }
        const checkChirld = this.maDonViTao == this.userInfo?.MA_DVI;

        this.statusBtnSave = !(Status.TT_01 == this.isStatus && this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_BTC) && checkChirld);

        if (this.id) {
            this.statusBtnSave = true;
        }
        if (!this.id) {
            this.statusBtnNew = true;
            this.statusBtnEdit = true;
        } else {
            if (this.lstCtietBcao.length > 0) {
                this.statusBtnNew = false;
                this.statusBtnEdit = true;
            } else {
                this.statusBtnNew = true;
                this.statusBtnEdit = false;
            }
        }
        this.statusBtnCopy = !([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09].includes(this.isStatus) && this.userService.isAccessPermisson(Roles.GDT.COPY_REPORT_PA_PBDT) && checkChirld);
        this.statusBtnPrint = !([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09].includes(this.isStatus) && this.userService.isAccessPermisson(Roles.GDT.PRINT_REPORT_PA_PBDT) && checkChirld);

        if (this.userInfo.sub == "lanhdaotc" || this.userInfo.sub == "truongbophantc") {
            this.statusBtnSave = true;
            this.statusBtnNew = true;
            this.statusBtnCopy = true;
            this.statusBtnPrint = true;
            this.status = true;
        }


        if (!this.userService.isAccessPermisson(Roles.GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT)) {
            this.statusBtnNew = true;
        }
    };

    // all api get chi tiết màn hình
    async getDetailReport() {
        this.spinner.show();
        await this.giaoDuToanChiService.QDGiaoChiTiet(this.id, this.maLoai).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.lstCtietBcao = data.data.lstCtiets[0];
                    this.maDviTien = data.data.maDviTien;
                    this.namPa = data.data.namPa;
                    this.isStatus = data.data.trangThai;
                    this.maPa = data.data.maPa;
                    this.maDonViTao = data.data.maDvi;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.soQd = data.data.soQd;
                    this.maPaCha = data.data.maPa;
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
                    if (this.userService.isAccessPermisson(Roles.GDT.VIEW_REPORT_PA_PBDT)) {
                        this.statusBtnSave = true;
                        this.statusBtnNew = true;
                        this.statusBtnCopy = true;
                        this.statusBtnPrint = true;
                        this.status = true;
                    }
                    this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao)
                    this.getStatusButton();
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
    };

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDonViTao + '/' + this.maPa);
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

    // call api lưu  
    async save() {
        let checkSaveEdit;
        let checkNhap;
        let checkNhap1;
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.lstCtietBcao.filter(item => {
            if (this.editCache[item.id].edit == true) {
                checkSaveEdit = false;
            }
        })
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        const lstCtietBcaoTemp: any[] = [];
        let checkMoneyRange = true;
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            if (item.tongCong > Utils.MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                listCtietDvi: [],
            })

            checkNhap += item.nguonKhac
            checkNhap1 += item.nguonNsnn
        })

        if (checkNhap == 0 && checkNhap1 == 0) {
            this.notification.warning(MESSAGE.WARNING, "Không có dữ liệu trong bảng, vui lòng nhập");
            return;
        }

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        });
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
        //get list file url
        const listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }

        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: this.lstFiles,
            listIdFiles: this.listIdFilesDelete,
            lstCtiets: lstCtietBcaoTemp,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maLoaiDan: "3",
            maPa: this.maPa,
            namPa: this.namPa,
            maPhanGiao: '1',
            trangThai: this.isStatus,
            thuyetMinh: this.thuyetMinh,
            soQd: this.soQd,
        }));



        //get file cong van url
        const file: any = this.fileDetail;
        //get file cong van url
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                request.soQd = await this.uploadFile(file);
            }
        }
        if (this.soQd.fileName == null) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return
        }
        if (!request.soQd) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        this.spinner.show();
        if (!this.id) {
            this.giaoDuToanChiService.giaoDuToan(request).toPromise().then(
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
        }
        else {
            this.giaoDuToanChiService.updateLapThamDinhGiaoDuToan(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        this.id = data.data.id;
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
    };

    // back lại trang trước 
    back() {
        const obj = {
            tabSelected: "dsquyetDinh",
        }
        this.dataChange.emit(obj);
    };

    // Tạo mới phương án 
    async taoMoiPhuongAn() {
        const listCtietDvi: any[] = [];
        const maPaCha = this.maPa
        let maPa
        await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maPa = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                    return;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                return;
            },
        );

        this.lstDvi.forEach(item => {
            listCtietDvi.push({
                id: uuid.v4() + 'FE',
                maDviNhan: item.maDvi,
                soTranChi: 0,
            })
        })

        const lstCtietBcaoTemp: any[] = [];
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                tongCong: item.tongCong,
                nguonNsnn: item.nguonNsnn,
                nguonKhac: item.nguonKhac,
                lstCtietDvis: listCtietDvi,
                id: uuid.v4() + 'FE',
            })
        })
        const request = {
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            lstCtiets: lstCtietBcaoTemp,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: maPa,
            maPaCha: maPaCha,
            namPa: this.namPa,
            maPhanGiao: "2",
            maLoaiDan: '3',
            trangThai: "1",
            thuyetMinh: "",
            idPaBTC: this.id,
            tabSelected: 'phuongAnGiaoDuToan',
        };
        this.dataChange.emit(request);
    };

    // Hiển thị popup copy
    showDialogCopy() {
        const obj = {
            namBcao: this.namPa,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Báo Cáo',
            nzContent: DialogCopyGiaoDuToanComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                namBcao: obj.namBcao
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.doCopy(res);
            }
        });
    }

    // hàm thực thi copy
    async doCopy(response: any) {
        let maBcaoNew: string;
        await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maBcaoNew = res.data;
                    const sub = "BTC";
                    maBcaoNew = maBcaoNew.slice(0, 2) + sub + maBcaoNew.slice(2);
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        const lstCtietBcaoTemps: any[] = [];
        this.lstCtietBcao.forEach(data => {
            lstCtietBcaoTemps.push({
                ...data,
                id: null,
                listCtietDvi: [],
            })
        })
        const request = {
            id: null,
            fileDinhKems: [],
            listIdFiles: [],
            lstCtiets: lstCtietBcaoTemps,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: maBcaoNew,
            namPa: response.namBcao,
            maPhanGiao: '1',
            trangThai: this.isStatus,
            thuyetMinh: this.thuyetMinh,
            soQd: this.soQd,
        };

        this.giaoDuToanChiService.giaoDuToan(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
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
    }

    // check trạng thái để đặt class cho thẻ trạng thái 
    // statusClass() {
    //     if (Utils.statusSave.includes(this.isStatus)) {
    //         return 'du-thao-va-lanh-dao-duyet';
    //     } else {
    //         return 'da-ban-hanh';
    //     }
    // };

    // hiển thị tên trạng thái
    getStatusName(status: string) {
        return this.trangThais.find(e => e.id == status)?.tenDm;
    };

    //download file về máy tính
    async downloadFileCv() {
        if (this.soQd?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.soQd?.fileName);
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
    };

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
    };

    // get tên đơn vị tiền dựa trên mã đơn vị tiền
    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

    // update trạng thái checkbox của tất cả các dòng 
    updateAllChecked() {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    };

    // hiển thị số thứ tự
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (n == 1) {
            xau = chiSo[n];
        }
        if (n == 2) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        }
        if (n == 3) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    };


    // hàm tính tổng cộng dồn trong 1 cột 
    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                maNdung: data.maNdung,
                checked: data.checked,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].nguonKhac = Operator.sum([this.lstCtietBcao[index].nguonKhac, item.nguonKhac]);
                    this.lstCtietBcao[index].nguonNsnn = Operator.sum([this.lstCtietBcao[index].nguonNsnn, item.nguonNsnn]);
                    this.lstCtietBcao[index].tongCong = Operator.sum([this.lstCtietBcao[index].tongCong, item.tongCong]);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    };

    // hàm tính tổng 
    getTotal() {
        this.total.nguonKhac = 0;
        this.total.nguonNsnn = 0;
        this.total.tongCong = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.nguonKhac += item.nguonKhac;
                this.total.nguonNsnn += item.nguonNsnn;
                this.total.nguonKhac += item.nguonKhac;
            }
        })
    };

    // update dữ liệu từ editcache vào lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: {
                    ...item,
                }
            }
        })
    };

    // check có đối tượng có cấp thấp hơn đối tượng ở vị trí hiện tại không 
    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    };

    // đổi trạng thái edit sang true
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    // Hủy thay đổi 
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    };

    // Theo dõi thay đổi trong dòng 
    changeModel(id: any) {
        this.editCache[id].data.tongCong = Number(this.editCache[id].data.nguonNsnn) + Number(this.editCache[id].data.nguonKhac);
    };

    // Lưu dữ liệu từ editCache vào lstCtiteBcao
    saveEdit(id: string): void {
        if (
            (!this.editCache[id].data.nguonKhac) ||
            (!this.editCache[id].data.nguonNsnn)
        ) {
            this.notification.warning(MESSAGE.WARNING, "không được để trống")
            return;
        }
        if (this.editCache[id].data.nguonKhac < 0 ||
            this.editCache[id].data.nguonNsnn < 0) {
            this.notification.warning(MESSAGE.WARNING, "Giá trị nhập không được âm")
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
    };

    // Xóa file 
    deleteFile(id: string): void {
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    };
}
