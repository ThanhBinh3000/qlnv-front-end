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
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form, Report, Vp } from '../bao-cao-thuc-hien-von-phi.constant';
import { BaoCao02Component } from './bao-cao-02/bao-cao-02.component';
import { BaoCao03Component } from './bao-cao-03/bao-cao-03.component';
import { BaoCao04anComponent } from './bao-cao-04an/bao-cao-04an.component';
import { BaoCao04axComponent } from './bao-cao-04ax/bao-cao-04ax.component';
import { BaoCao04bComponent } from './bao-cao-04b/bao-cao-04b.component';
import { BaoCao05Component } from './bao-cao-05/bao-cao-05.component';

// export class ItemDanhSach {
//     id!: any;
//     maBcao!: string;
//     namBcao!: number;
//     dotBcao!: number;
//     thangBcao!: number;
//     trangThai!: string;
//     ngayTao!: string;
//     nguoiTao!: string;
//     maDviTien!: string;
//     maDvi: number;
//     congVan!: ItemCongVan;
//     ngayTrinh!: string;
//     ngayDuyet!: string;
//     ngayPheDuyet!: string;
//     ngayTraKq!: string;
//     // dung cho request
//     fileDinhKems!: any[];
//     listIdDeletes!: string;
//     listIdDeleteFiles = '';
//     maPhanBcao = "1";

//     maLoaiBcao!: string;
//     stt!: string;
//     checked!: boolean;
//     lstBcaos: ItemData[] = [];
//     lstFile: any[] = [];
//     lstBcaoDviTrucThuocs: any[] = [];
//     tongHopTuIds!: [];
// }

// export class ItemCongVan {
//     fileName: string;
//     fileSize: number;
//     fileUrl: number;
// }
// export class ItemData {
//     id!: any;
//     maLoai!: string;
//     maDviTien!: any;
//     lstCtietBcaos!: any;
//     trangThai!: string;
//     checked!: boolean;
//     tieuDe!: string;
//     tenPhuLuc!: string;
//     thuyetMinh!: string;
//     lyDoTuChoi!: string;
//     lstIdDeletes!: [];
//     nguoiBcao!: string;
//     bcaoId!: string;
//     tuNgay: string;
//     denNgay: string;
// }

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
    Vp = Vp;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    //danh muc
    nguoiBcaos: any[];
    luyKes: Form[] = [];
    lstBieuMaus: any[] = Vp.PHU_LUC;
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    path: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable = false;
    isOffice: boolean;
    isChild: boolean;
    isParent: boolean;
    //khac
    allChecked = false;                         // check all checkbox
    editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
    // before uploaf file
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
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
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
        this.isOffice = this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1;

        // await this.danhMucService.dMDviCon().toPromise().then(
        //     (data) => {
        //         if (data.statusCode == 0) {
        //             this.childUnit = data.data;
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, data?.msg);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        //     }
        // )

        // await this.getListVatTu();

        this.getListUser();
        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao = this.data.baoCao;
            // this.baoCao.maDvi = this.userInfo?.MA_DVI;
            // await this.getDviCon();
            // this.baoCaoThucHienVonPhiService.taoMaBaoCao().toPromise().then(
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
            // this.baoCao.dotBcao = this.data?.dotBcao == 0 ? null : this.data?.dotBcao;
            // this.baoCao.nguoiTao = this.userInfo.sub;
            // this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
            // this.baoCao.trangThai = "1";
            // this.lstBieuMaus = this.baoCao.maLoaiBcao == BAO_CAO_DOT ? LISTBIEUMAUDOT : LISTBIEUMAUNAM;
            // if (this.data?.isSynthetic || (this.isOffice)) {
            //     await this.callSynthetic();
            // } else {
            //     this.lstBieuMaus.forEach(item => {
            //         this.baoCao.lstBcaos.push({
            //             ... new Form(),
            //             id: uuid.v4() + 'FE',
            //             tieuDe: item.tieuDe + (this.baoCao.maLoaiBcao == BAO_CAO_DOT ? this.baoCao.dotBcao : this.baoCao.namBcao),
            //             maLoai: item.maPhuLuc,
            //             tenPhuLuc: item.tenPhuLuc,
            //             trangThai: '3',
            //             lstCtietBcaos: [],
            //         });
            //     })
            //     if (this.isOffice) {
            //         this.baoCao.lstBcaos = this.baoCao.lstBcaos.filter(e => e.maLoai != '4' && e.maLoai != '5');
            //     }
            // }
        }
        this.getStatusButton();
        if (this.status.save) {
            await this.getListUser();
            this.getLuyKe();
            this.lstBieuMaus.forEach(item => {
                item.tenDm = Vp.appendixName(item.id, this.baoCao.maLoaiBcao, this.baoCao.namBcao, this.baoCao.dotBcao)
            })
        }
        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
        this.spinner.hide();
    }

    // async getListVatTu() {
    //     let vatTus: any;
    //     await this.danhMucService.dMVatTu().toPromise().then(res => {
    //         if (res.statusCode == 0) {
    //             vatTus = res.data;
    //         } else {
    //             this.notification.error(MESSAGE.ERROR, res?.msg);
    //         }
    //     }, err => {
    //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     })
    //     vatTus.forEach(element => {
    //         this.getFullVatu(element);
    //     })
    // }

    // getFullVatu(vatTu: any) {
    //     this.lstVatTus.push({
    //         id: vatTu.id,
    //         ma: vatTu.ma,
    //         ten: vatTu.ten,
    //     })
    //     vatTu?.child.forEach(item => {
    //         this.getFullVatu(item);
    //     })
    // }

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
            dotBcao: this.baoCao?.dotBcao,
            maPhanBcao: "1",
            namBcao: this.baoCao?.namBcao,
            thangBcao: null
        }
        this.baoCaoThucHienVonPhiService.getLuyKe(request).toPromise().then(res => {
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
        this.isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.SUBMIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.SUBMIT_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.PASS_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.PASS_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.APPROVE_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.APPROVE_REPORT);
        const checkAccept = this.userService.isAccessPermisson(Roles.VP.ACCEPT_REPORT);
        // const checkCopy = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.VP.COPY_REPORT);
        // const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.VP.PRINT_REPORT);
        const checkExport = this.userService.isAccessPermisson(Roles.VP.EXPORT_EXCEL_REPORT);

        this.status.save = Status.check('saveWOHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.VP.ADD_REPORT) && this.isChild && this.data.preTab == Vp.DANH_SACH_BAO_CAO;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        // this.status.print = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && isChild;
        this.status.export = Status.check('export', this.baoCao.trangThai) && checkExport && this.isChild;
        this.status.ok = this.status.accept || this.status.approve || this.status.pass
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
        await this.baoCaoThucHienVonPhiService.baoCaoChiTiet(this.baoCao.id).toPromise().then(async data => {
            if (data.statusCode == 0) {
                this.baoCao = data.data;
                this.baoCao?.lstBcaos?.forEach(item => {
                    const app = this.lstBieuMaus.find(e => e.id == item.maLoai);
                    item.tenPhuLuc = app?.tenPl;
                    item.tieuDe = app.tenDm;
                })
                this.listFile = [];
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, (err) => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        })
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
        if (!this.baoCao?.congVan?.fileUrl) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        const checkStatusReport = this.baoCao?.lstBcaos?.findIndex(item => item.trangThai != Status.COMPLETE);
        if (checkStatusReport != -1 && mcn == Status.TT_02) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WARNING_FINISH_INPUT);
            return;
        }
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.baoCaoThucHienVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
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
            await this.baoCaoThucHienVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                        this.baoCao.id = data.data.id
                        await this.getDetailReport();
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
            await this.baoCaoThucHienVonPhiService.updateBaoCaoThucHienDTC(baoCaoTemp).toPromise().then(async res => {
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
    // async callSynthetic() {
    //     const request = {
    //         maLoaiBcao: this.baoCao.maLoaiBcao,
    //         namBcao: this.baoCao.namBcao,
    //         thangBcao: null,
    //         dotBcao: this.baoCao.dotBcao,
    //         maPhanBcao: '1',
    //     }
    //     if (this.isOffice) {
    //         await this.baoCaoThucHienVonPhiService.tongHopVanPhong(request).toPromise().then(
    //             async (data) => {
    //                 if (data.statusCode == 0) {
    //                     this.baoCao.lstBcaos = data.data.lstBcaos;
    //                     // this.baoCao.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             }
    //         );
    //     } else {
    //         await this.baoCaoThucHienVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
    //             async (data) => {
    //                 if (data.statusCode == 0) {
    //                     this.baoCao.lstBcaos = data.data.lstBcaos;
    //                     this.baoCao.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             }
    //         );
    //     }

    //     this.baoCao?.lstBcaos?.forEach(item => {
    //         item.id = uuid.v4() + "FE";
    //         item.maDviTien = '1';
    //         item.checked = false;
    //         item.trangThai = '3';
    //         item.nguoiBcao = this.userInfo?.sub;
    //         const index = this.lstBieuMaus.findIndex(data => data.maPhuLuc == item.maLoai);
    //         if (index != -1) {
    //             item.tieuDe = this.lstBieuMaus[index].tieuDe + (this.baoCao.maLoaiBcao == BAO_CAO_DOT ? this.baoCao.dotBcao : this.baoCao.namBcao);
    //             item.tenPhuLuc = this.lstBieuMaus[index].tenPhuLuc;
    //         }
    //         if (item.maLoai == '4') {
    //             item.lstCtietBcaos.forEach(e => {
    //                 e.khGiaMuaTd = divNumber(e.khTtien, e.khSoLuong);
    //                 e.thGiaMuaTd = divNumber(e.thTtien, e.thSoLuong);
    //             })
    //         }
    //         if (item.maLoai == '5') {
    //             item.lstCtietBcaos.forEach(e => {
    //                 e.ttClechGiaTteVaGiaHtoan = sumNumber([e.ttGiaBanTte, -e.ttGiaHtoan]);
    //             })
    //         }
    //     })

    //     this.baoCao?.lstBcaoDviTrucThuocs?.forEach(item => {
    //         item.ngayTrinh = this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR);
    //         item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
    //         item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
    //         item.ngayTraKq = this.datePipe.transform(item.ngayTraKq, Utils.FORMAT_DATE_STR);
    //     })
    //     this.listFile = [];
    //     this.baoCao.trangThai = "1";
    // }

    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: this.data.tabSelected == Vp.BAO_CAO_01 ? Vp.BAO_CAO_02 : Vp.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }

    // them phu luc
    addAppendix() {
        let danhSach: any;
        this.lstBieuMaus.forEach(item => item.status = false);
        danhSach = this.lstBieuMaus.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.id) == -1);

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách mẫu báo cáo',
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
                        this.baoCao.lstBcaos.push({
                            ... new Form(),
                            id: uuid.v4() + 'FE',
                            tieuDe: item.tenDm,
                            maLoai: item.id,
                            tenPhuLuc: item.tenPl,
                            trangThai: Status.NEW,
                            lstCtietBcaos: [],
                            maDviTien: '1',
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
            case Vp.BM_02:
                nzContent = BaoCao02Component;
                break;
            case Vp.BM_03:
                nzContent = BaoCao03Component;
                break;
            case Vp.BM_04AN:
                nzContent = BaoCao04anComponent;
                break;
            case Vp.BM_04AX:
                nzContent = BaoCao04axComponent;
                break;
            case Vp.BM_04B:
                nzContent = BaoCao04bComponent;
                break;
            case Vp.BM_05:
                nzContent = BaoCao05Component;
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

    // // xoa phu luc
    // deletePhuLucList(id: string) {
    //     this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
    //     if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
    //         this.tabSelected = null;
    //     }
    //     this.allChecked = false;
    // }

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
    //     const index: number = this.tabs.findIndex(e => e.id === maPhuLuc);
    //     if (index != -1) {
    //         this.selectedIndex = index + 1;
    //     } else {
    //         const item = this.baoCao.lstBcaos.find(e => e.maLoai == maPhuLuc);
    //         this.tabData = {
    //             ...item,
    //             trangThaiBaoCao: this.baoCao.trangThai,
    //             status: this.status,
    //             idBaoCao: this.baoCao.id,
    //             luyKes: this.luyKes,
    //             namBcao: this.baoCao.namBcao,
    //             maDvi: this.baoCao.maDvi,
    //             dotBcao: this.baoCao.dotBcao,
    //             isOffice: this.isOffice,
    //             isSynthetic: this.baoCao.lstBcaoDviTrucThuocs.length != 0,
    //             lstVtus: this.lstVatTus,
    //         }
    //         this.tabs = [];
    //         this.tabs.push(this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc));
    //         this.selectedIndex = this.tabs.length + 1;
    //     }
    // }

    // getNewData(obj: any) {
    //     const index = this.baoCao?.lstBcaos.findIndex(e => e.maLoai == this.tabs[0].maLoai);
    //     if (obj?.lstCtietBcaos) {
    //         this.baoCao.lstBcaos[index].maDviTien = obj.maDviTien;
    //         this.baoCao.lstBcaos[index].lstCtietBcaos = obj.lstCtietBcaos;
    //         this.baoCao.lstBcaos[index].trangThai = obj.trangThai;
    //         this.baoCao.lstBcaos[index].thuyetMinh = obj.thuyetMinh;
    //         this.baoCao.lstBcaos[index].lyDoTuChoi = obj.lyDoTuChoi;
    //         this.baoCao.lstBcaos[index].tuNgay = obj.tuNgay;
    //         this.baoCao.lstBcaos[index].denNgay = obj.denNgay;
    //     } else {
    //         this.baoCao.lstBcaos[index].trangThai = obj?.trangThai;
    //         this.baoCao.lstBcaos[index].lyDoTuChoi = obj?.lyDoTuChoi;
    //     }
    //     this.tabs = [];
    //     this.selectedIndex = 0;
    // }

    // viewDetail(id) {
    //     const obj = {
    //         id: id,
    //         preData: this.data,
    //         tabSelected: 'next' + this.data?.tabSelected,
    //     }
    //     this.dataChange.emit(obj);
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
    //             maPhanBcao: '1',
    //             maLoaiBcao: this.baoCao.maLoaiBcao,
    //             namBcao: this.baoCao.namBcao,
    //             dotBcao: this.baoCao.dotBcao,
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
    //     const maBaoCao = await this.baoCaoThucHienVonPhiService.taoMaBaoCao().toPromise().then(
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
    //     if (!maBaoCao) {
    //         return;
    //     }

    //     const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    //     baoCaoTemp.congVan = null;
    //     // set nambao,dot bao cao tu dialog gui ve
    //     baoCaoTemp.namBcao = response.namBcao;
    //     baoCaoTemp.dotBcao = response.dotBcao;
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
    //     //baoCaoTemp.maDvi = this.maDonViTao;
    //     baoCaoTemp.maPhanBcao = '1';

    //     //call service them moi
    //     this.baoCaoThucHienVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
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
    //             }
    //         },
    //         err => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         },
    //     );
    // }

    // statusClass() {
    //     if (Utils.statusSave.includes(this.baoCao.trangThai)) {
    //         return 'du-thao-va-lanh-dao-duyet';
    //     } else {
    //         return 'da-ban-hanh';
    //     }
    // }
}
