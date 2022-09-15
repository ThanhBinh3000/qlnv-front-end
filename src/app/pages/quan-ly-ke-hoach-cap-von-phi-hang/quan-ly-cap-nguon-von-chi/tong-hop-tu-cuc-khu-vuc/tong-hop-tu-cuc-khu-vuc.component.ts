import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CVNC, displayNumber, DON_VI_TIEN, exchangeMoney, NGUON_BAO_CAO, ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { CAP_VON_NGUON_CHI, MAIN_ROUTE_CAPVON } from '../../quan-ly-ke-hoach-von-phi-hang.constant';

export class ItemData {
    id: string;
    stt: number;
    maCucKv: string;
    kphiDaCapThoc: number;
    ycauCapThemThoc: number;
    tongTienThoc: number;
    idThoc: string;
    kphiDaCapGao: number;
    ycauCapThemGao: number;
    tongTienGao: number;
    idGao: string;
    kphiDaCapMuoi: number;
    ycauCapThemMuoi: number;
    tongTienMuoi: number;
    idMuoi: string;
}
export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-tong-hop-tu-cuc-khu-vuc',
    templateUrl: './tong-hop-tu-cuc-khu-vuc.component.html',
    styleUrls: ['./tong-hop-tu-cuc-khu-vuc.component.scss',
    ],
})
export class TongHopTuCucKhuVucComponent implements OnInit {
    //thong tin dang nhap
    id: string;
    userInfo: any;
    roles: string[] = [];
    loai: string;
    //thong tin chung bao cao
    maDeNghi: string;
    qdChiTieu: string;
    nguonBcao: string = Utils.THOP_TU_CUC_KV;
    congVan: ItemCongVan;
    ngayTao: string;
    ngayTrinh: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    trangThai: string;
    maDviTao: string;
    maDviTien = "1";
    thuyetMinh: string;
    lyDoTuChoi: string;
    newDate = new Date();
    initItem: ItemData = {
        id: null,
        stt: 0,
        maCucKv: "",
        kphiDaCapThoc: null,
        ycauCapThemThoc: null,
        tongTienThoc: null,
        idThoc: null,
        kphiDaCapGao: null,
        ycauCapThemGao: null,
        tongTienGao: null,
        idGao: null,
        kphiDaCapMuoi: null,
        ycauCapThemMuoi: null,
        tongTienMuoi: null,
        idMuoi: null,
    };
    tongSo: ItemData = {
        id: null,
        stt: 0,
        maCucKv: "",
        kphiDaCapThoc: 0,
        ycauCapThemThoc: 0,
        tongTienThoc: 0,
        idThoc: null,
        kphiDaCapGao: 0,
        ycauCapThemGao: 0,
        tongTienGao: 0,
        idGao: null,
        kphiDaCapMuoi: 0,
        ycauCapThemMuoi: 0,
        tongTienMuoi: 0,
        idMuoi: null,
    };
    //danh muc
    lstCtietBcao: ItemData[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_2,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_3,
            tenDm: "Trưởng BP từ chối",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Trưởng BP duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Lãnh đạo phê duyệt",
        },
    ]
    donVis: any[] = [];
    cucKhuVucs: any[] = [];
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
    nguonBcaos: any[] = NGUON_BAO_CAO;
    //trang thai cac nut
    status = false;
    statusBtnDel;
    statusBtnSave = true;                      // trang thai an/hien nut luu
    statusBtnApprove = true;                   // trang thai an/hien nut trinh duyet
    statusBtnTBP = true;                       // trang thai an/hien nut truong bo phan
    statusBtnLD = true;                        // trang thai an/hien nut lanh dao
    statusBtnCopy = true;                      // trang thai copy
    editMoneyUnit = false;
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: string[] = [];

    formatter = value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : null;

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.congVan = {
            fileName: file.name,
            fileSize: null,
            fileUrl: null,
        };
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        private spinner: NgxSpinnerService,
        private routerActive: ActivatedRoute,
        private datePipe: DatePipe,
        private router: Router,
        private userService: UserService,
        private notification: NzNotificationService,
        private location: Location,
        private modal: NzModalService,
        private dataSource: DataService,
    ) { }

    async ngOnInit() {
        //lay id cua ban ghi
        this.loai = this.routerActive.snapshot.paramMap.get('loai');
        this.id = this.routerActive.snapshot.paramMap.get('id');
        //lay thong tin user
        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();
        this.roles = this.userInfo.roles;
        //lay danh sach danh muc
        await this.danhMuc.dMDviCon().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.cucKhuVucs = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            },
        );
        if (!this.id) {
            await this.dataSource.currentData.subscribe(obj => {
                this.qdChiTieu = obj?.qdChiTieu;
                this.maDviTao = obj?.maDvi;
            })
            if (!this.qdChiTieu) {
                this.router.navigate([
                    MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/danh-sach-de-nghi-tu-cuc-khu-cuc'
                ])
            }
            await this.tongHop();
            this.trangThai = '1';
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);

            this.quanLyVonPhiService.maDeNghi().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maDeNghi = res.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            await this.getDetailReport();
        }

        this.getStatusButton();

        this.spinner.hide();

    }

    redirectkehoachvonphi() {
        this.location.back()
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (Utils.statusSave.includes(this.trangThai) && this.roles.includes(CVNC.EDIT_SYNTHETIC_CKV)) {
            this.status = false;
        } else {
            this.status = true;
        }
        const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
        this.statusBtnSave = this.getBtnStatus(Utils.statusSave, CVNC.EDIT_SYNTHETIC_CKV, checkChirld);
        this.statusBtnApprove = this.getBtnStatus(Utils.statusApprove, CVNC.APPROVE_SYNTHETIC_CKV, checkChirld);;
        this.statusBtnTBP = this.getBtnStatus(Utils.statusDuyet, CVNC.DUYET_SYNTHETIC_CKV, checkChirld);;
        this.statusBtnLD = this.getBtnStatus(Utils.statusPheDuyet, CVNC.PHE_DUYET_SYNTHETIC_CKV, checkChirld);;
        this.statusBtnCopy = this.getBtnStatus(Utils.statusCopy, CVNC.COPY_SYNTHETIC_CKV, checkChirld);;
    }

    getBtnStatus(status: string[], role: string, check: boolean) {
        return !(status.includes(this.trangThai) && this.roles.includes(role) && check);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maDeNghi);
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
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.quanLyVonPhiService.ctietDeNghiThop(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.total(-1, this.tongSo);
                    this.maDviTao = data.data.maDvi;
                    this.lstCtietBcao = data.data.thopCucKvCtiets;
                    this.lstCtietBcao.forEach(item => {
                        this.total(1, item);
                    })
                    this.updateListCtietBcao();
                    this.maDeNghi = data.data.maDnghi;
                    this.qdChiTieu = data.data.soQdChiTieu;
                    this.congVan = data.data.congVan;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.trangThai = data.data.trangThai;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.quanLyVonPhiService.trinhDuyetDeNghiTongHop(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThai = mcn;
                    this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.getStatusButton();
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
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
        }
    }

    //show popup tu choi
    tuChoi(mcn: string) {
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
    }


    // luu
    async save() {
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
        const listFile = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }
        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: listFile,
            listIdDeleteFiles: this.listIdFilesDelete,
            thopCucKvCtiets: this.lstCtietBcao,
            maDvi: this.maDviTao,
            maDnghi: this.maDeNghi,
            maDviTien: "1",
            congVan: this.congVan,
            loaiDnghi: this.nguonBcao,
            soQdChiTieu: this.qdChiTieu,
            trangThai: this.trangThai,
            thuyetMinh: this.thuyetMinh,
        }));
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                request.congVan = await this.uploadFile(file);
            }
        }
        if (!request.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        request.thopCucKvCtiets.forEach(item => {
            if (item.id.length == 38) {
                item.id = null;
            }
        })
        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiDnghiThop(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.router.navigate([
                            MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/tong-hop-tu-cuc-khu-vuc/0/' + data.data.id,
                        ])
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.quanLyVonPhiService.capNhatDnghiThop(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
        this.spinner.hide();
    }

    tongHop() {
        const request = {
            maDviCha: this.maDviTao,
            soQdChiTieu: this.qdChiTieu,
        }
        this.quanLyVonPhiService.tongHopCapVonNguonChi(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.lstCtietBcao = data.data;
                    this.lstCtietBcao.forEach(item => {
                        item.id = uuid.v4() + 'FE';
                    })
                    this.lstCtietBcao.forEach(item => {
                        this.total(1, item);
                    })
                    this.cucKhuVucs.forEach(item => {
                        if (this.lstCtietBcao.findIndex(e => e.maCucKv == item.maDvi) == -1) {
                            this.lstCtietBcao.push({
                                ...this.initItem,
                                maCucKv: item.maDvi,
                                id: uuid.v4() + 'FE',
                            })
                        }
                    })
                    this.updateListCtietBcao();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    updateListCtietBcao() {
        this.lstCtietBcao.sort((item1, item2) => {
            if (item1.maCucKv > item2.maCucKv) {
                return 1;
            }
            if (item1.maCucKv < item2.maCucKv) {
                return -1;
            }
            return 0;
        })
        this.lstCtietBcao[0].stt = 1;
        for (let i = 1; i < this.lstCtietBcao.length; i++) {
            if (this.lstCtietBcao[i].maCucKv != this.lstCtietBcao[i - 1].maCucKv) {
                this.lstCtietBcao[i].stt = this.lstCtietBcao[i - 1].stt + 1;
            } else {
                this.lstCtietBcao[i].stt = this.lstCtietBcao[i - 1].stt;
            }
        }
    }

    checkEqual(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id == id);
        if (index == 0) {
            return true;
        } else {
            if (this.lstCtietBcao[index].stt != this.lstCtietBcao[index - 1].stt) {
                return true;
            } else {
                return false;
            }
        }
    }

    total(heSo: number, item: ItemData) {
        this.tongSo.kphiDaCapThoc += heSo * item.kphiDaCapThoc;
        this.tongSo.ycauCapThemThoc += heSo * item.ycauCapThemThoc;
        this.tongSo.tongTienThoc += heSo * item.tongTienThoc;
        this.tongSo.kphiDaCapGao += heSo * item.kphiDaCapGao;
        this.tongSo.ycauCapThemGao += heSo * item.ycauCapThemGao;
        this.tongSo.tongTienGao += heSo * item.tongTienGao;
        this.tongSo.kphiDaCapMuoi += heSo * item.kphiDaCapMuoi;
        this.tongSo.ycauCapThemMuoi += heSo * item.ycauCapThemMuoi;
        this.tongSo.tongTienMuoi += heSo * item.tongTienMuoi;
    }

    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
    }

    async xemChiTiet(id: any) {
        await this.quanLyVonPhiService.ctietDeNghi(id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    let url: string;
                    if (data.data.loaiDn == Utils.HD_TRUNG_THAU) {
                        url = '/' + MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/de-nghi-theo-quyet-dinh-trung-thau/' + id;
                    } else {
                        url = '/' + MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/de-nghi-theo-quyet-dinh-don-gia-mua/' + id;
                    }
                    window.open(url, '_blank');
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    close() {
        if (!this.id) {
            this.location.back();
        }
        this.router.navigate([
            MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/tong-hop/' + this.loai
        ])
    }

    showDialogCopy() {
        const obj = {
            qdChiTieu: this.qdChiTieu,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Đề nghị tổng hợp từ cục khu vực',
            nzContent: DialogDoCopyComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.doCopy(res);
            }
        });
    }

    async doCopy(response: any) {
        let maDeNghiNew: string;
        await this.quanLyVonPhiService.maDeNghi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maDeNghiNew = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        const lstCtietBcaoTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                id: null,
            })
        })
        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            thopCucKvCtiets: lstCtietBcaoTemp,
            maDvi: this.maDviTao,
            maDnghi: maDeNghiNew,
            maDviTien: "1",
            loaiDnghi: this.nguonBcao,
            soQdChiTieu: response.qdChiTieu,
            trangThai: "1",
            thuyetMinh: "",
        }));

        this.spinner.show();
        this.quanLyVonPhiService.themMoiDnghiThop(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    const modalCopy = this.modal.create({
                        nzTitle: MESSAGE.ALERT,
                        nzContent: DialogCopyComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzWidth: '900px',
                        nzFooter: null,
                        nzComponentParams: {
                            maBcao: maDeNghiNew
                        },
                    });
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

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.dviTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }
}
