import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { CurrencyMaskInputMode } from 'ngx-currency';

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    noiDung: string;
    loaiKhoan: string;
    ncauKphi: number;
    dtoanKphiNtruoc: number;
    dtoanKphiDaGiao: number;
    dtoanKphiCong: number;
    kphiUocThien: number;
    dtoanDchinh: number;
    dtoanVuTvqtDnghi: number;
    maNoiDung: string;
    chenhLech: number;
    ykienDviCtren: string;
    ghiChu: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }


    clear() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'level') {
                this[key] = null;
            }
        })
    }

    sum(data: ItemData) {
        Object.keys(data).forEach(key => {
            if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
                this[key] = Operator.sum([this[key], data[key]]);
            }
        })
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }
}

export const amount1 = {
    allowZero: true,
    allowNegative: true,
    precision: 4,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    inputMode: CurrencyMaskInputMode.NATURAL,
}

@Component({
    selector: 'app-phu-luc-3',
    templateUrl: './phu-luc-3.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc3Component implements OnInit {
    @Input() dataInfo;
    Utils = Utils;
    Op = new Operator('1');
    amount1 = amount1;
    status: BtnStatus = new BtnStatus();
    formDetail: Form = new Form();
    maDviTien: string = '1';
    namBcao: number;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    lstTaiSans: any[] = [];
    lstCtietBcao: ItemData[] = [];
    keys = [
        "ncauKphi",
        "dtoanKphiNtruoc",
        "dtoanKphiDaGiao",
        "dtoanKphiCong",
        "kphiUocThien",
        "dtoanDchinh",
        "dtoanVuTvqtDnghi",
    ];
    total: ItemData = new ItemData({});
    tongDcTang: ItemData = new ItemData({});
    tongDcGiam: ItemData = new ItemData({});
    scrollX: string;
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    maDviTao: any;
    userInfo: any;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.formDetail.lstFiles.push({
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private danhMucService: DanhMucDungChungService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 10, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 10, 1, 0);
            }
        }

        if (this.lstCtietBcao.length == 0) {
            this.lstCtietBcao.push(new ItemData({
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maNoiDung: this.userInfo.MA_DVI,
                noiDung: this.userInfo.TEN_DVI,
                loaiKhoan: "340-341"
            }))
        } else if (!this.lstCtietBcao[0]?.stt) {
            let sttItem = 1
            this.lstCtietBcao.forEach(item => {
                const stt = "0." + sttItem
                item.stt = stt;
                sttItem += sttItem
            })
        }
        this.getTotal();
        this.tinhTong();
        this.getInTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    async getFormDetail() {
        await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietDchinh.forEach(item => {
                        this.lstCtietBcao.push(new ItemData(item))
                    })
                    this.listFile = [];
                    this.formDetail.listIdDeleteFiles = [];
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

    // updateAllChecked(): void {
    //     if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
    //         this.lstCtietBcao = this.lstCtietBcao.map(item => ({
    //             ...item,
    //             checked: true
    //         }));
    //     } else {
    //         this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
    //             ...item,
    //             checked: false
    //         }));
    //     }
    // }

    getTotal() {
        this.total = new ItemData({});
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDchinh])
            if (item.level == 0) {
                this.keys.forEach(key => {
                    this.total[key] = Operator.sum([this.total[key], item[key]]);
                })
            }
        })
    };

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {

        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDchinh;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))

        request.lstCtietDchinh = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.dieuChinhDuToanService.updatePLDieuChinh(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
                        lyDoTuChoi: data.data.lyDoTuChoi,
                        thuyetMinh: data.data.thuyetMinh,
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

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
                this.save(mcn, text);
            }
        });
    }


    handleCancel() {
        this._modalRef.close();
    };


    startEdit(data: any): void {
        const id = data?.id;
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.getTotal();
        this.getInTotal();
        this.updateEditCache();
    };

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };


    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
            edit: false
        };
        this.tinhTong();
    };


    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.dtoanDchinh && item.dtoanDchinh !== null) {
                if (item.dtoanDchinh < 0) {
                    Number(this.tongDieuChinhGiam += Number(item?.dtoanDchinh));
                } else {
                    Number(this.tongDieuChinhTang += Number(item?.dtoanDchinh));
                }
            }

            if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
                if (item.dtoanVuTvqtDnghi < 0) {
                    Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                } else {
                    Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
                }
            }

        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.dtoanKphiCong = Operator.sum([this.editCache[id].data.dtoanKphiNtruoc, this.editCache[id].data.dtoanKphiDaGiao]);
        // this.editCache[id].data.dtoanDchinh = this.editCache[id].data.ncauKphi - this.editCache[id].data.dtoanKphiCong;
        this.editCache[id].data.dtoanDchinh = Operator.sum([this.editCache[id].data.ncauKphi, - this.editCache[id].data.dtoanKphiCong]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, -this.editCache[id].data.dtoanDchinh]);

    };

    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return Utils.laMa(k);
            default:
                return null;
        }
    }

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.quanLyVonPhiService.downFile(file, doc);
    };

    getInTotal() {
        this.tongDcTang.clear()
        this.tongDcGiam.clear()
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanDchinh < 0) {
                    this.tongDcGiam.sum(item);
                }
                else {
                    this.tongDcTang.sum(item);
                }
            }
        })

    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        let header = []
        let fieldOrder = []

        if (this.status.viewAppVal) {
            header = [
                { t: 0, b: 6, l: 0, r: 13, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu: ' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 5, l: 2, r: 2, val: 'Loại Khoản' },
                { t: 4, b: 5, l: 3, r: 3, val: 'Nhu cầu dự toán kinh phí năm ' + (this.namBcao).toString() },

                { t: 4, b: 4, l: 4, r: 6, val: 'Dự toán kinh phí được sử dụng trong năm' },

                { t: 4, b: 5, l: 7, r: 7, val: 'Kinh phí ước thực hiện cả năm' },
                { t: 4, b: 5, l: 8, r: 8, val: 'Dự toán điều chỉnh Tăng(+)/Giảm(-) ' },
                { t: 4, b: 5, l: 9, r: 9, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
                { t: 4, b: 5, l: 10, r: 10, val: 'Ghi chú' },
                { t: 4, b: 5, l: 11, r: 11, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh vàDự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng) (- giảm)' },
                { t: 4, b: 5, l: 12, r: 12, val: 'Ý kiến của đơn vị cấp trên' },

                { t: 5, b: 5, l: 4, r: 4, val: 'Năm trước chuyển sang' },
                { t: 5, b: 5, l: 5, r: 5, val: 'Dự toán đã giao trong năm' },
                { t: 5, b: 5, l: 6, r: 6, val: 'Cộng' },

                { t: 6, b: 6, l: 1, r: 1, val: 'A' },
                { t: 6, b: 6, l: 2, r: 2, val: 'B' },
                { t: 6, b: 6, l: 3, r: 3, val: 'C' },
                { t: 6, b: 6, l: 4, r: 4, val: '1' },
                { t: 6, b: 6, l: 5, r: 5, val: '2' },
                { t: 6, b: 6, l: 6, r: 6, val: '3' },
                { t: 6, b: 6, l: 7, r: 7, val: '4 = 2 + 3' },
                { t: 6, b: 6, l: 8, r: 8, val: '5' },
                { t: 6, b: 6, l: 9, r: 9, val: '6 = 1 - 4' },
                { t: 6, b: 6, l: 10, r: 10, val: '7' },
                { t: 6, b: 6, l: 11, r: 11, val: '8' },
                { t: 6, b: 6, l: 12, r: 12, val: '9' },
                { t: 6, b: 6, l: 13, r: 13, val: '10' },

            ]
            fieldOrder = [
                'stt',
                'noiDung',
                'loaiKhoan',
                'ncauKphi',
                'dtoanKphiNtruoc',
                'dtoanKphiDaGiao',
                'dtoanKphiCong',
                'kphiUocThien',
                'dtoanDchinh',
                'dtoanVuTvqtDnghi',
                'ghiChu',
                'chenhLech',
                'ykienDviCtren',
            ]
        } else {
            header = [
                { t: 0, b: 6, l: 0, r: 9, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu: ' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 5, l: 2, r: 2, val: 'Loại Khoản' },
                { t: 4, b: 5, l: 3, r: 3, val: 'Nhu cầu dự toán kinh phí năm ' + (this.namBcao).toString() },
                { t: 4, b: 4, l: 4, r: 6, val: 'Dự toán kinh phí được sử dụng trong năm' },
                { t: 4, b: 5, l: 7, r: 7, val: 'Kinh phí ước thực hiện cả năm' },
                { t: 4, b: 5, l: 8, r: 8, val: 'Dự toán điều chỉnh Tăng(+)/Giảm(-) ' },
                { t: 4, b: 5, l: 9, r: 9, val: 'Ghi chú' },

                { t: 5, b: 5, l: 4, r: 4, val: 'Năm trước chuyển sang' },
                { t: 5, b: 5, l: 5, r: 5, val: 'Dự toán đã giao trong năm' },
                { t: 5, b: 5, l: 6, r: 6, val: 'Cộng' },

                { t: 6, b: 6, l: 0, r: 0, val: 'A' },
                { t: 6, b: 6, l: 1, r: 1, val: 'B' },
                { t: 6, b: 6, l: 2, r: 2, val: 'C' },
                { t: 6, b: 6, l: 3, r: 3, val: '1' },
                { t: 6, b: 6, l: 4, r: 4, val: '2' },
                { t: 6, b: 6, l: 5, r: 5, val: '3' },
                { t: 6, b: 6, l: 6, r: 6, val: '4 = 2 + 3' },
                { t: 6, b: 6, l: 7, r: 7, val: '5' },
                { t: 6, b: 6, l: 8, r: 8, val: '6 = 1 - 4' },
                { t: 6, b: 6, l: 9, r: 9, val: '7' },

            ]
            fieldOrder = [
                'stt',
                'noiDung',
                'loaiKhoan',
                'ncauKphi',
                'dtoanKphiNtruoc',
                'dtoanKphiDaGiao',
                'dtoanKphiCong',
                'kphiUocThien',
                'dtoanDchinh',
                // 'dtoanVuTvqtDnghi',
                'ghiChu',
                // 'chenhLech',
                // 'ykienDviCtren',
            ]
        }



        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                item[field] = item[field] ? item[field] : ""
                row[field] = field == 'stt' ? this.getChiMuc(item.stt) : item[field]
            })
            return row;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        });

        let row: any = {};
        row = {}
        fieldOrder.forEach(field => {
            if (field == 'noiDung') {
                row[field] = 'Phát sinh điều chỉnh giảm'
            } else {
                if (![
                    "ncauKphi",
                    "dtoanKphiNtruoc",
                    "dtoanKphiDaGiao",
                    "dtoanKphiCong",
                    "kphiUocThien",
                ].includes(field)) {
                    row[field] = (!this.tongDcGiam[field] && this.tongDcGiam[field] !== 0) ? '' : this.tongDcGiam[field];
                } else {
                    row[field] = '';
                }
            }
        })
        filterData.unshift(row)

        row = {}
        fieldOrder.forEach(field => {
            if (field == 'noiDung') {
                row[field] = 'Phát sinh điều chỉnh tăng'
            } else {
                if (![
                    "ncauKphi",
                    "dtoanKphiNtruoc",
                    "dtoanKphiDaGiao",
                    "dtoanKphiCong",
                    "kphiUocThien",
                ].includes(field)) {
                    row[field] = (!this.tongDcTang[field] && this.tongDcTang[field] !== 0) ? '' : this.tongDcTang[field];
                } else {
                    row[field] = '';
                }
            }
        })
        filterData.unshift(row)

        row = {}
        fieldOrder.forEach(field => {
            row[field] = field == 'noiDung' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
        })
        filterData.unshift(row)

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        excelName = excelName + '_BCDC_PL03.xlsx'
        XLSX.writeFile(workbook, excelName);
    }
}

