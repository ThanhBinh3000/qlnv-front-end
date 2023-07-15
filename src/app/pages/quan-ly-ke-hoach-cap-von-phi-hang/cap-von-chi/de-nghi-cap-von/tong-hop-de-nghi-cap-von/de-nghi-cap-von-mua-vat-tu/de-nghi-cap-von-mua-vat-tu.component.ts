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
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { displayNumber, mulNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, CAN_CU_GIA, CVNC, DON_VI_TIEN, LOAI_DE_NGHI, QUATITY, Utils } from 'src/app/Utility/utils';
import { BaoCao, ItemRequest, Times, TRANG_THAI } from '../../de-nghi-cap-von.constant';

@Component({
    selector: 'app-de-nghi-cap-von-mua-vat-tu',
    templateUrl: './de-nghi-cap-von-mua-vat-tu.component.html',
    styleUrls: ['./de-nghi-cap-von-mua-vat-tu.component.scss',
    ],
})

export class DeNghiCapVonMuaVatTuComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: BaoCao = new BaoCao();
    // total: ItemData = new ItemData();
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    dviTinhs: any[] = [];
    vatTus: any[] = [];
    dviTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    scrollX: string;
    //trang thai cac nut
    status = false;
    saveStatus = true;
    submitStatus = true;
    passStatus = true;
    approveStatus = true;
    copyStatus = true;
    isDataAvailable = false;
    editCache: { [key: string]: { edit: boolean; data: ItemRequest } } = {};
    //file
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.baoCao.congVan = {
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
            this.baoCao.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

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
        return this.trangThais.find(e => e.id == this.baoCao.trangThai)?.tenDm;
    }

    getDate(date: any) {
        return this.datePipe.transform(date, Utils.FORMAT_DATE_STR);
    }

    async initialization() {
        //lay id cua de nghi
        this.userInfo = this.userService.getUserLogin();
        if (this.data?.id) {
            this.baoCao.id = this.data?.id;
            await this.getDetailReport();
        } else {
            this.baoCao = this.data?.baoCao;
            this.sum();
        }
        this.updateEditCache();
        this.sortReport();
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const checkChirld = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        this.status = Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_DN_MVT);
        this.saveStatus = Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_DN_MVT) && checkChirld;
        this.submitStatus = Utils.statusApprove.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.APPROVE_DN_MVT) && checkChirld && !(!this.baoCao.id);
        this.approveStatus = this.baoCao.trangThai == Utils.TT_BC_2 && this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MVT) && checkChirld;
        this.copyStatus = Utils.statusCopy.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.COPY_DN_MVT) && checkChirld;
        if (this.status) {
            this.scrollX = (900 + 13 * BOX_NUMBER_WIDTH).toString() + 'px';
        } else {
            this.scrollX = (850 + 13 * BOX_NUMBER_WIDTH).toString() + 'px';
        }
    }

    back() {
        const obj = {
            tabSelected: 'ds-denghi',
        }
        this.dataChange.emit(obj);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maDnghi);
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
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdDeleteFiles.push(id);
    }

    //download file về máy tính
    async downloadFile(id: string) {
        const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.baoCao.lstFiles.find(element => element?.id == id);
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
        if (this.baoCao.congVan?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.baoCao.congVan?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.baoCao.congVan?.fileName);
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
        await this.capVonNguonChiService.ctietDeNghi(this.baoCao.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.listFile = [];
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
        if (!this.baoCao.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.capVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
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
        //kiem tra kich co cua file
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
        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));

        if (!baoCaoTemp.fileDinhKems) {
            baoCaoTemp.fileDinhKems = [];
        }
        for (const iterator of this.listFile) {
            baoCaoTemp.fileDinhKems.push(await this.uploadFile(iterator));
        }
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = await this.uploadFile(file);
            }
        }

        if (!baoCaoTemp.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.dnghiCapvonCtiets.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
            item.dnghiCapvonLuyKes.forEach(e => {
                if (e.id?.length == 38) {
                    e.id = null;
                }
            })
        })

        this.spinner.show();
        if (!this.baoCao.id) {
            this.capVonNguonChiService.taoMoiDeNghi(baoCaoTemp).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        await this.getDetailReport();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.capVonNguonChiService.updateDeNghi(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
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

    updateEditCache(): void {
        this.baoCao.dnghiCapvonCtiets.forEach(item => {
            const data: Times[] = [];
            // item.dnghiCapvonLuyKes.forEach(e => {
            //     data.push({ ...e });
            // })
            this.editCache[item.id] = {
                edit: false,
                data: {
                    ...item,
                    dnghiCapvonLuyKes: data,
                }
            };
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.baoCao.dnghiCapvonCtiets.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.baoCao.dnghiCapvonCtiets[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.baoCao.dnghiCapvonCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.baoCao.dnghiCapvonCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    sortReport() {
        const lstCtietBcao = this.baoCao.dnghiCapvonCtiets;
        const lstParent = this.baoCao.dnghiCapvonCtiets.filter(e => e.isParent);
        this.baoCao.dnghiCapvonCtiets = [];
        lstParent.forEach(item => {
            this.baoCao.dnghiCapvonCtiets.push(item);
            this.baoCao.dnghiCapvonCtiets = this.baoCao.dnghiCapvonCtiets.concat(lstCtietBcao.filter(e => e.tenKhachHang == item.tenKhachHang && !e.isParent));
        })
    }

    changeModel(id: string) {
        this.editCache[id].data.gtriThucHien = mulNumber(this.editCache[id].data.slThucHien, this.editCache[id].data.donGia);
        this.editCache[id].data.soConDuocTt = sumNumber([this.editCache[id].data.gtriThucHien, -this.editCache[id].data.soTtLuyKe]);
        this.editCache[id].data.soConDuocTtSauTtLanNay = sumNumber([this.editCache[id].data.soConDuocTt, -this.editCache[id].data.uyNhchiNienSoTien]);
    }

    sum() {
        this.baoCao.dnghiCapvonCtiets.forEach(item => {
            if (item.isParent) {
                item.soConDuocTt = sumNumber([item.gtriThucHien, -item.soTtLuyKe]);
                item.soConDuocTtSauTtLanNay = sumNumber([item.soConDuocTt, -item.uyNhchiNienSoTien]);
            }
        })
    }

    showDialogCopy() {
        // const obj = {
        //     qdChiTieu: this.qdChiTieu,
        // }
        // const modalTuChoi = this.modal.create({
        //     nzTitle: 'Copy Đề nghị',
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
        // let maDeNghiNew: string;
        // await this.capVonNguonChiService.maDeNghi().toPromise().then(
        //     (res) => {
        //         if (res.statusCode == 0) {
        //             maDeNghiNew = res.data;
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, res?.msg);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     },
        // );
        // if (!this.kphiDaCap && this.kphiDaCap !== 0) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        //     return;
        // }

        // const lstCtietBcaoTemp: any[] = [];
        // this.lstCtietBcao.forEach(item => {
        //     lstCtietBcaoTemp.push({
        //         ...item,
        //         id: null,
        //     })
        // })
        // // gui du lieu trinh duyet len server
        // const request = JSON.parse(JSON.stringify({
        //     id: null,
        //     fileDinhKems: [],
        //     listIdDeleteFiles: [],
        //     dnghiCapvonCtiets: lstCtietBcaoTemp,
        //     congVan: null,
        //     maDvi: this.maDviTao,
        //     maDnghi: maDeNghiNew,
        //     namDn: this.namDn,
        //     loaiDnghi: this.loaiDn,
        //     canCuVeGia: this.canCuGia,
        //     maDviTien: "1",
        //     soQdChiTieu: response.qdChiTieu,
        //     tongTien: this.tongTien,
        //     kphiDaCap: this.kphiDaCap,
        //     ycauCapThem: this.tongTien - this.kphiDaCap,
        //     trangThai: this.trangThai,
        //     thuyetMinh: this.thuyetMinh,
        // }));

        // this.capVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
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
        //                     maBcao: maDeNghiNew
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
    }

    displayValue(num: number): string {
        return displayNumber(num);
    }

    statusClass() {
        if (Utils.statusSave.includes(this.baoCao.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
