import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyQuyetToanVonPhiHangDtqgComponent } from 'src/app/components/dialog/dialog-copy-quyet-toan-von-phi-hang-dtqg/dialog-copy-quyet-toan-von-phi-hang-dtqg.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuyetToanVonPhiService } from 'src/app/services/quan-ly-von-phi/quyetToanVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Operator, Roles, Status, Table, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DialogAddVatTuComponent } from '../dialog-add-vat-tu/dialog-add-vat-tu.component';
import { TEN_HANG } from './add-quyet-toan-tong-hop.constant';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';
import { Doc } from '../../von-phi-hang-du-tru-quoc-gia.constant';
import * as XLSX from 'xlsx-js-style';
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

export class History {
    id: string;
    maBcao: string;
    namQtoan: number;
    lan: number;
    ngayTao: string;
    nguoiTao: string;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    ngayTraKq: string;
    lyDoTuChoi: string;
    trangThai: string;
}

@Component({
    selector: 'app-add-quyet-toan-tong-hop',
    templateUrl: './add-quyet-toan-tong-hop.component.html',
    styleUrls: ['./add-quyet-toan-tong-hop.component.scss']
})

export class AddQuyetToanTongHopComponent implements OnInit {
    @Input() data;
    @Input() idInput;
    @Input() isStatus;
    @Output('close') onClose = new EventEmitter<any>();
    @Output() dataChange = new EventEmitter();
    Op = new Operator("1");
    Utils = Utils;
    lichSu: History[];
    newStatus = true;
    Status = Status
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
    quyQtoan: number;
    congVan: ItemCongVan = new ItemCongVan();
    ngayTao!: string;
    ngayTrinh!: string;
    ngayDuyet!: string;
    ngayPheDuyet!: string;
    // isStatus!: string;
    maPhanBcao = '1';
    capDvi: string;

    // thong tin chi tiet bao cao;
    lstCtietBcao: ItemData[] = [];
    noiDungs: any[] = TEN_HANG;
    donViTinhs: any[] = [];
    maDviTiens: any[] = Utils.DVI_TIEN;
    donVis: any = [];
    lstDsHangTrongKho: any[] = [];
    newDate = new Date();
    thuyetMinh: string;
    path: string;
    ngayCongVan: string;
    lstFiles: any[] = [];
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: any = [];

    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
    editMoneyUnit = false;

    maDviTao!: string;
    maDviTien!: string;
    allChecked = false;                         // check all checkbox
    soLaMa: any[] = Utils.LA_MA;
    PS_ARR: any[] = [];
    LK_ARR: any[] = [];
    LST_CHUNG_KHO: any[] = [];
    lstBcaoDviTrucThuocs: any[] = [];
    childUnit: any[] = [];
    amount = Operator.amount;
    initItem: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        tenHang: "",
        maLoaiHang: '',
        maDviTinh: "",
        soLuong: 0,
        donGiaMua: 0,
        thanhTien: 0,
        checked: false
    };
    total: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        tenHang: "",
        maLoaiHang: "",
        maDviTinh: null,
        soLuong: 0,
        donGiaMua: 0,
        thanhTien: null,
        checked: false
    };

    total1: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        tenHang: "",
        maLoaiHang: "",
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
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
                soCv: this.congVan?.fileName,
                ngayCv: this.ngayCongVan,
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.ngayCongVan = res.ngayCongVan;
                this.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
                this.fileDetail = file;
            }
        });
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
        {
            id: Status.TT_07,
            tenDm: "Mới",
        },
        {
            id: Status.TT_08,
            tenDm: "Cấp trên từ chối",
        },
        {
            id: Status.TT_09,
            tenDm: "Tiếp nhận",
        },
    ]



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
                await this.onSubmit('6', null).then(() => {
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
        this.spinner.hide();
    };

    async initialization() {
        this.userInfo = this.userService.getUserLogin();
        this.getChildUnit()
        await this.danhMucService.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donVis = data?.data;
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

        if (this.data?.isSythen == true && this.idInput == null) {
            this.spinner.show();
            const obj = {
                maDvi: this.userInfo?.MA_DVI,
                maPhanBcao: "1",
                namQtoan: this.data.namQtoan,
                quyQtoan: this.data.quyQtoan
            }
            await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(1).toPromise().then(
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
            await this.quyetToanVonPhiService.tongHop(obj).toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.idInput = data.data.id;
                        this.lstCtietBcao = data.data.lstBcaos;
                        this.lstCtietBcao.forEach(item => {
                            item.donGiaMua = Number(item?.donGiaMua)
                            item.thanhTien = Number(item?.thanhTien)
                        })

                        this.maDviTien = "1";
                        this.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;

                        this.isStatus = "1";
                        this.namQtoan = this.data.namQtoan;
                        this.quyQtoan = this.data.quyQtoan;
                        this.maDviTao = this.userInfo?.MA_DVI;
                        this.thuyetMinh = data.data.thuyetMinh;
                        this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
                        this.congVan = null;
                        // this.lstFiles = data.data.fileDinhKems;

                        this.listFile = [];
                        this.lstFiles = [];
                        if (this.lstBcaoDviTrucThuocs.length > 0) {
                            this.lstBcaoDviTrucThuocs.forEach(item => {
                                if (item.ngayDuyet.includes("/")) {
                                    item.ngayDuyet = item.ngayDuyet;
                                    item.ngayPheDuyet = item.ngayPheDuyet;
                                } else {
                                    item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                                    item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                                }
                            })
                        }

                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );



            this.spinner.hide();
        }

        if (this.idInput && this.idInput !== null) {
            await this.getDetailReport();
            this.sortByIndex();
            this.updateEditCache()
            this.getStatusButton();
            const rqKho = {
                maDvi: this.maDviTao,
                nam: Number(this?.namQtoan),
                quyQtoan: this?.quyQtoan,
            }


            await this.quyetToanVonPhiService.getHangHoaKho(rqKho).toPromise().then(
                async (data) => {
                    this.lstDsHangTrongKho = data.data;
                    this.PS_ARR = data.data.filter(e => e.maLoai == "PS")
                    this.LK_ARR = data.data.filter(e => e.maLoai == "LK")
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
            return
        } else if (this.lstCtietBcao.length == 0) {
            this.isStatus = '1';
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.namQtoan = this.data?.namQtoan;
            this.quyQtoan = this.data?.quyQtoan;
            this.maDviTao = this.userInfo?.MA_DVI;
            const rqKho = {
                maDvi: this.maDviTao,
                nam: Number(this?.namQtoan),
                quyQtoan: this?.quyQtoan,
            }
            await this.quyetToanVonPhiService.getHangHoaKho(rqKho).toPromise().then(
                async (data) => {
                    this.lstDsHangTrongKho = data.data;
                    this.PS_ARR = data.data.filter(e => e.maLoai == "PS")
                    this.LK_ARR = data.data.filter(e => e.maLoai == "LK")


                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );

            await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(1).toPromise().then(
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
                        this.donVis = data?.data;
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

            this.maDviTien = '1';

            if (this.lstCtietBcao.length == 0) {
                this.noiDungs.forEach(s => {
                    this.lstCtietBcao.push(
                        {
                            ...new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: s.ma,
                            tenHang: s.tenHang,
                            maLoaiHang: s.ma,
                        }
                    )
                })
                this.setLevel();
                this.lstCtietBcao.forEach(item => {
                    item.tenHang += this.getName(item.level, item.maLoaiHang);
                })
            }
            this.sortByIndex();
            this.updateEditCache()
            this.getStatusButton();
        }
        this.path = this.maDviTao + '/' + this.maPhanBcao
        this.sortByIndex();
        // this.sum1();
        this.getTotal();
        this.updateEditCache()
        this.getStatusButton();




    };

    getUnitName(maDvi: string) {
        return this.childUnit.find(item => item.maDvi == maDvi)?.tenDvi;
    }

    async getChildUnit() {
        const request = {
            maDviCha: this.maDviTao,
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

    async viewDetail(id) {
        this.spinner.show();
        localStorage.setItem('idInput', this.idInput);
        this.idInput = id
        await this.getDetailReport();
        this.sortByIndex();
        this.data.preTab = "addQtInfo"
        this.getStatusButton();
        this.spinner.hide();
    }


    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    getName(level: number, ma: string) {
        const type = this.getTail(ma);
        let str = '';
        return str;
    }

    getStatusName(status: string) {
        const statusMoi = status == Status.TT_06 || status == Status.TT_07;
        const dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (statusMoi && this.userInfo.MA_DVI == dVi?.maDviCha) {
            return 'Mới';
        } else {
            return this.trangThais.find(e => e.id == status)?.tenDm;
        }
    }

    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
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
            await this.quyetToanVonPhiService.approveQuyetToan1(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.isStatus = mcn;
                    this.titleStatus = mcn;
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.getStatusButton();
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
                    if (mcn == Status.TT_02) {
                        this.notification.success(MESSAGE.SUCCESS, mcn == Status.TT_02 ? MESSAGE.SUBMIT_SUCCESS : MESSAGE.APPROVE_SUCCESS);
                    } else if (mcn == Status.TT_06) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
                    }
                    else if (mcn == Status.TT_09) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRANG_THAI_TIEP_NHAN);
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
    };

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
                this.onSubmit(Status.TT_02, '')
            },
        });
    }

    async getDetailReport() {
        this.spinner.show();
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
        await this.quyetToanVonPhiService.CtietBcaoQuyetToan1(this.idInput).toPromise().then(
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
                    this.congVan = data.data.congVan;
                    this.lstFiles = data.data.fileDinhKems;
                    this.lichSu = data.data.lichSu;
                    this.listFile = [];
                    if (this.lstBcaoDviTrucThuocs.length > 0) {
                        this.lstBcaoDviTrucThuocs.forEach(item => {
                            if (item.ngayDuyet.includes("/")) {
                                item.ngayDuyet = item.ngayDuyet;
                                item.ngayPheDuyet = item.ngayPheDuyet;
                            } else {
                                item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                                item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                            }
                        })
                    }

                    const rqKho = {
                        maDvi: this.maDviTao,
                        nam: Number(this?.namQtoan),
                        quyQtoan: this?.quyQtoan,
                    }


                    await this.quyetToanVonPhiService.getHangHoaKho(rqKho).toPromise().then(
                        async (data) => {
                            this.lstDsHangTrongKho = data.data;
                            this.PS_ARR = data.data.filter(e => e.maLoai == "PS")
                            this.LK_ARR = data.data.filter(e => e.maLoai == "LK")
                        },
                        (err) => {
                            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                        },
                    );

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
            if (item.id?.length == 38) {
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
        // const listFile: any = [];
        // for (const iterator of this.listFile) {
        //     listFile.push(await this.uploadFile(iterator));
        // }
        const tongHopTuIds = [];

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
        } else {
            lstCtietBcaoTemp.congVan = this.congVan;
        }

        // if (!lstCtietBcaoTemp?.congVan || !this.congVan?.fileName) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //     return;
        // }

        const request = JSON.parse(JSON.stringify({
            id: this.idInput,
            fileDinhKems: this.listFile,
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
            tongHopTuIds: tongHopTuIds,
        }));

        const fileDinhKems = [];
        for (const iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.lstFiles.find(e => e.id == id)?.noiDung;
            fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.path, noiDung));
        }
        request.fileDinhKems = fileDinhKems;

        this.lstBcaoDviTrucThuocs.forEach(item => {
            request.tongHopTuIds.push(item.id);
        })
        //call service them moi
        this.spinner.show();
        if (this.idInput == null) {
            this.quyetToanVonPhiService.trinhDuyetServiceQuyetToan1(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.idInput = data.data.id;
                        await this.getDetailReport();
                        this.sortByIndex();
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
            this.quyetToanVonPhiService.updateBaoCaoQuyetToan1(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.sortByIndex();
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

        const dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        let checkParent = false;
        if (dVi && dVi?.maDviCha == this.userInfo.MA_DVI) {
            checkParent = true;
        }

        const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
        const checkAccept = this.userService.isAccessPermisson(Roles.QTVP.TIEP_NHAN_REPORT);
        this.saveStatus = this.getBtnStatus([Status.TT_01], Roles.QTVP.ADD_REPORT, checkChirld);
        this.submitStatus = this.getBtnStatus([Status.TT_01], Roles.QTVP.APPROVE_REPORT, checkChirld);
        this.passStatus = this.getBtnStatus([Status.TT_02], Roles.QTVP.DUYET_QUYET_TOAN_REPORT, checkChirld);
        this.approveStatus = this.getBtnStatus([Status.TT_04], Roles.QTVP.PHE_DUYET_QUYET_TOAN_REPORT, checkChirld);
        this.copyStatus = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.QTVP.COPY_REPORT, checkChirld);
        this.printStatus = this.getBtnStatus([Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09], Roles.QTVP.PRINT_REPORT, checkChirld);
        this.acceptStatus = [Status.TT_06, Status.TT_07].includes(this.isStatus) && checkAccept && checkParent;
        this.newStatus = Status.check('reject', this.isStatus) && this.userService.isAccessPermisson(Roles.QTVP.ADD_REPORT) && checkChirld && this.data.preTab == 'danhsachTH';
    }

    getBtnStatus(status: string[], role: string, check: boolean) {
        return !(status.includes(this.isStatus) && this.userService.isAccessPermisson(role) && check);
    }

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
            item.level = this.noiDungs.find(e => e.id == item.maLoaiHang)?.level;
        })
    };

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
        await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(1).toPromise().then(
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
        const idStorage = localStorage.getItem('idInput');
        if (idStorage) {
            this.idInput = idStorage
            this.getDetailReport();
            this.sortByIndex();
            this.getStatusButton();
            localStorage.removeItem('idInput');
        } else {
            this.onClose.emit();
        }
    };

    getMoneyUnit() {
        return this.maDviTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

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
        if (n == 3) {
            xau = "-";
        }
        return xau;
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
            const str = Table.preIndex(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });

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
                maLoaiHang: data.maLoaiHang,
                tenHang: data.tenHang,
                maDviTinh: data.maDviTinh,
                donGiaMua: data.donGiaMua,
                soLuong: data.soLuong,
                checked: data.checked,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].soLuong = null;
                    this.lstCtietBcao[index].donGiaMua = null;
                    this.lstCtietBcao[index].thanhTien = Operator.sum([this.lstCtietBcao[index].thanhTien, item.thanhTien]);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    };

    getTotal() {
        this.total = new ItemData();
        this.total1 = new ItemData();
        let tongLk1
        let tongLk2
        this.lstCtietBcao.forEach(item => {
            if (item.level == 1 && item.stt == "0.1.1") {
                return tongLk1 = item.thanhTien
            }
            if (item.level == 1 && item.stt == "0.2.1") {
                return tongLk2 = item.thanhTien
            }

            this.total.thanhTien = Operator.sum([tongLk1, tongLk2]);
        })

        let tongPs1
        let tongPs2
        this.lstCtietBcao.forEach(item => {
            if (item.level == 1 && item.stt == "0.1.2") {
                return tongPs1 = item.thanhTien
            }
            if (item.level == 1 && item.stt == "0.2.2") {
                return tongPs2 = item.thanhTien
            }

            this.total1.thanhTien = Operator.sum([tongPs1, tongPs2]);
        })

    };

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
        this.sum(stt);
        this.updateEditCache();
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
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(this.lstCtietBcao[index].stt));
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
            if ((Table.preIndex(item.stt) == str) && (!item.checked) && (item.stt != str)) {
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

    handlSelectGoods(data: any) {
        const obj = {
            stt: data.stt,
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
        modalTuChoi.afterClose.subscribe(async (res) => {
            if (res) {
                let parentItem: ItemData = this.lstCtietBcao.find(e => e.maLoaiHang == res.ma && Table.preIndex(e.stt) == data.stt);
                //them phan tu cha neu chua co
                if (!parentItem) {
                    parentItem = {
                        ...new ItemData(),
                        id: uuid.v4() + 'FE',
                        maLoaiHang: res.ma,
                        level: data.level + 1,
                        tenHang: res.ten,
                        maDviTinh: res.maDviTinh,
                    }
                    this.lstCtietBcao = Table.addChild(data.id, parentItem, this.lstCtietBcao);
                    let luyKes: any[] = [];
                    if (this.getTail(data.stt) == 1) {
                        luyKes = this.lstDsHangTrongKho.filter(e => (e.cloaiVthh == res.ma || e.loaiVthh == data.ma) && e.maLoai == "LK");
                    } else {
                        luyKes = this.lstDsHangTrongKho.filter(e => (e.cloaiVthh == res.ma || e.loaiVthh == data.ma) && e.maLoai == "PS");
                    }
                    if (luyKes.length > 0) {
                        luyKes.forEach(luyKe => {
                            const item: ItemData = {
                                ... new ItemData(),
                                id: uuid.v4() + 'FE',
                                maLoaiHang: res.ma,
                                level: parentItem.level + 1,
                                soLuong: luyKe?.soLuongThucNhap,
                                donGiaMua: luyKe?.donGia,
                            }
                            item.thanhTien = Operator.mul(item.soLuong, item.donGiaMua);
                            this.lstCtietBcao = Table.addChild(parentItem.id, item, this.lstCtietBcao);
                        })
                    } else {
                        const item: ItemData = {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            maLoaiHang: res.ma,
                            level: parentItem.level + 1,
                        }
                        this.lstCtietBcao = Table.addChild(parentItem.id, item, this.lstCtietBcao);
                    }
                } else {
                    const item: ItemData = {
                        ... new ItemData(),
                        id: uuid.v4() + 'FE',
                        maLoaiHang: res.ma,
                        level: parentItem.level + 1,
                    }
                    this.lstCtietBcao = Table.addChild(parentItem.id, item, this.lstCtietBcao);
                }

                const stt = this.lstCtietBcao.find(e => e.id == parentItem.id).stt;

                this.sum(stt + '.1');
                this.updateEditCache();
            }

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
    };

    async restoreReport(id: string) {
        await this.quyetToanVonPhiService.restoreReport(this.idInput, id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.action('detail')
                    this.getStatusButton();
                    this.notification.success(MESSAGE.SUCCESS, 'Khôi phục thành công.');
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    async newReport() {
        await this.quyetToanVonPhiService.addHistory(this.idInput).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, 'Tạo mới thành công.');
                    this.back()
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const date = new Date()
        const dateExcel = this.datePipe.transform(date, Utils.FORMAT_DATE_STR)

        const header = [
            { t: 0, b: 5, l: 0, r: 5, val: null },

            { t: 0, b: 0, l: 0, r: 1, val: `Báo cáo quyết toán vốn phí hàng DTQG quý ${this.quyQtoan}, năm ${this.namQtoan}` },
            { t: 1, b: 1, l: 0, r: 1, val: `Kèm theo công văn số ${this.congVan.fileName}/TCDT, ngày ${dateExcel} của ${this.userInfo.TEN_DVI} ` },
            { t: 2, b: 2, l: 0, r: 1, val: `Trạng thái báo cáo ${this.getStatusName(this.isStatus)}` },

            { t: 4, b: 4, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 4, l: 1, r: 1, val: 'Tên hàng dự trữ quốc gia' },
            { t: 4, b: 4, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 4, b: 4, l: 3, r: 3, val: 'Số lượng' },
            { t: 4, b: 4, l: 4, r: 4, val: 'Đơn giá' },
            { t: 4, b: 4, l: 5, r: 5, val: 'Thành tiền' },

            { t: 5, b: 5, l: 0, r: 0, val: 'A' },
            { t: 5, b: 5, l: 1, r: 1, val: 'B' },
            { t: 5, b: 5, l: 2, r: 2, val: 'C' },
            { t: 5, b: 5, l: 3, r: 3, val: '1' },
            { t: 5, b: 5, l: 4, r: 4, val: '2' },
            { t: 5, b: 5, l: 5, r: 5, val: '3 = 1 x 2' },
        ]
        const fieldOrder = [
            "stt",
            "tenHang",
            "maDviTinh",
            "soLuong",
            "donGiaMua",
            "thanhTien",
        ]
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                item[field] ? item[field] : "";
                row[field] = field == 'stt' ? this.getChiMuc(item.stt) : Utils.getValue(item[field]);
            })
            return row;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        })

        let row: any = {};
        row = {}
        fieldOrder.forEach(field => {
            row[field] = field == 'tenHang' ? 'Tổng cộng phát sinh trong kỳ' : (!this.total1[field] && this.total1[field] !== 0) ? '' : this.total1[field];
        })
        filterData.push(row)

        row = {}
        fieldOrder.forEach(field => {
            row[field] = field == 'tenHang' ? 'Tổng cộng lũy kế từ đầu năm' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
        })
        filterData.push(row)

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = "TH_BC_QTVP_DTQG";
        excelName = excelName + '_BCQTVP_DTQG.xlsx'
        XLSX.writeFile(workbook, excelName);
    }

};
