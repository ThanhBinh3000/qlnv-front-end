import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogBaoCaoCopyComponent } from 'src/app/components/dialog/dialog-bao-cao-copy/dialog-bao-cao-copy.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogLuaChonThemPhuLucComponent } from 'src/app/components/dialog/dialog-lua-chon-them-phu-luc/dialog-lua-chon-them-phu-luc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { BCDTC, CAN_CU_GIA, CVNC, displayNumber, DON_VI_TIEN, exchangeMoney, KHOAN_MUC, LOAI_DE_NGHI, MONEY_LIMIT, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { PHULUCLIST } from './bao-cao.constant';

export class ItemData {
    id!: string;
    maLoai!: string;
    maDviTien!: string;
    lstCtietBcaos!: any;
    trangThai!: string;
    checked!: boolean;
    tieuDe!: string;
    tenPhuLuc!: string;
    thuyetMinh!: string;
    lyDoTuChoi!: string;
    lstIdDeletes!: [];
    nguoiBcao!: string;
    bcaoId!: string;
}

export class ItemDanhSach {
    id!: string;
    maBcao!: string;
    namBcao!: number;
    thangBcao!: number;
    trangThai!: string;
    ngayTao!: string;
    nguoiTao!: string;
    maDvi: number;
    congVan!: ItemCongVan;
    ngayTrinh!: string;
    ngayDuyet!: string;
    ngayPheDuyet!: string;
    ngayTraKq!: string;

    // dung cho request
    fileDinhKems!: any[];
    listIdFiles!: string;     //list id file xoa khi cap nhat
    maLoaiBcao!: string;
    maPhanBcao = "0";

    stt!: string;
    checked!: boolean;
    lstBcaos: ItemData[] = [];
    lstFiles: any[] = [];
    lstBcaoDviTrucThuocs: any[] = [];
    tongHopTuIds!: [];
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
    baoCao: ItemDanhSach = new ItemDanhSach();
    trangThaiPhuLuc: string;
    titleStatus: string;
    //danh muc
    listIdDelete: any = [];                     // list id delete
    nguoiBcaos: any[];
    donVis: any = [];                           // danh muc don vi
    lstFiles: any = [];                         // list File de day vao api
    luyKes: ItemData[] = [];
    luyKeDetail = [];
    //trang thai cac nut
    status = false;                    // trang thai an/ hien cua trang thai
    saveStatus = true;                      // trang thai an/hien nut luu
    submitStatus = true;                   // trang thai an/hien nut trinh duyet
    passStatus = true;                       // trang thai an/hien nut truong bo phan
    approveStatus = true;                        // trang thai an/hien nut lanh dao
    acceptStatus = true;                      // trang thai nut don vi cap tren
    copyStatus = true;                      // trang thai copy
    printStatus = true;                     // trang thai print
    okStatus = true;                        // trang thai ok/ not ok
    finishStatus = true;                    // trang thai hoan tat nhap lieu
    isDataAvailable = false;
    //khac
    allChecked = false;                         // check all checkbox
    editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
    //file
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: string[] = [];
    //phan tab
    tabSelected: string;
    tabs: any[] = [];
    selectedIndex = 1;
    //truyen du lieu sang tab con
    tabData: any;

    constructor(
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
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
        this.titleStatus = this.getStatusName(this.baoCao.trangThai);
        this.getStatusButton();
        this.spinner.hide();
    }

    async initialization() {
        //lay thong tin chung bao cao
        this.baoCao.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();

        this.getListUser();
        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao.maDvi = this.userInfo?.MA_DVI;
            this.baoCaoThucHienDuToanChiService.taoMaBaoCao().toPromise().then(
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
            this.baoCao.maLoaiBcao = this.data?.maLoaiBcao;
            this.baoCao.namBcao = this.data?.namBcao;
            this.baoCao.thangBcao = this.data?.thangBcao == 0 ? null : this.data?.thangBcao;
            this.baoCao.nguoiTao = this.userInfo.sub;
            this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
            this.baoCao.trangThai = "1";
            if (this.data?.isSynthetic) {
                await this.callSynthetic();
            } else {
                PHULUCLIST.forEach(item => {
                    this.baoCao.lstBcaos.push({
                        id: uuid.v4() + 'FE',
                        checked: false,
                        tieuDe: item.tieuDe,
                        maLoai: item.maPhuLuc,
                        tenPhuLuc: item.tenPhuLuc,
                        trangThai: '3',
                        lstCtietBcaos: [],
                        maDviTien: '1',
                        thuyetMinh: null,
                        lyDoTuChoi: null,
                        lstIdDeletes: [],
                        nguoiBcao: null,
                        bcaoId: this.baoCao.id,
                    });
                })
            }
        }

        this.getLuyKe();

        //lay danh sach danh muc don vi
        await this.danhMucService.dMDviCon().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.getStatusButton();
        this.spinner.hide();
    }

    getLuyKe() {
        const request = {
            dotBcao: null,
            maLoaiBcao: this.baoCao.maLoaiBcao,
            maPhanBcao: "0",
            namBcao: this.baoCao?.namBcao,
            thangBcao: this.baoCao?.thangBcao,
        }
        this.quanLyVonPhiService.getLuyKe(request).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.luyKes = res.data.lstBcaos;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, (err) => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }

    getListUser() {
        this.quanLyVonPhiService.getListUser().toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.nguoiBcaos = res.data;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs.length != 0;
        const checkChirld = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        const checkParent = this.donVis.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(BCDTC.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCDTC.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(BCDTC.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCDTC.APPROVE_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(BCDTC.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCDTC.DUYET_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(BCDTC.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCDTC.PHE_DUYET_REPORT);
        const checkAccept = this.userService.isAccessPermisson(BCDTC.TIEP_NHAN_REPORT);
        const checkCopy = isSynthetic ? this.userService.isAccessPermisson(BCDTC.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCDTC.COPY_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(BCDTC.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(BCDTC.PRINT_REPORT);
        if (Utils.statusSave.includes(this.baoCao.trangThai) && checkSave) {
            this.status = false;
        } else {
            this.status = true;
        }

        this.saveStatus = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave && checkChirld;
        this.submitStatus = Utils.statusApprove.includes(this.baoCao.trangThai) && checkSunmit && checkChirld;
        this.passStatus = Utils.statusDuyet.includes(this.baoCao.trangThai) && checkPass && checkChirld;
        this.approveStatus = Utils.statusPheDuyet.includes(this.baoCao.trangThai) && checkApprove && checkChirld;
        this.acceptStatus = Utils.statusTiepNhan.includes(this.baoCao.trangThai) && checkAccept && checkParent;
        this.copyStatus = Utils.statusCopy.includes(this.baoCao.trangThai) && checkCopy && checkChirld;
        this.printStatus = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && checkChirld;

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
        const obj = {
            tabSelected: this.data?.preTab,
        }
        this.dataChange.emit(obj);
    }

    // lay ten don vi tao
    getUnitName(maDvi: string) {
        return this.donVis.find(item => item.maDvi == maDvi)?.tenDvi;
    }

    // lay ten trang thai ban ghi
    getStatusName(Status: any) {
        const utils = new Utils();
        if (this.baoCao.maDvi == this.userInfo.MA_DVI) {
            return utils.getStatusName(Status == '7' ? '6' : Status);
        }
        if (this.donVis.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1) {
            return utils.getStatusNameParent(Status == '7' ? '6' : Status);
        }
    }

    getStatusAppendixName(id) {
        const utils = new Utils();
        return utils.getStatusAppendixName(id);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.baoCaoThucHienDuToanChiService.baoCaoChiTiet(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao?.lstBcaos?.forEach(item => {
                        const index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
                        if (index !== -1) {
                            item.tieuDe = PHULUCLIST[index].tieuDe;
                            item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
                            item.checked = false;
                        }
                    })
                    this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
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
        if (this.baoCao.id) {
            if (!this.baoCao?.congVan?.fileUrl) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
                return;
            }
            const checkStatusReport = this.baoCao?.lstBcaos?.findIndex(item => item.trangThai != '5');
            if (checkStatusReport != -1 && mcn == Utils.TT_BC_2) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WARNING_FINISH_INPUT);
                return;
            }
            const requestGroupButtons = {
                id: this.baoCao.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.baoCaoThucHienDuToanChiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao.trangThai = mcn;
                    this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
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
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
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
        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
        //get list file url
        const listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }

        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            baoCaoTemp.congVan = await this.uploadFile(file);
        }
        if (!baoCaoTemp.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        let checkPersonReport = true;
        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp?.lstBcaos?.filter(item => {
            if (!item.nguoiBcao) {
                checkPersonReport = false;
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
                return;
            }
            if (item.id?.length == 38) {
                item.id = null;
            }
            if (this.baoCao.id == null) {
                item.trangThai = '3'; // set trang thai phu luc la chua danh gia
            }
            item?.lstCtietBcaos.filter(data => {
                if (item.id?.length == 38) {
                    data.id = null;
                }
            })
        })

        if (!checkPersonReport) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.tongHopTuIds = [];
        baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })

        baoCaoTemp.fileDinhKems = listFile;
        baoCaoTemp.listIdFiles = this.listIdFilesDelete;
        baoCaoTemp.trangThai = "1";
        baoCaoTemp.maPhanBcao = '0';

        //call service them moi
        if (this.baoCao.id == null) {
            //net la tao bao cao moi thi khong luu lstCtietBcaos, con la tong hop thi khong luu
            if (!this.data?.isSynthetic) {
                baoCaoTemp?.lstBcaos?.filter(item => item.lstCtietBcaos = []);
            }
            await this.baoCaoThucHienDuToanChiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                        this.baoCao.id = data.data.id
                        await this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            await this.baoCaoThucHienDuToanChiService.updateBaoCaoThucHienDTC(baoCaoTemp).toPromise().then(async res => {
                if (res.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    await this.getDetailReport();
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
        }
    }

    // call tong hop bao cao
    async callSynthetic() {
        const request = {
            maLoaiBcao: this.baoCao.maLoaiBcao,
            namBcao: this.baoCao.namBcao,
            thangBcao: this.baoCao.thangBcao,
            dotBcao: null,
            maPhanBcao: '0',
        }
        await this.baoCaoThucHienDuToanChiService.tongHopBaoCaoKetQua(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    await this.baoCao?.lstBcaos?.forEach(item => {
                        item.maDviTien = '1';   // set defaul ma don vi tien la Dong
                        item.checked = false;
                        const index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
                        if (index !== -1) {
                            item.tieuDe = PHULUCLIST[index].tieuDe;
                            item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
                            item.trangThai = '3';
                            item.nguoiBcao = this.userInfo.sub;
                        }
                    })
                    this.listFile = [];
                    this.baoCao.trangThai = "1";
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    // them phu luc
    addPhuLuc() {
        PHULUCLIST.forEach(item => item.status = false);
        const danhSach = PHULUCLIST.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách phụ lục',
            nzContent: DialogLuaChonThemPhuLucComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                danhSachPhuLuc: danhSach
            },
        });
        modalIn.afterClose.toPromise().then((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        this.baoCao.lstBcaos.push({
                            id: uuid.v4() + 'FE',
                            checked: false,
                            tieuDe: item.tieuDe,
                            maLoai: item.maPhuLuc,
                            tenPhuLuc: item.tenPhuLuc,
                            trangThai: '3',
                            lstCtietBcaos: [],
                            maDviTien: '1',
                            thuyetMinh: null,
                            lyDoTuChoi: null,
                            lstIdDeletes: [],
                            nguoiBcao: null,
                            bcaoId: this.baoCao.id,
                        });
                    }
                })
            }
        });
    }

    // xoa phu luc
    deletePhuLucList() {
        this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
        if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
            this.tabSelected = null;
        }
        this.allChecked = false;
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.baoCao?.lstBcaos.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
            this.allChecked = false;
        } else if (this.baoCao?.lstBcaos.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        }
    }

    updateAllChecked(): void {
        this.baoCao?.lstBcaos.filter(item =>
            item.checked = this.allChecked
        );
    }

    closeTab({ index }: { index: number }): void {
        this.tabs.splice(index - 1, 1);
    }

    newTab(maPhuLuc: any): void {
        const index: number = this.tabs.findIndex(e => e.maPhuLuc === maPhuLuc);
        if (index != -1) {
            this.selectedIndex = index + 1;
        } else {
            const item = this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc);
            this.tabData = {
                ...item,
                trangThaiBaoCao: this.baoCao.trangThai,
                maLoaiBcao: this.baoCao.maLoaiBcao,
                maPhuLuc: maPhuLuc,
                idBcao: this.baoCao.id,
                statusBtnOk: this.okStatus,
                statusBtnFinish: this.finishStatus,
                luyKeDetail: this.luyKes.find(e => e.maLoai == maPhuLuc),
                status: this.status,
            }
            this.tabs = [];
            this.tabs.push(PHULUCLIST.find(item => item.maPhuLuc == maPhuLuc));
            this.selectedIndex = this.tabs.length + 1;
        }
    }

    getNewData(obj: any) {
        const index = this.baoCao.lstBcaos.findIndex(e => e.maLoai == this.tabs[0].maPhuLuc);
        if (obj?.trangThai == '-1') {
            this.getDetailReport();
            this.tabData = {
                ...this.baoCao.lstBcaos[index],
                maPhuLuc: this.tabs[0]?.maPhuLuc,
                maLoaiBcao: this.baoCao.maLoaiBcao,
                idBcao: this.baoCao.id,
                trangThaiBaoCao: this.baoCao?.trangThai,
                statusBtnOk: this.okStatus,
                statusBtnFinish: this.finishStatus,
                luyKeDetail: this.luyKes.find(e => e.maLoai == this.tabs[0].maPhuLuc),
                status: this.status,
            }
            this.tabs = [];
            this.tabs.push(PHULUCLIST.find(e => e.maPhuLuc == this.baoCao.lstBcaos[index].maLoai));
            this.selectedIndex = this.tabs.length + 1;
        } else {
            this.baoCao.lstBcaos[index].trangThai = obj?.trangThai;
            this.baoCao.lstBcaos[index].lyDoTuChoi = obj?.lyDoTuChoi;
        }
    }

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
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
        if (this.baoCao?.congVan?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.baoCao?.congVan?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.baoCao?.congVan?.fileName);
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
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    }

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

    viewDetail(id) {

    }

    showDialogCopy() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Báo Cáo',
            nzContent: DialogBaoCaoCopyComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                maPhanBcao: '0',
                maLoaiBcao: this.baoCao.maLoaiBcao,
                namBcao: this.baoCao.namBcao,
                dotBcao: null,
                thangBcao: this.baoCao.thangBcao,
                checkDvtt: this.baoCao.lstBcaoDviTrucThuocs.length > 0 ? true : false,
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (response) => {
            if (response) {
                this.doCopy(response);
            }
        });
    }

    async doCopy(response) {
        this.spinner.show();
        const maBaoCao = await this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    return data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    return null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                return null;
            }
        );
        this.spinner.hide();
        if (!maBaoCao) {
            return;
        }

        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
        baoCaoTemp.congVan = null;
        // set nambao,dot bao cao tu dialog gui ve
        baoCaoTemp.namBcao = response.namBcao;
        baoCaoTemp.thangBcao = response.thangBcao;
        if (response.loaiCopy == 'D') {
            //xoa lst don vi truc thuoc theo lua chon tu dialog
            baoCaoTemp.lstBcaoDviTrucThuocs = [];
        }
        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp?.lstBcaos?.filter(item => {
            item.id = null;
            item.listIdDelete = null;
            item.trangThai = '3'; // set trang thai phu luc la chua danh gia
            item?.lstCtietBcaos.filter(data => {
                data.id = null;

            })
        })

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.id = null;
        baoCaoTemp.maBcao = maBaoCao;
        baoCaoTemp.tongHopTuIds = [];
        baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })
        baoCaoTemp.fileDinhKems = [];
        baoCaoTemp.listIdFiles = null;
        baoCaoTemp.trangThai = "1";
        baoCaoTemp.maPhanBcao = '0';

        //call service them moi
        this.spinner.show();
        this.baoCaoThucHienDuToanChiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
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
                            maBcao: maBaoCao
                        },
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.spinner.hide();
                }
            },
            err => {
                this.spinner.hide();
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    statusClass() {
        if (Utils.statusSave.includes(this.baoCao.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
