import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    maLvucNdChi: string;
    tenLvucNdChi: string;
    thNamHienHanhN1: number;
    ncauNamDtoanN: number;
    ncauNamN1: number;
    ncauNamN2: number;
    ghiChu: string;
}

@Component({
    selector: 'app-bieu-mau-17',
    templateUrl: './bieu-mau-17.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau17Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    chiCoSo: ItemData = new ItemData();
    chiMoi: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    linhVucs: any[] = [];
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
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
        private danhMucService: DanhMucDungChungService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public numFunc: NumberFunction,
        public genFunc: GeneralFunction,
        private fileFunc: FileFunction,
        private tableFunc: TableFunction,
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
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM17');
            if (category) {
                this.linhVucs = category.data;
            }
            this.scrollX = this.genFunc.setTableWidth(400, 4, 1, 60);
        } else {
            this.scrollX = this.genFunc.setTableWidth(400, 4, 1, 0);
        }
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        if (this.lstCtietBcao.length == 0) {
            this.linhVucs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maLvucNdChi: e.ma,
                    tenLvucNdChi: e.giaTri,
                })
            })
        }

        this.lstCtietBcao = this.tableFunc.sortByIndex(this.lstCtietBcao);

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
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

        if (this.lstCtietBcao.some(e => e.thNamHienHanhN1 > MONEY_LIMIT || e.ncauNamDtoanN > MONEY_LIMIT || e.ncauNamN1 > MONEY_LIMIT || e.ncauNamN2 > MONEY_LIMIT)) {
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

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return String.fromCharCode(k + 96);
            case 2:
                return "-"
        }
        return xau;
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
        const indexP = this.lstCtietBcao.findIndex(e => e.stt == this.tableFunc.getHead(this.lstCtietBcao[index].stt));
        const indexC = this.lstCtietBcao.findIndex(e => this.tableFunc.getHead(e.stt) == this.tableFunc.getHead(this.lstCtietBcao[index].stt) && this.tableFunc.getTail(e.stt) != this.tableFunc.getTail(this.lstCtietBcao[index].stt));
        this.lstCtietBcao[indexC].thNamHienHanhN1 = (!this.lstCtietBcao[indexP].thNamHienHanhN1 ? 0 : this.lstCtietBcao[indexP].thNamHienHanhN1) - this.lstCtietBcao[index].thNamHienHanhN1;
        this.lstCtietBcao[indexC].ncauNamDtoanN = (!this.lstCtietBcao[indexP].ncauNamDtoanN ? 0 : this.lstCtietBcao[indexP].ncauNamDtoanN) - this.lstCtietBcao[index].ncauNamDtoanN;
        this.lstCtietBcao[indexC].ncauNamN1 = (!this.lstCtietBcao[indexP].ncauNamN1 ? 0 : this.lstCtietBcao[indexP].ncauNamN1) - this.lstCtietBcao[index].ncauNamN1;
        this.lstCtietBcao[indexC].ncauNamN2 = (!this.lstCtietBcao[indexP].ncauNamN2 ? 0 : this.lstCtietBcao[indexP].ncauNamN2) - this.lstCtietBcao[index].ncauNamN2;
        this.getInTotal();
        this.updateEditCache();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.thNamHienHanhN1 = this.numFunc.sum([this.total.thNamHienHanhN1, item.thNamHienHanhN1]);
                this.total.ncauNamDtoanN = this.numFunc.sum([this.total.ncauNamDtoanN, item.ncauNamDtoanN]);
                this.total.ncauNamN1 = this.numFunc.sum([this.total.ncauNamN1, item.ncauNamN1]);
                this.total.ncauNamN2 = this.numFunc.sum([this.total.ncauNamN2, item.ncauNamN2]);
            }
        })
        this.getInTotal();
    }

    getInTotal() {
        this.chiCoSo = new ItemData();
        this.chiMoi = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 1) {
                if (this.tableFunc.getTail(item.stt) == 1) {
                    this.chiCoSo.thNamHienHanhN1 = this.numFunc.sum([this.chiCoSo.thNamHienHanhN1, item.thNamHienHanhN1]);
                    this.chiCoSo.ncauNamDtoanN = this.numFunc.sum([this.chiCoSo.ncauNamDtoanN, item.ncauNamDtoanN]);
                    this.chiCoSo.ncauNamN1 = this.numFunc.sum([this.chiCoSo.ncauNamN1, item.ncauNamN1]);
                    this.chiCoSo.ncauNamN2 = this.numFunc.sum([this.chiCoSo.ncauNamN2, item.ncauNamN2]);
                }
                if (this.tableFunc.getTail(item.stt) == 2) {
                    this.chiMoi.thNamHienHanhN1 = this.numFunc.sum([this.chiMoi.thNamHienHanhN1, item.thNamHienHanhN1]);
                    this.chiMoi.ncauNamDtoanN = this.numFunc.sum([this.chiMoi.ncauNamDtoanN, item.ncauNamDtoanN]);
                    this.chiMoi.ncauNamN1 = this.numFunc.sum([this.chiMoi.ncauNamN1, item.ncauNamN1]);
                    this.chiMoi.ncauNamN2 = this.numFunc.sum([this.chiMoi.ncauNamN2, item.ncauNamN2]);
                }
            }
        })
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
