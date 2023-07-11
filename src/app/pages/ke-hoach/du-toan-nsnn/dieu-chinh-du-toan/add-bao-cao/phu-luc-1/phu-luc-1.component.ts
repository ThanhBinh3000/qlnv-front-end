import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { displayNumber, exchangeMoney, getHead, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DANH_MUC_PL10 } from './phu-luc-1.constant';

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    noiDung: string;
    maNoiDung: string;
    dlieuPlucTuongUng: string;
    dtoanKphiNamTruoc: number;
    dtoanKphiNamNay: number;
    tong: number;
    tongDtoanTrongNam: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    tongDchinhTang: number;
    tongDchinhGiam: number;
    tongDchinhTaiDvi: number;
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
    selector: 'app-phu-luc-1',
    templateUrl: './phu-luc-1.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc1Component implements OnInit {
    @Input() dataInfo;
    lstCtietBcao: ItemData[] = [];
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
    allChecked = false;
    editRecommendedValue: boolean;
    viewRecommendedValue: boolean;
    amount = AMOUNT;
    amount1 = AMOUNT1;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    formDetail: any;
    noiDungs: any[] = DANH_MUC_PL10;
    soLaMa: any[] = LA_MA;
    total: ItemData = new ItemData();
    isSynthetic: any;
    scrollX: string;
    BOX_NUMBER_WIDTH = 250;
    constructor(
        private dieuChinhDuToanService: DieuChinhService,
        private _modalRef: NzModalRef,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private modal: NzModalService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

    async initialization() {
        this.spinner.show();
        this.formDetail = this.dataInfo?.data;
        this.isSynthetic = this.dataInfo?.isSynthetic;
        this.namBcao = this.dataInfo?.namBcao;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.viewRecommendedValue = this.dataInfo?.viewRecommendedValue;
        this.editRecommendedValue = this.dataInfo?.editRecommendedValue;
        this.formDetail?.lstCtietDchinh.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNoiDung: e.ma,
                    noiDung: e.giaTri,
                    dtoanDnghiDchinh: 0,
                    dtoanVuTvqtDnghi: 0,
                    tong: 0,
                    dtoanKphiNamNay: 0,
                    dtoanKphiNamTruoc: 0,
                    tongDtoanTrongNam: 0,
                })
            })
        }
        if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
            this.lstCtietBcao = this.lstCtietBcao.filter(e => e.maNoiDung);
            this.dataInfo.extraData.forEach(item => {
                if (this.isSynthetic == true) {
                    if (item.maNdung) {
                        const index = this.lstCtietBcao.findIndex(e => e.maNoiDung == item.maNdung);
                        this.lstCtietBcao[index].dtoanKphiNamTruoc = item?.dtoanKphiNamTruoc ? item?.dtoanKphiNamTruoc : 0;
                        this.lstCtietBcao[index].dtoanKphiNamNay = item?.dtoanKphiNamNay ? item?.dtoanKphiNamNay : 0;
                        this.lstCtietBcao[index].tong = item?.tong ? item?.tong : 0;
                        this.lstCtietBcao[index].tongDtoanTrongNam = item.tongDtoanTrongNam ? item.tongDtoanTrongNam : 0;
                        if (item?.dtoanDnghiDchinh) {
                            this.lstCtietBcao[index].dtoanDnghiDchinh = item?.dtoanDnghiDchinh ? item?.dtoanDnghiDchinh : 0;
                        } else {
                            this.lstCtietBcao[index].dtoanDnghiDchinh = 0;
                        }
                        this.lstCtietBcao[index].dtoanVuTvqtDnghi = item?.dtoanVuTvqtDnghi ? item?.dtoanVuTvqtDnghi : 0;
                    } else {
                        this.lstCtietBcao.push({
                            ...new ItemData(),
                            id: uuid.v4(),
                            stt: item.stt,
                            noiDung: item.noiDung,
                            dtoanKphiNamTruoc: item.dtoanKphiNamTruoc,
                            dtoanKphiNamNay: item.dtoanKphiNamNay,
                            tong: item.tong,
                            tongDtoanTrongNam: item.tongDtoanTrongNam,
                            dtoanDnghiDchinh: item?.dtoanDnghiDchinh,
                            dtoanVuTvqtDnghi: item?.dtoanVuTvqtDnghi,
                        })
                    }
                    this.sum(item.stt);
                } else {
                    if (item.maNdung) {
                        const index = this.lstCtietBcao.findIndex(e => e.maNoiDung == item.maNdung);
                        this.lstCtietBcao[index].dtoanKphiNamTruoc = item?.dtoanKphiNamTruoc ? item?.dtoanKphiNamTruoc : 0;
                        this.lstCtietBcao[index].dtoanKphiNamNay = item?.dtoanKphiNamNay ? item?.dtoanKphiNamNay : 0;
                        this.lstCtietBcao[index].tong = item?.tong ? item?.tong : 0;
                        this.lstCtietBcao[index].tongDtoanTrongNam = item.tongDtoanTrongNam ? item.tongDtoanTrongNam : 0;
                        if (item?.dtoanDnghiDchinh) {
                            this.lstCtietBcao[index].dtoanDnghiDchinh = item?.dtoanDnghiDchinh ? item?.dtoanDnghiDchinh : 0;
                        } else {
                            this.lstCtietBcao[index].dtoanDnghiDchinh = 0;
                        }
                        this.lstCtietBcao[index].dtoanVuTvqtDnghi = item?.dtoanVuTvqtDnghi ? item?.dtoanVuTvqtDnghi : 0;
                    } else {
                        this.lstCtietBcao.push({
                            ...new ItemData(),
                            id: uuid.v4(),
                            stt: item.stt,
                            noiDung: item.noiDung,
                            dtoanKphiNamTruoc: item.dtoanKphiNamTruoc,
                            dtoanKphiNamNay: item.dtoanKphiNamNay,
                            tong: item.tong,
                            tongDtoanTrongNam: item.tongDtoanTrongNam,
                            dtoanDnghiDchinh: item?.dtoanDnghiDchinh,
                            dtoanVuTvqtDnghi: item?.dtoanVuTvqtDnghi,
                        })
                    }
                    this.sum(item.stt);
                }
            })
        }
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);

        if (this.status) {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 7).toString() + 'px';
        } else {
            this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 7).toString() + 'px';
        }

        this.tinhTong();
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
    };

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    };

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    };

    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (var i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        };
        if (n == 1) {
            xau = chiSo[n];
        };
        if (n == 2) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 3) {
            xau = "";
        }
        return xau;
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };


    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    };

    // xoa tat ca cac dong duoc check
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
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1)) {
                if (item?.dtoanDnghiDchinh) {
                    if (item?.dtoanDnghiDchinh < 0) {
                        this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh);
                    } else {
                        this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh);
                    }

                    if (item.dtoanVuTvqtDnghi < 0) {
                        this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi);
                    } else {
                        this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi);
                    }
                }
            }
        })
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
                // ttienTd: data.ttienTd,
                maNoiDung: data.maNoiDung,
                // sluongNamDtoan:data.sluongNamDtoan,
                // ttienNamDtoan: data.ttienNamDtoan,
                // thienNamTruoc: data.thienNamTruoc,
                // dtoanNamHtai: data.dtoanNamHtai,
                // uocNamHtai: data.uocNamHtai,
                // dmucNamDtoan: data.dmucNamDtoan,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].dtoanKphiNamTruoc = sumNumber([this.lstCtietBcao[index].dtoanKphiNamTruoc, item.dtoanKphiNamTruoc]);
                    this.lstCtietBcao[index].dtoanKphiNamNay = sumNumber([this.lstCtietBcao[index].dtoanKphiNamNay, item.dtoanKphiNamNay]);
                    this.lstCtietBcao[index].tong = sumNumber([this.lstCtietBcao[index].tong, item.tong]);
                    // this.lstCtietBcao[index].dtoanDaThien = sumNumber([this.lstCtietBcao[index].dtoanDaThien, item.dtoanDaThien]);
                    // this.lstCtietBcao[index].dtoanUocThien = sumNumber([this.lstCtietBcao[index].dtoanUocThien, item.dtoanUocThien]);
                    this.lstCtietBcao[index].tongDtoanTrongNam = sumNumber([this.lstCtietBcao[index].tongDtoanTrongNam, item.tongDtoanTrongNam]);
                    this.lstCtietBcao[index].dtoanDnghiDchinh = sumNumber([this.lstCtietBcao[index].dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
                    this.lstCtietBcao[index].dtoanVuTvqtDnghi = sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                }
            })
            stt = this.getHead(stt);
        }
        this.getTotal();
        // this.tinhTong();
    };

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.dtoanKphiNamTruoc = sumNumber([this.total.dtoanKphiNamTruoc, item.dtoanKphiNamTruoc]);
                this.total.dtoanKphiNamNay = sumNumber([this.total.dtoanKphiNamNay, item.dtoanKphiNamNay]);
                this.total.tong = sumNumber([this.total.tong, item.tong]);
                // this.total.dtoanDaThien = sumNumber([this.total.dtoanDaThien, item.dtoanDaThien]);
                // this.total.dtoanUocThien = sumNumber([this.total.dtoanUocThien, item.dtoanUocThien]);
                this.total.tongDtoanTrongNam = sumNumber([this.total.tongDtoanTrongNam, item.tongDtoanTrongNam]);
                this.total.dtoanDnghiDchinh = sumNumber([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
                this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
            }
        })
    };

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    };

    changeModel(id: string): void {
        this.editCache[id].data.tong = sumNumber([this.editCache[id].data.dtoanKphiNamTruoc, this.editCache[id].data.dtoanKphiNamNay]);
        // this.editCache[id].data.tongDtoanTrongNam = sumNumber([this.editCache[id].data.dtoanDaThien, this.editCache[id].data.dtoanUocThien]);
        this.editCache[id].data.dtoanDnghiDchinh = this.editCache[id].data.tongDtoanTrongNam - this.editCache[id].data.tong
    };

    startEdit(id: string): void {
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
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
    };

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    };
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
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

}
