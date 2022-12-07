import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-04.constant';

export class ItemData {
    id: string;
    khvonphiLapThamDinhCtietId: string;
    header: number;
    stt: string;
    level: number;
    matHang: string;
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
    checked: boolean;
}

export class Details {
    data: ItemData[] = [];
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
    //danh muc
    linhVucChis: any[] = DANH_MUC;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: Details[] = [
        new Details(),
        new Details(),
        new Details(),
        new Details(),
        new Details(),
        new Details(),
        new Details(),
        new Details()
    ];
    donViTiens: any[] = DON_VI_TIEN;
    idPhuLuc = ["0", "1", "2", "3", "4", "5", "6", "7"];
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;
    namHienHanh: number;
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
        console.log(this.lstCtietBcao);

        this.spinner.show();
        this.formDetail = this.dataInfo?.data;
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.namHienHanh = this.dataInfo?.namBcao;
        // this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
        //     this.lstCtietBcao.push({
        //         ...item,
        //     })
        // })

        this.formDetail?.lstCtietBcaos.forEach(item => {
            const id = parseInt(item.header, 10) - 21;
            this.lstCtietBcao[id].data.push({
                ...item,
            })
        })
        // if (this.lstCtietBcao.length == 0) {
        //     this.linhVucChis.forEach(e => {
        //         this.lstCtietBcao.push({
        //             ...new ItemData(),
        //             id: uuid.v4() + 'FE',
        //             stt: e.ma,
        //             matHang: e.ma,
        //         })
        //     })
        // } else if (!this.lstCtietBcao[0]?.stt) {
        //     this.lstCtietBcao.forEach(item => {
        //         item.stt = item.matHang;
        //     })
        // }
        this.idPhuLuc.forEach(id => {
            const idpl = Number(id)
            // this.changeModel(id);
            this.updateEditCache(idpl);
            // this.sortByIndex(id);
            // this.getTotal();
        })
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

    addLine(id: string, idAppendix: number) {
        const item: ItemData = {
            id: uuid.v4(),
            stt: "0",
            header: idAppendix,
            khvonphiLapThamDinhCtietId: "",
            level: 0,
            matHang: "",
            soLuong: 0,
            soLuongTd: 0,
            tongMucDuToan: 0,
            tongMucDuToanTd: 0,
            duToanDaBoTriNamN2: 0,
            duToanNamN1Dmdt: 0,
            duToanNamN1UocTh: 0,
            duToanKhNamNCbDauTu: 0,
            duToanKhNamNThDauTu: 0,
            duToanKhNamNCbDauTuTd: 0,
            duToanKhNamNThDauTuTd: 0,
            duToanNamTiepTheoN1CbDauTu: 0,
            duToanNamTiepTheoN1ThDauTu: 0,
            duToanNamTiepTheoN2CbDauTu: 0,
            duToanNamTiepTheoN2ThDauTu: 0,
            cacNamTiepTheo: 0,
            checked: false,
        };
        const idItem = Number(id)
        this.lstCtietBcao[idAppendix].data.splice(idItem, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
        console.log(this.lstCtietBcao[idAppendix].data);


    }

    deleteLine(id: string, idAppendix: string) {
        const data: ItemData = this.lstCtietBcao[idAppendix].data.find(e => e.id == id); // vi tri hien tai
        this.lstCtietBcao[idAppendix].data = this.lstCtietBcao[idAppendix].data.filter(e => e.id != id);
        this.changeModel(idAppendix);
        const idpl = Number(idAppendix)
        this.updateEditCache(idpl);
    }

    updateChecked(id: string, idAppendix: number) {
        const data = this.lstCtietBcao[idAppendix].data.find(e => e.id == id);
        let check = true;
        this.lstCtietBcao[idAppendix].data.forEach(item => {
            if (item.checked == false) {
                check = false;
            }
        })
        const index = this.lstCtietBcao[idAppendix].data.findIndex(e => (e.matHang == data.matHang));
        this.lstCtietBcao[idAppendix].data[index].checked = check;
    }
    // luu
    async save(trangThai: string) {
        let checkSaveEdit;
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
        // this.lstCtietBcao.forEach(element => {
        //     if (this.editCache[element.id].edit === true) {
        //         checkSaveEdit = false
        //     }
        // });
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        // this.lstCtietBcao.forEach(item => {
        //     // if (item.ncauChiTongSo > MONEY_LIMIT) {
        //     //     checkMoneyRange = false;
        //     //     return;
        //     // }
        //     lstCtietBcaoTemp.push({
        //         ...item,
        //     })
        // })

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
                    this._modalRef.close(this.formDetail);
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
                this._modalRef.close(this.formDetail);
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
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
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

    // gan editCache.data == lstCtietBcao
    updateEditCache(idAppendix: number): void {
        // console.log(this.lstCtietBcao[idAppendix]);
        this.lstCtietBcao[idAppendix].data.forEach(item => {
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
    cancelEdit(id: string, idAppendix: number): void {
        const data = this.lstCtietBcao[idAppendix].data.find(e => e.id == id);
        this.editCache[id] = {
            data: { ...data },
            edit: false
        };
    }

    // luu thay doi
    // saveEdit(id: string): void {
    //     const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    //     Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    //     this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    //     this.sum(this.lstCtietBcao[index].stt);
    //     this.updateEditCache();
    // }

    saveEdit(id: string, idAppendix: string) {
        this.editCache[id].data.checked = this.lstCtietBcao[idAppendix].data.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = this.lstCtietBcao[idAppendix].data.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[idAppendix].data[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        //tinh toan lai trung binh cho vat tu muc cao nhat
        // const maVtu = this.lstCtietBcao[idAppendix].data[index].maVtu;
        // this.setAverageValue(maVtu, idAppendix);
        const idApend = Number(idAppendix)
        this.updateEditCache(idApend);
        this.changeModel(idAppendix);
    }

    // sortByIndex(idAppendix: number) {
    //     // this.setLevel();
    //     this.lstCtietBcao[idAppendix].data.sort((item1, item2) => {
    //         if (item1.maVtu > item2.maVtu) {
    //             return 1;
    //         }
    //         if (item1.maVtu < item2.maVtu) {
    //             return -1;
    //         }
    //         if (item1.maVtuCha > item2.maVtuCha) {
    //             return 1;
    //         } else {
    //             return -1;
    //         }
    //     })
    // }

    // setLevel() {
    //     this.lstCtietBcao.forEach(item => {
    //         const str: string[] = item.matHang.split('.');
    //         item.level = str.length - 2;
    //     })
    // }
    // async changeModel(idAppendix: number) {
    //     this.total[idAppendix] = new ItemData();
    //     this.lstCtietBcao[idAppendix].data.forEach(item => {
    //         if (item.maVtuCha == 0) {
    //             this.total[idAppendix].thTtien = sumNumber([this.total[idAppendix].thTtien, item.thTtien]);
    //         }
    //     })
    //     this.tongDvTc = sumNumber([this.total[0].thTtien, this.total[1].thTtien]);
    // }

    async changeModel(idAppendix: string) {
        this.total[idAppendix] = new ItemData();
        this.lstCtietBcao[idAppendix].data.forEach(item => {

            this.editCache[idAppendix].data.tongMucDuToan = sumNumber([
                this.editCache[idAppendix].data.duToanDaBoTriNamN2,
                this.editCache[idAppendix].data.duToanNamN1Dmdt,
                this.editCache[idAppendix].data.duToanKhNamNCbDauTu,
                this.editCache[idAppendix].data.duToanKhNamNThDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN1CbDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN1ThDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN2CbDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN2ThDauTu,
                this.editCache[idAppendix].data.cacNamTiepTheo,
            ]);
            this.editCache[idAppendix].data.tongMucDuToanTd = sumNumber([
                this.editCache[idAppendix].data.duToanDaBoTriNamN2,
                this.editCache[idAppendix].data.duToanNamN1Dmdt,
                this.editCache[idAppendix].data.duToanKhNamNCbDauTuTd,
                this.editCache[idAppendix].data.duToanKhNamNThDauTuTd,
                this.editCache[idAppendix].data.duToanNamTiepTheoN1CbDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN1ThDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN2CbDauTu,
                this.editCache[idAppendix].data.duToanNamTiepTheoN2ThDauTu,
                this.editCache[idAppendix].data.cacNamTiepTheo,
            ]);

        })

    }

    // sum(stt: string) {
    //     stt = this.getHead(stt);
    //     while (stt != '0') {
    //         const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
    //         const data = this.lstCtietBcao[index];
    //         this.lstCtietBcao[index] = {
    //             ...new ItemData(),
    //             id: data.id,
    //             stt: data.stt,
    //             matHang: data.matHang,
    //             level: data.level,
    //         }
    //         this.lstCtietBcao.forEach(item => {
    //             if (this.getHead(item.stt) == stt) {
    //                 this.lstCtietBcao[index].soLuong = sumNumber([this.lstCtietBcao[index].soLuong, item.soLuong])
    //                 this.lstCtietBcao[index].soLuongTd = sumNumber([this.lstCtietBcao[index].soLuongTd, item.soLuongTd])
    //                 this.lstCtietBcao[index].tongMucDuToan = sumNumber([this.lstCtietBcao[index].tongMucDuToan, item.tongMucDuToan])
    //                 this.lstCtietBcao[index].tongMucDuToanTd = sumNumber([this.lstCtietBcao[index].tongMucDuToanTd, item.tongMucDuToanTd])
    //                 this.lstCtietBcao[index].duToanDaBoTriNamN2 = sumNumber([this.lstCtietBcao[index].duToanDaBoTriNamN2, item.duToanDaBoTriNamN2])
    //                 this.lstCtietBcao[index].duToanNamN1Dmdt = sumNumber([this.lstCtietBcao[index].duToanNamN1Dmdt, item.duToanNamN1Dmdt])
    //                 this.lstCtietBcao[index].duToanNamN1UocTh = sumNumber([this.lstCtietBcao[index].duToanNamN1UocTh, item.duToanNamN1UocTh])
    //                 this.lstCtietBcao[index].duToanKhNamNCbDauTu = sumNumber([this.lstCtietBcao[index].duToanKhNamNCbDauTu, item.duToanKhNamNCbDauTu])
    //                 this.lstCtietBcao[index].duToanKhNamNThDauTu = sumNumber([this.lstCtietBcao[index].duToanKhNamNThDauTu, item.duToanKhNamNThDauTu])
    //                 this.lstCtietBcao[index].duToanKhNamNCbDauTuTd = sumNumber([this.lstCtietBcao[index].duToanKhNamNCbDauTuTd, item.duToanKhNamNCbDauTuTd])
    //                 this.lstCtietBcao[index].duToanKhNamNThDauTuTd = sumNumber([this.lstCtietBcao[index].duToanKhNamNThDauTuTd, item.duToanKhNamNThDauTuTd])
    //                 this.lstCtietBcao[index].duToanNamTiepTheoN1CbDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN1CbDauTu, item.duToanNamTiepTheoN1CbDauTu])
    //                 this.lstCtietBcao[index].duToanNamTiepTheoN1ThDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN1ThDauTu, item.duToanNamTiepTheoN1ThDauTu])
    //                 this.lstCtietBcao[index].duToanNamTiepTheoN2CbDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN2CbDauTu, item.duToanNamTiepTheoN2CbDauTu])
    //                 this.lstCtietBcao[index].duToanNamTiepTheoN2ThDauTu = sumNumber([this.lstCtietBcao[index].duToanNamTiepTheoN2ThDauTu, item.duToanNamTiepTheoN2ThDauTu])
    //                 this.lstCtietBcao[index].cacNamTiepTheo = sumNumber([this.lstCtietBcao[index].cacNamTiepTheo, item.cacNamTiepTheo])
    //             }
    //         })
    //         stt = this.getHead(stt);
    //     }
    //     this.getTotal();
    // }

    // getTotal() {
    //     this.total = new ItemData();
    //     this.lstCtietBcao.forEach(item => {
    //         if (item.level == 0) {
    //             this.total.soLuong = sumNumber([this.total.soLuong, item.soLuong])
    //             this.total.soLuongTd = sumNumber([this.total.soLuongTd, item.soLuongTd])
    //             this.total.tongMucDuToan = sumNumber([this.total.tongMucDuToan, item.tongMucDuToan])
    //             this.total.tongMucDuToanTd = sumNumber([this.total.tongMucDuToanTd, item.tongMucDuToanTd])
    //             this.total.duToanDaBoTriNamN2 = sumNumber([this.total.duToanDaBoTriNamN2, item.duToanDaBoTriNamN2])
    //             this.total.duToanNamN1Dmdt = sumNumber([this.total.duToanNamN1Dmdt, item.duToanNamN1Dmdt])
    //             this.total.duToanNamN1UocTh = sumNumber([this.total.duToanNamN1UocTh, item.duToanNamN1UocTh])
    //             this.total.duToanKhNamNCbDauTu = sumNumber([this.total.duToanKhNamNCbDauTu, item.duToanKhNamNCbDauTu])
    //             this.total.duToanKhNamNThDauTu = sumNumber([this.total.duToanKhNamNThDauTu, item.duToanKhNamNThDauTu])
    //             this.total.duToanKhNamNCbDauTuTd = sumNumber([this.total.duToanKhNamNCbDauTuTd, item.duToanKhNamNCbDauTuTd])
    //             this.total.duToanKhNamNThDauTuTd = sumNumber([this.total.duToanKhNamNThDauTuTd, item.duToanKhNamNThDauTuTd])
    //             this.total.duToanNamTiepTheoN1CbDauTu = sumNumber([this.total.duToanNamTiepTheoN1CbDauTu, item.duToanNamTiepTheoN1CbDauTu])
    //             this.total.duToanNamTiepTheoN1ThDauTu = sumNumber([this.total.duToanNamTiepTheoN1ThDauTu, item.duToanNamTiepTheoN1ThDauTu])
    //             this.total.duToanNamTiepTheoN2CbDauTu = sumNumber([this.total.duToanNamTiepTheoN2CbDauTu, item.duToanNamTiepTheoN2CbDauTu])
    //             this.total.duToanNamTiepTheoN2ThDauTu = sumNumber([this.total.duToanNamTiepTheoN2ThDauTu, item.duToanNamTiepTheoN2ThDauTu])
    //             this.total.cacNamTiepTheo = sumNumber([this.total.cacNamTiepTheo, item.cacNamTiepTheo])
    //         }
    //     })
    // }

    // checkEdit(stt: string) {
    //     const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    //     return lstTemp.every(e => !e.stt.startsWith(stt));
    // }

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

