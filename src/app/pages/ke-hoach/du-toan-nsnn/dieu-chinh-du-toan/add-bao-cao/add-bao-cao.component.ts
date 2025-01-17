import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
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
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Dcdt, Doc, Form, Report } from '../dieu-chinh-du-toan.constant';
import { PhuLuc1Component } from './phu-luc-1/phu-luc-1.component';
import { PhuLuc10Component } from './phu-luc-10/phu-luc-10.component';
import { PhuLuc11Component } from './phu-luc-11/phu-luc-11.component';
import { PhuLuc12Component } from './phu-luc-12/phu-luc-12.component';
import { PhuLuc13Component } from './phu-luc-13/phu-luc-13.component';
import { PhuLuc2Component } from './phu-luc-2/phu-luc-2.component';
import { PhuLuc3Component } from './phu-luc-3/phu-luc-3.component';
import { PhuLuc4Component } from './phu-luc-4/phu-luc-4.component';
import { PhuLuc5Component } from './phu-luc-5/phu-luc-5.component';
import { PhuLuc6Component } from './phu-luc-6/phu-luc-6.component';
import { PhuLuc7Component } from './phu-luc-7/phu-luc-7.component';
import { PhuLuc8Component } from './phu-luc-8/phu-luc-8.component';
import { PhuLuc9Component } from './phu-luc-9/phu-luc-9.component';
import { PhuLucTongHopComponent } from './phu-luc-tong-hop/phu-luc-tong-hop.component';

@Component({
    selector: 'app-add-bao-cao',
    templateUrl: './add-bao-cao.component.html',
    styleUrls: ['./add-bao-cao.component.scss']
})
export class AddBaoCaoComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    //danh muc
    listAppendix: any[] = Dcdt.PHU_LUC;
    tabs: any[] = [];
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
    //phan tab
    tabSelected: string;
    selectedIndex = 0;
    //truyen du lieu sang tab con
    tabData: any;
    isLink: boolean;
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
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private dieuChinhDuToanService: DieuChinhService,
    ) { }

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
        this.spinner.hide();
    };

    async initialization() {
        //lay thong tin chung bao cao
        this.baoCao.id = this.data?.id;
        this.userInfo = await this.userService.getUserLogin();
        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao = this.data.baoCao;
        }
        const isSynthetic = this.baoCao.lstDviTrucThuoc && this.baoCao.lstDviTrucThuoc.length != 0;
        if (this.userInfo.CAP_DVI == "1" && isSynthetic == true) {
            this.listAppendix = Dcdt.PHU_LUC_TH
        } else {
            this.listAppendix = Dcdt.PHU_LUC
        }
        this.getStatusButton();
        if (this.status.general) {
            await this.getListUser();
            this.listAppendix = []

            if (this.userInfo.CAP_DVI == "1" && isSynthetic == true) {
                Dcdt.PHU_LUC_TH.forEach(e => {
                    this.listAppendix.push({
                        ...e,
                        tenDm: Utils.getName(this.baoCao.namBcao, e.tenDm),
                    })
                })
            } else {
                Dcdt.PHU_LUC.forEach(e => {
                    this.listAppendix.push({
                        ...e,
                        tenDm: Utils.getName(this.baoCao.namBcao, e.tenDm),
                    })
                })
            }



            this.baoCao?.lstDchinh.forEach(item => {

                const appendix = this.listAppendix.find(e => e.id == item.maLoai);
                item.tenPl = appendix.tenPl;
                item.tenDm = Utils.getName(this.baoCao.namBcao, appendix.tenDm);
                if (item.tenPl == "Phụ lục I") {
                    const tenDm1 = item.tenDm.split('');
                    tenDm1.splice(Number(item.tenDm.indexOf("đợt ")) - 9, 0, `${this.baoCao.dotBcao}`);
                    item.tenDm = tenDm1.join('');
                }
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
        const isSynthetic = this.baoCao.lstDviTrucThuoc && this.baoCao.lstDviTrucThuoc.length != 0;
        this.isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        this.isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.APPROVE_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.DUYET_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.PHE_DUYET_REPORT);
        const checkAccept = this.userService.isAccessPermisson(Roles.DCDT.TIEP_NHAN_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.PRINT_REPORT);
        const checkExport = isSynthetic ? this.userService.isAccessPermisson(Roles.DCDT.EXPORT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(Roles.DCDT.EXPORT_REPORT)

        this.status.general = Status.check('saveWHist', this.baoCao.trangThai) && checkSave;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.DCDT.ADD_REPORT) && this.isChild && this.data.preTab == Dcdt.DANH_SACH_BAO_CAO;
        this.status.viewAppVal = Status.check('appraisal', this.baoCao.trangThai) && this.userInfo.CAP_DVI == "1";
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        this.status.export = checkExport && (this.isChild || this.isParent);
        this.status.ok = this.status.accept || this.status.approve || this.status.pass
        this.status.finish = this.status.general;
        this.status.editAppVal = this.status.accept;
    }


    async getDetailReport() {
        await this.dieuChinhDuToanService.bCDieuChinhDuToanChiTiet(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    if (this.baoCao.lstDviTrucThuoc.length == 0) {
                        this.listAppendix = Dcdt.PHU_LUC
                    } else {
                        const isPL = this.baoCao?.lstDchinh.find(item => item.maLoai == "pl01")
                        if (this.userInfo.CAP_DVI == "2" || isPL) {
                            this.listAppendix = Dcdt.PHU_LUC
                        } else {
                            this.listAppendix = Dcdt.PHU_LUC_TH
                        }
                    }
                    this.baoCao?.lstDchinh.forEach(item => {
                        const appendix = this.listAppendix.find(e => e.id == item.maLoai);
                        item.tenPl = appendix.tenPl;
                        item.tenDm = Utils.getName(this.baoCao.namBcao, appendix.tenDm);
                        if (item.tenPl == "Phụ lục I") {
                            const tenDm1 = item.tenDm.split('');
                            tenDm1.splice(Number(item.tenDm.indexOf("đợt")) - 9, 0, `${this.baoCao.dotBcao}`);
                            item.tenDm = tenDm1.join('');
                        }
                    })
                    const lstLink = this.baoCao.lstDchinh.filter(e => e.maLoai !== "pl01TH")
                    this.isLink = lstLink.every(e => e.trangThai == "1")
                    this.listFile = [];
                    this.baoCao.listIdFiles = [];
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
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

    async save() {
        //kiem tra cac bao cao da duoc giao xuong chua
        if (!this.baoCao.lstDchinh.every(e => e.giaoCho)) {
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
        this.baoCao.lstDviTrucThuoc.forEach(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })

        if (!baoCaoTemp.fileDinhKems) {
            baoCaoTemp.fileDinhKems = [];
        }
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.baoCao.lstFiles.find(e => e.id == id)?.noiDung;
            baoCaoTemp.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.path, noiDung));
        }
        baoCaoTemp.fileDinhKems = baoCaoTemp.fileDinhKems.concat(this.baoCao.lstFiles.filter(e => typeof e.id == 'number'))
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = {
                    ...await this.quanLyVonPhiService.upFile(file, this.path),
                    fileName: this.baoCao?.congVan?.fileName,
                }
            }
            this.fileDetail = null;
        }

        // if (!baoCaoTemp.congVan || !baoCaoTemp.congVan?.fileUrl) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //     return;
        // }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstDchinh.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        //call service them moi
        if (!this.baoCao.id) {
            this.dieuChinhDuToanService.trinhDuyetDieuChinhService(baoCaoTemp).toPromise().then(
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
            this.dieuChinhDuToanService.updateDieuChinh(baoCaoTemp).toPromise().then(
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
    };

    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: this.data.tabSelected == Dcdt.BAO_CAO_01 ? Dcdt.BAO_CAO_02 : Dcdt.BAO_CAO_01,
        }
        this.dataChange.emit(obj);
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (mcn == Status.TT_02) {
            if (!this.baoCao.congVan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
                return;
            }
            if (!this.baoCao.lstDchinh.every(e => e.trangThai == Status.COMPLETE)) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            if (mcn == Status.TT_04 || mcn == Status.TT_07 || mcn == Status.TT_09) {
                if (this.baoCao.lstDchinh.some(e => e.trangThai == Status.NOT_RATE)) {
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
        await this.dieuChinhDuToanService.approveDieuChinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.baoCao.ngayTraKq = data.data.ngayTraKq;
                this.getStatusButton();
                if (mcn == Status.TT_02) {
                    this.notification.success(MESSAGE.SUCCESS, mcn == Status.TT_02 ? MESSAGE.SUBMIT_SUCCESS : MESSAGE.APPROVE_SUCCESS);
                } else if (mcn == Status.TT_07) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
                } else if (mcn == Status.TT_09) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRANG_THAI_TIEP_NHAN);
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

    getIndex(maBieuMau: string) {
        let header = '';
        if (maBieuMau.startsWith('pl')) {
            header = 'pl';
        };
        let index = 0;
        for (let i = 0; i < this.baoCao.lstDchinh.length; i++) {
            if (this.baoCao.lstDchinh[i].maLoai.startsWith(header)) {
                index += 1;
            }
            if (this.baoCao.lstDchinh[i].maLoai == maBieuMau) {
                break;
            }
        }
        return index;
    };

    // getStatusAppendixName(id) {
    //     return TRANG_THAI_PHU_LUC.find(item => item.id == id)?.ten
    // };

    viewAppendix(id: string) {
        const isSynthetic = this.baoCao.lstDviTrucThuoc && this.baoCao.lstDviTrucThuoc.length != 0;
        const bieuMau = this.baoCao.lstDchinh.find(e => e.id == id);
        const dataInfo = {
            id: id,
            maBieuMau: bieuMau.maLoai,
            maBcao: this.baoCao.maBcao,
            maDvi: this.baoCao.maDvi,
            capDvi: this.userInfo.capDvi,
            tenDvi: this.userInfo.TEN_DVI,
            namBcao: this.baoCao.namBcao,
            tenPl: bieuMau.tenPl,
            tieuDe: bieuMau.tenDm,
            congVan: this.baoCao.congVan?.fileName ? Utils.getDocName(this.baoCao.congVan.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi) : '',
            path: this.path,
            status: new BtnStatus(),
            isSynthetic: isSynthetic,
            isLinkDuLieu: this.isLink,
            trangThai: this.baoCao.trangThai,
        }
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.general = dataInfo.status.general && (this.userInfo?.sub == bieuMau.giaoCho);
        dataInfo.status.finish = dataInfo.status.finish && (this.userInfo?.sub == bieuMau.giaoCho);

        let nzContent: ComponentType<any>;
        switch (bieuMau.maLoai) {
            case 'pl01':
                nzContent = PhuLuc1Component;
                break;
            case 'pl02':
                nzContent = PhuLuc2Component;
                break;
            case 'pl03':
                nzContent = PhuLuc3Component;
                break;
            case 'pl04':
                nzContent = PhuLuc4Component;
                break;
            case 'pl05':
                nzContent = PhuLuc5Component;
                break;
            case 'pl06':
                nzContent = PhuLuc6Component;
                break;
            case 'pl07':
                nzContent = PhuLuc7Component;
                break;
            case 'pl08':
                nzContent = PhuLuc8Component;
                break;
            case 'pl09':
                nzContent = PhuLuc9Component;
                break;
            case 'pl10':
                nzContent = PhuLuc10Component;
                break;
            case 'pl11':
                nzContent = PhuLuc11Component;
                break;
            case 'pl12':
                nzContent = PhuLuc12Component;
                break;
            case 'pl13':
                nzContent = PhuLuc13Component;
                break;
            case 'pl01TH':
                nzContent = PhuLucTongHopComponent;
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
    };

    // xoa bieu mau
    deleteAppendix(id: string) {
        this.baoCao.lstDchinh = this.baoCao.lstDchinh.filter(item => item.id != id);
    };

    addAppendix() {
        let danhMuc = [];
        let danhSach = [];
        let title = '';
        switch (this.selectedIndex) {
            case 0:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('pl'));
                danhSach = danhMuc.filter(item => this.baoCao.lstDchinh.findIndex(e => e.maLoai == item.id) == -1);
                title = 'Danh sách phụ lục';
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
                            maLoai: item.id,
                            tenPl: item.tenPl,
                            tenDm: item.tenDm,
                            trangThai: '3',
                            lstCtietDchinh: [],
                        }
                        this.baoCao.lstDchinh.push(newItem);
                    }
                })
            }
        });
    }

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdFiles.push(id);
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

    async restoreReport(id: string) {
        await this.dieuChinhDuToanService.restoreReport(this.baoCao.id, id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    // Object.assign(this.baoCao, data.data);
                    // this.baoCao.lstDchinh.forEach(item => {
                    //     const appendix = this.listAppendix.find(e => e.id == item.maLoai);
                    //     item.tenPl = appendix.tenPl;
                    //     item.tenDm = Utils.getName(this.baoCao.namBcao, appendix.tenDm);
                    // })
                    // this.getStatusButton();
                    // this.notification.success(MESSAGE.SUCCESS, 'Khôi phục thành công.');
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
        await this.dieuChinhDuToanService.addHistory(this.baoCao.id).toPromise().then(
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
    };

    isDelAppendix(maBieuMau: string) {
        return this.status.general && (this.userInfo?.sub == this.baoCao.nguoiTao) && this.listAppendix.find(e => e.id == maBieuMau).isDel;
    }

}
