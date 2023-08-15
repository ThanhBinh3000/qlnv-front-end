import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Roles, Status, Utils } from 'src/app/Utility/utils';
import { DialogCopyQuyetToanVonPhiHangDtqgComponent } from 'src/app/components/dialog/dialog-copy-quyet-toan-von-phi-hang-dtqg/dialog-copy-quyet-toan-von-phi-hang-dtqg.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuyetToanVonPhiService } from 'src/app/services/quan-ly-von-phi/quyetToanVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from "uuid";
import { DialogAddVatTuComponent } from '../dialog-add-vat-tu/dialog-add-vat-tu.component';
import { NOI_DUNG } from './add-dieu-chinh-quyet-toan.constant';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';
import { Doc } from '../../von-phi-hang-du-tru-quoc-gia.constant';
export class ItemData {
    id!: any;
    stt!: string;
    level: number;
    tenHang: string;
    maLoaiHang!: string;
    maDviTinh!: string;
    soLuong!: number;
    donGiaMua!: number;
    thanhTien!: number;
    checked!: boolean;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}


@Component({
    selector: 'app-add-dieu-chinh-quyet-toan',
    templateUrl: './add-dieu-chinh-quyet-toan.component.html',
    styleUrls: ['./add-dieu-chinh-quyet-toan.component.scss']
})

export class AddDieuChinhQuyetToanComponent implements OnInit {
    @Input() data;
    @Input() idInput;
    @Input() isStatus;
    @Output('close') onClose = new EventEmitter<any>();
    Status = Status
    Op = new Operator("1");
    // thong tin dang nhap
    userInfo: any;
    // info report 
    id: string;
    isDataAvailable = false;

    // status btn 
    titleStatus!: string;
    status = false;
    saveStatus = true;
    submitStatus = true;
    passStatus = true;
    approveStatus = true;
    acceptStatus = true;
    copyStatus = true;
    printStatus = true;

    // info data common
    maBcao!: string;
    namQtoan!: number;
    quyQtoan!: number;
    congVan: ItemCongVan = new ItemCongVan();
    ngayTao!: string;
    ngayTrinh!: string;
    ngayDuyet!: string;
    ngayPheDuyet!: string;
    // isStatus!: string;
    maPhanBcao = '2';
    maPhanBcaoCDieuChinh = 2;
    maDchinh!: string;
    thongBao: string;
    capDvi: string;

    // thong tin chi tiet bao cao;
    lstCtietBcao: ItemData[] = [];
    noiDungs: any[] = NOI_DUNG;
    donViTinhs: any[] = [];
    maDviTiens: any[] = Utils.DVI_TIEN;
    donVis: any = [];
    lstDsHangTrongKho: any[] = [];

    newDate = new Date();
    thuyetMinh: string;

    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: any = [];

    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
    editMoneyUnit = false;
    path: string;
    ngayCongVan: string;
    maDviTao!: string;
    maDviTien!: string;
    allChecked = false;                         // check all checkbox
    soLaMa: any[] = Utils.LA_MA;
    amount = Operator.amount;
    initItem: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        maLoaiHang: "",
        tenHang: "",
        maDviTinh: null,
        soLuong: null,
        donGiaMua: null,
        thanhTien: null,
        checked: false
    };
    total: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        maLoaiHang: "",
        tenHang: "",
        maDviTinh: null,
        soLuong: 0,
        donGiaMua: 0,
        thanhTien: null,
        checked: false
    };

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        const modalAppendix = this.modal.create({
            nzTitle: 'Thêm mới công văn',
            nzContent: DialogCongVanComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.ngayCongVan = res.ngayCongVan;
                this.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
            }
        });
        this.fileDetail = file;
        console.log(this.fileDetail);

        return false;
    };

    trangThais: any[] = [
        {
            id: Status.TT_01,
            tenDm: "Đang soạn",
        },
        {
            id: Status.TT_02,
            tenDm: "Trình duyệt",
        },
        {
            id: Status.TT_03,
            tenDm: "Trưởng BP từ chối",
        },
        {
            id: Status.TT_04,
            tenDm: "Trưởng BP duyệt",
        },
        {
            id: Status.TT_05,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Status.TT_06,
            tenDm: "Lãnh đạo phê duyệt",
        },
    ]


    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({
                id: id,
                fileName: file?.name,
                fileSize: file?.size,
                fileUrl: file?.url
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private quyetToanVonPhiService: QuyetToanVonPhiService,
        private danhMucService: DanhMucHDVService,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
    ) {

    }

    async ngOnInit() {
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
                await this.onSubmit('3', null).then(() => {
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
                await this.onSubmit('6', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.titleStatus = this.trangThais.find(e => e.id == this.isStatus)?.tenDm;
        this.spinner.hide();
    };

    async initialization() {
        this.userInfo = this.userService.getUserLogin();
        const rqKho = {
            maDvi: this.maDviTao,
            nam: Number(this?.namQtoan),
            quyQtoan: this?.quyQtoan,
        }
        await this.quyetToanVonPhiService.getHangHoaKho(rqKho).toPromise().then(
            async (data) => {
                this.lstDsHangTrongKho = data.data;


            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        if (this.idInput) {
            await this.getDetailReport();
        } else if (this.data.namQtoan) {
            // await this.getQuyetToan(this.data.namQtoan)
            this.idInput = null;
            this.spinner.show();
            const res = {
                namQtoan: this.data.namQtoan,
                quyQtoan: this.data.thangBcao,
            };
            await this.quyetToanVonPhiService.CtietBcaoQuyetToanNam(res).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.lstCtietBcao = data.data.lstCtiet;
                        this.maDviTien = data.data.maDviTien;
                        // this.sortByIndex();
                        this.maDchinh = data.data.maBcao;
                        this.thuyetMinh = data.data.thuyetMinh;
                        this.congVan = data.data.congVan;
                        this.lstFiles = data.data.fileDinhKems;
                        this.listFile = [];
                        this.getTotal()
                        this.updateEditCache();
                    } else {
                        this.notification.warning(MESSAGE.WARNING, data?.msg);
                        this.back();
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );



            this.isStatus = '1';
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.namQtoan = this.data?.namQtoan;
            this.quyQtoan = this.data?.quyQtoan;

            await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(this.maPhanBcaoCDieuChinh).toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.maBcao = data.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
            //lay danh sach danh muc don vi
            await this.danhMucService.dMDonVi().toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.donVis = data.data;
                        this.donVis.forEach(e => {
                            if (e.maDvi == this.userInfo?.MA_DVI) {
                                this.capDvi = e.capDvi;
                            }
                        })
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
            // danh sách đơn vị tính
            await this.danhMucService.dMDviTinh().toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.donViTinhs = data?.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            );
            this.maDviTao = this.userInfo?.MA_DVI;
            this.maDviTien = '1'
        }
        this.path = this.maDviTao + '/' + this.maPhanBcao
        this.sortByIndex();
        this.getTotal();
        this.getStatusButton();
        this.spinner.hide();
    };



    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (this.submitStatus != true && mcn < '2') {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
            return;
        }
        if (this.idInput) {
            const requestGroupButtons = {
                id: this.idInput,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.quyetToanVonPhiService.approveQuyetToan(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.isStatus = mcn;
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.maDviTao = data.data.maDviTao;
                    this.getStatusButton();
                    await this.danhMucService.dMDviTinh().toPromise().then(
                        (data) => {
                            if (data.statusCode == 0) {
                                this.donViTinhs = data?.data;
                            } else {
                                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                            }
                        },
                        (err) => {
                            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                        }
                    );
                    if (mcn == Status.TT_08 || mcn == Status.TT_05 || mcn == Status.TT_03) {
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
            this.spinner.hide();
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
        }
    }

    async getDetailReport() {
        this.spinner.show();
        await this.danhMucService.dMDviTinh().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donViTinhs = data?.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        await this.quyetToanVonPhiService.CtietBcaoQuyetToan(this.idInput).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.idInput = data.data.id;
                    this.lstCtietBcao = data.data.lstCtiet;
                    this.maDviTien = data.data.maDviTien;
                    this.sortByIndex();
                    // this.lstCtietBcao.forEach(item => {
                    //   item.donGiaMua = divMoney(item.donGiaMua, this.maDviTien);
                    //   item.thanhTien = divMoney(item.thanhTien, this.maDviTien);
                    // })
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.maBcao = data.data.maBcao;
                    this.isStatus = data.data.trangThai;
                    this.namQtoan = data.data.namQtoan;
                    this.quyQtoan = data.data.quyQtoan;
                    this.maDviTao = data.data.maDvi;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.thongBao = data.data.thongBao;
                    this.maDchinh = data.data.maDchinh;
                    this.congVan = data.data.congVan;
                    this.lstFiles = data.data.fileDinhKems;

                    this.listFile = [];
                    this.getTotal()
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
        this.spinner.hide();
    }

    // luu
    async save() {

        let checkSaveEdit;
        // if (!this.maDviTien) {
        //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
        //   return;
        // }
        // if (this.thongBao == null) {
        //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        //   return;
        // }
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
        // for (const itm of this.lstCtietBcao) {
        //   if (!itm.maDviTinh && !itm.soLuong && !itm.donGiaMua && !itm.thanhTien) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
        //     return;
        //   }
        // }
        this.lstCtietBcao.forEach(element => {
            if (this.editCache[element.id].edit === true) {
                checkSaveEdit = false
            }
        });
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: any = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            if (item.donGiaMua > Utils.MONEY_LIMIT || item.thanhTien > Utils.MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 36) {
                item.id = null;
            }
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

        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                lstCtietBcaoTemp.congVan = {
                    ...await this.quanLyVonPhiService.upFile(file, this.path),
                    fileName: this.congVan.fileName,
                }
            }
            this.fileDetail = null;
        }

        if (!lstCtietBcaoTemp.congVan.fileUrl) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }


        const request = JSON.parse(JSON.stringify({
            id: this.idInput,
            fileDinhKems: listFile,
            listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
            lstCtiet: lstCtietBcaoTemp,
            maDviTien: this.maDviTien,
            thuyetMinh: this.thuyetMinh,
            trangThai: this.isStatus,
            congVan: lstCtietBcaoTemp.congVan,
            maDvi: this.maDviTao,
            namQtoan: this.namQtoan,
            quyQtoan: this.quyQtoan,
            maBcao: this.maBcao,
            maPhanBcao: this.maPhanBcao,
            thongBao: this.thongBao,
            maDchinh: this.maDchinh,
        }));
        // //get file cong van url
        // const file: any = this.fileDetail;
        // if (file) {
        //     if (file.size > Utils.FILE_SIZE) {
        //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        //         return;
        //     } else {
        //         request.congVan = await this.uploadFile(file);
        //     }
        // }
        // if (file) {
        //     request.congVan = await this.uploadFile(file);
        // }
        // if (!request.congVan.fileName) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //     return;
        // }

        if (listFile.length > 0) {
            this.lstFiles = this.lstFiles.filter(item => item.fileUrl !== undefined)
            request.fileDinhKems = this.lstFiles.concat(listFile);
        } else {
            request.fileDinhKems = this.lstFiles;
        }

        // call service them moi
        this.spinner.show();
        if (this.idInput == null) {
            this.quyetToanVonPhiService.trinhDuyetServiceQuyetToan(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.idInput = data.data.id;
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
        } else {
            this.quyetToanVonPhiService.updateBaoCaoQuyetToan(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                })
        }
        this.lstCtietBcao.filter(item => {
            if (!item.id) {
                item.id = uuid.v4() + 'FE';
            }
        });
        this.submitStatus = true;
        this.spinner.hide();
    };

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maPhanBcao);
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
    };

    //nhóm các nút chức năng --báo cáo-----
    getStatusButton() {
        if ([Status.TT_01].includes(this.isStatus) && this.userService.isAccessPermisson(Roles.QTVP.EDIT_REPORT)) {
            this.status = false;
        } else {
            this.status = true;
        }
        // let checkParent = false;
        // let checkChirld = false;
        // const dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        // if (dVi && dVi.maDvi == this.userInfo?.MA_DVI) {
        //     checkChirld = true;
        // }
        const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
        // if (checkParent) {
        //     const index: number = this.trangThais.findIndex(e => e.id == Status.TT_07);
        //     this.trangThais[index].tenDm = "Mới";
        // }
        this.saveStatus = this.getBtnStatus([Status.TT_01], Roles.QTVP.ADD_REPORT, checkChirld);
        this.submitStatus = this.getBtnStatus([Status.TT_01], Roles.QTVP.APPROVE_REPORT, checkChirld);
        this.passStatus = this.getBtnStatus([Status.TT_02], Roles.QTVP.DUYET_QUYET_TOAN_REPORT, checkChirld);
        this.approveStatus = this.getBtnStatus([Status.TT_04], Roles.QTVP.PHE_DUYET_QUYET_TOAN_REPORT, checkChirld);
        this.copyStatus = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.QTVP.COPY_REPORT, checkChirld);
        this.printStatus = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.QTVP.PRINT_REPORT, checkChirld);

        // const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;

        // const checkSave = this.userService.isAccessPermisson(Roles.QTVP.EDIT_REPORT);
        // const checkSubmit = this.userService.isAccessPermisson(Roles.QTVP.APPROVE_REPORT);
        // const checkPass = this.userService.isAccessPermisson(Roles.QTVP.DUYET_QUYET_TOAN_REPORT);
        // const checkApprove = this.userService.isAccessPermisson(Roles.QTVP.PHE_DUYET_QUYET_TOAN_REPORT);
        // const checkCopy = this.userService.isAccessPermisson(Roles.QTVP.COPY_REPORT);
        // const checkPrint = this.userService.isAccessPermisson(Roles.QTVP.PRINT_REPORT);

        // if (Utils.statusSave.includes(this.isStatus) && checkSave) {
        //     this.status = false;
        // } else {
        //     this.status = true;
        // }

        // this.saveStatus = Utils.statusSave.includes(this.isStatus) && checkSave && checkChirld;
        // this.submitStatus = Utils.statusSave.includes(this.isStatus) && checkSubmit && checkChirld;
        // this.passStatus = Utils.statusSave.includes(this.isStatus) && checkPass && checkChirld;
        // this.approveStatus = Utils.statusSave.includes(this.isStatus) && checkApprove && checkChirld;
        // this.copyStatus = Utils.statusSave.includes(this.isStatus) && checkCopy && checkChirld;
        // this.printStatus = Utils.statusSave.includes(this.isStatus) && checkPrint && checkChirld;

    }
    getBtnStatus(status: string[], role: string, check: boolean) {
        return !(status.includes(this.isStatus) && this.userService.isAccessPermisson(role) && check);
    }
    // sortByIndex() {
    //   this.setDetail();
    //   this.lstCtietBcao.sort((item1, item2) => {
    //     if (item1.level > item2.level) {
    //       return 1;
    //     }
    //     if (item1.level < item2.level) {
    //       return -1;
    //     }
    //     if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
    //       return -1;
    //     }
    //     if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
    //       return 1;
    //     }
    //     return 0;
    //   });
    //   const lstTemp: any[] = [];
    //   this.lstCtietBcao.forEach(item => {
    //     const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
    //     if (index == -1) {
    //       lstTemp.splice(0, 0, item);
    //     } else {
    //       lstTemp.splice(index + 1, 0, item);
    //     }
    //   })

    //   this.lstCtietBcao = lstTemp;
    // };

    // setDetail() {
    //   this.lstCtietBcao.forEach(item => {
    //     item.level = this.noiDungs.find(e => e.id == item.maLoaiHang)?.level;
    //   })
    // };

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
        const lstTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcao = lstTemp;
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    getIdCha(maKM: any) {
        return this.noiDungs.find(e => e.id == maKM)?.idCha;
    };

    showDialogCopy() {
        const obj = {
            namBcao: this.namQtoan,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Báo Cáo',
            nzContent: DialogCopyQuyetToanVonPhiHangDtqgComponent,
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
    };

    async doCopy(response: any) {
        let maBcaoNew: string;
        await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(this.maPhanBcaoCDieuChinh).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    maBcaoNew = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );

        const lstCtietBcaoTemps: any[] = [];
        this.lstCtietBcao.forEach(data => {
            lstCtietBcaoTemps.push({
                ...data,
                id: null,
            })
        })
        const request = {
            id: null,
            fileDinhKems: [],
            listIdFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
            lstCtiet: lstCtietBcaoTemps,
            maDviTien: this.maDviTien,
            thuyetMinh: this.thuyetMinh,
            trangThai: this.isStatus,
            congVan: this.congVan,
            maDvi: this.maDviTao,
            namQtoan: response.namBcao,
            maBcao: maBcaoNew,
            maPhanBcao: this.maPhanBcao,
        };

        this.quyetToanVonPhiService.trinhDuyetServiceQuyetToan(request).toPromise().then(
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
    };

    back() {
        this.onClose.emit();
    };

    getMoneyUnit() {
        return this.maDviTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

    // statusClass() {
    //     if (Utils.statusSave.includes(this.isStatus)) {
    //         return 'du-thao-va-lanh-dao-duyet';
    //     } else {
    //         return 'da-ban-hanh';
    //     }
    // };

    //download file công văn về máy tính
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
    };

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
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
        // if (n == 3) {
        //   xau = String.fromCharCode(k + 96);
        // }
        if (n == 3) {
            xau = "-";
        }
        return xau;
    };
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    };
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    };
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
    };
    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }
    //thêm ngang cấp
    addSame(id: any, initItem: ItemData) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
        const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        // them moi phan tu
        if (initItem.id) {
            const item: ItemData = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
            }
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            const item: ItemData = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: head + "." + (tail + 1).toString(),
            }
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    };

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    };

    //thêm cấp thấp hơn
    addLow(id: any, initItem: ItemData) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        let stt: string;
        if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt);
            for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
                if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }
        if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
            this.sum(stt);
            this.updateEditCache();
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

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...this.initItem,
                id: data.id,
                stt: data.stt,
                maLoaiHang: data.maLoaiHang,
                tenHang: data.tenHang,
                donGiaMua: null,
                soLuong: null,
                checked: data.checked,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].soLuong = null;
                    this.lstCtietBcao[index].donGiaMua = null;
                    this.lstCtietBcao[index].thanhTien += item.thanhTien;
                }
            })
            stt = this.getHead(stt);
        }
        this.getTotal();
    };

    sum1() {
        this.lstCtietBcao.forEach(itm => {
            let stt = this.getHead(itm.stt);
            while (stt != '0') {
                const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
                const data = this.lstCtietBcao[index];
                this.lstCtietBcao[index] = {
                    ...new ItemData(),
                    id: data.id,
                    stt: data.stt,
                    donGiaMua: data.donGiaMua,
                    maLoaiHang: data.maLoaiHang,
                    level: data.level,
                    tenHang: data.tenHang,
                    soLuong: data.soLuong,
                    maDviTinh: data.maDviTinh,
                    thanhTien: data.thanhTien,
                }
                this.lstCtietBcao.forEach(item => {
                    if (this.getHead(item.stt) == stt) {
                        this.lstCtietBcao[index].thanhTien = Operator.sum([this.lstCtietBcao[index].thanhTien, item.thanhTien]);
                    }
                })
                stt = this.getHead(stt);
            }
            this.getTotal();
        })

    }

    getTotal() {
        this.total.soLuong = 0;
        // this.total.donGiaMua = 0;
        this.total.thanhTien = null;
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.soLuong = null;
                this.total.donGiaMua = null;
                this.total.thanhTien += item.thanhTien;
            }
        })
        if (this.total.thanhTien == 0) {
            this.total.thanhTien = null;
        }
    };

    deleteLine(id: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }

        this.replaceIndex(lstIndex, -1);
        this.sum(stt);
        this.updateEditCache();
    };


    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    };

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    changeModel(id: string): void {
        this.editCache[id].data.thanhTien = Number(this.editCache[id].data.soLuong) * Number(this.editCache[id].data.donGiaMua);
    };

    saveEdit(id: string): void {
        if (
            (!this.editCache[id].data.soLuong && this.editCache[id].data.soLuong !== 0) ||
            (!this.editCache[id].data.donGiaMua && this.editCache[id].data.donGiaMua !== 0)
        ) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
            return;
        }
        if (
            this.editCache[id].data.soLuong < 0 ||
            this.editCache[id].data.donGiaMua < 0
        ) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
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

    updateChecked(id: any) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
                if (index == -1) {
                    this.allChecked = !nho;
                    break;
                }
                nho = this.lstCtietBcao[index].checked;
            }
        }
    };

    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        let nho = true;
        this.lstCtietBcao.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
                nho = item.checked;
            }
        })
        return nho;
    };


    updateAllChecked() {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    };

    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    };

    addLine(id: any) {
        const maLoaiHang: any = this.lstCtietBcao.find(e => e.id == id)?.maLoaiHang;
        const obj = {
            maKhoanMuc: maLoaiHang,
            lstKhoanMuc: this.noiDungs,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogThemKhoanMucComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maLoaiHang == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = {
                        ...this.initItem,
                        maLoaiHang: res.maKhoanMuc,
                        level: this.noiDungs.find(e => e.id == maLoaiHang)?.level,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maLoaiHang == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maLoaiHang == item.id) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            maLoaiHang: item.id,
                            level: item.level,
                        };
                        this.addLow(id, data);
                    }
                })
                this.updateEditCache();
            }
        });
    };

    //thêm phần tử đầu tiên khi bảng rỗng
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

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    };

    getStatusName(status: string) {
        return this.trangThais.find(e => e.id == status)?.tenDm;
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

    handlSelectGoods(dataHang: any) {
        const obj = {
            stt: dataHang.stt,
        }

        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogAddVatTuComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalTuChoi.afterClose.subscribe(async (data) => {

            if (data) {

                // const dm = this.lstDsHangTrongKho.find(e => e.cloaiVthh == data.ma);
                const dataLK = this.lstDsHangTrongKho.find(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
                const dataPS = this.lstDsHangTrongKho.find(e => e.cloaiVthh == data.ma && e.maLoai == "PS");
                if (
                    this.lstCtietBcao.findIndex(e => (e.maLoaiHang == data.ma && e.donGiaMua == dataLK?.donGia)) == -1 ||
                    this.lstCtietBcao.findIndex(e => (e.maLoaiHang == data.ma && e.donGiaMua == dataPS?.donGia)) == -1
                ) {
                    let stt: any;
                    if (data.ma.startsWith('01') && dataHang.stt == "0.1.1") {
                        const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.1"));
                        const LST_LT_LK = LST_LT.filter(v => v.stt.startsWith("0.1.1"));
                        const LST_LT_LK_CHA = LST_LT_LK.filter(v => v.level == 2);
                        if (LST_LT_LK_CHA.length == 0) {
                            stt = '0.1.1.' + (LST_LT_LK_CHA.length + 1).toString();
                        } else {
                            stt = '0.1.1.' + (LST_LT_LK_CHA.length + 1).toString();
                        }
                        const lastdata = LST_LT_LK[LST_LT_LK.length - 1]

                        const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
                        // them vat tu moi vao bang
                        this.lstCtietBcao.splice(indexLtLk, 0, {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: stt,
                            maLoaiHang: data.ma,
                            tenHang: data.ten,
                            maDviTinh: null,
                            soLuong: null,
                            donGiaMua: null,
                            thanhTien: null,
                            level: 2,
                        })

                        const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
                        for (let i = 1; i <= lstTemp.length; i++) {
                            this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                                ...new ItemData(),
                                id: uuid.v4() + 'FE',
                                stt: stt + '.' + i.toString(),
                                maLoaiHang: lstTemp[i - 1].ma,
                                tenHang: data.ten,
                                maDviTinh: lstTemp[i - 1].donViTinh,
                                soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                                donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                                thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                                level: 3,
                            })
                        }
                    } else if (data.ma.startsWith('01') && dataHang.stt == "0.1.2") {
                        const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.1"))
                        const LST_LT_PS = LST_LT.filter(v => v.stt.startsWith("0.1.2"))
                        const LST_LT_PS_CHA = LST_LT_PS.filter(v => v.level == 2);
                        if (LST_LT_PS_CHA.length == 0) {
                            stt = '0.1.2.' + (LST_LT_PS_CHA.length + 1).toString();
                        } else {
                            stt = '0.1.2.' + (LST_LT_PS_CHA.length + 1).toString();
                        }
                        const lastdata = LST_LT_PS[LST_LT_PS.length - 1]
                        const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
                        // them vat tu moi vao bang
                        this.lstCtietBcao.splice(indexLtLk, 0, {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: stt,
                            maLoaiHang: data.ma,
                            tenHang: data.ten,
                            maDviTinh: null,
                            soLuong: null,
                            donGiaMua: null,
                            thanhTien: null,
                            level: 2,
                        })
                        const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
                        for (let i = 1; i <= lstTemp.length; i++) {
                            this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                                ...new ItemData(),
                                id: uuid.v4() + 'FE',
                                stt: stt + '.' + i.toString(),
                                maLoaiHang: lstTemp[i - 1].ma,
                                tenHang: data.ten,
                                maDviTinh: lstTemp[i - 1].donViTinh,
                                soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                                donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                                thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                                level: 3,
                            })
                        }
                    } else
                        if (data.ma.startsWith('02') && dataHang.stt == "0.2.1") {
                            const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.2"));
                            const LST_LT_LK = LST_LT.filter(v => v.stt.startsWith("0.2.1"));
                            const LST_LT_LK_CHA = LST_LT_LK.filter(v => v.level == 2);
                            if (LST_LT_LK_CHA.length == 0) {
                                stt = '0.2.1.' + (LST_LT_LK_CHA.length + 1).toString();
                            } else {
                                stt = '0.2.1.' + (LST_LT_LK_CHA.length + 1).toString();
                            }
                            const lastdata = LST_LT_LK[LST_LT_LK.length - 1]

                            const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
                            // them vat tu moi vao bang
                            this.lstCtietBcao.splice(indexLtLk, 0, {
                                ... new ItemData(),
                                id: uuid.v4() + 'FE',
                                stt: stt,
                                maLoaiHang: data.ma,
                                tenHang: data.ten,
                                maDviTinh: null,
                                soLuong: null,
                                donGiaMua: null,
                                thanhTien: null,
                                level: 2,
                            })

                            const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
                            for (let i = 1; i <= lstTemp.length; i++) {
                                this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                                    ...new ItemData(),
                                    id: uuid.v4() + 'FE',
                                    stt: stt + '.' + i.toString(),
                                    maLoaiHang: lstTemp[i - 1].ma,
                                    tenHang: data.ten,
                                    maDviTinh: lstTemp[i - 1].donViTinh,
                                    soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                                    donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                                    thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                                    level: 3,
                                })
                            }
                        } else if (data.ma.startsWith('02') && dataHang.stt == "0.2.2") {
                            const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.2"))
                            const LST_LT_PS = LST_LT.filter(v => v.stt.startsWith("0.2.2"))
                            const LST_LT_PS_CHA = LST_LT_PS.filter(v => v.level == 2);
                            if (LST_LT_PS_CHA.length == 0) {
                                stt = '0.2.2.' + (LST_LT_PS_CHA.length + 1).toString();
                            } else {
                                stt = '0.2.2.' + (LST_LT_PS_CHA.length + 1).toString();
                            }
                            const lastdata = LST_LT_PS[LST_LT_PS.length - 1]
                            const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
                            // them vat tu moi vao bang
                            this.lstCtietBcao.splice(indexLtLk, 0, {
                                ... new ItemData(),
                                id: uuid.v4() + 'FE',
                                stt: stt,
                                maLoaiHang: data.ma,
                                tenHang: data.ten,
                                maDviTinh: null,
                                soLuong: null,
                                donGiaMua: null,
                                thanhTien: null,
                                level: 2,
                            })
                            const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
                            for (let i = 1; i <= lstTemp.length; i++) {
                                this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                                    ...new ItemData(),
                                    id: uuid.v4() + 'FE',
                                    stt: stt + '.' + i.toString(),
                                    maLoaiHang: lstTemp[i - 1].ma,
                                    tenHang: data.ten,
                                    maDviTinh: lstTemp[i - 1].donViTinh,
                                    soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                                    donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                                    thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                                    level: 3,
                                })
                            }
                        }
                }
            }
            this.sum1()
            this.getTotal()
            this.updateEditCache();
        });
    }


    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 2) {
            return true;
        }
        return false;
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    checkAdd(stt: string) {

        if (
            stt == "0.1.1" ||
            stt == "0.1.2" ||
            stt == "0.2.1" ||
            stt == "0.2.2"
        ) {
            return true;
        }
        return false;
    }

};
