import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';
import * as XLSX from 'xlsx';

export class ItemData {
    id: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    maDiaChiKho: string;
    tenDiaChiKho: string;
    maNhaKho: string;
    tenNhaKho: string;
    khoiTichTren: number;
    khoiTichDuoi: number;
    slTren: number;
    slDuoi: number;
    slTong: number;
    gtTrenGtConLai: number;
    gtTrenHetKhauHao: number;
    gtTrenTong: number;
    gtDuoiGtConLai: number;
    gtDuoiHetKhauHao: number;
    gtDuoiTong: number;
    tong: number;
    unitSpan: number;
    locationSpan: number;
    level: number;
}

@Component({
    selector: 'app-kho',
    templateUrl: './kho.component.html',
    styleUrls: ['../../../bao-cao.component.scss']
})

export class KhoComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    //danh muc
    linhVucChis: any[] = [];
    lstCtietBcao: ItemData[] = [];
    keys = ['slTren', 'slDuoi', 'slTong', 'gtTrenGtConLai', 'gtTrenHetKhauHao', 'gtTrenTong', 'gtDuoiGtConLai', 'gtDuoiHetKhauHao', 'gtDuoiTong', 'tong']
    donVi: any;
    scrollX: string;
    khoiTich: number;
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
        private lapThamDinhService: LapThamDinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private fileManip: FileManip,
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
        await this.getKhoiTich();
        if (this.status.general) {
            if (!this.dataInfo?.isSynthetic) {
                await this.getDmKho();
            }
            this.scrollX = Table.tableWidth(500, 12, 0, 60);
        } else {
            this.scrollX = Table.tableWidth(500, 12, 0, 0);
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
        if (this.formDetail.trangThai == Status.NEW) {
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

    async getKhoiTich() {
        await this.lapThamDinhService.tyLeBaoHiem(this.dataInfo.namBcao).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.khoiTich = data.data.khoiTich;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
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

        if (this.lstCtietBcao.some(e => e.tong > Utils.MONEY_LIMIT)) {
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
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }

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
        if (this.editCache[id].data.khoiTichTren && this.editCache[id].data.khoiTichTren < this.khoiTich) {
            this.notification.warning(MESSAGE.WARNING, "Giá trị của khối kho từ 5000m3 trở lên không phù hợp!");
            return;
        }
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    changeModel(id: string): void {
        this.editCache[id].data.slTong = Operator.sum([this.editCache[id].data.slTren, this.editCache[id].data.slDuoi]);
        this.editCache[id].data.gtTrenTong = Operator.sum([this.editCache[id].data.gtTrenGtConLai, this.editCache[id].data.gtTrenHetKhauHao]);
        this.editCache[id].data.gtDuoiTong = Operator.sum([this.editCache[id].data.gtDuoiGtConLai, this.editCache[id].data.gtDuoiHetKhauHao]);
        this.editCache[id].data.tong = Operator.sum([this.editCache[id].data.gtTrenTong, this.editCache[id].data.gtDuoiTong]);
    }

    countWarehouse(id: string) {
        if (this.editCache[id].data.khoiTichTren) {
            this.editCache[id].data.slTren = 1;
            this.editCache[id].data.slDuoi = null;
        } else if (this.editCache[id].data.khoiTichDuoi) {
            if (this.editCache[id].data.khoiTichDuoi >= this.khoiTich) {
                this.editCache[id].data.khoiTichDuoi = this.khoiTich - 1;
            }
            this.editCache[id].data.slTren = null;
            this.editCache[id].data.slDuoi = 1;
        } else {
            this.editCache[id].data.slTren = null;
            this.editCache[id].data.slDuoi = null;
        }
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                maDvi: data.maDvi,
                tenDvi: data.tenDvi,
                maDiaChiKho: data.maDiaChiKho,
                tenDiaChiKho: data.tenDiaChiKho,
                maNhaKho: data.maNhaKho,
                tenNhaKho: data.tenNhaKho,
                unitSpan: data.unitSpan,
                locationSpan: data.locationSpan,
                level: data.level,
                khoiTichDuoi: data.khoiTichDuoi,
                khoiTichTren: data.khoiTichTren,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
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
                this.keys.forEach(key => {
                    this.total[key] = Operator.sum([this.total[key], item[key]]);
                })
            }
        })
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
            if (this.getHead(a.stt) > this.getHead(b.stt)) {
                return 1;
            }
            if (this.getHead(a.stt) < this.getHead(b.stt)) {
                return -1;
            }
            //level nho hon dat len truoc
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
        for (let i = 0; i < this.lstCtietBcao.length; i++) {
            if (i == 0 || this.lstCtietBcao[i].maDvi != this.lstCtietBcao[i - 1].maDvi) {
                this.lstCtietBcao[i].unitSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi)?.length;
            }
            if (i == 0 || this.lstCtietBcao[i].maDiaChiKho != this.lstCtietBcao[i - 1].maDiaChiKho) {
                this.lstCtietBcao[i].locationSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi && e.maDiaChiKho == this.lstCtietBcao[i].maDiaChiKho)?.length;
            }
        }
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
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
        await this.fileManip.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 2 + this.lstCtietBcao.length, l: 0, r: 15, val: null },
            { t: 0, b: 2, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 2, l: 1, r: 1, val: 'Tên cục DTNNKV, chi cục DTNN' },
            { t: 0, b: 2, l: 2, r: 2, val: 'Tên địa điểm, địa chỉ' },
            { t: 0, b: 2, l: 3, r: 3, val: 'Tên nhà kho' },
            { t: 0, b: 0, l: 4, r: 5, val: 'Khối tích kho (m3)' },
            { t: 1, b: 2, l: 4, r: 4, val: 'Từ ' + this.khoiTich.toString() + ' m3 trở lên' },
            { t: 1, b: 2, l: 5, r: 5, val: 'Dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 0, b: 0, l: 6, r: 8, val: 'Số lượng nhà kho' },
            { t: 1, b: 2, l: 6, r: 6, val: 'Từ ' + this.khoiTich.toString() + ' m3 trở lên' },
            { t: 1, b: 2, l: 7, r: 7, val: 'Dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 1, b: 2, l: 8, r: 8, val: 'Tổng' },
            { t: 0, b: 0, l: 9, r: 15, val: 'Giá trị kho (VNĐ)' },
            { t: 1, b: 1, l: 9, r: 11, val: 'Từ ' + this.khoiTich.toString() + ' m3' },
            { t: 2, b: 2, l: 9, r: 9, val: 'Kho lấy theo giá trị còn lại' },
            { t: 2, b: 2, l: 10, r: 10, val: 'Kho hết khấu hao' },
            { t: 2, b: 2, l: 11, r: 11, val: 'Tổng giá trị kho từ 5000m3' },
            { t: 1, b: 1, l: 12, r: 14, val: 'Dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 2, b: 2, l: 12, r: 12, val: 'Kho lấy theo giá trị còn lại' },
            { t: 2, b: 2, l: 13, r: 13, val: 'Kho hết khấu hao' },
            { t: 2, b: 2, l: 14, r: 14, val: 'Tổng giá trị kho dưới 5000m3' },
            { t: 1, b: 2, l: 15, r: 15, val: 'Tổng' },
        ]
        const headerBot = 2;
        this.lstCtietBcao.forEach((item, index) => {
            if (item.unitSpan) {
                header.push({ t: headerBot + index + 1, b: headerBot + item.unitSpan, l: 0, r: 0, val: this.getIndex(item.stt) })
                header.push({ t: headerBot + index + 1, b: headerBot + item.unitSpan, l: 1, r: 1, val: item.tenDvi })
            }
            if (item.locationSpan) {
                header.push({ t: headerBot + index + 1, b: headerBot + item.locationSpan, l: 2, r: 2, val: item.tenDiaChiKho })
            }
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 3, r: 3, val: item.tenNhaKho })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 4, r: 4, val: item.khoiTichTren?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 5, r: 5, val: item.khoiTichDuoi?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 6, r: 6, val: item.slTren?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 7, r: 7, val: item.slDuoi?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 8, r: 8, val: item.slTong?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 9, r: 9, val: item.gtTrenGtConLai?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 10, r: 10, val: item.gtTrenHetKhauHao?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 11, r: 11, val: item.gtTrenTong?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 12, r: 12, val: item.gtDuoiGtConLai?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 13, r: 13, val: item.gtDuoiHetKhauHao?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 14, r: 14, val: item.gtDuoiTong?.toString() })
            header.push({ t: headerBot + index + 1, b: headerBot + index + 1, l: 15, r: 15, val: item.tong?.toString() })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, 'bao_hiem_kho.xlsx');
    }

}
