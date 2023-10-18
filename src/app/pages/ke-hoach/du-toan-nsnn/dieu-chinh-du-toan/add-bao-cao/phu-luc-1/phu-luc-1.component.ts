import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { NOI_DUNG } from './phu-luc-1.constant';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { DanhMucService } from 'src/app/services/danhmuc.service';



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

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    noiDung: string;
    maNoiDung: string;
    dlieuPlucTuongUng: string;
    dtoanKphiNamTruoc: number;
    dtoanKphiNamNay: number;
    tong: number;
    tongDtoanTrongNam: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    tongDchinhTang: number;
    tongDchinhGiam: number;
    tongDchinhTaiDvi: number;
    chenhLech: number;
    ykienDviCtren: string;
    ghiChu: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.tong = Operator.sum([this.dtoanKphiNamTruoc, this.dtoanKphiNamNay]);
        this.dtoanDnghiDchinh = Operator.sum([this.tongDtoanTrongNam, - this.tong])
        this.chenhLech = Operator.sum([this.dtoanVuTvqtDnghi, - this.dtoanDnghiDchinh])
    }

    upperBound() {
        return (
            this.dtoanKphiNamTruoc > Utils.MONEY_LIMIT ||
            this.dtoanKphiNamNay > Utils.MONEY_LIMIT ||
            this.tong > Utils.MONEY_LIMIT ||
            this.tongDtoanTrongNam > Utils.MONEY_LIMIT ||
            this.dtoanDnghiDchinh > Utils.MONEY_LIMIT ||
            this.dtoanVuTvqtDnghi > Utils.MONEY_LIMIT ||
            this.tongDchinhTang > Utils.MONEY_LIMIT ||
            this.tongDchinhGiam > Utils.MONEY_LIMIT ||
            this.tongDchinhTaiDvi > Utils.MONEY_LIMIT ||
            this.chenhLech > Utils.MONEY_LIMIT
        );
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                return String.fromCharCode(k + 96);
            case 3:
                return "";
        }
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

@Component({
    selector: 'app-phu-luc-1',
    templateUrl: './phu-luc-1.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc1Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    amount1 = amount1;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    tongDcTang: ItemData = new ItemData({});
    tongDcGiam: ItemData = new ItemData({});
    chiMoi: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    noiDungs: any[] = [];
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;

    // 
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    scrollX: string;

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
        private dieuChinhDuToanService: DieuChinhService,
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private modal: NzModalService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

    async initialization() {
        this.spinner.show();
        const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL1');
        if (category) {
            this.noiDungs = category.data;
        }
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 11, 1, 60);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 12, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 12, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 11, 1, 0);
            }
        }
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        console.log(
            this.status.editAppVal
        );
        console.log(
            this.status.general
        );

        this.tinhTong();
        this.getTotal();
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
                        this.lstCtietBcao.push(new ItemData(item));
                    })
                    this.formDetail.listIdDeleteFiles = [];
                    this.listFile = [];
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

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt))
    };

    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDnghiDchinh])
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item?.dtoanDnghiDchinh) {
                    if (item?.dtoanDnghiDchinh < 0) {
                        this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh);
                    } else {
                        this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh);
                    }

                    if (item.dtoanVuTvqtDnghi < 0) {
                        this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi);
                    } else {
                        this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi);
                    }
                }
            }
        })
    };

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.lstCtietBcao[index].clear();
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].sum(item);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.clear();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    }

    startEdit(id: string): void {
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.tinhTong();
        this.getInTotal();
        this.updateEditCache();
    };

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
            edit: false
        };
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
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
            lstCtietBcaoTemp.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
        }

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
                this.save(mcn, text);
            }
        });
    }

    doPrint() {

    };

    handleCancel() {
        this._modalRef.close();
    };

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
    }

    getInTotal() {
        this.tongDcTang.clear()
        this.tongDcGiam.clear()
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanVuTvqtDnghi < 0) {
                    this.tongDcGiam.sum(item);
                }
                else {
                    this.tongDcTang.sum(item);
                }
            }
        })
        console.log(this.tongDcGiam);
        console.log(this.tongDcTang);

    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        let header = [];
        let fieldOrder = [];

        if (this.status.viewAppVal) {
            header = [
                { t: 0, b: 7, l: 0, r: 10, val: null },
                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 6, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 5, l: 2, r: 4, val: 'Dự toán, kinh phí được sử dụng trong năm' },
                { t: 4, b: 6, l: 5, r: 5, val: 'Tổng nhu cầu dự toán trong năm' },
                { t: 4, b: 6, l: 6, r: 6, val: 'Dự toán đề nghị điều chỉnh(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 7, r: 7, val: 'Dự toán Vụ TVQT đề nghị(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 8, r: 8, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 9, r: 9, val: 'Ý kiến của đơn vị cấp trên' },
                { t: 4, b: 6, l: 10, r: 10, val: 'Ghi chú' },

                { t: 6, b: 6, l: 2, r: 2, val: 'Dự toán năm trước chuyển sang < br > được cho phép sử dụng cho năm nay' },
                { t: 6, b: 6, l: 3, r: 3, val: 'Dự toán, kinh phí đã giao trong năm' },
                { t: 6, b: 6, l: 4, r: 4, val: 'Cộng' },

                { t: 7, b: 7, l: 0, r: 0, val: 'A' },
                { t: 7, b: 7, l: 1, r: 1, val: 'B' },
                { t: 7, b: 7, l: 2, r: 2, val: '1' },
                { t: 7, b: 7, l: 3, r: 3, val: '2' },
                { t: 7, b: 7, l: 4, r: 4, val: '3 = 2 + 1' },
                { t: 7, b: 7, l: 5, r: 5, val: '4' },
                { t: 7, b: 7, l: 6, r: 6, val: '5 = 4 - 3' },
                { t: 7, b: 7, l: 7, r: 7, val: '6' },
                { t: 7, b: 7, l: 8, r: 8, val: '7 = 6 - 5' },
                { t: 7, b: 7, l: 9, r: 9, val: '8' },
                { t: 7, b: 7, l: 10, r: 10, val: '9' },
            ]
            fieldOrder = [
                'stt',
                'noiDung',
                'dtoanKphiNamTruoc',
                'dtoanKphiNamNay',
                'tong',
                'tongDtoanTrongNam',
                'dtoanDnghiDchinh',
                'dtoanVuTvqtDnghi',
                'chenhLech',
                'ykienDviCtren',
                'ghiChu',
            ]
        } else {
            header = [
                { t: 0, b: 7, l: 0, r: 10, val: null },
                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },

                { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 6, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 5, l: 2, r: 4, val: 'Dự toán, kinh phí được sử dụng trong năm' },
                { t: 4, b: 6, l: 5, r: 5, val: 'Tổng nhu cầu dự toán trong năm' },
                { t: 4, b: 6, l: 6, r: 6, val: 'Dự toán đề nghị điều chỉnh(+ tăng)(- giảm)' },
                // { t: 4, b: 6, l: 7, r: 7, val: 'Dự toán Vụ TVQT đề nghị(+ tăng)(- giảm)' },
                // { t: 4, b: 6, l: 8, r: 8, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị(+ tăng)(- giảm)' },
                // { t: 4, b: 6, l: 9, r: 9, val: 'Ý kiến của đơn vị cấp trên' },
                // { t: 4, b: 6, l: 10, r: 10, val: 'Ghi chú' },

                { t: 6, b: 6, l: 2, r: 2, val: 'Dự toán năm trước chuyển sang < br > được cho phép sử dụng cho năm nay' },
                { t: 6, b: 6, l: 3, r: 3, val: 'Dự toán, kinh phí đã giao trong năm' },
                { t: 6, b: 6, l: 4, r: 4, val: 'Cộng' },

                { t: 7, b: 7, l: 0, r: 0, val: 'A' },
                { t: 7, b: 7, l: 1, r: 1, val: 'B' },
                { t: 7, b: 7, l: 2, r: 2, val: '1' },
                { t: 7, b: 7, l: 3, r: 3, val: '2' },
                { t: 7, b: 7, l: 4, r: 4, val: '3 = 2 + 1' },
                { t: 7, b: 7, l: 5, r: 5, val: '4' },
                { t: 7, b: 7, l: 6, r: 6, val: '5 = 4 - 3' },
                // { t: 7, b: 7, l: 7, r: 7, val: '6' },
                // { t: 7, b: 7, l: 8, r: 8, val: '7 = 6 - 5' },
                // { t: 7, b: 7, l: 9, r: 9, val: '8' },
                // { t: 7, b: 7, l: 10, r: 10, val: '9' },
            ]
            fieldOrder = [
                'stt',
                'noiDung',
                'dtoanKphiNamTruoc',
                'dtoanKphiNamNay',
                'tong',
                'tongDtoanTrongNam',
                'dtoanDnghiDchinh',
                // 'dtoanVuTvqtDnghi',
                // 'chenhLech',
                // 'ykienDviCtren',
                // 'ghiChu',
            ]
        }


        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        let row: any = {};


        row = {}
        fieldOrder.forEach(field => {
            if (field == 'noiDung') {
                row[field] = 'Phát sinh điều chỉnh giảm'
            } else {
                if (![
                    'tongDtoanTrongNam',
                    'dtoanKphiNamTruoc',
                    'dtoanKphiNamNay',
                    'tong',
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
                    'tongDtoanTrongNam',
                    'dtoanKphiNamTruoc',
                    'dtoanKphiNamNay',
                    'tong',
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        excelName = excelName + '_BCDC_PL01.xlsx'
        XLSX.writeFile(workbook, excelName);
    }

}
