import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form, Ltd, Report } from '../lap-ke-hoach-va-tham-dinh-du-toan.constant';
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

@Component({
    selector: 'app-bao-cao',
    templateUrl: './bao-cao.component.html',
    styleUrls: ['./bao-cao.component.scss',
    ],
})
export class BaoCaoComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    //danh muc
    listAppendix: any[] = Ltd.PHU_LUC;
    canBos: any[];
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    path: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable = false;
    isChild: boolean;
    isParent: boolean;
    isOffice: boolean;
    //phan tab
    selectedIndex = 0;
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
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
            }
        });
        this.fileDetail = file;
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
        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao = this.data.baoCao;
        }
        this.getStatusButton();
        if (this.status.general) {
            await this.getListUser();
            this.listAppendix.forEach(e => {
                e.tenDm = Utils.getName(this.baoCao.namBcao, e.tenDm);
            })
        }

        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
        this.getStatusButton();
        this.spinner.hide();
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
        this.isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        this.isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.SUBMIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.SUBMIT_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.PASS_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.PASS_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.APPROVE_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.APPROVE_REPORT);
        const checkAccept = this.userService.isAccessPermisson(Roles.LTD.ACCEPT_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.PRINT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.PRINT_REPORT);
        const checkExport = isSynthetic ? this.userService.isAccessPermisson(Roles.LTD.EXPORT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.LTD.EXPORT_REPORT)

        this.status.general = Status.check('saveWHist', this.baoCao.trangThai) && checkSave;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.LTD.ADD_REPORT) && this.isChild && this.data.preTab == Ltd.DANH_SACH_BAO_CAO;
        this.status.viewAppVal = Status.check('appraisal', this.baoCao.trangThai);
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        // this.status.print = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && this.isChild;
        this.status.export = Status.check('export', this.baoCao.trangThai) && checkExport && this.isChild;
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
        await this.quanLyVonPhiService.downFile(file, doc);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.lapThamDinhService.bCLapThamDinhDuToanChiTiet(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao.lstLapThamDinhs.forEach(item => {
                        [item.tenPl, item.tenDm] = Ltd.appendixName(item.maBieuMau, this.baoCao.namBcao);
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
            if (!this.baoCao.lstLapThamDinhs.every(e => e.trangThai == Status.COMPLETE)) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            if (mcn == Status.TT_04 || mcn == Status.TT_07 || mcn == Status.TT_09) {
                if (this.baoCao.lstLapThamDinhs.some(e => e.trangThai == Status.NOT_RATE)) {
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
        await this.lapThamDinhService.approveThamDinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.getStatusButton();
                if (Status.check('reject', mcn)) {
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
            baoCaoTemp.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.path));
        }
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = {
                    ...await this.quanLyVonPhiService.upFile(file, this.path),
                    fileName: this.baoCao.congVan.fileName,
                }
            }
        }

        if (!baoCaoTemp.congVan.fileUrl) {
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
            tabSelected: this.data.tabSelected == Ltd.BAO_CAO_01 ? Ltd.BAO_CAO_02 : Ltd.BAO_CAO_01,
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
            tenPl: bieuMau.tenPl,
            tieuDe: bieuMau.tenDm,
            congVan: Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi),
            path: this.path,
            status: new BtnStatus(),
            isSynthetic: isSynthetic,
            isOffice: this.isOffice,
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
                bieuMau.lyDoTuChoi = res?.lyDoTuChoi;
                bieuMau.thuyetMinh = res?.thuyetMinh;
            }
        });
    }

    async restoreReport(id: string) {
        await this.lapThamDinhService.restoreReport(this.baoCao.id, id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    Object.assign(this.baoCao, data.data);
                    this.baoCao.lstLapThamDinhs.forEach(item => {
                        [item.tenPl, item.tenDm] = Ltd.appendixName(item.maBieuMau, this.baoCao.namBcao);
                    })
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
        await this.lapThamDinhService.addHistory(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    // Object.assign(this.baoCao, data.data);
                    // this.baoCao.lstLapThamDinhs.forEach(item => {
                    //     [item.tenPl, item.tenDm] = Ltd.appendixName(item.maBieuMau, this.baoCao.namBcao);
                    // })
                    // this.getStatusButton();
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
}
