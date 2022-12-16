import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-04.constant';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    noiDung: string;
    tenNoiDung: string;
    soLuong: number;
    soLuongTd: number;
    tongMucDuToan: number;
    tongMucDuToanTd: number;
    duToanDaBoTriNamN2: number;
    duToanNamN1Dmdt: number;
    duToanNamN1UocTh: number;
    duToanKhNamNCbDauTu: number;
    duToanKhNamNThDauTu: number;
    duToanKhNamNCbDauTuTd: number;
    duToanKhNamNThDauTuTd: number;
    duToanNamTiepTheoN1CbDauTu: number;
    duToanNamTiepTheoN1ThDauTu: number;
    duToanNamTiepTheoN2CbDauTu: number;
    duToanNamTiepTheoN2ThDauTu: number;
    cacNamTiepTheo: number;
}


@Component({
    selector: 'app-phu-luc-04',
    templateUrl: './phu-luc-04.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class PhuLuc04Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    namBcao: number;
    //danh muc
    duAns: any[] = DANH_MUC;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;

    checkViewTD: boolean;
    checkEditTD: boolean;
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
        this.namBcao = this.dataInfo?.namBcao + 1;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.checkViewTD = this.dataInfo?.viewAppraisalValue;
        this.checkEditTD = this.dataInfo?.editAppraisalValue;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        if (this.lstCtietBcao.length == 0) {
            this.duAns.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenNoiDung: e.giaTri,
                    noiDung: e.ma,
                })
            })
            this.setLevel();
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.noiDung;
            })
        }
        this.sortByIndex();
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
            // if (item.ncauChiTongSo > MONEY_LIMIT) {
            //     checkMoneyRange = false;
            //     return;
            // }
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
        // if (n == 0) {
        //     for (let i = 0; i < this.soLaMa.length; i++) {
        //         while (k >= this.soLaMa[i].gTri) {
        //             xau += this.soLaMa[i].kyTu;
        //             k -= this.soLaMa[i].gTri;
        //         }
        //     }
        // }
        if (n == 0) {
            xau = String.fromCharCode(k + 96).toUpperCase();
        }
        // if (n == 1) {
        //     xau = '(' + chiSo[n] + ')';
        // }
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
        // if (n == 3) {
        //     xau = String.fromCharCode(k + 96);
        // }

        // if (n == 4) {
        //     xau = "-";
        // }
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
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
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

    addLine(stt: string) {
        let index = -1;
        for (let i = this.lstCtietBcao.length - 1; i > 0; i--) {
            if (this.lstCtietBcao[i].stt.startsWith(stt)) {
                index = i;
                break;
            }
        }
        const tail = stt == this.lstCtietBcao[index].stt ? '1' : (this.getTail(this.lstCtietBcao[index].stt) + 1).toString();
        const item: ItemData = {
            ... new ItemData(),
            id: uuid.v4() + 'FE',
            stt: stt + '.' + tail,
        }
        const str: string[] = item.stt.split('.');
        item.level = str.length - 2;
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    }


    changeModel(id: string): void {
        this.editCache[id].data.tongMucDuToan = sumNumber([
            this.editCache[id].data.duToanDaBoTriNamN2,
            this.editCache[id].data.duToanNamN1Dmdt,
            this.editCache[id].data.duToanKhNamNCbDauTu,
            this.editCache[id].data.duToanKhNamNThDauTu,
            this.editCache[id].data.duToanNamTiepTheoN1CbDauTu,
            this.editCache[id].data.duToanNamTiepTheoN1ThDauTu,
            this.editCache[id].data.duToanNamTiepTheoN2CbDauTu,
            this.editCache[id].data.duToanNamTiepTheoN2ThDauTu,
            this.editCache[id].data.cacNamTiepTheo,
        ]);
        this.editCache[id].data.tongMucDuToanTd = sumNumber([
            this.editCache[id].data.duToanDaBoTriNamN2,
            this.editCache[id].data.duToanNamN1Dmdt,
            this.editCache[id].data.duToanKhNamNCbDauTuTd,
            this.editCache[id].data.duToanKhNamNThDauTuTd,
            this.editCache[id].data.duToanNamTiepTheoN1CbDauTu,
            this.editCache[id].data.duToanNamTiepTheoN1ThDauTu,
            this.editCache[id].data.duToanNamTiepTheoN2CbDauTu,
            this.editCache[id].data.duToanNamTiepTheoN2ThDauTu,
            this.editCache[id].data.cacNamTiepTheo,
        ]);
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
                noiDung: data.noiDung,
                tenNoiDung: data.tenNoiDung,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].soLuong = sumNumber([this.lstCtietBcao[index].soLuong, item.soLuong]);
                    this.lstCtietBcao[index].soLuongTd = sumNumber([this.lstCtietBcao[index].soLuongTd, item.soLuongTd]);
                    this.lstCtietBcao[index].tongMucDuToan = sumNumber([this.lstCtietBcao[index].tongMucDuToan, item.tongMucDuToan]);
                    this.lstCtietBcao[index].tongMucDuToanTd = sumNumber([this.lstCtietBcao[index].tongMucDuToanTd, item.tongMucDuToanTd]);
                    this.lstCtietBcao[index].duToanDaBoTriNamN2 = sumNumber([this.lstCtietBcao[index].duToanDaBoTriNamN2, item.duToanDaBoTriNamN2]);
                    this.lstCtietBcao[index].duToanNamN1Dmdt = sumNumber([this.lstCtietBcao[index].duToanNamN1Dmdt, item.duToanNamN1Dmdt]);
                    this.lstCtietBcao[index].duToanNamN1UocTh = sumNumber([this.lstCtietBcao[index].duToanNamN1UocTh, item.duToanNamN1UocTh]);
                    this.lstCtietBcao[index].duToanKhNamNCbDauTu = sumNumber([this.lstCtietBcao[index].duToanKhNamNCbDauTu, item.duToanKhNamNCbDauTu]);
                    this.lstCtietBcao[index].duToanKhNamNThDauTu = sumNumber([this.lstCtietBcao[index].duToanKhNamNThDauTu, item.duToanKhNamNThDauTu]);
                    this.lstCtietBcao[index].duToanKhNamNCbDauTuTd = sumNumber([this.lstCtietBcao[index].duToanKhNamNCbDauTuTd, item.duToanKhNamNCbDauTuTd]);
                    this.lstCtietBcao[index].duToanKhNamNThDauTuTd = sumNumber([this.lstCtietBcao[index].duToanKhNamNThDauTuTd, item.duToanKhNamNThDauTuTd]);
                    this.lstCtietBcao[index].duToanNamTiepTheoN1CbDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN1CbDauTu, item.duToanNamTiepTheoN1CbDauTu]);
                    this.lstCtietBcao[index].duToanNamTiepTheoN1ThDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN1ThDauTu, item.duToanNamTiepTheoN1ThDauTu]);
                    this.lstCtietBcao[index].duToanNamTiepTheoN2CbDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN2CbDauTu, item.duToanNamTiepTheoN2CbDauTu]);
                    this.lstCtietBcao[index].duToanNamTiepTheoN2ThDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN2ThDauTu, item.duToanNamTiepTheoN2ThDauTu]);
                    this.lstCtietBcao[index].cacNamTiepTheo = sumNumber([this.lstCtietBcao[index].cacNamTiepTheo, item.cacNamTiepTheo]);
                }
            })
            stt = this.getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.soLuong = sumNumber([this.total.soLuong, item.soLuong]);
                this.total.soLuongTd = sumNumber([this.total.soLuongTd, item.soLuongTd]);
                this.total.tongMucDuToan = sumNumber([this.total.tongMucDuToan, item.tongMucDuToan]);
                this.total.tongMucDuToanTd = sumNumber([this.total.tongMucDuToanTd, item.tongMucDuToanTd]);
                this.total.duToanDaBoTriNamN2 = sumNumber([this.total.duToanDaBoTriNamN2, item.duToanDaBoTriNamN2]);
                this.total.duToanNamN1Dmdt = sumNumber([this.total.duToanNamN1Dmdt, item.duToanNamN1Dmdt]);
                this.total.duToanNamN1UocTh = sumNumber([this.total.duToanNamN1UocTh, item.duToanNamN1UocTh]);
                this.total.duToanKhNamNCbDauTu = sumNumber([this.total.duToanKhNamNCbDauTu, item.duToanKhNamNCbDauTu]);
                this.total.duToanKhNamNThDauTu = sumNumber([this.total.duToanKhNamNThDauTu, item.duToanKhNamNThDauTu]);
                this.total.duToanKhNamNCbDauTuTd = sumNumber([this.total.duToanKhNamNCbDauTuTd, item.duToanKhNamNCbDauTuTd]);
                this.total.duToanKhNamNThDauTuTd = sumNumber([this.total.duToanKhNamNThDauTuTd, item.duToanKhNamNThDauTuTd]);
                this.total.duToanNamTiepTheoN1CbDauTu = sumNumber([this.total.duToanNamTiepTheoN1CbDauTu, item.duToanNamTiepTheoN1CbDauTu]);
                this.total.duToanNamTiepTheoN1ThDauTu = sumNumber([this.total.duToanNamTiepTheoN1ThDauTu, item.duToanNamTiepTheoN1ThDauTu]);
                this.total.duToanNamTiepTheoN2CbDauTu = sumNumber([this.total.duToanNamTiepTheoN2CbDauTu, item.duToanNamTiepTheoN2CbDauTu]);
                this.total.duToanNamTiepTheoN2ThDauTu = sumNumber([this.total.duToanNamTiepTheoN2ThDauTu, item.duToanNamTiepTheoN2ThDauTu]);
                this.total.cacNamTiepTheo = sumNumber([this.total.cacNamTiepTheo, item.cacNamTiepTheo]);
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    checkAdd(data: ItemData) {
        if (data.stt == '0.3' || (data.level == 1 && data.noiDung)) {
            return true;
        }
        return false;
    }
    checkDelete(maDa: string) {
        if (!maDa) {
            return true;
        }
        return false;
    }

    //xóa dòng
    deleteLine(stt: string) {
        const head = this.getHead(stt);
        const tail = this.getTail(stt);
        this.lstCtietBcao = this.lstCtietBcao.filter(e => e.stt !== stt);
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(head) && item.stt != head && this.getTail(item.stt) > tail) {
                item.stt = head + '.' + (this.getTail(item.stt) - 1).toString();
            }
        })
        this.sum(stt);
        this.updateEditCache();
    }

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
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
