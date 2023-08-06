import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';

import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    matHang: string;
    maDviTinh: string;
    slBquanKh: number;
    luongSlBquanTte: number;
    luongSlBquanUocThien: number;
    luongSlBquanTcong: number;
    dinhMuc: number;
    tongNcauDtoan: number;
    kphiCong: number;
    kphiDtoanNtruoc: number;
    kphiDtoanGiaoTnam: number;
    dtoanDchinhDnghi: number;
    dtoanVuTvqtDnghi: number;
    dtoanPhiBquanThieu: number;
    maDmuc: string;
    maMatHang: string;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;
}


@Component({
    selector: 'app-phu-luc-8',
    templateUrl: './phu-luc-8.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc8Component implements OnInit {
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
    dToanVuTang: number;
    dToanVuGiam: number;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    dsDinhMuc: any[] = [];
    keys = [
        "tongNcauDtoan",
        "kphiCong",
        "kphiDtoanNtruoc",
        "kphiDtoanGiaoTnam",
        "dtoanDchinhDnghi",
        "dtoanVuTvqtDnghi",
        "dtoanPhiBquanThieu",
        "chenhLech",
    ]
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
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private dieuChinhService: DieuChinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
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
        this.namBcao = this.dataInfo.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 7, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 10, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 10, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 7, 1, 0);
            }
        }

        await this.getDinhMuc();
        // if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == "3") {
        //     this.lstCtietBcao.forEach(item => {
        //         const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maMatHang && e.loaiBaoQuan == item.maDmuc);
        //         if (!item.matHang) {
        //             item.matHang = dinhMuc?.tenDinhMuc;
        //         }
        //         item.dinhMuc = dinhMuc?.tongDmuc;
        //         item.maDviTinh = dinhMuc?.donViTinh;
        //         item.luongSlBquanTcong = Operator.sum([item.luongSlBquanTte, item.luongSlBquanUocThien])
        //         item.tongNcauDtoan = mulNumber(item.dinhMuc, item.luongSlBquanTcong);
        //         item.dtoanDchinhDnghi = item.tongNcauDtoan - item.kphiCong
        //         item.dtoanVuTvqtDnghi = item.tongNcauDtoan - item.kphiCong
        //     })
        // }

        this.lstCtietBcao.forEach(item => {
            if (item.kphiCong == null) {
                item.kphiCong = 0
                item.dtoanDchinhDnghi = Operator.sum([item.tongNcauDtoan, - item.kphiCong]);
            }
        })

        this.lstCtietBcao.forEach(item => {
            if (!item.matHang) {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.matHang && e.loaiBaoQuan == item.maDmuc);
                item.matHang = dinhMuc?.tenDinhMuc;
                item.dinhMuc = dinhMuc?.tongDmuc;
                item.maDviTinh = dinhMuc?.donViTinh;
                item.luongSlBquanTcong = Operator.sum([item.luongSlBquanTte, item.luongSlBquanUocThien])
                item.tongNcauDtoan = Operator.mul(item.dinhMuc, item.luongSlBquanTcong);
                item.dtoanDchinhDnghi = Operator.sum([item.tongNcauDtoan, - item.kphiCong])
                item.dtoanVuTvqtDnghi = Operator.sum([item.tongNcauDtoan, - item.kphiCong])
            }
        })

        if (!this.lstCtietBcao[0]?.stt) {
            this.setIndex();
        }
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        this.getTotal()
        this.tinhTong();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };


    async getFormDetail() {
        await this.dieuChinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = this.formDetail.lstCtietDchinh;
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

    getName(level: number, ma: string) {
        const type = this.getTail(ma);
        let str = '';
        return str;
    }


    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '03',
            maDvi: this.dataInfo.maDvi,
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


    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.tongNcauDtoan > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
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
                item.dtoanVuTvqtDnghi = item.dtoanDchinhDnghi;
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
        this.dieuChinhService.updatePLDieuChinh(request).toPromise().then(
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
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal();
        this.tinhTong();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
        this.tinhTong();
    }

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

    handleCancel() {
        this._modalRef.close();
    };

    checkDelete(stt: string) {
        // const level = stt.split('.').length - 2;
        // if (level == 1) {
        //     return true;
        // }
        // return false;

        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }


    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    };

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    };


    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    deleteLine(id: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = Table.preIndex(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (Table.preIndex(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1);
        this.tinhTong();
        this.sum(stt);
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

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };


    startEdit(id: string): void {
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                matHang: data.matHang,
                level: data.level,
                // ttienTd: data.ttienTd,
                maDviTinh: data.maDviTinh,
                slBquanKh: data.slBquanKh,
                luongSlBquanTte: data.luongSlBquanTte,
                luongSlBquanUocThien: data.luongSlBquanUocThien,
                luongSlBquanTcong: data.luongSlBquanTcong,
                dinhMuc: data.dinhMuc,
                maDmuc: data.maDmuc,
                maMatHang: data.maMatHang,
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
        // this.getTotal();
        this.tinhTong();
    };

    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDchinhDnghi])
            if (item.level == 1) {
                if (item.dtoanDchinhDnghi && item.dtoanDchinhDnghi !== null) {
                    if (item.dtoanDchinhDnghi < 0) {
                        Number(this.tongDieuChinhGiam += Number(item?.dtoanDchinhDnghi));
                    } else {
                        Number(this.tongDieuChinhTang += Number(item?.dtoanDchinhDnghi));
                    }
                }

                if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
                    if (item.dtoanVuTvqtDnghi < 0) {
                        Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                    } else {
                        Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
                    }
                }
            }

        })
    };

    replaceIndex(lstIndex: number[], heSo: number) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = Table.preIndex(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.luongSlBquanTcong = Operator.sum([this.editCache[id].data.luongSlBquanTte, this.editCache[id].data.luongSlBquanUocThien]);
        this.editCache[id].data.tongNcauDtoan = Operator.mul(this.editCache[id].data.dinhMuc, this.editCache[id].data.luongSlBquanTcong);
        this.editCache[id].data.kphiCong = Operator.sum([this.editCache[id].data.kphiDtoanGiaoTnam, this.editCache[id].data.kphiDtoanNtruoc])
        this.editCache[id].data.dtoanDchinhDnghi = Operator.sum([this.editCache[id].data.tongNcauDtoan, - this.editCache[id].data.kphiCong]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDchinhDnghi]);
    };

    setIndex() {
        const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maDmuc);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcao[index].stt = stt;
            const lstDmTemp = this.lstCtietBcao.filter(e => e.maMatHang == lstVtuTemp[i].maMatHang && !!e.maDmuc);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
        lstVtuTemp.forEach(item => {
            this.sum(item.stt + '.1');
        })
    };

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
                if (data) {
                    if (this.lstCtietBcao.findIndex(e => e.matHang == data.ma) == -1) {
                        //tim so thu tu cho loai vat tu moi
                        let index = 1;
                        this.lstCtietBcao.forEach(item => {
                            if (item.maMatHang && !item.maDmuc) {
                                index += 1;
                            }
                        })
                        const stt = '0.' + index.toString();
                        //them vat tu moi vao bang
                        this.lstCtietBcao.push({
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: stt,
                            maMatHang: data.ma,
                            matHang: data.ten,
                            level: 0,
                        })
                        const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
                        for (let i = 1; i <= lstTemp.length; i++) {
                            this.lstCtietBcao.push({
                                ...new ItemData(),
                                id: uuid.v4() + 'FE',
                                stt: stt + '.' + i.toString(),
                                maMatHang: data.ma,
                                maDmuc: lstTemp[i - 1].loaiBaoQuan,
                                matHang: lstTemp[i - 1].tenDinhMuc,
                                maDviTinh: lstTemp[i - 1].donViTinh,
                                level: 1,
                                dinhMuc: lstTemp[i - 1].tongDmuc,
                            })
                        }
                        this.updateEditCache();
                    }
                }
            }
        });
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
            { t: 0, b: 2, l: 0, r: 17, val: null },
            { t: 0, b: 2, l: 0, r: 0, val: "STT" },
            { t: 0, b: 2, l: 1, r: 1, val: "Mặt hàng" },
            { t: 0, b: 2, l: 2, r: 2, val: "ĐVT" },
            { t: 0, b: 2, l: 3, r: 3, val: "Số lượng bảo quản theo KH được giao" },
            { t: 0, b: 0, l: 4, r: 6, val: "Lượng hàng thực hiện" },
            { t: 0, b: 2, l: 7, r: 7, val: "ĐỊNH MỨC" },
            { t: 0, b: 2, l: 8, r: 8, val: "Tổng nhu cầu dự toán năm" + this.namBcao },
            { t: 0, b: 0, l: 9, r: 11, val: "Kinh phí được sử dụng năm " + this.namBcao },
            { t: 0, b: 2, l: 12, r: 12, val: "Dự toán điều chỉnh đề nghị(+ Tăng)(- Giảm)" },
            { t: 0, b: 2, l: 13, r: 13, val: "Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)" },
            { t: 0, b: 2, l: 14, r: 14, val: "Dự toán phí bảo quản thiếu năm 2020" },
            { t: 0, b: 2, l: 15, r: 15, val: "Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị" },
            { t: 0, b: 2, l: 16, r: 16, val: "Ý kiến của đơn vị cấp trên" },
            { t: 0, b: 2, l: 17, r: 17, val: "Ghi chú" },

            { t: 1, b: 2, l: 4, r: 4, val: "Số lượng bảo quản thực tế đã thực hiện đến thời điểm báo cáo" },
            { t: 1, b: 2, l: 5, r: 5, val: "Số lượng bảo quản ước thực hiện từ thời điểm báo cáo đến cuối năm" },
            { t: 1, b: 2, l: 6, r: 6, val: "Cộng" },
            { t: 1, b: 2, l: 9, r: 9, val: "Cộng" },
            { t: 1, b: 2, l: 10, r: 10, val: "Dự toán năm trước chuyển sang được phép sử dụng cho năm nay" },
            { t: 1, b: 2, l: 11, r: 11, val: "Dự toán đã giao trong năm" },

        ]
        const fieldOrder = [
            'stt',
            'matHang',
            'maDviTinh',
            'slBquanKh',
            'luongSlBquanTte',
            'luongSlBquanUocThien',
            'luongSlBquanTcong',
            'dinhMuc',
            'tongNcauDtoan',
            'kphiCong',
            'kphiDtoanNtruoc',
            'kphiDtoanGiaoTnam',
            'dtoanDchinhDnghi',
            'dtoanVuTvqtDnghi',
            'dtoanPhiBquanThieu',
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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_III.xlsx');
    }

}

