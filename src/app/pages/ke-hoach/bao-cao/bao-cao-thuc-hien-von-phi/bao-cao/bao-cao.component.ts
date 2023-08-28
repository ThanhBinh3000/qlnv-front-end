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
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form, Report, Vp } from '../bao-cao-thuc-hien-von-phi.constant';
import { BaoCao02Component } from './bao-cao-02/bao-cao-02.component';
import { BaoCao03Component } from './bao-cao-03/bao-cao-03.component';
import { BaoCao04aComponent } from './bao-cao-04a/bao-cao-04a.component';

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
    // lstBieuMaus: any[] = Vp.PHU_LUC;
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
        const modalAppendix = this.modal.create({
            nzTitle: 'Thêm mới công văn',
            nzContent: DialogCongVanComponent,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
                soCv: this.baoCao.congVan?.fileName,
                ngayCv: this.baoCao.ngayCongVan,
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.congVan = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
                this.fileDetail = file;
            }
        });
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
        if (this.status.save) {
            await this.getListUser();
            this.getLuyKe();
            // this.lstBieuMaus.forEach(item => {
            //     item.tenDm = Vp.appendixName(item.id, this.baoCao.maLoaiBcao, this.baoCao.namBcao, this.baoCao.dotBcao)
            // })
        }
        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
        this.spinner.hide();
    }

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
        const checkExport = this.userService.isAccessPermisson(Roles.VP.EXPORT_EXCEL_REPORT);
        const checkNew = isSynthetic ? this.userService.isAccessPermisson(Roles.VP.SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.VP.ADD_REPORT)

        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && checkNew && this.isChild && this.data.preTab == Vp.DANH_SACH_BAO_CAO;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        // this.status.export = (this.baoCao.trangThai == Status.TT_09 || (this.baoCao.trangThai == Status.TT_07 && this.userService.isTongCuc() && this.isChild)) && checkExport && (this.isChild || this.isParent);
        this.status.export = checkExport && (this.isChild || this.isParent);
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
        await this.baoCaoThucHienVonPhiService.baoCaoChiTiet(this.baoCao.id).toPromise().then(async data => {
            if (data.statusCode == 0) {
                this.baoCao = data.data;
                this.baoCao?.lstBcaos?.forEach(item => {
                    const app = Vp.PHU_LUC.find(e => e.id == item.maLoai);
                    item.tenPhuLuc = app?.tenPl;
                    item.tieuDe = Vp.appendixName(item.maLoai, this.baoCao.maLoaiBcao, this.baoCao.namBcao, this.baoCao.dotBcao);
                })
                this.baoCao.listIdDeleteFiles = [];
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

        baoCaoTemp.maPhanBcao = '1';

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
        let danhSach = [];
        Vp.PHU_LUC.forEach(item => {
            danhSach.push({
                ...item,
                status: false,
            })
        })
        danhSach = danhSach.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.id) == -1);

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
                            tieuDe: Vp.appendixName(item.id, this.baoCao.maLoaiBcao, this.baoCao.namBcao, this.baoCao.dotBcao),
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
            dotBcao: this.baoCao.dotBcao,
            path: this.path,
            status: new BtnStatus(),
            maLoai: bieuMau.maLoai,
            tenPl: bieuMau.tenPhuLuc,
            tieuDe: bieuMau.tieuDe,
            congVan: Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi),
            luyKes: this.luyKes.find(e => e.maLoai == bieuMau.maLoai),
            isOffice: this.isOffice,
            isSynth: this.baoCao.lstBcaoDviTrucThuocs.length > 0,
        }
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.save = dataInfo.status.save && (this.userInfo?.sub == bieuMau.nguoiBcao);
        dataInfo.status.finish = dataInfo.status.finish && (this.userInfo?.sub == bieuMau.nguoiBcao);
        dataInfo.status.ok = dataInfo.status.ok && (this.userInfo?.sub == bieuMau.nguoiBcao);

        let nzContent: ComponentType<any>;
        switch (bieuMau.maLoai) {
            //phu luc
            case Vp.BM_02:
                nzContent = BaoCao02Component;
                break;
            case Vp.BM_03:
                nzContent = BaoCao03Component;
                break;
            default:
                nzContent = BaoCao04aComponent;
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
        this.spinner.show();
        await this.baoCaoThucHienVonPhiService.restoreReport(this.baoCao.id, id).toPromise().then(
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
        this.spinner.hide();
    }

    async newReport() {
        await this.baoCaoThucHienVonPhiService.addHistory(this.baoCao.id).toPromise().then(
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
