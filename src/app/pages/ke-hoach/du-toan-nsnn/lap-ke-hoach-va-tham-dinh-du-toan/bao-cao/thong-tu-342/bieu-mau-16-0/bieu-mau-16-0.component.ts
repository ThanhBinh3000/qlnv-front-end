import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, LTD, MONEY_LIMIT, sumNumber, Utils } from "src/app/Utility/utils";
import * as uuid from "uuid";
// import { DANH_MUC } from './bieu-mau-18.constant';

export class ItemData {
    id: string;
    stt: string;
    matHang: string;
    tenDmuc: string;
    maDviTinh: string;
    khSluong: number;
    khTtien: number;
    uocThSluong: number;
    uocThTtien: number;
    tonKho: number;
    tongMucDtru: number;
    namKhSluong: number;
    namKhTtien: number;
    tdinhSluong: number;
    tdinhTtien: number;
    checked: boolean;
    isDelete: false;
}

@Component({
    selector: 'app-bieu-mau-16-0',
    templateUrl: './bieu-mau-16-0.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau160Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    //danh muc
    linhVucChis: any[] = [];

    listVatTu: any[] = [];
    listVatTuFull: any[] = [];

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
    namHienHanh: number;
    namKhoach: number;
    allChecked = false;
    listIdDelete = ""
    checkViewTD: boolean;
    checkEditTD: boolean;
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        public userService: UserService,
        private danhMucService: DanhMucHDVService,
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
        this.status = this.dataInfo?.status;
        this.namHienHanh = Number(this.dataInfo?.namBcao) - 1;
        this.namKhoach = this.dataInfo?.namBcao;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.checkEditTD = this.dataInfo?.editAppraisalValue;
        this.checkViewTD = this.dataInfo?.viewAppraisalValue;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        // if (this.lstCtietBcao.length == 0) {
        //     this.linhVucChis.forEach(e => {
        //         this.lstCtietBcao.push({
        //             ...new ItemData(),
        //             id: uuid.v4() + 'FE',
        //             stt: e.ma,
        //             maLvuc: e.ma,
        //             tenLvuc: e.giaTri,
        //         })
        //     })
        // } else if (!this.lstCtietBcao[0]?.stt) {
        //     this.lstCtietBcao.forEach(item => {
        //         item.stt = item.maLvuc;
        //     })
        // }
        // this.sortByIndex();

        await this.getListVtu()
        await this.addListVatTu()

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    async getListVtu() {
        //lay danh sach vat tu
        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVatTu = res.data;

            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    };

    async addListVatTu() {
        const lstVtuCon1 = []
        const lstVtuCon2 = []

        this.listVatTu.forEach(vtu => {
            vtu?.child.forEach(vtuCon => {
                const maCha = vtuCon?.ma.slice(0, -2)
                lstVtuCon1.push({
                    id: vtuCon.ma,
                    maVtu: vtuCon.ma,
                    tenDm: vtuCon.ten,
                    maDviTinh: vtuCon.maDviTinh,
                    maCha: maCha,
                    level: Number(vtuCon.cap),
                })

                vtuCon?.child.forEach(vtuConn => {
                    const maCha = vtuConn?.ma.slice(0, -2)
                    lstVtuCon2.push({
                        id: vtuConn.ma,
                        maVtu: vtuConn.ma,
                        tenDm: vtuConn.ten,
                        maDviTinh: vtuConn.maDviTinh,
                        maCha: maCha,
                        level: Number(vtuConn.cap),
                    })
                })
            })
        })
        const mangGop12 = lstVtuCon1.concat(lstVtuCon2)
        this.listVatTuFull = this.listVatTuFull.concat(mangGop12)
        this.listVatTuFull.forEach(item => {
            if (item.level.length == 2) {
                item.level = item.level.slice(0, -1)
            }
        })
        this.linhVucChis = this.listVatTuFull;
    }

    changeMatHang(matHang: any, id: any) {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        const donViTinh = this.linhVucChis.find(vtu => vtu.id == matHang)?.maDviTinh;
        this.editCache[id].data.maDviTinh = donViTinh;
        this.lstCtietBcao[index].maDviTinh = donViTinh;
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCtietBcao.every(item => item.checked)) {
            this.allChecked = true;
        }
    }

    deleteById(id: any): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    }

    checkDeleteStatus(item: any) {
        const isSynthetic = item.tongHopTu != "[]";
        return Utils.statusDelete.includes(item.trangThai) &&
            (isSynthetic ? this.userService.isAccessPermisson(LTD.DELETE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.DELETE_REPORT));
    }

    addLine(id: any) {
        const item: ItemData = {
            id: uuid.v4(),
            stt: '',
            matHang: "",
            tenDmuc: "",
            maDviTinh: "",
            khSluong: 0,
            khTtien: 0,
            uocThSluong: 0,
            uocThTtien: 0,
            tonKho: 0,
            tongMucDtru: 0,
            namKhSluong: 0,
            namKhTtien: 0,
            tdinhSluong: 0,
            tdinhTtien: 0,
            checked: false,
            isDelete: false,
        };

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    updateAllChecked(): void {
        if (this.allChecked) {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: false
            }));
        }
    }

    deleteAllChecked() {
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.checked);
        this.allChecked = false;
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
            if (
                item.khTtien > MONEY_LIMIT ||
                item.namKhTtien > MONEY_LIMIT ||
                item.tdinhTtien > MONEY_LIMIT ||
                item.uocThTtien > MONEY_LIMIT
            ) {
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
    // getChiMuc(str: string): string {
    //     str = str.substring(str.indexOf('.') + 1, str.length);
    //     let xau = "";
    //     const chiSo: string[] = str.split('.');
    //     const n: number = chiSo.length - 1;
    //     let k: number = parseInt(chiSo[n], 10);
    //     if (n == 0) {
    //         for (let i = 0; i < this.soLaMa.length; i++) {
    //             while (k >= this.soLaMa[i].gTri) {
    //                 xau += this.soLaMa[i].kyTu;
    //                 k -= this.soLaMa[i].gTri;
    //             }
    //         }
    //     }
    //     if (n == 1) {
    //         xau = chiSo[n];
    //     }
    //     if (n == 2) {
    //         xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    //     }
    //     if (n == 3) {
    //         xau = String.fromCharCode(k + 96);
    //     }
    //     if (n == 4) {
    //         xau = "-";
    //     }
    //     return xau;
    // }
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    // getHead(str: string): string {
    //     return str.substring(0, str.lastIndexOf('.'));
    // }
    // // lấy phần đuôi của stt
    // getTail(str: string): number {
    //     return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    // }

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
        // this.sum(this.lstCtietBcao[index].stt);
        this.lstCtietBcao.forEach(item => {
            const tenDmuc = this.listVatTuFull.find(itm => itm.id == item.matHang)?.tenDm
            item.tenDmuc = tenDmuc
        })
        this.updateEditCache();
    }

    changeModel(id: string): void {
        // this.editCache[id].data.ncauChiChiaRaDtuPtrien = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiMoi1]);
        // this.editCache[id].data.ncauChiChiaRaChiTx = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs2, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
        // this.editCache[id].data.ncauChiTrongDoChiCs = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiCs2]);
        // this.editCache[id].data.ncauChiTrongDoChiMoi = sumNumber([this.editCache[id].data.ncauChiChiaRaChiMoi1, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
        // this.editCache[id].data.ncauChiTongSo = sumNumber([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
    }


    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {

            // this.total.ncauChiTongSo = sumNumber([this.total.ncauChiTongSo, item.ncauChiTongSo]);
            // this.total.ncauChiTrongDoChiCs = sumNumber([this.total.ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
            // this.total.ncauChiTrongDoChiMoi = sumNumber([this.total.ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
            // this.total.ncauChiChiaRaDtuPtrien = sumNumber([this.total.ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
            // this.total.ncauChiChiaRaChiCs1 = sumNumber([this.total.ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
            // this.total.ncauChiChiaRaChiMoi1 = sumNumber([this.total.ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
            // this.total.ncauChiChiaRaChiTx = sumNumber([this.total.ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
            // this.total.ncauChiChiaRaChiCs2 = sumNumber([this.total.ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
            // this.total.ncauChiChiaRaChiMoi2 = sumNumber([this.total.ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);

            this.total.khSluong = sumNumber([this.total.khSluong, item.khSluong])
            this.total.khTtien = sumNumber([this.total.khTtien, item.khTtien])
            this.total.uocThSluong = sumNumber([this.total.uocThSluong, item.uocThSluong])
            this.total.uocThTtien = sumNumber([this.total.uocThTtien, item.uocThTtien])
            this.total.tonKho = sumNumber([this.total.tonKho, item.tonKho])
            this.total.tongMucDtru = sumNumber([this.total.tongMucDtru, item.tongMucDtru])
            this.total.namKhSluong = sumNumber([this.total.namKhSluong, item.namKhSluong])
            this.total.namKhTtien = sumNumber([this.total.namKhTtien, item.namKhTtien])
            this.total.tdinhSluong = sumNumber([this.total.tdinhSluong, item.tdinhSluong])
            this.total.tdinhTtien = sumNumber([this.total.tdinhTtien, item.tdinhTtien])

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

