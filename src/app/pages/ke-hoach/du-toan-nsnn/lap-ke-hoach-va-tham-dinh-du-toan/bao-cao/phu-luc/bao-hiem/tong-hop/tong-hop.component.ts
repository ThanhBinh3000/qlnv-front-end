import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, exchangeMoney, getHead, getTail, mulNumber, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";

export class UnitItem {
    id: string;
    maDvi: string;
    tenDvi: string;
    slTren: number;
    slDuoi: number;
    slTong: number;
    gtTrenGt: number;
    gtTrenTyLeBh: number;
    gtTrenGtBh: number;
    gtDuoiGt: number;
    gtDuoiTyLeBh: number;
    gtDuoiGtBh: number;
    tong: number;
}

export class ItemData {
    id: string;
    stt: string;
    danhMuc: string;
    tenDanhMuc: string;
    level: number;
    dviTinh: string;

    slTren: number;
    slDuoi: number;
    slTong: number;
    gtTrenGt: number;
    gtTrenTyLeBh: number;
    gtTrenGtBh: number;
    gtDuoiGt: number;
    gtDuoiTyLeBh: number;
    gtDuoiGtBh: number;
    tong: number;
    lstDviCapDuoi: UnitItem[];
}


@Component({
    selector: 'app-tong-hop',
    templateUrl: './tong-hop.component.html',
    styleUrls: ['../../../bao-cao.component.scss']
})
export class TongHopComponent implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    //danh muc
    danhMucs: any[] = [];
    childUnit: any[] = [];
    lstTyLe: any[] = [];
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    scrollX: string;
    BOX_SIZE = 180;
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private danhMucService: DanhMucDungChungService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }


    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();

        this.formDetail = this.dataInfo?.data;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = !this.dataInfo?.status;

        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        if (this.lstCtietBcao.length == 0) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_BH');
            if (category) {
                this.danhMucs = category.data;
            }
            this.danhMucs.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    danhMuc: e.ma,
                    tenDanhMuc: e.giaTri,
                    dviTinh: e.ghiChu,
                    lstDviCapDuoi: [],
                })
            })
        } else {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.danhMuc;
            })
        }

        this.lstCtietBcao[0].lstDviCapDuoi.forEach(item => {
            this.childUnit.push({
                maDvi: item.maDvi,
                tenDvi: item.tenDvi,
            })
        })

        this.scrollX = (450 + (11 + 10 * this.childUnit.length) * this.BOX_SIZE).toString() + 'px';
        //sap xep lai du lieu
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
        this.sortUnit();

        //lay du lieu tu cac bieu mau khac
        if (this.dataInfo?.extraData) {
            this.dataInfo.extraData.forEach(item => {
                const index = this.lstCtietBcao.findIndex(e => e.danhMuc == item.danhMuc);
                if (index != -1) {
                    this.lstCtietBcao[index].slTren = item.slTren;
                    this.lstCtietBcao[index].slDuoi = item.slDuoi;
                    this.lstCtietBcao[index].gtTrenGt = item.gtTrenGt;
                    this.lstCtietBcao[index].gtDuoiGt = item.gtDuoiGt;
                    this.sum(this.lstCtietBcao[index].stt);
                }
            })
        }

        this.getTotal();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            if (item.tong > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            const data: UnitItem[] = [];
            item.lstDviCapDuoi?.forEach(e => {
                data.push({
                    ...e,
                })
            })
            lstCtietBcaoTemp.push({
                ...item,
                lstDviCapDuoi: data,
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
            item.lstDviCapDuoi?.forEach(e => {
                if (e.id?.length == 38) {
                    e.id = null;
                }
            })
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
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
                this.save(mcn, text);
            }
        });
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(stt: string): string {
        let str = stt.substring(stt.indexOf('.') + 1, stt.length);
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
            return xau;
        }
        if (n == 1) {
            return chiSo[n];
        }
        if (this.lstCtietBcao.findIndex(e => getHead(e.danhMuc) == stt) == -1) {
            return null;
        }
        if (n == 2) {
            return chiSo[n - 1].toString() + "." + chiSo[n].toString();
        }
        if (n == 3) {
            return '-';
        }
        return null;
    }

    getIndex(maDvi: string) {
        return this.childUnit.findIndex(e => e.maDvi == maDvi);
    }

    sortUnit() {
        this.lstCtietBcao.forEach(data => {
            data.lstDviCapDuoi.sort((a, b) => {
                if (this.getIndex(a.maDvi) <= this.getIndex(b.maDvi)) {
                    return 1;
                }
                return -1;
            })
        })
    }

    changeModel(): void {
        this.lstCtietBcao.forEach(item => {
            item.slTong = sumNumber([item.slTren, item.slDuoi]);
            item.gtTrenGtBh = mulNumber(item.gtTrenGt, item.gtTrenTyLeBh);
            item.gtDuoiGtBh = mulNumber(item.gtDuoiGt, item.gtDuoiTyLeBh);
            item.tong = sumNumber([item.gtTrenGtBh, item.gtDuoiGtBh]);
        })
    }

    sum(stt: string) {
        stt = getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                danhMuc: data.danhMuc,
                tenDanhMuc: data.tenDanhMuc,
                dviTinh: data.dviTinh,
            }
            this.lstCtietBcao.forEach(item => {
                if (getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].gtTrenGt = sumNumber([this.lstCtietBcao[index].gtTrenGt, item.gtTrenGt]);
                    this.lstCtietBcao[index].gtTrenGtBh = sumNumber([this.lstCtietBcao[index].gtTrenGtBh, item.gtTrenGtBh]);
                    this.lstCtietBcao[index].gtDuoiGt = sumNumber([this.lstCtietBcao[index].gtDuoiGt, item.gtDuoiGt]);
                    this.lstCtietBcao[index].gtDuoiGtBh = sumNumber([this.lstCtietBcao[index].gtDuoiGtBh, item.gtDuoiGtBh]);
                }
            })
            stt = getHead(stt);
        }
        // this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.total.lstDviCapDuoi = [];
        this.childUnit.forEach(item => {
            this.total.lstDviCapDuoi.push({
                ...new UnitItem(),
                maDvi: item.maDvi,
                tenDvi: item.tenDvi,
            })
        })
        this.lstCtietBcao.forEach(item => {
            if (item.stt.split('.')?.length == 2) {
                this.total.gtTrenGt = sumNumber([this.total.gtTrenGt, item.gtTrenGt]);
                this.total.gtTrenGtBh = sumNumber([this.total.gtTrenGtBh, item.gtTrenGtBh]);
                this.total.gtDuoiGt = sumNumber([this.total.gtDuoiGt, item.gtDuoiGt]);
                this.total.gtDuoiGtBh = sumNumber([this.total.gtDuoiGtBh, item.gtDuoiGtBh]);
                for (let i = 0; i < item.lstDviCapDuoi?.length; i++) {
                    this.total.lstDviCapDuoi[i].gtTrenGt = sumNumber([this.total.lstDviCapDuoi[i].gtTrenGt, item.lstDviCapDuoi[i].gtTrenGt]);
                    this.total.lstDviCapDuoi[i].gtTrenGtBh = sumNumber([this.total.lstDviCapDuoi[i].gtTrenGtBh, item.lstDviCapDuoi[i].gtTrenGtBh]);
                    this.total.lstDviCapDuoi[i].gtDuoiGt = sumNumber([this.total.lstDviCapDuoi[i].gtDuoiGt, item.lstDviCapDuoi[i].gtDuoiGt]);
                    this.total.lstDviCapDuoi[i].gtDuoiGtBh = sumNumber([this.total.lstDviCapDuoi[i].gtDuoiGtBh, item.lstDviCapDuoi[i].gtDuoiGtBh]);
                }
            }
        })
    }


    doPrint() {
        const WindowPrt = window.open(
            '',
            '',
            'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        printContent = printContent + '<div>';
        printContent =
            printContent + document.getElementById('tablePrint').innerHTML;
        printContent = printContent + '</div>';
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    }

    displayNumber(num: number): string {
        return displayNumber(num);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    handleCancel() {
        this._modalRef.close();
    }

}
