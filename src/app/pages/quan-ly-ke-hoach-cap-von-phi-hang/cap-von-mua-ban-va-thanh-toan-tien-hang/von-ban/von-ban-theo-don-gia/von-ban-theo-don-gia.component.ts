import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { displayNumber, mulNumber, numberOnly, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, CAN_CU_GIA, CVMB, DON_VI_TIEN, LOAI_DE_NGHI, MONEY_LIMIT, QUATITY, Utils } from 'src/app/Utility/utils';
import { LuyKeThanhToan, Report, ThanhToan, TRANG_THAI } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'app-von-ban-theo-don-gia',
    templateUrl: './von-ban-theo-don-gia.component.html',
    styleUrls: ['../von-ban.component.scss'],
})
export class VonBanTheoDonGiaComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtietBcaos: ThanhToan[] = [];
    title: string;
    editCache: { [key: string]: { edit: boolean; data: ThanhToan } } = {};
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    donViTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    scrollX: string;
    //trang thai cac nut
    isParent = false;
    statusGui = false;
    statusNhan = false;
    saveStatus = false;
    submitStatus = false;
    passStatus = false;
    approveStatus = false;
    copyStatus = false;
    printStatus = false;
    editMoneyUnit = false;
    isDataAvailable = false;
    // before uploaf file
    beforeUploadGui = (file: NzUploadFile): boolean => {
        this.baoCao.ttGui.fileList = this.baoCao.ttGui.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadNhan = (file: NzUploadFile): boolean => {
        this.baoCao.ttNhan.fileList = this.baoCao.ttNhan.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUploadGui(): void {
        this.baoCao.ttGui.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.ttGui.lstFiles.push({ id: id, fileName: file?.name });
            this.baoCao.ttGui.listFile.push(file);
        });
        this.baoCao.ttGui.fileList = [];
    }

    // them file vao danh sach
    handleUploadNhan(): void {
        this.baoCao.ttNhan.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.ttNhan.lstFiles.push({ id: id, fileName: file?.name });
            this.baoCao.ttNhan.listFile.push(file);
        });
        this.baoCao.ttNhan.fileList = [];
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private danhMuc: DanhMucHDVService,
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
            default:
                break;
        }
        this.spinner.hide();
    }

    getStatusName() {
        if (this.isParent) {
            if (this.baoCao.ttNhan.trangThai == Utils.TT_BC_1) {
                return 'Mới';
            }
            return this.trangThais.find(e => e.id == this.baoCao.ttNhan.trangThai)?.tenDm;
        }
        return this.trangThais.find(e => e.id == this.baoCao.ttGui.trangThai)?.tenDm;
    }

    getDate(date: Date) {
        return this.datePipe.transform(date, Utils.FORMAT_DATE_STR);
    }

    async initialization() {
        //lay id cua de nghi
        this.userInfo = this.userService.getUserLogin();
        if (this.dataInfo?.id) {
            this.baoCao.id = this.dataInfo?.id;
            await this.getDetailReport();
        } else {
            this.baoCao = this.dataInfo?.baoCao;
            this.lstCtietBcaos = this.baoCao.ttGui.lstCtietBcaos;
        }
        if (this.baoCao?.maLoai == 1) {
            this.title = 'Vốn bán từ đơn vị cấp dưới'
        } else {
            this.title = 'Vốn bán nộp lên đơn vị cấp trên'
        }
        this.baoCao.ttGui.fileList = [];
        this.baoCao.ttNhan.fileList = [];
        this.baoCao.ttGui.listIdDeleteFiles = [];
        this.baoCao.ttNhan.listIdDeleteFiles = [];
        this.updateEditCache();
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (this.baoCao.maDvi == this.userInfo?.MA_DVI) {
            const trangThai = this.baoCao.ttGui.trangThai;
            this.statusNhan = false;
            this.statusGui = this.getStatus(Utils.statusSave, trangThai, CVMB.EDIT_REPORT_NTV_BH);
            this.saveStatus = this.getStatus(Utils.statusSave, trangThai, CVMB.EDIT_REPORT_NTV_BH);
            this.submitStatus = this.getStatus(Utils.statusApprove, trangThai, CVMB.APPROVE_REPORT_NTV_BH) && !(!this.baoCao.id);
            this.passStatus = this.getStatus(Utils.statusDuyet, trangThai, CVMB.DUYET_REPORT_NTV_BH);
            this.approveStatus = this.getStatus(Utils.statusPheDuyet, trangThai, CVMB.PHE_DUYET_REPORT_NTV_BH);
        } else if (this.isParent) {
            const trangThai = this.baoCao.ttNhan.trangThai;
            this.statusGui = false;
            this.statusNhan = this.getStatus(Utils.statusSave, trangThai, CVMB.EDIT_REPORT_GNV_BH);
            this.saveStatus = this.getStatus(Utils.statusSave, trangThai, CVMB.EDIT_REPORT_GNV_BH);
            this.submitStatus = this.getStatus(Utils.statusApprove, trangThai, CVMB.APPROVE_REPORT_GNV_BH) && !(!this.baoCao.id);
            this.passStatus = this.getStatus(Utils.statusDuyet, trangThai, CVMB.DUYET_REPORT_GNV_BH);
            this.approveStatus = this.getStatus(Utils.statusPheDuyet, trangThai, CVMB.PHE_DUYET_REPORT_GNV_BH);
        } else {
            this.statusGui = false;
            this.statusNhan = false;
        }
        if (this.statusGui) {
            this.scrollX = (350 + 10 * BOX_NUMBER_WIDTH).toString() + 'px';
        } else {
            this.scrollX = (300 + 10 * BOX_NUMBER_WIDTH).toString() + 'px';
        }
    }

    getStatus(lstSatus: any[], trangThai: string, role: string) {
        return lstSatus.includes(trangThai) && this.userService.isAccessPermisson(role) && this.baoCao.maLoai == 4;
    }

    back() {
        const obj = {
            tabSelected: this.dataInfo?.preTab,
        }
        this.dataChange.emit(obj);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maCapUng);
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
    deleteFileGui(id: string): void {
        this.baoCao.ttGui.lstFiles = this.baoCao.ttGui.lstFiles.filter((a: any) => a.id !== id);
        this.baoCao.ttGui.listFile = this.baoCao.ttGui.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.ttGui.listIdDeleteFiles.push(id);
    }

    // xoa file trong bang file
    deleteFileNhan(id: string): void {
        this.baoCao.ttNhan.lstFiles = this.baoCao.ttNhan.lstFiles.filter((a: any) => a.id !== id);
        this.baoCao.ttNhan.listFile = this.baoCao.ttNhan.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.ttNhan.listIdDeleteFiles.push(id);
    }

    //download file về máy tính
    async downloadFileGui(id: string) {
        const file: File = this.baoCao.ttGui.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.baoCao.ttGui.lstFiles.find(element => element?.id == id);
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
    async downloadFileNhan(id: string) {
        const file: File = this.baoCao.ttNhan.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.baoCao.ttNhan.lstFiles.find(element => element?.id == id);
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

    // call chi tiet bao cao
    async getDetailReport() {
        await this.capVonMuaBanTtthService.ctietVonMuaBan(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.lstCtietBcaos = this.baoCao.ttGui.lstCtietBcaos;
                    if (this.userInfo.MA_DVI != this.baoCao.maDvi && this.baoCao.maDvi.startsWith(this.userInfo?.MA_DVI)) {
                        this.isParent = true;
                    }
                    this.baoCao.ttGui.listFile = [];
                    this.baoCao.ttNhan.listFile = [];
                    this.updateEditCache();
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
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
            maLoai: this.isParent ? '1' : '0',
        };
        await this.capVonMuaBanTtthService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                if (this.isParent) {
                    this.baoCao.ttNhan.trangThai = mcn;
                } else {
                    this.baoCao.ttGui.trangThai = mcn;
                }
                this.getStatusButton();
                if (mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
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
        modalTuChoi.afterClose.subscribe(async (text) => {
            if (text) {
                this.onSubmit(mcn, text);
            }
        });
    }

    // luu
    async save() {
        //kiem tra ca trg thon tin nhan da duoc nhap du chua
        if (this.isParent) {
            if (!this.baoCao.ttNhan.ngayNhanLenhChuyenCo || !this.baoCao.ttNhan.tkNhan) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
            //kiem tra ca ky tu trong tai khoan nhan cos phai deu la so ko
            if (!numberOnly(this.baoCao.ttNhan.tkNhan)) {
                this.notification.warning(MESSAGE.WARNING, 'Trường chỉ chứa ký tự số');
                return;
            }
            //kiem tra kich co cua file
            let checkFile = true;
            for (const iterator of this.baoCao.ttNhan.listFile) {
                if (iterator.size > Utils.FILE_SIZE) {
                    checkFile = false;
                }
            }
            if (!checkFile) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            }
        } else {
            //kiem tra ca dong da duoc luu du chua cung nhu gioi han tien duoc luu
            let checkSaveEdit = false;
            let checkMoneyRange = false;
            this.lstCtietBcaos.forEach(e => {
                if (this.editCache[e.id].edit) {
                    checkSaveEdit = true;
                }
                if (e.luyKeSauLanNopNay > MONEY_LIMIT || e.giaTriHd > MONEY_LIMIT || e.giaTriTh > MONEY_LIMIT) {
                    checkMoneyRange = true;
                }
            })
            if (checkSaveEdit) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
                return;
            }
            if (checkMoneyRange) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
                return;
            }
            //kiem tra kich co cua file
            let checkFile = true;
            for (const iterator of this.baoCao.ttGui.listFile) {
                if (iterator.size > Utils.FILE_SIZE) {
                    checkFile = false;
                }
            }
            if (!checkFile) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            }
        }

        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
        //gui file dinh kem cua ttGui
        if (!baoCaoTemp.ttGui.fileDinhKems) {
            baoCaoTemp.ttGui.fileDinhKems = [];
        }
        for (const iterator of this.baoCao.ttGui.listFile) {
            baoCaoTemp.ttGui.fileDinhKems.push(await this.uploadFile(iterator));
        }
        //gui file dinh kem cua ttNhan
        if (!baoCaoTemp.ttNhan.fileDinhKems) {
            baoCaoTemp.ttNhan.fileDinhKems = [];
        }
        for (const iterator of this.baoCao.ttNhan.listFile) {
            baoCaoTemp.ttNhan.fileDinhKems.push(await this.uploadFile(iterator));
        }

        baoCaoTemp.ttGui.lstCtietBcaos = [];
        this.lstCtietBcaos.forEach(item => {
            const data: any[] = [];
            item.listLuyKe?.forEach(e => {
                data.push({
                    ...e,
                    id: e.id?.length == 38 ? null : e.id,
                })
            })
            baoCaoTemp.ttGui.lstCtietBcaos.push({
                ...item,
                listLuyKe: data,
                id: item.id?.length == 38 ? null : item.id,
            })
        })
        if (!this.baoCao.id) {
            this.capVonMuaBanTtthService.themMoiVonMuaBan(baoCaoTemp).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.action('detail');
                        // await addVonBanGuiDvct();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.capVonMuaBanTtthService.capNhatVonMuaBan(baoCaoTemp).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        this.action('detail');
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
    }

    updateEditCache(): void {
        this.lstCtietBcaos?.forEach(item => {
            const data: LuyKeThanhToan[] = [];
            item.listLuyKe?.forEach(e => {
                data.push({ ...e });
            })
            this.editCache[item.id] = {
                edit: false,
                data: {
                    ...item,
                    listLuyKe: data,
                }
            };
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcaos[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    changeModel(id: string) {
        this.editCache[id].data.giaTriHd = mulNumber(this.editCache[id].data.soLuongKeHoach, this.editCache[id].data.donGia);
        this.editCache[id].data.giaTriTh = mulNumber(this.editCache[id].data.soLuongThucHien, this.editCache[id].data.donGia);
        this.editCache[id].data.luyKeSauLanNopNay = sumNumber([this.editCache[id].data.uyNhiemChiSoTien, this.editCache[id].data.soDaNopTc]);
        this.editCache[id].data.soConPhaiNop = sumNumber([this.editCache[id].data.giaTriTh, -this.editCache[id].data.luyKeSauLanNopNay]);
    }

    async showDialogCopy() {
        // const obj = {
        //     loaiVon: this.loaiVon,
        //     soLenhChiTien: this.soLenhChiTien,
        //     ngayLap: this.ngayLapTemp,
        // }
        // const modalTuChoi = this.modal.create({
        //     nzTitle: 'Copy  Nhận cấp ứng vốn từ đơn vị cấp trên',
        //     nzContent: DialogDoCopyComponent,
        //     nzMaskClosable: false,
        //     nzClosable: false,
        //     nzWidth: '900px',
        //     nzFooter: null,
        //     nzComponentParams: {
        //         obj
        //     },
        // });
        // modalTuChoi.afterClose.toPromise().then(async (res) => {
        //     if (res) {
        //         this.doCopy(res);
        //     }
        // });
    }

    async doCopy(response: any) {
        // let maCVUvNew: string;
        // await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
        //     (res) => {
        //         if (res.statusCode == 0) {
        //             maCVUvNew = res.data;
        //             const mm = maCVUvNew.split('.');
        //             maCVUvNew = mm[0] + "TCDT" + '.' + mm[1];
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, res?.msg);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     },
        // );
        // if (!this.ttNhan.ngayNhan || !this.ttNhan.taiKhoanNhan) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        //     return;
        // }
        // if (this.statusEdit) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
        //     return;
        // }

        // // gui du lieu trinh duyet len server
        // if (this.ttGui.soTien > MONEY_LIMIT) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        //     return;
        // }
        // // gui du lieu trinh duyet len server
        // const request = {
        //     id: null,
        //     maLoai: '1',
        //     maDvi: this.maDonViTao,
        //     maDviTien: '1',
        //     fileDinhKemNhans: [],
        //     listIdDeleteFileNhans: [],
        //     maCapUngVonTuCapTren: maCVUvNew,
        //     loaiCap: response.loaiVon,
        //     soLenhChiTien: response.soLenhChiTien,
        //     ngayLap: response.ngayLap,
        //     ngayNhan: this.ttNhan.ngayNhan,
        //     noiDung: this.ttGui.noiDung,
        //     maNguonNs: this.ttGui.maNguonNs,
        //     maChuong: this.ttGui.maChuong,
        //     maNdkt: this.ttGui.maNdkt,
        //     soTien: this.ttGui.soTien,
        //     soTienBangChu: this.ttGui.soTienChu,
        //     tuTk: this.ttGui.taiKhoan,
        //     tkNhan: this.ttNhan.taiKhoanNhan,
        //     trangThai: "1",
        //     thuyetMinh: this.thuyetMinh,
        // };

        // this.spinner.show();
        // this.capVonMuaBanTtthService.themMoiVonMuaBan(request).toPromise().then(
        //     async (data) => {
        //         if (data.statusCode == 0) {
        //             const modalCopy = this.modal.create({
        //                 nzTitle: MESSAGE.ALERT,
        //                 nzContent: DialogCopyComponent,
        //                 nzMaskClosable: false,
        //                 nzClosable: false,
        //                 nzWidth: '900px',
        //                 nzFooter: null,
        //                 nzComponentParams: {
        //                     maBcao: maCVUvNew
        //                 },
        //             });
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, data?.msg);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     },
        // );
        // this.spinner.hide();
    }

    displayValue(num: number): string {
        // num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    // getMoneyUnit() {
    //     return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    // }

    statusClass() {
        const trangThai = this.isParent ? this.baoCao.ttNhan.trangThai : this.baoCao.ttGui.trangThai;
        if (Utils.statusSave.includes(trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
