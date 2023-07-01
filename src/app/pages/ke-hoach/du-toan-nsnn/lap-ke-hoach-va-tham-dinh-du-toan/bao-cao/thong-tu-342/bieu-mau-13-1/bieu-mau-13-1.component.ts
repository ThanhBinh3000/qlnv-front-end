import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, MONEY_LIMIT, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';
import * as XLSX from 'xlsx'
export class ItemData {
    id: string;
    khvonphiLapThamDinhCtietId: string;
    stt: string;
    level: number;
    maNdung: string;
    tenDmuc: string;
    maDviTinh: string;
    thienNtruoc: number;
    namDtoan: number;
    namUocThien: number;
    namKh: number;
    giaTriThamDinh: number;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;
}
@Component({
    selector: 'app-bieu-mau-13-1',
    templateUrl: './bieu-mau-13-1.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau131Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    chiTieus: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;

    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    amount = AMOUNT;
    scrollX: string;

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
        private danhMucService: DanhMucDungChungService,
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
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM131');
            if (category) {
                this.chiTieus = category.data;
            }
            this.scrollX = this.genFunc.tableWidth(350, 5, 1, 60);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = this.genFunc.tableWidth(350, 7, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = this.genFunc.tableWidth(350, 7, 2, 0);
            } else {
                this.scrollX = this.genFunc.tableWidth(350, 5, 1, 0);
            }
        }

        if (this.lstCtietBcao.length == 0) {
            this.chiTieus.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNdung: e.ma,
                    tenDmuc: e.giaTri,
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
    };

    changeModel(id: string): void {
        this.editCache[id].data.chenhLech = this.numFunc.sum([this.editCache[id].data.giaTriThamDinh, this.editCache[id].data.namUocThien]);
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

        if (this.lstCtietBcao.some(e => e.thienNtruoc > MONEY_LIMIT || e.namDtoan > MONEY_LIMIT || e.namUocThien > MONEY_LIMIT || e.namKh > MONEY_LIMIT || e.giaTriThamDinh > MONEY_LIMIT)) {
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

        if (this.status.general) {
            lstCtietBcaoTemp.forEach(item => {
                item.giaTriThamDinh = item.namKh;
            })
        }

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
                this.formDetail.lyDoTuChoi = text;

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
                return this.genFunc.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                return "";
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
        stt = this.tableFunc.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                tenDmuc: data.tenDmuc,
                maNdung: data.maNdung,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.tableFunc.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].thienNtruoc = this.numFunc.sum([this.lstCtietBcao[index].thienNtruoc, item.thienNtruoc]);
                    this.lstCtietBcao[index].namDtoan = this.numFunc.sum([this.lstCtietBcao[index].namDtoan, item.namDtoan]);
                    this.lstCtietBcao[index].namUocThien = this.numFunc.sum([this.lstCtietBcao[index].namUocThien, item.namUocThien]);
                    this.lstCtietBcao[index].namKh = this.numFunc.sum([this.lstCtietBcao[index].namKh, item.namKh]);
                    this.lstCtietBcao[index].giaTriThamDinh = this.numFunc.sum([this.lstCtietBcao[index].giaTriThamDinh, item.giaTriThamDinh]);
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
                this.total.thienNtruoc = this.numFunc.sum([this.total.thienNtruoc, item.thienNtruoc]);
                this.total.namDtoan = this.numFunc.sum([this.total.namDtoan, item.namDtoan]);
                this.total.namUocThien = this.numFunc.sum([this.total.namUocThien, item.namUocThien]);
                this.total.namKh = this.numFunc.sum([this.total.namKh, item.namKh]);
                this.total.giaTriThamDinh = this.numFunc.sum([this.total.giaTriThamDinh, item.giaTriThamDinh]);
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

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 10, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Chi tiêu' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 1, l: 3, r: 3, val: 'Số thực hiện năm ' + (this.namBcao - 2).toString() },
            { t: 0, b: 0, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
            { t: 1, b: 1, l: 4, r: 4, val: 'Dự toán' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Ước thực hiện' },
            { t: 0, b: 0, l: 6, r: 7, val: 'Năm kế hoạch ' + this.namBcao.toString() },
            { t: 1, b: 1, l: 6, r: 6, val: 'Dự kiến' },
            { t: 1, b: 1, l: 7, r: 7, val: 'Giá trị thẩm định' },
            { t: 0, b: 1, l: 8, r: 8, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
            { t: 0, b: 1, l: 9, r: 9, val: 'Ghi chú' },
            { t: 0, b: 1, l: 10, r: 10, val: 'Ý kiến của đơn vị cấp trên' },
        ]
        const filterData = this.lstCtietBcao.map(item => {
            const { id, maNdung, khvonphiLapThamDinhCtietId, level, ...rest } = item;
            return rest;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = this.genFunc.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: this.genFunc.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, 'TT342_BM13.1.xlsx');
    }

}
