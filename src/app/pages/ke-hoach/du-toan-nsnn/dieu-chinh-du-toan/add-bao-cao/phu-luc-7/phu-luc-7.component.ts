import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { addChild, displayNumber, exchangeMoney, getHead, mulNumber } from 'src/app/Utility/func';
import { FileManip, MONEY_LIMIT, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogAddVatTuComponent } from 'src/app/pages/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/von-phi-hang-du-tru-quoc-gia/bao-cao-quyet-toan/dialog-add-vat-tu/dialog-add-vat-tu.component';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { TEN_HANG } from './phu-luc-7.constant';
import * as XLSX from 'xlsx'
export class ItemData {
    level: any;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    dmucHang: string;
    tenHang: string;
    donViTinh: string;
    khoachDpNhan: string;
    khoachQdGiaoNvu: string;
    khoachLuong: number;
    dMucChiPhiTaiCuaKho: number;
    binhQuanChiPhiNgoaiCuaKho: number;
    tdiemBcaoLuong: number;
    tdiemBcaoChiPhiTaiCuaKho: number;
    tdiemBcaoChiPhiNgoaiCuaKho: number;
    tdiemBcaoChiPhiTongCong: number;
    tdiemBcaoCcu: string;
    dkienThienLuong: number;
    dkienThienChiPhiTaiCuaKho: number;
    dkienThienChiPhiNgoaiCuaKho: number;
    dkienThienChiPhiTongCong: number;
    ncauDtoan: number;
    dtoanLkeDaGiao: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    kPhiThieuNamTruoc: number;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;
    checked: boolean;
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
    selector: 'app-phu-luc-7',
    templateUrl: './phu-luc-7.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc7Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    keys = [
        'thNamTruoc',
        'namDtoan',
        'namUocTh',
        'ttienTaiKho',
        'ttienNgoaiKho',
        'tongCong',
        'tdinhKhoTtien',
        'tdinhTcong',
        'chenhLech'
    ]
    lstVatTuFull: any[] = [];
    dsDinhMuc: any[] = [];
    scrollX: string;
    listIdDelete = ""

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

    noiDungs: any[] = [];
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
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;

        if (this.status.general) {
            // const category = await this.danhMucService.danhMucChungGetAll('LTD_PL2');
            // if (category) {
            this.noiDungs = TEN_HANG;
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
            this.noiDungs.forEach(s => {
                this.lstCtietBcao.push(
                    {
                        ...new ItemData(),
                        id: uuid.v4() + 'FE',
                        stt: s.ma,
                        tenHang: s.tenHang,
                        dmucHang: s.ma,
                    }
                )
            })
            this.setLevel();
        }

        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenHang: e.tenHang,
                    dmucHang: e.ma,
                })
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.dmucHang;
            })
        }

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
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


    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
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
                this.total.dMucChiPhiTaiCuaKho = Operator.sum([this.total.dMucChiPhiTaiCuaKho, item.dMucChiPhiTaiCuaKho]);
                this.total.binhQuanChiPhiNgoaiCuaKho = Operator.sum([this.total.binhQuanChiPhiNgoaiCuaKho, item.binhQuanChiPhiNgoaiCuaKho]);
                this.total.tdiemBcaoChiPhiTaiCuaKho = Operator.sum([this.total.tdiemBcaoChiPhiTaiCuaKho, item.tdiemBcaoChiPhiTaiCuaKho]);
                this.total.tdiemBcaoChiPhiNgoaiCuaKho = Operator.sum([this.total.tdiemBcaoChiPhiNgoaiCuaKho, item.tdiemBcaoChiPhiNgoaiCuaKho]);
                this.total.tdiemBcaoChiPhiTongCong = Operator.sum([this.total.tdiemBcaoChiPhiTongCong, item.tdiemBcaoChiPhiTongCong]);
                this.total.dkienThienChiPhiTaiCuaKho = Operator.sum([this.total.dkienThienChiPhiTaiCuaKho, item.dkienThienChiPhiTaiCuaKho]);
                this.total.dkienThienChiPhiNgoaiCuaKho = Operator.sum([this.total.dkienThienChiPhiNgoaiCuaKho, item.dkienThienChiPhiNgoaiCuaKho]);
                this.total.dkienThienChiPhiTongCong = Operator.sum([this.total.dkienThienChiPhiTongCong, item.dkienThienChiPhiTongCong]);
                this.total.ncauDtoan = Operator.sum([this.total.ncauDtoan, item.ncauDtoan]);
                this.total.dtoanLkeDaGiao = Operator.sum([this.total.dtoanLkeDaGiao, item.dtoanLkeDaGiao]);
                this.total.dtoanDnghiDchinh = Operator.sum([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
                this.total.dtoanVuTvqtDnghi = Operator.sum([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                this.total.kPhiThieuNamTruoc = Operator.sum([this.total.kPhiThieuNamTruoc, item.kPhiThieuNamTruoc]);
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

    deleteLine(id: any): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    };

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 2) {
            return true;
        }
        return false;
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCtietBcao.every(item => item.checked)) {
            this.allChecked = true;
        }
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

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
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
                level: data.level,
                dmucHang: data.dmucHang,
                tenHang: data.tenHang,
                donViTinh: data.donViTinh,
            }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            stt = Table.preIndex(stt);
            stt = this.getHead(stt);
        }
        this.getTotal();
        this.tinhTong();
    };

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
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
            if (item.level == 0) {
                if (item.dtoanDnghiDchinh && item.dtoanDnghiDchinh < 0) {
                    this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh);
                } else if (item.dtoanDnghiDchinh && item.dtoanDnghiDchinh > 0) {
                    this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh);
                }

                if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi < 0) {
                    this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi);
                } else if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi > 0) {
                    this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi);
                }
            }
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.tdiemBcaoChiPhiTaiCuaKho = mulNumber(this.editCache[id].data.tdiemBcaoLuong, this.editCache[id].data.dMucChiPhiTaiCuaKho);
        this.editCache[id].data.tdiemBcaoChiPhiTongCong = Operator.sum([this.editCache[id].data.tdiemBcaoChiPhiTaiCuaKho, this.editCache[id].data.tdiemBcaoChiPhiNgoaiCuaKho]);
        this.editCache[id].data.dkienThienChiPhiTaiCuaKho = mulNumber(this.editCache[id].data.dMucChiPhiTaiCuaKho, this.editCache[id].data.dkienThienLuong);
        this.editCache[id].data.dkienThienChiPhiNgoaiCuaKho = mulNumber(this.editCache[id].data.binhQuanChiPhiNgoaiCuaKho, this.editCache[id].data.dkienThienLuong);
        this.editCache[id].data.dkienThienChiPhiTongCong = Operator.sum([this.editCache[id].data.dkienThienChiPhiTaiCuaKho, this.editCache[id].data.dkienThienChiPhiNgoaiCuaKho]);
        this.editCache[id].data.ncauDtoan = Operator.sum([this.editCache[id].data.tdiemBcaoChiPhiTongCong, this.editCache[id].data.dkienThienChiPhiTongCong]);
        this.editCache[id].data.dtoanDnghiDchinh = Operator.sum([this.editCache[id].data.ncauDtoan, - this.editCache[id].data.dtoanLkeDaGiao]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDnghiDchinh]);

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

    checkAdd(stt: string) {

        if (
            stt == "0.1" ||
            stt == "0.2"
        ) {
            return true;
        }
        return false;
    }



    handlSelectGoods(data: any) {
        const obj = {
            stt: data.stt,
        }

        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogAddVatTuComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalTuChoi.afterClose.subscribe(async (res) => {
            if (res) {
                let parentItem: ItemData = this.lstCtietBcao.find(e => e.dmucHang == res.ma && getHead(e.stt) == data.stt);
                //them phan tu cha neu chua co
                if (!parentItem) {
                    parentItem = {
                        ...new ItemData(),
                        id: uuid.v4() + 'FE',
                        dmucHang: res.ma,
                        level: data.level + 1,
                        tenHang: res.ten,
                        donViTinh: res.maDviTinh,
                    }
                    this.lstCtietBcao = addChild(data.id, parentItem, this.lstCtietBcao);
                    let luyKes: any[] = [];
                    // if (getTail(data.stt) == 1) {
                    // 	luyKes = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == res.ma && e.maLoai == "LK");
                    // } else {
                    // 	luyKes = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == res.ma && e.maLoai == "PS");
                    // }
                    if (luyKes.length > 0) {
                        luyKes.forEach(luyKe => {
                            const item: ItemData = {
                                ... new ItemData(),
                                id: uuid.v4() + 'FE',
                                dmucHang: res.ma,
                                // tenHang: res.ten,
                                level: parentItem.level + 1,
                                // maDviTinh: res.maDviTinh,
                                khoachLuong: luyKe?.soLuongThucNhap,
                                // donGiaMua: luyKe?.donGia,
                            }
                            // item.thanhTien = mulNumber(item.soLuong, item.donGiaMua);
                            this.lstCtietBcao = addChild(parentItem.id, item, this.lstCtietBcao);
                        })
                    } else {
                        const item: ItemData = {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            dmucHang: res.ma,
                            // tenHang: res.ten,
                            level: parentItem.level + 1,
                            // maDviTinh: res.maDviTinh,
                        }
                        this.lstCtietBcao = addChild(parentItem.id, item, this.lstCtietBcao);
                    }
                } else {
                    const item: ItemData = {
                        ... new ItemData(),
                        id: uuid.v4() + 'FE',
                        dmucHang: res.ma,
                        // tenHang: res.ten,
                        level: parentItem.level + 1,
                        // maDviTinh: res.maDviTinh,
                    }
                    this.lstCtietBcao = addChild(parentItem.id, item, this.lstCtietBcao);
                }

                const stt = this.lstCtietBcao.find(e => e.id == parentItem.id).stt;

                this.sum(stt + '.1');
                this.updateEditCache();
            }

        });
    };

    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                return "-";
            default:
                return null;
        }
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


