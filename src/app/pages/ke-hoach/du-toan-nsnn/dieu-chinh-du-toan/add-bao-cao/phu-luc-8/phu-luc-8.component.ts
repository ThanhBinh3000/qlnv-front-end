import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, exchangeMoney, getHead, mulNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-8.constant';

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
    selector: 'app-phu-luc-8',
    templateUrl: './phu-luc-8.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc8Component implements OnInit {
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
    amount = AMOUNT;
    amount1 = AMOUNT1;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    total: ItemData = new ItemData();
    editAppraisalValue: boolean;
    viewAppraisalValue: boolean;
    allChecked = false;
    lstCtietBcao: ItemData[] = [];
    listVattu: any[] = [];
    formDetail: any;
    maDviTao: any;
    soLaMa: any[] = LA_MA;
    dsDinhMuc: any[] = [];
    linhVucChis: any[] = DANH_MUC;
    isSynthetic: any;
    scrollX: string;
    BOX_NUMBER_WIDTH = 250;
    constructor(
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private dieuChinhService: DieuChinhService,
        private danhMucService: DanhMucHDVService,
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
        this.formDetail = this.dataInfo?.data;
        this.maDviTao = this.dataInfo?.maDvi;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.namBcao = this.dataInfo?.namBcao;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.editAppraisalValue = this.dataInfo?.editRecommendedValue;
        this.viewAppraisalValue = this.dataInfo?.viewRecommendedValue;
        this.isSynthetic = this.dataInfo?.isSynthetic;
        this.formDetail?.lstCtietDchinh.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

        await this.getDinhMuc();
        if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == "3") {
            this.lstCtietBcao.forEach(item => {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maMatHang && e.loaiBaoQuan == item.maDmuc);
                if (!item.matHang) {
                    item.matHang = dinhMuc?.tenDinhMuc;
                }
                item.dinhMuc = dinhMuc?.tongDmuc;
                item.maDviTinh = dinhMuc?.donViTinh;
                item.luongSlBquanTcong = sumNumber([item.luongSlBquanTte, item.luongSlBquanUocThien])
                item.tongNcauDtoan = mulNumber(item.dinhMuc, item.luongSlBquanTcong);
                item.dtoanDchinhDnghi = item.tongNcauDtoan - item.kphiCong
                item.dtoanVuTvqtDnghi = item.tongNcauDtoan - item.kphiCong
            })
        }

        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVattu = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })

        if (this.status) {
            this.scrollX = (400 + this.BOX_NUMBER_WIDTH * 11).toString() + 'px';
        } else {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 11).toString() + 'px';
        }

        this.sortByIndex();
        this.sum1();
        this.getTotal()
        // this.tinhTong();
        this.updateEditCache();
        this.getStatusButton();

        this.spinner.hide();
    };

    getName(level: number, ma: string) {
        const type = this.getTail(ma);
        let str = '';
        return str;
    }


    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '03',
            maDvi: this.maDviTao,
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
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    };

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

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
            if (item.dtoanDchinhDnghi > MONEY_LIMIT) {
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

        if (!this.viewAppraisalValue) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDchinhDnghi;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));
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

    doPrint() {

    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal()
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

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };
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
        const level = stt.split('.').length - 2;
        if (level == 1) {
            return true;
        }
        return false;
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

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    };

    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    deleteLine(id: any) {
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
        stt = this.getHead(stt);
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
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].tongNcauDtoan = sumNumber([this.lstCtietBcao[index].tongNcauDtoan, item.tongNcauDtoan]);
                    this.lstCtietBcao[index].kphiCong = sumNumber([this.lstCtietBcao[index].kphiCong, item.kphiCong]);
                    this.lstCtietBcao[index].kphiDtoanGiaoTnam = sumNumber([this.lstCtietBcao[index].kphiDtoanGiaoTnam, item.kphiDtoanGiaoTnam]);
                    this.lstCtietBcao[index].kphiDtoanNtruoc = sumNumber([this.lstCtietBcao[index].kphiDtoanNtruoc, item.kphiDtoanNtruoc]);
                    this.lstCtietBcao[index].dtoanDchinhDnghi = sumNumber([this.lstCtietBcao[index].dtoanDchinhDnghi, item.dtoanDchinhDnghi]);
                    this.lstCtietBcao[index].dtoanVuTvqtDnghi = sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                    this.lstCtietBcao[index].dtoanPhiBquanThieu = sumNumber([this.lstCtietBcao[index].dtoanPhiBquanThieu, item.dtoanPhiBquanThieu]);
                }
            })
            stt = this.getHead(stt);
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
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1)) {
                if (item.dtoanDchinhDnghi < 0) {
                    this.tongDieuChinhGiam += Number(item?.dtoanDchinhDnghi);
                } else {
                    this.tongDieuChinhTang += Number(item?.dtoanDchinhDnghi);
                }

                if (item.dtoanVuTvqtDnghi < 0) {
                    this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi);
                } else {
                    this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi);
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
            const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.luongSlBquanTcong = sumNumber([this.editCache[id].data.luongSlBquanTte, this.editCache[id].data.luongSlBquanUocThien]);
        this.editCache[id].data.tongNcauDtoan = mulNumber(this.editCache[id].data.dinhMuc, this.editCache[id].data.luongSlBquanTcong);
        this.editCache[id].data.kphiCong = sumNumber([this.editCache[id].data.kphiDtoanGiaoTnam, this.editCache[id].data.kphiDtoanNtruoc])
        this.editCache[id].data.dtoanDchinhDnghi = this.editCache[id].data.tongNcauDtoan - this.editCache[id].data.kphiCong;
    };

    sortByIndex() {
        if (this.lstCtietBcao?.length > 0 && !this.lstCtietBcao[0].stt) {
            this.setIndex();
        }
        this.setLevel();
        this.lstCtietBcao.sort((item1, item2) => {
            if (item1.level > item2.level) {
                return 1;
            }
            if (item1.level < item2.level) {
                return -1;
            }
            if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
                return -1;
            }
            if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
                return 1;
            }
            return 0;
        });
        const lstTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcao = lstTemp;
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

    sum1() {
        this.lstCtietBcao.forEach(itm => {
            let stt = this.getHead(itm.stt);
            while (stt != '0') {
                const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
                const data = this.lstCtietBcao[index];
                this.lstCtietBcao[index] = {
                    ...new ItemData(),
                    id: data.id,
                    stt: data.stt,
                    matHang: data.matHang,
                    level: data.level,
                    maMatHang: data.maMatHang,
                    maDviTinh: data.maDviTinh,
                    slBquanKh: data.slBquanKh,
                    luongSlBquanTte: data.luongSlBquanTte,
                    luongSlBquanUocThien: data.luongSlBquanUocThien,
                    luongSlBquanTcong: data.luongSlBquanTcong,
                    dinhMuc: data.dinhMuc,
                    maDmuc: data.maDmuc,
                }
                this.lstCtietBcao.forEach(item => {
                    if (this.getHead(item.stt) == stt) {
                        this.lstCtietBcao[index].tongNcauDtoan = sumNumber([this.lstCtietBcao[index].tongNcauDtoan, item.tongNcauDtoan]);
                        this.lstCtietBcao[index].kphiCong = sumNumber([this.lstCtietBcao[index].kphiCong, item.kphiCong]);
                        this.lstCtietBcao[index].kphiDtoanNtruoc = sumNumber([this.lstCtietBcao[index].kphiDtoanNtruoc, item.kphiDtoanNtruoc]);
                        this.lstCtietBcao[index].kphiDtoanGiaoTnam = sumNumber([this.lstCtietBcao[index].kphiDtoanGiaoTnam, item.kphiDtoanGiaoTnam]);
                        this.lstCtietBcao[index].dtoanDchinhDnghi = sumNumber([this.lstCtietBcao[index].dtoanDchinhDnghi, item.dtoanDchinhDnghi]);
                        this.lstCtietBcao[index].dtoanVuTvqtDnghi = sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                        this.lstCtietBcao[index].dtoanPhiBquanThieu = sumNumber([this.lstCtietBcao[index].dtoanPhiBquanThieu, item.dtoanPhiBquanThieu]);
                    }
                })
                stt = this.getHead(stt);
            }
            // this.getTotal();
            this.tinhTong();
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
                this.total.tongNcauDtoan = sumNumber([this.total.tongNcauDtoan, item.tongNcauDtoan]);
                this.total.kphiCong = sumNumber([this.total.kphiCong, item.kphiCong]);
                this.total.kphiDtoanGiaoTnam = sumNumber([this.total.kphiDtoanGiaoTnam, item.kphiDtoanGiaoTnam]);
                this.total.kphiDtoanNtruoc = sumNumber([this.total.kphiDtoanNtruoc, item.kphiDtoanNtruoc]);
                this.total.dtoanDchinhDnghi = sumNumber([this.total.dtoanDchinhDnghi, item.dtoanDchinhDnghi]);
                this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                this.total.dtoanPhiBquanThieu = sumNumber([this.total.dtoanPhiBquanThieu, item.dtoanPhiBquanThieu]);
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

}

