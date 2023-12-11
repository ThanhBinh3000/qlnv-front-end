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
import { BtnStatus, Doc, Form } from '../../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class UnitItem {
    id: string;
    maDvi: string;
    tenDvi: string;
    slTren: number;
    slDuoi: number;
    slTong: number;
    gtTrenGt: number;
    gtTrenTyLeBh: number;
    gtTrenGtBh: number;
    gtDuoiGt: number;
    gtDuoiTyLeBh: number;
    gtDuoiGtBh: number;
    tong: number;
}

export class ItemData {
    id: string;
    stt: string;
    danhMuc: string;
    tenDanhMuc: string;
    level: number;
    dviTinh: string;

    slTren: number;
    slDuoi: number;
    slTong: number;
    gtTrenGt: number;
    gtTrenTyLeBh: number;
    gtTrenGtBh: number;
    gtDuoiGt: number;
    gtDuoiTyLeBh: number;
    gtDuoiGtBh: number;
    tong: number;
    lstDviCapDuoi: UnitItem[];
}

@Component({
    selector: 'app-tong-hop',
    templateUrl: './tong-hop.component.html',
    styleUrls: ['../../../bao-cao.component.scss']
})
export class TongHopComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    //danh muc
    danhMucs: any[] = [];
    childUnit: any[] = [];
    lstTyLe: any[] = [];
    lstCtietBcao: ItemData[] = [];
    khoiTich: number;
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
        await this.getKhoiTich();
        if (this.lstCtietBcao.length == 0) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_BH');
            if (category) {
                this.danhMucs = category.data;
            }
            this.danhMucs.forEach(e => {
                const tyLe = this.lstTyLe?.find(tl => e.ma == tl.maDmuc);
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    danhMuc: e.ma,
                    gtTrenTyLeBh: tyLe?.tyLeKhoTren,
                    gtDuoiTyLeBh: tyLe?.tyLeKhoDuoi,
                    tenDanhMuc: e.giaTri,
                    dviTinh: e.ghiChu,
                    lstDviCapDuoi: [],
                })
            })
        } else {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.danhMuc;
            })
        }

        this.lstCtietBcao[0].lstDviCapDuoi.forEach(item => {
            this.childUnit.push({
                maDvi: item.maDvi,
                tenDvi: item.tenDvi,
            })
        })

        this.scrollX = Table.tableWidth(450, 11 + 10 * this.childUnit.length, 0, 0);
        //sap xep lai du lieu
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        this.sortUnit();

        this.changeModel();
        this.getTotal();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getKhoiTich() {
        await this.lapThamDinhService.tyLeBaoHiem(this.dataInfo.namBcao).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.khoiTich = data.data.khoiTich;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
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
        if (this.formDetail.lstFiles.some(e => e.isEdit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.tong > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            const data: UnitItem[] = [];
            item.lstDviCapDuoi?.forEach(e => {
                data.push({
                    ...e,
                    id: e.id?.length == 38 ? null : e.id,
                })
            })
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
                lstDviCapDuoi: data,
            })
        })

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

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(stt: string): string {
        let str = stt.substring(stt.indexOf('.') + 1, stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                if (this.lstCtietBcao.findIndex(e => Table.preIndex(e.danhMuc) == stt) == -1) {
                    return null;
                }
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            default:
                return null;
        }
    }

    getIndex(maDvi: string) {
        return this.childUnit.findIndex(e => e.maDvi == maDvi);
    }

    sortUnit() {
        this.lstCtietBcao.forEach(data => {
            data.lstDviCapDuoi.sort((a, b) => {
                if (this.getIndex(a.maDvi) >= this.getIndex(b.maDvi)) {
                    return 1;
                }
                return -1;
            })
        })
    }

    changeModel(): void {
        this.lstCtietBcao.forEach(item => {
            item.slTong = Operator.sum([item.slTren, item.slDuoi]);
            item.gtTrenGtBh = Operator.div(Operator.mul(item.gtTrenGt, item.gtTrenTyLeBh), 100);
            item.gtDuoiGtBh = Operator.div(Operator.mul(item.gtDuoiGt, item.gtDuoiTyLeBh), 100);
            item.tong = Operator.sum([item.gtTrenGtBh, item.gtDuoiGtBh]);
        })
        this.sum('0.2.1.1');
        this.sum('0.2.2.1.1');
        this.sum('0.2.2.2.1');

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
                danhMuc: data.danhMuc,
                tenDanhMuc: data.tenDanhMuc,
                dviTinh: data.dviTinh,
                lstDviCapDuoi: data.lstDviCapDuoi,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].gtTrenGt = Operator.sum([this.lstCtietBcao[index].gtTrenGt, item.gtTrenGt]);
                    this.lstCtietBcao[index].gtTrenGtBh = Operator.sum([this.lstCtietBcao[index].gtTrenGtBh, item.gtTrenGtBh]);
                    this.lstCtietBcao[index].gtDuoiGt = Operator.sum([this.lstCtietBcao[index].gtDuoiGt, item.gtDuoiGt]);
                    this.lstCtietBcao[index].gtDuoiGtBh = Operator.sum([this.lstCtietBcao[index].gtDuoiGtBh, item.gtDuoiGtBh]);
                    this.lstCtietBcao[index].tong = Operator.sum([this.lstCtietBcao[index].tong, item.tong]);
                }
            })
            stt = Table.preIndex(stt);
        }
    }

    getTotal() {
        this.total = new ItemData();
        this.total.lstDviCapDuoi = [];
        this.childUnit.forEach(item => {
            this.total.lstDviCapDuoi.push({
                ...new UnitItem(),
                maDvi: item.maDvi,
                tenDvi: item.tenDvi,
            })
        })
        this.lstCtietBcao.forEach(item => {
            if (item.stt.split('.')?.length == 2) {
                this.total.gtTrenGt = Operator.sum([this.total.gtTrenGt, item.gtTrenGt]);
                this.total.gtTrenGtBh = Operator.sum([this.total.gtTrenGtBh, item.gtTrenGtBh]);
                this.total.gtDuoiGt = Operator.sum([this.total.gtDuoiGt, item.gtDuoiGt]);
                this.total.gtDuoiGtBh = Operator.sum([this.total.gtDuoiGtBh, item.gtDuoiGtBh]);
                this.total.tong = Operator.sum([this.total.tong, item.tong]);
                for (let i = 0; i < item.lstDviCapDuoi?.length; i++) {
                    this.total.lstDviCapDuoi[i].gtTrenGt = Operator.sum([this.total.lstDviCapDuoi[i].gtTrenGt, item.lstDviCapDuoi[i].gtTrenGt]);
                    this.total.lstDviCapDuoi[i].gtTrenGtBh = Operator.sum([this.total.lstDviCapDuoi[i].gtTrenGtBh, item.lstDviCapDuoi[i].gtTrenGtBh]);
                    this.total.lstDviCapDuoi[i].gtDuoiGt = Operator.sum([this.total.lstDviCapDuoi[i].gtDuoiGt, item.lstDviCapDuoi[i].gtDuoiGt]);
                    this.total.lstDviCapDuoi[i].gtDuoiGtBh = Operator.sum([this.total.lstDviCapDuoi[i].gtDuoiGtBh, item.lstDviCapDuoi[i].gtDuoiGtBh]);
                    this.total.lstDviCapDuoi[i].tong = Operator.sum([this.total.lstDviCapDuoi[i].tong, item.lstDviCapDuoi[i].tong]);
                }
            }
        })
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
            { t: 0, b: 9 + this.lstCtietBcao.length, l: 0, r: 12 + 10 * this.childUnit.length, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
            { t: 5, b: 7, l: 0, r: 0, val: 'STT' },
            { t: 5, b: 7, l: 1, r: 1, val: 'Danh mục hàng DTQG tham gia bảo hiểm' },
            { t: 5, b: 7, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 5, b: 5, l: 3, r: 5, val: 'Số lượng' },
            { t: 6, b: 7, l: 3, r: 3, val: 'Kho từ 5000m3 trở lên' },
            { t: 6, b: 7, l: 4, r: 4, val: 'Kho dưới 5000m3' },
            { t: 6, b: 7, l: 5, r: 5, val: 'Tổng SL' },
            { t: 5, b: 5, l: 6, r: 12, val: 'Giá trị bảo hiểm' },
            { t: 6, b: 6, l: 6, r: 8, val: 'Kho từ ' + this.khoiTich.toString() + ' m3 trở lên' },
            { t: 7, b: 7, l: 6, r: 6, val: 'Giá trị' },
            { t: 7, b: 7, l: 7, r: 7, val: 'Tỷ lệ bảo hiểm' },
            { t: 7, b: 7, l: 8, r: 8, val: 'Giá trị bảo hiểm' },
            { t: 6, b: 6, l: 9, r: 11, val: 'Kho dưới ' + this.khoiTich.toString() + ' m3' },
            { t: 7, b: 7, l: 9, r: 9, val: 'Giá trị' },
            { t: 7, b: 7, l: 10, r: 10, val: 'Tỷ lệ bảo hiểm' },
            { t: 7, b: 7, l: 11, r: 11, val: 'Giá trị bảo hiểm' },
            { t: 6, b: 7, l: 12, r: 12, val: 'Tổng GT' },
            { t: 8, b: 8, l: 0, r: 0, val: 'A' },
            { t: 8, b: 8, l: 1, r: 1, val: 'B' },
            { t: 8, b: 8, l: 2, r: 2, val: 'C' },
            { t: 8, b: 8, l: 3, r: 3, val: '1' },
            { t: 8, b: 8, l: 4, r: 4, val: '2' },
            { t: 8, b: 8, l: 5, r: 5, val: '3' },
            { t: 8, b: 8, l: 6, r: 6, val: '4' },
            { t: 8, b: 8, l: 7, r: 7, val: '5' },
            { t: 8, b: 8, l: 8, r: 8, val: '6=4*5' },
            { t: 8, b: 8, l: 9, r: 9, val: '7' },
            { t: 8, b: 8, l: 10, r: 10, val: '8' },
            { t: 8, b: 8, l: 11, r: 11, val: '9=7*8' },
            { t: 8, b: 8, l: 12, r: 12, val: '10=6+9' },
            { t: 9, b: 9, l: 1, r: 1, val: 'Tổng cộng' },
            { t: 9, b: 9, l: 6, r: 6, val: this.total?.gtTrenGt },
            { t: 9, b: 9, l: 8, r: 8, val: this.total?.gtTrenGtBh },
            { t: 9, b: 9, l: 9, r: 9, val: this.total?.gtDuoiGt },
            { t: 9, b: 9, l: 11, r: 11, val: this.total?.gtDuoiGtBh },
            { t: 9, b: 9, l: 12, r: 12, val: this.total?.tong },
        ]
        if (this.childUnit?.length > 0) {
            header.push({ t: 4, b: 4, l: 3, r: 12, val: "" })
        }
        this.childUnit.forEach((item, index) => {
            const left = 12 + index * 10;
            header.push({ t: 4, b: 4, l: left + 1, r: left + 10, val: item.tenDvi })
            header.push({ t: 5, b: 5, l: left + 1, r: left + 3, val: 'Số lượng' })
            header.push({ t: 6, b: 7, l: left + 1, r: left + 1, val: 'Kho từ 5000m3 trở lên' })
            header.push({ t: 6, b: 7, l: left + 2, r: left + 2, val: 'Kho dưới 5000m3' })
            header.push({ t: 6, b: 7, l: left + 3, r: left + 3, val: 'Tổng SL' })
            header.push({ t: 5, b: 5, l: left + 4, r: left + 10, val: 'Giá trị bảo hiểm (VNĐ)' })
            header.push({ t: 6, b: 6, l: left + 4, r: left + 6, val: 'Kho từ ' + this.khoiTich.toString() + ' m3 trở lên' })
            header.push({ t: 7, b: 7, l: left + 4, r: left + 4, val: 'Giá trị' })
            header.push({ t: 7, b: 7, l: left + 5, r: left + 5, val: 'Tỷ lệ bảo hiểm' })
            header.push({ t: 7, b: 7, l: left + 6, r: left + 6, val: 'Giá trị bảo hiểm' })
            header.push({ t: 6, b: 6, l: left + 7, r: left + 9, val: 'Kho dưới ' + this.khoiTich.toString() + ' m3' })
            header.push({ t: 7, b: 7, l: left + 7, r: left + 7, val: 'Giá trị' })
            header.push({ t: 7, b: 7, l: left + 8, r: left + 8, val: 'Tỷ lệ bảo hiểm' })
            header.push({ t: 7, b: 7, l: left + 9, r: left + 9, val: 'Giá trị bảo hiểm' })
            header.push({ t: 6, b: 7, l: left + 10, r: left + 10, val: 'Tổng GT' })
            header.push({ t: 8, b: 8, l: left + 1, r: left + 1, val: '(1)' })
            header.push({ t: 8, b: 8, l: left + 2, r: left + 2, val: '(2)' })
            header.push({ t: 8, b: 8, l: left + 3, r: left + 3, val: '(3)' })
            header.push({ t: 8, b: 8, l: left + 4, r: left + 4, val: '(4)' })
            header.push({ t: 8, b: 8, l: left + 5, r: left + 5, val: '(5)' })
            header.push({ t: 8, b: 8, l: left + 6, r: left + 6, val: '(6)' })
            header.push({ t: 8, b: 8, l: left + 7, r: left + 7, val: '(7)' })
            header.push({ t: 8, b: 8, l: left + 8, r: left + 8, val: '(8)' })
            header.push({ t: 8, b: 8, l: left + 9, r: left + 9, val: '(9)' })
            header.push({ t: 8, b: 8, l: left + 10, r: left + 10, val: '(10)' })
            const unit = this.total.lstDviCapDuoi.find(e => e.maDvi == item.maDvi);
            header.push({ t: 9, b: 9, l: left + 4, r: left + 4, val: unit?.gtTrenGt });
            header.push({ t: 9, b: 9, l: left + 6, r: left + 6, val: unit?.gtTrenGtBh });
            header.push({ t: 9, b: 9, l: left + 7, r: left + 7, val: unit?.gtDuoiGt });
            header.push({ t: 9, b: 9, l: left + 9, r: left + 9, val: unit?.gtDuoiGtBh });
            header.push({ t: 9, b: 9, l: left + 10, r: left + 10, val: unit?.tong });

        })
        const headerBot = 9;
        this.lstCtietBcao.forEach((item, index) => {
            const row = headerBot + index + 1;
            header.push({ t: row, b: row, l: 0, r: 0, val: this.getChiMuc(item.stt) })
            header.push({ t: row, b: row, l: 1, r: 1, val: Utils.getValue(item.tenDanhMuc) })
            header.push({ t: row, b: row, l: 2, r: 2, val: Utils.getValue(item.dviTinh) })
            header.push({ t: row, b: row, l: 3, r: 3, val: Utils.getValue(item.slTren) })
            header.push({ t: row, b: row, l: 4, r: 4, val: Utils.getValue(item.slDuoi) })
            header.push({ t: row, b: row, l: 5, r: 5, val: Utils.getValue(item.slTong) })
            header.push({ t: row, b: row, l: 6, r: 6, val: Utils.getValue(item.gtTrenGt) })
            header.push({ t: row, b: row, l: 7, r: 7, val: Utils.getValue(item.gtTrenTyLeBh) })
            header.push({ t: row, b: row, l: 8, r: 8, val: Utils.getValue(item.gtTrenGtBh) })
            header.push({ t: row, b: row, l: 9, r: 9, val: Utils.getValue(item.gtDuoiGt) })
            header.push({ t: row, b: row, l: 10, r: 10, val: Utils.getValue(item.gtDuoiTyLeBh) })
            header.push({ t: row, b: row, l: 11, r: 11, val: Utils.getValue(item.gtDuoiGtBh) })
            header.push({ t: row, b: row, l: 12, r: 12, val: Utils.getValue(item.tong) })
            item.lstDviCapDuoi.forEach((e, ind) => {
                const col = 12 + ind * 10;
                header.push({ t: row, b: row, l: col + 1, r: col + 1, val: Utils.getValue(e.slTren) })
                header.push({ t: row, b: row, l: col + 2, r: col + 2, val: Utils.getValue(e.slDuoi) })
                header.push({ t: row, b: row, l: col + 3, r: col + 3, val: Utils.getValue(e.slTong) })
                header.push({ t: row, b: row, l: col + 4, r: col + 4, val: Utils.getValue(e.gtTrenGt) })
                header.push({ t: row, b: row, l: col + 5, r: col + 5, val: Utils.getValue(e.gtTrenTyLeBh) })
                header.push({ t: row, b: row, l: col + 6, r: col + 6, val: Utils.getValue(e.gtTrenGtBh) })
                header.push({ t: row, b: row, l: col + 7, r: col + 7, val: Utils.getValue(e.gtDuoiGt) })
                header.push({ t: row, b: row, l: col + 8, r: col + 8, val: Utils.getValue(e.gtDuoiTyLeBh) })
                header.push({ t: row, b: row, l: col + 9, r: col + 9, val: Utils.getValue(e.gtDuoiGtBh) })
                header.push({ t: row, b: row, l: col + 10, r: col + 10, val: Utils.getValue(e.tong) })
            })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        //Thêm khung viền cho bảng
        for (const cell in worksheet) {
            const firstRow = this.childUnit.length == 0 ? 5 : 4;
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < firstRow) continue;
            worksheet[cell].s = Table.borderStyle;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_bh_tong_hop.xlsx');
    }
}
