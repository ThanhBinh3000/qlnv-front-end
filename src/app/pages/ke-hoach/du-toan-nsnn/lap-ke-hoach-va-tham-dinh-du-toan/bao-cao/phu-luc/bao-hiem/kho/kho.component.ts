import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, MONEY_LIMIT, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../../lap-ke-hoach-va-tham-dinh-du-toan.class';

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
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    //danh muc
    linhVucChis: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    keys = ['slTren', 'slDuoi', 'slTong', 'gtTrenGtConLai', 'gtTrenHetKhauHao', 'gtTrenTong', 'gtDuoiGtConLai', 'gtDuoiHetKhauHao', 'gtDuoiTong', 'tong']
    donVi: any;
    amount = AMOUNT;
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
        private lapThamDinhService: LapThamDinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public numFunc: NumberFunction,
        public genFunc: GeneralFunction,
        private fileFunc: FileFunction,
        private tableFunc: TableFunction,
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
            if (!this.dataInfo?.isSynthetic) {
                await this.getDmKho();
            }
            this.scrollX = this.genFunc.setTableWidth(560, 12, BOX_NUMBER_WIDTH, 60);
        } else {
            this.scrollX = this.genFunc.setTableWidth(560, 12, BOX_NUMBER_WIDTH, 0);
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
        if (this.formDetail.trangThai == '3') {
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
        this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
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
                return this.genFunc.laMa(parseInt(lst[1], 10));
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

        if (this.lstCtietBcao.some(e => e.tong > MONEY_LIMIT)) {
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
            request.fileDinhKems.push(await this.fileFunc.uploadFile(iterator, this.dataInfo.path));
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
        if (this.editCache[id].data.khoiTichTren && this.editCache[id].data.khoiTichTren < 5000) {
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
        this.editCache[id].data.slTong = this.numFunc.sum([this.editCache[id].data.slTren, this.editCache[id].data.slDuoi]);
        this.editCache[id].data.gtTrenTong = this.numFunc.sum([this.editCache[id].data.gtTrenGtConLai, this.editCache[id].data.gtTrenHetKhauHao]);
        this.editCache[id].data.gtDuoiTong = this.numFunc.sum([this.editCache[id].data.gtDuoiGtConLai, this.editCache[id].data.gtDuoiHetKhauHao]);
        this.editCache[id].data.tong = this.numFunc.sum([this.editCache[id].data.gtTrenTong, this.editCache[id].data.gtDuoiTong]);
    }

    countWarehouse(id: string) {
        if (this.editCache[id].data.khoiTichTren) {
            this.editCache[id].data.slTren = 1;
            this.editCache[id].data.slDuoi = null;
        } else if (this.editCache[id].data.khoiTichDuoi) {
            if (this.editCache[id].data.khoiTichDuoi >= 5000) {
                this.editCache[id].data.khoiTichDuoi = 4999;
            }
            this.editCache[id].data.slTren = null;
            this.editCache[id].data.slDuoi = 1;
        } else {
            this.editCache[id].data.slTren = null;
            this.editCache[id].data.slDuoi = null;
        }
    }

    sum(stt: string) {
        stt = this.tableFunc.getHead(stt);
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
                if (this.tableFunc.getHead(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = this.numFunc.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            stt = this.tableFunc.getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.keys.forEach(key => {
                    this.total[key] = this.numFunc.sum([this.total[key], item[key]]);
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
            if (this.tableFunc.getTail(a.stt) > this.tableFunc.getTail(b.stt)) {
                return 1;
            }
            if (this.tableFunc.getTail(a.stt) < this.tableFunc.getTail(b.stt)) {
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
        await this.fileFunc.downloadFile(file, doc);
    }

}
