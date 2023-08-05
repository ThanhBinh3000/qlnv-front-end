import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
import { DANH_MUC } from './phu-luc-dao-tao.constant';
export class ItemData {
    level: any;
    id: string;
    stt: string;
    tenNoiDung: string;
    maNoiDung: string;
    doiTuong: string;
    thoiGianHoc: string;
    sluongTrongNuoc: number;
    sluongNgoaiNuoc: number;
    sluongTongSo: number;
    kinhPhiHoTro: number;
    tongCauDtoanKp: number;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.sluongTongSo = Operator.sum([this.sluongTrongNuoc, this.sluongNgoaiNuoc]);
        this.tongCauDtoanKp = Operator.mul(this.sluongTongSo, this.kinhPhiHoTro);
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return "-";
        }
    }

    upperBound() {
        return this.tongCauDtoanKp > Utils.MONEY_LIMIT;
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

export const AMOUNT1 = {
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
    selector: 'app-phu-luc-dao-tao',
    templateUrl: './phu-luc-dao-tao.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLucDaoTaoComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    noiDungs: any[] = DANH_MUC;
    lstCtietBcaos: ItemData[] = [];
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
        private giaoDuToanService: GiaoDuToanChiService,
        private fileManip: FileManip,
    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }
    async initialization() {
        // const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL10');
        // if (category) {
        //   category.data.forEach(
        //     item => {
        //       this.noiDungs.push({
        //         ...item,
        //         level: item.ma?.split('.').length - 2,
        //         giaTri: getName(this.namBcao, item.giaTri),
        //       })
        //     }
        //   )
        // }

        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 8, 1, 360);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 8, 1, 0);
            }
        }

        if (this.lstCtietBcaos.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcaos.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenNoiDung: e.giaTri,
                    maNoiDung: e.ma,
                }))
            })
            this.setLevel();
        } else if (!this.lstCtietBcaos[0]?.stt) {
            this.lstCtietBcaos.forEach(item => {
                item.stt = item.maNoiDung;
            })
        }

        if (this.lstCtietBcaos.length > 0) {
            if (!this.lstCtietBcaos[0]?.stt) {
                this.lstCtietBcaos = Table.sortWithoutIndex(this.lstCtietBcaos, 'maNoiDung');
            } else {
                this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos);
            }
        }

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };


    async getFormDetail() {
        await this.giaoDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietBcaos.forEach(item => {
                        this.lstCtietBcaos.push(new ItemData(item));
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


    setLevel() {
        this.lstCtietBcaos.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    updateEditCache(): void {
        this.lstCtietBcaos.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };

    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcaos.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcaos.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcaos.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })


        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }

        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
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

    addLine(data: any) {
        let parentItem: ItemData = this.lstCtietBcaos.find(e => Table.preIndex(e.stt) == data.stt);
        parentItem = new ItemData({
            id: uuid.v4() + 'FE',
            maNoiDung: "",
            level: data.level + 1,
            tenNoiDung: "",
        })
        this.lstCtietBcaos = Table.addChild(data.id, parentItem, this.lstCtietBcaos);
        this.updateEditCache();
    };

    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcaos = Table.addChild(id, initItem, this.lstCtietBcaos);
    };

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 1) {
            return true;
        }
        return false;
    };

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcaos.findIndex(e => e.stt == stt);
            this.lstCtietBcaos[index].clear();
            this.lstCtietBcaos.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcaos[index].sum(item);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    deleteLine(id: string) {
        const stt = this.lstCtietBcaos.find(e => e.id === id)?.stt;
        this.lstCtietBcaos = Table.deleteRow(id, this.lstCtietBcaos);
        this.sum(stt);
        this.updateEditCache();
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcaos.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.lstCtietBcaos.forEach(e => {
            e.maNoiDung = e.stt
        })
        this.sum(this.lstCtietBcaos[index].stt);
        this.getTotal()
        this.updateEditCache();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcaos[index]),
            edit: false
        };
    };
    checkAdd(stt: string) {
        if (
            stt == "0.1" ||
            stt == "0.2" ||
            stt == "0.3" ||
            stt == "0.4"
        ) {
            return true;
        }
        return false;
    };

    getTotal() {
        this.total.clear();
        this.lstCtietBcaos.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }

    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.fileManip.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 8, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Nội dung đào tạo, bồi dưỡng' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Đối tượng' },
            { t: 0, b: 1, l: 3, r: 3, val: 'Thời gian học' },
            { t: 0, b: 0, l: 4, r: 6, val: 'Số lượng' },
            { t: 0, b: 1, l: 7, r: 7, val: 'Kinh phí hỗ trợ(đồng/người)' },
            { t: 0, b: 1, l: 8, r: 8, val: 'Tổng nhu cầu dự toán, kinh phí' },

            { t: 1, b: 1, l: 4, r: 4, val: 'Số lượng' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Định mức' },
            { t: 1, b: 1, l: 6, r: 6, val: 'Thành tiền' },

        ]
        const fieldOrder = [
            "stt",
            "tenNoiDung",
            "doiTuong",
            "thoiGianHoc",
            "sluongTrongNuoc",
            "sluongNgoaiNuoc",
            "sluongTongSo",
            "kinhPhiHoTro",
            "tongCauDtoanKp",
        ]

        const filterData = this.lstCtietBcaos.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        if (this.dataInfo.maBieuMau == "pl01N") {
            excelName = excelName + '_Phu_luc_I_nhap.xlsx'
        } else {
            excelName = excelName + '_Phu_luc_I_xuat.xlsx'
        }
        XLSX.writeFile(workbook, excelName);
    }

}
