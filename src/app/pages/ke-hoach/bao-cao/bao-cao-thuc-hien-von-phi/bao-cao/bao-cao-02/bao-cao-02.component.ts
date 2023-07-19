import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form, Vp } from '../../bao-cao-thuc-hien-von-phi.constant';
import * as XLSX from 'xlsx';

export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maVtu: string;
    tenVtu: string;
    maDviTinh: string;
    soQd: string;
    ghiChu: string;
    khSoLuong: number;
    khGiaMuaTd: number;
    khTtien: number;
    thSoLuong: number;
    thGiaMuaTd: number;
    thTtien: number;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.khTtien = Operator.mul(this.khSoLuong, this.khGiaMuaTd);
        this.thTtien = Operator.mul(this.thSoLuong, this.thGiaMuaTd);
    }

    average() {
        this.khGiaMuaTd = Operator.div(this.khTtien, this.khSoLuong);
        this.thGiaMuaTd = Operator.div(this.thTtien, this.thSoLuong);
    }

    sum(data: ItemData) {
        this.thSoLuong = Operator.sum([this.thSoLuong, data.thSoLuong]);
        this.thTtien = Operator.sum([this.thTtien, data.thTtien]);
        if (this.level == 0) {
            this.khSoLuong = Operator.sum([this.khSoLuong, data.khSoLuong]);
            this.khTtien = Operator.sum([this.khTtien, data.khTtien])
        }
    }

    clearKeHoach() {
        this.khSoLuong = null;
        this.khGiaMuaTd = null;
        this.khTtien = null;
    }

    clearThucHien() {
        this.thSoLuong = null;
        this.thGiaMuaTd = null;
        this.thTtien = null;
    }

    upperBound() {
        return this.khTtien > Utils.MONEY_LIMIT || this.thTtien > Utils.MONEY_LIMIT;
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
    selector: 'app-bao-cao-02',
    templateUrl: './bao-cao-02.component.html',
    styleUrls: ['../bao-cao.component.scss']
})

export class BaoCao02Component implements OnInit {
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
        private notification: NzNotificationService,
        private modal: NzModalService,
        private fileManip: FileManip,
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
            this.scrollX = Table.tableWidth(350, 8, 1, 160);
        } else {
            this.scrollX = Table.tableWidth(350, 8, 1, 0);
        }

        if (this.lstCtietBcao?.length == 0) {
            Vp.DANH_MUC_02.forEach(item => {
                this.lstCtietBcao.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    maVtu: item.ma,
                    stt: item.ma,
                    tenVtu: item.ten,
                }))
            })
        }
        if (this.dataInfo.isSynth && this.formDetail.trangThai == Status.NEW) {
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
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }
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
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
        this.spinner.hide();
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
        await this.fileManip.downloadFile(file, doc);
    }

    setIndex() {
        Vp.DANH_MUC_02.forEach(data => {
            this.lstCtietBcao.filter(e => e.stt == data.ma && e.maVtu != data.ma).forEach((item, index) => {
                item.stt = data.ma + '.' + (index + 1).toString();
            })
        })

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
                if (this.lstCtietBcao.findIndex(e => e.maVtu == data.ma && e.level == 1) == -1) {
                    const item: ItemData = new ItemData({
                        id: uuid.v4() + 'FE',
                        maVtu: data.ma,
                        tenVtu: data.ten,
                        maDviTinh: data.maDviTinh,
                        level: 1,
                    })
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
            level: 2,
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

    // updateChecked(id: string) {
    //     const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //     //đặt các phần tử con có cùng trạng thái với nó
    //     this.lstCtietBcao.forEach(item => {
    //         if (item.stt.startsWith(data.stt)) {
    //             item.checked = data.checked;
    //         }
    //     })
    //     //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    //     let index: number = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(data.stt));
    //     if (index == -1) {
    //         this.allChecked = this.checkAllChild('0');
    //     } else {
    //         let nho: boolean = this.lstCtietBcao[index].checked;
    //         while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
    //             this.lstCtietBcao[index].checked = !nho;
    //             index = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(this.lstCtietBcao[index].stt));
    //             if (index == -1) {
    //                 this.allChecked = this.checkAllChild('0');
    //                 break;
    //             }
    //             nho = this.lstCtietBcao[index].checked;
    //         }
    //     }
    // }

    // //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    // checkAllChild(str: string): boolean {
    //     let nho = true;
    //     this.lstCtietBcao.forEach(item => {
    //         if ((Table.preIndex(item.stt) == str) && (!item.checked)) {
    //             nho = item.checked;
    //         }
    //     })
    //     return nho;
    // }


    // updateAllChecked() {
    //     this.lstCtietBcao.forEach(item => {
    //         item.checked = this.allChecked;
    //     })
    // }

    // deleteAllChecked() {
    //     const lstId: string[] = [];
    //     this.lstCtietBcao.forEach(item => {
    //         if (item.checked) {
    //             lstId.push(item.id);
    //         }
    //     })
    //     lstId.forEach(item => {
    //         if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
    //             this.deleteLine(item);
    //         }
    //     })
    // }

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
            if (this.lstCtietBcao[index].level == 0) {
                this.lstCtietBcao[index].clearKeHoach();
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].sum(item);
                }
            })
            this.lstCtietBcao[index].average();
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.clearKeHoach();
        this.total.clearThucHien();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 10, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Tên vật tư, hàng hóa' },
            { t: 0, b: 1, l: 2, r: 2, val: 'ĐVT' },
            { t: 0, b: 0, l: 3, r: 6, val: 'Kế hoạch' },
            { t: 1, b: 1, l: 3, r: 3, val: 'Quyết định số ... ngày ...' },
            { t: 1, b: 1, l: 4, r: 4, val: 'Số lượng' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Giá mua tối đa Tổng cục QĐ' },
            { t: 1, b: 1, l: 6, r: 6, val: 'Thành tiền (Đã bao gồm thuế GTGT)' },
            { t: 0, b: 0, l: 7, r: 9, val: 'Thực hiện' },
            { t: 1, b: 1, l: 7, r: 7, val: 'Số lượng' },
            { t: 1, b: 1, l: 8, r: 8, val: 'Đơn giá thực tế' },
            { t: 1, b: 1, l: 9, r: 9, val: 'Thành tiền (Đã bao gồm thuế GTGT)' },
            { t: 0, b: 1, l: 10, r: 10, val: 'Ghi chú' },
        ]
        const fieldOrder = ['stt', 'tenVtu', 'maDviTinh', 'soQd', 'khSoLuong', 'khGiaMuaTd', 'khTtien', 'thSoLuong', 'thGiaMuaTd', 'thTtien', 'ghiChu'];
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field];
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_02BCN.xlsx');
    }
}

