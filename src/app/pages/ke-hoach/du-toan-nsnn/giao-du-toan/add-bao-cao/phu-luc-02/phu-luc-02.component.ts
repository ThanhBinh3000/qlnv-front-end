import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
export class ItemData {
    id: any;
    danhMuc: string;
    maDmuc: string;
    tenDanhMuc: string;
    maDviTinh: string;
    namDtDmuc: number;
    namDtSluong: number;
    namDtTtien: number;
    stt: string;
    level: any;
    checked: boolean;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        if (this.namDtDmuc) {
            this.namDtTtien = Operator.mul(this.namDtDmuc, this.namDtSluong);
        }
    }

    upperBound() {
        return this.namDtTtien > Utils.MONEY_LIMIT;
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

    clear() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'level') {
                this[key] = null;
            }
        })
    }

    sum(data: ItemData) {
        Object.keys(data).forEach(key => {
            if (!['level', 'namDtSluong', 'namDtDmuc'].includes(key) && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
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
    selector: 'app-phu-luc-02',
    templateUrl: './phu-luc-02.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})

export class PhuLuc02Component implements OnInit {
    @Input() dataInfo;

    Op = new Operator('1');
    Utils = Utils;

    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;

    //danh muc
    linhVucChis: any[] = [];
    lstCtietBcaos: ItemData[] = [];
    listVattu: any[] = [];
    lstVatTuFull = [];
    dsDinhMuc: any[] = [];
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
        private quanLyVonPhiService: QuanLyVonPhiService,
        public userService: UserService,
    ) {
    }


    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }


    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;

        await this.getDinhMuc();
        // if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == Status.NEW) {
        this.lstCtietBcaos.forEach(item => {
            const dinhMuc = this.dsDinhMuc.find(e => (e.cloaiVthh == item.danhMuc || e.loaiVthh == item.danhMuc) && e.maDinhMuc == item.maDmuc);
            if (!item.tenDanhMuc) {
                item.tenDanhMuc = dinhMuc?.tenDinhMuc;
            }
            item.namDtDmuc = dinhMuc?.tongDmuc;
            item.maDviTinh = dinhMuc?.donViTinh;
            item.changeModel();
        })
        // }
        if (!this.lstCtietBcaos[0]?.stt) {
            this.setIndex();
        }

        this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos);
        this.sum1()
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


    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '03',
            maDvi: this.dataInfo?.maDvi,
        }
        await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMuc = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    setIndex() {
        const lstVtuTemp = this.lstCtietBcaos.filter(e => !e.maDmuc);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcaos.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcaos[index].stt = stt;
            const lstDmTemp = this.lstCtietBcaos.filter(e => e.danhMuc == lstVtuTemp[i].danhMuc && !!e.maDmuc);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcaos.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcaos[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
        lstVtuTemp.forEach(item => {
            this.sum(item.stt);
        })
    }

    sum1() {
        this.lstCtietBcaos.forEach(item => {
            this.sum(item.stt);
        })
    }


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

    //show popup tu choi
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

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcaos[index].stt);
        this.getTotal();
        this.updateEditCache();
    }
    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcaos[index]),
            edit: false
        };
        this.getTotal();
    }

    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcaos.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcaos.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcaos.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    }

    // start edit
    startEdit(id: string): void {
        if (this.lstCtietBcaos.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    }

    deleteLine(id: string) {
        const stt = this.lstCtietBcaos.find(e => e.id === id)?.stt;
        this.lstCtietBcaos = Table.deleteRow(id, this.lstCtietBcaos);
        this.sum(stt);
        this.updateEditCache();
    }


    selectGoods() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogDanhSachVatTuHangHoaComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (data) => {
            if (data) {
                if (this.lstCtietBcaos.findIndex(e => e.danhMuc == data.ma) == -1) {
                    //tim so thu tu cho loai vat tu moi
                    let index = 1;
                    this.lstCtietBcaos.forEach(item => {
                        if (item.danhMuc && !item.maDmuc) {
                            index += 1;
                        }
                    })
                    const stt = '0.' + index.toString();
                    //them vat tu moi vao bang
                    this.lstCtietBcaos.push(new ItemData({

                        id: uuid.v4() + 'FE',
                        stt: stt,
                        danhMuc: data.ma,
                        tenDanhMuc: data.ten,
                        level: 0,
                    }))
                    const lstTemp = this.dsDinhMuc.filter(e => (!e.cloaiVthh && e.loaiVthh == data.ma) || e.cloaiVthh == data.ma);
                    for (let i = 1; i <= lstTemp.length; i++) {
                        this.lstCtietBcaos.push(new ItemData({

                            id: uuid.v4() + 'FE',
                            stt: stt + '.' + i.toString(),
                            danhMuc: data.ma,
                            maDmuc: lstTemp[i - 1].maDinhMuc,
                            tenDanhMuc: lstTemp[i - 1].tenDinhMuc,
                            maDviTinh: lstTemp[i - 1].donViTinh,
                            level: 1,
                            namDtDmuc: lstTemp[i - 1].tongDmuc,
                        }))
                    }
                    this.updateEditCache();
                }
            }
        });
    }

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

    getTotal() {
        this.total.clear();
        this.lstCtietBcaos.forEach(item => {
            if (item.level == "0") {
                this.total.sum(item);
            }
        })

    }

    // gan editCache.data == lstCtietBcaos
    updateEditCache(): void {
        this.lstCtietBcaos.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

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
            { t: 0, b: 7, l: 0, r: 5, val: null },

            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },

            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Danh mục' },
            { t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 4, b: 5, l: 3, r: 3, val: 'Năm dự toán ' + (this.namBcao - 1).toString() },

            { t: 6, b: 6, l: 3, r: 3, val: 'Số lượng bảo quản' },
            { t: 6, b: 6, l: 4, r: 4, val: 'Định mức' },
            { t: 6, b: 6, l: 5, r: 5, val: 'Thành tiền' },

            { t: 7, b: 7, l: 0, r: 0, val: 'A' },
            { t: 7, b: 7, l: 1, r: 1, val: 'B' },
            { t: 7, b: 7, l: 2, r: 2, val: 'C' },
            { t: 7, b: 7, l: 3, r: 3, val: '1' },
            { t: 7, b: 7, l: 4, r: 4, val: '2' },
            { t: 7, b: 7, l: 5, r: 5, val: '3 = 1 x 2' },
        ]
        const fieldOrder = [
            "stt",
            "tenDanhMuc",
            "maDviTinh",
            "namDtSluong",
            "namDtDmuc",
            "namDtTtien",
        ]

        const filterData = this.lstCtietBcaos.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })


        let row: any = {};
        fieldOrder.forEach(field => {
            if (field == 'tenDanhMuc') {
                row[field] = 'Tổng cộng'
            } else {
                if (!['namDtSluong', 'namDtDmuc'].includes(field)) {
                    row[field] = (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
                } else {
                    row[field] = '';
                }
            }
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
        excelName = excelName + '_GSTC_PL02.xlsx'
        XLSX.writeFile(workbook, excelName);
    }

}
