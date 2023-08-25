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
        const modalAppendix = this.modal.create({
            nzTitle: 'Thêm mới công văn',
            nzContent: DialogCongVanComponent,
            nzClosable: false,
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
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
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
        const isOffice = this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1;
        if (this.userInfo?.DON_VI?.tenVietTat == 'CCNTT') {
            this.lstPhuLuc = this.lstPhuLuc.filter(e => e.id != Dtc.PHU_LUC_III);
        } else if (this.userService.isChiCuc() && !isOffice) {
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
        }

        this.getStatusButton()
        if (this.status.save) {
            await this.getListUser();
            this.getLuyKe();
        }
        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
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
        const isSynth = this.baoCao.lstBcaoDviTrucThuocs?.length != 0;
        this.isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;
        //kiem tra quyen cua cac user
        const checkSave = isSynth ? this.userService.isAccessPermisson(Roles.DTC.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.EDIT_REPORT);
        const checkSunmit = isSynth ? this.userService.isAccessPermisson(Roles.DTC.SUBMIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.SUBMIT_REPORT);
        const checkPass = isSynth ? this.userService.isAccessPermisson(Roles.DTC.PASS_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.PASS_REPORT);
        const checkApprove = isSynth ? this.userService.isAccessPermisson(Roles.DTC.APPROVE_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.APPROVE_REPORT);
        const checkAccept = this.userService.isAccessPermisson(Roles.DTC.ACCEPT_REPORT);
        const checkExcel = isSynth ? this.userService.isAccessPermisson(Roles.DTC.EXPORT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.EXPORT_REPORT);
        const checkNew = isSynth ? this.userService.isAccessPermisson(Roles.DTC.SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.ADD_REPORT)

        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && checkNew && this.isChild && this.data.preTab == Dtc.DANH_SACH_BAO_CAO;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        // this.status.export = (this.baoCao.trangThai == Status.TT_09 || (this.baoCao.trangThai == Status.TT_07 && this.userService.isTongCuc() && this.isChild)) && checkExcel && (this.isChild || this.isParent);
        this.status.export = checkExcel && (this.isChild || this.isParent);

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
        await this.quanLyVonPhiService.downFile(file, doc);
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
                    this.baoCao.listIdDeleteFiles = [];
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
                    this.notification.success(MESSAGE.SUCCESS, mcn == Status.TT_02 ? MESSAGE.SUBMIT_SUCCESS : MESSAGE.APPROVE_SUCCESS);
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
        if (!baoCaoTemp.congVan?.fileUrl) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstBcaos.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        baoCaoTemp.maPhanBcao = '0';

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
            baoCaoId: this.baoCao.id,
            maBcao: this.baoCao.maBcao,
            maDvi: this.baoCao.maDvi,
            namBcao: this.baoCao.namBcao,
            path: this.path,
            status: new BtnStatus(),
            tieuDe: bieuMau.tieuDe,
            tenPl: bieuMau.tenPhuLuc,
            congVan: Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi),
            luyKes: this.luyKes.find(e => e.maLoai == bieuMau.maLoai),
        }
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.save = dataInfo.status.save && (this.userInfo?.sub == bieuMau.nguoiBcao);
        dataInfo.status.finish = dataInfo.status.finish && (this.userInfo?.sub == bieuMau.nguoiBcao);
        dataInfo.status.ok = dataInfo.status.ok && (this.userInfo?.sub == bieuMau.nguoiBcao);

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
                bieuMau.lyDoTuChoi = res?.lyDoTuChoi;
                bieuMau.thuyetMinh = res?.thuyetMinh;
            }
        });
    }

    async restoreReport(id: string) {
        await this.baoCaoThucHienDuToanChiService.restoreReport(this.baoCao.id, id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.action('detail');
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
        await this.baoCaoThucHienDuToanChiService.addHistory(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, 'Tạo mới thành công.');
                    this.back();
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
