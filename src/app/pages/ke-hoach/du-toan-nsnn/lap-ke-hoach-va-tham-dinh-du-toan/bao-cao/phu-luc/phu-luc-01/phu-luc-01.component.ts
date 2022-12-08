import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DialogAddVatTuComponent } from './dialog-add-vat-tu/dialog-add-vat-tu.component';
// import { DANH_MUC } from './bieu-mau-18.constant';

export class ItemData {
    id: string;
    khvonphiLapThamDinhCtietId: string;
    stt: string;
    danhMuc: string;
    dvTinh: string;
    dinhMuc: string;
    soLuong: number;
    thanhTien: number;
    soLuongTd: number;
    thanhTienTd: number;
    checked: boolean;
}


@Component({
    selector: 'app-phu-luc-01',
    templateUrl: './phu-luc-01.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class PhuLuc01Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    maDviTao: any;
    //danh muc
    // linhVucChis: any[] = DANH_MUC;
    linhVucChis: any[] = [];
    listVatTu: any[] = [];
    listVatTuFull: any[] = [];

    listVatTuNhap: any[] = [
        // {
        //     id: "1000",
        //     tenDm: "Nhập",
        //     maCha: 0,
        //     level: 0,
        //     maVtu: "1000",
        //     maDviTinh: "",
        //     loaiDmuc: "nhap"
        // },
    ]

    listVatTuXuat: any[] = [
        // {
        //     id: "2000",
        //     tenDm: "Xuất",
        //     maCha: 0,
        //     level: 0,
        //     maVtu: "2000",
        //     maDviTinh: "",
        //     loaiDmuc: "xuat"
        // },
    ]

    dsDinhMucN: any[] = [];
    dsDinhMucX: any[] = [];
    listIdDelete = "";
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
    allChecked = false;

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMucService: DanhMucHDVService,
        private quanLyVonPhiService: QuanLyVonPhiService,
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
        this.maDviTao = this.dataInfo?.maDvi;
        console.log(this.dataInfo);

        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
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
        await this.getDinhMucPL2N();
        await this.getDinhMucPL2X();
        await this.getListVtu()
        await this.addListVatTu()

        // this.sortByIndex();
        // this.getTotal();
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
        const lstVtuCon3 = []
        const lstVtuCon4 = []

        this.listVatTu.forEach(vtu => {
            // this.listVatTuNhap.push({
            //     id: vtu.ma,
            //     maVtu: vtu.ma,
            //     tenDm: vtu.ten,
            //     maDviTinh: vtu.maDviTinh,
            //     maCha: '1000',
            //     level: Number(vtu.cap),
            //     loaiDmuc: "nhap"
            // });

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
        this.listVatTuFull = this.listVatTuNhap.concat(mangGop12)
        // this.listVatTuNhap = lstVtuCon2

        // this.listVatTu.forEach(vtu => {
        //     // this.listVatTuXuat.push({
        //     //     id: vtu.ma + 1,
        //     //     maVtu: vtu.ma,
        //     //     tenDm: vtu.ten,
        //     //     maDviTinh: vtu.maDviTinh,
        //     //     maCha: '2000',
        //     //     level: Number(vtu.cap),
        //     //     loaiDmuc: "xuat"
        //     // });

        //     vtu?.child.forEach(vtuCon => {
        //         const maCha = vtuCon?.ma.slice(0, -2) + 1
        //         lstVtuCon3.push({
        //             id: vtuCon.ma + 1,
        //             maVtu: vtuCon.ma,
        //             tenDm: vtuCon.ten,
        //             maDviTinh: vtuCon.maDviTinh,
        //             maCha: maCha,
        //             level: Number(vtuCon.cap),
        //             loaiDmuc: "xuat"
        //         })

        //         vtuCon?.child.forEach(vtuConn => {
        //             const maCha = vtuConn?.ma.slice(0, -2) + 1
        //             lstVtuCon4.push({
        //                 id: vtuConn.ma + 1,
        //                 maVtu: vtuConn.ma,
        //                 tenDm: vtuConn.ten,
        //                 maDviTinh: vtuConn.maDviTinh,
        //                 maCha: maCha,
        //                 level: Number(vtuConn.cap),
        //                 loaiDmuc: "xuat"
        //             })
        //         })
        //     })
        // })
        // const mangGop34 = lstVtuCon3.concat(lstVtuCon4)
        // this.listVatTuXuat = this.listVatTuXuat.concat(mangGop34)

        // // this.listVatTuXuat = lstVtuCon4

        // this.listVatTuFull = this.listVatTuNhap.concat(this.listVatTuXuat)
        // gan lai noi dung
        this.listVatTuFull.forEach(item => {
            if (item.level.length == 2) {
                item.level = item.level.slice(0, -1)
            }
        })
        this.linhVucChis = this.listVatTuFull;
        console.log(this.linhVucChis);

    }

    async getDinhMucPL2N() {
        const request = {
            loaiDinhMuc: '01',
            maDvi: this.maDviTao,
        }

        await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMucN = res.data;
                    this.dsDinhMucN.forEach(item => {
                        if (!item.loaiVthh.startsWith('02')) {
                            item.tongDmuc = divNumber(item.tongDmuc, 1000);
                        }
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    };
    async getDinhMucPL2X() {
        const request = {
            loaiDinhMuc: '02',
            maDvi: this.maDviTao,
        }
        await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMucX = res.data;
                    this.dsDinhMucX.forEach(item => {
                        if (!item.loaiVthh.startsWith('02')) {
                            item.tongDmuc = divNumber(item.tongDmuc, 1000);
                        }
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
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
        // this.sum(this.lstCtietBcao[index].stt);
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
        this.editCache[id].data.thanhTien = sumNumber([this.editCache[id].data.dinhMuc, this.editCache[id].data.soLuong]);
        this.editCache[id].data.thanhTienTd = sumNumber([this.editCache[id].data.dinhMuc, this.editCache[id].data.soLuongTd]);
    }

    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
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

    deleteLine(id: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id);
        const nho: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        // this.replaceIndex(lstIndex, -1);
        this.updateEditCache();
    }

    addLine(id: any) {
        const item: ItemData = {
            id: uuid.v4(),
            stt: "0",
            danhMuc: "",
            dinhMuc: "",
            dvTinh: "",
            khvonphiLapThamDinhCtietId: "",
            soLuong: 0,
            soLuongTd: 0,
            thanhTien: 0,
            thanhTienTd: 0,
            checked: false,
        };

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    };

    deleteById(id: any): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCtietBcao.every(item => item.checked)) {
            this.allChecked = true;
        }
    }

    addNewReport(id: any) {
        const obj = {
            listVatTu: this.listVatTuFull,
        }

        const modalTuChoi = this.modal.create({
            nzTitle: 'Thêm danh mục',
            nzContent: DialogAddVatTuComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj: obj,
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                console.log(res.loaiDinhMuc);
                if (res?.loaiDinhMuc == "01") {
                    const dvTinh = this.listVatTuFull.find(v => v.maVtu == res.maVatTu)?.maDviTinh
                    // const danhMuc = res.maVatTu
                    const dinhMuc = this.dsDinhMucN.find(v => v.cloaiVthh == res.maVatTu)?.tongDmuc
                    let danhMuc = this.dsDinhMucN.find(v => v.cloaiVthh == res.maVatTu)?.tenDinhMuc
                    if (!danhMuc) {
                        danhMuc = this.listVatTuFull.find(v => v.maVtu == res.maVatTu)?.tenVtu
                    }
                    const item: ItemData = {
                        id: uuid.v4(),
                        stt: "0",
                        danhMuc: danhMuc,
                        dinhMuc: dinhMuc,
                        dvTinh: dvTinh,
                        khvonphiLapThamDinhCtietId: "",
                        soLuong: 0,
                        soLuongTd: 0,
                        thanhTien: 0,
                        thanhTienTd: 0,
                        checked: false,
                    };

                    this.lstCtietBcao.splice(id, 0, item);
                    this.editCache[item.id] = {
                        edit: true,
                        data: { ...item }
                    };
                    console.log(this.editCache[item.id]);

                }
                if (res.loaiDinhMuc == "02") {
                    const dvTinh = this.listVatTuFull.find(v => v.maVtu == res.maVatTu)?.maDviTinh
                    // const danhMuc = res.maVatTu
                    const dinhMuc = this.dsDinhMucX.find(v => v.cloaiVthh == res.maVatTu)?.tongDmuc
                    let danhMuc = this.dsDinhMucX.find(v => v.cloaiVthh == res.maVatTu)?.tenDinhMuc
                    if (!danhMuc) {
                        danhMuc = this.listVatTuFull.find(v => v.maVtu == res.maVatTu)?.tenVtu
                    }
                    const item: ItemData = {
                        id: uuid.v4(),
                        stt: "0",
                        danhMuc: danhMuc,
                        dinhMuc: dinhMuc,
                        dvTinh: dvTinh,
                        khvonphiLapThamDinhCtietId: "",
                        soLuong: 0,
                        soLuongTd: 0,
                        thanhTien: 0,
                        thanhTienTd: 0,
                        checked: false,
                    };

                    this.lstCtietBcao.splice(id, 0, item);
                    this.editCache[item.id] = {
                        edit: true,
                        data: { ...item }
                    };
                }
            }
        });
    };


}

