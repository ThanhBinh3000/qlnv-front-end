import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Roles, Status, Utils } from 'src/app/Utility/utils';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Dtc, Form, Report } from '../bao-cao-thuc-hien-du-toan-chi.constant';
import { PhuLucIComponent } from './phu-luc-1/phu-luc-1.component';
import { PhuLucIIComponent } from './phu-luc-2/phu-luc-2.component';
import { PhuLucIIIComponent } from './phu-luc-3/phu-luc-3.component';

@Component({
    selector: 'app-bao-cao',
    templateUrl: './bao-cao.component.html',
    styleUrls: ['./bao-cao.component.scss',
    ],
})
export class BaoCaoComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    Status = Status;
    Utils = Utils;
    Dtc = Dtc;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    dataPl3: any;
    dataPl2: any;
    //danh muc
    lstPhuLuc: any = Dtc.PHU_LUC;
    nguoiBcaos: any[];
    luyKes: Form[] = [];
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable = false;
    isChild: boolean;
    isParent: boolean;
    //khac
    editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    path: string;
    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.baoCao.congVan = {
            ...new Doc(),
            fileName: file.name,
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
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
        private fileManip: FileManip,
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
                await this.tuChoi(Status.TT_03).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'pass':
                await this.onSubmit(Status.TT_04, null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonapprove':
                await this.tuChoi(Status.TT_05).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'approve':
                await this.onSubmit(Status.TT_07, null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonaccept':
                await this.tuChoi(Status.TT_08).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'accept':
                await this.onSubmit(Status.TT_09, null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.spinner.hide();
    }

    async initialization() {
        //lay thong tin chung bao cao
        this.baoCao.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        if (this.userInfo?.DON_VI?.tenVietTat == 'CCNTT') {
            this.lstPhuLuc = this.lstPhuLuc.filter(e => e.id != Dtc.PHU_LUC_III);
        } else if (this.userService.isChiCuc()) {
            this.lstPhuLuc = this.lstPhuLuc.filter(e => e.id == Dtc.PHU_LUC_I)
        } else {
            if (!this.userService.isTongCuc()) {
                this.lstPhuLuc = this.lstPhuLuc.filter(e => e.id != Dtc.PHU_LUC_II);
            }
        }

        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao = this.data.baoCao;
            this.baoCao.lstBcaos = this.baoCao.lstBcaos.filter(item => this.lstPhuLuc.findIndex(e => e.id == item.maLoai) != -1);
            // this.baoCao.maDvi = this.userInfo?.MA_DVI;
            // await this.getDviCon();
            // this.baoCaoThucHienDuToanChiService.taoMaBaoCao().toPromise().then(
            //     (data) => {
            //         if (data.statusCode == 0) {
            //             this.baoCao.maBcao = data.data;
            //         } else {
            //             this.notification.error(MESSAGE.ERROR, data?.msg);
            //         }
            //     },
            //     (err) => {
            //         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            //     }
            // );
            // this.baoCao.maLoaiBcao = this.data?.maLoaiBcao;
            // this.baoCao.namBcao = this.data?.namBcao;
            // this.baoCao.thangBcao = this.data?.thangBcao == 0 ? null : this.data?.thangBcao;
            // this.baoCao.nguoiTao = this.userInfo.sub;
            // this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
            // this.baoCao.trangThai = "1";
            // if (this.data?.isSynthetic) {
            //     await this.callSynthetic();
            // } else {
            //     this.lstPhuLuc.forEach(item => {
            //         this.baoCao.lstBcaos.push({
            //             id: uuid.v4() + 'FE',
            //             checked: false,
            //             tieuDe: item.tieuDe,
            //             maLoai: item.maPhuLuc,
            //             tenPhuLuc: item.tenPhuLuc,
            //             trangThai: '3',
            //             lstCtietBcaos: [],
            //             maDviTien: '1',
            //             thuyetMinh: null,
            //             lyDoTuChoi: null,
            //             lstIdDeletes: [],
            //             nguoiBcao: null,
            //             bcaoId: this.baoCao.id,
            //         });
            //     })
            // }
        }

        this.getStatusButton()
        if (this.status.save) {
            await this.getListUser();
            this.getLuyKe();
        }
        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
        this.spinner.hide();
    }

    // async getDviCon() {
    //     const request = {
    //         maDviCha: this.baoCao.maDvi,
    //         trangThai: '01',
    //     }
    //     await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
    //         data => {
    //             if (data.statusCode == 0) {
    //                 this.donVis = data.data;
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //         }
    //     )
    // }

    getLuyKe() {
        const request = {
            dotBcao: null,
            maLoaiBcao: this.baoCao.maLoaiBcao,
            maPhanBcao: "0",
            namBcao: this.baoCao?.namBcao,
            thangBcao: this.baoCao?.thangBcao,
        }
        this.baoCaoThucHienDuToanChiService.getLuyKe(request).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.luyKes = res.data.lstBcaos;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, (err) => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }

    async getListUser() {
        await this.quanLyVonPhiService.getListUser().toPromise().then(
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
        this.isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.SUBMIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.SUBMIT_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.PASS_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.PASS_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.APPROVE_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.APPROVE_REPORT);
        const checkAccept = this.userService.isAccessPermisson(Roles.DTC.ACCEPT_REPORT);
        const checkCopy = isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.COPY_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.COPY_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.PRINT_SYTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.PRINT_REPORT);

        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;

        this.status.ok = this.status.accept || this.status.approve || this.status.pass;
        this.status.finish = this.status.save;
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

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any;
        let doc: any;
        if (!id) {
            file = this.fileDetail;
            doc = this.baoCao.congVan
        } else {
            file = this.listFile.find(element => element?.lastModified.toString() == id);
            doc = this.baoCao.lstFiles.find(element => element?.id == id);
        }
        await this.fileManip.downloadFile(file, doc);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.baoCaoThucHienDuToanChiService.baoCaoChiTiet(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao?.lstBcaos?.forEach(item => {
                        [item.tenPhuLuc, item.tieuDe] = Dtc.appendixName(item.maLoai);
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
                this.onSubmit(Status.TT_02, '')
            },
        });
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (mcn == Status.TT_02) {
            if (!this.baoCao.congVan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
                return;
            }
            if (!this.baoCao.lstBcaos.every(e => e.trangThai == Status.COMPLETE)) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            if (mcn == Status.TT_04 || mcn == Status.TT_07 || mcn == Status.TT_09) {
                if (this.baoCao.lstBcaos.some(e => e.trangThai == Status.NOT_RATE)) {
                    this.notification.warning(MESSAGE.ERROR, MESSAGE.RATE_FORM);
                    return;
                }
            }
        }
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.baoCaoThucHienDuToanChiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.baoCao.ngayTraKq = data.data.ngayTraKq;
                if (Status.check('reject', mcn)) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this.getStatusButton();
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
        if (!this.baoCao.lstBcaos.every(e => e.nguoiBcao)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        if (this.listFile.some(item => item.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const tongHopTuIds = []
        const baoCaoTemp = JSON.parse(JSON.stringify({
            ... this.baoCao,
            tongHopTuIds
        }));
        this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })

        baoCaoTemp.fileDinhKems = [];
        for (const iterator of this.listFile) {
            baoCaoTemp.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.path));
        }

        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = await this.fileManip.uploadFile(file, this.path);
            }
        }
        if (!baoCaoTemp.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstBcaos.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        if (!this.baoCao.id) {
            await this.baoCaoThucHienDuToanChiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.getDetailReport();
                        const dataTemp = {
                            id: data.data.id,
                            tabSelected: this.data.tabSelected,
                            preTab: this.data.preTab,
                        }
                        this.data = dataTemp;
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

    // // call tong hop bao cao
    // async callSynthetic() {
    //     const request = {
    //         maLoaiBcao: this.baoCao.maLoaiBcao,
    //         namBcao: this.baoCao.namBcao,
    //         thangBcao: this.baoCao.thangBcao,
    //         dotBcao: null,
    //         maPhanBcao: '0',
    //     }
    //     await this.baoCaoThucHienDuToanChiService.tongHopBaoCaoKetQua(request).toPromise().then(
    //         async (data) => {
    //             if (data.statusCode == 0) {
    //                 this.baoCao.lstBcaos = [];
    //                 this.baoCao.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
    //                 data.data.lstBcaos.forEach(item => {
    //                     if (item) {
    //                         const data = PHULUCLIST.find(e => e.maPhuLuc == item.maLoai);
    //                         this.baoCao.lstBcaos.push({
    //                             ...item,
    //                             id: uuid.v4() + "FE",
    //                             maDviTien: '1',
    //                             tieuDe: data.tieuDe,
    //                             tenPhuLuc: data.tenPhuLuc,
    //                             trangThai: '3',
    //                             nguoiBcao: this.userInfo?.sub,
    //                             checked: false,
    //                         })
    //                     }
    //                 })
    //                 this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
    //                     item.ngayTrinh = this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR);
    //                     item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
    //                 })
    //                 this.listFile = [];
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //         }
    //     );
    // }

    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: this.data.tabSelected == Dtc.BAO_CAO_01 ? Dtc.BAO_CAO_02 : Dtc.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }

    // them phu luc
    addAppendix() {
        this.lstPhuLuc.forEach(item => item.status = false);
        const danhSach = this.lstPhuLuc.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.id) == -1);
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách phụ lục',
            nzContent: DialogChonThemBieuMauComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                danhSachBieuMau: danhSach
            },
        });
        modalIn.afterClose.toPromise().then((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        this.baoCao.lstBcaos.push({
                            ... new Form(),
                            id: uuid.v4() + 'FE',
                            checked: false,
                            tieuDe: item.tenDm,
                            maLoai: item.id,
                            tenPhuLuc: item.tenPl,
                            trangThai: Status.NEW,
                            lstCtietBcaos: [],
                            maDviTien: '1',
                            nguoiBcao: this.userInfo?.sub,
                        });
                    }
                })
            }
        });
    }

    // xoa phu luc
    deleteAppendix(id: string) {
        this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.id != id);
    }

    viewAppendix(id: string) {
        const bieuMau = this.baoCao.lstBcaos.find(e => e.id == id);
        const dataInfo = {
            id: id,
            maBcao: this.baoCao.maBcao,
            maDvi: this.baoCao.maDvi,
            namBcao: this.baoCao.namBcao,
            path: this.path,
            status: new BtnStatus(),
            luyKes: this.luyKes.find(e => e.maLoai == bieuMau.maLoai),
        }
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.save = dataInfo.status.save && (this.userInfo?.sub == bieuMau.nguoiBcao);

        let nzContent: ComponentType<any>;
        switch (bieuMau.maLoai) {
            //phu luc
            case Dtc.PHU_LUC_I:
                nzContent = PhuLucIComponent;
                break;
            case Dtc.PHU_LUC_II:
                nzContent = PhuLucIIComponent;
                break;
            case Dtc.PHU_LUC_III:
                nzContent = PhuLucIIIComponent;
                break;
            default:
                break;
        }
        const modalAppendix = this.modal.create({
            nzTitle: bieuMau.tieuDe,
            nzContent: nzContent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzWidth: '95%',
            nzFooter: null,
            nzComponentParams: {
                dataInfo: dataInfo
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                bieuMau.trangThai = res?.trangThai;
            }
        });
    }

    // // click o checkbox single
    // updateSingleChecked(): void {
    //     if (this.baoCao?.lstBcaos.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
    //         this.allChecked = false;
    //     } else if (this.baoCao?.lstBcaos.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
    //         this.allChecked = true;
    //     }
    // }

    // updateAllChecked(): void {
    //     this.baoCao?.lstBcaos.filter(item =>
    //         item.checked = this.allChecked
    //     );
    // }

    // closeTab({ index }: { index: number }): void {
    //     this.tabs.splice(index - 1, 1);
    // }

    // newTab(maPhuLuc: any): void {
    //     const index: number = this.tabs.findIndex(e => e.maPhuLuc === maPhuLuc);
    //     if (index != -1) {
    //         this.selectedIndex = index + 1;
    //     } else {
    //         const item = this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc);
    //         this.tabData = {
    //             ...item,
    //             trangThaiBaoCao: this.baoCao.trangThai,
    //             maLoaiBcao: this.baoCao.maLoaiBcao,
    //             maPhuLuc: maPhuLuc,
    //             idBcao: this.baoCao.id,
    //             statusBtnOk: this.okStatus,
    //             statusBtnFinish: this.finishStatus,
    //             namBcao: this.baoCao.namBcao,
    //             luyKeDetail: this.luyKes.find(e => e.maLoai == maPhuLuc),
    //             status: this.status,
    //             extraDataPL3: null,
    //             extraDataPL2: null,
    //         }
    //         if (maPhuLuc == '1' && Utils.statusSave.includes(this.baoCao.trangThai)) {
    //             //lay du lieu cua phu luc 3
    //             const dataTemp3 = this.baoCao.lstBcaos.find(e => e.maLoai == '3');
    //             if (dataTemp3 && dataTemp3?.trangThai != '3') {
    //                 const dataPL3 = {
    //                     maNdung: '0.1.1.2',
    //                     dtoanGiaoDtoan: 0,
    //                     giaiNganThangBcaoDtoan: 0,
    //                     luyKeGiaiNganDtoan: 0,
    //                 }
    //                 dataTemp3?.lstCtietBcaos.forEach(item => {
    //                     const level = item.maDan.split('.').length - 2;
    //                     if (level == 0) {
    //                         dataPL3.dtoanGiaoDtoan = sumNumber([dataPL3.dtoanGiaoDtoan, item.khoachNamVonScl])
    //                         dataPL3.giaiNganThangBcaoDtoan = sumNumber([dataPL3.giaiNganThangBcaoDtoan, item.giaiNganNsnnVonScl])
    //                         dataPL3.luyKeGiaiNganDtoan = sumNumber([dataPL3.luyKeGiaiNganDtoan, item.luyKeGiaiNganDauNamNsnnVonScl])
    //                     }
    //                 })
    //                 this.tabData.extraDataPL3 = dataPL3;
    //             }

    //             //lay du lieu cua phu luc 2
    //             const dataTemp2 = this.baoCao.lstBcaos.find(e => e.maLoai == '2');
    //             if (dataTemp2 && dataTemp2?.trangThai != '3') {
    //                 const dataPL2 = {
    //                     maNdung: '0.1.1.1',
    //                     dtoanGiaoDtoan: 0,
    //                     dtoanGiaoNguonKhac: 0,
    //                     dtoanGiaoNguonQuy: 0,
    //                     giaiNganThangBcaoDtoan: 0,
    //                     giaiNganThangBcaoNguonKhac: 0,
    //                     giaiNganThangBcaoNguonQuy: 0,
    //                     luyKeGiaiNganDtoan: 0,
    //                     luyKeGiaiNganNguonKhac: 0,
    //                     luyKeGiaiNganNguonQuy: 0,
    //                 }
    //                 dataTemp2?.lstCtietBcaos.forEach(item => {
    //                     const level = item.maNdung.split('.').length - 2;
    //                     if (level == 0) {
    //                         dataPL2.dtoanGiaoDtoan = sumNumber([dataPL2.dtoanGiaoDtoan, item.dtoanSdungNamNguonNsnn])
    //                         dataPL2.dtoanGiaoNguonKhac = sumNumber([dataPL2.dtoanGiaoNguonKhac, item.dtoanSdungNamNguonSn])
    //                         dataPL2.dtoanGiaoNguonQuy = sumNumber([dataPL2.dtoanGiaoNguonQuy, item.dtoanSdungNamNguonQuy])
    //                         dataPL2.giaiNganThangBcaoDtoan = sumNumber([dataPL2.giaiNganThangBcaoDtoan, item.giaiNganThangNguonNsnn])
    //                         dataPL2.giaiNganThangBcaoNguonKhac = sumNumber([dataPL2.giaiNganThangBcaoNguonKhac, item.giaiNganThangNguonSn])
    //                         dataPL2.giaiNganThangBcaoNguonQuy = sumNumber([dataPL2.giaiNganThangBcaoNguonQuy, item.giaiNganThangNguonQuy])
    //                         dataPL2.luyKeGiaiNganDtoan = sumNumber([dataPL2.luyKeGiaiNganDtoan, item.luyKeGiaiNganNguonNsnn])
    //                         dataPL2.luyKeGiaiNganNguonKhac = sumNumber([dataPL2.luyKeGiaiNganNguonKhac, item.luyKeGiaiNganNguonSn])
    //                         dataPL2.luyKeGiaiNganNguonQuy = sumNumber([dataPL2.luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy])
    //                     }
    //                 })
    //                 this.tabData.extraDataPL2 = dataPL2;
    //             }
    //         }
    //         this.tabs = [];
    //         this.tabs.push(PHULUCLIST.find(item => item.maPhuLuc == maPhuLuc));
    //         this.selectedIndex = this.tabs.length + 1;
    //     }
    // }

    // getNewData(obj: any) {
    //     const index = this.baoCao.lstBcaos.findIndex(e => e.maLoai == this.tabs[0].maPhuLuc);
    //     if (obj?.trangThai == '-1') {
    //         const pl = PHULUCLIST.find(e => e.maPhuLuc == this.tabs[0].maPhuLuc);
    //         this.baoCao.lstBcaos[index] = obj?.data;
    //         this.baoCao.lstBcaos[index].tieuDe = pl.tieuDe;
    //         this.baoCao.lstBcaos[index].tenPhuLuc = pl.tenPhuLuc;
    //     } else {
    //         this.baoCao.lstBcaos[index].trangThai = obj?.trangThai;
    //         this.baoCao.lstBcaos[index].lyDoTuChoi = obj?.lyDoTuChoi;
    //     }
    //     this.tabs = [];
    //     this.selectedIndex = 0;
    // }

    // showDialogCopy() {
    //     const modalTuChoi = this.modal.create({
    //         nzTitle: 'Copy Báo Cáo',
    //         nzContent: DialogBaoCaoCopyComponent,
    //         nzMaskClosable: false,
    //         nzClosable: false,
    //         nzWidth: '900px',
    //         nzFooter: null,
    //         nzComponentParams: {
    //             maPhanBcao: '0',
    //             maLoaiBcao: this.baoCao.maLoaiBcao,
    //             namBcao: this.baoCao.namBcao,
    //             dotBcao: null,
    //             thangBcao: this.baoCao.thangBcao,
    //             checkDvtt: this.baoCao.lstBcaoDviTrucThuocs.length > 0 ? true : false,
    //         },
    //     });
    //     modalTuChoi.afterClose.toPromise().then(async (response) => {
    //         if (response) {
    //             this.doCopy(response);
    //         }
    //     });
    // }

    // async doCopy(response) {
    //     this.spinner.show();
    //     const maBaoCao = await this.baoCaoThucHienDuToanChiService.taoMaBaoCao().toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 return data.data;
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 return null;
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             return null;
    //         }
    //     );
    //     this.spinner.hide();
    //     if (!maBaoCao) {
    //         return;
    //     }

    //     const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    //     baoCaoTemp.congVan = null;
    //     // set nambao,dot bao cao tu dialog gui ve
    //     baoCaoTemp.namBcao = response.namBcao;
    //     baoCaoTemp.thangBcao = response.thangBcao;
    //     if (response.loaiCopy == 'D') {
    //         //xoa lst don vi truc thuoc theo lua chon tu dialog
    //         baoCaoTemp.lstBcaoDviTrucThuocs = [];
    //     }
    //     // replace nhung ban ghi dc them moi id thanh null
    //     baoCaoTemp?.lstBcaos?.filter(item => {
    //         item.id = null;
    //         item.listIdDelete = null;
    //         item.trangThai = '3'; // set trang thai phu luc la chua danh gia
    //         item?.lstCtietBcaos.filter(data => {
    //             data.id = null;

    //         })
    //     })

    //     // replace nhung ban ghi dc them moi id thanh null
    //     baoCaoTemp.id = null;
    //     baoCaoTemp.maBcao = maBaoCao;
    //     baoCaoTemp.tongHopTuIds = [];
    //     baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
    //         baoCaoTemp.tongHopTuIds.push(item.id);
    //     })
    //     baoCaoTemp.fileDinhKems = [];
    //     baoCaoTemp.listIdFiles = null;
    //     baoCaoTemp.trangThai = "1";
    //     baoCaoTemp.maPhanBcao = '0';

    //     //call service them moi
    //     this.spinner.show();
    //     this.baoCaoThucHienDuToanChiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
    //         async data => {
    //             if (data.statusCode == 0) {
    //                 const modalCopy = this.modal.create({
    //                     nzTitle: MESSAGE.ALERT,
    //                     nzContent: DialogCopyComponent,
    //                     nzMaskClosable: false,
    //                     nzClosable: false,
    //                     nzWidth: '900px',
    //                     nzFooter: null,
    //                     nzComponentParams: {
    //                         maBcao: maBaoCao
    //                     },
    //                 });
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 this.spinner.hide();
    //             }
    //         },
    //         err => {
    //             this.spinner.hide();
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         },
    //     );
    //     this.spinner.hide();
    // }

    // statusClass() {
    //     if (Utils.statusSave.includes(this.baoCao.trangThai)) {
    //         return 'du-thao-va-lanh-dao-duyet';
    //     } else {
    //         return 'da-ban-hanh';
    //     }
    // }
}
