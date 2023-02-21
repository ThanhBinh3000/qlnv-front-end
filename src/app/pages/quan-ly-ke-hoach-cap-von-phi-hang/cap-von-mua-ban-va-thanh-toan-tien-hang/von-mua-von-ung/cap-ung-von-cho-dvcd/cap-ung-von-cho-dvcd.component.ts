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
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { displayNumber, numberOnly, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, CVMB, DON_VI_TIEN, LOAI_DE_NGHI, MONEY_LIMIT, QUATITY, Utils } from 'src/app/Utility/utils';
import { CapUng, LuyKeCapUng, Report, TRANG_THAI } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';

@Component({
    selector: 'app-cap-ung-von-cho-dvcd',
    templateUrl: './cap-ung-von-cho-dvcd.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss'],
})
export class CapUngVonChoDvcdComponent implements OnInit {
    @Input() dataInfo;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    lstCtietBcaos: CapUng[] = [];
    editCache: { [key: string]: { edit: boolean; data: CapUng } } = {};
    title: string;
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    donViTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    scrollX: string;
    //trang thai cac nut
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
        const trangThai = this.baoCao.maLoai == 3 ? this.baoCao.ttGui.trangThai : this.baoCao.ttNhan.trangThai;
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
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
        if (this.baoCao.maLoai == 3) {
            this.title = 'Cấp ứng vốn cho đơn vị cấp dưới';
        } else {
            this.title = 'Ghi nhận cấp ứng vốn từ đơn vị cấp trên';
        }
        this.baoCao.ttGui.fileList = [];
        this.baoCao.ttNhan.fileList = [];
        this.baoCao.ttGui.listIdDeleteFiles = [];
        this.baoCao.ttNhan.listIdDeleteFiles = [];
        this.updateEditCache();
        this.getStatusButton();
    }

    async getChildUnit() {
        const request = {
            maDviCha: this.baoCao.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (this.userService.isTongCuc()) {
                        this.donVis = data.data.filter(e => e.tenVietTat && e.tenVietTat.startsWith('CDT'));
                    } else {
                        this.donVis = data.data.filter(e => e.tenVietTat && e.tenVietTat.startsWith('CCDT'))
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const checkChirld = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        const trangThai = this.baoCao.maLoai == 3 ? this.baoCao.ttGui.trangThai : this.baoCao.ttNhan.trangThai;
        this.saveStatus = Utils.statusSave.includes(trangThai) && checkChirld;
        this.submitStatus = Utils.statusApprove.includes(trangThai) && checkChirld && !(!this.baoCao.id);
        this.passStatus = Utils.statusDuyet.includes(trangThai) && checkChirld;
        this.approveStatus = Utils.statusPheDuyet.includes(trangThai) && checkChirld;
        this.copyStatus = Utils.statusCopy.includes(trangThai) && checkChirld;
        if (this.baoCao.maLoai == 3) {
            this.saveStatus = this.saveStatus && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_CV);
            this.submitStatus = this.submitStatus && this.userService.isAccessPermisson(CVMB.APPROVE_REPORT_CV);
            this.passStatus = this.passStatus && this.userService.isAccessPermisson(CVMB.DUYET_REPORT_CV);
            this.approveStatus = this.approveStatus && this.userService.isAccessPermisson(CVMB.PHE_DUYET_REPORT_CV);
            this.copyStatus = this.copyStatus && this.userService.isAccessPermisson(CVMB.COPY_REPORT_CV);
            this.statusGui = this.saveStatus;
            this.statusNhan = false;
            if (this.statusGui) {
                this.scrollX = (350 + 15 * BOX_NUMBER_WIDTH + 250).toString() + 'px';
            } else {
                this.scrollX = (350 + 15 * BOX_NUMBER_WIDTH + 200).toString() + 'px';
            }
        } else {
            this.saveStatus = this.saveStatus && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_GNV);
            this.submitStatus = this.submitStatus && this.userService.isAccessPermisson(CVMB.APPROVE_REPORT_GNV);
            this.passStatus = this.passStatus && this.userService.isAccessPermisson(CVMB.DUYET_REPORT_GNV);
            this.approveStatus = this.approveStatus && this.userService.isAccessPermisson(CVMB.PHE_DUYET_REPORT_GNV);
            this.copyStatus = this.copyStatus && this.userService.isAccessPermisson(CVMB.COPY_REPORT_GNV);
            this.statusGui = this.userService.isTongCuc() ? this.saveStatus : false;
            this.statusNhan = this.saveStatus;
            if (this.statusNhan) {
                this.scrollX = (15 * BOX_NUMBER_WIDTH + 250).toString() + 'px';
            } else {
                this.scrollX = (15 * BOX_NUMBER_WIDTH + 200).toString() + 'px';
            }
        }
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
            maLoai: this.baoCao.maLoai == 3 ? '0' : '1',
        };
        await this.capVonMuaBanTtthService.trinhDuyetVonMuaBan(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                if (requestGroupButtons.maLoai == '0') {
                    this.baoCao.ttGui.trangThai = mcn;
                } else {
                    this.baoCao.ttNhan.trangThai = mcn;
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
        if (this.baoCao.maLoai == 2) {
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
        }
        if (this.baoCao.maLoai == 3) {
            //kiem tra ca dong da duoc luu du chua cung nhu gioi han tien duoc luu
            let checkSaveEdit = false;
            let checkMoneyRange = false;
            this.lstCtietBcaos.forEach(e => {
                if (this.editCache[e.id].edit) {
                    checkSaveEdit = true;
                }
                if (e.tong > MONEY_LIMIT) {
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
        this.lstCtietBcaos.forEach(item => {
            const data: LuyKeCapUng[] = [];
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
        const index = this.lstCtietBcaos.findIndex(e => e.id == id);
        this.editCache[id].data.tong = sumNumber([this.editCache[id].data.vonCap, this.editCache[id].data.vonUng]);
        this.editCache[id].data.luyKeVonUng = sumNumber([this.lstCtietBcaos[index].luyKeVonUng, this.editCache[id].data.vonUng, -this.lstCtietBcaos[index].vonUng]);
        this.editCache[id].data.luyKeVonCap = sumNumber([this.lstCtietBcaos[index].luyKeVonCap, this.editCache[id].data.vonCap, -this.lstCtietBcaos[index].vonCap]);
        this.editCache[id].data.luyKeTong = sumNumber([this.editCache[id].data.luyKeVonCap, this.editCache[id].data.luyKeVonUng]);
    }


    // async ghiNhanCapVon() {
    //     const request = {
    //         loaiTimKiem: '0',
    //         maLoai: 6,
    //         maDvi: this.baoCao.maDvi,
    //         namDnghi: this.baoCao.namDnghi,
    //         paggingReq: {
    //             limit: 10,
    //             page: 1,
    //         },
    //     }
    //     let idTienThua!: string;
    //     let tienThua: Report = new Report();
    //     this.spinner.show();
    //     await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 if (data.data.content?.length > 0) {
    //                     idTienThua = data.data.content[0].id;

    //                 }
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         }
    //     );
    //     if (idTienThua) {
    //         await this.capVonMuaBanTtthService.ctietVonMuaBan(idTienThua).toPromise().then(
    //             async (data) => {
    //                 if (data.statusCode == 0) {
    //                     tienThua = data.data;
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //             },
    //         );
    //         const temp = this.getTotal();
    //         const index = tienThua.ttGui?.lstCtietBcaos?.findIndex(e => e.maHang == this.baoCao.loaiDnghi);
    //         if (index != -1) {
    //             if (this.dataInfo?.preTab == 'cv') {
    //                 tienThua.ttGui.lstCtietBcaos[index].tongCapUngGiao = temp.ung;
    //                 tienThua.ttGui.lstCtietBcaos[index].tongCapVonGiao = temp.cap;
    //                 tienThua.ttGui.lstCtietBcaos[index].tongCapGiao = temp.tong;
    //             } else {
    //                 tienThua.ttGui.lstCtietBcaos[index].tongVonUngNhan = temp.ung;
    //                 tienThua.ttGui.lstCtietBcaos[index].tongVonCapNhan = temp.cap;
    //                 tienThua.ttGui.lstCtietBcaos[index].tongVonNhan = temp.tong;
    //             }
    //             await this.capVonMuaBanTtthService.capNhatVonMuaBan(tienThua).toPromise().then(
    //                 async (data) => {
    //                     if (data.statusCode == 0) {
    //                         this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    //                     } else {
    //                         this.notification.error(MESSAGE.ERROR, data?.msg);
    //                     }
    //                 },
    //                 (err) => {
    //                     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //                 },
    //             );
    //         }
    //     }
    //     this.spinner.hide();
    // }

    getTotal() {
        const obj = {
            ung: 0,
            cap: 0,
            tong: 0,
        }
        this.lstCtietBcaos.forEach(item => {
            obj.ung = sumNumber([obj.ung, item.luyKeVonUng]);
            obj.cap = sumNumber([obj.ung, item.luyKeVonCap]);
            obj.tong = sumNumber([obj.ung, item.luyKeTong]);
        })
        return obj;
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
        const trangThai = this.baoCao.maLoai == 3 ? this.baoCao.ttGui.trangThai : this.baoCao.ttNhan.trangThai;
        if (Utils.statusSave.includes(trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
