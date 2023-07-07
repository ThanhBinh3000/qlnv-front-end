import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogAddVatTuComponent } from 'src/app/pages/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/von-phi-hang-du-tru-quoc-gia/bao-cao-quyet-toan/dialog-add-vat-tu/dialog-add-vat-tu.component';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { addChild, displayNumber, exchangeMoney, getHead, mulNumber, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { TEN_HANG } from './phu-luc-7.constant';
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
    ghiChu: string;
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
    donViTiens: any[] = DON_VI_TIEN;
    isDataAvailable = false;
    editMoneyUnit = false;
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    namBcao: number;
    maDviTien: string = '1';
    thuyetMinh: string;
    editRecommendedValue: boolean;
    viewRecommendedValue: boolean;
    lstCtietBcao: ItemData[] = [];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    listIdDelete = "";
    allChecked = false;
    amount = AMOUNT;
    amount1 = AMOUNT1;
    formDetail: any;
    maDviTao: any;
    userInfo: any;
    lstTaiSans: any[] = [];
    total: ItemData = new ItemData();
    dsDinhMucX: any[] = [];
    scrollX: string;
    BOX_NUMBER_WIDTH = 400
    noiDungs: any[] = TEN_HANG;
    soLaMa: any[] = LA_MA;
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        this.userInfo = this.userService.getUserLogin();
        this.formDetail = this.dataInfo?.data;
        this.maDviTao = this.dataInfo?.maDvi;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.namBcao = this.dataInfo?.namBcao;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.editRecommendedValue = this.dataInfo?.editRecommendedValue;
        this.viewRecommendedValue = this.dataInfo?.viewRecommendedValue;
        this.formDetail?.lstCtietDchinh.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

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
        if (this.status) {
            this.scrollX = (800 + this.BOX_NUMBER_WIDTH * 10).toString() + 'px';
        } else {
            this.scrollX = (750 + this.BOX_NUMBER_WIDTH * 10).toString() + 'px';
        }
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
        this.getTotal();
        this.tinhTong();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();

    };

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
                this.total.dMucChiPhiTaiCuaKho = sumNumber([this.total.dMucChiPhiTaiCuaKho, item.dMucChiPhiTaiCuaKho]);
                this.total.binhQuanChiPhiNgoaiCuaKho = sumNumber([this.total.binhQuanChiPhiNgoaiCuaKho, item.binhQuanChiPhiNgoaiCuaKho]);
                // this.total.tdiemBcaoLuong = sumNumber([this.total.tdiemBcaoLuong, item.tdiemBcaoLuong]);
                this.total.tdiemBcaoChiPhiTaiCuaKho = sumNumber([this.total.tdiemBcaoChiPhiTaiCuaKho, item.tdiemBcaoChiPhiTaiCuaKho]);
                this.total.tdiemBcaoChiPhiNgoaiCuaKho = sumNumber([this.total.tdiemBcaoChiPhiNgoaiCuaKho, item.tdiemBcaoChiPhiNgoaiCuaKho]);
                this.total.tdiemBcaoChiPhiTongCong = sumNumber([this.total.tdiemBcaoChiPhiTongCong, item.tdiemBcaoChiPhiTongCong]);
                // this.total.dkienThienLuong = sumNumber([this.total.dkienThienLuong, item.dkienThienLuong]);
                this.total.dkienThienChiPhiTaiCuaKho = sumNumber([this.total.dkienThienChiPhiTaiCuaKho, item.dkienThienChiPhiTaiCuaKho]);
                this.total.dkienThienChiPhiNgoaiCuaKho = sumNumber([this.total.dkienThienChiPhiNgoaiCuaKho, item.dkienThienChiPhiNgoaiCuaKho]);
                this.total.dkienThienChiPhiTongCong = sumNumber([this.total.dkienThienChiPhiTongCong, item.dkienThienChiPhiTongCong]);
                this.total.ncauDtoan = sumNumber([this.total.ncauDtoan, item.ncauDtoan]);
                this.total.dtoanLkeDaGiao = sumNumber([this.total.dtoanLkeDaGiao, item.dtoanLkeDaGiao]);
                this.total.dtoanDnghiDchinh = sumNumber([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
                this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                this.total.kPhiThieuNamTruoc = sumNumber([this.total.kPhiThieuNamTruoc, item.kPhiThieuNamTruoc]);
            }
        })
    };

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        let checkSaveEdit;
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
        this.lstCtietBcao.forEach(element => {
            if (this.editCache[element.id].edit === true) {
                checkSaveEdit = false
            }
        });
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            if (item.dtoanDnghiDchinh > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        if (!this.viewRecommendedValue) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));
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
                        formDetail: this.formDetail,
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
    doPrint() {

    };

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
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].dMucChiPhiTaiCuaKho = sumNumber([this.lstCtietBcao[index].dMucChiPhiTaiCuaKho, item.dMucChiPhiTaiCuaKho])
                    this.lstCtietBcao[index].binhQuanChiPhiNgoaiCuaKho = sumNumber([this.lstCtietBcao[index].binhQuanChiPhiNgoaiCuaKho, item.binhQuanChiPhiNgoaiCuaKho])
                    this.lstCtietBcao[index].tdiemBcaoLuong = sumNumber([this.lstCtietBcao[index].tdiemBcaoLuong, item.tdiemBcaoLuong])
                    this.lstCtietBcao[index].tdiemBcaoChiPhiTaiCuaKho = sumNumber([this.lstCtietBcao[index].tdiemBcaoChiPhiTaiCuaKho, item.tdiemBcaoChiPhiTaiCuaKho])
                    this.lstCtietBcao[index].tdiemBcaoChiPhiNgoaiCuaKho = sumNumber([this.lstCtietBcao[index].tdiemBcaoChiPhiNgoaiCuaKho, item.tdiemBcaoChiPhiNgoaiCuaKho])
                    this.lstCtietBcao[index].tdiemBcaoChiPhiTongCong = sumNumber([this.lstCtietBcao[index].tdiemBcaoChiPhiTongCong, item.tdiemBcaoChiPhiTongCong])
                    this.lstCtietBcao[index].dkienThienLuong = sumNumber([this.lstCtietBcao[index].dkienThienLuong, item.dkienThienLuong])
                    this.lstCtietBcao[index].dkienThienChiPhiTaiCuaKho = sumNumber([this.lstCtietBcao[index].dkienThienChiPhiTaiCuaKho, item.dkienThienChiPhiTaiCuaKho])
                    this.lstCtietBcao[index].dkienThienChiPhiNgoaiCuaKho = sumNumber([this.lstCtietBcao[index].dkienThienChiPhiNgoaiCuaKho, item.dkienThienChiPhiNgoaiCuaKho])
                    this.lstCtietBcao[index].dkienThienChiPhiTongCong = sumNumber([this.lstCtietBcao[index].dkienThienChiPhiTongCong, item.dkienThienChiPhiTongCong])
                    this.lstCtietBcao[index].ncauDtoan = sumNumber([this.lstCtietBcao[index].ncauDtoan, item.ncauDtoan])
                    this.lstCtietBcao[index].dtoanLkeDaGiao = sumNumber([this.lstCtietBcao[index].dtoanLkeDaGiao, item.dtoanLkeDaGiao])
                    this.lstCtietBcao[index].dtoanDnghiDchinh = sumNumber([this.lstCtietBcao[index].dtoanDnghiDchinh, item.dtoanDnghiDchinh])
                    this.lstCtietBcao[index].dtoanVuTvqtDnghi = sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi])
                    this.lstCtietBcao[index].kPhiThieuNamTruoc = sumNumber([this.lstCtietBcao[index].kPhiThieuNamTruoc, item.kPhiThieuNamTruoc])
                }
            })
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
        // this.editCache[id].data.ncauDtoan = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan;
        // this.editCache[id].data.dtoanDnghiDchinh = this.editCache[id].data.ncauDtoan - this.editCache[id].data.dtoanLkeDaGiao;
        this.editCache[id].data.tdiemBcaoChiPhiTaiCuaKho = mulNumber(this.editCache[id].data.tdiemBcaoLuong, this.editCache[id].data.dMucChiPhiTaiCuaKho);
        this.editCache[id].data.tdiemBcaoChiPhiTongCong = sumNumber([this.editCache[id].data.tdiemBcaoChiPhiTaiCuaKho, this.editCache[id].data.tdiemBcaoChiPhiNgoaiCuaKho]);
        this.editCache[id].data.dkienThienChiPhiTaiCuaKho = mulNumber(this.editCache[id].data.dMucChiPhiTaiCuaKho, this.editCache[id].data.dkienThienLuong);
        this.editCache[id].data.dkienThienChiPhiNgoaiCuaKho = mulNumber(this.editCache[id].data.binhQuanChiPhiNgoaiCuaKho, this.editCache[id].data.dkienThienLuong);
        this.editCache[id].data.dkienThienChiPhiTongCong = sumNumber([this.editCache[id].data.dkienThienChiPhiTaiCuaKho, this.editCache[id].data.dkienThienChiPhiNgoaiCuaKho]);
        this.editCache[id].data.ncauDtoan = sumNumber([this.editCache[id].data.tdiemBcaoChiPhiTongCong, this.editCache[id].data.dkienThienChiPhiTongCong]);
        this.editCache[id].data.dtoanDnghiDchinh = this.editCache[id].data.ncauDtoan - this.editCache[id].data.dtoanLkeDaGiao;
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
        let xau = "";
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (n == 1) {
            xau = chiSo[n];
        }
        if (n == 2) {
            xau = "-";
        }
        return xau;
    }



}


