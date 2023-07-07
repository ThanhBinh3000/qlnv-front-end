import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, exchangeMoney, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    bCheNamDuocGiao: number;
    bCheCoMat: number;
    bCheChuaTuyen: number;
    tienLuongBcheCoMat: number;
    cacKhoanDongGop: number;
    luongCBCC: number;
    cacKhoanLuongKhac: number;
    tongNcauTienLuong: number;
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
    selector: 'app-phu-luc-quy-luong',
    templateUrl: './phu-luc-quy-luong.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLucQuyLuongComponent implements OnInit {
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
    userInfo: any;
    formDetail: any;
    maDviTao: any;
    editRecommendedValue: boolean;
    viewRecommendedValue: boolean;
    lstCtietBcao: ItemData[] = [];
    total: ItemData = new ItemData();
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    soLaMa: any[] = LA_MA;
    amount = AMOUNT;
    amount1 = AMOUNT1;
    scrollX: string;

    BOX_NUMBER_WIDTH = 400;

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private giaoDuToanService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

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
        this.formDetail?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            // this.linhVucChis.forEach(e => {
            this.lstCtietBcao.push({
                ...new ItemData(),
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maDvi: this.userInfo.MA_DVI,
                tenDvi: this.userInfo.TEN_DVI,
            })
            // })
            // this.setLevel();
            // this.lstCtietBcao.forEach(item => {
            //   item.tenDanhMuc += this.getName(item.level, item.maDanhMuc);
            // })
        }
        else if (!this.lstCtietBcao[0]?.stt) {
            let sttItem = 1
            this.lstCtietBcao.forEach(item => {
                sttItem += sttItem
                const stt = "0." + sttItem
                item.stt = stt;
            })
        }

        // else if (this.lstCtietBcao.length > 0) {
        //   if (!this.lstCtietBcao[0]?.stt) {
        //     this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maNoiDung');
        //   } else {
        //     this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
        //   }
        // }

        // this.sortByIndex();

        if (this.status) {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 11).toString() + 'px';
        } else {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 11).toString() + 'px';
        }

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            this.total.bCheNamDuocGiao = sumNumber([this.total.bCheNamDuocGiao, item.bCheNamDuocGiao]);
            this.total.bCheCoMat = sumNumber([this.total.bCheCoMat, item.bCheCoMat]);
            this.total.bCheChuaTuyen = sumNumber([this.total.bCheChuaTuyen, item.bCheChuaTuyen]);
            this.total.tienLuongBcheCoMat = sumNumber([this.total.tienLuongBcheCoMat, item.tienLuongBcheCoMat]);
            this.total.cacKhoanDongGop = sumNumber([this.total.cacKhoanDongGop, item.cacKhoanDongGop]);
            this.total.luongCBCC = sumNumber([this.total.luongCBCC, item.luongCBCC]);
            this.total.cacKhoanLuongKhac = sumNumber([this.total.cacKhoanLuongKhac, item.cacKhoanLuongKhac]);
            this.total.tongNcauTienLuong = sumNumber([this.total.tongNcauTienLuong, item.tongNcauTienLuong]);
        })
    };


    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
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
            // xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
            xau = null;
        }
        if (n == 3) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    }

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    };

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
            if (item.bCheChuaTuyen > MONEY_LIMIT) {
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

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
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
    }

    doPrint() {

    };

    handleCancel() {
        this._modalRef.close();
    };

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    changeModel(id: string): void {
        this.editCache[id].data.bCheNamDuocGiao = sumNumber([this.editCache[id].data.bCheCoMat, this.editCache[id].data.bCheChuaTuyen])
        this.editCache[id].data.tongNcauTienLuong = sumNumber([this.editCache[id].data.tienLuongBcheCoMat, this.editCache[id].data.cacKhoanDongGop, this.editCache[id].data.luongCBCC, this.editCache[id].data.cacKhoanLuongKhac])
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal();
    };

    sum(stt: string) {
        // stt = this.getHead(stt);
        // while (stt != '0') {
        //   const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
        //   const data = this.lstCtietBcao[index];
        //   this.lstCtietBcao[index] = {
        //     ...new ItemData(),
        //     id: data.id,
        //     stt: data.stt,
        //     tenDanhMuc: data.tenDanhMuc,
        //     level: data.level,
        //     // ttienTd: data.ttienTd,
        //     danhMuc: data.danhMuc,
        //     // sluongNamDtoan:data.sluongNamDtoan,
        //     // ttienNamDtoan: data.ttienNamDtoan,
        //     // thienNamTruoc: data.thienNamTruoc,
        //     // dtoanNamHtai: data.dtoanNamHtai,
        //     // uocNamHtai: data.uocNamHtai,
        //     // dmucNamDtoan: data.dmucNamDtoan,
        //   }
        //   this.lstCtietBcao.forEach(item => {
        //     if (this.getHead(item.stt) == stt) {
        //       this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, item.ttienNamDtoan]);
        //       this.lstCtietBcao[index].thienNamTruoc = sumNumber([this.lstCtietBcao[index].thienNamTruoc, item.thienNamTruoc]);
        //       this.lstCtietBcao[index].dtoanNamHtai = sumNumber([this.lstCtietBcao[index].dtoanNamHtai, item.dtoanNamHtai]);
        //       this.lstCtietBcao[index].uocNamHtai = sumNumber([this.lstCtietBcao[index].uocNamHtai, item.uocNamHtai]);
        //       // this.lstCtietBcao[index].dmucNamDtoan = sumNumber([this.lstCtietBcao[index].dmucNamDtoan, item.dmucNamDtoan]);
        //       this.lstCtietBcao[index].ttienTd = sumNumber([this.lstCtietBcao[index].ttienTd, item.ttienTd]);
        //     }
        //   })
        //   stt = this.getHead(stt);
        // }
        // // this.getTotal();
        // this.tinhTong();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    };


}


