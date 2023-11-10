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
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { CurrencyMaskInputMode } from 'ngx-currency';

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    bcheGiao2021: number;
    bcheCoMat: number;
    bcheChuaTuyen: number;
    hslPcapTso: number;
    hslPcapHsl: number;
    hslPcapTong: number;
    hslPcapChucVu: number;
    hslPcapTnhiem: number;
    hslPcapTnienVkhung: number;
    hslPcapHsbl: number;
    hslPcapCongVu: number;
    hslPcapTnien: number;
    hslPcapUdai: number;
    hslPcapKvuc: number;
    hslPcapKhac: number;
    tqtlPcapTso: number;
    tqtlPcapTluong: number;
    tqtlPcapTong: number;
    tqtlPcapChucVu: number;
    tqtlPcapTniem: number;
    tqtlPcapTnienVkhung: number;
    tqtlPcapHsbl: number;
    tqtlPcapCongVu: number;
    tqtlPcapTnien: number;
    tqtlPcapUdai: number;
    tqtlPcapKvuc: number;
    tqtlPcapKhac: number;
    tongNcauTluong: number;
    baoGomTluongBche: number;
    baoGomKhoanDgop: number;
    baoGomLuongCbcc: number;
    baoGomLuongTheoCheDo: number;
    dtoanKphiDtoanNtruoc: number;
    dtoanKphiDaGiao: number;
    dtoanKphiCong: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
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
    selector: 'app-phu-luc-9',
    templateUrl: './phu-luc-9.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc9Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    amount1 = amount1;

    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    tongDcGiam: ItemData = new ItemData({});
    tongDcTang: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    linhVucChis: any[] = [];
    lstCtietBcao: ItemData[] = [];
    keys = [
        "bcheGiao2021",
        "bcheCoMat",
        "bcheChuaTuyen",
        "hslPcapTso",
        "hslPcapHsl",
        "hslPcapTong",
        "hslPcapChucVu",
        "hslPcapTnhiem",
        "hslPcapTnienVkhung",
        "hslPcapHsbl",
        "hslPcapCongVu",
        "hslPcapTnien",
        "hslPcapUdai",
        "hslPcapKvuc",
        "hslPcapKhac",
        "tqtlPcapTso",
        "tqtlPcapTluong",
        "tqtlPcapTong",
        "tqtlPcapChucVu",
        "tqtlPcapTniem",
        "tqtlPcapTnienVkhung",
        "tqtlPcapHsbl",
        "tqtlPcapCongVu",
        "tqtlPcapTnien",
        "tqtlPcapUdai",
        "tqtlPcapKvuc",
        "tqtlPcapKhac",
        "tongNcauTluong",
        "baoGomTluongBche",
        "baoGomKhoanDgop",
        "baoGomLuongCbcc",
        "baoGomLuongTheoCheDo",
        "dtoanKphiDtoanNtruoc",
        "dtoanKphiDaGiao",
        "dtoanKphiCong",
        "dtoanDnghiDchinh",
        "dtoanVuTvqtDnghi",
        "chenhLech",
    ]
    lstVatTuFull: any[] = [];
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
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            // const category = await this.danhMucService.danhMucChungGetAll('LTD_PL2');
            // if (category) {
            // 	this.linhVucChis = category.data;
            // }
            this.scrollX = Table.tableWidth(350, 37, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 40, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 40, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 37, 1, 0);
            }
        }

        if (this.lstCtietBcao.length == 0) {
            this.lstCtietBcao.push(new ItemData({
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maDvi: this.dataInfo.maDvi,
                tenDvi: this.dataInfo.tenDvi,
                dtoanDnghiDchinh: 0,
            }))
        }
        else if (!this.lstCtietBcao[0]?.stt) {
            let sttItem = 1
            this.lstCtietBcao.forEach(item => {
                const stt = "0." + sttItem
                item.stt = stt;
                sttItem += sttItem
            })
        }

        this.tinhTong();
        this.getTotal();
        this.getInTotal();
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


    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };


    getTotal() {
        this.total = new ItemData({});
        this.lstCtietBcao.forEach(item => {
            // if (item.level == 0) {
            this.keys.forEach(key => {
                this.total[key] = Operator.sum([this.total[key], item[key]]);
            })
            // }
        })
    };


    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDnghiDchinh])
            if (item.dtoanDnghiDchinh && item.dtoanDnghiDchinh !== null) {
                if (item.dtoanDnghiDchinh < 0) {
                    Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh));
                } else {
                    Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh));
                }
            }

            if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
                if (item.dtoanVuTvqtDnghi < 0) {
                    Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                } else {
                    Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
                }
            }
        })
    };

    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                return null;
            case 3:
                return String.fromCharCode(k + 96);
            case 3:
                return "-";
            default:
                return null;
        }
    }

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
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

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
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

    async tuChoi(mcn: string) {
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

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    changeModel(id: string): void {
        this.editCache[id].data.bcheGiao2021 = Operator.sum([this.editCache[id].data.bcheCoMat, this.editCache[id].data.bcheChuaTuyen]);
        this.editCache[id].data.hslPcapTong = Operator.sum([
            this.editCache[id].data.hslPcapChucVu,
            this.editCache[id].data.hslPcapTnhiem,
            this.editCache[id].data.hslPcapTnienVkhung,
            this.editCache[id].data.hslPcapHsbl,
            this.editCache[id].data.hslPcapCongVu,
            this.editCache[id].data.hslPcapTnien,
            this.editCache[id].data.hslPcapUdai,
            this.editCache[id].data.hslPcapKvuc,
            this.editCache[id].data.hslPcapKhac
        ]);
        this.editCache[id].data.hslPcapTso = Operator.sum([this.editCache[id].data.hslPcapHsl, this.editCache[id].data.hslPcapTong]);
        this.editCache[id].data.tqtlPcapTong = Operator.sum([
            this.editCache[id].data.tqtlPcapChucVu,
            this.editCache[id].data.tqtlPcapTniem,
            this.editCache[id].data.tqtlPcapTnienVkhung,
            this.editCache[id].data.tqtlPcapHsbl,
            this.editCache[id].data.tqtlPcapCongVu,
            this.editCache[id].data.tqtlPcapTnien,
            this.editCache[id].data.tqtlPcapUdai,
            this.editCache[id].data.tqtlPcapKvuc,
            this.editCache[id].data.tqtlPcapKhac
        ])
        this.editCache[id].data.tqtlPcapTso = Operator.sum([this.editCache[id].data.tqtlPcapTong, this.editCache[id].data.tqtlPcapTluong]);
        this.editCache[id].data.tongNcauTluong = Operator.sum([
            this.editCache[id].data.baoGomTluongBche,
            this.editCache[id].data.baoGomKhoanDgop,
            this.editCache[id].data.baoGomLuongCbcc,
            this.editCache[id].data.baoGomLuongTheoCheDo,
        ])
        this.editCache[id].data.dtoanKphiCong = Operator.sum([
            this.editCache[id].data.dtoanKphiDtoanNtruoc,
            this.editCache[id].data.dtoanKphiDaGiao
        ])
        this.editCache[id].data.dtoanDnghiDchinh = Operator.sum([this.editCache[id].data.tongNcauTluong, - this.editCache[id].data.dtoanKphiCong])
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDnghiDchinh])
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.getTotal();
        this.getInTotal();
        this.tinhTong();
        this.updateEditCache();
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

    getInTotal() {
        this.tongDcTang.clear()
        this.tongDcGiam.clear()
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanDnghiDchinh < 0) {
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
                { t: 0, b: 12, l: 0, r: 41, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 12, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 12, l: 1, r: 1, val: 'Tên đơn vị(Biên chế thực tế có mặt)' },
                { t: 4, b: 12, l: 2, r: 2, val: 'Biên chế' + this.namBcao.toString() + 'được giao' },
                { t: 4, b: 12, l: 3, r: 3, val: 'Biên chế có mặt' },
                { t: 4, b: 12, l: 4, r: 4, val: 'Biên chế chưa tuyển' },
                { t: 4, b: 5, l: 5, r: 16, val: 'Hệ số lương và các loại phụ cấp cho biên chế công chức có mặt năm' + (this.namBcao - 1).toString() },
                { t: 4, b: 5, l: 17, r: 28, val: 'Tổng quỹ lương và các loại phụ cấp cho biên chế công chức có mặt năm' + (this.namBcao - 1).toString() + ' (tính đến 31/12/' + (this.namBcao - 1).toString() + '(không tính HĐ 68))' },
                { t: 4, b: 12, l: 29, r: 29, val: 'Các khoản lương khác theo chế độ' },
                { t: 4, b: 12, l: 30, r: 33, val: 'Bao gồm' },
                { t: 4, b: 12, l: 34, r: 36, val: 'Dự toán, kinh phí được sử dụng trong năm' },
                { t: 4, b: 12, l: 37, r: 37, val: 'Dự toán điều chỉnh (+ tăng) (- giảm)' },
                { t: 4, b: 12, l: 38, r: 38, val: 'Dự toán Vụ TVQT đề nghị (+ tăng)(- giảm)' },
                { t: 4, b: 12, l: 39, r: 39, val: 'Ghi chú' },
                { t: 4, b: 12, l: 40, r: 40, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng)(- giảm)' },
                { t: 4, b: 12, l: 41, r: 41, val: 'Ý kiến của đơn vị cấp trên' },

                { t: 6, b: 11, l: 5, r: 5, val: 'Tổng số' },
                { t: 6, b: 7, l: 6, r: 16, val: 'Bao gồm' },
                { t: 6, b: 11, l: 17, r: 17, val: 'Tổng số' },
                { t: 6, b: 7, l: 18, r: 28, val: 'Bao gồm' },

                { t: 6, b: 11, l: 30, r: 30, val: 'Tiền lương biên chế thực tế có mặt' },
                { t: 6, b: 11, l: 31, r: 31, val: 'Các khoản đóng góp theo lương của biên chế thực tế' },
                { t: 6, b: 11, l: 32, r: 32, val: 'Lương CBCC chưa tuyển dụng' },
                { t: 6, b: 11, l: 33, r: 33, val: 'Lương điều hòa chung' },
                { t: 6, b: 11, l: 34, r: 34, val: 'Các khoản lương khác theo chế độ' },
                { t: 6, b: 11, l: 35, r: 35, val: 'Dự toán, kinh phí đã giao trong năm' },
                { t: 6, b: 11, l: 36, r: 36, val: 'Cộng' },


                { t: 6, b: 11, l: 6, r: 6, val: 'Hệ số lương' },
                { t: 6, b: 9, l: 7, r: 16, val: 'Hệ số các loại phụ cấp' },
                { t: 6, b: 11, l: 18, r: 18, val: 'Tiền lương' },
                { t: 6, b: 9, l: 19, r: 28, val: 'Tiền phụ cấp lương' },

                { t: 10, b: 11, l: 7, r: 7, val: 'Tổng' },
                { t: 10, b: 11, l: 8, r: 8, val: 'PC chức vụ' },
                { t: 10, b: 11, l: 9, r: 9, val: 'PC trách nhiệm' },
                { t: 10, b: 11, l: 10, r: 10, val: 'PC thâm niên vượt khung' },
                { t: 10, b: 11, l: 11, r: 11, val: 'HSBL' },
                { t: 10, b: 11, l: 12, r: 12, val: 'Phụ cấp công vụ ' },
                { t: 10, b: 11, l: 13, r: 13, val: 'Phụ cấp thâm niên' },
                { t: 10, b: 11, l: 14, r: 14, val: 'Phụ cấp ưu đãi nghề' },
                { t: 10, b: 11, l: 15, r: 15, val: 'PC khu vực' },
                { t: 10, b: 11, l: 16, r: 16, val: 'PC khác' },
                { t: 10, b: 11, l: 19, r: 19, val: 'Tổng' },
                { t: 10, b: 11, l: 20, r: 20, val: 'PC chức vụ' },
                { t: 10, b: 11, l: 21, r: 21, val: 'PC trách nhiệm' },
                { t: 10, b: 11, l: 22, r: 22, val: 'PC thâm niên vượt khung' },
                { t: 10, b: 11, l: 23, r: 23, val: 'HSBL' },
                { t: 10, b: 11, l: 24, r: 24, val: 'Phụ cấp công vụ ' },
                { t: 10, b: 11, l: 25, r: 25, val: 'Phụ cấp thâm niên' },
                { t: 10, b: 11, l: 26, r: 26, val: 'Phụ cấp ưu đãi nghề' },
                { t: 10, b: 11, l: 27, r: 27, val: 'PC khu vực' },
                { t: 10, b: 11, l: 28, r: 28, val: 'PC khác' },


                { t: 12, b: 12, l: 0, r: 0, val: 'A' },
                { t: 12, b: 12, l: 1, r: 1, val: 'B' },
                { t: 12, b: 12, l: 2, r: 2, val: '1 = 2 + 3' },
                { t: 12, b: 12, l: 3, r: 3, val: '2' },
                { t: 12, b: 12, l: 4, r: 4, val: '3' },
                { t: 12, b: 12, l: 5, r: 5, val: '4 = 5 + 6' },
                { t: 12, b: 12, l: 6, r: 6, val: '5' },
                { t: 12, b: 12, l: 7, r: 7, val: '6 = 7 + ... + 15' },
                { t: 12, b: 12, l: 8, r: 8, val: '7' },
                { t: 12, b: 12, l: 9, r: 9, val: '8' },
                { t: 12, b: 12, l: 10, r: 10, val: '9' },
                { t: 12, b: 12, l: 11, r: 11, val: '10' },
                { t: 12, b: 12, l: 12, r: 12, val: '11' },
                { t: 12, b: 12, l: 13, r: 13, val: '12' },
                { t: 12, b: 12, l: 14, r: 14, val: '13' },
                { t: 12, b: 12, l: 15, r: 15, val: '14' },
                { t: 12, b: 12, l: 16, r: 16, val: '15' },
                { t: 12, b: 12, l: 17, r: 17, val: '16 = 17 + 18' },
                { t: 12, b: 12, l: 18, r: 18, val: '17 ' },
                { t: 12, b: 12, l: 19, r: 19, val: '18 = 19 + ... + 27' },
                { t: 12, b: 12, l: 20, r: 20, val: '19' },
                { t: 12, b: 12, l: 21, r: 21, val: '20' },
                { t: 12, b: 12, l: 22, r: 22, val: '21' },
                { t: 12, b: 12, l: 23, r: 23, val: '22' },
                { t: 12, b: 12, l: 24, r: 24, val: '23' },
                { t: 12, b: 12, l: 25, r: 25, val: '24' },
                { t: 12, b: 12, l: 26, r: 26, val: '25' },
                { t: 12, b: 12, l: 27, r: 27, val: '26' },
                { t: 12, b: 12, l: 28, r: 28, val: '27' },
                { t: 12, b: 12, l: 29, r: 29, val: '28 = 29 + 30 + 31 + 32' },
                { t: 12, b: 12, l: 30, r: 30, val: '29' },
                { t: 12, b: 12, l: 31, r: 31, val: '30' },
                { t: 12, b: 12, l: 32, r: 32, val: '31' },
                { t: 12, b: 12, l: 33, r: 33, val: '32' },
                { t: 12, b: 12, l: 34, r: 34, val: '33' },
                { t: 12, b: 12, l: 35, r: 35, val: '34' },
                { t: 12, b: 12, l: 36, r: 36, val: '35 = 34 + 33' },
                { t: 12, b: 12, l: 37, r: 37, val: '36 = 28 - 35' },
                { t: 12, b: 12, l: 38, r: 38, val: '37' },
                { t: 12, b: 12, l: 39, r: 39, val: '38' },
                { t: 12, b: 12, l: 40, r: 40, val: '39 = 47 - 36' },
                { t: 12, b: 12, l: 41, r: 41, val: '40' },

            ]
            fieldOrder = [
                'stt',
                'tenDvi',
                'bcheGiao2021',
                'bcheCoMat',
                'bcheChuaTuyen',
                'hslPcapTso',
                'hslPcapHsl',
                'hslPcapTong',
                'hslPcapChucVu',
                'hslPcapTnhiem',
                'hslPcapTnienVkhung',
                'hslPcapHsbl',
                'hslPcapCongVu',
                'hslPcapTnien',
                'hslPcapUdai',
                'hslPcapKvuc',
                'hslPcapKhac',
                'tqtlPcapTso',
                'tqtlPcapTluong',
                'tqtlPcapTong',
                'tqtlPcapChucVu',
                'tqtlPcapTniem',
                'tqtlPcapTnienVkhung',
                'tqtlPcapHsbl',
                'tqtlPcapCongVu',
                'tqtlPcapTnien',
                'tqtlPcapUdai',
                'tqtlPcapKvuc',
                'tqtlPcapKhac',
                'tongNcauTluong',
                'baoGomTluongBche',
                'baoGomKhoanDgop',
                'baoGomLuongCbcc',
                'baoGomLuongTheoCheDo',
                'dtoanKphiDtoanNtruoc',
                'dtoanKphiDaGiao',
                'dtoanKphiCong',
                'dtoanDnghiDchinh',
                'dtoanVuTvqtDnghi',
                'ghiChu',
                'chenhLech',
                'ykienDviCtren',
            ]

        } else {
            header = [
                { t: 0, b: 12, l: 0, r: 38, val: null },

                { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
                { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
                { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
                { t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu' + Status.reportStatusName(this.dataInfo.trangThai) },

                { t: 4, b: 12, l: 0, r: 0, val: 'STT' },
                { t: 4, b: 12, l: 1, r: 1, val: 'Tên đơn vị(Biên chế thực tế có mặt)' },
                { t: 4, b: 12, l: 2, r: 2, val: 'Biên chế' + this.namBcao.toString() + 'được giao' },
                { t: 4, b: 12, l: 3, r: 3, val: 'Biên chế có mặt' },
                { t: 4, b: 12, l: 4, r: 4, val: 'Biên chế chưa tuyển' },
                { t: 4, b: 5, l: 5, r: 16, val: 'Hệ số lương và các loại phụ cấp cho biên chế công chức có mặt năm' + (this.namBcao - 1).toString() },
                { t: 4, b: 5, l: 17, r: 28, val: 'Tổng quỹ lương và các loại phụ cấp cho biên chế công chức có mặt năm' + (this.namBcao - 1).toString() + ' (tính đến 31/12/' + (this.namBcao - 1).toString() + '(không tính HĐ 68))' },
                { t: 4, b: 12, l: 29, r: 29, val: 'Các khoản lương khác theo chế độ' },
                { t: 4, b: 12, l: 30, r: 33, val: 'Bao gồm' },
                { t: 4, b: 12, l: 34, r: 36, val: 'Dự toán, kinh phí được sử dụng trong năm' },
                { t: 4, b: 12, l: 37, r: 37, val: 'Dự toán điều chỉnh (+ tăng) (- giảm)' },
                { t: 4, b: 12, l: 38, r: 38, val: 'Ghi chú' },

                { t: 6, b: 11, l: 5, r: 5, val: 'Tổng số' },
                { t: 6, b: 7, l: 6, r: 16, val: 'Bao gồm' },
                { t: 6, b: 11, l: 17, r: 17, val: 'Tổng số' },
                { t: 6, b: 7, l: 18, r: 28, val: 'Bao gồm' },

                { t: 6, b: 11, l: 30, r: 30, val: 'Tiền lương biên chế thực tế có mặt' },
                { t: 6, b: 11, l: 31, r: 31, val: 'Các khoản đóng góp theo lương của biên chế thực tế' },
                { t: 6, b: 11, l: 32, r: 32, val: 'Lương CBCC chưa tuyển dụng' },
                { t: 6, b: 11, l: 33, r: 33, val: 'Lương điều hòa chung' },
                { t: 6, b: 11, l: 34, r: 34, val: 'Các khoản lương khác theo chế độ' },
                { t: 6, b: 11, l: 35, r: 35, val: 'Dự toán, kinh phí đã giao trong năm' },
                { t: 6, b: 11, l: 36, r: 36, val: 'Cộng' },


                { t: 6, b: 11, l: 6, r: 6, val: 'Hệ số lương' },
                { t: 6, b: 9, l: 7, r: 16, val: 'Hệ số các loại phụ cấp' },
                { t: 6, b: 11, l: 18, r: 18, val: 'Tiền lương' },
                { t: 6, b: 9, l: 19, r: 28, val: 'Tiền phụ cấp lương' },

                { t: 10, b: 11, l: 7, r: 7, val: 'Tổng' },
                { t: 10, b: 11, l: 8, r: 8, val: 'PC chức vụ' },
                { t: 10, b: 11, l: 9, r: 9, val: 'PC trách nhiệm' },
                { t: 10, b: 11, l: 10, r: 10, val: 'PC thâm niên vượt khung' },
                { t: 10, b: 11, l: 11, r: 11, val: 'HSBL' },
                { t: 10, b: 11, l: 12, r: 12, val: 'Phụ cấp công vụ ' },
                { t: 10, b: 11, l: 13, r: 13, val: 'Phụ cấp thâm niên' },
                { t: 10, b: 11, l: 14, r: 14, val: 'Phụ cấp ưu đãi nghề' },
                { t: 10, b: 11, l: 15, r: 15, val: 'PC khu vực' },
                { t: 10, b: 11, l: 16, r: 16, val: 'PC khác' },
                { t: 10, b: 11, l: 19, r: 19, val: 'Tổng' },
                { t: 10, b: 11, l: 20, r: 20, val: 'PC chức vụ' },
                { t: 10, b: 11, l: 21, r: 21, val: 'PC trách nhiệm' },
                { t: 10, b: 11, l: 22, r: 22, val: 'PC thâm niên vượt khung' },
                { t: 10, b: 11, l: 23, r: 23, val: 'HSBL' },
                { t: 10, b: 11, l: 24, r: 24, val: 'Phụ cấp công vụ ' },
                { t: 10, b: 11, l: 25, r: 25, val: 'Phụ cấp thâm niên' },
                { t: 10, b: 11, l: 26, r: 26, val: 'Phụ cấp ưu đãi nghề' },
                { t: 10, b: 11, l: 27, r: 27, val: 'PC khu vực' },
                { t: 10, b: 11, l: 28, r: 28, val: 'PC khác' },


                { t: 12, b: 12, l: 0, r: 0, val: 'A' },
                { t: 12, b: 12, l: 1, r: 1, val: 'B' },
                { t: 12, b: 12, l: 2, r: 2, val: '1 = 2 + 3' },
                { t: 12, b: 12, l: 3, r: 3, val: '2' },
                { t: 12, b: 12, l: 4, r: 4, val: '3' },
                { t: 12, b: 12, l: 5, r: 5, val: '4 = 5 + 6' },
                { t: 12, b: 12, l: 6, r: 6, val: '5' },
                { t: 12, b: 12, l: 7, r: 7, val: '6 = 7 + ... + 15' },
                { t: 12, b: 12, l: 8, r: 8, val: '7' },
                { t: 12, b: 12, l: 9, r: 9, val: '8' },
                { t: 12, b: 12, l: 10, r: 10, val: '9' },
                { t: 12, b: 12, l: 11, r: 11, val: '10' },
                { t: 12, b: 12, l: 12, r: 12, val: '11' },
                { t: 12, b: 12, l: 13, r: 13, val: '12' },
                { t: 12, b: 12, l: 14, r: 14, val: '13' },
                { t: 12, b: 12, l: 15, r: 15, val: '14' },
                { t: 12, b: 12, l: 16, r: 16, val: '15' },
                { t: 12, b: 12, l: 17, r: 17, val: '16 = 17 + 18' },
                { t: 12, b: 12, l: 18, r: 18, val: '17 ' },
                { t: 12, b: 12, l: 19, r: 19, val: '18 = 19 + ... + 27' },
                { t: 12, b: 12, l: 20, r: 20, val: '19' },
                { t: 12, b: 12, l: 21, r: 21, val: '20' },
                { t: 12, b: 12, l: 22, r: 22, val: '21' },
                { t: 12, b: 12, l: 23, r: 23, val: '22' },
                { t: 12, b: 12, l: 24, r: 24, val: '23' },
                { t: 12, b: 12, l: 25, r: 25, val: '24' },
                { t: 12, b: 12, l: 26, r: 26, val: '25' },
                { t: 12, b: 12, l: 27, r: 27, val: '26' },
                { t: 12, b: 12, l: 28, r: 28, val: '27' },
                { t: 12, b: 12, l: 29, r: 29, val: '28 = 29 + 30 + 31 + 32' },
                { t: 12, b: 12, l: 30, r: 30, val: '29' },
                { t: 12, b: 12, l: 31, r: 31, val: '30' },
                { t: 12, b: 12, l: 32, r: 32, val: '31' },
                { t: 12, b: 12, l: 33, r: 33, val: '32' },
                { t: 12, b: 12, l: 34, r: 34, val: '33' },
                { t: 12, b: 12, l: 35, r: 35, val: '34' },
                { t: 12, b: 12, l: 36, r: 36, val: '35 = 34 + 33' },
                { t: 12, b: 12, l: 37, r: 37, val: '36 = 28 - 35' },
                { t: 12, b: 12, l: 38, r: 38, val: '37' },

            ]
            fieldOrder = [
                'stt',
                'tenDvi',
                'bcheGiao2021',
                'bcheCoMat',
                'bcheChuaTuyen',
                'hslPcapTso',
                'hslPcapHsl',
                'hslPcapTong',
                'hslPcapChucVu',
                'hslPcapTnhiem',
                'hslPcapTnienVkhung',
                'hslPcapHsbl',
                'hslPcapCongVu',
                'hslPcapTnien',
                'hslPcapUdai',
                'hslPcapKvuc',
                'hslPcapKhac',
                'tqtlPcapTso',
                'tqtlPcapTluong',
                'tqtlPcapTong',
                'tqtlPcapChucVu',
                'tqtlPcapTniem',
                'tqtlPcapTnienVkhung',
                'tqtlPcapHsbl',
                'tqtlPcapCongVu',
                'tqtlPcapTnien',
                'tqtlPcapUdai',
                'tqtlPcapKvuc',
                'tqtlPcapKhac',
                'tongNcauTluong',
                'baoGomTluongBche',
                'baoGomKhoanDgop',
                'baoGomLuongCbcc',
                'baoGomLuongTheoCheDo',
                'dtoanKphiDtoanNtruoc',
                'dtoanKphiDaGiao',
                'dtoanKphiCong',
                'dtoanDnghiDchinh',
                'ghiChu',
            ]
        }


        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                item[field] = item[field] ? item[field] : ""
                row[field] = field == 'stt' ? this.getChiMuc(item.stt) : item[field]
            })
            return row;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        });

        let row: any = {};
        row = {}
        fieldOrder.forEach(field => {
            if (field == 'tenDvi') {
                row[field] = 'Phát sinh điều chỉnh giảm'
            } else {
                if (![
                    'hslPcapTso',
                    'hslPcapHsl',
                    'hslPcapTong',
                    'hslPcapChucVu',
                    'hslPcapTnhiem',
                    'hslPcapTnienVkhung',
                    'hslPcapHsbl',
                    'hslPcapCongVu',
                    'hslPcapTnien',
                    'hslPcapUdai',
                    'hslPcapKvuc',
                    'hslPcapKhac',
                    'tqtlPcapTso',
                    'tqtlPcapTluong',
                    'tqtlPcapTong',
                    'tqtlPcapChucVu',
                    'tqtlPcapTniem',
                    'tqtlPcapTnienVkhung',
                    'tqtlPcapHsbl',
                    'tqtlPcapCongVu',
                    'tqtlPcapTnien',
                    'tqtlPcapUdai',
                    'tqtlPcapKvuc',
                    'tqtlPcapKhac',
                    'tongNcauTluong',
                    'baoGomTluongBche',
                    'baoGomKhoanDgop',
                    'baoGomLuongCbcc',
                    'baoGomLuongTheoCheDo',
                    'dtoanKphiDtoanNtruoc',
                    'dtoanKphiDaGiao',
                    'dtoanKphiCong',
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
            if (field == 'tenDvi') {
                row[field] = 'Phát sinh điều chỉnh tăng'
            } else {
                if (![
                    'hslPcapTso',
                    'hslPcapHsl',
                    'hslPcapTong',
                    'hslPcapChucVu',
                    'hslPcapTnhiem',
                    'hslPcapTnienVkhung',
                    'hslPcapHsbl',
                    'hslPcapCongVu',
                    'hslPcapTnien',
                    'hslPcapUdai',
                    'hslPcapKvuc',
                    'hslPcapKhac',
                    'tqtlPcapTso',
                    'tqtlPcapTluong',
                    'tqtlPcapTong',
                    'tqtlPcapChucVu',
                    'tqtlPcapTniem',
                    'tqtlPcapTnienVkhung',
                    'tqtlPcapHsbl',
                    'tqtlPcapCongVu',
                    'tqtlPcapTnien',
                    'tqtlPcapUdai',
                    'tqtlPcapKvuc',
                    'tqtlPcapKhac',
                    'tongNcauTluong',
                    'baoGomTluongBche',
                    'baoGomKhoanDgop',
                    'baoGomLuongCbcc',
                    'baoGomLuongTheoCheDo',
                    'dtoanKphiDtoanNtruoc',
                    'dtoanKphiDaGiao',
                    'dtoanKphiCong',
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
            row[field] = field == 'tenDvi' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
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
        excelName = excelName + '_BCDC_PL09.xlsx'
        XLSX.writeFile(workbook, excelName);
    }


}

