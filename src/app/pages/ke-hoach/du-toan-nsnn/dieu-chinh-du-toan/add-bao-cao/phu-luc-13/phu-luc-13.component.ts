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
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { DANH_MUC } from './phu-luc-13.constant';
import { CurrencyMaskInputMode } from 'ngx-currency';

export class ItemData {
    level: any;
    id: string;
    stt: string;
    tenNoiDung: string;
    maNoiDung: string;
    dtoanNamTruoc: number;
    dtoanDaGiao: number;
    dtoanTongSo: number;
    tongNCDtoanKp: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.dtoanTongSo = Operator.sum([this.dtoanNamTruoc, this.dtoanDaGiao]);
        this.dtoanDnghiDchinh = Operator.sum([this.tongNCDtoanKp, - this.dtoanTongSo]);
        this.chenhLech = Operator.sum([this.dtoanVuTvqtDnghi, - this.dtoanDnghiDchinh]);
    }

    upperBound() {
        return this.dtoanNamTruoc > Utils.MONEY_LIMIT || this.dtoanDaGiao > Utils.MONEY_LIMIT || this.dtoanTongSo > Utils.MONEY_LIMIT || this.tongNCDtoanKp > Utils.MONEY_LIMIT || this.dtoanDnghiDchinh > Utils.MONEY_LIMIT || this.dtoanVuTvqtDnghi > Utils.MONEY_LIMIT;
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return "-";
            default:
                return null;
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
    selector: 'app-phu-luc-13',
    templateUrl: './phu-luc-13.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc13Component implements OnInit {

    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    amount1 = amount1;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    tongDcTang: ItemData = new ItemData({});
    tongDcGiam: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dtoanVuTang: number;
    dtoanVuGiam: number;

    //danh muc
    noiDungs: any[] = DANH_MUC;
    lstCtietBcao: ItemData[] = [];
    scrollX: string;

    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

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
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private modal: NzModalService,
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private dieuChinhDuToanService: DieuChinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }
    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            // const category = await this.danhMucService.danhMucChungGetAll('LTD_PL2');
            // if (category) {
            // this.linhVucChis = category.data;
            // }
            this.scrollX = Table.tableWidth(350, 10, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 14, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 14, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 10, 1, 0);
            }
        }
        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenNoiDung: e.giaTri,
                    maNoiDung: e.ma,
                    dtoanDnghiDchinh: null,
                    dtoanVuTvqtDnghi: null,
                }))
            })
            this.setLevel();
            // this.lstCtietBcao.forEach(item => {
            //     item.tenNoiDung = Utils.getName(item.level, item.maNoiDung);
            // })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNoiDung;
            })
        }

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
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

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };

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
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
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
    };

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
    };

    doPrint() {

    };

    handleCancel() {
        this._modalRef.close();
    };

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal();
        this.tinhTong();
        this.getInTotal();
        this.updateEditCache();
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
        this.tinhTong()
    }

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
            edit: false
        };
    };

    checkAdd(data: ItemData) {
        if (
            data.level == 1
        ) {
            return true;
        }
        return false;
    };

    addLine(data: any) {
        let parentItem: ItemData = this.lstCtietBcao.find(e => Table.preIndex(e.stt) == data.stt);
        parentItem = new ItemData({
            id: uuid.v4() + 'FE',
            maNoiDung: "",
            level: data.level + 1,
            tenNoiDung: "",
        }),
            this.lstCtietBcao = Table.addChild(data.id, parentItem, this.lstCtietBcao);
        this.updateEditCache();
    };


    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 2) {
            return true;
        }
        return false;
    };

    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
    }

    getTotal() {
        this.total.clear();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }


    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dtoanVuTang = 0;
        this.dtoanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDnghiDchinh])
            const str = item.stt
            if (item.level == 1) {

                if (item.dtoanDnghiDchinh && item.dtoanDnghiDchinh !== null) {
                    if (item.dtoanDnghiDchinh < 0) {
                        Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh));
                    } else {
                        Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh));
                    }
                }

                if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
                    if (item.dtoanVuTvqtDnghi < 0) {
                        Number(this.dtoanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                    } else {
                        Number(this.dtoanVuTang += Number(item?.dtoanVuTvqtDnghi));
                    }
                }
            }
        })
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
    };


    getInTotal() {
        this.tongDcTang.clear()
        this.tongDcGiam.clear()
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanDnghiDchinh < 0) {
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
                { t: 4, b: 6, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 1, l: 2, r: 4, val: 'Dự toán, kinh phí được sử dụng trong năm' },
                { t: 4, b: 6, l: 5, r: 5, val: 'Tổng nhu cầu dự toán, kinh phí' },
                { t: 4, b: 6, l: 6, r: 6, val: 'Dự toán đề nghị điều chỉnh<br>(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 7, r: 7, val: 'Dự toán Vụ TVQT đề nghị<br>(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 8, r: 8, val: 'Ghi chú' },
                { t: 4, b: 6, l: 9, r: 9, val: 'Dự toán chênh lệch < br > giữa Vụ TVQT điều chỉnh < br > và đơn vị đề nghị<br>(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 10, r: 10, val: 'Ý kiến của đơn vị cấp trên' },


                { t: 6, b: 6, l: 2, r: 2, val: 'Dự toán năm trước chuyển sang được < br > phép sử dụng cho năm nay' },
                { t: 6, b: 6, l: 3, r: 3, val: 'Dự toán, kinh phí đã giao trong năm' },
                { t: 6, b: 6, l: 4, r: 4, val: 'Tổng số' },



                { t: 7, b: 7, l: 0, r: 0, val: 'A' },
                { t: 7, b: 7, l: 1, r: 1, val: 'B' },
                { t: 7, b: 7, l: 2, r: 2, val: '1' },
                { t: 7, b: 7, l: 3, r: 3, val: '2' },
                { t: 7, b: 7, l: 4, r: 4, val: '3 = 1 + 2' },
                { t: 7, b: 7, l: 5, r: 5, val: '4' },
                { t: 7, b: 7, l: 6, r: 6, val: '5 = 4 - 3' },
                { t: 7, b: 7, l: 7, r: 7, val: '6' },
                { t: 7, b: 7, l: 8, r: 8, val: '7' },
                { t: 7, b: 7, l: 9, r: 9, val: '8 = 6 - 5' },
                { t: 7, b: 7, l: 10, r: 10, val: '9' },

            ]
            fieldOrder = [
                'stt',
                'tenNoiDung',
                'dtoanNamTruoc',
                'dtoanDaGiao',
                'dtoanTongSo',
                'tongNCDtoanKp',
                'dtoanDnghiDchinh',
                'dtoanVuTvqtDnghi',
                'ghiChu',
                'chenhLech',
                'ykienDviCtren',
            ]
        } else {
            header = [
                { t: 0, b: 7, l: 0, r: 10, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },

                { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 6, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 1, l: 2, r: 4, val: 'Dự toán, kinh phí được sử dụng trong năm' },
                { t: 4, b: 6, l: 5, r: 5, val: 'Tổng nhu cầu dự toán, kinh phí' },
                { t: 4, b: 6, l: 6, r: 6, val: 'Dự toán đề nghị điều chỉnh<br>(+ tăng)(- giảm)' },
                { t: 4, b: 6, l: 7, r: 7, val: 'Ghi chú' },


                { t: 6, b: 6, l: 2, r: 2, val: 'Dự toán năm trước chuyển sang được < br > phép sử dụng cho năm nay' },
                { t: 6, b: 6, l: 3, r: 3, val: 'Dự toán, kinh phí đã giao trong năm' },
                { t: 6, b: 6, l: 4, r: 4, val: 'Tổng số' },



                { t: 7, b: 7, l: 0, r: 0, val: 'A' },
                { t: 7, b: 7, l: 1, r: 1, val: 'B' },
                { t: 7, b: 7, l: 2, r: 2, val: '1' },
                { t: 7, b: 7, l: 3, r: 3, val: '2' },
                { t: 7, b: 7, l: 4, r: 4, val: '3 = 1 + 2' },
                { t: 7, b: 7, l: 5, r: 5, val: '4' },
                { t: 7, b: 7, l: 6, r: 6, val: '5 = 4 - 3' },
                { t: 7, b: 7, l: 7, r: 7, val: '6' },

            ]
            fieldOrder = [
                'stt',
                'tenNoiDung',
                'dtoanNamTruoc',
                'dtoanDaGiao',
                'dtoanTongSo',
                'tongNCDtoanKp',
                'dtoanDnghiDchinh',
                'ghiChu',
            ]
        }



        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        });

        let row: any = {};
        row = {}
        fieldOrder.forEach(field => {
            if (field == 'tenNoiDung') {
                row[field] = 'Phát sinh điều chỉnh giảm'
            } else {
                if (![
                    'dtoanNamTruoc',
                    'dtoanDaGiao',
                    'dtoanTongSo',
                    'tongNCDtoanKp',

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
            if (field == 'tenNoiDung') {
                row[field] = 'Phát sinh điều chỉnh tăng'
            } else {
                if (![
                    'dtoanNamTruoc',
                    'dtoanDaGiao',
                    'dtoanTongSo',
                    'tongNCDtoanKp',
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
            row[field] = field == 'tenNoiDung' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
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
        excelName = excelName + '_BCDC_PL13.xlsx'
        XLSX.writeFile(workbook, excelName);
    }


}
