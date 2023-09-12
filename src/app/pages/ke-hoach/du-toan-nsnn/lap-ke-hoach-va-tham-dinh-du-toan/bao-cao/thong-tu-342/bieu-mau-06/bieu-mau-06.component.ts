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
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ThuChi {
    id: string;
    maDvi: string;
    tenDvi: string;
    uocThNam: number;
    namKh: number;
    thamDinh: number;
}

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
    lstDvi: ThuChi[];

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.chenhLech = Operator.sum([this.thamDinh, -this.namKh]);
    }

    getIndex() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return String.fromCharCode(k + 48);
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

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        temp.lstDvi.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })
        return temp;
    }
}

@Component({
    selector: 'app-bieu-mau-06',
    templateUrl: './bieu-mau-06.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau06Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    //danh muc
    lstDvi: any[] = [];
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

        this.lstCtietBcao[0].lstDvi.forEach(item => {
            this.lstDvi.push({
                maDvi: item.maDvi,
                tenDvi: item.tenDvi,
            })
        })
        this.scrollX = Table.tableWidth(350, 3 * (this.lstDvi?.length + 1), 0, 0);
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        this.lstCtietBcao.forEach(item => {
            item.lstDvi.sort((a, b) => {
                if (this.lstDvi.findIndex(e => e.maDvi == a.maDvi) >= this.lstDvi.findIndex(e => e.maDvi == b.maDvi)) {
                    return 1;
                }
                return -1
            })
        })
        if (this.formDetail.trangThai == Status.NEW) {
            this.lstCtietBcao.forEach(item => {
                item.uocThNam = null;
                item.namKh = null;
                item.thamDinh = null;
                item.lstDvi.forEach(unit => {
                    item.uocThNam = Operator.sum([item.uocThNam, unit.uocThNam]);
                    item.namKh = Operator.sum([item.namKh, unit.namKh]);
                    item.thamDinh = Operator.sum([item.thamDinh, unit.thamDinh]);
                })
            })
        }

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
        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push(item.request());
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
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
        const header = [
            { t: 0, b: 7 + this.lstCtietBcao.length, l: 0, r: 4 + 3 * this.lstDvi.length, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 4, b: 6, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 6, l: 1, r: 1, val: 'Chỉ tiêu' },
            { t: 4, b: 5, l: 2, r: 4, val: 'Tổng số' },
            { t: 6, b: 6, l: 2, r: 2, val: 'Ước thực hiện năm ' + (this.dataInfo.namBcao - 1).toString() + ' (Năm hiện hành)' },
            { t: 6, b: 6, l: 3, r: 3, val: 'Dự toán năm ' + (this.dataInfo.namBcao).toString() + ' (Năm kế hoạch)' },
            { t: 6, b: 6, l: 4, r: 4, val: 'Thẩm định Dự toán năm ' + (this.dataInfo.namBcao).toString() + ' (Năm kế hoạch)' },
            { t: 7, b: 7, l: 0, r: 0, val: 'A' },
            { t: 7, b: 7, l: 1, r: 1, val: 'B' },
            { t: 7, b: 7, l: 2, r: 2, val: '1' },
            { t: 7, b: 7, l: 3, r: 3, val: '2' },
            { t: 7, b: 7, l: 4, r: 4, val: '3' },
        ]
        if (this.lstDvi.length > 0) {
            header.push({ t: 4, b: 4, l: 5, r: 4 + 3 * this.lstDvi.length, val: 'Chi tiết đơn vị báo cáo' })
        }
        this.lstDvi.forEach((item, index) => {
            const left = 4 + index * 3;
            header.push({ t: 5, b: 5, l: left + 1, r: left + 3, val: item.tenDvi })
            header.push({ t: 6, b: 6, l: left + 1, r: left + 1, val: 'Ước thực hiện năm ' + (this.dataInfo.namBcao - 1).toString() + ' (Năm hiện hành)' })
            header.push({ t: 6, b: 6, l: left + 2, r: left + 2, val: 'Dự toán năm ' + (this.dataInfo.namBcao).toString() + ' (Năm kế hoạch)' })
            header.push({ t: 6, b: 6, l: left + 3, r: left + 3, val: 'Thẩm định Dự toán năm ' + (this.dataInfo.namBcao).toString() + ' (Năm kế hoạch)' })
            header.push({ t: 7, b: 7, l: left + 1, r: left + 1, val: '(1)' })
            header.push({ t: 7, b: 7, l: left + 2, r: left + 2, val: '(2)' })
            header.push({ t: 7, b: 7, l: left + 3, r: left + 3, val: '(3)' })
        })
        const headerBot = 7;
        this.lstCtietBcao.forEach((item, index) => {
            const row = headerBot + index + 1;
            header.push({ t: row, b: row, l: 0, r: 0, val: item.getIndex() })
            header.push({ t: row, b: row, l: 1, r: 1, val: item.tenChiTieu })
            header.push({ t: row, b: row, l: 2, r: 2, val: item.uocThNam })
            header.push({ t: row, b: row, l: 3, r: 3, val: item.namKh })
            header.push({ t: row, b: row, l: 4, r: 4, val: item.thamDinh })
            item.lstDvi.forEach((e, ind) => {
                const col = 4 + ind * 3;
                header.push({ t: row, b: row, l: col + 1, r: col + 1, val: e.uocThNam })
                header.push({ t: row, b: row, l: col + 2, r: col + 2, val: e.namKh })
                header.push({ t: row, b: row, l: col + 3, r: col + 3, val: e.thamDinh })
            })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_06.xlsx');
    }
}
