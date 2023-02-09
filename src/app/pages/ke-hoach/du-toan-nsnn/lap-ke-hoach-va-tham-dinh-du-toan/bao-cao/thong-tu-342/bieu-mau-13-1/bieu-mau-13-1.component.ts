import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import { DANH_MUC } from '../../thong-tu-342/bieu-mau-13-1/bieu-mau-13-1.constant';
import * as uuid from "uuid";
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { displayNumber, exchangeMoney, getHead, sortByIndex, sumNumber } from 'src/app/Utility/func';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    maNdung: string;
    tenDmuc: string;
    maDviTinh: string;
    thienNtruoc: number;
    namDtoan: number;
    namUocThien: number;
    namKh: number;
    giaTriThamDinh: number;
}
@Component({
    selector: 'app-bieu-mau-13-1',
    templateUrl: './bieu-mau-13-1.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau131Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    namBcao: number;
    //danh muc
    chiTieus: any[] = DANH_MUC;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    viewAppraisalValue: boolean;
    editAppraisalValue: boolean;
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
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.viewAppraisalValue = this.dataInfo?.viewAppraisalValue;
        this.editAppraisalValue = this.dataInfo?.editAppraisalValue;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        if (this.lstCtietBcao.length == 0) {
            this.chiTieus.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    maNdung: e.ma,
                    tenDmuc: e.giaTri,
                })
            })
        }

        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);

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
            if (item.thienNtruoc > MONEY_LIMIT || item.namDtoan > MONEY_LIMIT || item.namUocThien > MONEY_LIMIT || item.namKh > MONEY_LIMIT || item.giaTriThamDinh > MONEY_LIMIT) {
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
                item.giaTriThamDinh = item.namKh;
            })
        }

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
                this.formDetail.lyDoTuChoi = text;

                this.save(mcn, text);
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
        // if (n == 2) {
        //     xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        // }
        if (n == 2) {
            xau = "";
            // xau = String.fromCharCode(k + 96);
        }
        // if (n == 4) {
        //     xau = "-";
        // }
        return xau;
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

    sum(stt: string) {
        stt = getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                tenDmuc: data.tenDmuc,
                maNdung: data.maNdung,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].thienNtruoc = sumNumber([this.lstCtietBcao[index].thienNtruoc, item.thienNtruoc]);
                    this.lstCtietBcao[index].namDtoan = sumNumber([this.lstCtietBcao[index].namDtoan, item.namDtoan]);
                    this.lstCtietBcao[index].namUocThien = sumNumber([this.lstCtietBcao[index].namUocThien, item.namUocThien]);
                    this.lstCtietBcao[index].namKh = sumNumber([this.lstCtietBcao[index].namKh, item.namKh]);
                    this.lstCtietBcao[index].giaTriThamDinh = sumNumber([this.lstCtietBcao[index].giaTriThamDinh, item.giaTriThamDinh]);
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
                this.total.thienNtruoc = sumNumber([this.total.thienNtruoc, item.thienNtruoc]);
                this.total.namDtoan = sumNumber([this.total.namDtoan, item.namDtoan]);
                this.total.namUocThien = sumNumber([this.total.namUocThien, item.namUocThien]);
                this.total.namKh = sumNumber([this.total.namKh, item.namKh]);
                this.total.giaTriThamDinh = sumNumber([this.total.giaTriThamDinh, item.giaTriThamDinh]);
            }
        })
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
