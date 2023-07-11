import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableFunction, displayNumber, exchangeMoney } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { DialogSelectTaiSanComponent } from '../../../giao-du-toan/dialogSelectTaiSan/dialogSelectTaiSan.component';

export class ItemData {
    id: string;
    checked: boolean;
    stt: string;
    maTaiSan: string;
    tenTaiSan: string;
    dvTinh: string;
    sluongTsDenTd: number;
    sluongTsDaNhan: number;
    sluongTsDaPd: number;
    sluongTsCong: number;
    sluongTsTcDinhMuc: number;
    dToanDnghiSl: number;
    dToanDnghiMucGia: number;
    dToanDnghiThanhTien: number;
    dToanKpNamTruoc: number;
    dToanKpDaGiao: number;
    dToanKpCong: number;
    dToanDieuChinh: number;
    dToanVuDnghi: number;
    thuyetMinh: string;
    chenhLech: number;
    ykienDviCtren: string;
    ghiChu: string;
    level: any;
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
    total: ItemData = new ItemData();

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
        private fileManip: FileManip,
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
        this.getTotal();
        this.tinhTong();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };


    async getFormDetail() {
        await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    Object.assign(this.lstCtietBcao, this.formDetail.lstCtietDchinh);// this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
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


    // async getListTaiSan() {
    //     const data = await this.danhMucService.danhMucChungGetAll('BC_DC_PL2');
    //     if (data) {
    //         data.data.forEach(
    //             item => {
    //                 this.lstTaiSans.push({
    //                     ...item,
    //                     // level: item.ma?.split('.').length - 2,
    //                     donViTinh: "cái"
    //                 })
    //             }
    //         )
    //         console.log("this.lstTaiSans", this.lstTaiSans);

    //     }
    // };

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            this.total.dToanDnghiMucGia = Operator.sum([this.total.dToanDnghiMucGia, item.dToanDnghiMucGia]);
            this.total.dToanDnghiThanhTien = Operator.sum([this.total.dToanDnghiThanhTien, item.dToanDnghiThanhTien]);
            this.total.dToanKpNamTruoc = Operator.sum([this.total.dToanKpNamTruoc, item.dToanKpNamTruoc]);
            this.total.dToanKpDaGiao = Operator.sum([this.total.dToanKpDaGiao, item.dToanKpDaGiao]);
            this.total.dToanKpCong = Operator.sum([this.total.dToanKpCong, item.dToanKpCong]);
            this.total.dToanDieuChinh = Operator.sum([this.total.dToanDieuChinh, item.dToanDieuChinh]);
            this.total.dToanVuDnghi = Operator.sum([this.total.dToanVuDnghi, item.dToanVuDnghi]);
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

        if (this.lstCtietBcao.some(e => e.dToanKpDaGiao > Utils.MONEY_LIMIT)) {
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
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
            })
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dToanVuDnghi = item.dToanDieuChinh;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }

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
                    this.formDetail = data.data;
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
        this.lstCtietBcao = this.tableFunc.deleteRow(id, this.lstCtietBcao);
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
        // debugger
        if (this.editCache[id].data.dToanDnghiSl > (this.editCache[id].data.sluongTsTcDinhMuc - this.editCache[id].data.sluongTsCong)) {
            this.notification.warning(
                MESSAGE.WARNING,
                "Dự toán số lượng đề nghị trang bị không được lớn hơn hiệu của tiêu chuẩn định mức và tổng số lượng tài sản hiện có"
            ).onClose.subscribe(() => {
                this.statusCanhBao = false
            })
        } else {
            this.statusCanhBao = true
        }
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.getTotal();
        this.updateEditCache();
        console.log(this.lstCtietBcao);

    };

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
        this.tinhTong();
    };

    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.dToanDieuChinh < 0) {
                this.tongDieuChinhGiam += Number(item.dToanDieuChinh);
            } else {
                this.tongDieuChinhTang += Number(item.dToanDieuChinh);
            }

            if (item.dToanVuDnghi < 0) {
                this.dToanVuGiam += Number(item.dToanVuDnghi);
            } else {
                this.dToanVuTang += Number(item.dToanVuDnghi);
            }
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.sluongTsCong = Operator.sum([this.editCache[id].data.sluongTsDenTd, this.editCache[id].data.sluongTsDaNhan, this.editCache[id].data.sluongTsDaPd]);
        this.editCache[id].data.dToanDnghiThanhTien = Operator.mul(this.editCache[id].data.dToanDnghiSl, this.editCache[id].data.dToanDnghiMucGia);
        this.editCache[id].data.dToanKpCong = Operator.sum([this.editCache[id].data.dToanKpNamTruoc, this.editCache[id].data.dToanKpDaGiao]);
        this.editCache[id].data.dToanDieuChinh = Operator.sum([this.editCache[id].data.dToanDnghiThanhTien, -this.editCache[id].data.dToanKpCong]);

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

    /*
    addLine(id: number): void {
        const item: ItemData = {
            id: uuid.v4(),
            stt: "0",
            checked: false,
            maTaiSan: "",
            tenTaiSan: "",
            dvTinh: "",
            sluongTsDenTd: 0,
            sluongTsDaNhan: 0,
            sluongTsDaPd: 0,
            sluongTsCong: 0,
            sluongTsTcDinhMuc: 5,
            dToanDnghiSl: 0,
            dToanDnghiMucGia: 0,
            dToanDnghiThanhTien: 0,
            dToanKpNamTruoc: 0,
            dToanKpDaGiao: 0,
            dToanKpCong: 0,
            dToanDieuChinh: 0,
            dToanVuDnghi: 0,
            thuyetMinh: "",
            ghiChu: "",
            chenhLech: 0,
            ykienDviCtren: ""
        };

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    };
    */

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.fileManip.downloadFile(file, doc);
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

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 19, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Tên tài sản (theo danh mục được phê duyệt tại Quyết định số 149/QĐ-TCDT)' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 0, l: 3, r: 7, val: 'Số lượng tài sản, máy móc, thiết bị hiện có' },
            { t: 0, b: 0, l: 8, r: 10, val: 'Dự toán đề nghị trang bị năm ' + (this.namBcao - 1).toString() },
            { t: 0, b: 0, l: 11, r: 13, val: 'Dự toán, kinh phí được sử dụng trong năm' },
            { t: 0, b: 1, l: 14, r: 14, val: 'Dự toán điều chỉnh (+ tăng) (- giảm)' },
            { t: 0, b: 1, l: 15, r: 15, val: 'Dự toán vụ TVQT đề nghị (+ tăng)(- giảm)' },
            { t: 0, b: 1, l: 16, r: 16, val: 'Thuyết minh' },
            { t: 0, b: 1, l: 17, r: 17, val: 'Ghi chú' },
            { t: 1, b: 1, l: 3, r: 3, val: 'Số lượng đến thời điểm báo cáo' },
            { t: 1, b: 1, l: 4, r: 4, val: 'Số lượng đã nhận chưa có QĐ điều chuyển' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Số lượng đã được phê duyệt mua sắm năm ' + (this.namBcao - 1).toString() },
            { t: 1, b: 1, l: 6, r: 6, val: 'Cộng' },
            { t: 1, b: 1, l: 7, r: 7, val: 'Tiêu chuẩn định mức tối đa được phê duyệt' },
            { t: 1, b: 1, l: 8, r: 8, val: 'Số lượng' },
            { t: 1, b: 1, l: 9, r: 9, val: 'Mức giá' },
            { t: 1, b: 1, l: 10, r: 10, val: 'Thành tiền (Tổng nhu cầu năm nay)' },
            { t: 1, b: 1, l: 11, r: 11, val: 'Dự toán năm trước chuyển sang được phép sử dụng cho năm nay' },
            { t: 1, b: 1, l: 12, r: 12, val: 'Dự toán, kinh phí đã giao' },
            { t: 1, b: 1, l: 13, r: 13, val: 'Cộng' },

        ]
        const fieldOrder = [
            'stt',
            'tenTaiSan',
            'dvTinh',
            'sluongTsDenTd',
            'sluongTsDaNhan',
            'sluongTsDaPd',
            'sluongTsCong',
            'sluongTsTcDinhMuc',
            'dToanDnghiSl',
            'dToanDnghiMucGia',
            'dToanDnghiThanhTien',
            'dToanKpNamTruoc',
            'dToanKpDaGiao',
            'dToanKpCong',
            'dToanDieuChinh',
            'dToanVuDnghi',
            'thuyetMinh',
            'ghiChu'
        ]
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = item[field]
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

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        excelName = excelName + '_Phu_luc_II.xlsx'
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
                    this.lstCtietBcao.push({
                        ... new ItemData(),
                        id: uuid.v4() + 'FE',
                        stt: stt,
                        maTaiSan: data.maTaiSan,
                        tenTaiSan: data.tenTaiSan,
                        dvTinh: data.dviTinh,
                        level: 0,
                    })
                    this.updateEditCache();
                }
            }
        });
    }

}
