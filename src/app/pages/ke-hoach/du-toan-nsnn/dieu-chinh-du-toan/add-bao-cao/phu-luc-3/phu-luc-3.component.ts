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
    selector: 'app-phu-luc-3',
    templateUrl: './phu-luc-3.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc3Component implements OnInit {
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
    soLaMa: any[] = LA_MA;
    scrollX: string;
    BOX_NUMBER_WIDTH = 400;
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private danhMucService: DanhMucDungChungService,
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
        await this.getListTaiSan();

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

        if (this.status) {
            this.scrollX = (400 + this.BOX_NUMBER_WIDTH * 8).toString() + 'px';
        } else {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 8).toString() + 'px';
        }
        this.getTotal();
        this.tinhTong();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    async getListTaiSan() {
        const data = await this.danhMucService.danhMucChungGetAll('BC_DC_PL2');
        if (data) {
            data.data.forEach(
                item => {
                    this.lstTaiSans.push({
                        ...item,
                        donViTinh: "cái"
                    })
                }
            )
        }
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

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            this.total.ncauKphi = sumNumber([this.total.ncauKphi, item.ncauKphi]);
            this.total.dtoanKphiNtruoc = sumNumber([this.total.dtoanKphiNtruoc, item.dtoanKphiNtruoc]);
            this.total.dtoanDchinh = sumNumber([this.total.dtoanDchinh, item.dtoanDchinh]);
            this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
            this.total.dtoanKphiDaGiao = sumNumber([this.total.dtoanKphiDaGiao, item.dtoanKphiDaGiao]);
            this.total.dtoanKphiCong = sumNumber([this.total.dtoanKphiCong, item.dtoanKphiCong]);
            this.total.kphiUocThien = sumNumber([this.total.kphiUocThien, item.kphiUocThien]);
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
            if (item.dtoanDchinh > MONEY_LIMIT) {
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
                item.dtoanVuTvqtDnghi = item.dtoanDchinh;
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
        this.tinhTong();
        this.getTotal();
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
        this.editCache[id].data.dtoanDchinh = this.editCache[id].data.ncauKphi - this.editCache[id].data.dtoanKphiCong;
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

    addLine(id: number): void {
        if (this.formDetail?.isSynthetic == true) {

        }
        const item: ItemData = {
            id: uuid.v4(),
            stt: "0",
            checked: false,
            qlnvKhvonphiDchinhCtietId: "",
            level: 0,
            dtoanDchinh: 0,
            dtoanKphiCong: 0,
            dtoanKphiDaGiao: 0,
            dtoanKphiNtruoc: 0,
            dtoanVuTvqtDnghi: 0,
            kphiUocThien: 0,
            loaiKhoan: "340-341",
            maNoiDung: "",
            ncauKphi: 0,
            noiDung: "",
        };

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
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
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }



}

