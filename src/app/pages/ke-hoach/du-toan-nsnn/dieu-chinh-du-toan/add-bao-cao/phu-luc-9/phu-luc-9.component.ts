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

        this.tinhTong();
        this.getTotal();
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
        this.getTotal();
        this.tinhTong();
        this.updateEditCache();
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
            { t: 0, b: 8, l: 0, r: 41, val: null },
            { t: 0, b: 8, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 8, l: 1, r: 1, val: 'Tên đơn vị(Biên chế thực tế có mặt)' },
            { t: 0, b: 8, l: 2, r: 2, val: 'Biên chế' + this.namBcao.toString() + 'được giao' },
            { t: 0, b: 8, l: 3, r: 3, val: 'Biên chế có mặt' },
            { t: 0, b: 8, l: 4, r: 4, val: 'Biên chế chưa tuyển' },
            { t: 0, b: 1, l: 5, r: 16, val: 'Hệ số lương và các loại phụ cấp cho biên chế công chức có mặt năm' + (this.namBcao - 1).toString() },
            { t: 0, b: 1, l: 17, r: 28, val: 'Tổng quỹ lương và các loại phụ cấp cho biên chế công chức có mặt năm' + (this.namBcao - 1).toString() + ' (tính đến 31/12/' + (this.namBcao - 1).toString() + '(không tính HĐ 68))' },
            { t: 0, b: 8, l: 29, r: 29, val: 'Các khoản lương khác theo chế độ' },
            { t: 0, b: 8, l: 30, r: 33, val: 'Bao gồm' },
            { t: 0, b: 8, l: 34, r: 36, val: 'Dự toán, kinh phí được sử dụng trong năm' },
            { t: 0, b: 8, l: 37, r: 37, val: 'Dự toán điều chỉnh (+ tăng) (- giảm)' },
            { t: 0, b: 8, l: 38, r: 38, val: 'Dự toán Vụ TVQT đề nghị (+ tăng)(- giảm)' },
            { t: 0, b: 8, l: 39, r: 39, val: 'Ghi chú' },
            { t: 0, b: 8, l: 40, r: 40, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng)(- giảm)' },
            { t: 0, b: 8, l: 41, r: 41, val: 'Ý kiến của đơn vị cấp trên' },

            { t: 2, b: 7, l: 5, r: 5, val: 'Tổng số' },
            { t: 2, b: 3, l: 6, r: 16, val: 'Bao gồm' },
            { t: 2, b: 7, l: 17, r: 17, val: 'Tổng số' },
            { t: 2, b: 3, l: 18, r: 28, val: 'Bao gồm' },

            { t: 2, b: 7, l: 30, r: 30, val: 'Tiền lương biên chế thực tế có mặt' },
            { t: 2, b: 7, l: 31, r: 31, val: 'Các khoản đóng góp theo lương của biên chế thực tế' },
            { t: 2, b: 7, l: 32, r: 32, val: 'Lương CBCC chưa tuyển dụng' },
            { t: 2, b: 7, l: 33, r: 33, val: 'Lương điều hòa chung' },
            { t: 2, b: 7, l: 34, r: 34, val: 'Các khoản lương khác theo chế độ' },
            { t: 2, b: 7, l: 35, r: 35, val: 'Dự toán, kinh phí đã giao trong năm' },
            { t: 2, b: 7, l: 36, r: 36, val: 'Cộng' },


            { t: 4, b: 7, l: 6, r: 6, val: 'Hệ số lương' },
            { t: 4, b: 5, l: 7, r: 16, val: 'Hệ số các loại phụ cấp' },
            { t: 4, b: 7, l: 18, r: 18, val: 'Tiền lương' },
            { t: 4, b: 5, l: 19, r: 28, val: 'Tiền phụ cấp lương' },

            { t: 6, b: 7, l: 7, r: 7, val: 'Tổng' },
            { t: 6, b: 7, l: 8, r: 8, val: 'PC chức vụ' },
            { t: 6, b: 7, l: 9, r: 9, val: 'PC trách nhiệm' },
            { t: 6, b: 7, l: 10, r: 10, val: 'PC thâm niên vượt khung' },
            { t: 6, b: 7, l: 11, r: 11, val: 'HSBL' },
            { t: 6, b: 7, l: 12, r: 12, val: 'Phụ cấp công vụ ' },
            { t: 6, b: 7, l: 13, r: 13, val: 'Phụ cấp thâm niên' },
            { t: 6, b: 7, l: 14, r: 14, val: 'Phụ cấp ưu đãi nghề' },
            { t: 6, b: 7, l: 15, r: 15, val: 'PC khu vực' },
            { t: 6, b: 7, l: 16, r: 16, val: 'PC khác' },
            { t: 6, b: 7, l: 19, r: 19, val: 'Tổng' },
            { t: 6, b: 7, l: 20, r: 20, val: 'PC chức vụ' },
            { t: 6, b: 7, l: 21, r: 21, val: 'PC trách nhiệm' },
            { t: 6, b: 7, l: 22, r: 22, val: 'PC thâm niên vượt khung' },
            { t: 6, b: 7, l: 23, r: 23, val: 'HSBL' },
            { t: 6, b: 7, l: 24, r: 24, val: 'Phụ cấp công vụ ' },
            { t: 6, b: 7, l: 25, r: 25, val: 'Phụ cấp thâm niên' },
            { t: 6, b: 7, l: 26, r: 26, val: 'Phụ cấp ưu đãi nghề' },
            { t: 6, b: 7, l: 27, r: 27, val: 'PC khu vực' },
            { t: 6, b: 7, l: 28, r: 28, val: 'PC khác' },


            { t: 8, b: 8, l: 0, r: 0, val: 'A' },
            { t: 8, b: 8, l: 1, r: 1, val: 'B' },
            { t: 8, b: 8, l: 2, r: 2, val: '1 = 2 + 3' },
            { t: 8, b: 8, l: 3, r: 3, val: '2' },
            { t: 8, b: 8, l: 4, r: 4, val: '3' },
            { t: 8, b: 8, l: 5, r: 5, val: '4 = 5 + 6' },
            { t: 8, b: 8, l: 6, r: 6, val: '5' },
            { t: 8, b: 8, l: 7, r: 7, val: '6 = 7 + ... + 15' },
            { t: 8, b: 8, l: 8, r: 8, val: '7' },
            { t: 8, b: 8, l: 9, r: 9, val: '8' },
            { t: 8, b: 8, l: 10, r: 10, val: '9' },
            { t: 8, b: 8, l: 11, r: 11, val: '10' },
            { t: 8, b: 8, l: 12, r: 12, val: '11' },
            { t: 8, b: 8, l: 13, r: 13, val: '12' },
            { t: 8, b: 8, l: 14, r: 14, val: '13' },
            { t: 8, b: 8, l: 15, r: 15, val: '14' },
            { t: 8, b: 8, l: 16, r: 16, val: '15' },
            { t: 8, b: 8, l: 17, r: 17, val: '16 = 17 + 18' },
            { t: 8, b: 8, l: 18, r: 18, val: '17 ' },
            { t: 8, b: 8, l: 19, r: 19, val: '18 = 19 + ... + 27' },
            { t: 8, b: 8, l: 20, r: 20, val: '19' },
            { t: 8, b: 8, l: 21, r: 21, val: '20' },
            { t: 8, b: 8, l: 22, r: 22, val: '21' },
            { t: 8, b: 8, l: 23, r: 23, val: '22' },
            { t: 8, b: 8, l: 24, r: 24, val: '23' },
            { t: 8, b: 8, l: 25, r: 25, val: '24' },
            { t: 8, b: 8, l: 26, r: 26, val: '25' },
            { t: 8, b: 8, l: 27, r: 27, val: '26' },
            { t: 8, b: 8, l: 28, r: 28, val: '27' },
            { t: 8, b: 8, l: 29, r: 29, val: '28 = 29 + 30 + 31 + 32' },
            { t: 8, b: 8, l: 30, r: 30, val: '29' },
            { t: 8, b: 8, l: 31, r: 31, val: '30' },
            { t: 8, b: 8, l: 32, r: 32, val: '31' },
            { t: 8, b: 8, l: 33, r: 33, val: '32' },
            { t: 8, b: 8, l: 34, r: 34, val: '33' },
            { t: 8, b: 8, l: 35, r: 35, val: '34' },
            { t: 8, b: 8, l: 36, r: 36, val: '35 = 34 + 33' },
            { t: 8, b: 8, l: 37, r: 37, val: '36 = 28 - 35' },
            { t: 8, b: 8, l: 38, r: 38, val: '37' },
            { t: 8, b: 8, l: 39, r: 39, val: '38' },
            { t: 8, b: 8, l: 40, r: 40, val: '39 = 47 - 36' },
            { t: 8, b: 8, l: 41, r: 41, val: '40' },

        ]
        const fieldOrder = [
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
            'chenhLech',
            'ghiChu',
            'ykienDviCtren',
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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_II.xlsx');
    }


}

