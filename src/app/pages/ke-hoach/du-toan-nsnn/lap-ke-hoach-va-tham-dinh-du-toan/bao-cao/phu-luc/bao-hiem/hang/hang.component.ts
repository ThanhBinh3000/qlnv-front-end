import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, exchangeMoney, getHead, getTail, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";

export class ItemData {
    id: string;
    stt: string;
    maDvi: string;
    tenDvi: string;
    maDiaChiKho: string;
    tenDiaChiKho: string;
    maNhaKho: string;
    tenNhaKho: string;
    khoiTich: number;
    maHang: string;
    tenHang: string;
    soLuong: number;
    giaTri: number;
    unitSpan: number;
    locationSpan: number;
    storehouseSpan: number;
    level: number;
}

@Component({
    selector: 'app-hang',
    templateUrl: './hang.component.html',
    styleUrls: ['../../../bao-cao.component.scss']
})
export class HangComponent implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    //danh muc
    donVi: any;
    soLaMa: any[] = LA_MA;
    lstHang: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    amount = AMOUNT;
    quatity = QUATITY;
    scrollX: string;
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
        private quanLyVonPhiService: QuanLyVonPhiService,
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
        if (this.status) {
            await this.getDmKho();
            const category = await this.danhMucService.danhMucChungGetAll('LTD_BH');
            if (category) {
                category.data.forEach(item => {
                    if (category.data.findIndex(e => getHead(e.ma) == item.ma) == -1) {
                        this.lstHang.push(item);
                    }
                })
                this.lstHang = this.lstHang.filter(e => e.ma != '0.1');
            }
            this.scrollX = (620 + BOX_NUMBER_WIDTH * 4).toString() + 'px';
        } else {
            this.scrollX = (560 + BOX_NUMBER_WIDTH * 4).toString() + 'px';
        }
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        if (this.lstCtietBcao.length == 0) {
            this.donVi?.children.forEach(diaDiem => {
                diaDiem?.children.forEach(kho => {
                    this.lstCtietBcao.push({
                        ...new ItemData(),
                        id: uuid.v4() + 'FE',
                        stt: '0.1',
                        maDvi: this.donVi.maDvi,
                        tenDvi: this.donVi.tenDvi,
                        maDiaChiKho: diaDiem.maDvi,
                        tenDiaChiKho: diaDiem.tenDvi,
                        maNhaKho: kho.maDvi,
                        tenNhaKho: kho.tenDvi,
                    })
                })
            })
        }

        this.sortReport();

        this.getTotal();
        this.updateEditCache();
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

    async getDmKho() {
        const request = {
            maDvi: this.dataInfo.maDvi,
            type: ["MLK", "DV"],
        }
        await this.quanLyVonPhiService.dmKho(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.donVi = res.data[0];
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
    }

    getIndex(stt: string) {
        let xau = '';
        const lst = stt.split('.');
        if (lst?.length == 2) {
            let k = parseInt(lst[1], 10);
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (lst?.length == 3) {
            xau = lst[2];
        }
        return xau;
    }

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
            if (item.giaTri > MONEY_LIMIT) {
                checkMoneyRange = false;
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

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maHang) {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng chọn hàng DTQG');
            return;
        }
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        if (this.lstCtietBcao[index].storehouseSpan) {
            this.lstCtietBcao.forEach(item => {
                if (item.id != id && item.maDvi == this.lstCtietBcao[index].maDvi &&
                    item.maDiaChiKho == this.lstCtietBcao[index].maDiaChiKho && item.maNhaKho == this.lstCtietBcao[index].maNhaKho) {
                    item.khoiTich = this.lstCtietBcao[index].khoiTich;
                }
            })
        }
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    addLine(id: string) {
        const index = this.lstCtietBcao.findIndex(e => e.id === id);
        const item: ItemData = {
            ...this.lstCtietBcao[index],
            id: uuid.v4() + 'FE',
            maHang: null,
            tenHang: null,
            soLuong: null,
            giaTri: null,
        }
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
        this.setRowSpan();
    }

    deleteLine(id: string) {
        const index = this.lstCtietBcao.findIndex(e => e.id == id);
        const count = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[index].maDvi && e.maDiaChiKho == this.lstCtietBcao[index].maDiaChiKho && e.maNhaKho == this.lstCtietBcao[index].maNhaKho)?.length;
        if (count && count > 1) {
            this.lstCtietBcao = this.lstCtietBcao.filter(e => e.id != id);
        } else {
            this.lstCtietBcao[index].khoiTich = null;
            this.lstCtietBcao[index].maHang = null;
            this.lstCtietBcao[index].tenHang = null;
            this.lstCtietBcao[index].soLuong = null;
            this.lstCtietBcao[index].giaTri = null;
        }
        this.getTotal();
        this.setRowSpan();
    }

    sum(stt: string) {
        stt = getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.lstCtietBcao[index].soLuong = null;
            this.lstCtietBcao[index].giaTri = null;
            this.lstCtietBcao.forEach(item => {
                if (getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].soLuong = sumNumber([this.lstCtietBcao[index].soLuong, item.soLuong]);
                    this.lstCtietBcao[index].giaTri = sumNumber([this.lstCtietBcao[index].giaTri, item.giaTri]);
                }
            })
            stt = getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.giaTri = sumNumber([this.total.giaTri, item.giaTri]);
            }
        })
    }

    changeModel(id: string) {
        this.editCache[id].data.tenHang = this.lstHang.find(e => e.ma == this.editCache[id].data.maHang)?.giaTri;
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            item.level = item.stt.split('.')?.length - 2;
        })
    }

    getHead(stt: string) {
        return parseInt(stt.split(".")[1], 10);
    }

    sortReport() {
        this.setLevel();
        this.lstCtietBcao.sort((a, b) => {
            // level nho hon dat len truoc
            if (this.getHead(a.stt) > this.getHead(b.stt)) {
                return 1;
            }
            if (this.getHead(a.stt) < this.getHead(b.stt)) {
                return -1;
            }
            if (a.level > b.level) {
                return 1;
            }
            if (a.level < b.level) {
                return -1;
            }
            //ban ghi co stt nho hon dat len truoc
            if (getTail(a.stt) > getTail(b.stt)) {
                return 1;
            }
            if (getTail(a.stt) < getTail(b.stt)) {
                return -1;
            }
            //ban ghi co ma dia chi nho hon dat len truoc
            if (parseInt(a.maDiaChiKho, 10) > parseInt(b.maDiaChiKho, 10)) {
                return 1;
            }
            if (parseInt(a.maDiaChiKho, 10) < parseInt(b.maDiaChiKho, 10)) {
                return -1;
            }
            //ban ghi co ma nha kho nho hon dat len truoc
            if (parseInt(a.maNhaKho, 10) > parseInt(b.maNhaKho, 10)) {
                return 1;
            }
            if (parseInt(a.maNhaKho, 10) < parseInt(b.maNhaKho, 10)) {
                return -1;
            }
            return 0;
        })
        this.setRowSpan();
    }

    setRowSpan() {
        this.lstCtietBcao.forEach(item => {
            item.unitSpan = null;
            item.locationSpan = null;
            item.storehouseSpan = null;
        })
        for (let i = 0; i < this.lstCtietBcao.length; i++) {
            if (i == 0 || this.lstCtietBcao[i].maDvi != this.lstCtietBcao[i - 1].maDvi) {
                this.lstCtietBcao[i].unitSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi)?.length;
            }
            if (i == 0 || this.lstCtietBcao[i].maDiaChiKho != this.lstCtietBcao[i - 1].maDiaChiKho) {
                this.lstCtietBcao[i].locationSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi && e.maDiaChiKho == this.lstCtietBcao[i].maDiaChiKho)?.length;
            }
            if (i == 0 || this.lstCtietBcao[i].maNhaKho != this.lstCtietBcao[i - 1].maNhaKho) {
                this.lstCtietBcao[i].storehouseSpan = this.lstCtietBcao.filter(e => e.maDvi == this.lstCtietBcao[i].maDvi && e.maDiaChiKho == this.lstCtietBcao[i].maDiaChiKho && e.maNhaKho == this.lstCtietBcao[i].maNhaKho)?.length;
            }
        }
        this.updateEditCache();
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
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
