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
    tenNdung!: string;
    namHienHanhDtoan!: number;
    namHienHanhUocThien!: number;
    tranChiN!: number;
    ncauChiN!: number;
    clechTranChiVsNcauChiN: number;
    ssanhNcauNVoiN1: number;
    tranChiN1!: number;
    ncauChiN1!: number;
    clechTranChiVsNcauChiN1: number;
    tranChiN2!: number;
    ncauChiN2!: number;
    clechTranChiVsNcauChiN2: number;
    ghiChu: string;
}

@Component({
    selector: 'app-bieu-mau-13',
    templateUrl: './bieu-mau-13.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau13Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    noiDungs: any[] = [];
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
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        this.namBcao = this.dataInfo.namBcao;
        await this.getFormDetail();
        if (this.status.general) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM13');
            if (category) {
                this.noiDungs = category.data;
            }
            this.scrollX = this.genFunc.tableWidth(350, 12, 1, 60);
        } else {
            this.scrollX = this.genFunc.tableWidth(350, 12, 1, 0);
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
        } else {
            this.lstCtietBcao.forEach(item => {
                item.ssanhNcauNVoiN1 = this.numFunc.div(item.ncauChiN, item.namHienHanhUocThien);
            })
        }

        this.lstCtietBcao = this.tableFunc.sortByIndex(this.lstCtietBcao);

        // if (this.dataInfo?.extraData) {
        //     const indDa = this.lstCtietBcao.findIndex(e => e.maNdung == '0.1.1.1');
        //     this.lstCtietBcao[indDa].ncauChiN = this.dataInfo.extraData?.nhucauDan;
        //     this.sum(this.lstCtietBcao[indDa].stt);
        //     this.dataInfo.extraData?.lstBieuMau.forEach(item => {
        //         const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
        //         this.lstCtietBcao[index].namHienHanhDtoan = item.namHienHanhDtoan;
        //         this.lstCtietBcao[index].namHienHanhUocThien = item.namHienHanhUocThien;
        //         this.lstCtietBcao[index].ncauChiN = item.ncauChiN;
        //         this.lstCtietBcao[index].ssanhNcauNVoiN1 = this.numFunc.div(item.ncauChiN, item.namHienHanhUocThien);
        //         this.sum(this.lstCtietBcao[index].stt);
        //     })
        // }
        if (this.formDetail.trangThai == '3') {
            this.lstCtietBcao.forEach(item => {
                item.clechTranChiVsNcauChiN = this.numFunc.sum([item.tranChiN, -item.ncauChiN])
            })
        }

        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
    }

    getFormDetail() {
        this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
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

        if (this.lstCtietBcao.some(e => e.namHienHanhDtoan > MONEY_LIMIT || e.namHienHanhUocThien > MONEY_LIMIT ||
            e.tranChiN > MONEY_LIMIT || e.ncauChiN > MONEY_LIMIT || e.clechTranChiVsNcauChiN > MONEY_LIMIT ||
            e.tranChiN1 > MONEY_LIMIT || e.ncauChiN1 > MONEY_LIMIT || e.clechTranChiVsNcauChiN1 > MONEY_LIMIT ||
            e.tranChiN2 > MONEY_LIMIT || e.ncauChiN2 > MONEY_LIMIT || e.clechTranChiVsNcauChiN2 > MONEY_LIMIT)) {
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
                return String.fromCharCode(k + 64);
            case 1:
                return this.genFunc.laMa(k);
            case 2:
                return chiSo[n];
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

    isEdit(stt: string) {
        if (stt.startsWith('0.1.2') || stt == '0.1.3') {
            return false;
        }
        return true;
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

    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN = this.numFunc.sum([this.editCache[id].data.tranChiN, -this.editCache[id].data.ncauChiN]);
        this.editCache[id].data.ssanhNcauNVoiN1 = this.numFunc.div(this.editCache[id].data.ncauChiN, this.editCache[id].data.namHienHanhUocThien);
        this.editCache[id].data.clechTranChiVsNcauChiN1 = this.numFunc.sum([this.editCache[id].data.tranChiN1, -this.editCache[id].data.ncauChiN1]);
        this.editCache[id].data.clechTranChiVsNcauChiN2 = this.numFunc.sum([this.editCache[id].data.tranChiN2, -this.editCache[id].data.ncauChiN2]);
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
                maNdung: data.maNdung,
                tenNdung: data.tenNdung,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.tableFunc.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].namHienHanhDtoan = this.numFunc.sum([this.lstCtietBcao[index].namHienHanhDtoan, item.namHienHanhDtoan]);
                    this.lstCtietBcao[index].namHienHanhUocThien = this.numFunc.sum([this.lstCtietBcao[index].namHienHanhUocThien, item.namHienHanhUocThien]);
                    this.lstCtietBcao[index].tranChiN = this.numFunc.sum([this.lstCtietBcao[index].tranChiN, item.tranChiN]);
                    this.lstCtietBcao[index].ncauChiN = this.numFunc.sum([this.lstCtietBcao[index].ncauChiN, item.ncauChiN]);
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN = this.numFunc.sum([this.lstCtietBcao[index].clechTranChiVsNcauChiN, item.clechTranChiVsNcauChiN]);
                    this.lstCtietBcao[index].tranChiN1 = this.numFunc.sum([this.lstCtietBcao[index].tranChiN1, item.tranChiN1]);
                    this.lstCtietBcao[index].ncauChiN1 = this.numFunc.sum([this.lstCtietBcao[index].ncauChiN1, item.ncauChiN1]);
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN1 = this.numFunc.sum([this.lstCtietBcao[index].clechTranChiVsNcauChiN1, item.clechTranChiVsNcauChiN1]);
                    this.lstCtietBcao[index].tranChiN2 = this.numFunc.sum([this.lstCtietBcao[index].tranChiN2, item.tranChiN2]);
                    this.lstCtietBcao[index].ncauChiN2 = this.numFunc.sum([this.lstCtietBcao[index].ncauChiN2, item.ncauChiN2]);
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN2 = this.numFunc.sum([this.lstCtietBcao[index].clechTranChiVsNcauChiN2, item.clechTranChiVsNcauChiN2]);
                }
            })
            this.lstCtietBcao[index].ssanhNcauNVoiN1 = this.numFunc.div(this.lstCtietBcao[index].ncauChiN, this.lstCtietBcao[index].namHienHanhUocThien);
            stt = this.tableFunc.getHead(stt);
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
