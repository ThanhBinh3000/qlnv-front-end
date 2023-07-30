import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    DialogDanhSachVatTuHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DON_VI_TIEN, FileManip, LA_MA, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
import * as XLSX from 'xlsx'

export class ItemData {
    id: any;
    danhMuc: string;
    maDmuc: string;
    tenDanhMuc: string;
    maDviTinh: string;
    namDtDmuc: number;
    namDtSluong: number;
    namDtTtien: number;
    stt: string;
    level: any;
    checked: boolean;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.namDtTtien = Operator.mul(this.namDtDmuc, this.namDtSluong);
    }

    upperBound() {
        return this.namDtTtien > Utils.MONEY_LIMIT;
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return "-";
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
            if (!['level', 'namDtSluong', 'namDtDmuc'].includes(key) && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
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
    selector: 'app-phu-luc-01-nhap',
    templateUrl: './phu-luc-01-nhap.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc01NhapComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;

    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;

    //danh muc
    linhVucChis: any[] = [];
    lstCtietBcaos: ItemData[] = [];
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
                ...new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };


    donViTiens: any[] = DON_VI_TIEN;
    thuyetMinh: string;
    maDviTao: any;
    namBaoCao: number;

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private fileManip: FileManip,
    ) {
    }


    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }


    async initialization() {
        await this.spinner.show();

        console.log("this.dataInfo", this.dataInfo);

        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo?.namBcao;
        this.maDviTao = this.dataInfo?.maDvi;

        if (this.status.general) {
            await this.getDinhMucPL2N();
            this.scrollX = Table.tableWidth(350, 7, 1, 90);
        } else {
            this.scrollX = Table.tableWidth(350, 7, 1, 0);
        }

        // this.lstCtietBcaos.forEach(item => {
        //     if (!item.tenDanhMuc) {
        //         const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc && e.loaiDinhMuc == item.maDmuc);
        //         item.tenDanhMuc = dinhMuc?.tenDinhMuc;
        //         item.namDtDmuc = dinhMuc?.tongDmuc;
        //         item.maDviTinh = dinhMuc?.donViTinh;
        //         item.namDtTtien = Operator.mul(item.namDtDmuc, item.namDtSluong);
        //     } else {
        //         const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc && e.loaiDinhMuc == item.maDmuc);
        //         item.namDtDmuc = dinhMuc?.tongDmuc;
        //         item.maDviTinh = dinhMuc?.donViTinh;
        //         item.namDtTtien = Operator.mul(item.namDtDmuc, item.namDtSluong);
        //     }
        // })

        if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == Status.NEW) {
            this.lstCtietBcaos.forEach(item => {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc && e.loaiDinhMuc == item.maDmuc);
                if (!item.tenDanhMuc) {
                    item.tenDanhMuc = dinhMuc?.tenDinhMuc;
                }
                item.namDtDmuc = dinhMuc?.tongDmuc;
                item.maDviTinh = dinhMuc?.donViTinh;
                item.changeModel();
            })
        }

        if (!this.lstCtietBcaos[0]?.stt) {
            this.setIndex();
        }

        this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos);
        this.tinhTong();
        this.updateEditCache();
        this.getStatusButton();
        await this.spinner.hide();
    };

    async getFormDetail() {
        await this.giaoDuToanChiService.ctietBieuMau(this.dataInfo.id).toPromise().then(
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

    async getDinhMucPL2N() {
        const request = {
            loaiDinhMuc: '01',
            maDvi: this.maDviTao,
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
    };


    setIndex() {
        const lstVtuTemp = this.lstCtietBcaos.filter(e => !e.maDmuc);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcaos.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcaos[index].stt = stt;
            const lstDmTemp = this.lstCtietBcaos.filter(e => e.danhMuc == lstVtuTemp[i].danhMuc && !!e.maDmuc);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcaos.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcaos[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
        lstVtuTemp.forEach(item => {
            this.sum(item.stt + '.1');
        })
    }

    sortByIndex() {
        if (this.lstCtietBcaos?.length > 0 && !this.lstCtietBcaos[0].stt) {
            this.setIndex();
        }
        this.setLevel();
        this.lstCtietBcaos.sort((item1, item2) => {
            if (item1.level > item2.level) {
                return 1;
            }
            if (item1.level < item2.level) {
                return -1;
            }
            if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
                return -1;
            }
            if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
                return 1;
            }
            return 0;
        });
        const lstTemp: ItemData[] = [];
        this.lstCtietBcaos.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcaos = lstTemp;
    }

    setLevel() {
        this.lstCtietBcaos.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    }

    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }

    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        if (n == 0) {
            xau = chiSo[n];
        }
        if (n == 1) {
            xau = "-";
        }
        return xau;
    }

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
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }

        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;
        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }
        this.spinner.show();
        this.giaoDuToanChiService.updateCTietBcao(request).toPromise().then(
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
        await this.giaoDuToanChiService.approveCtietBcao(requestGroupButtons).toPromise().then(async (data) => {
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
    };

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
    };

    // xoa tat ca cac dong duoc check
    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcaos.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcaos.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcaos.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
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

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcaos[index].stt);
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcaos[index]),
            edit: false
        };
        this.tinhTong();
    }

    deleteLine(id: string) {
        const stt = this.lstCtietBcaos.find(e => e.id === id)?.stt;
        this.lstCtietBcaos = Table.deleteRow(id, this.lstCtietBcaos);
        this.sum(stt);
        this.updateEditCache();
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
                if (this.lstCtietBcaos.findIndex(e => e.danhMuc == data.ma) == -1) {
                    //tim so thu tu cho loai vat tu moi
                    let index = 1;
                    this.lstCtietBcaos.forEach(item => {
                        if (item.danhMuc && !item.maDmuc) {
                            index += 1;
                        }
                    })
                    const stt = '0.' + index.toString();
                    //them vat tu moi vao bang
                    this.lstCtietBcaos.push(new ItemData({
                        id: uuid.v4() + 'FE',
                        stt: stt,
                        danhMuc: data.ma,
                        tenDanhMuc: data.ten,
                        level: 0,
                    }))
                    const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
                    for (let i = 1; i <= lstTemp.length; i++) {
                        this.lstCtietBcaos.push(new ItemData({
                            id: uuid.v4() + 'FE',
                            stt: stt + '.' + i.toString(),
                            danhMuc: data.ma,
                            maDmuc: lstTemp[i - 1].loaiDinhMuc,
                            tenDanhMuc: lstTemp[i - 1].tenDinhMuc,
                            maDviTinh: lstTemp[i - 1].donViTinh,
                            level: 1,
                            namDtDmuc: lstTemp[i - 1].tongDmuc,
                        }))
                    }
                    this.updateEditCache();
                }
            }
        });
    }

    // tinh tong tu cap duoi
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
        this.tinhTong();
    }

    tinhTong() {
        this.total.clear();
        this.lstCtietBcaos.forEach(item => {
            if (item.level == "0") {
                this.total.sum(item);
            }
        })

    }

    changeModel(id: string): void {
        this.editCache[id].data.namDtTtien = Operator.mul(this.editCache[id].data.namDtDmuc, this.editCache[id].data.namDtSluong);
    }

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(this.lstCtietBcaos[item].stt) + "." + (this.getTail(this.lstCtietBcaos[item].stt) + heSo).toString();
            const nho = this.lstCtietBcaos[item].stt;
            this.lstCtietBcaos.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    //tìm vị trí cần để thêm mới
    findVt(str: string): number {
        const start: number = this.lstCtietBcaos.findIndex(e => e.stt == str);
        let index: number = start;
        for (let i = start + 1; i < this.lstCtietBcaos.length; i++) {
            if (this.lstCtietBcaos[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
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

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    // action print
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

    // displayValue(num: number): string {
    //     num = exchangeMoney(num, '1', this.maDviTien);
    //     return displayNumber(num);
    // }
    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    handleCancel() {
        this._modalRef.close();
    };

    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.fileManip.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 13, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Danh mục' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 1, l: 3, r: 3, val: 'Thực hiện năm trước' },
            { t: 0, b: 0, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
            { t: 1, b: 1, l: 4, r: 4, val: 'Dự toán' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Ước thực hiện' },
            { t: 0, b: 0, l: 6, r: 8, val: 'Năm dự toán' },
            { t: 1, b: 1, l: 6, r: 6, val: 'Số lượng' },
            { t: 1, b: 1, l: 7, r: 7, val: 'Định mức' },
            { t: 1, b: 1, l: 8, r: 8, val: 'Thành tiền' },
            { t: 0, b: 0, l: 9, r: 10, val: 'Thẩm định' },
            { t: 1, b: 1, l: 9, r: 9, val: 'Số lượng' },
            { t: 1, b: 1, l: 10, r: 10, val: 'Thành tiền' },
            { t: 0, b: 1, l: 11, r: 11, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
            { t: 0, b: 1, l: 12, r: 12, val: 'Ghi chú' },
            { t: 0, b: 1, l: 13, r: 13, val: 'Ý kiến của đơn vị cấp trên' },
        ]
        const fieldOrder = ['stt', 'tenDanhMuc', 'dviTinh', 'thienNamTruoc', 'dtoanNamHtai', 'uocNamHtai', 'sluongNamDtoan',
            'sluongNamDtoan', 'dmucNamDtoan', 'ttienNamDtoan', 'sluongTd', 'ttienTd', 'chenhLech', 'ghiChu', 'ykienDviCtren']

        const filterData = this.lstCtietBcaos.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, {
            skipHeader: true,
            origin: Table.coo(header[0].l, header[0].b + 1)
        })
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
