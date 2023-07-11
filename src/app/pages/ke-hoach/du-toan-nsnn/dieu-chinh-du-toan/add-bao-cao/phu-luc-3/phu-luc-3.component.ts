import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { displayNumber, exchangeMoney } from 'src/app/Utility/func';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
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
    noiDung: string;
    loaiKhoan: string;
    ncauKphi: number;
    dtoanKphiNtruoc: number;
    dtoanKphiDaGiao: number;
    dtoanKphiCong: number;
    kphiUocThien: number;
    dtoanDchinh: number;
    dtoanVuTvqtDnghi: number;
    maNoiDung: string;
}

@Component({
    selector: 'app-phu-luc-3',
    templateUrl: './phu-luc-3.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc3Component implements OnInit {
    @Input() dataInfo;
    Utils = Utils;
    Op = new Operator('1');

    status: BtnStatus = new BtnStatus();
    formDetail: Form = new Form();
    maDviTien: string = '1';
    namBcao: number;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    lstTaiSans: any[] = [];
    lstCtietBcao: ItemData[] = [];
    keys = [
        "ncauKphi",
        "dtoanKphiNtruoc",
        "dtoanKphiDaGiao",
        "dtoanKphiCong",
        "kphiUocThien",
        "dtoanDchinh",
        "dtoanVuTvqtDnghi",
    ];
    total: ItemData = new ItemData();
    scrollX: string;
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    maDviTao: any;
    userInfo: any;
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
        private danhMucService: DanhMucDungChungService,
        private FileManip: FileManip,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 10, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 11, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 10, 1, 0);
            }
        }

        if (this.lstCtietBcao.length == 0) {
            this.lstCtietBcao.push({
                ...new ItemData(),
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maNoiDung: this.userInfo.MA_DVI,
                noiDung: this.userInfo.TEN_DVI,
                loaiKhoan: "340-341"
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNoiDung;
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

    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                ...item,
                checked: false
            }));
        }
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.keys.forEach(key => {
                    this.total[key] = Operator.sum([this.total[key], item[key]]);
                })
            }
        })
    };

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
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
                item.dtoanDchinh = item.dtoanVuTvqtDnghi;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.FileManip.uploadFile(iterator, this.dataInfo.path));
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


    startEdit(data: any): void {
        const id = data?.id;
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.getTotal();
        this.updateEditCache();
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


    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.dtoanDchinh < 0) {
                this.tongDieuChinhGiam += Number(item.dtoanDchinh);
            } else {
                this.tongDieuChinhTang += Number(item.dtoanDchinh);
            }

            if (item.dtoanVuTvqtDnghi < 0) {
                this.dToanVuGiam += Number(item.dtoanVuTvqtDnghi);
            } else {
                this.dToanVuTang += Number(item.dtoanVuTvqtDnghi);
            }
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.dtoanKphiCong = this.editCache[id].data.dtoanKphiNtruoc + this.editCache[id].data.dtoanKphiDaGiao;
        // this.editCache[id].data.dtoanDchinh = this.editCache[id].data.ncauKphi - this.editCache[id].data.dtoanKphiCong;
        this.editCache[id].data.dtoanDchinh = Operator.sum([this.editCache[id].data.ncauKphi, -this.editCache[id].data.dtoanKphiCong]);
    };

    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return Utils.laMa(k);
            default:
                return null;
        }
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
        await this.FileManip.downloadFile(file, doc);
    };

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

