import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogChonDanhMucChoBieuMauComponent } from 'src/app/components/dialog/dialog-chon-danh-muc-cho-bieu-mau/dialog-chon-danh-muc-cho-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Dtc, Form } from '../../bao-cao-thuc-hien-du-toan-chi.constant';

export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdung: string;
    tenNdung: string;
    dtoanSdungNamTcong: number;
    dtoanSdungNamNguonNsnn: number;
    dtoanSdungNamNguonSn: number;
    dtoanSdungNamNguonQuy: number;
    giaiNganThangTcong: number;
    giaiNganThangTcongTle: number;
    giaiNganThangNguonNsnn: number;
    giaiNganThangNguonNsnnTle: number;
    giaiNganThangNguonSn: number;
    giaiNganThangNguonSnTle: number;
    giaiNganThangNguonQuy: number;
    giaiNganThangNguonQuyTle: number;
    luyKeGiaiNganTcong: number;
    luyKeGiaiNganTcongTle: number;
    luyKeGiaiNganNguonNsnn: number;
    luyKeGiaiNganNguonNsnnTle: number;
    luyKeGiaiNganNguonSn: number;
    luyKeGiaiNganNguonSnTle: number;
    luyKeGiaiNganNguonQuy: number;
    luyKeGiaiNganNguonQuyTle: number;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    sum() {
        this.dtoanSdungNamTcong = Operator.sum([this.dtoanSdungNamNguonNsnn, this.dtoanSdungNamNguonSn, this.dtoanSdungNamNguonQuy]);
        this.giaiNganThangTcong = Operator.sum([this.giaiNganThangNguonNsnn, this.giaiNganThangNguonSn, this.giaiNganThangNguonQuy]);
        this.luyKeGiaiNganTcong = Operator.sum([this.luyKeGiaiNganNguonNsnn, this.luyKeGiaiNganNguonSn, this.luyKeGiaiNganNguonQuy]);
    }

    luyKe(data: ItemData) {
        this.luyKeGiaiNganTcong = Operator.sum([data.luyKeGiaiNganTcong, this.giaiNganThangTcong, -data.giaiNganThangTcong]);
        this.luyKeGiaiNganNguonNsnn = Operator.sum([data.luyKeGiaiNganNguonNsnn, this.giaiNganThangNguonNsnn, -data.giaiNganThangNguonNsnn]);
        this.luyKeGiaiNganNguonSn = Operator.sum([data.luyKeGiaiNganNguonSn, this.giaiNganThangNguonSn, -data.giaiNganThangNguonSn]);
        this.luyKeGiaiNganNguonQuy = Operator.sum([data.luyKeGiaiNganNguonQuy, this.giaiNganThangNguonQuy, -data.giaiNganThangNguonQuy]);
    }

    tyLe() {
        this.giaiNganThangTcongTle = Operator.percent(this.giaiNganThangTcong, this.dtoanSdungNamTcong);
        this.giaiNganThangNguonNsnnTle = Operator.percent(this.giaiNganThangNguonNsnn, this.dtoanSdungNamNguonNsnn);
        this.giaiNganThangNguonSnTle = Operator.percent(this.giaiNganThangNguonSn, this.dtoanSdungNamNguonSn);
        this.giaiNganThangNguonQuyTle = Operator.percent(this.giaiNganThangNguonQuy, this.dtoanSdungNamNguonQuy);
        this.luyKeGiaiNganTcongTle = Operator.percent(this.luyKeGiaiNganTcong, this.dtoanSdungNamTcong);
        this.luyKeGiaiNganNguonNsnnTle = Operator.percent(this.luyKeGiaiNganNguonNsnn, this.dtoanSdungNamNguonNsnn);
        this.luyKeGiaiNganNguonSnTle = Operator.percent(this.luyKeGiaiNganNguonSn, this.dtoanSdungNamNguonSn);
        this.luyKeGiaiNganNguonQuyTle = Operator.percent(this.luyKeGiaiNganNguonQuy, this.dtoanSdungNamNguonQuy);
    }

    upperBound() {
        return this.dtoanSdungNamTcong > Utils.MONEY_LIMIT || this.giaiNganThangTcong > Utils.MONEY_LIMIT || this.luyKeGiaiNganTcong > Utils.MONEY_LIMIT;
    }

    index() {
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
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            case 4:
                return String.fromCharCode(k + 96);
            case 5:
                return "-";
            default:
                return '';
        }
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }

    filterNumberFields() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'level') {
                this[key] = null;
            }
        })
    }

    total(data: ItemData) {
        Object.keys(data).forEach(key => {
            if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
                this[key] = Operator.sum([this[key], data[key]]);
            }
        })
    }
}

@Component({
    selector: 'app-phu-luc-2',
    templateUrl: './phu-luc-2.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIIComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    Dtc = Dtc;
    //thong tin
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    scrollX: string;
    namBcao: number;
    //danh muc
    noiDungs: any[] = [];
    lstCtietBcao: ItemData[] = [];
    luyKes: any[] = [];
    //trang thai
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
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
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        this.namBcao = this.dataInfo.namBcao;
        this.luyKes = this.dataInfo.luyKes?.lstCtietBcaos;
        await this.getFormDetail();
        if (this.status.save) {
            const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL2');
            if (category) {
                category.data.forEach(
                    item => {
                        this.noiDungs.push({
                            ...item,
                            level: item.ma?.split('.').length - 2,
                            giaTri: Utils.getName(this.namBcao, item.giaTri),
                        })
                    }
                )
            }
            if (this.lstCtietBcao.length == 0) {
                if (this.luyKes?.length > 0) {
                    this.luyKes?.forEach(item => {
                        const data: ItemData = new ItemData({
                            ...item,
                            id: uuid.v4() + 'FE',
                        })
                        data.sum()
                        data.tyLe();
                        this.lstCtietBcao.push(data)
                    })
                } else {
                    this.noiDungs.forEach(item => {
                        this.lstCtietBcao.push(new ItemData({
                            id: uuid.v4() + 'FE',
                            maNdung: item.ma,
                            stt: item.ma,
                            tenNdung: item.giaTri,
                            level: item.level,
                        }))
                    })
                }
            }
            this.scrollX = Table.tableWidth(350, 20, 0, 170);
        } else {
            this.scrollX = Table.tableWidth(350, 20, 0, 0);
        }

        this.lstCtietBcao.forEach(item => item.tyLe());

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maNdung');
            } else {
                this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
            }
        }
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getFormDetail() {
        await this.baoCaoThucHienDuToanChiService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = [];
                    this.formDetail.lstCtietBcaos.forEach(item => {
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
    async save(trangThai: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
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

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
        }
        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;
        this.spinner.show();
        this.baoCaoThucHienDuToanChiService.baoCaoCapNhatChiTiet(request).toPromise().then(
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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.baoCaoThucHienDuToanChiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                if (mcn == Status.NOT_OK) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    trangThai: mcn,
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
                this.onSubmit(mcn, text);
            }
        });
    }

    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item),
            };
        });
    }
    //thêm cấp thấp hơn
    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
    }
    //xóa dòng
    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const data = this.lstCtietBcao.find(item => item.id === id);
        if (!data.maNdung) {
            this.deleteLine(id);
        }
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(data),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maNdung) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }


    updateChecked(id: string) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(this.lstCtietBcao[index].stt));
                if (index == -1) {
                    this.allChecked = this.checkAllChild('0');
                    break;
                }
                nho = this.lstCtietBcao[index].checked;
            }
        }
    }
    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        let nho = true;
        this.lstCtietBcao.forEach(item => {
            if ((Table.preIndex(item.stt) == str) && (!item.checked)) {
                nho = item.checked;
            }
        })
        return nho;
    }

    updateAllChecked() {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    deleteAllChecked() {
        const lstId: string[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    }

    addLine(id?: string) {
        const maNdung = id ? this.lstCtietBcao.find(e => e.id == id).maNdung : '0';
        const level = maNdung.split('.').length - 1;
        let dmNdung = this.noiDungs.filter(e => e.ma.startsWith(maNdung) && e.level == level);
        dmNdung = dmNdung.filter(e => this.lstCtietBcao.findIndex(item => item.maNdung == e.ma) == -1);
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogChonDanhMucChoBieuMauComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                danhSachBieuMau: dmNdung,
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        const data: ItemData = new ItemData({
                            id: uuid.v4() + 'FE',
                            maNdung: item.ma,
                            level: item.level,
                            tenNdung: item.giaTri,
                        })
                        if (this.lstCtietBcao.length == 0) {
                            this.lstCtietBcao = Table.addHead(data, this.lstCtietBcao);
                        } else {
                            if (level == 0) {
                                const index = this.lstCtietBcao.map(item => item.level).lastIndexOf(0);
                                id = this.lstCtietBcao[index].id;
                                this.addSame(id, data);
                            } else {
                                this.addLow(id, data);
                            }
                        }
                    }
                    this.updateEditCache();
                })
            }
        });
    }

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1;
    }

    getDeleteStatus(data: ItemData) {
        return this.luyKes.findIndex(e => e.maNdung == data.maNdung) != -1;
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.lstCtietBcao[index].filterNumberFields();
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].total(item);
                }
            })
            this.lstCtietBcao[index].tyLe();
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.filterNumberFields();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.total(item);
            }
        })
        this.total.tyLe();
    }


    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.sum();
        this.editCache[id].data.luyKe(data);
        this.editCache[id].data.tyLe();
    }

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
            { t: 0, b: 7, l: 0, r: 21, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 10, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 10, val: this.dataInfo.congVan },
            { t: 4, b: 7, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 7, l: 1, r: 1, val: 'Danh mục nội dung' },
            { t: 4, b: 4, l: 2, r: 5, val: 'Dự toán được sử dụng trong năm' },
            { t: 5, b: 7, l: 2, r: 2, val: 'Tổng cộng' },
            { t: 5, b: 5, l: 3, r: 5, val: 'Trong đó' },
            { t: 6, b: 7, l: 3, r: 3, val: 'Nguồn NSNN' },
            { t: 6, b: 7, l: 4, r: 4, val: 'Nguồn thu SN' },
            { t: 6, b: 7, l: 5, r: 5, val: 'Nguồn quỹ' },
            { t: 4, b: 4, l: 6, r: 13, val: 'Giải ngân tháng báo cáo' },
            { t: 5, b: 6, l: 6, r: 7, val: 'Tổng cộng' },
            { t: 7, b: 7, l: 6, r: 6, val: 'Số tiền' },
            { t: 7, b: 7, l: 7, r: 7, val: 'Tỷ lệ (%)' },
            { t: 5, b: 5, l: 8, r: 13, val: 'Trong đó' },
            { t: 6, b: 6, l: 8, r: 9, val: 'Nguồn NSNN' },
            { t: 7, b: 7, l: 8, r: 8, val: 'Số tiền' },
            { t: 7, b: 7, l: 9, r: 9, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 10, r: 11, val: 'Nguồn thu SN' },
            { t: 7, b: 7, l: 10, r: 10, val: 'Số tiền' },
            { t: 7, b: 7, l: 11, r: 11, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 12, r: 13, val: 'Nguồn quỹ' },
            { t: 7, b: 7, l: 12, r: 12, val: 'Số tiền' },
            { t: 7, b: 7, l: 13, r: 13, val: 'Tỷ lệ (%)' },
            { t: 4, b: 4, l: 14, r: 21, val: 'Lũy kế giải ngân từ đầu năm đến tháng báo cáo đối với báo cáo tháng (đến hết thời gian chỉnh lý quyết toán ngân sách - ngày 31/1 năm sau đối với báo cáo năm)' },
            { t: 5, b: 6, l: 14, r: 15, val: 'Tổng cộng' },
            { t: 7, b: 7, l: 14, r: 14, val: 'Số tiền' },
            { t: 7, b: 7, l: 15, r: 15, val: 'Tỷ lệ (%)' },
            { t: 5, b: 5, l: 16, r: 21, val: 'Trong đó' },
            { t: 6, b: 6, l: 16, r: 17, val: 'Nguồn NSNN' },
            { t: 7, b: 7, l: 16, r: 16, val: 'Số tiền' },
            { t: 7, b: 7, l: 17, r: 17, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 18, r: 19, val: 'Nguồn thu SN' },
            { t: 7, b: 7, l: 18, r: 18, val: 'Số tiền' },
            { t: 7, b: 7, l: 19, r: 19, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 20, r: 21, val: 'Nguồn quỹ' },
            { t: 7, b: 7, l: 20, r: 20, val: 'Số tiền' },
            { t: 7, b: 7, l: 21, r: 21, val: 'Tỷ lệ (%)' },
        ]
        const fieldOrder = ['stt', 'tenNdung', 'dtoanSdungNamTcong', 'dtoanSdungNamNguonNsnn', 'dtoanSdungNamNguonSn', 'dtoanSdungNamNguonQuy', 'giaiNganThangTcong', 'giaiNganThangTcongTle', 'giaiNganThangNguonNsnn',
            'giaiNganThangNguonNsnnTle', 'giaiNganThangNguonSn', 'giaiNganThangNguonSnTle', 'giaiNganThangNguonQuy', 'giaiNganThangNguonQuyTle', 'luyKeGiaiNganTcong', 'luyKeGiaiNganTcongTle', 'luyKeGiaiNganNguonNsnn',
            'luyKeGiaiNganNguonNsnnTle', 'luyKeGiaiNganNguonSn', 'luyKeGiaiNganNguonSnTle', 'luyKeGiaiNganNguonQuy', 'luyKeGiaiNganNguonQuyTle'];
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field];
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_Luc_II.xlsx');
    }
}
