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

    soLuongA = 0;
    soLuongTdA = 0;
    tongMucDuToanA = 0;
    tongMucDuToanTdA = 0;
    duToanDaBoTriNamN2A = 0;
    duToanNamN1DmdtA = 0;
    duToanNamN1UocThA = 0;
    duToanKhNamNCbDauTuA = 0;
    duToanKhNamNThDauTuA = 0;
    duToanKhNamNCbDauTuTdA = 0;
    duToanKhNamNThDauTuTdA = 0;
    duToanNamTiepTheoN1CbDauTuA = 0;
    duToanNamTiepTheoN1ThDauTuA = 0;
    duToanNamTiepTheoN2CbDauTuA = 0;
    duToanNamTiepTheoN2ThDauTuA = 0;
    cacNamTiepTheoA = 0;

    soLuongB = 0;
    soLuongTdB = 0;
    tongMucDuToanB = 0;
    tongMucDuToanTdB = 0;
    duToanDaBoTriNamN2B = 0;
    duToanNamN1DmdtB = 0;
    duToanNamN1UocThB = 0;
    duToanKhNamNCbDauTuB = 0;
    duToanKhNamNThDauTuB = 0;
    duToanKhNamNCbDauTuTdB = 0;
    duToanKhNamNThDauTuTdB = 0;
    duToanNamTiepTheoN1CbDauTuB = 0;
    duToanNamTiepTheoN1ThDauTuB = 0;
    duToanNamTiepTheoN2CbDauTuB = 0;
    duToanNamTiepTheoN2ThDauTuB = 0;
    cacNamTiepTheoB = 0;

    soLuongAB = 0;
    soLuongTdAB = 0;
    tongMucDuToanAB = 0;
    tongMucDuToanTdAB = 0;
    duToanDaBoTriNamN2AB = 0;
    duToanNamN1DmdtAB = 0;
    duToanNamN1UocThAB = 0;
    duToanKhNamNCbDauTuAB = 0;
    duToanKhNamNThDauTuAB = 0;
    duToanKhNamNCbDauTuTdAB = 0;
    duToanKhNamNThDauTuTdAB = 0;
    duToanNamTiepTheoN1CbDauTuAB = 0;
    duToanNamTiepTheoN1ThDauTuAB = 0;
    duToanNamTiepTheoN2CbDauTuAB = 0;
    duToanNamTiepTheoN2ThDauTuAB = 0;
    cacNamTiepTheoAB = 0;


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
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.idPhuLuc.forEach(id => {
                const idpl = Number(id)
                this.lstCtietBcao[idpl].data.push({
                    ...item,
                })
            })
        })
        this.idPhuLuc.forEach(id => {
            const idpl = Number(id)
            this.changeModel(id);
            this.updateEditCache(idpl);
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
            id: uuid.v4() + 'FE',
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
        this.idPhuLuc.forEach(id => {
            const idpl = Number(id)
            this.lstCtietBcao[idpl].data.forEach(item => {
                if (this.editCache[item.id].edit === true) {
                    checkSaveEdit = false
                }
            })
        })
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        this.idPhuLuc.forEach(id => {
            const idpl = Number(id)
            this.lstCtietBcao[idpl].data.forEach(item => {
                lstCtietBcaoTemp.push({
                    ...item,
                })
            })
        })

        let checkMoneyRange = true;
        lstCtietBcaoTemp.forEach(item => {
            if (item.tongMucDuToan > MONEY_LIMIT || item.tongMucDuToanTd > MONEY_LIMIT
            ) {
                checkMoneyRange = false;
                return;
            }
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

        // const request = JSON.parse(JSON.stringify(this.formDetail));
        console.log(this.formDetail);

        const request = JSON.parse(JSON.stringify(this?.formDetail));
        request.lstCtietLapThamDinhs = JSON.parse(JSON.stringify(lstCtietBcaoTemp));

        request.trangThai = trangThai;
        request.thuyetMinh = this.thuyetMinh;
        console.log(request);


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

    saveEdit(id: string, idAppendix: string) {
        const idApend = Number(idAppendix)
        this.editCache[id].data.checked = this.lstCtietBcao[idApend].data.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = this.lstCtietBcao[idApend].data.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[idApend].data[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache(idApend);
        this.changeModel(idAppendix);
    }

    deleteAllChecked() {
        this.idPhuLuc.forEach(id => {
            const idpl = Number(id);
            this.lstCtietBcao[idpl].data = this.lstCtietBcao[idpl].data.filter(e => e.checked == false);
            this.changeModel(id);
        });
    }

    async changeModel(idAppendix: string) {
        const idAppend = Number(idAppendix);
        this.total[idAppend] = new ItemData();
        this.lstCtietBcao[idAppend].data.forEach(item => {
            this.total[idAppend].soLuong = sumNumber([this.total[idAppend].soLuong, item.soLuong])
            this.total[idAppend].soLuongTd = sumNumber([this.total[idAppend].soLuongTd, item.soLuongTd])
            this.total[idAppend].tongMucDuToan = sumNumber([this.total[idAppend].tongMucDuToan, item.tongMucDuToan])
            this.total[idAppend].tongMucDuToanTd = sumNumber([this.total[idAppend].tongMucDuToanTd, item.tongMucDuToanTd])
            this.total[idAppend].duToanDaBoTriNamN2 = sumNumber([this.total[idAppend].duToanDaBoTriNamN2, item.duToanDaBoTriNamN2])
            this.total[idAppend].duToanNamN1Dmdt = sumNumber([this.total[idAppend].duToanNamN1Dmdt, item.duToanNamN1Dmdt])
            this.total[idAppend].duToanNamN1UocTh = sumNumber([this.total[idAppend].duToanNamN1UocTh, item.duToanNamN1UocTh])
            this.total[idAppend].duToanKhNamNCbDauTu = sumNumber([this.total[idAppend].duToanKhNamNCbDauTu, item.duToanKhNamNCbDauTu])
            this.total[idAppend].duToanKhNamNThDauTu = sumNumber([this.total[idAppend].duToanKhNamNThDauTu, item.duToanKhNamNThDauTu])
            this.total[idAppend].duToanKhNamNCbDauTuTd = sumNumber([this.total[idAppend].duToanKhNamNCbDauTuTd, item.duToanKhNamNCbDauTuTd])
            this.total[idAppend].duToanKhNamNThDauTuTd = sumNumber([this.total[idAppend].duToanKhNamNThDauTuTd, item.duToanKhNamNThDauTuTd])
            this.total[idAppend].duToanNamTiepTheoN1CbDauTu = sumNumber([this.total[idAppend].duToanNamTiepTheoN1CbDauTu, item.duToanNamTiepTheoN1CbDauTu])
            this.total[idAppend].duToanNamTiepTheoN1ThDauTu = sumNumber([this.total[idAppend].duToanNamTiepTheoN1ThDauTu, item.duToanNamTiepTheoN1ThDauTu])
            this.total[idAppend].duToanNamTiepTheoN2CbDauTu = sumNumber([this.total[idAppend].duToanNamTiepTheoN2CbDauTu, item.duToanNamTiepTheoN2CbDauTu])
            this.total[idAppend].duToanNamTiepTheoN2ThDauTu = sumNumber([this.total[idAppend].duToanNamTiepTheoN2ThDauTu, item.duToanNamTiepTheoN2ThDauTu])
            this.total[idAppend].cacNamTiepTheo = sumNumber([this.total[idAppend].cacNamTiepTheo, item.cacNamTiepTheo])
        });

        this.soLuongA = sumNumber([this.total[0].soLuong, this.total[1]?.soLuong, this.total[2]?.soLuong, this.total[3]?.soLuong])
        this.soLuongTdA = sumNumber([this.total[0]?.soLuongTd, this.total[1]?.soLuongTd, this.total[2]?.soLuongTd, this.total[3]?.soLuongTd])
        this.tongMucDuToanA = sumNumber([this.total[0]?.tongMucDuToan, this.total[1]?.tongMucDuToan, this.total[2]?.tongMucDuToan, this.total[3]?.tongMucDuToan])
        this.tongMucDuToanTdA = sumNumber([this.total[0]?.tongMucDuToanTd, this.total[1]?.tongMucDuToanTd, this.total[2]?.tongMucDuToanTd, this.total[3]?.tongMucDuToanTd])
        this.duToanDaBoTriNamN2A = sumNumber([this.total[0]?.duToanDaBoTriNamN2, this.total[1]?.duToanDaBoTriNamN2, this.total[2]?.duToanDaBoTriNamN2, this.total[3]?.duToanDaBoTriNamN2])
        this.duToanNamN1DmdtA = sumNumber([this.total[0]?.duToanNamN1Dmdt, this.total[1]?.duToanNamN1Dmdt, this.total[2]?.duToanNamN1Dmdt, this.total[3]?.duToanNamN1Dmdt])
        this.duToanNamN1UocThA = sumNumber([this.total[0]?.duToanNamN1UocTh, this.total[1]?.duToanNamN1UocTh, this.total[2]?.duToanNamN1UocTh, this.total[3]?.duToanNamN1UocTh])
        this.duToanKhNamNCbDauTuA = sumNumber([this.total[0]?.duToanKhNamNCbDauTu, this.total[1]?.duToanKhNamNCbDauTu, this.total[2]?.duToanKhNamNCbDauTu, this.total[3]?.duToanKhNamNCbDauTu])
        this.duToanKhNamNThDauTuA = sumNumber([this.total[0]?.duToanKhNamNThDauTu, this.total[1]?.duToanKhNamNThDauTu, this.total[2]?.duToanKhNamNThDauTu, this.total[3]?.duToanKhNamNThDauTu])
        this.duToanKhNamNCbDauTuTdA = sumNumber([this.total[0]?.duToanKhNamNCbDauTuTd, this.total[1]?.duToanKhNamNCbDauTuTd, this.total[2]?.duToanKhNamNCbDauTuTd, this.total[3]?.duToanKhNamNCbDauTuTd])
        this.duToanKhNamNThDauTuTdA = sumNumber([this.total[0]?.duToanKhNamNThDauTuTd, this.total[1]?.duToanKhNamNThDauTuTd, this.total[2]?.duToanKhNamNThDauTuTd, this.total[3]?.duToanKhNamNThDauTuTd])
        this.duToanNamTiepTheoN1CbDauTuA = sumNumber([this.total[0]?.duToanNamTiepTheoN1CbDauTu, this.total[1]?.duToanNamTiepTheoN1CbDauTu, this.total[2]?.duToanNamTiepTheoN1CbDauTu, this.total[3]?.duToanNamTiepTheoN1CbDauTu])
        this.duToanNamTiepTheoN1ThDauTuA = sumNumber([this.total[0]?.duToanNamTiepTheoN1ThDauTu, this.total[1]?.duToanNamTiepTheoN1ThDauTu, this.total[2]?.duToanNamTiepTheoN1ThDauTu, this.total[3]?.duToanNamTiepTheoN1ThDauTu])
        this.duToanNamTiepTheoN2CbDauTuA = sumNumber([this.total[0]?.duToanNamTiepTheoN2CbDauTu, this.total[1]?.duToanNamTiepTheoN2CbDauTu, this.total[2]?.duToanNamTiepTheoN2CbDauTu, this.total[3]?.duToanNamTiepTheoN2CbDauTu])
        this.duToanNamTiepTheoN2ThDauTuA = sumNumber([this.total[0]?.duToanNamTiepTheoN2ThDauTu, this.total[1]?.duToanNamTiepTheoN2ThDauTu, this.total[2]?.duToanNamTiepTheoN2ThDauTu, this.total[3]?.duToanNamTiepTheoN2ThDauTu])
        this.cacNamTiepTheoA = sumNumber([this.total[0]?.cacNamTiepTheo, this.total[1]?.cacNamTiepTheo, this.total[2]?.cacNamTiepTheo, this.total[3]?.cacNamTiepTheo])

        this.soLuongB = sumNumber([this.total[4]?.soLuong, this.total[5]?.soLuong, this.total[6]?.soLuong, this.total[7]?.soLuong])
        this.soLuongTdB = sumNumber([this.total[4]?.soLuongTd, this.total[5]?.soLuongTd, this.total[6]?.soLuongTd, this.total[7]?.soLuongTd])
        this.tongMucDuToanB = sumNumber([this.total[4]?.tongMucDuToan, this.total[5]?.tongMucDuToan, this.total[6]?.tongMucDuToan, this.total[7]?.tongMucDuToan])
        this.tongMucDuToanTdB = sumNumber([this.total[4]?.tongMucDuToanTd, this.total[5]?.tongMucDuToanTd, this.total[6]?.tongMucDuToanTd, this.total[7]?.tongMucDuToanTd])
        this.duToanDaBoTriNamN2B = sumNumber([this.total[4]?.duToanDaBoTriNamN2, this.total[5]?.duToanDaBoTriNamN2, this.total[6]?.duToanDaBoTriNamN2, this.total[7]?.duToanDaBoTriNamN2])
        this.duToanNamN1DmdtB = sumNumber([this.total[4]?.duToanNamN1Dmdt, this.total[5]?.duToanNamN1Dmdt, this.total[6]?.duToanNamN1Dmdt, this.total[7]?.duToanNamN1Dmdt])
        this.duToanNamN1UocThB = sumNumber([this.total[4]?.duToanNamN1UocTh, this.total[5]?.duToanNamN1UocTh, this.total[6]?.duToanNamN1UocTh, this.total[7]?.duToanNamN1UocTh])
        this.duToanKhNamNCbDauTuB = sumNumber([this.total[4]?.duToanKhNamNCbDauTu, this.total[5]?.duToanKhNamNCbDauTu, this.total[6]?.duToanKhNamNCbDauTu, this.total[7]?.duToanKhNamNCbDauTu])
        this.duToanKhNamNThDauTuB = sumNumber([this.total[4]?.duToanKhNamNThDauTu, this.total[5]?.duToanKhNamNThDauTu, this.total[6]?.duToanKhNamNThDauTu, this.total[7]?.duToanKhNamNThDauTu])
        this.duToanKhNamNCbDauTuTdB = sumNumber([this.total[4]?.duToanKhNamNCbDauTuTd, this.total[5]?.duToanKhNamNCbDauTuTd, this.total[6]?.duToanKhNamNCbDauTuTd, this.total[7]?.duToanKhNamNCbDauTuTd])
        this.duToanKhNamNThDauTuTdB = sumNumber([this.total[4]?.duToanKhNamNThDauTuTd, this.total[5]?.duToanKhNamNThDauTuTd, this.total[6]?.duToanKhNamNThDauTuTd, this.total[7]?.duToanKhNamNThDauTuTd])
        this.duToanNamTiepTheoN1CbDauTuB = sumNumber([this.total[4]?.duToanNamTiepTheoN1CbDauTu, this.total[5]?.duToanNamTiepTheoN1CbDauTu, this.total[6]?.duToanNamTiepTheoN1CbDauTu, this.total[7]?.duToanNamTiepTheoN1CbDauTu])
        this.duToanNamTiepTheoN1ThDauTuB = sumNumber([this.total[4]?.duToanNamTiepTheoN1ThDauTu, this.total[5]?.duToanNamTiepTheoN1ThDauTu, this.total[6]?.duToanNamTiepTheoN1ThDauTu, this.total[7]?.duToanNamTiepTheoN1ThDauTu])
        this.duToanNamTiepTheoN2CbDauTuB = sumNumber([this.total[4]?.duToanNamTiepTheoN2CbDauTu, this.total[5]?.duToanNamTiepTheoN2CbDauTu, this.total[6]?.duToanNamTiepTheoN2CbDauTu, this.total[7]?.duToanNamTiepTheoN2CbDauTu])
        this.duToanNamTiepTheoN2ThDauTuB = sumNumber([this.total[4]?.duToanNamTiepTheoN2ThDauTu, this.total[5]?.duToanNamTiepTheoN2ThDauTu, this.total[6]?.duToanNamTiepTheoN2ThDauTu, this.total[7]?.duToanNamTiepTheoN2ThDauTu])
        this.cacNamTiepTheoB = sumNumber([this.total[4]?.cacNamTiepTheo, this.total[5]?.cacNamTiepTheo, this.total[6]?.cacNamTiepTheo, this.total[7]?.cacNamTiepTheo])
        // this.tongDvTc = sumNumber([this.total[0].thTtien, this.total[1].thTtien]);

        this.soLuongAB = sumNumber([this.soLuongA, this.soLuongB])
        this.soLuongTdAB = sumNumber([this.soLuongTdA, this.soLuongTdB])
        this.tongMucDuToanAB = sumNumber([this.tongMucDuToanA, this.tongMucDuToanB])
        this.tongMucDuToanTdAB = sumNumber([this.tongMucDuToanTdA, this.tongMucDuToanTdB])
        this.duToanDaBoTriNamN2AB = sumNumber([this.duToanDaBoTriNamN2A, this.duToanDaBoTriNamN2B])
        this.duToanNamN1DmdtAB = sumNumber([this.duToanNamN1DmdtA, this.duToanNamN1DmdtB])
        this.duToanNamN1UocThAB = sumNumber([this.duToanNamN1UocThA, this.duToanNamN1UocThB])
        this.duToanKhNamNCbDauTuAB = sumNumber([this.duToanKhNamNCbDauTuA, this.duToanKhNamNCbDauTuB])
        this.duToanKhNamNThDauTuAB = sumNumber([this.duToanKhNamNThDauTuA, this.duToanKhNamNThDauTuB])
        this.duToanKhNamNCbDauTuTdAB = sumNumber([this.duToanKhNamNCbDauTuTdA, this.duToanKhNamNCbDauTuTdB])
        this.duToanKhNamNThDauTuTdAB = sumNumber([this.duToanKhNamNThDauTuTdA, this.duToanKhNamNThDauTuTdB])
        this.duToanNamTiepTheoN1CbDauTuAB = sumNumber([this.duToanNamTiepTheoN1CbDauTuA, this.duToanNamTiepTheoN1CbDauTuB])
        this.duToanNamTiepTheoN1ThDauTuAB = sumNumber([this.duToanNamTiepTheoN1ThDauTuA, this.duToanNamTiepTheoN1ThDauTuB])
        this.duToanNamTiepTheoN2CbDauTuAB = sumNumber([this.duToanNamTiepTheoN2CbDauTuA, this.duToanNamTiepTheoN2CbDauTuB])
        this.duToanNamTiepTheoN2ThDauTuAB = sumNumber([this.duToanNamTiepTheoN2ThDauTuA, this.duToanNamTiepTheoN2ThDauTuB])
        this.cacNamTiepTheoAB = sumNumber([this.cacNamTiepTheoA, this.cacNamTiepTheoB])

    }

    changeModel01(id: string) {
        //tinh toan tong so
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

