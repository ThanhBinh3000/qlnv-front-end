import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';

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


    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
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
        private fileManip: FileManip,
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
            this.scrollX = Table.tableWidth(350, 10, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 14, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 14, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 10, 1, 0);
            }
        }

        if (this.lstCtietBcao.length == 0) {
            this.lstCtietBcao.push({
                ...new ItemData(),
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maDvi: this.dataInfo.maDvi,
                tenDvi: this.dataInfo.tenDvi,
                dtoanDnghiDchinh: 0,
            })
        }
        else if (!this.lstCtietBcao[0]?.stt) {
            let sttItem = 1
            this.lstCtietBcao.forEach(item => {
                sttItem += sttItem
                const stt = "0." + sttItem
                item.stt = stt;
            })
        }

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
                    this.lstCtietBcao = this.formDetail.lstCtietDchinh;
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
        this.total = new ItemData();
        // this.lstCtietBcao.forEach(item => {
        //     this.total.bcheGiao2021 = Operator.sum([this.total.bcheGiao2021, item.bcheGiao2021]);
        //     this.total.bcheCoMat = Operator.sum([this.total.bcheCoMat, item.bcheCoMat]);
        //     this.total.bcheChuaTuyen = Operator.sum([this.total.bcheChuaTuyen, item.bcheChuaTuyen]);
        //     this.total.hslPcapTso = Operator.sum([this.total.hslPcapTso, item.hslPcapTso]);
        //     this.total.hslPcapHsl = Operator.sum([this.total.hslPcapHsl, item.hslPcapHsl]);
        //     this.total.hslPcapTong = Operator.sum([this.total.hslPcapTong, item.hslPcapTong]);
        //     this.total.hslPcapChucVu = Operator.sum([this.total.hslPcapChucVu, item.hslPcapChucVu]);
        //     this.total.hslPcapTnhiem = Operator.sum([this.total.hslPcapTnhiem, item.hslPcapTnhiem]);
        //     this.total.hslPcapTnienVkhung = Operator.sum([this.total.hslPcapTnienVkhung, item.hslPcapTnienVkhung]);
        //     this.total.hslPcapHsbl = Operator.sum([this.total.hslPcapHsbl, item.hslPcapHsbl]);
        //     this.total.hslPcapCongVu = Operator.sum([this.total.hslPcapCongVu, item.hslPcapCongVu]);
        //     this.total.hslPcapTnien = Operator.sum([this.total.hslPcapTnien, item.hslPcapTnien]);
        //     this.total.hslPcapUdai = Operator.sum([this.total.hslPcapUdai, item.hslPcapUdai]);
        //     this.total.hslPcapKvuc = Operator.sum([this.total.hslPcapKvuc, item.hslPcapKvuc]);
        //     this.total.hslPcapKhac = Operator.sum([this.total.hslPcapKhac, item.hslPcapKhac]);
        //     this.total.tqtlPcapTso = Operator.sum([this.total.tqtlPcapTso, item.tqtlPcapTso]);
        //     this.total.tqtlPcapTluong = Operator.sum([this.total.tqtlPcapTluong, item.tqtlPcapTluong]);
        //     this.total.tqtlPcapTong = Operator.sum([this.total.tqtlPcapTong, item.tqtlPcapTong]);
        //     this.total.tqtlPcapChucVu = Operator.sum([this.total.tqtlPcapChucVu, item.tqtlPcapChucVu]);
        //     this.total.tqtlPcapTniem = Operator.sum([this.total.tqtlPcapTniem, item.tqtlPcapTniem]);
        //     this.total.tqtlPcapTnienVkhung = Operator.sum([this.total.tqtlPcapTnienVkhung, item.tqtlPcapTnienVkhung]);
        //     this.total.tqtlPcapHsbl = Operator.sum([this.total.tqtlPcapHsbl, item.tqtlPcapHsbl]);
        //     this.total.tqtlPcapCongVu = Operator.sum([this.total.tqtlPcapCongVu, item.tqtlPcapCongVu]);
        //     this.total.tqtlPcapTnien = Operator.sum([this.total.tqtlPcapTnien, item.tqtlPcapTnien]);
        //     this.total.tqtlPcapUdai = Operator.sum([this.total.tqtlPcapUdai, item.tqtlPcapUdai]);
        //     this.total.tqtlPcapKvuc = Operator.sum([this.total.tqtlPcapKvuc, item.tqtlPcapKvuc]);
        //     this.total.tqtlPcapKhac = Operator.sum([this.total.tqtlPcapKhac, item.tqtlPcapKhac]);
        //     this.total.tongNcauTluong = Operator.sum([this.total.tongNcauTluong, item.tongNcauTluong]);
        //     this.total.baoGomTluongBche = Operator.sum([this.total.baoGomTluongBche, item.baoGomTluongBche]);
        //     this.total.baoGomKhoanDgop = Operator.sum([this.total.baoGomKhoanDgop, item.baoGomKhoanDgop]);
        //     this.total.baoGomLuongCbcc = Operator.sum([this.total.baoGomLuongCbcc, item.baoGomLuongCbcc]);
        //     this.total.baoGomLuongTheoCheDo = Operator.sum([this.total.baoGomLuongTheoCheDo, item.baoGomLuongTheoCheDo]);
        //     this.total.dtoanKphiDtoanNtruoc = Operator.sum([this.total.dtoanKphiDtoanNtruoc, item.dtoanKphiDtoanNtruoc]);
        //     this.total.dtoanKphiDaGiao = Operator.sum([this.total.dtoanKphiDaGiao, item.dtoanKphiDaGiao]);
        //     this.total.dtoanKphiCong = Operator.sum([this.total.dtoanKphiCong, item.dtoanKphiCong]);
        //     this.total.dtoanDnghiDchinh = Operator.sum([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
        //     this.total.dtoanVuTvqtDnghi = Operator.sum([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
        // })

        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.keys.forEach(key => {
                    this.total[key] = Operator.sum([this.total[key], item[key]]);
                })
            }
        })
    };

    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.dtoanDnghiDchinh < 0) {
                this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh);
            } else {
                this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh);
            }

            if (item.dtoanVuTvqtDnghi < 0) {
                this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi);
            } else {
                this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi);
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
                data: { ...item }
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
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
            })
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
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
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.tinhTong();
        this.getTotal();
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
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 2, l: 0, r: 17, val: null },
            { t: 0, b: 2, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 2, l: 1, r: 1, val: 'Danh mục' },
            { t: 0, b: 2, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 2, l: 3, r: 3, val: 'Thực hiện năm trước' },
            { t: 0, b: 0, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
            { t: 1, b: 2, l: 4, r: 4, val: 'Dự toán' },
            { t: 1, b: 2, l: 5, r: 5, val: 'Ước thực hiện' },
            { t: 0, b: 0, l: 6, r: 11, val: 'Năm dự toán' },
            { t: 1, b: 1, l: 6, r: 8, val: 'Chi phí tại cửa kho' },
            { t: 2, b: 2, l: 6, r: 6, val: 'Số lượng' },
            { t: 2, b: 2, l: 7, r: 7, val: 'Định mức' },
            { t: 2, b: 2, l: 8, r: 8, val: 'Thành tiền' },
            { t: 1, b: 1, l: 9, r: 10, val: 'Chí phí ngoài cửa kho' },
            { t: 2, b: 2, l: 9, r: 9, val: 'Bình quân' },
            { t: 2, b: 2, l: 10, r: 10, val: 'Thành tiền' },
            { t: 1, b: 2, l: 11, r: 11, val: 'Tổng cộng' },
            { t: 0, b: 0, l: 12, r: 14, val: 'Thẩm định' },
            { t: 1, b: 1, l: 12, r: 13, val: 'Chi phí tại cửa kho' },
            { t: 2, b: 2, l: 12, r: 12, val: 'Số lượng' },
            { t: 2, b: 2, l: 13, r: 13, val: 'Thành tiền' },
            { t: 1, b: 2, l: 14, r: 14, val: 'Tổng cộng' },
            { t: 0, b: 2, l: 15, r: 15, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
            { t: 0, b: 2, l: 16, r: 16, val: 'Ghi chú' },
            { t: 0, b: 2, l: 17, r: 17, val: 'Ý kiến của đơn vị cấp trên' },
        ]
        const fieldOrder = ['stt', 'tenDanhMuc', 'dviTinh', 'thNamTruoc', 'namDtoan', 'namUocTh', 'sluongTaiKho', 'dmucTaiKho', 'ttienTaiKho',
            'binhQuanNgoaiKho', 'ttienNgoaiKho', 'tongCong', 'tdinhKhoSluong', 'tdinhKhoTtien', 'tdinhTcong', 'chenhLech', 'ghiChu', 'ykienDviCtren']

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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_II.xlsx');
    }


}

