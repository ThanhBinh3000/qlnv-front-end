import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
import { DANH_MUC } from './phu-luc-03.constant';

export class ItemData {
    id: string;
    level: number;
    stt: string;
    danhMuc: string;
    tenDanhMuc: string;
    maDviTinh: string;
    namDtCphiTaiCkhoSl: number;
    namDtCphiTaiCkhoDm: number;
    namDtCphiTaiCkhoTt: number;
    namDtCphiNgoaiCkhoBq: number;
    namDtCphiNgoaiCkhoTt: number;
    namDtTcong: number;
    checked: boolean;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.namDtCphiTaiCkhoTt = Operator.mul(this.namDtCphiTaiCkhoSl, this.namDtCphiTaiCkhoDm);
        this.namDtCphiNgoaiCkhoTt = Operator.mul(this.namDtCphiNgoaiCkhoBq, this.namDtCphiTaiCkhoSl);
        this.namDtTcong = Operator.sum([this.namDtCphiNgoaiCkhoTt, this.namDtCphiTaiCkhoTt]);
    }

    upperBound() {
        return this.namDtCphiTaiCkhoTt > Utils.MONEY_LIMIT;
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            default:
                return null;
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
    selector: 'app-phu-luc-03',
    templateUrl: './phu-luc-03.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc03Component implements OnInit {
    @Input() dataInfo;

    Op = new Operator('1');
    Utils = Utils;

    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;

    //danh muc
    linhVucChis: any[] = DANH_MUC;
    lstCtietBcaos: ItemData[] = [];
    listVattu: any[] = [];
    lstVatTuFull = [];
    dsDinhMuc: any[] = [];
    scrollX: string;


    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
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
        private giaoDuToanService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private quanLyVonPhiService: QuanLyVonPhiService,
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
        this.namBcao = this.dataInfo.namBcao;

        if (this.lstCtietBcaos.length == 0) {
            this.linhVucChis.forEach(e => {
                this.lstCtietBcaos.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenDanhMuc: e.giaTri,
                    danhMuc: e.ma,
                }))
            })
            this.setLevel();
        } else if (!this.lstCtietBcaos[0]?.stt) {
            this.lstCtietBcaos.forEach(item => {
                item.stt = item.danhMuc;
            })
        }

        await this.getDinhMuc();
        this.lstCtietBcaos.forEach(item => {
            const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc);
            if (!item.tenDanhMuc) {
                item.tenDanhMuc = dinhMuc?.tenDinhMuc;
                item.namDtCphiTaiCkhoDm = dinhMuc?.tongDmuc;
                item.maDviTinh = dinhMuc?.donViTinh;
                item.namDtCphiTaiCkhoTt = Operator.mul(item.namDtCphiTaiCkhoDm, item.namDtCphiTaiCkhoSl);
            }
        })


        if (this.dataInfo?.isSynthetic) {
            this.lstCtietBcaos.forEach(item => {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc);
                // item.namDtCphiNgoaiCkhoBq = 0;
                item.namDtCphiTaiCkhoDm = dinhMuc?.tongDmuc;
                item.namDtCphiTaiCkhoTt = Operator.mul(item.namDtCphiTaiCkhoDm, item.namDtCphiTaiCkhoSl);
                item.namDtTcong = Operator.sum([item.namDtCphiTaiCkhoTt, item.namDtCphiNgoaiCkhoTt])
            })
            this.sum1()
        }

        this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos);

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    async getFormDetail() {
        await this.giaoDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietBcaos.forEach(item => {
                        this.lstCtietBcaos.push(new ItemData(item));
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


    sum1() {
        this.lstCtietBcaos.forEach(item => {
            this.sum(item.stt);
        })
    }

    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '02',
            maDvi: this.dataInfo?.maDvi,
        }
        await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMuc = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcaos.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcaos.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcaos.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
        }

        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;
        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }
        this.spinner.show();
        this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
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
        this.getTotal()
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.formDetail?.id) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
            return;
        }
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.formDetail.trangThai = mcn;
                this.getStatusButton();
                if (mcn == "0") {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    formDetail: this.formDetail,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
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
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    // gan editCache.data == lstCtietBcaos
    updateEditCache(): void {
        this.lstCtietBcaos.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    }

    // start edit
    startEdit(id: string): void {
        if (this.lstCtietBcaos.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcaos[index]),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcaos[index].stt);
        this.getTotal()
        this.updateEditCache();
    }

    changeVatTu(maDanhMuc: any, id: any) {
        this.editCache[id].data.tenDanhMuc = this.lstVatTuFull.find(vt => vt.id === maDanhMuc)?.ten;
    }

    setLevel() {
        this.lstCtietBcaos.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcaos.findIndex(e => e.stt == stt);
            this.lstCtietBcaos[index].clear();
            this.lstCtietBcaos.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcaos[index].sum(item);
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.clear();
        this.lstCtietBcaos.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcaos.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    checkAdd(data: ItemData) {
        if ((data.level == 0 && data.danhMuc)) {
            return true;
        }
        return false;
    }

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 1) {
            return true;
        }
        return false;
    }

    //xóa dòng
    deleteLine(id: string) {
        const stt = this.lstCtietBcaos.find(e => e.id === id)?.stt;
        this.lstCtietBcaos = Table.deleteRow(id, this.lstCtietBcaos);
        this.sum(stt);
        this.updateEditCache();
    }

    doPrint() {
        const WindowPrt = window.open(
            '',
            '',
            'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        printContent = printContent + '<div>';
        printContent =
            printContent + document.getElementById('tablePrint').innerHTML;
        printContent = printContent + '</div>';
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }

    selectGoods() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogDanhSachVatTuHangHoaComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (data) => {
            if (data) {
                const dm = this.dsDinhMuc.find(e => e.cloaiVthh == data.ma);
                if (this.lstCtietBcaos.findIndex(e => e.danhMuc == data.ma) == -1) {
                    let stt: any;
                    const index = this.lstCtietBcaos.findIndex(e => e.danhMuc == '0.2');
                    if (data.ma.startsWith('02')) {
                        stt = '0.2.' + (this.lstCtietBcaos.length - index).toString();
                        //them vat tu moi vao bang
                        this.lstCtietBcaos.push(new ItemData({

                            id: uuid.v4() + 'FE',
                            stt: stt,
                            danhMuc: data.ma,
                            tenDanhMuc: data.ten,
                            maDviTinh: dm?.donViTinh,
                            namDtCphiTaiCkhoDm: dm?.tongDmuc,
                            level: 1,
                        }))
                        this.lstCtietBcaos.forEach(e => {
                            if (e.stt.startsWith("0.2.")) {
                                this.lstCtietBcaos[index].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcaos[index].namDtCphiTaiCkhoSl = null;
                                this.lstCtietBcaos[index].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcaos[index].namDtCphiTaiCkhoTt = null;
                                this.lstCtietBcaos[index].namDtCphiNgoaiCkhoTt = null;
                                this.lstCtietBcaos[index].namDtTcong = null;
                                this.lstCtietBcaos[index].namDtCphiNgoaiCkhoBq = null;
                            }
                        })
                        this.getTotal()
                        this.updateEditCache();
                    } else {
                        stt = '0.1.' + index.toString();
                        this.lstCtietBcaos.splice(index, 0,
                            new ItemData({
                                id: uuid.v4() + 'FE',
                                stt: stt,
                                danhMuc: data.ma,
                                tenDanhMuc: data.ten,
                                maDviTinh: dm?.donViTinh,
                                namDtCphiTaiCkhoDm: dm?.tongDmuc,
                                level: 1,
                            })
                        )
                        const index2 = this.lstCtietBcaos.findIndex(e => e.danhMuc == '0.1');
                        this.lstCtietBcaos.forEach(e => {
                            if (e.stt.startsWith("0.1.")) {
                                this.lstCtietBcaos[index2].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcaos[index2].namDtCphiTaiCkhoSl = null;
                                this.lstCtietBcaos[index2].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcaos[index2].namDtCphiTaiCkhoTt = null;
                                this.lstCtietBcaos[index2].namDtCphiNgoaiCkhoTt = null;
                                this.lstCtietBcaos[index2].namDtTcong = null;
                                this.lstCtietBcaos[index2].namDtCphiNgoaiCkhoBq = null;
                            }
                        })
                        this.getTotal()
                        this.updateEditCache();
                    }

                }
            }
        });
    };

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
            { t: 0, b: 2, l: 0, r: 8, val: null },
            { t: 0, b: 0, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 0, l: 1, r: 1, val: 'Danh mục' },
            { t: 0, b: 0, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 0, l: 3, r: 7, val: 'Năm dự toán' + (this.namBcao - 1).toString() },

            { t: 1, b: 1, l: 3, r: 5, val: 'Chi phí tại cửa kho' },
            { t: 1, b: 1, l: 5, r: 6, val: 'Chi phí ngoài cửa kho' },
            { t: 1, b: 2, l: 7, r: 7, val: 'Tổng cộng' },

            { t: 2, b: 2, l: 3, r: 3, val: 'Số lượng' },
            { t: 2, b: 2, l: 4, r: 4, val: 'Định mức' },
            { t: 2, b: 2, l: 5, r: 5, val: 'Thành tiền' },
            { t: 2, b: 2, l: 6, r: 6, val: 'Bình quân(Đồng/tấn)' },
            { t: 2, b: 2, l: 7, r: 7, val: 'Thành tiền' },
        ]
        const fieldOrder = [
            "stt",
            "tenDanhMuc",
            "maDviTinh",
            "namDtCphiTaiCkhoSl",
            "namDtCphiTaiCkhoDm",
            "namDtCphiTaiCkhoTt",
            "namDtCphiNgoaiCkhoBq",
            "namDtCphiNgoaiCkhoTt",
            "namDtTcong",
        ]

        const filterData = this.lstCtietBcaos.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        if (this.dataInfo.maBieuMau == "pl01N") {
            excelName = excelName + '_Phu_luc_I_nhap.xlsx'
        } else {
            excelName = excelName + '_Phu_luc_I_xuat.xlsx'
        }
        XLSX.writeFile(workbook, excelName);
    }

}


