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
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { displayNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, CAN_CU_GIA, CVNC, DON_VI_TIEN, LOAI_DE_NGHI, Operator, QUATITY, Roles, Table, Utils } from 'src/app/Utility/utils';
import { BaoCao, ItemContract, TRANG_THAI } from '../../de-nghi-cap-von.constant';
import { BtnStatus } from '../../de-nghi-cap-von.class';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-hop-dong-mua-thoc-gao-muoi',
    templateUrl: './hop-dong-mua-thoc-gao-muoi.component.html',
    styleUrls: ['./hop-dong-mua-thoc-gao-muoi.component.scss',
    ],
})

export class HopDongMuaThocGaoMuoiComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: BaoCao = new BaoCao();
    total: ItemContract = new ItemContract();
    //danh muc
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    dviTinhs: any[] = [];
    vatTus: any[] = [];
    dviTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    //trang thai cac nut
    status = false;
    saveStatus = true;
    submitStatus = true;
    // passStatus = true;
    approveStatus = true;
    copyStatus = true;
    isDataAvailable = false;
    editCache: { [key: string]: { edit: boolean; data: ItemContract } } = {};
    //file
    listFile: File[] = [];
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    statusExportExcel: BtnStatus = new BtnStatus();
    canCuGias: any[] = CAN_CU_GIA;
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
        this.baoCao.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao = this.data?.baoCao;
            this.updateEditCache();
        }
        this.sortReport();
        this.getTotal();
        this.getStatusButton();
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const checkChirld = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        if (Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVNC.EDIT_DN_MLT)) {
            this.status = false;
        } else {
            this.status = true;
        }
        this.saveStatus = Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVNC.EDIT_DN_MLT) && checkChirld && !(this.baoCao.id);
        this.submitStatus = Utils.statusApprove.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVNC.APPROVE_DN_MLT) && checkChirld && !(!this.baoCao.id);
        this.approveStatus = this.baoCao.trangThai == Utils.TT_BC_2 && this.userService.isAccessPermisson(Roles.CVNC.PHE_DUYET_DN_MLT) && checkChirld;
        this.copyStatus = Utils.statusCopy.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.CVNC.COPY_DN_MLT) && checkChirld;
    }

    back() {
        const obj = {
            tabSelected: 'ds-hopdong',
        }
        this.dataChange.emit(obj);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maHopDong);
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
        baoCaoTemp.lstCtiets.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        this.spinner.show();
        if (!this.baoCao.id) {
            baoCaoTemp.maLoai = '3';
            baoCaoTemp.maDviTien = '1';
            baoCaoTemp.soQdChiTieu = 'ABC-123';
            baoCaoTemp.canCuVeGia = this.canCuGias[0].id;
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
        this.baoCao.lstCtiets.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.baoCao.lstCtiets.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.baoCao.lstCtiets[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.baoCao.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.baoCao.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.getTotal();
    }

    sortReport() {
        const lstCtietBcao = this.baoCao.lstCtiets;
        const lstParent = this.baoCao.lstCtiets.filter(e => e.isParent);
        this.baoCao.lstCtiets = [];
        lstParent.forEach(item => {
            this.baoCao.lstCtiets.push(item);
            this.baoCao.lstCtiets = this.baoCao.lstCtiets.concat(lstCtietBcao.filter(e => e.maDvi == item.maDvi && !e.isParent));
        })
    }

    getTotal() {
        this.total = new ItemContract();
        this.baoCao.lstCtiets.forEach(item => {
            if (item.isParent) {
                this.total.slKeHoach = Operator.sum([this.total.slKeHoach, item.slKeHoach]);
                this.total.slHopDong = Operator.sum([this.total.slHopDong, item.slHopDong]);
                this.total.gtHopDong = Operator.sum([this.total.gtHopDong, item.gtHopDong]);
                this.total.daGiaoDuToan = Operator.sum([this.total.daGiaoDuToan, item.daGiaoDuToan]);
                this.total.viPhamHopDong = Operator.sum([this.total.viPhamHopDong, item.viPhamHopDong]);
                this.total.thanhLyHdongSl = Operator.sum([this.total.thanhLyHdongSl, item.thanhLyHdongSl]);
                this.total.thanhLyHdongTt = Operator.sum([this.total.thanhLyHdongTt, item.thanhLyHdongTt]);
            }
        })
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 10, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'Cục DTNNKV' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Quyết định phê duyệt kết quả lựa chọn nhà thầu/Hợp đồng' },
            { t: 0, b: 0, l: 2, r: 3, val: 'Số lượng' },
            { t: 1, b: 1, l: 2, r: 2, val: 'Kế hoạch' },
            { t: 1, b: 1, l: 3, r: 3, val: 'Thực hiện' },
            { t: 0, b: 1, l: 4, r: 4, val: 'Đơn giá (kg/đồng)' },
            { t: 0, b: 1, l: 5, r: 5, val: 'Giá trị hợp đồng(đã bao gồm VAT)(đồng)' },
            { t: 0, b: 1, l: 6, r: 6, val: 'Vi phạm hợp đồng' },
            { t: 0, b: 0, l: 7, r: 8, val: 'Thanh lý hợp đồng' },
            { t: 1, b: 1, l: 7, r: 7, val: 'Số lượng' },
            { t: 1, b: 1, l: 8, r: 8, val: 'Thành tiền' },
            { t: 1, b: 1, l: 9, r: 9, val: 'Công văn' },
        ]
        const fieldOrder = ['tenDvi', 'qdPheDuyetKqNhaThau', 'slKeHoach', 'slHopDong', 'donGia', 'gtHopDong', 'viPhamHopDong', 'thanhLyHdongSl', 'thanhLyHdongTt', 'congVan']
        const filterData = this.baoCao.lstCtiets.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = item[field]
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, 'HOP_DONG.xlsx');
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
