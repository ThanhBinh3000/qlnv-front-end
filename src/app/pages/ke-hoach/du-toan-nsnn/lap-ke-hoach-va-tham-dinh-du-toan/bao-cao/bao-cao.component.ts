import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, getName } from 'src/app/Utility/func';
import { LTD, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form, History, Report } from '../lap-ke-hoach-va-tham-dinh-du-toan.class';
import { PHU_LUC } from './bao-cao.constant';
import { HangComponent } from './phu-luc/bao-hiem/hang/hang.component';
import { KhoComponent } from './phu-luc/bao-hiem/kho/kho.component';
import { TongHopComponent } from './phu-luc/bao-hiem/tong-hop/tong-hop.component';
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
import { O } from '@angular/cdk/keycodes';

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
    baoCao: Report = new Report();
    //danh muc
    listAppendix: any[] = PHU_LUC;
    tabs: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
    canBos: any[];
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    path: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
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
        private quanLyVonPhiService: QuanLyVonPhiService,
        private lapThamDinhService: LapThamDinhService,
        private spinner: NgxSpinnerService,
        public userService: UserService,
        public genFunc: GeneralFunction,
        public fileFunc: FileFunction,
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

        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao = this.data.baoCao;
        }

        if (Utils.statusSave.includes(this.baoCao.trangThai)) {
            await this.getListUser();
            this.listAppendix.forEach(e => {
                e.tenDm = getName(this.baoCao.namBcao, e.tenDm);
            })
        }

        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
        this.getStatusButton();
        this.spinner.hide();
    }

    // async getChildUnit() {
    //     const request = {
    //         maDviCha: this.baoCao.maDvi,
    //         trangThai: '01',
    //     }
    //     await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
    //         data => {
    //             if (data.statusCode == 0) {
    //                 this.childUnit = data.data;
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //         }
    //     )
    // }

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
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(LTD.PRINT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.PRINT_REPORT);
        const checkExport = isSynthetic ? this.userService.isAccessPermisson(LTD.EXPORT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.EXPORT_REPORT)

        this.status.general = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave;
        this.status.new = ([Utils.TT_BC_3, Utils.TT_BC_5, Utils.TT_BC_8].includes(this.baoCao.trangThai)) && this.userService.isAccessPermisson(LTD.ADD_REPORT) && isChild;
        this.status.viewAppVal = Utils.statusAppraisal.includes(this.baoCao.trangThai);
        this.status.save = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave && isChild;
        this.status.submit = Utils.statusApprove.includes(this.baoCao.trangThai) && checkSunmit && isChild && !(!this.baoCao.id);
        this.status.pass = Utils.statusDuyet.includes(this.baoCao.trangThai) && checkPass && isChild;
        this.status.approve = Utils.statusPheDuyet.includes(this.baoCao.trangThai) && checkApprove && isChild;
        this.status.accept = Utils.statusTiepNhan.includes(this.baoCao.trangThai) && checkAccept && isParent;
        this.status.print = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && isChild;
        this.status.export = Utils.statusExport.includes(this.baoCao.trangThai) && checkExport && isChild;
        this.status.ok = this.status.accept || this.status.approve || this.status.pass
        this.status.finish = this.status.general;
        this.status.editAppVal = this.status.accept;
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

    // lay ten trang thai ban ghi
    getStatusName(status: string) {
        const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
        if (statusMoi && this.userInfo.MA_DVI == this.baoCao.maDviCha) {
            return 'Mới';
        } else {
            return this.trangThais.find(e => e.id == status)?.tenDm;
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
        await this.fileFunc.downloadFile(file, doc);
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
                        item.tenDm = getName(this.baoCao.namBcao, appendix.tenDm);
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

        if (this.listFile.some(item => item.size > Utils.FILE_SIZE)) {
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
            baoCaoTemp.fileDinhKems.push(await this.fileFunc.uploadFile(iterator, this.path));
        }
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = await this.fileFunc.uploadFile(file, this.path);
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
                        const newItem: Form = {
                            ... new Form(),
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

    viewAppendix(id: string) {
        const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs && this.baoCao.lstBcaoDviTrucThuocs.length != 0;
        const bieuMau = this.baoCao.lstLapThamDinhs.find(e => e.id == id);
        const dataInfo = {
            id: id,
            maBieuMau: bieuMau.maBieuMau,
            maBcao: this.baoCao.maBcao,
            maDvi: this.baoCao.maDvi,
            capDvi: this.userInfo.capDvi,
            tenDvi: this.userInfo.TEN_DVI,
            namBcao: this.baoCao.namBcao,
            path: this.path,
            status: new BtnStatus(),
            isSynthetic: isSynthetic
        }
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.general = dataInfo.status.general && (this.userInfo?.sub == bieuMau.nguoiBcao);

        let nzContent: ComponentType<any>;
        switch (bieuMau.maBieuMau) {
            //phu luc
            case 'pl01N':
                nzContent = PhuLuc01Component;
                break;
            case 'pl01X':
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
            case 'plda':
                nzContent = PhuLucDuAnComponent;
                break;
            case 'pl_bh_hang':
                nzContent = HangComponent;
                break;
            case 'pl_bh_kho':
                nzContent = KhoComponent;
                break;
            case 'pl_bh':
                nzContent = TongHopComponent;
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
            case 'TT342_16':
                nzContent = BieuMau160Component;
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
            nzTitle: bieuMau.tenDm,
            nzContent: nzContent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzWidth: '90%',
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

    async restoreReport(id: string) {
        await this.lapThamDinhService.bCLapThamDinhDuToanChiTiet(id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    Object.assign(this.baoCao.lstLapThamDinhs, data.data.lstLapThamDinhs);
                    this.baoCao.lstLapThamDinhs.forEach(item => {
                        const appendix = this.listAppendix.find(e => e.id == item.maBieuMau);
                        item.tenPl = appendix.tenPl;
                        item.tenDm = getName(this.baoCao.namBcao, appendix.tenDm);
                        item.id = uuid.v4() + 'FE';
                        item.lstCtietLapThamDinhs?.forEach(e => {
                            e.id = null;
                        })
                    })
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

    newReport() {
        const tongHopTuIds = []
        const baoCaoTemp = JSON.parse(JSON.stringify({
            ...this.baoCao,
            tongHopTuIds
        }));
        this.baoCao.lstBcaoDviTrucThuocs?.forEach(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })

        baoCaoTemp.fileDinhKems = [];
        baoCaoTemp.lstFiles?.forEach(item => {
            baoCaoTemp.fileDinhKems.push({
                fileName: item.fileName,
                fileSize: item.fileSize,
                fileUrl: item.fileUrl,
            })
        })
        baoCaoTemp.lstFiles = [];
        baoCaoTemp.congVan.id = null;

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstLapThamDinhs?.forEach(item => {
            item.id = null;
            item.fileDinhKems = [];
            item.lstFiles?.forEach(e => {
                e.fileDinhKems.push({
                    fileName: e.fileName,
                    fileSize: e.fileSize,
                    fileUrl: e.fileUrl,
                })
            })
            item.lstFiles = [];
            item.lstCtietLapThamDinhs?.forEach(e => {
                e.id = null;
                e.trangThai = '3';
            })
        })

        baoCaoTemp.id = null;
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
    }
}
