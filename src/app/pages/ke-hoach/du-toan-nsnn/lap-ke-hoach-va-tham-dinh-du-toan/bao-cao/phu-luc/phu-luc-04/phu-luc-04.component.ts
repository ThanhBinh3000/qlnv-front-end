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
    noiDung: string;
    tenNoiDung: string;
    soLuong: number;
    soLuongTd: number;
    tongMucDuToan: number;
    tongMucDuToanTd: number;
    duToanDaBoTriNamN2: number;
    duToanNamN1Dmdt: number;
    duToanNamN1UocTh: number;
    duToanKhNamNCbDauTu: number;
    duToanKhNamNThDauTu: number;
    duToanKhNamNCbDauTuTd: number;
    duToanKhNamNThDauTuTd: number;
    duToanNamTiepTheoN1CbDauTu: number;
    duToanNamTiepTheoN1ThDauTu: number;
    duToanNamTiepTheoN2CbDauTu: number;
    duToanNamTiepTheoN2ThDauTu: number;
    chenhLechCbDautu: number;
    chenhLechThDauTu: number;
    cacNamTiepTheo: number;
    ghiChu: string;
    yKienCapTren: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.tongMucDuToan = Operator.sum([
            this.duToanDaBoTriNamN2,
            this.duToanNamN1Dmdt,
            this.duToanKhNamNCbDauTu,
            this.duToanKhNamNThDauTu,
            this.duToanNamTiepTheoN1CbDauTu,
            this.duToanNamTiepTheoN1ThDauTu,
            this.duToanNamTiepTheoN2CbDauTu,
            this.duToanNamTiepTheoN2ThDauTu,
            this.cacNamTiepTheo,
        ]);
        this.tongMucDuToanTd = Operator.sum([
            this.duToanDaBoTriNamN2,
            this.duToanNamN1Dmdt,
            this.duToanKhNamNCbDauTuTd,
            this.duToanKhNamNThDauTuTd,
            this.duToanNamTiepTheoN1CbDauTu,
            this.duToanNamTiepTheoN1ThDauTu,
            this.duToanNamTiepTheoN2CbDauTu,
            this.duToanNamTiepTheoN2ThDauTu,
            this.cacNamTiepTheo,
        ]);
        this.chenhLechCbDautu = Operator.sum([this.duToanKhNamNCbDauTuTd, -this.duToanKhNamNCbDauTu]);
        this.chenhLechThDauTu = Operator.sum([this.duToanKhNamNThDauTuTd, -this.duToanKhNamNThDauTu]);
    }

    upperBound() {
        return this.tongMucDuToan > Utils.MONEY_LIMIT || this.tongMucDuToanTd > Utils.MONEY_LIMIT;
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return String.fromCharCode(k + 96).toUpperCase();
            case 1:
                return Utils.laMa(k);
            case 2:
                return chiSo[n];
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
    selector: 'app-phu-luc-04',
    templateUrl: './phu-luc-04.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})

export class PhuLuc04Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    duAns: any[] = [];
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
        private lapThamDinhService: LapThamDinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucDungChungService,
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
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_PL4');
            if (category) {
                this.duAns = category.data;
            }
            this.scrollX = Table.tableWidth(350, 12, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 18, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 18, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 12, 1, 0);
            }
        }
        if (this.lstCtietBcao.length == 0) {
            this.duAns.forEach(e => {
                this.lstCtietBcao.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenNoiDung: e.giaTri,
                    noiDung: e.ma,
                }))
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.noiDung;
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
            lstCtietBcaoTemp.push(item.request())
        })

        if (!this.status.viewAppVal) {
            lstCtietBcaoTemp?.forEach(item => {
                item.soLuongTd = item.soLuong;
                item.tongMucDuToanTd = item.tongMucDuToan;
                item.duToanKhNamNCbDauTuTd = item.duToanKhNamNCbDauTu;
                item.duToanKhNamNThDauTuTd = item.duToanKhNamNThDauTu;
                item.chenhLechCbDautu = Operator.sum([item.duToanKhNamNCbDauTuTd, -item.duToanKhNamNCbDauTu]);
                item.chenhLechThDauTu = Operator.sum([item.duToanKhNamNThDauTuTd, -item.duToanKhNamNThDauTu]);
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
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
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

    addLine(id: string) {
        this.lstCtietBcao = Table.addChild(id, new ItemData({}), this.lstCtietBcao);
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

    checkEdit(stt: string) {
        return this.lstCtietBcao.every(e => Table.preIndex(e.stt) != stt);
    }

    checkAdd(data: ItemData) {
        if (data.stt == '0.3' || (data.level == 1 && data.noiDung)) {
            return true;
        }
        return false;
    }

    checkDelete(maDa: string) {
        if (!maDa) {
            return true;
        }
        return false;
    }

    //xóa dòng
    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
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
        let header = [];
        let fieldOrder = [];
        let calHeader = [];
        if (this.status.viewAppVal) {
            header = [
                { t: 0, b: 5, l: 0, r: 21, val: null },
                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 4, l: 2, r: 3, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Nhu cầu của đơn vị' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Thẩm định' },
                { t: 4, b: 4, l: 4, r: 5, val: 'Tổng mức dự toán' },
                { t: 5, b: 5, l: 4, r: 4, val: 'Nhu cầu của đơn vị' },
                { t: 5, b: 5, l: 5, r: 5, val: 'Thẩm định' },
                { t: 4, b: 5, l: 6, r: 6, val: 'Dự toán được bố trí đến hết năm ' + (this.namBcao - 2).toString() },
                { t: 4, b: 4, l: 7, r: 8, val: 'Dự toán năm thực hiện ' + (this.namBcao - 1).toString() },
                { t: 5, b: 5, l: 7, r: 7, val: 'DMDT ' + (this.namBcao - 1).toString() },
                { t: 5, b: 5, l: 8, r: 8, val: 'Ước thực hiện' },
                { t: 4, b: 4, l: 9, r: 10, val: 'Dự toán năm kế hoạch ' + (this.namBcao).toString() },
                { t: 5, b: 5, l: 9, r: 9, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 10, r: 10, val: 'TH đầu tư' },
                { t: 4, b: 4, l: 11, r: 12, val: 'Thẩm định' },
                { t: 5, b: 5, l: 11, r: 11, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 12, r: 12, val: 'TH đầu tư' },
                { t: 4, b: 4, l: 13, r: 14, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
                { t: 5, b: 5, l: 13, r: 13, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 14, r: 14, val: 'TH đầu tư' },
                { t: 4, b: 4, l: 15, r: 16, val: 'Dự toán năm tiếp theo ' + (this.namBcao + 1).toString() },
                { t: 5, b: 5, l: 15, r: 15, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 16, r: 16, val: 'TH đầu tư' },
                { t: 4, b: 4, l: 17, r: 18, val: 'Dự toán năm tiếp theo ' + (this.namBcao + 2).toString() },
                { t: 5, b: 5, l: 17, r: 17, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 18, r: 18, val: 'TH đầu tư' },
                { t: 4, b: 5, l: 19, r: 19, val: 'Các năm tiếp theo' },
                { t: 4, b: 5, l: 20, r: 20, val: 'Ghi chú' },
                { t: 4, b: 5, l: 21, r: 21, val: 'Ý kiến của đơn vị cấp trên' },
            ]
            fieldOrder = ['stt', 'tenNoiDung', 'soLuong', 'soLuongTd', 'tongMucDuToan', 'tongMucDuToanTd', 'duToanDaBoTriNamN2', 'duToanNamN1Dmdt', 'duToanNamN1UocTh',
                'duToanKhNamNCbDauTu', 'duToanKhNamNThDauTu', 'duToanKhNamNCbDauTuTd', 'duToanKhNamNThDauTuTd', 'chenhLechCbDautu', 'chenhLechThDauTu',
                'duToanNamTiepTheoN1CbDauTu', 'duToanNamTiepTheoN1ThDauTu', 'duToanNamTiepTheoN2CbDauTu', 'duToanNamTiepTheoN2ThDauTu', 'cacNamTiepTheo', 'ghiChu', 'ykienDviCtren']
            calHeader = ['1', '2', '3', '3A', '4=5+6+7+8+9+10+...+14', '4A=5+6+7+8A+9A+10+...+14', '5', '6', '7', '8', '9', '8A', '9A', '8B=8A-8', '9B=9A-9', '10', '11', '12', '13', '14', '15', '16'];
        } else {
            header = [
                { t: 0, b: 5, l: 0, r: 14, val: null },
                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung' },
                { t: 4, b: 4, l: 2, r: 2, val: 'Số lượng' },
                { t: 5, b: 5, l: 2, r: 2, val: 'Nhu cầu của đơn vị' },
                { t: 4, b: 4, l: 3, r: 3, val: 'Tổng mức dự toán' },
                { t: 5, b: 5, l: 3, r: 3, val: 'Nhu cầu của đơn vị' },
                { t: 4, b: 5, l: 4, r: 4, val: 'Dự toán được bố trí đến hết năm ' + (this.namBcao - 2).toString() },
                { t: 4, b: 4, l: 5, r: 6, val: 'Dự toán năm thực hiện ' + (this.namBcao - 1).toString() },
                { t: 5, b: 5, l: 5, r: 5, val: 'DMDT ' + (this.namBcao - 1).toString() },
                { t: 5, b: 5, l: 6, r: 6, val: 'Ước thực hiện' },
                { t: 4, b: 4, l: 7, r: 8, val: 'Dự toán năm kế hoạch ' + (this.namBcao).toString() },
                { t: 5, b: 5, l: 7, r: 7, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 8, r: 8, val: 'TH đầu tư' },
                { t: 4, b: 4, l: 9, r: 10, val: 'Dự toán năm tiếp theo ' + (this.namBcao + 1).toString() },
                { t: 5, b: 5, l: 9, r: 9, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 10, r: 10, val: 'TH đầu tư' },
                { t: 4, b: 4, l: 11, r: 12, val: 'Dự toán năm tiếp theo ' + (this.namBcao + 2).toString() },
                { t: 5, b: 5, l: 11, r: 11, val: 'CB đầu tư' },
                { t: 5, b: 5, l: 12, r: 12, val: 'TH đầu tư' },
                { t: 4, b: 5, l: 13, r: 13, val: 'Các năm tiếp theo' },
                { t: 4, b: 5, l: 14, r: 14, val: 'Ghi chú' },
            ]
            fieldOrder = ['stt', 'tenNoiDung', 'soLuong', 'tongMucDuToan', 'duToanDaBoTriNamN2', 'duToanNamN1Dmdt', 'duToanNamN1UocTh',
                'duToanKhNamNCbDauTu', 'duToanKhNamNThDauTu', 'duToanNamTiepTheoN1CbDauTu', 'duToanNamTiepTheoN1ThDauTu', 'duToanNamTiepTheoN2CbDauTu',
                'duToanNamTiepTheoN2ThDauTu', 'cacNamTiepTheo', 'ghiChu'];
            calHeader = ['1', '2', '3', '4=5+6+7+8+9+10+...+14', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
        }

        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : Utils.getValue(item[field]);
            })
            return row;
        })
        let row: any = {};
        fieldOrder.forEach(field => {
            row[field] = field == 'tenNoiDung' ? 'Tổng cộng A + B' : Utils.getValue(this.total[field]);
        })
        filterData.unshift(row);
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
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_IV.xlsx');
    }
}
