import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, MONEY_LIMIT, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';

export class ItemData {
    id!: string;
    stt!: string;
    level: number;
    maNdung!: string;
    tenNdung: string;
    thNamHienHanhN1!: number;
    tranChiN!: number;
    ncauChiN!: number;
    clechTranChiVsNcauChiN: number;
    tranChiN1!: number;
    ncauChiN1!: number;
    clechTranChiVsNcauChiN1: number;
    tranChiN2!: number;
    ncauChiN2!: number;
    clechTranChiVsNcauChiN2: number;
    ghiChu: string;
}

@Component({
    selector: 'app-bieu-mau-16',
    templateUrl: './bieu-mau-16.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau16Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    chiCoSo: ItemData = new ItemData();
    chiMoi: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    noiDungs: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    keys = ['thNamHienHanhN1', 'tranChiN', 'ncauChiN', 'clechTranChiVsNcauChiN', 'tranChiN1', 'ncauChiN1', 'clechTranChiVsNcauChiN1',
        'tranChiN2', 'ncauChiN2', 'clechTranChiVsNcauChiN2']
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
        await this.getFormDetail();
        Object.assign(this.status, this.dataInfo.status);
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM17');
            if (category) {
                this.noiDungs = category.data;
            }
            this.scrollX = this.genFunc.tableWidth(350, 10, 1, 60);
        } else {
            this.scrollX = this.genFunc.tableWidth(350, 10, 1, 60);
        }
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
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

        if (this.lstCtietBcao.some(e => e.thNamHienHanhN1 > MONEY_LIMIT || e.tranChiN > MONEY_LIMIT || e.ncauChiN > MONEY_LIMIT ||
            e.tranChiN1 > MONEY_LIMIT || e.ncauChiN1 > MONEY_LIMIT || e.tranChiN2 > MONEY_LIMIT || e.ncauChiN2 > MONEY_LIMIT)) {
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
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return String.fromCharCode(k + 96);
            case 2:
                return "-";
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
        const indexP = this.lstCtietBcao.findIndex(e => e.stt == this.tableFunc.getHead(this.lstCtietBcao[index].stt));
        const indexC = this.lstCtietBcao.findIndex(e => this.tableFunc.getHead(e.stt) == this.tableFunc.getHead(this.lstCtietBcao[index].stt) && this.tableFunc.getTail(e.stt) != this.tableFunc.getTail(this.lstCtietBcao[index].stt));
        this.lstCtietBcao[indexC].thNamHienHanhN1 = (!this.lstCtietBcao[indexP].thNamHienHanhN1 ? 0 : this.lstCtietBcao[indexP].thNamHienHanhN1) - this.lstCtietBcao[index].thNamHienHanhN1;
        this.lstCtietBcao[indexC].tranChiN = (!this.lstCtietBcao[indexP].tranChiN ? 0 : this.lstCtietBcao[indexP].tranChiN) - this.lstCtietBcao[index].tranChiN;
        this.lstCtietBcao[indexC].ncauChiN = (!this.lstCtietBcao[indexP].ncauChiN ? 0 : this.lstCtietBcao[indexP].ncauChiN) - this.lstCtietBcao[index].ncauChiN;
        this.lstCtietBcao[indexC].clechTranChiVsNcauChiN = (!this.lstCtietBcao[indexP].clechTranChiVsNcauChiN ? 0 : this.lstCtietBcao[indexP].clechTranChiVsNcauChiN) - this.lstCtietBcao[index].clechTranChiVsNcauChiN;
        this.lstCtietBcao[indexC].tranChiN1 = (!this.lstCtietBcao[indexP].tranChiN1 ? 0 : this.lstCtietBcao[indexP].tranChiN1) - this.lstCtietBcao[index].tranChiN1;
        this.lstCtietBcao[indexC].ncauChiN1 = (!this.lstCtietBcao[indexP].ncauChiN1 ? 0 : this.lstCtietBcao[indexP].ncauChiN1) - this.lstCtietBcao[index].ncauChiN1;
        this.lstCtietBcao[indexC].clechTranChiVsNcauChiN1 = (!this.lstCtietBcao[indexP].clechTranChiVsNcauChiN1 ? 0 : this.lstCtietBcao[indexP].clechTranChiVsNcauChiN1) - this.lstCtietBcao[index].clechTranChiVsNcauChiN1;
        this.lstCtietBcao[indexC].tranChiN2 = (!this.lstCtietBcao[indexP].tranChiN2 ? 0 : this.lstCtietBcao[indexP].tranChiN2) - this.lstCtietBcao[index].tranChiN2;
        this.lstCtietBcao[indexC].ncauChiN2 = (!this.lstCtietBcao[indexP].ncauChiN2 ? 0 : this.lstCtietBcao[indexP].ncauChiN2) - this.lstCtietBcao[index].ncauChiN2;
        this.lstCtietBcao[indexC].clechTranChiVsNcauChiN2 = (!this.lstCtietBcao[indexP].clechTranChiVsNcauChiN2 ? 0 : this.lstCtietBcao[indexP].clechTranChiVsNcauChiN2) - this.lstCtietBcao[index].clechTranChiVsNcauChiN2;
        this.getInTotal();
        this.updateEditCache();
    }

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN = this.numFunc.sum([this.editCache[id].data.tranChiN, -this.editCache[id].data.ncauChiN]);
        this.editCache[id].data.clechTranChiVsNcauChiN1 = this.numFunc.sum([this.editCache[id].data.tranChiN1, -this.editCache[id].data.ncauChiN1]);
        this.editCache[id].data.clechTranChiVsNcauChiN2 = this.numFunc.sum([this.editCache[id].data.tranChiN2, -this.editCache[id].data.ncauChiN2]);
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
        this.getInTotal();
    }

    getInTotal() {
        this.chiCoSo = new ItemData();
        this.chiMoi = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 1) {
                if (this.tableFunc.getTail(item.stt) == 1) {
                    this.keys.forEach(key => {
                        this.chiCoSo[key] = this.numFunc.sum([this.chiCoSo[key], item[key]]);
                    })
                }
                if (this.tableFunc.getTail(item.stt) == 2) {
                    this.keys.forEach(key => {
                        this.chiMoi[key] = this.numFunc.sum([this.chiMoi[key], item[key]]);
                    })
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
