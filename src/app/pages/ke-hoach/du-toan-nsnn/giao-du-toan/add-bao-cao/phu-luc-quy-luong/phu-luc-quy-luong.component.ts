import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    bcheNamDuocGiao: number;
    bcheCoMat: number;
    bcheChuaTuyen: number;
    tienLuongBcheCoMat: number;
    cacKhoanDongGop: number;
    luongCBCC: number;
    cacKhoanLuongKhac: number;
    tongNcauTienLuong: number;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.bcheNamDuocGiao = Operator.sum([this.bcheCoMat, this.bcheChuaTuyen])
        this.tongNcauTienLuong = Operator.sum([this.tienLuongBcheCoMat, this.cacKhoanDongGop, this.luongCBCC, this.cacKhoanLuongKhac])
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return String.fromCharCode(n + 96);
            case 2:
                return "";
        }
    }

    upperBound() {
        return this.luongCBCC > Utils.MONEY_LIMIT;
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
    selector: 'app-phu-luc-quy-luong',
    templateUrl: './phu-luc-quy-luong.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLucQuyLuongComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    listVtu: any[] = [];
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
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private giaoDuToanService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 8, 1, 360);
        } else {
            this.scrollX = Table.tableWidth(350, 8, 1, 0);
        }

        if (this.lstCtietBcaos.length == 0) {
            this.lstCtietBcaos.push(new ItemData({
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maDvi: this.dataInfo.maDvi,
                tenDvi: this.dataInfo.tenDvi,
            }))
            this.setLevel();
        }
        else if (!this.lstCtietBcaos[0]?.stt) {
            let sttItem = 1
            this.lstCtietBcaos.forEach(item => {
                const stt = "0." + sttItem
                item.stt = stt;
                sttItem++
            })
        }
        //
        this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos);
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    setLevel() {
        this.lstCtietBcaos.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

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


    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    getTotal() {
        this.total.clear();
        this.lstCtietBcaos.forEach(item => {
            this.total.sum(item);
        })

    };

    updateEditCache(): void {
        this.lstCtietBcaos.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };

    // luu
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
            const id = iterator?.lastModified.toString();
            const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))

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


    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcaos.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcaos[index].stt);
        this.getTotal();
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

    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcaos[index]),
            edit: false
        };
    };

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

    exportToExcel() {
        if (this.lstCtietBcaos.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const header = [
            { t: 0, b: 6, l: 0, r: 9, val: null },

            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },

            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Tên đơn vị (Biên chế thực tế có mặt)' },
            { t: 4, b: 5, l: 2, r: 2, val: 'Biên chế năm ' + (this.namBcao).toString() + 'được giao' },
            { t: 4, b: 5, l: 3, r: 3, val: 'Biên chế có mặt' },
            { t: 4, b: 5, l: 4, r: 4, val: 'Biên chế chưa tuyển' },
            { t: 4, b: 5, l: 5, r: 5, val: 'Tiền lương biên chế thực tế có mặt' },
            { t: 4, b: 5, l: 6, r: 6, val: 'Các khoản đóng góp theo lương của biên chế thực tế' },
            { t: 4, b: 5, l: 7, r: 7, val: 'Lương CBCC chưa tuyển dụng' },
            { t: 4, b: 5, l: 8, r: 8, val: 'Các khoản lương khác theo chế độ' },
            { t: 4, b: 5, l: 9, r: 9, val: 'Tổng nhu cầu tiền lương năm ' + (this.namBcao).toString() + ' (năm kế hoạch)' },

            { t: 6, b: 6, l: 0, r: 0, val: 'A' },
            { t: 6, b: 6, l: 1, r: 1, val: 'B' },
            { t: 6, b: 6, l: 2, r: 2, val: '1 = 2 + 3' },
            { t: 6, b: 6, l: 3, r: 3, val: '2' },
            { t: 6, b: 6, l: 4, r: 4, val: '3' },
            { t: 6, b: 6, l: 5, r: 5, val: '4' },
            { t: 6, b: 6, l: 6, r: 6, val: '5' },
            { t: 6, b: 6, l: 7, r: 7, val: '6' },
            { t: 6, b: 6, l: 8, r: 8, val: '7' },
            { t: 6, b: 6, l: 9, r: 9, val: '8 = 4 + 5 + 6 + 7' },

        ]
        const fieldOrder = [
            "stt",
            "tenDvi",
            "bcheNamDuocGiao",
            "bcheCoMat",
            "bcheChuaTuyen",
            "tienLuongBcheCoMat",
            "cacKhoanDongGop",
            "luongCBCC",
            "cacKhoanLuongKhac",
            "tongNcauTienLuong",
        ]

        const filterData = this.lstCtietBcaos.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                item[field] = item[field] ? item[field] : ""
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        let row: any = {};
        row = {}
        fieldOrder.forEach(field => {
            row[field] = field == 'tenDvi' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
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
        excelName = excelName + '_GSTC_PL06.xlsx'
        XLSX.writeFile(workbook, excelName);
    }


}


