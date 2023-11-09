import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Roles, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import * as XLSX from 'xlsx-js-style';
import { Doc } from '../giao-du-toan-thuc-te.constant';

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
    // donVis: any[] = [];
    noiDungs: any[] = [];
    donViTiens: any[] = Utils.DVI_TIEN;
    trangThais: any[] = Status.TRANG_THAI_FULL;
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
    Status = Status;
    path: string;

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload() {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        console.log(this.listFile);

        this.fileList = [];
    };

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
    ) {
    }

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
            this.spinner.show();

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
            // this.namPa = this.newDate.getFullYear();
            this.spinner.hide()
        }



        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNdung: e.ma,
                    idKm: e.id,
                    nguonKhac: 0,
                    nguonNsnn: 0,
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
        this.path = this.maDonViTao + "/" + this.maPa
        await this.getChildUnit();
        this.getStatusButton();
        await this.checkPlanBTC();
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
                    this.lstDvi = this.lstDvi.filter(e => e.tenVietTat && (e.tenVietTat.includes("CDT") || e.tenVietTat.includes("CNTT") || e.tenVietTat.includes("_VP") || e.tenVietTat.includes("BQLDA")))
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

    getIdCha(maKM: any) {
        return this.noiDungs.find(e => e.ma == maKM)?.maCha;
    }

    getStatusButton() {
        if (this.id && this.userService.isAccessPermisson(Roles.GTT.NHAP_QUYETDINH_BTC)) {
            this.status = true;
        } else {
            this.status = false;
        }
        const checkChirld = this.maDonViTao == this.userInfo?.MA_DVI;

        this.statusBtnSave = !([Status.TT_01].includes(this.isStatus) && this.userService.isAccessPermisson(Roles.GTT.SUA_QUYETDINH_BTC) && checkChirld);

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
        if (this.userInfo.sub == "lanhdaotc" || this.userInfo.sub == "truongbophantc") {
            this.statusBtnSave = true;
            this.statusBtnNew = true;
            this.statusBtnCopy = true;
            this.statusBtnPrint = true;
            this.status = true;
        }


        if (!this.userService.isAccessPermisson(Roles.GTT.NHAP_CV_QD_GIAO_PA_PBDT)) {
            this.statusBtnNew = true;
        }
    };

    async checkPlanBTC() {
        const searchFilterTemp =
        {
            loaiTimKiem: "0",
            maPhanGiao: '2',
            maLoai: '2',
            namPa: null,
            ngayTaoTu: "",
            ngayTaoDen: "",
            donViTao: this.userInfo.MA_DVI,
            loai: null,
            maPa: "",
            maLoaiDan: [1, 2],
            soQd: "",
            trangThaiGiaos: [
                "0",
                "1",
                "2"
            ],
            trangThais: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9"
            ],
            paggingReq: {
                limit: 10,
                page: 1
            },
        }
        let lstCheck = [];
        await this.giaoDuToanChiService.timPhuongAnGiao(searchFilterTemp).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    lstCheck = data.data.content
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            }, (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
        let lstCheckMaPa = []
        lstCheck.forEach(item => {
            lstCheckMaPa.push(item.maPaCha)
        })

        if (this.userService.isAccessPermisson(Roles.GTT.SUA_QUYETDINH_BTC)) {
            if (lstCheckMaPa.includes(this.maPa)) {
                this.status = true;
                this.statusBtnEdit = true;
                this.statusBtnSave = true;
            } else {
                this.status = false;
                this.statusBtnEdit = false;
                this.statusBtnSave = false;
            }
        }
    }

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
                    if (this.userService.isAccessPermisson(Roles.GTT.XEM_PA_PBDT)) {
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

    sortByIndex() {
        this.setLevel();
        this.lstCtietBcao.sort((item1, item2) => {
            if (item1.level > item2.level) {
                return 1;
            }
            if (item1.level < item2.level) {
                return -1;
            }
            if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
                return -1;
            }
            if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
                return 1;
            }
            return 0;
        });
        const lstTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == Table.preIndex(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcao = lstTemp;
    }

    setDetail() {
        this.lstCtietBcao.forEach(item => {
            item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
        })
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

    async save() {
        let checkSaveEdit;
        let checkNhap = 0;
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
            if (item?.tongCong) {
                checkNhap += Number(item?.tongCong)
            }
        })


        if (!checkNhap || checkNhap == 0) {
            this.notification.warning(MESSAGE.WARNING, "Không có dữ liệu trong bảng, vui lòng nhập");
            return;
        }

        // this.lstCtietBcao.forEach(item => {
        //     checkNhap += item.tongCong
        // })

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
        // //get list file url
        // const listFile: any = [];
        // for (const iterator of this.listFile) {
        //     listFile.push(await this.uploadFile(iterator));
        // }

        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: this.lstFiles,
            listIdFiles: this.listIdFilesDelete,
            lstCtiets: lstCtietBcaoTemp,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maLoaiDan: "1",
            maPa: this.maPa,
            namPa: this.namPa,
            maPhanGiao: '1',
            trangThai: this.isStatus,
            thuyetMinh: this.thuyetMinh,
            soQd: this.soQd,
        }));


        const fileDinhKems = [];
        for (const iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.lstFiles.find(e => e.id == id)?.noiDung;
            fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.path, noiDung));
        }
        request.fileDinhKems = fileDinhKems;

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
        } else {
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

    back() {
        const obj = {
            tabSelected: "dsquyetDinh",
        }
        this.dataChange.emit(obj);
    };


    async taoMoiPhuongAn(loaiPa) {
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
        const request1 = {
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
            maLoaiDan: '1',
            trangThai: "1",
            thuyetMinh: "",
            idPaBTC: this.id,
            tabSelected: 'phuongAnGiaoDuToan',
        };

        const request2 = {
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
            maLoaiDan: '2',
            trangThai: "1",
            thuyetMinh: "",
            idPaBTC: this.id,
            tabSelected: 'phuongAnGiaoDieuChinh',
        };

        if (loaiPa) {
            if (loaiPa == 1) {
                this.dataChange.emit(request1);
            }

            if (loaiPa == 2) {
                this.dataChange.emit(request2);
            }
        }
    };


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

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

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

    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    //tìm vị trí cần để thêm mới
    findVt(str: string): number {
        const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
        let index: number = start;
        for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
            if (this.lstCtietBcao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = Table.preIndex(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    deleteLine(id: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = Table.preIndex(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (Table.preIndex(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1);
        this.sum(stt)
        this.updateEditCache();
    };

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...this.initItem,
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

    getTotal() {
        this.total.nguonKhac = 0;
        this.total.nguonNsnn = 0;
        this.total.tongCong = 0;
        this.lstCtietBcao.forEach(item => {
            this.total.nguonKhac += item.nguonKhac;
            this.total.nguonNsnn += item.nguonNsnn;
            this.total.nguonKhac += item.nguonKhac;
        })
        if (
            this.total.nguonKhac == 0,
            this.total.nguonNsnn == 0,
            this.total.tongCong == 0
        ) {
            this.total.nguonKhac = null,
                this.total.nguonNsnn = null,
                this.total.tongCong = null
        }
    };

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

    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    };

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    };


    addFirst(initItem: ItemData) {
        if (initItem.id) {
            const item: ItemData = {
                ...initItem,
                stt: "0.1",
            }
            this.lstCtietBcao.push(item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            const item: ItemData = {
                ...initItem,
                level: 0,
                id: uuid.v4() + 'FE',
                stt: "0.1",
            }
            this.lstCtietBcao.push(item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    };

    addLow(id: any, initItem: ItemData) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        let stt: string;
        if (this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt);
            for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
                if (Table.preIndex(this.lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        // them moi phan tu
        if (initItem.id) {
            const item: ItemData = {
                ...initItem,
                stt: stt,
            }
            this.lstCtietBcao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            if (this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == Table.preIndex(stt)) == -1) {
                this.sum(stt);
                this.updateEditCache();
            }
            const item: ItemData = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
            }
            this.lstCtietBcao.splice(index + 1, 0, item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    };

    changeModel(id: any) {
        this.editCache[id].data.tongCong = Number(this.editCache[id].data.nguonNsnn) + Number(this.editCache[id].data.nguonKhac);
    };

    saveEdit(id: string): void {
        if (this.editCache[id].data.nguonKhac < 0 ||
            this.editCache[id].data.nguonNsnn < 0) {
            this.notification.warning(MESSAGE.WARNING, "Giá trị nhập không được âm")
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    };

    deleteFile(id: string): void {
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    };


    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        let tenSqd
        if (!this.soQd || !this.soQd?.fileName) {
            tenSqd = ''
        } else {
            tenSqd = this.soQd.fileName
        }

        const header = [
            { t: 0, b: 5 + this.lstCtietBcao.length, l: 0, r: 8, val: null },

            { t: 0, b: 0, l: 0, r: 1, val: `Quyết định Bộ Tài Chính năm ${this.namPa}` },

            { t: 1, b: 1, l: 0, r: 0, val: `Số qđ ` },
            { t: 1, b: 1, l: 1, r: 1, val: `Ngày ` },
            { t: 1, b: 1, l: 2, r: 2, val: `Mã phương án BTC` },
            { t: 1, b: 1, l: 3, r: 3, val: `Trạng thái ` },

            { t: 2, b: 2, l: 0, r: 0, val: `${tenSqd}` },
            { t: 2, b: 2, l: 1, r: 1, val: ` ${this.ngayTao} ` },
            { t: 2, b: 2, l: 2, r: 2, val: ` ${this.maPa} ` },
            { t: 2, b: 2, l: 3, r: 3, val: ` ${this.getStatusName(this.isStatus)} ` },

            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung' },
            { t: 4, b: 5, l: 2, r: 2, val: 'Tổng cộng' },
            { t: 4, b: 4, l: 3, r: 4, val: 'Trong đó' },

            { t: 5, b: 5, l: 3, r: 3, val: 'Nguồn NSNN' },
            { t: 5, b: 5, l: 4, r: 4, val: 'Nguồn khác' },
        ]

        const headerBot = 5;
        this.lstCtietBcao.forEach((item, index) => {
            const row = headerBot + index + 1;
            const tenNdung = this.getTenNdung(item.maNdung);
            header.push({ t: row, b: row, l: 0, r: 0, val: this.getChiMuc(item.stt) })
            header.push({ t: row, b: row, l: 1, r: 1, val: tenNdung })
            header.push({ t: row, b: row, l: 2, r: 2, val: item.tongCong?.toString() })
            header.push({ t: row, b: row, l: 3, r: 3, val: item.nguonNsnn?.toString() })
            header.push({ t: row, b: row, l: 4, r: 4, val: item.nguonKhac?.toString() })

        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.maPa;
        excelName = excelName + '_GTT_QDBTC.xlsx'
        XLSX.writeFile(workbook, excelName);
    }

    getTenNdung(maNdung: number): any {
        let tenNdung: string;
        this.noiDungs.forEach(itm => {
            if (itm.ma == maNdung) {
                return tenNdung = itm.giaTri;
            }
        })
        return tenNdung
    }

}
