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
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    maChiTieu: string;
    tenChiTieu: string;
    thucHienNam: number;
    duToanNam: number;
    uocThNam: number;
    namKh: number;
    thamDinh: number;
    chenhLech: number;
    ykienDviCtren: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.chenhLech = Operator.sum([this.thamDinh, -this.namKh]);
    }

    upperBound() {
        return this.thucHienNam > Utils.MONEY_LIMIT || this.duToanNam > Utils.MONEY_LIMIT || this.uocThNam > Utils.MONEY_LIMIT || this.namKh > Utils.MONEY_LIMIT || this.thamDinh > Utils.MONEY_LIMIT;
    }

    getIndex() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return String.fromCharCode(k + 64);
            case 1:
                return Utils.laMa(k);
            case 2:
                return chiSo[n];
            case 3:
                return '-';
            default:
                return '';
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
            if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
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
    selector: 'app-bieu-mau-05',
    templateUrl: './bieu-mau-05.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau05Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    //danh muc
    chiTieus: any[] = [];
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
            const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM05');
            if (category) {
                this.chiTieus = category.data;
            }
            this.scrollX = Table.tableWidth(350, 4, 0, 60);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 6, 1, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 6, 1, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 4, 0, 0);
            }
        }
        if (this.lstCtietBcao.length == 0) {
            this.chiTieus.forEach(e => {
                this.lstCtietBcao.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maChiTieu: e.ma,
                    tenChiTieu: e.giaTri,
                }))
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maChiTieu;
            })
        }

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);

        this.getTotal();
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
                    this.lstCtietBcao = [];
                    this.formDetail.lstCtietLapThamDinhs.forEach(item => {
                        this.lstCtietBcao.push(new ItemData(item));
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

        if (this.lstCtietBcao.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push(item.request());
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.thamDinh = item.namKh;
                item.chenhLech = Operator.sum([item.thamDinh, item.namKh ? -item.namKh : null]);
            })
        }

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
                data: new ItemData(item)
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
            data: new ItemData(this.lstCtietBcao[index]),
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
            this.lstCtietBcao[index].clear();
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].sum(item);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.clear();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }

    checkEdit(data: ItemData) {
        if (['0.2.2', '0.2.3.10', '0.2.3.11', '0.2.3.12'].includes(data.maChiTieu)) {
            return false;
        }
        return this.lstCtietBcao.every(e => Table.preIndex(e.stt) != data.stt);
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
            { t: 0, b: 5, l: 0, r: 5, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Chỉ tiêu' },
            { t: 4, b: 5, l: 2, r: 2, val: 'Thực hiện năm ' + (this.dataInfo.namBcao - 2).toString() + ' (năm trước)' },
            { t: 4, b: 4, l: 3, r: 4, val: 'Năm ' + (this.dataInfo.namBcao - 1).toString() + ' (Năm hiện hành)' },
            { t: 5, b: 5, l: 3, r: 3, val: 'Dự toán' },
            { t: 5, b: 5, l: 4, r: 4, val: 'Ước thực hiện' },
            { t: 4, b: 5, l: 5, r: 5, val: 'Dự toán năm ' + (this.dataInfo.namBcao).toString() + ' (năm kế hoạch)' },
        ]
        const fieldOrder = ['stt', 'tenChiTieu', 'thucHienNam', 'duToanNam', 'uocThNam', 'namKh'];
        const calHeader = ['A', 'B', '1', '2', '3', '4'];
        if (this.status.viewAppVal) {
            header.push({ t: 4, b: 5, l: 6, r: 6, val: 'Thẩm định' });
            header.push({ t: 4, b: 5, l: 7, r: 7, val: 'Chênh lệch giữa thẩm định của Đơn vị cấp trên và nhu cầu của Đơn vị cấp dưới' });
            header.push({ t: 4, b: 5, l: 8, r: 8, val: 'Ý kiến của Đơn vị cấp trên' });
            fieldOrder.push('thamDinh');
            fieldOrder.push('chenhLech');
            fieldOrder.push('ykienDviCtren');
            calHeader.push('5');
            calHeader.push('6=4-5');
            calHeader.push('7');
        }
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.getIndex() : Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        let cal = {};
        fieldOrder.forEach((field, index) => {
            cal[field] = calHeader[index];
        })
        filterData.unshift(cal);
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            if (!this.status.viewAppVal && XLSX.utils.decode_cell(cell).c > 5) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_05.xlsx');
    }
}
