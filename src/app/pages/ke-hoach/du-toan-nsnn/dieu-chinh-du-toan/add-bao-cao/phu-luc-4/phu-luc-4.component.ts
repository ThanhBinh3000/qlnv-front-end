import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { addChild, addHead, addParent, deleteRow, displayNumber, exchangeMoney, getHead, getName, sortByIndex, sortWithoutIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    noiDung: string;
    keHoachVon: number;
    dtoanDaGiaoLke: number;
    qtoanGtriDtoan: number;
    dtoanDchinhDnghi: number;
    khoachSauDchinh: number;
    dtoanDchinhDnghiLanNay: number;
    dtoanVuTvqtDnghi: number;
    ghiChu: string;
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
    selector: 'app-phu-luc-4',
    templateUrl: './phu-luc-4.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc4Component implements OnInit {
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
    noiDungs: any[] = [];
    total: ItemData = new ItemData();
    soLaMa: any[] = LA_MA;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    scrollX: string;
    BOX_NUMBER_WIDTH = 400
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
        const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL2');
        if (category) {
            category.data.forEach(
                item => {
                    this.noiDungs.push({
                        ...item,
                        level: item.ma?.split('.').length - 2,
                        giaTri: getName(this.namBcao, item.giaTri),
                    })
                }
            )
        }
        this.formDetail?.lstCtietDchinh.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                checked: false
            })
        })

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0]?.stt) {
                this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maNoiDung');
            } else {
                this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
            }
        }

        if (this.status) {
            this.scrollX = (400 + this.BOX_NUMBER_WIDTH * 11).toString() + 'px';
        } else {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 11).toString() + 'px';
        }

        // this.sortByIndex();
        this.getTotal();
        this.tinhTong();
        this.lstCtietBcao.forEach(item => {
            item.noiDung = this.noiDungs.find(e => e.ma == item.maNoiDung)?.giaTri;
        })
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1;
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
                this.total.keHoachVon = sumNumber([this.total.keHoachVon, item.keHoachVon]);
                this.total.dtoanDaGiaoLke = sumNumber([this.total.dtoanDaGiaoLke, item.dtoanDaGiaoLke]);
                this.total.qtoanGtriDtoan = sumNumber([this.total.qtoanGtriDtoan, item.qtoanGtriDtoan]);
                this.total.dtoanDchinhDnghi = sumNumber([this.total.dtoanDchinhDnghi, item.dtoanDchinhDnghi]);
                this.total.khoachSauDchinh = sumNumber([this.total.khoachSauDchinh, item.khoachSauDchinh]);
                this.total.dtoanDchinhDnghiLanNay = sumNumber([this.total.dtoanDchinhDnghiLanNay, item.dtoanDchinhDnghiLanNay]);
                this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
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
            if (item.dtoanDchinhDnghiLanNay > MONEY_LIMIT) {
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
                item.dtoanVuTvqtDnghi = item.dtoanDchinhDnghiLanNay;
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

    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal()
        this.updateEditCache();
    }

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
                noiDung: data.noiDung,
                level: data.level,
                maNoiDung: data.maNoiDung,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].keHoachVon = Number(sumNumber([this.lstCtietBcao[index].keHoachVon, item.keHoachVon]));
                    this.lstCtietBcao[index].dtoanDaGiaoLke = Number(sumNumber([this.lstCtietBcao[index].dtoanDaGiaoLke, item.dtoanDaGiaoLke]));
                    this.lstCtietBcao[index].qtoanGtriDtoan = Number(sumNumber([this.lstCtietBcao[index].qtoanGtriDtoan, item.qtoanGtriDtoan]));
                    this.lstCtietBcao[index].dtoanDchinhDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanDchinhDnghi, item.dtoanDchinhDnghi]));
                    this.lstCtietBcao[index].khoachSauDchinh = Number(sumNumber([this.lstCtietBcao[index].khoachSauDchinh, item.khoachSauDchinh]));
                    this.lstCtietBcao[index].dtoanDchinhDnghiLanNay = Number(sumNumber([this.lstCtietBcao[index].dtoanDchinhDnghiLanNay, item.dtoanDchinhDnghiLanNay]));
                    this.lstCtietBcao[index].dtoanVuTvqtDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]));
                }
            })
            stt = this.getHead(stt);
        }
        this.tinhTong();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }


    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1)) {
                if (item.dtoanDchinhDnghiLanNay < 0) {
                    this.tongDieuChinhGiam += Number(item.dtoanDchinhDnghiLanNay);
                } else {
                    this.tongDieuChinhTang += Number(item.dtoanDchinhDnghiLanNay);
                }

                if (item.dtoanVuTvqtDnghi < 0) {
                    Number(this.dToanVuGiam += Number(item.dtoanVuTvqtDnghi));
                } else {
                    Number(this.dToanVuTang += Number(item.dtoanVuTvqtDnghi));
                }
            }
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.khoachSauDchinh = sumNumber([this.editCache[id].data.keHoachVon, this.editCache[id].data.dtoanDchinhDnghi]);
        this.editCache[id].data.dtoanDchinhDnghiLanNay = Number(this.editCache[id].data.khoachSauDchinh) - Number(this.editCache[id].data.dtoanDaGiaoLke);
    };

    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != 0) {
                this.deleteLine(item);
            }
        })
    }



    getIndex(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            xau = String.fromCharCode(k + 64);
        }
        if (n == 1) {
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (n == 2) {
            xau = chiSo[n];
        }
        if (n == 3) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        }
        if (n == 4) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 5) {
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

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    };


    addLine(id: string) {
        const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maNoiDung;
        const obj = {
            ma: maNdung,
            lstDanhMuc: this.noiDungs,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung ',
            nzContent: DialogChonDanhMucComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maNoiDung == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...new ItemData(),
                        maNoiDung: res.ma,
                        level: this.noiDungs.find(e => e.ma == res.ma)?.level,
                        noiDung: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.lstCtietBcao = addHead(data, this.lstCtietBcao);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNoiDung == res.ma)?.id;
                res.lstDanhMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNoiDung == item.ma) == -1) {
                        const data: ItemData = {
                            ...new ItemData(),
                            maNoiDung: item.ma,
                            level: item.level,
                            noiDung: item.giaTri,
                        };
                        this.addLow(id, data);
                    }
                })
                this.updateEditCache();
            }
        });

    };

    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = addParent(id, initItem, this.lstCtietBcao);
    };


    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcao = addChild(id, initItem, this.lstCtietBcao);
    };

}



