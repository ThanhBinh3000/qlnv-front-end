import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { DANH_MUC } from './phu-luc-11.constant';
export class ItemData {
    level: any;
    // checked: boolean;
    id: string;
    stt: string;
    tenNoiDung: string;
    maNoiDung: string;
    doiTuong: string;
    thoiGianHoc: string;
    sluongTrongNuoc: number;
    sluongNgoaiNuoc: number;
    sluongTongSo: number;
    kinhPhiHoTro: number;
    tongNCDtoanKp: number;
    dtoanNamTruoc: number;
    dtoanDaGiao: number;
    dtoanTongSo: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    chenhLech: number;
    ykienDviCtren: string;
    ghiChu: string;
}

export const AMOUNT1 = {
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
    selector: 'app-phu-luc-11',
    templateUrl: './phu-luc-11.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc11Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dtoanVuTang: number;
    dtoanVuGiam: number;

    //danh muc
    noiDungs: any[] = DANH_MUC;
    lstCtietBcao: ItemData[] = [];
    keys = [
        "sluongTrongNuoc",
        "sluongNgoaiNuoc",
        "sluongTongSo",
        "kinhPhiHoTro",
        "tongNCDtoanKp",
        "dtoanNamTruoc",
        "dtoanDaGiao",
        "dtoanTongSo",
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
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private modal: NzModalService,
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private dieuChinhDuToanService: DieuChinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }
    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
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
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenNoiDung: e.giaTri,
                    maNoiDung: e.ma,
                })
            })
            this.setLevel();
            // this.lstCtietBcao.forEach(item => {
            //     item.tenNoiDung += Utils.getName(item.level, item.maNoiDung);
            // })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNoiDung;
            })
        }

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0]?.stt) {
                this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maNoiDung');
            } else {
                this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
            }
        }

        // this.lstCtietBcao.forEach(item => {
        //     item.tenNoiDung = this.noiDungs.find(e => e.ma == item.maNoiDung)?.giaTri;
        // })

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


    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    getIndex(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return chiSo[n];
            case 1:
                return "-";
            case 2:
                return chiSo[n];
            case 3:
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            case 4:
                return String.fromCharCode(k + 96);
            case 5:
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

    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        // if (this.lstCtietBcao.some(e => e.ncauChiTongSo > MONEY_LIMIT)) {
        // 	this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        // 	return;
        // }

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
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
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
    };

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

    doPrint() {

    };

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                tenNoiDung: data.tenNoiDung,
                level: data.level,
                maNoiDung: data.maNoiDung,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
        this.tinhTong();
    };

    addLine(data: any) {
        let parentItem: ItemData = this.lstCtietBcao.find(e => this.getHead(e.stt) == data.stt);
        parentItem = {
            ...new ItemData(),
            id: uuid.v4() + 'FE',
            maNoiDung: "",
            level: data.level + 1,
            tenNoiDung: "",
        }
        this.lstCtietBcao = Table.addChild(data.id, parentItem, this.lstCtietBcao);
        this.updateEditCache();
    };

    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
    };

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 1) {
            return true;
        }
        return false;
    };

    deleteLine(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1);
        this.sum(stt);
        this.getTotal();
        this.updateEditCache();
    };

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    handleCancel() {
        this._modalRef.close();
    };


    changeModel(id: string): void {
        this.editCache[id].data.sluongTongSo = Operator.sum([this.editCache[id].data.sluongTrongNuoc, this.editCache[id].data.sluongNgoaiNuoc]);
        this.editCache[id].data.tongNCDtoanKp = Operator.mul(this.editCache[id].data.sluongTongSo, this.editCache[id].data.kinhPhiHoTro);
        this.editCache[id].data.dtoanTongSo = Operator.sum([this.editCache[id].data.dtoanNamTruoc, this.editCache[id].data.dtoanDaGiao]);
        this.editCache[id].data.dtoanDnghiDchinh = Operator.sum([this.editCache[id].data.tongNCDtoanKp, - this.editCache[id].data.dtoanTongSo]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDnghiDchinh]);
    };

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str) != -1;
    };

    checkEdit(stt: string) {
        if (
            stt == "0.1" ||
            stt == "0.2" ||
            stt == "0.3" ||
            stt == "0.4"
        ) {
            return false;
        }
        return true;
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal()
        this.tinhTong()
        this.updateEditCache();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    };
    checkAdd(stt: string) {
        if (
            stt == "0.1" ||
            stt == "0.2" ||
            stt == "0.3" ||
            stt == "0.4"
        ) {
            return true;
        }
        return false;
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

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    };

    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dtoanVuTang = 0;
        this.dtoanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDnghiDchinh])
            if (item.level == 1) {
                if (item.dtoanDnghiDchinh && item.dtoanDnghiDchinh !== null) {
                    if (item.dtoanDnghiDchinh < 0) {
                        Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh));
                    } else {
                        Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh));
                    }
                }

                if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
                    if (item.dtoanVuTvqtDnghi < 0) {
                        Number(this.dtoanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                    } else {
                        Number(this.dtoanVuTang += Number(item?.dtoanVuTvqtDnghi));
                    }
                }
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
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 3, l: 0, r: 16, val: null },
            { t: 0, b: 2, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 2, l: 1, r: 1, val: 'Nội dung đào tạo, bồi dưỡng' },
            { t: 0, b: 2, l: 2, r: 2, val: 'Đối tượng' },
            { t: 0, b: 2, l: 3, r: 3, val: 'Thời gian học' },
            { t: 0, b: 1, l: 4, r: 6, val: 'Số lượng' },
            { t: 0, b: 2, l: 7, r: 7, val: 'Kinh phí hỗ trợ (đồng/người)' },
            { t: 0, b: 2, l: 8, r: 8, val: 'Tổng nhu cầu dự toán, kinh phí' },
            { t: 0, b: 1, l: 9, r: 11, val: 'Dự toán, kinh phí được sử dụng trong năm' },
            { t: 0, b: 2, l: 12, r: 12, val: 'Dự toán đề nghị điều chỉnh (+ tăng )(- giảm)' },
            { t: 0, b: 2, l: 13, r: 13, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
            { t: 0, b: 2, l: 14, r: 14, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
            { t: 0, b: 2, l: 15, r: 15, val: 'Ghi chú' },
            { t: 0, b: 2, l: 16, r: 16, val: 'Ý kiến của đơn vị cấp trên' },


            { t: 2, b: 2, l: 4, r: 4, val: 'Trong nước' },
            { t: 2, b: 2, l: 5, r: 5, val: 'Ngoài nước' },
            { t: 2, b: 2, l: 6, r: 6, val: 'Tổng số' },
            { t: 2, b: 2, l: 9, r: 9, val: 'Dự toán năm trước chuyển sang được <br> phép sử dụng cho năm nay' },
            { t: 2, b: 2, l: 10, r: 10, val: 'Dự toán, kinh phí đã giao trong năm' },
            { t: 2, b: 2, l: 11, r: 11, val: 'Tổng số' },

            { t: 3, b: 3, l: 0, r: 4, val: 'A' },
            { t: 3, b: 3, l: 1, r: 1, val: 'B' },
            { t: 3, b: 3, l: 2, r: 2, val: 'C' },
            { t: 3, b: 3, l: 3, r: 3, val: 'D' },
            { t: 3, b: 3, l: 4, r: 4, val: '1' },
            { t: 3, b: 3, l: 5, r: 5, val: '2' },
            { t: 3, b: 3, l: 6, r: 6, val: '3 = 1 + 2' },
            { t: 3, b: 3, l: 7, r: 7, val: '4' },
            { t: 3, b: 3, l: 8, r: 8, val: '5 = 3 x 4' },
            { t: 3, b: 3, l: 9, r: 9, val: '6' },
            { t: 3, b: 3, l: 10, r: 10, val: '7' },
            { t: 3, b: 3, l: 11, r: 11, val: '8 = 6 + 7' },
            { t: 3, b: 3, l: 12, r: 12, val: '9 = 5 - 8' },
            { t: 3, b: 3, l: 13, r: 13, val: '10' },
            { t: 3, b: 3, l: 14, r: 14, val: '11 = 10 - 9' },
            { t: 3, b: 3, l: 15, r: 15, val: '12' },
            { t: 3, b: 3, l: 16, r: 16, val: '13' },

        ]
        const fieldOrder = [
            'stt',
            'tenNoiDung',
            'doiTuong',
            'thoiGianHoc',
            'sluongTrongNuoc',
            'sluongNgoaiNuoc',
            'sluongTongSo',
            'kinhPhiHoTro',
            'tongNCDtoanKp',
            'dtoanNamTruoc',
            'dtoanDaGiao',
            'dtoanTongSo',
            'dtoanDnghiDchinh',
            'dtoanVuTvqtDnghi',
            'chenhLech',
            'ykienDviCtren',
            'ghiChu',
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
            item.stt = this.getIndex(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_DC_PL11.xlsx');
    }


}
