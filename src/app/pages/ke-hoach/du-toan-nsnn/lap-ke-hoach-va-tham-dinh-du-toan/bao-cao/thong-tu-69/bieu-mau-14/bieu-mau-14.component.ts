import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';
import * as XLSX from 'xlsx'

export class ItemData {
    id: string;
    stt!: string;
    level: number;
    maNdung: string;
    tenNdung: string;
    thNamHienHanhN1: number;
    ncauNamDtoanN: number;
    ncauNamN1: number;
    ncauNamN2: number;
    ghiChu: string;
}

@Component({
    selector: 'app-bieu-mau-14',
    templateUrl: './bieu-mau-14.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau14Component implements OnInit {
    @Input() dataInfo;
    Op = Operator;
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    noiDungs: any[] = [];
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
        private notification: NzNotificationService,
        private modal: NzModalService,
        private fileManip: FileManip,
    ) {
    }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        await this.getFormDetail();
        Object.assign(this.status, this.dataInfo.status);
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM14');
            if (category) {
                this.noiDungs = category.data;
            }
            this.scrollX = Table.tableWidth(550, 4, 1, 60);
        } else {
            this.scrollX = Table.tableWidth(550, 4, 1, 0);
        }
        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNdung: e.ma,
                    tenNdung: e.giaTri,
                })
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNdung;
            })
        }

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);

        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
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

        if (this.lstCtietBcao.some(e => e.thNamHienHanhN1 > Utils.MONEY_LIMIT || e.ncauNamDtoanN > Utils.MONEY_LIMIT ||
            e.ncauNamN1 > Utils.MONEY_LIMIT || e.ncauNamN2 > Utils.MONEY_LIMIT)) {
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

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];;
            case 2:
                return String.fromCharCode(k + 96);;
        }
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
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
                maNdung: data.maNdung,
                tenNdung: data.tenNdung,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].thNamHienHanhN1 = Operator.sum([this.lstCtietBcao[index].thNamHienHanhN1, item.thNamHienHanhN1]);
                    this.lstCtietBcao[index].ncauNamDtoanN = Operator.sum([this.lstCtietBcao[index].ncauNamDtoanN, item.ncauNamDtoanN]);
                    this.lstCtietBcao[index].ncauNamN1 = Operator.sum([this.lstCtietBcao[index].ncauNamN1, item.ncauNamN1]);
                    this.lstCtietBcao[index].ncauNamN2 = Operator.sum([this.lstCtietBcao[index].ncauNamN2, item.ncauNamN2]);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.tinhChechLech();
    }

    tinhChechLech() {
        const idxI = this.lstCtietBcao.findIndex(e => e.maNdung == '0.1');
        const idxII = this.lstCtietBcao.findIndex(e => e.maNdung == '0.2');
        const idxIII = this.lstCtietBcao.findIndex(e => e.maNdung == '0.3');
        this.lstCtietBcao[idxIII].thNamHienHanhN1 = Operator.sum([this.lstCtietBcao[idxI].thNamHienHanhN1, -this.lstCtietBcao[idxII].thNamHienHanhN1]);
        this.lstCtietBcao[idxIII].ncauNamDtoanN = Operator.sum([this.lstCtietBcao[idxI].ncauNamDtoanN, -this.lstCtietBcao[idxII].ncauNamDtoanN]);
        this.lstCtietBcao[idxIII].ncauNamN1 = Operator.sum([this.lstCtietBcao[idxI].ncauNamN1, -this.lstCtietBcao[idxII].ncauNamN1]);
        this.lstCtietBcao[idxIII].ncauNamN2 = Operator.sum([this.lstCtietBcao[idxI].ncauNamN2, -this.lstCtietBcao[idxII].ncauNamN2]);
    }

    checkEdit(stt: string) {
        if (stt == '0.3') {
            return false;
        }
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
            { t: 0, b: 0, l: 0, r: 6, val: null },
            { t: 0, b: 0, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 0, l: 1, r: 1, val: 'Nội dung' },
            { t: 0, b: 0, l: 2, r: 2, val: 'Thực hiện năm hiện hành ' + (this.namBcao - 1).toString() },
            { t: 0, b: 0, l: 3, r: 3, val: 'Nhu cầu dự toán năm ' + this.namBcao.toString() },
            { t: 0, b: 0, l: 4, r: 4, val: 'Nhu cầu năm ' + (this.namBcao + 1).toString() },
            { t: 0, b: 0, l: 5, r: 5, val: 'Nhu cầu năm ' + (this.namBcao + 2).toString() },
            { t: 0, b: 0, l: 6, r: 6, val: 'Ghi chú' },
        ]
        const fieldOrder = ['stt', 'tenNdung', 'thNamHienHanhN1', 'ncauNamDtoanN', 'ncauNamN1', 'ncauNamN2', 'ghiChu']
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = item[field]
            })
            return row;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT69_BM14.xlsx');
    }
}
