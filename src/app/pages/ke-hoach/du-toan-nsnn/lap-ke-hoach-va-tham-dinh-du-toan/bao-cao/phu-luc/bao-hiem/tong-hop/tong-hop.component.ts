import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../../lap-ke-hoach-va-tham-dinh-du-toan.class';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import * as XLSX from 'xlsx';

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
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    //danh muc
    danhMucs: any[] = [];
    childUnit: any[] = [];
    lstTyLe: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    scrollX: string;
    BOX_SIZE = 180;
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
        await this.getFormDetail();
        if (this.lstCtietBcao.length == 0) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_BH');
            if (category) {
                this.danhMucs = category.data;
            }
            await this.getTle();
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

        this.scrollX = this.genFunc.setTableWidth(450, 11 + 10 * this.childUnit.length, this.BOX_SIZE, 0);
        //sap xep lai du lieu
        this.lstCtietBcao = this.tableFunc.sortByIndex(this.lstCtietBcao);
        this.sortUnit();

        // //lay du lieu tu cac bieu mau khac
        // if (this.dataInfo?.extraData) {
        //     this.dataInfo.extraData.forEach(item => {
        //         const index = this.lstCtietBcao.findIndex(e => e.danhMuc == item.danhMuc);
        //         if (index != -1) {
        //             this.lstCtietBcao[index].slTren = item.slTren;
        //             this.lstCtietBcao[index].slDuoi = item.slDuoi;
        //             this.lstCtietBcao[index].gtTrenGt = item.gtTrenGt;
        //             this.lstCtietBcao[index].gtDuoiGt = item.gtDuoiGt;
        //             this.sum(this.lstCtietBcao[index].stt);
        //         }
        //     })
        // }

        this.changeModel();
        this.getTotal();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
    }

    async getTle() {
        await this.lapThamDinhService.getDsTle(this.dataInfo?.namBcao).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.lstTyLe = res.data?.lstCtiets;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
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
        if (this.lstCtietBcao.some(e => e.tong > MONEY_LIMIT)) {
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
    getChiMuc(stt: string): string {
        let str = stt.substring(stt.indexOf('.') + 1, stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return this.genFunc.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                if (this.lstCtietBcao.findIndex(e => this.tableFunc.getHead(e.danhMuc) == stt) == -1) {
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
            item.slTong = this.numFunc.sum([item.slTren, item.slDuoi]);
            item.gtTrenGtBh = this.numFunc.div(this.numFunc.mul(item.gtTrenGt, item.gtTrenTyLeBh), 100);
            item.gtDuoiGtBh = this.numFunc.div(this.numFunc.mul(item.gtDuoiGt, item.gtDuoiTyLeBh), 100);
            item.tong = this.numFunc.sum([item.gtTrenGtBh, item.gtDuoiGtBh]);
        })
        this.sum('0.2.1.1');
        this.sum('0.2.2.1.1');
        this.sum('0.2.2.2.1');

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
                danhMuc: data.danhMuc,
                tenDanhMuc: data.tenDanhMuc,
                dviTinh: data.dviTinh,
                lstDviCapDuoi: data.lstDviCapDuoi,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.tableFunc.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].gtTrenGt = this.numFunc.sum([this.lstCtietBcao[index].gtTrenGt, item.gtTrenGt]);
                    this.lstCtietBcao[index].gtTrenGtBh = this.numFunc.sum([this.lstCtietBcao[index].gtTrenGtBh, item.gtTrenGtBh]);
                    this.lstCtietBcao[index].gtDuoiGt = this.numFunc.sum([this.lstCtietBcao[index].gtDuoiGt, item.gtDuoiGt]);
                    this.lstCtietBcao[index].gtDuoiGtBh = this.numFunc.sum([this.lstCtietBcao[index].gtDuoiGtBh, item.gtDuoiGtBh]);
                    this.lstCtietBcao[index].tong = this.numFunc.sum([this.lstCtietBcao[index].tong, item.tong]);
                }
            })
            stt = this.tableFunc.getHead(stt);
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
                this.total.gtTrenGt = this.numFunc.sum([this.total.gtTrenGt, item.gtTrenGt]);
                this.total.gtTrenGtBh = this.numFunc.sum([this.total.gtTrenGtBh, item.gtTrenGtBh]);
                this.total.gtDuoiGt = this.numFunc.sum([this.total.gtDuoiGt, item.gtDuoiGt]);
                this.total.gtDuoiGtBh = this.numFunc.sum([this.total.gtDuoiGtBh, item.gtDuoiGtBh]);
                this.total.tong = this.numFunc.sum([this.total.tong, item.tong]);
                for (let i = 0; i < item.lstDviCapDuoi?.length; i++) {
                    this.total.lstDviCapDuoi[i].gtTrenGt = this.numFunc.sum([this.total.lstDviCapDuoi[i].gtTrenGt, item.lstDviCapDuoi[i].gtTrenGt]);
                    this.total.lstDviCapDuoi[i].gtTrenGtBh = this.numFunc.sum([this.total.lstDviCapDuoi[i].gtTrenGtBh, item.lstDviCapDuoi[i].gtTrenGtBh]);
                    this.total.lstDviCapDuoi[i].gtDuoiGt = this.numFunc.sum([this.total.lstDviCapDuoi[i].gtDuoiGt, item.lstDviCapDuoi[i].gtDuoiGt]);
                    this.total.lstDviCapDuoi[i].gtDuoiGtBh = this.numFunc.sum([this.total.lstDviCapDuoi[i].gtDuoiGtBh, item.lstDviCapDuoi[i].gtDuoiGtBh]);
                    this.total.lstDviCapDuoi[i].tong = this.numFunc.sum([this.total.lstDviCapDuoi[i].tong, item.lstDviCapDuoi[i].tong]);
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
        await this.fileFunc.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 3 + this.lstCtietBcao.length, l: 0, r: 12 + 10 * this.childUnit.length, val: null },
            { t: 1, b: 3, l: 0, r: 0, val: 'STT' },
            { t: 1, b: 3, l: 1, r: 1, val: 'Danh mục hàng DTQG tham gia bảo hiểm' },
            { t: 1, b: 3, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 1, b: 1, l: 3, r: 5, val: 'Tổng số lượng hàng trong kho của các đơn vị cấp dưới' },
            { t: 2, b: 3, l: 3, r: 3, val: 'Kho từ 5000m3 trở lên' },
            { t: 2, b: 3, l: 4, r: 4, val: 'Kho dưới 5000m3' },
            { t: 2, b: 3, l: 5, r: 5, val: 'Tổng SL' },
            { t: 1, b: 1, l: 6, r: 12, val: 'Tổng giá trị hàng trong kho của các đơn vị cấp dưới' },
            { t: 2, b: 2, l: 6, r: 8, val: 'Kho từ 5000 m3 trở lên' },
            { t: 3, b: 3, l: 6, r: 6, val: 'Giá trị' },
            { t: 3, b: 3, l: 7, r: 7, val: 'Tỷ lệ bảo hiểm' },
            { t: 3, b: 3, l: 8, r: 8, val: 'Giá trị bảo hiểm' },
            { t: 2, b: 2, l: 9, r: 11, val: 'Kho dưới 5000 m3' },
            { t: 3, b: 3, l: 9, r: 9, val: 'Giá trị' },
            { t: 3, b: 3, l: 10, r: 10, val: 'Tỷ lệ bảo hiểm' },
            { t: 3, b: 3, l: 11, r: 11, val: 'Giá trị bảo hiểm' },
            { t: 2, b: 3, l: 12, r: 12, val: 'Tổng GT' },
        ]
        this.childUnit.forEach((item, index) => {
            const left = 12 + index * 10;
            header.push({ t: 0, b: 0, l: left + 1, r: left + 10, val: item.tenDvi })
            header.push({ t: 1, b: 1, l: left + 1, r: left + 3, val: 'Tổng số lượng hàng trong kho của các đơn vị cấp dưới' })
            header.push({ t: 2, b: 3, l: left + 1, r: left + 1, val: 'Kho từ 5000m3 trở lên' })
            header.push({ t: 2, b: 3, l: left + 2, r: left + 2, val: 'Kho dưới 5000m3' })
            header.push({ t: 2, b: 3, l: left + 3, r: left + 3, val: 'Tổng SL' })
            header.push({ t: 1, b: 1, l: left + 4, r: left + 10, val: 'Tổng giá trị hàng trong kho của các đơn vị cấp dưới' })
            header.push({ t: 2, b: 2, l: left + 4, r: left + 6, val: 'Kho từ 5000 m3 trở lên' })
            header.push({ t: 3, b: 3, l: left + 4, r: left + 4, val: 'Giá trị' })
            header.push({ t: 3, b: 3, l: left + 5, r: left + 5, val: 'Tỷ lệ bảo hiểm' })
            header.push({ t: 3, b: 3, l: left + 6, r: left + 6, val: 'Giá trị bảo hiểm' })
            header.push({ t: 2, b: 2, l: left + 7, r: left + 9, val: 'Kho dưới 5000 m3' })
            header.push({ t: 3, b: 3, l: left + 7, r: left + 7, val: 'Giá trị' })
            header.push({ t: 3, b: 3, l: left + 8, r: left + 8, val: 'Tỷ lệ bảo hiểm' })
            header.push({ t: 3, b: 3, l: left + 9, r: left + 9, val: 'Giá trị bảo hiểm' })
            header.push({ t: 2, b: 3, l: left + 10, r: left + 10, val: 'Tổng GT' })
        })
        const headerBot = 3;
        this.lstCtietBcao.forEach((item, index) => {
            const row = headerBot + index + 1;
            header.push({ t: row, b: row, l: 0, r: 0, val: this.getChiMuc(item.stt) })
            header.push({ t: row, b: row, l: 1, r: 1, val: item.tenDanhMuc })
            header.push({ t: row, b: row, l: 2, r: 2, val: item.dviTinh })
            header.push({ t: row, b: row, l: 3, r: 3, val: item.slTren?.toString() })
            header.push({ t: row, b: row, l: 4, r: 4, val: item.slDuoi?.toString() })
            header.push({ t: row, b: row, l: 5, r: 5, val: item.slTong?.toString() })
            header.push({ t: row, b: row, l: 6, r: 6, val: item.gtTrenGt?.toString() })
            header.push({ t: row, b: row, l: 7, r: 7, val: item.gtTrenTyLeBh?.toString() })
            header.push({ t: row, b: row, l: 8, r: 8, val: item.gtTrenGtBh?.toString() })
            header.push({ t: row, b: row, l: 9, r: 9, val: item.gtDuoiGt?.toString() })
            header.push({ t: row, b: row, l: 10, r: 10, val: item.gtDuoiTyLeBh?.toString() })
            header.push({ t: row, b: row, l: 11, r: 11, val: item.gtDuoiGtBh?.toString() })
            header.push({ t: row, b: row, l: 12, r: 12, val: item.tong?.toString() })
            item.lstDviCapDuoi.forEach((e, ind) => {
                const col = 12 + ind * 10;
                header.push({ t: row, b: row, l: col + 1, r: col + 1, val: e.slTren?.toString() })
                header.push({ t: row, b: row, l: col + 2, r: col + 2, val: e.slDuoi?.toString() })
                header.push({ t: row, b: row, l: col + 3, r: col + 3, val: e.slTong?.toString() })
                header.push({ t: row, b: row, l: col + 4, r: col + 4, val: e.gtTrenGt?.toString() })
                header.push({ t: row, b: row, l: col + 5, r: col + 5, val: e.gtTrenTyLeBh?.toString() })
                header.push({ t: row, b: row, l: col + 6, r: col + 6, val: e.gtTrenGtBh?.toString() })
                header.push({ t: row, b: row, l: col + 7, r: col + 7, val: e.gtDuoiGt?.toString() })
                header.push({ t: row, b: row, l: col + 8, r: col + 8, val: e.gtDuoiTyLeBh?.toString() })
                header.push({ t: row, b: row, l: col + 9, r: col + 9, val: e.gtDuoiGtBh?.toString() })
                header.push({ t: row, b: row, l: col + 10, r: col + 10, val: e.tong?.toString() })
            })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = this.genFunc.initExcel(header);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, 'bao_hiem_tong_hop.xlsx');
    }
}
