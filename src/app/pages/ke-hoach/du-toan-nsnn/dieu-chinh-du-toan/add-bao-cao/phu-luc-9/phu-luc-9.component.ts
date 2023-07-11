import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
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
    baoGomLuongDhoaChung: number;
    dtoanKphiDtoanNtruoc: number;
    dtoanKphiDaGiao: number;
    dtoanKphiCong: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
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
    selector: 'app-phu-luc-9',
    templateUrl: './phu-luc-9.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc9Component implements OnInit {
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
        private dieuChinhDuToanService: DieuChinhService,
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
        this.formDetail?.lstCtietDchinh.forEach(item => {
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
                dtoanDnghiDchinh: 0,
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
        this.tinhTong();
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
            this.total.bcheGiao2021 = sumNumber([this.total.bcheGiao2021, item.bcheGiao2021]);
            this.total.bcheCoMat = sumNumber([this.total.bcheCoMat, item.bcheCoMat]);
            this.total.bcheChuaTuyen = sumNumber([this.total.bcheChuaTuyen, item.bcheChuaTuyen]);
            this.total.hslPcapTso = sumNumber([this.total.hslPcapTso, item.hslPcapTso]);
            this.total.hslPcapHsl = sumNumber([this.total.hslPcapHsl, item.hslPcapHsl]);
            this.total.hslPcapTong = sumNumber([this.total.hslPcapTong, item.hslPcapTong]);
            this.total.hslPcapChucVu = sumNumber([this.total.hslPcapChucVu, item.hslPcapChucVu]);
            this.total.hslPcapTnhiem = sumNumber([this.total.hslPcapTnhiem, item.hslPcapTnhiem]);
            this.total.hslPcapTnienVkhung = sumNumber([this.total.hslPcapTnienVkhung, item.hslPcapTnienVkhung]);
            this.total.hslPcapHsbl = sumNumber([this.total.hslPcapHsbl, item.hslPcapHsbl]);
            this.total.hslPcapCongVu = sumNumber([this.total.hslPcapCongVu, item.hslPcapCongVu]);
            this.total.hslPcapTnien = sumNumber([this.total.hslPcapTnien, item.hslPcapTnien]);
            this.total.hslPcapUdai = sumNumber([this.total.hslPcapUdai, item.hslPcapUdai]);
            this.total.hslPcapKvuc = sumNumber([this.total.hslPcapKvuc, item.hslPcapKvuc]);
            this.total.hslPcapKhac = sumNumber([this.total.hslPcapKhac, item.hslPcapKhac]);
            this.total.tqtlPcapTso = sumNumber([this.total.tqtlPcapTso, item.tqtlPcapTso]);
            this.total.tqtlPcapTluong = sumNumber([this.total.tqtlPcapTluong, item.tqtlPcapTluong]);
            this.total.tqtlPcapTong = sumNumber([this.total.tqtlPcapTong, item.tqtlPcapTong]);
            this.total.tqtlPcapChucVu = sumNumber([this.total.tqtlPcapChucVu, item.tqtlPcapChucVu]);
            this.total.tqtlPcapTniem = sumNumber([this.total.tqtlPcapTniem, item.tqtlPcapTniem]);
            this.total.tqtlPcapTnienVkhung = sumNumber([this.total.tqtlPcapTnienVkhung, item.tqtlPcapTnienVkhung]);
            this.total.tqtlPcapHsbl = sumNumber([this.total.tqtlPcapHsbl, item.tqtlPcapHsbl]);
            this.total.tqtlPcapCongVu = sumNumber([this.total.tqtlPcapCongVu, item.tqtlPcapCongVu]);
            this.total.tqtlPcapTnien = sumNumber([this.total.tqtlPcapTnien, item.tqtlPcapTnien]);
            this.total.tqtlPcapUdai = sumNumber([this.total.tqtlPcapUdai, item.tqtlPcapUdai]);
            this.total.tqtlPcapKvuc = sumNumber([this.total.tqtlPcapKvuc, item.tqtlPcapKvuc]);
            this.total.tqtlPcapKhac = sumNumber([this.total.tqtlPcapKhac, item.tqtlPcapKhac]);
            this.total.tongNcauTluong = sumNumber([this.total.tongNcauTluong, item.tongNcauTluong]);
            this.total.baoGomTluongBche = sumNumber([this.total.baoGomTluongBche, item.baoGomTluongBche]);
            this.total.baoGomKhoanDgop = sumNumber([this.total.baoGomKhoanDgop, item.baoGomKhoanDgop]);
            this.total.baoGomLuongCbcc = sumNumber([this.total.baoGomLuongCbcc, item.baoGomLuongCbcc]);
            this.total.baoGomLuongDhoaChung = sumNumber([this.total.baoGomLuongDhoaChung, item.baoGomLuongDhoaChung]);
            this.total.dtoanKphiDtoanNtruoc = sumNumber([this.total.dtoanKphiDtoanNtruoc, item.dtoanKphiDtoanNtruoc]);
            this.total.dtoanKphiDaGiao = sumNumber([this.total.dtoanKphiDaGiao, item.dtoanKphiDaGiao]);
            this.total.dtoanKphiCong = sumNumber([this.total.dtoanKphiCong, item.dtoanKphiCong]);
            this.total.dtoanDnghiDchinh = sumNumber([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
            this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
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
        this.editCache[id].data.bcheGiao2021 = sumNumber([this.editCache[id].data.bcheCoMat, this.editCache[id].data.bcheChuaTuyen]);
        this.editCache[id].data.hslPcapTong = sumNumber([
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
        this.editCache[id].data.hslPcapTso = sumNumber([this.editCache[id].data.hslPcapHsl, this.editCache[id].data.hslPcapTong]);
        this.editCache[id].data.tqtlPcapTong = sumNumber([
            // this.editCache[id].data.tqtlPcapTluong,
            // this.editCache[id].data.tqtlPcapTong,
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
        this.editCache[id].data.tqtlPcapTso = sumNumber([this.editCache[id].data.tqtlPcapTong, this.editCache[id].data.tqtlPcapTluong]);
        this.editCache[id].data.tongNcauTluong = sumNumber([
            this.editCache[id].data.baoGomTluongBche,
            this.editCache[id].data.baoGomKhoanDgop,
            this.editCache[id].data.baoGomLuongCbcc,
            this.editCache[id].data.baoGomLuongDhoaChung,
        ])
        this.editCache[id].data.dtoanKphiCong = sumNumber([
            this.editCache[id].data.dtoanKphiDtoanNtruoc,
            this.editCache[id].data.dtoanKphiDaGiao
        ])
        this.editCache[id].data.dtoanDnghiDchinh = this.editCache[id].data.tongNcauTluong - this.editCache[id].data.dtoanKphiCong
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
        this.tinhTong();
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
        this.tinhTong();
    };


}

