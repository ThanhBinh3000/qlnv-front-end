import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import {
    DialogChonThemBieuMauComponent
} from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form, Gdt, Report } from '../giao-du-toan.constant';
import { PHU_LUC } from './add-bao-cao.constant';
import { PhuLuc01NhapComponent } from './phu-luc-01-nhap/phu-luc-01-nhap.component';
import { PhuLuc01XuatComponent } from './phu-luc-01-xuat/phu-luc-01-xuat.component';
import { PhuLuc02Component } from './phu-luc-02/phu-luc-02.component';
import { PhuLuc03Component } from './phu-luc-03/phu-luc-03.component';
import { PhuLucDaoTaoComponent } from './phu-luc-dao-tao/phu-luc-dao-tao.component';
import { PhuLucKhoaHocCongNgheComponent } from './phu-luc-khoa-hoc-cong-nghe/phu-luc-khoa-hoc-cong-nghe.component';
import { PhuLucPhanBoComponent } from './phu-luc-phan-bo/phu-luc-phan-bo.component';
import { PhuLucQuyLuongComponent } from './phu-luc-quy-luong/phu-luc-quy-luong.component';
import { PhuLucSuaChuaComponent } from './phu-luc-sua-chua/phu-luc-sua-chua.component';
import { PhuLucTaiSanComponent } from './phu-luc-tai-san/phu-luc-tai-san.component';

@Component({
    selector: 'app-add-bao-cao',
    templateUrl: './add-bao-cao.component.html',
    styleUrls: ['./add-bao-cao.component.scss']
})
export class AddBaoCaoComponent implements OnInit {
    @Input() data
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;

    userInfo: any;
    canBos: any[];
    isDataAvailable = false;
    saveStatus = true;                          // trang thai an/hien nut luu
    submitStatus = true;                        // trang thai an/hien nut trinh duyet
    passStatus = true;                          // trang thai an/hien nut truong bo phan
    approveStatus = true;                       // trang thai an/hien nut lanh dao
    acceptStatus = true;                        // trang thai nut don vi cap tren
    copyStatus = true;                          // trang thai copy
    printStatus = true;                         // trang thai print
    okStatus = true;                            // trang thai ok/ not ok
    finishStatus = true;                        // trang thai hoan tat nhap lieu
    viewAppraisalValue = true;
    path: string;
    isOffice: boolean;
    // thong tin chi tiet bao cao
    baoCao: Report = new Report();
    listAppendix: any[] = PHU_LUC;

    fileDetail: NzUploadFile;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    childUnit: any[] = [];
    selectedIndex = 0;

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
                soCv: this.baoCao.soQd?.fileName,
                ngayCv: this.baoCao.ngayCongVan,
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.soQd = {
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
        public globals: Globals,
        private spinner: NgxSpinnerService,
        private modal: NzModalService,
        private userService: UserService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
    ) {
    }

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
        this.spinner.hide();
    };


    async initialization() {
        //lay thong tin chung bao cao
        this.baoCao.id = this.data?.id;
        this.baoCao.trangThai = this.data?.trangThai;
        this.userInfo = await this.userService.getUserLogin();
        this.getListUser();

        this.isOffice = this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1;
        //lay danh sach danh muc don vi
        this.baoCao.maDvi = this.data?.maDvi ? this.data?.maDvi : this.userInfo?.MA_DVI;
        await this.getChildUnit();
        await this.getListUser();

        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao.namBcao = this.data.namBcao;
            this.baoCao.maPa = this.data?.maPa;
            this.baoCao.maPaCha = this.data?.maPaCha;
            this.baoCao.maDvi = this.data?.maDvi ? this.data?.maDvi : this.userInfo?.MA_DVI;
            this.baoCao.maBcao = this.data?.maBcao

            this.path = this.data?.maDvi + '/' + this.baoCao.maBcao;
            if (this.data.preTab == "tongHopBaoCaoCapDuoi") {
                this.baoCao.lstCtiets = this.data?.lstCtiets ? this.data?.lstCtiets : [];
                this.baoCao.maPaCha = this.data?.maPaCha;
            }
            let lstCtietsPhuLucPhanBo
            if (this.data.preTab == "chiTietDuToanCapTren") {
                this.baoCao.lstCtiets = [];
                lstCtietsPhuLucPhanBo = this.data?.lstCtiets;
            }
            if (this.data?.lstGiaoDtoanTrucThuocs) {
                this.baoCao.lstGiaoDtoanTrucThuocs = this.data?.lstGiaoDtoanTrucThuocs;
                this.baoCao.trangThai = "1";
                this.baoCao.nguoiTao = this.userInfo?.sub;
                this.baoCao.ngayTao = new Date();
                this.baoCao.namPa = this.data?.namPa;
                this.baoCao.namDtoan = this.data?.namDtoan;
                this.baoCao.tongHopTuIds = [];
                this.baoCao.lstFiles = [];
                this.baoCao.listIdFiles = [];
            } else {
                this.baoCao.lstGiaoDtoanTrucThuocs = this.data?.lstDviTrucThuoc ? this.data?.lstDviTrucThuoc : [];
                this.baoCao.trangThai = "1";
                this.baoCao.nguoiTao = this.userInfo?.sub;
                this.baoCao.ngayTao = new Date();
                this.baoCao.namPa = this.data?.namPa;
                this.baoCao.namDtoan = this.data?.namDtoan;
                this.baoCao.tongHopTuIds = [];
                this.baoCao.lstFiles = [];
                this.baoCao.listIdFiles = [];
            }
            if (this.baoCao.lstGiaoDtoanTrucThuocs?.length == 0) {
                this.listAppendix.forEach(item => {
                    this.baoCao.lstCtiets.push({
                        ...new Form(),
                        id: uuid.v4() + 'FE',
                        maBieuMau: item.id,
                        tenPl: item.tenPl,
                        tenDm: item.tenDm + " năm " + this.baoCao.namBcao,
                        trangThai: '3',
                        lstCtietBcaos: [],
                        nguoiBcao: this.userInfo?.sub
                    })
                })
            } else {
                this.baoCao?.lstGiaoDtoanTrucThuocs.forEach(item => {
                    if (item.ngayDuyet.includes("/")) {
                        item.ngayDuyet = item.ngayDuyet;
                        item.ngayPheDuyet = item.ngayPheDuyet;
                    } else {
                        item.ngayDuyet = item.ngayDuyet;
                        item.ngayPheDuyet = item.ngayPheDuyet;
                    }
                })
                this.baoCao.lstCtiets.forEach(item => {
                    item.trangThai = "3"
                    item.maDviTien = "1"
                    const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                    item.tenPl = pl.tenPl;
                    item.tenDm = pl.tenDm + " năm " + this.baoCao.namBcao;
                    item.nguoiBcao = this.userInfo?.sub
                    item.maBieuMau = pl.id
                    item.lstCtietBcaos.forEach(s => {
                        s.id = null
                    })
                })
            }
        }

        this.getStatusButton();
        this.spinner.hide();
    };


    addAppendix() {
        let danhMuc = [];
        let danhSach = [];
        let title = '';
        switch (this.selectedIndex) {
            case 0:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('pl'));
                danhSach = danhMuc.filter(item => this.baoCao.lstCtiets.findIndex(e => e.maBieuMau == item.id) == -1);
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
                            ...new Form(),
                            id: uuid.v4() + 'FE',
                            maBieuMau: item.id,
                            tenPl: item.tenPl,
                            tenDm: item.tenDm,
                            trangThai: '3',
                            lstCtietBcaos: [],
                        }
                        this.baoCao.lstCtiets.push(newItem);
                    }
                })
            }
        });
    }

    getIndex(maBieuMau: string) {
        let header = '';
        if (maBieuMau.startsWith('pl')) {
            header = 'pl';
        }
        ;
        let index = 0;
        for (let i = 0; i < this.baoCao.lstCtiets.length; i++) {
            if (this.baoCao.lstCtiets[i].maBieuMau.startsWith(header)) {
                index += 1;
            }
            if (this.baoCao.lstCtiets[i].maBieuMau == maBieuMau) {
                break;
            }
        }
        return index;
    };

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
    };

    viewAppendix(id: string) {
        const isSynthetic = this.baoCao.lstGiaoDtoanTrucThuocs && this.baoCao.lstGiaoDtoanTrucThuocs.length != 0;
        const bieuMau = this.baoCao.lstCtiets.find(e => e.id == id);
        const dataInfo = {
            id: id,
            maBieuMau: bieuMau.maBieuMau,
            maBcao: this.baoCao.maBcao,
            maDvi: this.baoCao.maDvi,
            capDvi: this.userInfo.CAP_DVI,
            tenDvi: this.userInfo.TEN_DVI,
            namBcao: this.baoCao.namBcao,
            tenPl: bieuMau.tenPl,
            tieuDe: bieuMau.tenDm,
            congVan: Utils.getDocName(this.baoCao.soQd.fileName, this.baoCao.ngayCongVan, this.baoCao.tenDvi),
            path: this.path,
            status: new BtnStatus(),
            isSynthetic: isSynthetic,
            isOffice: this.isOffice,
            listFile: this.listFile
        };
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.general = dataInfo.status.general && (this.userInfo?.sub == bieuMau.nguoiBcao);
        dataInfo.status.finish = dataInfo.status.finish && (this.userInfo?.sub == bieuMau.nguoiBcao);
        let nzContent: ComponentType<any>;
        switch (bieuMau.maBieuMau) {
            case 'pl01N':
                nzContent = PhuLuc01NhapComponent;
                break;
            case 'pl01X':
                nzContent = PhuLuc01XuatComponent;
                break;
            case 'pl02':
                nzContent = PhuLuc02Component;
                break;
            case 'pl03':
                nzContent = PhuLuc03Component;
                break;
            case 'pl04':
                nzContent = PhuLucSuaChuaComponent;
                break;
            case 'pl05':
                nzContent = PhuLucTaiSanComponent;
                break;
            case 'pl06':
                nzContent = PhuLucQuyLuongComponent;
                break;
            case 'pl07':
                nzContent = PhuLucDaoTaoComponent;
                break;
            case 'pl08':
                nzContent = PhuLucKhoaHocCongNgheComponent;
                break;
            case 'pl09':
                nzContent = PhuLucPhanBoComponent;
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
                //gan lai thong tin sau khi bieu mau duoc luu
                bieuMau.trangThai = res?.trangThai;
            }
        });
    }

    deleteAppendix(id: string) {
        this.baoCao.lstCtiets = this.baoCao.lstCtiets.filter(item => item.id != id);
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (mcn == Status.TT_02) {
            if (!this.baoCao.soQd) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
                return;
            }
            if (!this.baoCao.lstCtiets.every(e => e.trangThai == Status.COMPLETE)) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            if (mcn == Status.TT_04 || mcn == Status.TT_07 || mcn == Status.TT_09) {
                if (this.baoCao.lstCtiets.some(e => e.trangThai == Status.NOT_RATE)) {
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
        await this.giaoDuToanChiService.approveBcao(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTao = data.data.ngayTao;
                this.baoCao.ngayTrinh = data.data.ngayTrinh;
                this.baoCao.ngayDuyet = data.data.ngayDuyet;
                this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
                this.baoCao.ngayTraKq = data.data.ngayTraKq;
                this.getStatusButton();
                if (Status.check('reject', mcn)) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    if (mcn == Status.TT_02) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUBMIT_SUCCESS);
                    } else if (mcn == Status.TT_04) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    } else if (mcn == Status.TT_07) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
                    } else if (mcn == Status.TT_09) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.TRANG_THAI_TIEP_NHAN);
                    }
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
    };

    // Xác nhận trình duyệt
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
    };

    // Lưu
    async save() {
        if (!this.baoCao.lstCtiets.every(e => e.nguoiBcao)) {
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
        this.baoCao.lstGiaoDtoanTrucThuocs.forEach(item => {
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
                baoCaoTemp.soQd = {
                    ...await this.quanLyVonPhiService.upFile(file, this.path),
                    fileName: this.baoCao?.soQd?.fileName,
                }
            }
        }
        // if (this.userInfo.DON_VI.CAP_DVI !== "2") {
        //     if (!baoCaoTemp.soQd?.fileUrl) {
        //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        //         return;
        //     }
        // }
        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstCtiets.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })


        //call service them moi
        if (!this.baoCao.id) {
            this.giaoDuToanChiService.taoMoiBaoCao(baoCaoTemp).toPromise().then(
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
            this.giaoDuToanChiService.updateBaoCaoGiaoDuToan(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        if (this.data?.idSoTranChi) {
                            this.data.idSoTranChi = null;
                        }
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                })
        }
    };


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


    async getDetailReport() {
        await this.giaoDuToanChiService.chiTietBaoCao(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao.lstCtiets.forEach(item => {
                        const appendix = this.listAppendix.find(e => e.id == item.maBieuMau);
                        item.tenPl = appendix.tenPl;
                        item.tenDm = appendix.tenDm + " năm " + this.baoCao.namPa;
                    })
                    this.baoCao.ngayTao = this.baoCao.ngayTao;
                    this.baoCao.ngayTrinh = this.baoCao.ngayTrinh;
                    this.baoCao.ngayDuyet = this.baoCao.ngayDuyet;
                    this.baoCao.ngayPheDuyet = this.baoCao.ngayPheDuyet;
                    this.baoCao.ngayTraKq = this.baoCao.ngayTraKq;
                    if (this.baoCao?.lstGiaoDtoanTrucThuocs) {
                        this.baoCao?.lstGiaoDtoanTrucThuocs.forEach(item => {
                            item.ngayDuyet = item.ngayDuyet;
                            item.ngayPheDuyet = item.ngayPheDuyet;
                        })
                    }
                    this.path = this.baoCao?.maDvi + '/' + this.baoCao.maBcao;
                    this.listFile = [];
                    this.baoCao.listIdFiles = [];
                    this.baoCao.lstCtiets.forEach(item => {
                        const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                        item.tenDm = pl.tenDm + " năm " + this.baoCao.namBcao;
                    })
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

    back() {
        if (this.data?.preData) {
            this.dataChange.emit(this.data?.preData)
        } else {
            let id = localStorage.getItem("idChiTiet");
            const obj = {
                id: id,
                tabSelected: this.data?.preTab,
                preData: this.data,
            }
            this.dataChange.emit(obj);
            localStorage.removeItem("idChiTiet");
        }
    }

    statusDeleteCv() {
        if (!this.userService.isAccessPermisson(Roles.GSTC.SUA_BC_TONGHOP)) {
            return false;
        }
        if (!this.baoCao.soQd?.fileName) {
            return false;
        }
        let check = true;
        if (this.data?.lstDviTrucThuocs && this.data?.lstDviTrucThuocs.length > 0) {
            this.data.lstDviTrucThuocs.forEach(item => {
                if (item.trangThai == '1') {
                    check = true;
                    return;
                }
            })
        }
        return check;
    };

    //download file về máy tính
    async downloadFile(id: string) {
        let file: any;
        let doc: any;
        if (!id) {
            file = this.fileDetail;
            doc = this.baoCao.soQd
        } else {
            file = this.listFile.find(element => element?.lastModified.toString() == id);
            doc = this.baoCao.lstFiles.find(element => element?.id == id);
        }
        await this.quanLyVonPhiService.downFile(file, doc);
    }

    isChild: boolean;
    isParent: boolean;
    status: BtnStatus = new BtnStatus();

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isSynthetic = this.baoCao.lstGiaoDtoanTrucThuocs && this.baoCao.lstGiaoDtoanTrucThuocs.length != 0;
        this.isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        this.isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.SUA_BC_TONGHOP) : this.userService.isAccessPermisson(Roles.GSTC.SUA_BC);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.TRINHDUYET_BC_TONGHOP) : this.userService.isAccessPermisson(Roles.GSTC.TRINHDUYET_BC);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.DUYET_TUCHOI_BC_TH) : this.userService.isAccessPermisson(Roles.GSTC.DUYET_TUCHOI_BC);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.PHEDUYET_TUCHOI_BC_TH) : this.userService.isAccessPermisson(Roles.GSTC.PHEDUYET_TUCHOI_BC);
        const checkAccept = this.userService.isAccessPermisson(Roles.GSTC.TIEPNHAN_TUCHOI_BC);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.IN_BC_TONGHOP) : this.userService.isAccessPermisson(Roles.GSTC.IN_BC);
        const checkExport = isSynthetic ? this.userService.isAccessPermisson(Roles.GSTC.XUAT_BC_TONGHOP) : this.userService.isAccessPermisson(Roles.GSTC.XUAT_BC);

        this.status.general = Status.check('saveWHist', this.baoCao.trangThai) && checkSave;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.GSTC.LAP_BC) && this.isChild && this.data.preTab == Gdt.DANH_SACH_BAO_CAO;
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        this.status.export = checkExport && (this.isChild || this.isParent);
        this.status.ok = this.status.accept || this.status.approve || this.status.pass
        this.status.finish = this.status.general;
    }

    async getChildUnit() {
        const request = {
            maDviCha: this.baoCao.maDvi,
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


    deleteQdCv() {
        this.baoCao.soQd.fileName = null;
        this.baoCao.soQd.fileSize = null;
        this.baoCao.soQd.fileUrl = null;
        const request = JSON.parse(JSON.stringify(
            {
                id: null,
                namDtoan: this.baoCao.namBcao,
                maPa: this.baoCao.maBcao,
                soQd: this.baoCao.soQd,
                maGiao: this.baoCao.maGiao,
            }
        ))

        this.giaoDuToanChiService.themMoiQdCvGiaoNSNN(request).toPromise().then(async data => {
            if (data.statusCode == 0) {
                this.notification.success(MESSAGE.SUCCESS, 'Xóa thành công');
                this.getStatusButton();
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        })
    };

    // download file công văn
    async downloadFileCv() {
        if (this.baoCao.soQd?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.baoCao.soQd?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.baoCao.soQd?.fileName);
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


    getUnitName(maDvi: string) {
        return this.childUnit.find(item => item.maDvi == maDvi)?.tenDvi;
    }


    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: 'next' + this.data?.tabSelected,
        }
        this.dataChange.emit(obj);
    };

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdFiles.push(id);
    }

    async restoreReport(id: string) {
        await this.giaoDuToanChiService.restoreReport(this.baoCao.id, id).toPromise().then(
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
        await this.giaoDuToanChiService.addHistory(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
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
