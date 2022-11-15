import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { CAN_CU_GIA, CVNC, displayNumber, DON_VI_TIEN, exchangeMoney, LOAI_DE_NGHI, MONEY_LIMIT, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
    id: string;
    stt: string;
    maHang: string;
    maDviTinh: string;
    soLuong: number;
    donGiaMua: number;
    thanhTien: number;
    checked: boolean;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-de-nghi-theo-don-gia-mua',
    templateUrl: './de-nghi-theo-don-gia-mua.component.html',
    styleUrls: ['./de-nghi-theo-don-gia-mua.component.scss',
    ],
})
export class DeNghiTheoDonGiaMuaComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    id: string;
    maDeNghi: string;
    qdChiTieu: string;
    canCuGia: string = Utils.QD_DON_GIA;
    loaiDn: string;
    congVan: ItemCongVan;
    ngayTao: string;
    ngayTrinhDuyet: string;
    ngayPheDuyet: string;
    trangThai: string;
    maDviTao: string;
    thuyetMinh: string;
    tongTien = 0;
    kphiDaCap = 0;
    lyDoTuChoi: string;
    maDviTien: string;
    titleStatus: string;
    newDate = new Date();
    //danh muc
    lstCtietBcao: ItemData[] = [];
    vatTus: any[] = [];
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
            id: Utils.TT_BC_5,
            tenDm: "Từ chối phê duyệt",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Phê duyệt",
        },
    ]
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    maDviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = [];
    //trang thai cac nut
    status = false;
    saveStatus = true;
    submitStatus = true;
    approveStatus = true;
    copyStatus = true;
    editMoneyUnit = false;
    isDataAvailable = false;
    //file
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: string[] = [];
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

    //khac 
    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private capVonNguonChiService: CapVonNguonChiService,
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
        this.titleStatus = this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
        this.spinner.hide();
    }

    async initialization() {
        //lay id cua de nghi
        this.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.trangThai = '1';
            this.maDviTao = this.userInfo?.MA_DVI;
            this.maDviTien = '1';
            this.qdChiTieu = this.data?.qdChiTieu;
            this.loaiDn = this.data?.loaiDn;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);

            this.capVonNguonChiService.maDeNghi().toPromise().then(
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
        }

        await this.danhMuc.dMVatTu().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.vatTus = [];
                    if (this.loaiDn == Utils.MUA_MUOI) {
                        this.vatTus.push(res.data.find(e => e.ma == "04"));
                    } else {
                        const vatTuTemp = res.data.find(e => e.ma == "01").child;
                        if (this.loaiDn == Utils.MUA_GAO) {
                            this.vatTus.push(vatTuTemp.find(e => e.ma == "0102"));
                        }
                        if (this.loaiDn == Utils.MUA_THOC) {
                            this.vatTus.push(vatTuTemp.find(e => e.ma == "0101"));
                        }
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            },
        );
        this.getStatusButton();
    }

    addListVtu(lstVtu: any) {
        lstVtu.forEach(item => {
            this.vatTus.push(item);
            if (item.child) {
                this.addListVtu(item.child);
            }
        })
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        if (Utils.statusSave.includes(this.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_DN_MLT)) {
            this.status = false;
        } else {
            this.status = true;
        }
        const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
        this.saveStatus = this.getBtnStatus(Utils.statusSave, CVNC.EDIT_DN_MLT, checkChirld);
        this.submitStatus = this.getBtnStatus(Utils.statusApprove, CVNC.APPROVE_DN_MLT, checkChirld) && !(!this.id);
        if (this.trangThai == Utils.TT_BC_2) {
            this.approveStatus = (this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MLT) && checkChirld);
        } else {
            this.approveStatus = this.getBtnStatus(Utils.statusPheDuyet, CVNC.PHE_DUYET_DN_MLT, checkChirld);
        }
        this.copyStatus = this.getBtnStatus(Utils.statusCopy, CVNC.COPY_DN_MLT, checkChirld);
    }

    getBtnStatus(status: string[], role: string, check: boolean) {
        return (status.includes(this.trangThai) && this.userService.isAccessPermisson(role) && check);
    }

    back() {
        const obj = {
            qdChiTieu: this.qdChiTieu,
            tabSelected: 'danhsach',
        }
        this.dataChange.emit(obj);
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
        await this.capVonNguonChiService.ctietDeNghi(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.tongTien = 0;
                    this.id = data.data.id;
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao = data.data.dnghiCapvonCtiets;
                    this.updateEditCache();
                    this.maDviTao = data.data.maDvi;
                    this.maDeNghi = data.data.maDnghi;
                    this.qdChiTieu = data.data.soQdChiTieu;
                    this.canCuGia = data.data.canCuVeGia;
                    this.loaiDn = data.data.loaiDnghi;
                    this.congVan = data.data.congVan;
                    this.tongTien = data.data.tongTien;
                    this.kphiDaCap = data.data.kphiDaCap;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
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
        if (!this.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        const requestGroupButtons = {
            id: this.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.capVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.trangThai = mcn;
                this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                this.getStatusButton();
                if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5) {
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
        if (!this.kphiDaCap && this.kphiDaCap !== 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.kphiDaCap < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }
        // if (this.kphiDaCap > this.tongTien) {
        //     this.notification.warning(MESSAGE.WARNING, 'Kinh phí đã cấp không được vượt quá tổng tiền');
        //     return;
        // }

        let checkSave = true;
        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.tongTien > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
            })
        })
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


        lstCtietBcaoTemp.forEach(item => {
            if (item.id.length == 38) {
                item.id = null;
            }
        })
        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: listFile,
            listIdDeleteFiles: this.listIdFilesDelete,
            dnghiCapvonCtiets: lstCtietBcaoTemp,
            congVan: this.congVan,
            maDvi: this.maDviTao,
            maDnghi: this.maDeNghi,
            loaiDnghi: this.loaiDn,
            canCuVeGia: this.canCuGia,
            maDviTien: this.maDviTien,
            soQdChiTieu: this.qdChiTieu,
            tongTien: this.tongTien,
            kphiDaCap: this.kphiDaCap,
            ycauCapThem: this.tongTien - this.kphiDaCap,
            trangThai: this.trangThai,
            thuyetMinh: this.thuyetMinh,
        }));
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
        if (!this.id) {
            this.capVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.id = data.data.id;
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
        } else {
            this.capVonNguonChiService.updateDeNghi(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
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

    // them dong moi
    addLine(id: number): void {
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: '',
            maHang: "",
            maDviTinh: "",
            soLuong: 0,
            donGiaMua: 0,
            thanhTien: 0,
            checked: false,
        }

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // xoa dong
    deleteById(id: string): void {
        this.tongTien -= this.lstCtietBcao.find(e => e.id == id).thanhTien;
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    }

    // xóa với checkbox
    deleteSelected() {
        // delete object have checked = true
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                this.tongTien -= item.thanhTien;
            }
        })
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
        this.allChecked = false;
    }

    // click o checkbox all
    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                ...item,
                checked: false
            }));
        }
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
        if (!this.lstCtietBcao[index].maHang) {
            this.deleteById(id);
            return;
        }
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
        if (!this.editCache[id].data.maHang ||
            (!this.editCache[id].data.soLuong && this.editCache[id].data.soLuong !== 0) ||
            (!this.editCache[id].data.donGiaMua && this.editCache[id].data.donGiaMua !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.editCache[id].data.soLuong < 0 ||
            this.editCache[id].data.donGiaMua < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao

        this.tongTien -= this.lstCtietBcao[index].thanhTien;
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
        this.tongTien += this.lstCtietBcao[index].thanhTien;
    }

    // gan editCache.data == lstCTietBCao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.maDviTinh = this.vatTus.find(e => e.ma == this.editCache[id].data.maHang)?.maDviTinh;
        this.editCache[id].data.thanhTien = this.editCache[id].data.soLuong * this.editCache[id].data.donGiaMua;
    }

    showDialogCopy() {
        const obj = {
            qdChiTieu: this.qdChiTieu,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Đề nghị',
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
        await this.capVonNguonChiService.maDeNghi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maDeNghiNew = res.data;
                }
            },
        );
        if (!maDeNghiNew) {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            return;
        }
        if (!this.kphiDaCap && this.kphiDaCap !== 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        let checkSave = true;
        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.tongTien > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        }

        const lstCtietBcaoTemp: ItemData[] = [];
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
            dnghiCapvonCtiets: lstCtietBcaoTemp,
            congVan: null,
            maDvi: this.maDviTao,
            maDnghi: maDeNghiNew,
            loaiDnghi: this.loaiDn,
            canCuVeGia: this.canCuGia,
            maDviTien: '1',
            soQdChiTieu: response.qdChiTieu,
            tongTien: this.tongTien,
            kphiDaCap: this.kphiDaCap,
            ycauCapThem: this.tongTien - this.kphiDaCap,
            trangThai: "1",
            thuyetMinh: this.thuyetMinh,
        }));

        this.spinner.show();
        this.capVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
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

    displayMoney(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    displayValue(num: number): string {
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.maDviTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    statusClass() {
        if (Utils.statusSave.includes(this.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
