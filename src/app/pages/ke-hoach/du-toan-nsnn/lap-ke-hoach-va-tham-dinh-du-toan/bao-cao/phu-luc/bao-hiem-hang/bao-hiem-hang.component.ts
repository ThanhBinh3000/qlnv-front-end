import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
// import { DANH_MUC } from './bieu-mau-18.constant';

export class ItemData {
    id: string;
    khvonphiLapThamDinhCtietId: string;
    stt: string;
    maKho: string;
    tenNhaKho: string;
    khoiTich: number;
    tenHang: string;
    soLuong: number;
    giaTri: number;
    checked: boolean;
}


@Component({
    selector: 'app-bao-hiem-hang',
    templateUrl: './bao-hiem-hang.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BaoHiemHangComponent implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    //danh muc
    linhVucChis: any[] = [];
    listDanhMucKho: any[] = [];
    listDiemKho: any[] = [];
    listKho: any[] = [];
    listKhoFull: any[] = [];
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
    listIdDelete = "";
    allChecked = false;
    maDviTao!: any;
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
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
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.maDviTao = this.dataInfo?.maDvi;
        await this.getDmKho();
        console.log(this.listDanhMucKho);
        await this.addListKho();
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
        //         })
        //     })
        // } else if (!this.lstCtietBcao[0]?.stt) {
        //     this.lstCtietBcao.forEach(item => {
        //         item.stt = item.maLvuc;
        //     })
        // }
        // this.sortByIndex();
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    addListKho() {

        this.listDanhMucKho.forEach(itm => {
            itm.children.forEach(item => {
                this.listDiemKho.push({
                    ...item,
                    id: `${item.id}`
                })
            })
        })
        console.log(this.listDiemKho);
        this.listDiemKho.forEach(item => {
        })

    }

    changeDiemKho(maKho: any, id: any) {
        // const maKhoNum = Number(maKho)
        // const nhaKho = this.listDiemKho.find(itm => itm.id == maKhoNum).children;
        // this.listKho = []
        // // this.lstCtietBcao[index].tenNhaKho = null
        // // this.editCache[id].data.tenNhaKho = null
        // nhaKho.forEach(itemChild => {
        //     this.listKho.push(
        //         {
        //             id: `${itemChild.id}`,
        //             tenDviKho: itemChild.tenDvi,
        //         }
        //     )
        // })

        // for (let i = 0; i < nhaKho.length; i++) {
        //     let index = this.listKhoFull.findIndex(item => item.maDvi == nhaKho[i].maDvi)
        //     if (index == -1 || this.listKhoFull.length == 0) {
        //         this.listKhoFull.push({
        //             ...nhaKho[i],
        //             id: `${nhaKho[i].id}`,
        //         });
        //     }
        // }

        const maKhoNum = Number(maKho)
        const nhaKho = this.listDiemKho.find(itm => itm.id == maKhoNum).children;

        nhaKho.forEach(itemChild => {
            itemChild.id = `${itemChild.id}`
        })
        console.log(nhaKho);
        this.listKho = nhaKho

    };

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
        this.getTotal()
    }

    deleteLine(id: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id);
        const nho: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        // this.replaceIndex(lstIndex, -1);
        this.updateEditCache();
    }

    async getDmKho() {
        await this.quanLyVonPhiService.dmKho(this.maDviTao).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listDanhMucKho = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
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

    // sortByIndex() {
    //     this.setLevel();
    //     this.lstCtietBcao.sort((item1, item2) => {
    //         if (item1.level > item2.level) {
    //             return 1;
    //         }
    //         if (item1.level < item2.level) {
    //             return -1;
    //         }
    //         if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
    //             return -1;
    //         }
    //         if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
    //             return 1;
    //         }
    //         return 0;
    //     });
    //     const lstTemp: ItemData[] = [];
    //     this.lstCtietBcao.forEach(item => {
    //         const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
    //         if (index == -1) {
    //             lstTemp.splice(0, 0, item);
    //         } else {
    //             lstTemp.splice(index + 1, 0, item);
    //         }
    //     })

    //     this.lstCtietBcao = lstTemp;
    // }

    // setLevel() {
    //     this.lstCtietBcao.forEach(item => {
    //         const str: string[] = item.maLvuc.split('.');
    //         item.level = str.length - 2;
    //     })
    // }


    changeModel(id: string): void {
        // this.editCache[id].data.ncauChiChiaRaDtuPtrien = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiMoi1]);
        // this.editCache[id].data.ncauChiChiaRaChiTx = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs2, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
        // this.editCache[id].data.ncauChiTrongDoChiCs = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiCs2]);
        // this.editCache[id].data.ncauChiTrongDoChiMoi = sumNumber([this.editCache[id].data.ncauChiChiaRaChiMoi1, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
        // this.editCache[id].data.ncauChiTongSo = sumNumber([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
    }

    sum(stt: string) {
        // stt = this.getHead(stt);
        // while (stt != '0') {
        //     const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
        //     const data = this.lstCtietBcao[index];
        //     this.lstCtietBcao[index] = {
        //         ...new ItemData(),
        //         id: data.id,
        //         stt: data.stt,
        //         maLvuc: data.maLvuc,
        //         level: data.level,
        //     }
        //     this.lstCtietBcao.forEach(item => {
        //         if (this.getHead(item.stt) == stt) {
        //             this.lstCtietBcao[index].ncauChiTongSo = sumNumber([this.lstCtietBcao[index].ncauChiTongSo, item.ncauChiTongSo]);
        //             this.lstCtietBcao[index].ncauChiTrongDoChiCs = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
        //             this.lstCtietBcao[index].ncauChiTrongDoChiMoi = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
        //             this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
        //             this.lstCtietBcao[index].ncauChiChiaRaChiCs1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
        //             this.lstCtietBcao[index].ncauChiChiaRaChiMoi1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
        //             this.lstCtietBcao[index].ncauChiChiaRaChiTx = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
        //             this.lstCtietBcao[index].ncauChiChiaRaChiCs2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
        //             this.lstCtietBcao[index].ncauChiChiaRaChiMoi2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);
        //         }
        //     })
        //     stt = this.getHead(stt);
        // }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            this.total.giaTri = sumNumber([this.total.giaTri, item.giaTri]);
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

    deleteById(id: any): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    }

    addNewReport(id: any) {
        const item: ItemData = {
            id: uuid.v4(),
            khvonphiLapThamDinhCtietId: "",
            stt: "0",
            maKho: "",
            tenNhaKho: "",
            khoiTich: 0,
            tenHang: "",
            soLuong: 0,
            giaTri: 0,
            checked: false,
        };

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };

    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCtietBcao.every(item => item.checked)) {
            this.allChecked = true;
        }
    };

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

}

