import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx-js-style';
import { DialogSelectTaiSanComponent } from '../../../giao-du-toan/dialogSelectTaiSan/dialogSelectTaiSan.component';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { CurrencyMaskInputMode } from 'ngx-currency';

export class ItemData {
    id: string;
    checked: boolean;
    stt: string;
    maTaiSan: string;
    tenTaiSan: string;
    dvTinh: string;
    sluongTsDenTd: number;
    sluongTsDaNhan: number;
    // sluongTsDaPd: number;
    sluongTsCong: number;
    sluongTsTcDinhMuc: number;
    dtoanDnghiSl: number;
    dtoanDnghiSlThien: number;
    dtoanDnghiSlTong: number;
    dtoanDnghiMucGia: number;
    dtoanDnghiThanhTien: number;
    dtoanKpNamTruoc: number;
    dtoanKpDaGiao: number;
    dtoanKpCong: number;
    dtoanKpDieuChinh: number;
    dtoanVuDnghi: number;
    thuyetMinh: string;
    chenhLech: number;
    ykienDviCtren: string;
    ghiChu: string;
    level: any;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    upperBound() {
        return (
            this.dtoanDnghiMucGia > Utils.MONEY_LIMIT ||
            this.dtoanDnghiThanhTien > Utils.MONEY_LIMIT ||
            this.dtoanKpNamTruoc > Utils.MONEY_LIMIT ||
            this.dtoanKpDaGiao > Utils.MONEY_LIMIT ||
            this.dtoanKpCong > Utils.MONEY_LIMIT ||
            this.dtoanKpDieuChinh > Utils.MONEY_LIMIT ||
            this.dtoanVuDnghi > Utils.MONEY_LIMIT
        );
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
                return String.fromCharCode(k + 96);
            case 3:
                return "";
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

export const amount1 = {
    allowZero: true,
    allowNegative: true,
    precision: 4,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    inputMode: CurrencyMaskInputMode.NATURAL,
}


@Component({
    selector: 'app-phu-luc-2',
    templateUrl: './phu-luc-2.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc2Component implements OnInit {
    @Input() dataInfo;
    Utils = Utils;
    Op = new Operator('1');

    //trang thai cac nut
    isDataAvailable = false;
    editMoneyUnit = false;
    status: BtnStatus = new BtnStatus();

    // Thong tin chi tiet cua bieu mau
    namBcao: number;
    maDviTien: string = '1';
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    tongDcTang: ItemData = new ItemData({});
    tongDcGiam: ItemData = new ItemData({});
    // danh muc
    lstCtietBcao: ItemData[] = [];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    scrollX: string;
    lstTaiSans: any[] = [];

    // Thong bao 
    messageChenhLech;
    statusCanhBao = true;

    // bien file
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];
    amount1 = amount1;
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
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        // private danhMucService: DanhMucDungChungService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        // private tableFunc: TableFunction,
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
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 20, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 21, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 21, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 20, 1, 0);
            }
        }
        // await this.getListTaiSan();

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0]?.stt) {
                let sttItem = 1
                this.lstCtietBcao.forEach(item => {
                    const stt = "0." + sttItem
                    item.stt = stt;
                    sttItem++
                })
            } else {
                this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
            }
        }

        // else if (!this.lstCtietBcao[0]?.stt) {

        // }


        this.tinhTong();
        this.getTotal();
        this.getInTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    setIndex() {
        const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maTaiSan);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcao[index].stt = stt;
            const lstDmTemp = this.lstCtietBcao.filter(e => e.maTaiSan == lstVtuTemp[i].maTaiSan && !!e.maTaiSan);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
    }


    async getFormDetail() {
        await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietDchinh.forEach(item => {
                        this.lstCtietBcao.push(new ItemData(item))
                    })
                    this.listFile = [];
                    this.formDetail.listIdDeleteFiles = [];
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

    getTotal() {
        this.total = new ItemData({});
        this.lstCtietBcao.forEach(item => {
            // this.total.dtoanDnghiMucGia = Operator.sum([this.total.dtoanDnghiMucGia, item.dtoanDnghiMucGia]);
            this.total.dtoanDnghiThanhTien = Operator.sum([this.total.dtoanDnghiThanhTien, item.dtoanDnghiThanhTien]);
            this.total.dtoanKpNamTruoc = Operator.sum([this.total.dtoanKpNamTruoc, item.dtoanKpNamTruoc]);
            this.total.dtoanKpDaGiao = Operator.sum([this.total.dtoanKpDaGiao, item.dtoanKpDaGiao]);
            this.total.dtoanKpCong = Operator.sum([this.total.dtoanKpCong, item.dtoanKpCong]);
            this.total.dtoanKpDieuChinh = Operator.sum([this.total.dtoanKpDieuChinh, item.dtoanKpDieuChinh]);
            this.total.dtoanVuDnghi = Operator.sum([this.total.dtoanVuDnghi, item.dtoanVuDnghi]);
            this.total.chenhLech = Operator.sum([this.total.chenhLech, item.chenhLech]);
            item.chenhLech = Operator.sum([item.dtoanVuDnghi, - item.dtoanKpDieuChinh])
        })
    };

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.dtoanKpDaGiao > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuDnghi = item.dtoanKpDieuChinh;
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

        request.lstCtietDchinh = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.dieuChinhDuToanService.updatePLDieuChinh(request).toPromise().then(
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

    handleCancel() {
        this._modalRef.close();
    };

    deleteLine(id: string) {
        this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
        this.getInTotal()
        this.updateEditCache();
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        if (this.editCache[id].data.dtoanDnghiSl > (this.editCache[id].data.sluongTsTcDinhMuc - this.editCache[id].data.sluongTsCong)) {
            this.notification.warning(
                MESSAGE.WARNING,
                "Số lượng dự toán đề nghị không vượt quá hiệu của số lượng tiêu chuẩn định mức tối đa và tổng tài sản hiện có (cột 6 nhỏ hơn hoặc bằng cột 4 trừ cột 3)"
            ).onClose.subscribe(() => {
                this.statusCanhBao = false
            })
            return
        } else {
            Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
            this.statusCanhBao = true
        }
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.getTotal();
        this.getInTotal();
        this.updateEditCache();

    };

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
            edit: false
        };
        this.tinhTong();
    };

    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dtoanVuTang: number;
    dtoanVuGiam: number;
    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dtoanVuTang = 0;
        this.dtoanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.dtoanKpDieuChinh && item.dtoanKpDieuChinh !== null) {
                if (item.dtoanKpDieuChinh < 0) {
                    Number(this.tongDieuChinhGiam += Number(item?.dtoanKpDieuChinh));
                } else {
                    Number(this.tongDieuChinhTang += Number(item?.dtoanKpDieuChinh));
                }
            }

            if (item.dtoanVuDnghi && item.dtoanVuDnghi !== null) {
                if (item.dtoanVuDnghi < 0) {
                    Number(this.dtoanVuGiam += Number(item?.dtoanVuDnghi));
                } else {
                    Number(this.dtoanVuTang += Number(item?.dtoanVuDnghi));
                }
            }
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.sluongTsCong = Operator.sum([this.editCache[id].data.sluongTsDenTd, this.editCache[id].data.sluongTsDaNhan]);
        this.editCache[id].data.dtoanDnghiSlTong = Operator.sum([this.editCache[id].data.dtoanDnghiSl, this.editCache[id].data.dtoanDnghiSlThien]);
        this.editCache[id].data.dtoanDnghiThanhTien = Operator.mul(this.editCache[id].data.dtoanDnghiSlTong, this.editCache[id].data.dtoanDnghiMucGia);

        this.editCache[id].data.dtoanKpCong = Operator.sum([this.editCache[id].data.dtoanKpNamTruoc, this.editCache[id].data.dtoanKpDaGiao]);
        this.editCache[id].data.dtoanKpDieuChinh = Operator.sum([this.editCache[id].data.dtoanDnghiThanhTien, - this.editCache[id].data.dtoanKpCong]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuDnghi, - this.editCache[id].data.dtoanKpDieuChinh]);
    };

    deleteAllChecked() {
        const lstId: any[] = [];
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
    };

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
    };

    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return "-";
        }
    }

    getInTotal() {
        this.tongDcTang.clear()
        this.tongDcGiam.clear()
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanVuDnghi < 0) {
                    this.tongDcGiam.sum(item);
                }
                else {
                    this.tongDcTang.sum(item);
                }
            }
        })
    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        let header = [];
        let fieldOrder = [];

        if (this.status.viewAppVal) {
            header = [
                { t: 0, b: 6, l: 0, r: 19, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu: ' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Tên tài sản (theo danh mục được phê duyệt tại Quyết định số 149/QĐ-TCDT)' },
                { t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
                { t: 4, b: 4, l: 3, r: 6, val: 'Số lượng tài sản, máy móc, thiết bị hiện có' },
                { t: 4, b: 4, l: 7, r: 11, val: 'Dự toán đề nghị trang bị năm ' + (this.namBcao).toString() },
                { t: 4, b: 4, l: 12, r: 14, val: 'Dự toán, kinh phí được sử dụng trong năm' },

                { t: 4, b: 5, l: 15, r: 15, val: 'Dự toán điều chỉnh (+ tăng) (- giảm)' },
                { t: 4, b: 5, l: 16, r: 16, val: 'Dự toán vụ TVQT đề nghị (+ tăng)(- giảm)' },
                { t: 4, b: 5, l: 17, r: 17, val: 'Thuyết minh' },
                { t: 4, b: 5, l: 18, r: 18, val: 'Ghi chú' },
                { t: 4, b: 5, l: 19, r: 19, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng) (- giảm)' },
                { t: 4, b: 5, l: 20, r: 20, val: 'Ý kiến của đơn vị cấp trên' },

                { t: 5, b: 5, l: 3, r: 3, val: 'Số lượng đã có trong kho đến thời điểm hiện tại' },
                { t: 5, b: 5, l: 4, r: 4, val: 'Số lượng đã nhận chưa có QĐ điều chuyển' },
                // { t: 5, b: 5, l: 5, r: 5, val: 'Số lượng đã được phê duyệt mua sắm năm ' + (this.namBcao).toString() },
                { t: 5, b: 5, l: 5, r: 5, val: 'Cộng' },
                { t: 5, b: 5, l: 6, r: 6, val: 'Tiêu chuẩn định mức tối đa được phê duyệt' },

                { t: 5, b: 5, l: 7, r: 7, val: 'Số lượng (thực hiện đến thời điểm hiện tại)' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Số lượng ước thực hiện đến cuối năm' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Tổng' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Mức giá' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Thành tiền (Tổng nhu cầu năm nay)' },

                { t: 5, b: 5, l: 12, r: 12, val: 'Dự toán năm trước chuyển sang được phép sử dụng cho năm nay' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Dự toán, kinh phí đã giao' },
                { t: 5, b: 5, l: 14, r: 14, val: 'Cộng' },

                { t: 6, b: 6, l: 0, r: 0, val: 'A' },
                { t: 6, b: 6, l: 1, r: 1, val: 'B' },
                { t: 6, b: 6, l: 2, r: 2, val: 'C' },
                { t: 6, b: 6, l: 3, r: 3, val: '1' },
                { t: 6, b: 6, l: 4, r: 4, val: '2' },
                { t: 6, b: 6, l: 5, r: 5, val: '3=1+2' },
                { t: 6, b: 6, l: 6, r: 6, val: '4' },
                { t: 6, b: 6, l: 7, r: 7, val: '5' },
                { t: 6, b: 6, l: 8, r: 8, val: '6' },
                { t: 6, b: 6, l: 9, r: 9, val: '7=5+6' },
                { t: 6, b: 6, l: 10, r: 10, val: '8 ' },
                { t: 6, b: 6, l: 11, r: 11, val: '9=7x8' },
                { t: 6, b: 6, l: 12, r: 12, val: '10' },
                { t: 6, b: 6, l: 13, r: 13, val: '11 ' },
                { t: 6, b: 6, l: 14, r: 14, val: '12 = 10+11' },
                { t: 6, b: 6, l: 15, r: 15, val: '13=9-12' },
                { t: 6, b: 6, l: 16, r: 16, val: '14' },
                { t: 6, b: 6, l: 17, r: 17, val: '15' },
                { t: 6, b: 6, l: 18, r: 18, val: '16' },
                { t: 6, b: 6, l: 19, r: 19, val: '17=14-13' },
                { t: 6, b: 6, l: 20, r: 20, val: '18' },
            ]
            fieldOrder = [
                'stt',
                'tenTaiSan',
                'dvTinh',
                'sluongTsDenTd',
                'sluongTsDaNhan',
                // 'sluongTsDaPd',
                'sluongTsCong',
                'sluongTsTcDinhMuc',
                'dtoanDnghiSl',
                'dtoanDnghiSlThien',
                'dtoanDnghiSlTong',
                'dtoanDnghiMucGia',
                'dtoanDnghiThanhTien',
                'dtoanKpNamTruoc',
                'dtoanKpDaGiao',
                'dtoanKpCong',
                'dtoanKpDieuChinh',
                'dtoanVuDnghi',
                'thuyetMinh',
                'ghiChu',
                'chenhLech',
                'ykienDviCtren',
            ]
        } else {
            header = [
                { t: 0, b: 6, l: 0, r: 17, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu: ' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 5, l: 1, r: 1, val: 'Tên tài sản (theo danh mục được phê duyệt tại Quyết định số 149/QĐ-TCDT)' },
                { t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
                { t: 4, b: 4, l: 3, r: 6, val: 'Số lượng tài sản, máy móc, thiết bị hiện có' },
                { t: 4, b: 4, l: 7, r: 11, val: 'Dự toán đề nghị trang bị năm ' + (this.namBcao).toString() },
                { t: 4, b: 4, l: 12, r: 14, val: 'Dự toán, kinh phí được sử dụng trong năm' },

                { t: 4, b: 5, l: 15, r: 15, val: 'Dự toán điều chỉnh (+ tăng) (- giảm)' },
                // { t: 4, b: 5, l: 15, r: 15, val: 'Dự toán vụ TVQT đề nghị (+ tăng)(- giảm)' },
                { t: 4, b: 5, l: 16, r: 16, val: 'Thuyết minh' },
                { t: 4, b: 5, l: 17, r: 17, val: 'Ghi chú' },
                // { t: 4, b: 5, l: 18, r: 18, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng) (- giảm)' },
                // { t: 4, b: 5, l: 19, r: 19, val: 'Ý kiến của đơn vị cấp trên' },

                { t: 5, b: 5, l: 3, r: 3, val: 'Số lượng đã có trong kho đến thời điểm hiện tại' },
                { t: 5, b: 5, l: 4, r: 4, val: 'Số lượng đã nhận chưa có QĐ điều chuyển' },
                // { t: 5, b: 5, l: 5, r: 5, val: 'Số lượng đã được phê duyệt mua sắm năm ' + (this.namBcao).toString() },
                { t: 5, b: 5, l: 5, r: 5, val: 'Cộng' },
                { t: 5, b: 5, l: 6, r: 6, val: 'Tiêu chuẩn định mức tối đa được phê duyệt' },

                { t: 5, b: 5, l: 7, r: 7, val: 'Số lượng (thực hiện đến thời điểm hiện tại)' },
                { t: 5, b: 5, l: 8, r: 8, val: 'Số lượng ước thực hiện đến cuối năm' },
                { t: 5, b: 5, l: 9, r: 9, val: 'Tổng' },
                { t: 5, b: 5, l: 10, r: 10, val: 'Mức giá' },
                { t: 5, b: 5, l: 11, r: 11, val: 'Thành tiền (Tổng nhu cầu năm nay)' },

                { t: 5, b: 5, l: 12, r: 12, val: 'Dự toán năm trước chuyển sang được phép sử dụng cho năm nay' },
                { t: 5, b: 5, l: 13, r: 13, val: 'Dự toán, kinh phí đã giao' },
                { t: 5, b: 5, l: 14, r: 14, val: 'Cộng' },

                { t: 6, b: 6, l: 0, r: 0, val: 'A' },
                { t: 6, b: 6, l: 1, r: 1, val: 'B' },
                { t: 6, b: 6, l: 2, r: 2, val: 'C' },
                { t: 6, b: 6, l: 3, r: 3, val: '1' },
                { t: 6, b: 6, l: 4, r: 4, val: '2' },
                { t: 6, b: 6, l: 5, r: 5, val: '3 = 1 + 2' },
                { t: 6, b: 6, l: 6, r: 6, val: '4 ' },
                { t: 6, b: 6, l: 7, r: 7, val: '5' },
                { t: 6, b: 6, l: 8, r: 8, val: '6' },
                { t: 6, b: 6, l: 9, r: 9, val: '7 = 5 + 6 ' },
                { t: 6, b: 6, l: 10, r: 10, val: '8 ' },
                { t: 6, b: 6, l: 11, r: 11, val: '9 = 7 x 8' },
                { t: 6, b: 6, l: 12, r: 12, val: '10' },
                { t: 6, b: 6, l: 13, r: 13, val: '11' },
                { t: 6, b: 6, l: 14, r: 14, val: '12 = 10 + 11' },
                // { t: 6, b: 6, l: 15, r: 15, val: '13' },
                { t: 6, b: 6, l: 15, r: 15, val: '13 = 9-12' },
                { t: 6, b: 6, l: 16, r: 16, val: '14' },
                { t: 6, b: 6, l: 17, r: 17, val: '15' },
                // { t: 6, b: 6, l: 18, r: 18, val: '16 = 13 - 12' },
                // { t: 6, b: 6, l: 19, r: 19, val: '17' },
            ]
            fieldOrder = [
                'stt',
                'tenTaiSan',
                'dvTinh',
                'sluongTsDenTd',
                'sluongTsDaNhan',
                // 'sluongTsDaPd',
                'sluongTsCong',
                'sluongTsTcDinhMuc',
                'dtoanDnghiSl',
                'dtoanDnghiSlThien',
                'dtoanDnghiSlTong',
                'dtoanDnghiMucGia',
                'dtoanDnghiThanhTien',
                'dtoanKpNamTruoc',
                'dtoanKpDaGiao',
                'dtoanKpCong',
                'dtoanKpDieuChinh',
                // 'dtoanVuDnghi',
                'thuyetMinh',
                'ghiChu',
                // 'chenhLech',
                // 'ykienDviCtren',
            ]
        }



        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                item[field] = item[field] ? item[field] : ""
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        })

        let row: any = {};
        row = {}
        fieldOrder.forEach(field => {
            if (field == 'tenTaiSan') {
                row[field] = 'Phát sinh điều chỉnh giảm'
            } else {
                if (![
                    'sluongTsDenTd',
                    'sluongTsDaNhan',
                    // 'sluongTsDaPd',
                    'sluongTsCong',
                    'sluongTsTcDinhMuc',
                    'dtoanDnghiSl',
                    'dtoanDnghiSlThien',
                    'dtoanDnghiSlTong',
                    'dtoanDnghiMucGia',
                    'dtoanDnghiThanhTien',
                    'dtoanKpNamTruoc',
                    'dtoanKpDaGiao',
                    'dtoanKpCong',
                    // 'dtoanKpDieuChinh',
                    // 'dtoanVuDnghi',
                ].includes(field)) {
                    row[field] = (!this.tongDcGiam[field] && this.tongDcGiam[field] !== 0) ? '' : this.tongDcGiam[field];
                } else {
                    row[field] = '';
                }
            }
        })
        filterData.unshift(row)

        row = {}
        fieldOrder.forEach(field => {
            if (field == 'tenTaiSan') {
                row[field] = 'Phát sinh điều chỉnh tăng'
            } else {
                if (![
                    'sluongTsDenTd',
                    'sluongTsDaNhan',
                    // 'sluongTsDaPd',
                    'sluongTsCong',
                    'sluongTsTcDinhMuc',
                    'dtoanDnghiSl',
                    'dtoanDnghiSlThien',
                    'dtoanDnghiSlTong',
                    'dtoanDnghiMucGia',
                    'dtoanDnghiThanhTien',
                    'dtoanKpNamTruoc',
                    'dtoanKpDaGiao',
                    'dtoanKpCong',
                    // 'dtoanKpDieuChinh',
                    // 'dtoanVuDnghi',
                ].includes(field)) {
                    row[field] = (!this.tongDcTang[field] && this.tongDcTang[field] !== 0) ? '' : this.tongDcTang[field];
                } else {
                    row[field] = '';
                }
            }
        })
        filterData.unshift(row)

        row = {}
        fieldOrder.forEach(field => {
            row[field] = field == 'tenTaiSan' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
        })
        filterData.unshift(row)

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        excelName = excelName + '_BCDC_PL02.xlsx'
        XLSX.writeFile(workbook, excelName);
    }

    selectGoods() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogSelectTaiSanComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (data) => {
            if (data) {
                if (this.lstCtietBcao.findIndex(e => e.maTaiSan == data.ma) == -1) {
                    //tim so thu tu cho loai vat tu moi
                    let index = 1;
                    this.lstCtietBcao.forEach(item => {
                        if (item.maTaiSan) {
                            index += 1;
                        }
                    })
                    const stt = '0.' + index.toString();
                    //them vat tu moi vao bang
                    this.lstCtietBcao.push(new ItemData({
                        id: uuid.v4() + 'FE',
                        stt: stt,
                        maTaiSan: stt,
                        tenTaiSan: data.tenTaiSan,
                        dvTinh: data.dviTinh,
                        level: 0,
                    }))
                    this.updateEditCache();
                }
            }
        });
    }

}
