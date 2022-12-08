import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC } from './bieu-mau-13.constant';

export class ItemData {
    id!: string;
    stt!: string;
    level: number;
    maNdung!: string;
    namHienHanhDtoan!: number;
    namHienHanhUocThien!: number;
    tranChiN!: number;
    ncauChiN!: number;
    clechTranChiVsNcauChiN: number;
    ssanhNcauNVoiN1: number;
    tranChiN1!: number;
    ncauChiN1!: number;
    clechTranChiVsNcauChiN1: number;
    tranChiN2!: number;
    ncauChiN2!: number;
    clechTranChiVsNcauChiN2: number;
}


@Component({
    selector: 'app-bieu-mau-13',
    templateUrl: './bieu-mau-13.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau13Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    thuyetMinh: string;
    //danh muc
    noiDungs: any[] = DANH_MUC;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
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
        this.namBcao = this.dataInfo?.namBcao;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
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
                    maNdung: e.ma,
                })
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNdung;
            })
        }
        this.sortByIndex();
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

    // luu
    async save(trangThai: string) {
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
            if (item.namHienHanhDtoan > MONEY_LIMIT || item.namHienHanhUocThien > MONEY_LIMIT ||
                item.tranChiN > MONEY_LIMIT || item.ncauChiN > MONEY_LIMIT || item.clechTranChiVsNcauChiN > MONEY_LIMIT ||
                item.tranChiN1 > MONEY_LIMIT || item.ncauChiN1 > MONEY_LIMIT || item.clechTranChiVsNcauChiN1 > MONEY_LIMIT ||
                item.tranChiN2 > MONEY_LIMIT || item.ncauChiN2 > MONEY_LIMIT || item.clechTranChiVsNcauChiN2 > MONEY_LIMIT) {
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
        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

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

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.formDetail?.id) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
            return;
        }
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.formDetail.trangThai = mcn;
                this.getStatusButton();
                if (mcn == "0") {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    formDetail: this.formDetail,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
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
                this.onSubmit(mcn, text);
            }
        });
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    sortByIndex() {
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
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }


    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN = sumNumber([this.editCache[id].data.tranChiN, -this.editCache[id].data.ncauChiN]);
        this.editCache[id].data.ssanhNcauNVoiN1 = divNumber(this.editCache[id].data.ncauChiN, this.editCache[id].data.namHienHanhUocThien);
        this.editCache[id].data.clechTranChiVsNcauChiN1 = sumNumber([this.editCache[id].data.tranChiN1, -this.editCache[id].data.ncauChiN1]);
        this.editCache[id].data.clechTranChiVsNcauChiN2 = sumNumber([this.editCache[id].data.tranChiN2, -this.editCache[id].data.ncauChiN2]);
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
                maNdung: data.maNdung,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].namHienHanhDtoan = sumNumber([this.lstCtietBcao[index].namHienHanhDtoan, item.namHienHanhDtoan]);
                    this.lstCtietBcao[index].namHienHanhUocThien = sumNumber([this.lstCtietBcao[index].namHienHanhUocThien, item.namHienHanhUocThien]);
                    this.lstCtietBcao[index].tranChiN = sumNumber([this.lstCtietBcao[index].tranChiN, item.tranChiN]);
                    this.lstCtietBcao[index].ncauChiN = sumNumber([this.lstCtietBcao[index].ncauChiN, item.ncauChiN]);
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN = sumNumber([this.lstCtietBcao[index].clechTranChiVsNcauChiN, item.clechTranChiVsNcauChiN]);
                    this.lstCtietBcao[index].tranChiN1 = sumNumber([this.lstCtietBcao[index].tranChiN1, item.tranChiN1]);
                    this.lstCtietBcao[index].ncauChiN1 = sumNumber([this.lstCtietBcao[index].ncauChiN1, item.ncauChiN1]);
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN1 = sumNumber([this.lstCtietBcao[index].clechTranChiVsNcauChiN1, item.clechTranChiVsNcauChiN1]);
                    this.lstCtietBcao[index].tranChiN2 = sumNumber([this.lstCtietBcao[index].tranChiN2, item.tranChiN2]);
                    this.lstCtietBcao[index].ncauChiN2 = sumNumber([this.lstCtietBcao[index].ncauChiN2, item.ncauChiN2]);
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN2 = sumNumber([this.lstCtietBcao[index].clechTranChiVsNcauChiN2, item.clechTranChiVsNcauChiN2]);
                }
            })
            this.lstCtietBcao[index].ssanhNcauNVoiN1 = divNumber(this.lstCtietBcao[index].ncauChiN, this.lstCtietBcao[index].namHienHanhUocThien);
            stt = this.getHead(stt);
        }
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
