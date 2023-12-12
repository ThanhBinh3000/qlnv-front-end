import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
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

        if (this.formDetail.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
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
        if (this.editCache[id].data.khoiTichTren && this.editCache[id].data.khoiTichTren < this.khoiTich) {
            this.notification.warning(MESSAGE.WARNING, "Giá trị của khối kho từ " + this.khoiTich.toString() + " m3 trở lên không phù hợp!");
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
            { t: 0, b: 9 + this.lstCtietBcao.length, l: 0, r: 15, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
            { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 6, l: 1, r: 1, val: 'Tên cục DTNNKV, chi cục DTNN' },
            { t: 4, b: 6, l: 2, r: 2, val: 'Tên địa điểm, địa chỉ' },
            { t: 4, b: 6, l: 3, r: 3, val: 'Tên nhà kho' },
            { t: 4, b: 4, l: 4, r: 5, val: 'Khối tích kho (m3)' },
            { t: 5, b: 6, l: 4, r: 4, val: 'Từ ' + this.khoiTich.toString() + ' m3 trở lên' },
            { t: 5, b: 6, l: 5, r: 5, val: 'Dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 4, b: 4, l: 6, r: 8, val: 'Số lượng nhà kho' },
            { t: 5, b: 6, l: 6, r: 6, val: 'Từ ' + this.khoiTich.toString() + ' m3 trở lên' },
            { t: 5, b: 6, l: 7, r: 7, val: 'Dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 5, b: 6, l: 8, r: 8, val: 'Tổng' },
            { t: 4, b: 4, l: 9, r: 15, val: 'Giá trị kho (VNĐ)' },
            { t: 5, b: 5, l: 9, r: 11, val: 'Từ ' + this.khoiTich.toString() + ' m3' },
            { t: 6, b: 6, l: 9, r: 9, val: 'Kho lấy theo giá trị còn lại' },
            { t: 6, b: 6, l: 10, r: 10, val: 'Kho hết khấu hao' },
            { t: 6, b: 6, l: 11, r: 11, val: 'Tổng giá trị kho từ 5000m3' },
            { t: 5, b: 5, l: 12, r: 14, val: 'Dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 6, b: 6, l: 12, r: 12, val: 'Kho lấy theo giá trị còn lại' },
            { t: 6, b: 6, l: 13, r: 13, val: 'Kho hết khấu hao' },
            { t: 6, b: 6, l: 14, r: 14, val: 'Tổng giá trị kho dưới 5000m3' },
            { t: 5, b: 6, l: 15, r: 15, val: 'Tổng' },
            { t: 7, b: 7, l: 0, r: 0, val: 'A' },
            { t: 7, b: 7, l: 1, r: 1, val: 'B' },
            { t: 7, b: 7, l: 2, r: 2, val: 'C' },
            { t: 7, b: 7, l: 3, r: 3, val: 'D' },
            { t: 7, b: 7, l: 4, r: 4, val: '1' },
            { t: 7, b: 7, l: 5, r: 5, val: '2' },
            { t: 7, b: 7, l: 6, r: 6, val: '3' },
            { t: 7, b: 7, l: 7, r: 7, val: '4' },
            { t: 7, b: 7, l: 8, r: 8, val: '5=3+4' },
            { t: 7, b: 7, l: 9, r: 9, val: '6' },
            { t: 7, b: 7, l: 10, r: 10, val: '7' },
            { t: 7, b: 7, l: 11, r: 11, val: '8=6+7' },
            { t: 7, b: 7, l: 12, r: 12, val: '9' },
            { t: 7, b: 7, l: 13, r: 13, val: '10' },
            { t: 7, b: 7, l: 14, r: 14, val: '11=9+10' },
            { t: 7, b: 7, l: 15, r: 15, val: '12=8+11' },
            { t: 8, b: 8, l: 1, r: 1, val: 'Tổng cộng' },
            { t: 8, b: 8, l: 6, r: 6, val: this.total?.slTren },
            { t: 8, b: 8, l: 7, r: 7, val: this.total?.slDuoi },
            { t: 8, b: 8, l: 8, r: 8, val: this.total?.slTong },
            { t: 8, b: 8, l: 9, r: 9, val: this.total?.gtTrenGtConLai },
            { t: 8, b: 8, l: 10, r: 10, val: this.total?.gtTrenHetKhauHao },
            { t: 8, b: 8, l: 11, r: 11, val: this.total?.gtTrenTong },
            { t: 8, b: 8, l: 12, r: 12, val: this.total?.gtDuoiGtConLai },
            { t: 8, b: 8, l: 13, r: 13, val: this.total?.gtDuoiHetKhauHao },
            { t: 8, b: 8, l: 14, r: 14, val: this.total?.gtDuoiTong },
            { t: 8, b: 8, l: 15, r: 15, val: this.total?.tong },
        ]
        const headerBot = 9;
        console.log(this.lstCtietBcao.length)
        this.lstCtietBcao.forEach((item, index) => {
            if (item.unitSpan) {
                header.push({ t: headerBot + index, b: headerBot + index + item.unitSpan - 1, l: 0, r: 0, val: this.getIndex(item.stt) })
                header.push({ t: headerBot + index, b: headerBot + index + item.unitSpan - 1, l: 1, r: 1, val: Utils.getValue(item.tenDvi) })
            }
            if (item.locationSpan) {
                header.push({ t: headerBot + index, b: headerBot + index + item.locationSpan - 1, l: 2, r: 2, val: Utils.getValue(item.tenDiaChiKho) })
            }
            header.push({ t: headerBot + index, b: headerBot + index, l: 3, r: 3, val: Utils.getValue(item.tenNhaKho) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 4, r: 4, val: Utils.getValue(item.khoiTichTren) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 5, r: 5, val: Utils.getValue(item.khoiTichDuoi) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 6, r: 6, val: Utils.getValue(item.slTren) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 7, r: 7, val: Utils.getValue(item.slDuoi) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 8, r: 8, val: Utils.getValue(item.slTong) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 9, r: 9, val: Utils.getValue(item.gtTrenGtConLai) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 10, r: 10, val: Utils.getValue(item.gtTrenHetKhauHao) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 11, r: 11, val: Utils.getValue(item.gtTrenTong) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 12, r: 12, val: Utils.getValue(item.gtDuoiGtConLai) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 13, r: 13, val: Utils.getValue(item.gtDuoiHetKhauHao) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 14, r: 14, val: Utils.getValue(item.gtDuoiTong) })
            header.push({ t: headerBot + index, b: headerBot + index, l: 15, r: 15, val: Utils.getValue(item.tong) })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_bh_kho.xlsx');
    }

}
