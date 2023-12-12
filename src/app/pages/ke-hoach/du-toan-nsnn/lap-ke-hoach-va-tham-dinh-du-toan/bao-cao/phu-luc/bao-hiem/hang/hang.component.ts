import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';
export class ItemData {
    id: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    maDiaChiKho: string;
    tenDiaChiKho: string;
    maNhaKho: string;
    tenNhaKho: string;
    khoiTich: number;
    maHang: string;
    tenHang: string;
    soLuong: number;
    giaTri: number;
    unitSpan: number;
    locationSpan: number;
    storehouseSpan: number;
    level: number;
}

@Component({
    selector: 'app-hang',
    templateUrl: './hang.component.html',
    styleUrls: ['../../../bao-cao.component.scss']
})
export class HangComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    //danh muc
    donVi: any;
    lstHang: any[] = [];
    lstCtietBcao: ItemData[] = [];
    scrollX: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
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
        private danhMucService: DanhMucDungChungService,
        private lapThamDinhService: LapThamDinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        if (this.status.general) {
            await this.getDmKho();
            const category = await this.danhMucService.danhMucChungGetAll('LTD_BH');
            if (category) {
                category.data.forEach(item => {
                    if (category.data.findIndex(e => Table.preIndex(e.ma) == item.ma) == -1) {
                        this.lstHang.push(item);
                    }
                })
                this.lstHang = this.lstHang.filter(e => e.ma != '0.1');
            }
            this.scrollX = Table.tableWidth(500, 4, 0, 160);
        } else {
            this.scrollX = Table.tableWidth(500, 4, 0, 0);
        }
        if (this.lstCtietBcao.length == 0) {
            this.donVi?.children.forEach(diaDiem => {
                diaDiem?.children.forEach(kho => {
                    this.lstCtietBcao.push({
                        ...new ItemData(),
                        id: uuid.v4() + 'FE',
                        stt: '0.1',
                        maDvi: this.donVi.maDvi,
                        tenDvi: this.donVi.tenDvi,
                        maDiaChiKho: diaDiem.maDvi,
                        tenDiaChiKho: diaDiem.tenDvi,
                        maNhaKho: kho.maDvi,
                        tenNhaKho: kho.tenDvi,
                    })
                })
            })
        }

        this.sortReport();
        if (this.formDetail.trangThai == Status.NEW && this.dataInfo.isSynthetic) {
            this.lstCtietBcao.forEach(item => {
                if (item.level == 0) {
                    this.sum(item.stt + '.1');
                }
            })
        }
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getDmKho() {
        const request = {
            maDvi: this.dataInfo.maDvi,
            type: ["MLK", "DV"],
        }
        await this.quanLyVonPhiService.dmKho(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.donVi = res.data[0];
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
    }

    getIndex(stt: string) {
        const lst = stt.split('.');
        switch (lst?.length) {
            case 2:
                return Utils.laMa(parseInt(lst[1], 10));
            case 3:
                return lst[2];
            default:
                return null;
        }
    }

    async getFormDetail() {
        await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
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

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.formDetail.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.giaTri > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
            })
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))

        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
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

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maHang) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn hàng DTQG');
            return;
        }
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        if (this.lstCtietBcao[index].storehouseSpan) {
            this.lstCtietBcao.forEach(item => {
                if (item.id != id && item.maDvi == this.lstCtietBcao[index].maDvi &&
                    item.maDiaChiKho == this.lstCtietBcao[index].maDiaChiKho && item.maNhaKho == this.lstCtietBcao[index].maNhaKho) {
                    item.khoiTich = this.lstCtietBcao[index].khoiTich;
                }
            })
        }
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    addLine(id: string) {
        const index = this.lstCtietBcao.findIndex(e => e.id === id);
        const item: ItemData = {
            ...this.lstCtietBcao[index],
            id: uuid.v4() + 'FE',
            maHang: null,
            tenHang: null,
            soLuong: null,
            giaTri: null,
        }
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
        this.setRowSpan();
    }

    deleteLine(id: string) {
        const index = this.lstCtietBcao.findIndex(e => e.id == id);
        const count = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[index].maDvi && e.maDiaChiKho == this.lstCtietBcao[index].maDiaChiKho && e.maNhaKho == this.lstCtietBcao[index].maNhaKho)?.length;
        if (count && count > 1) {
            this.lstCtietBcao = this.lstCtietBcao.filter(e => e.id != id);
        } else {
            this.lstCtietBcao[index].khoiTich = null;
            this.lstCtietBcao[index].maHang = null;
            this.lstCtietBcao[index].tenHang = null;
            this.lstCtietBcao[index].soLuong = null;
            this.lstCtietBcao[index].giaTri = null;
        }
        this.getTotal();
        this.setRowSpan();
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.lstCtietBcao[index].soLuong = null;
            this.lstCtietBcao[index].giaTri = null;
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    // this.lstCtietBcao[index].soLuong = Operator.sum([this.lstCtietBcao[index].soLuong, item.soLuong]);
                    this.lstCtietBcao[index].giaTri = Operator.sum([this.lstCtietBcao[index].giaTri, item.giaTri]);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.giaTri = Operator.sum([this.total.giaTri, item.giaTri]);
            }
        })
    }

    changeModel(id: string) {
        this.editCache[id].data.tenHang = this.lstHang.find(e => e.ma == this.editCache[id].data.maHang)?.giaTri;
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            item.level = item.stt.split('.')?.length - 2;
        })
    }

    getHead(stt: string) {
        return parseInt(stt.split(".")[1], 10);
    }

    sortReport() {
        this.setLevel();
        this.lstCtietBcao.sort((a, b) => {
            // level nho hon dat len truoc
            if (this.getHead(a.stt) > this.getHead(b.stt)) {
                return 1;
            }
            if (this.getHead(a.stt) < this.getHead(b.stt)) {
                return -1;
            }
            if (a.level > b.level) {
                return 1;
            }
            if (a.level < b.level) {
                return -1;
            }
            //ban ghi co stt nho hon dat len truoc
            if (Table.subIndex(a.stt) > Table.subIndex(b.stt)) {
                return 1;
            }
            if (Table.subIndex(a.stt) < Table.subIndex(b.stt)) {
                return -1;
            }
            //ban ghi co ma dia chi nho hon dat len truoc
            if (parseInt(a.maDiaChiKho, 10) > parseInt(b.maDiaChiKho, 10)) {
                return 1;
            }
            if (parseInt(a.maDiaChiKho, 10) < parseInt(b.maDiaChiKho, 10)) {
                return -1;
            }
            //ban ghi co ma nha kho nho hon dat len truoc
            if (parseInt(a.maNhaKho, 10) > parseInt(b.maNhaKho, 10)) {
                return 1;
            }
            if (parseInt(a.maNhaKho, 10) < parseInt(b.maNhaKho, 10)) {
                return -1;
            }
            return 0;
        })
        this.setRowSpan();
    }

    setRowSpan() {
        this.lstCtietBcao.forEach(item => {
            item.unitSpan = null;
            item.locationSpan = null;
            item.storehouseSpan = null;
        })
        for (let i = 0; i < this.lstCtietBcao.length; i++) {
            if (i == 0 || this.lstCtietBcao[i].maDvi != this.lstCtietBcao[i - 1].maDvi) {
                this.lstCtietBcao[i].unitSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi)?.length;
            }
            if (i == 0 || this.lstCtietBcao[i].maDiaChiKho != this.lstCtietBcao[i - 1].maDiaChiKho) {
                this.lstCtietBcao[i].locationSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi && e.maDiaChiKho == this.lstCtietBcao[i].maDiaChiKho)?.length;
            }
            if (i == 0 || this.lstCtietBcao[i].maNhaKho != this.lstCtietBcao[i - 1].maNhaKho) {
                this.lstCtietBcao[i].storehouseSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi && e.maDiaChiKho == this.lstCtietBcao[i].maDiaChiKho && e.maNhaKho == this.lstCtietBcao[i].maNhaKho)?.length;
            }
        }
        this.updateEditCache();
    }

    checkEdit(stt: string) {
        return this.lstCtietBcao.every(e => Table.preIndex(e.stt) != stt);
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
    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const header = [
            { t: 0, b: 6 + this.lstCtietBcao.length, l: 0, r: 7, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
            { t: 4, b: 4, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 4, l: 1, r: 1, val: 'Tên cục DTNNKV, chi cục DTNN' },
            { t: 4, b: 4, l: 2, r: 2, val: 'Tên địa điểm, địa chỉ' },
            { t: 4, b: 4, l: 3, r: 3, val: 'Tên nhà kho' },
            { t: 4, b: 4, l: 4, r: 4, val: 'Khối tích (m3)' },
            { t: 4, b: 4, l: 5, r: 5, val: 'Tên hàng DTQG' },
            { t: 4, b: 4, l: 6, r: 6, val: 'Số lượng' },
            { t: 4, b: 4, l: 7, r: 7, val: 'Giá trị' },
            { t: 5, b: 5, l: 0, r: 0, val: 'A' },
            { t: 5, b: 5, l: 1, r: 1, val: 'B' },
            { t: 5, b: 5, l: 2, r: 2, val: 'C' },
            { t: 5, b: 5, l: 3, r: 3, val: 'D' },
            { t: 5, b: 5, l: 4, r: 4, val: 'E' },
            { t: 5, b: 5, l: 5, r: 5, val: 'F' },
            { t: 5, b: 5, l: 6, r: 6, val: '1' },
            { t: 5, b: 5, l: 7, r: 7, val: '2' },
            { t: 6, b: 6, l: 1, r: 1, val: 'Tổng cộng' },
            { t: 6, b: 6, l: 7, r: 7, val: this.total?.giaTri },
        ]
        const headerBot = 7;
        this.lstCtietBcao.forEach((item, index) => {
            if (item.unitSpan) {
                header.push({ t: headerBot + index, b: headerBot + index + item.unitSpan - 1, l: 0, r: 0, val: this.getIndex(item.stt) })
                header.push({ t: headerBot + index, b: headerBot + index + item.unitSpan - 1, l: 1, r: 1, val: item.tenDvi ? item.tenDvi : '' })
            }
            if (item.locationSpan) {
                header.push({ t: headerBot + index, b: headerBot + index + item.locationSpan - 1, l: 2, r: 2, val: item.tenDiaChiKho ? item.tenDiaChiKho : '' })
            }
            if (item.storehouseSpan) {
                header.push({ t: headerBot + index, b: headerBot + index + item.storehouseSpan - 1, l: 3, r: 3, val: item.tenNhaKho ? item.tenNhaKho : '' })
            }
            header.push({ t: headerBot + index, b: headerBot + index, l: 4, r: 4, val: (item.khoiTich || item.khoiTich === 0) ? item.khoiTich : '' })
            header.push({ t: headerBot + index, b: headerBot + index, l: 5, r: 5, val: item.tenHang ? item.tenHang : '' })
            header.push({ t: headerBot + index, b: headerBot + index, l: 6, r: 6, val: (item.soLuong || item.soLuong === 0) ? item.soLuong : '' })
            header.push({ t: headerBot + index, b: headerBot + index, l: 7, r: 7, val: (item.giaTri || item.giaTri === 0) ? item.giaTri : '' })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_bh_hang.xlsx');
    }
}
