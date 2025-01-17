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
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form, Vp } from '../../bao-cao-thuc-hien-von-phi.constant';

export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maVtu: string;
    tenVtu: string;
    maDviTinh: string;
    soLuongKhoach: number;
    soLuongTte: number;
    dgGiaKhoach: number;
    dgGiaBanTthieu: number;
    dgGiaBanTte: number;
    ttGiaHtoan: number;
    ttGiaBanTte: number;
    ttClechGiaTteVaGiaHtoan: number;
    ghiChu: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        if (this.level == 3) {
            this.ttGiaHtoan = Operator.mul(this.soLuongTte, this.dgGiaKhoach);
            this.ttGiaBanTte = Operator.mul(this.soLuongTte, this.dgGiaBanTte);
            this.ttClechGiaTteVaGiaHtoan = Operator.sum([this.ttGiaBanTte, -this.ttGiaHtoan]);
        }
    }

    sum(data: ItemData) {
        // this.soLuongKhoach = Operator.sum([this.soLuongKhoach, data.soLuongKhoach]);
        // this.soLuongTte = Operator.sum([this.soLuongTte, data.soLuongTte]);
        if (this.level == 2) {
            // this.soLuongKhoach = Operator.sum([this.soLuongKhoach, data.soLuongKhoach]);
            this.soLuongTte = Operator.sum([this.soLuongTte, data.soLuongTte]);
        }
        this.ttGiaHtoan = Operator.sum([this.ttGiaHtoan, data.ttGiaHtoan]);
        this.ttGiaBanTte = Operator.sum([this.ttGiaBanTte, data.ttGiaBanTte]);
        this.ttClechGiaTteVaGiaHtoan = Operator.sum([this.ttGiaBanTte, -this.ttGiaHtoan]);
    }

    clearKeHoach() {
        this.soLuongKhoach = null;
    }

    clearThucHien() {
        this.soLuongTte = null;
        this.ttGiaHtoan = null;
        this.ttGiaBanTte = null;
    }

    clear() {
        // this.soLuongKhoach = null;
        // this.soLuongTte = null;
        // this.ttGiaHtoan = null;
        // this.ttGiaBanTte = null;
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'level') {
                this[key] = null;
            }
        })
    }

    upperBound() {
        return this.ttGiaHtoan > Utils.MONEY_LIMIT || this.ttGiaBanTte > Utils.MONEY_LIMIT;
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
            case 2:
                return '-';
            default:
                return "";
        }
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
    selector: 'app-bao-cao-03',
    templateUrl: './bao-cao-03.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao03Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    scrollX: string;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    luyKes: ItemData[];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    //trang thai
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;

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
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
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
        if (this.status.save) {
            this.scrollX = Table.tableWidth(350, 9, 1, 180);
        } else {
            this.scrollX = Table.tableWidth(350, 9, 1, 0);
        }

        if (this.lstCtietBcao?.length == 0) {
            if (!this.dataInfo.dotBcao) {
                this.dataInfo.luyKes.lstCtietBcaos.forEach(item => {
                    this.lstCtietBcao.push(new ItemData({
                        ...item,
                        id: uuid.v4() + 'FE',
                    }))
                })
            } else {
                Vp.DANH_MUC_03.forEach(item => {
                    this.lstCtietBcao.push(new ItemData({
                        id: uuid.v4() + 'FE',
                        maVtu: item.ma,
                        stt: item.ma,
                        tenVtu: item.ten,
                    }))
                })
            }
        }
        if ((this.dataInfo.isSynth || !this.dataInfo.dotBcao) && this.formDetail.trangThai == Status.NEW) {
            this.setIndex();
        }
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getFormDetail() {
        await this.baoCaoThucHienVonPhiService.ctietBieuMau(this.dataInfo.id).toPromise().then(
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

    async save(trangThai: string) {
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

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))
        // request.tuNgay = Utils.fmtDate(request.tuNgay);
        // request.denNgay = Utils.fmtDate(request.denNgay);
        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;
        //call service cap nhat phu luc
        this.spinner.show();
        this.baoCaoThucHienVonPhiService.baoCaoCapNhatChiTiet(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.baoCaoThucHienVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                if (mcn == Status.NOT_OK) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    trangThai: mcn,
                    lyDoTuChoi: lyDoTuChoi,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
        this.spinner.hide();
    }

    setIndex() {
        this.lstCtietBcao.forEach(item => {
            if (item.maVtu.split('.').length > 1) {
                item.stt = item.maVtu;
            }
        })
        const temp = Vp.DANH_MUC_03.filter(e => e.loaiVtu);
        temp.forEach(data => {
            this.lstCtietBcao.filter(e => e.stt == Table.preIndex(data.ma) && e.maVtu.startsWith(data.loaiVtu) && e.tenVtu).forEach((item, index) => {
                item.stt = data.ma + '.' + (index + 1).toString();
                this.lstCtietBcao.filter(e => e.stt == Table.preIndex(data.ma) && e.maVtu == item.maVtu && !e.tenVtu).forEach((ele, index) => {
                    ele.stt = item.stt + '.' + (index + 1).toString();
                })
            })
        })

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

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item),
            };
        });
    }

    selectGoods(id: string) {
        const index = this.lstCtietBcao.find(e => e.id == id)?.stt;
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
                if (this.lstCtietBcao.findIndex(e => e.maVtu == data.ma && e.stt.startsWith(index)) == -1) {
                    const item: ItemData = new ItemData({
                        id: uuid.v4() + 'FE',
                        maVtu: data.ma,
                        tenVtu: data.ten,
                        maDviTinh: data.maDviTinh,
                        level: 2,
                    })
                    let id: string;
                    if (item.maVtu.startsWith('01')) {
                        id = this.lstCtietBcao.find(e => Table.preIndex(e.stt) == index && Table.subIndex(e.stt) == 1)?.id;
                    } else if (item.maVtu.startsWith('04')) {
                        id = this.lstCtietBcao.find(e => Table.preIndex(e.stt) == index && Table.subIndex(e.stt) == 2)?.id;
                    } else {
                        id = this.lstCtietBcao.find(e => Table.preIndex(e.stt) == index && Table.subIndex(e.stt) == 3)?.id;
                    }
                    this.lstCtietBcao = Table.addChild(id, item, this.lstCtietBcao);
                    const stt = this.lstCtietBcao.find(e => e.id == item.id).stt;
                    this.sum(stt);
                    this.updateEditCache();
                }
            }
        });
    }

    addLow(id: string) {
        const data = this.lstCtietBcao.find(e => e.id == id);
        const item: ItemData = new ItemData({
            id: uuid.v4() + 'FE',
            maVtu: data.maVtu,
            maDviTinh: data.maDviTinh,
            level: 3,
        })
        this.lstCtietBcao = Table.addChild(id, item, this.lstCtietBcao);
        const stt = this.lstCtietBcao.find(e => e.id == item.id).stt;
        this.sum(stt);
        this.updateEditCache();
    }

    addLine(id: string) {
        const level = this.lstCtietBcao.find(e => e.id == id)?.level;
        if (level == 0) {
            this.selectGoods(id);
        } else {
            this.addLow(id);
        }
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
        const data = this.lstCtietBcao.find(e => e.id == id);
        this.editCache[id] = {
            data: new ItemData(data),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string) {
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
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
            this.lstCtietBcao[index].clearThucHien();
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

    isEdit(level: number) {
        return level == 3 || (level == 2 && this.dataInfo.dotBcao)
    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const header = [
            { t: 0, b: 5, l: 0, r: 11, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Tên vật tư, hàng hóa' },
            { t: 4, b: 5, l: 2, r: 2, val: 'ĐVT' },
            { t: 4, b: 5, l: 3, r: 3, val: 'Số lượng theo kế hoạch' },
            { t: 4, b: 5, l: 4, r: 4, val: 'Số lượng thực tế thực hiện' },
            { t: 4, b: 4, l: 5, r: 7, val: 'Đơn giá' },
            { t: 5, b: 5, l: 5, r: 5, val: 'Giá kế hoạch' },
            { t: 5, b: 5, l: 6, r: 6, val: 'Giá bán tối thiểu Tổng cục QĐ' },
            { t: 5, b: 5, l: 7, r: 7, val: 'Giá bán thực tế' },
            { t: 4, b: 4, l: 8, r: 9, val: 'Thành tiền' },
            { t: 5, b: 5, l: 8, r: 8, val: 'Giá bán hạch toán' },
            { t: 5, b: 5, l: 9, r: 9, val: 'Giá bán thực tế' },
            { t: 4, b: 5, l: 10, r: 10, val: 'Chênh lệch giữa giá bán thực tế và giá bán hạch toán' },
            { t: 4, b: 5, l: 11, r: 11, val: 'Ghi chú' },
        ]
        const fieldOrder = ['stt', 'tenVtu', 'maDviTinh', 'soLuongKhoach', 'soLuongTte', 'dgGiaKhoach', 'dgGiaBanTthieu', 'dgGiaBanTte', 'ttGiaHtoan',
            'ttGiaBanTte', 'ttClechGiaTteVaGiaHtoan', 'ghiChu'];
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : Utils.getValue(item[field]);
            })
            return row;
        })
        // thêm công thức tính cho biểu mẫu
        const calHeader = ['A', 'B', 'C', '1', '2', '3', '4', '5', '6=2*3', '7=2*5', '8=7-6', 'D'];
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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_03BCX.xlsx');
    }
}
