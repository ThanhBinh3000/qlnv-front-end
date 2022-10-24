import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";


export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdung: number;
    kphiSdungTcong: number;
    kphiSdungDtoan: number;
    kphiSdungNguonKhac: number;
    kphiSdungNguonQuy: number;
    kphiSdungNstt: number;
    kphiSdungCk: number;
    kphiChuyenSangTcong: number;
    kphiChuyenSangDtoan: number;
    kphiChuyenSangNguonKhac: number;
    kphiChuyenSangNguonQuy: number;
    kphiChuyenSangNstt: number;
    kphiChuyenSangCk: number;
    dtoanGiaoTcong: number;
    dtoanGiaoDtoan: number;
    dtoanGiaoNguonKhac: number;
    dtoanGiaoNguonQuy: number;
    dtoanGiaoNstt: number;
    dtoanGiaoCk: number;
    giaiNganThangBcaoTcong: number;
    giaiNganThangBcaoTcongTle: number;
    giaiNganThangBcaoDtoan: number;
    giaiNganThangBcaoDtoanTle: number;
    giaiNganThangBcaoNguonKhac: number;
    giaiNganThangBcaoNguonKhacTle: number;
    giaiNganThangBcaoNguonQuy: number;
    giaiNganThangBcaoNguonQuyTle: number;
    giaiNganThangBcaoNstt: number;
    giaiNganThangBcaoNsttTle: number;
    giaiNganThangBcaoCk: number;
    giaiNganThangBcaoCkTle: number;
    luyKeGiaiNganTcong: number;
    luyKeGiaiNganTcongTle: number;
    luyKeGiaiNganDtoan: number;
    luyKeGiaiNganDtoanTle: number;
    luyKeGiaiNganNguonKhac: number;
    luyKeGiaiNganNguonKhacTle: number;
    luyKeGiaiNganNguonQuy: number;
    luyKeGiaiNganNguonQuyTle: number;
    luyKeGiaiNganNstt: number;
    luyKeGiaiNganNsttTle: number;
    luyKeGiaiNganCk: number;
    luyKeGiaiNganCkTle: number;
}

@Component({
    selector: 'app-phu-luc-1',
    templateUrl: './phu-luc-1.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donVis: any = [];
    noiDungs: any[] = [];
    noiDungFull: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    luyKeDetail: any[] = [];
    maLoaiBcao: string;

    //thong tin chung
    idBcao: string;
    id: string;
    namHienHanh: number;
    maPhuLuc: string;
    thuyetMinh: string;
    maDviTien: string;
    listIdDelete = "";
    trangThaiPhuLuc = '1';
    initItem: ItemData = new ItemData();
    total: ItemData = new ItemData();
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;

    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        await this.danhMucService.dMNoiDungPhuLuc1().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.noiDungs = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );

        this.noiDungs.forEach(item => {
            if (!item.maCha) {
                this.noiDungFull.push({
                    ...item,
                    tenDm: item.giaTri,
                    ten: item.giaTri,
                    level: 0,
                    idCha: 0,
                })
            }
        })

        this.addListNoiDung(this.noiDungFull);
        //debugger
        this.id = this.data?.id;
        this.idBcao = this.data?.idBcao;
        this.maPhuLuc = this.data?.maPhuLuc;
        this.maLoaiBcao = this.data?.maLoaiBcao;
        this.maDviTien = this.data?.maDviTien ? this.data.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namHienHanh = this.data?.namHienHanh;
        this.luyKeDetail = this.data?.luyKeDetail?.lstCtietBcaos;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;

        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                giaiNganThangBcaoTcongTle: divNumber(item.giaiNganThangBcaoTcong, item.kphiSdungTcong),
                giaiNganThangBcaoDtoanTle: divNumber(item.giaiNganThangBcaoDtoan, item.kphiSdungTcong),
                giaiNganThangBcaoNguonKhacTle: divNumber(item.giaiNganThangBcaoNguonKhac, item.kphiSdungTcong),
                giaiNganThangBcaoNguonQuyTle: divNumber(item.giaiNganThangBcaoNguonQuy, item.kphiSdungTcong),
                giaiNganThangBcaoNsttTle: divNumber(item.giaiNganThangBcaoNstt, item.kphiSdungTcong),
                giaiNganThangBcaoCkTle: divNumber(item.giaiNganThangBcaoCk, item.kphiSdungTcong),
                luyKeGiaiNganTcongTle: divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong),
                luyKeGiaiNganDtoanTle: divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan),
                luyKeGiaiNganNguonKhacTle: divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac),
                luyKeGiaiNganNguonQuyTle: divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy),
                luyKeGiaiNganNsttTle: divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt),
                luyKeGiaiNganCkTle: divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk),
                checked: false,
            })
        })

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.sortWithoutIndex();
            } else {
                this.sortByIndex();
            }
        } else {
            this.luyKeDetail.forEach(item => {
                this.lstCtietBcao.push({
                    ...item,
                    luyKeGiaiNganTcongTle: divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong),
                    luyKeGiaiNganDtoanTle: divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan),
                    luyKeGiaiNganNguonKhacTle: divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac),
                    luyKeGiaiNganNguonQuyTle: divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy),
                    luyKeGiaiNganNsttTle: divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt),
                    luyKeGiaiNganCkTle: divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk),
                    checked: false,
                    id: uuid.v4() + 'FE',
                })
            })
            this.sortByIndex();
        }
        this.getTotal();
        this.updateEditCache();

        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    addListNoiDung(noiDungTemp) {
        const a = [];
        noiDungTemp.forEach(item => {
            this.noiDungs.forEach(el => {
                if (item.ma == el.maCha) {
                    el = {
                        ...el,
                        tenDm: el.giaTri,
                        ten: item.giaTri,
                        level: item.level + 1,
                        idCha: item.id,
                    }
                    this.noiDungFull.push(el);
                    a.push(el);
                }
            });
        })
        if (a.length > 0) {
            this.addListNoiDung(a);
        }
    }

    getLoai(ma: number) {
        return this.noiDungFull.find(e => e.id == ma)?.loai;
    }

    // luu
    async save(trangThai: string) {
        let checkSaveEdit;
        //check xem tat ca cac dong du lieu da luu chua?
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
            if (item.kphiSdungTcong > MONEY_LIMIT || item.kphiChuyenSangTcong > MONEY_LIMIT || item.dtoanGiaoTcong > MONEY_LIMIT ||
                item.giaiNganThangBcaoTcong > MONEY_LIMIT || item.luyKeGiaiNganTcong > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        // replace nhung ban ghi dc them moi id thanh null
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })
        const request = {
            id: this.id,
            lstCtietBcaos: lstCtietBcaoTemp,
            maLoai: this.maPhuLuc,
            maDviTien: this.maDviTien,
            nguoiBcao: this.data?.nguoiBcao,
            lyDoTuChoi: this.data?.lyDoTuChoi,
            thuyetMinh: this.thuyetMinh,
            trangThai: trangThai,
        };
        this.spinner.show();
        this.quanLyVonPhiService.baoCaoCapNhatChiTiet(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    const obj = {
                        trangThai: '-1',
                        lyDoTuChoi: null,
                    };
                    this.dataChange.emit(obj);
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
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                trangThai: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.quanLyVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = mcn;
                    this.getStatusButton();
                    const obj = {
                        trangThai: mcn,
                        lyDoTuChoi: lyDoTuChoi,
                    }
                    this.dataChange.emit(obj);
                    if (mcn == '0') {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
            this.spinner.hide();
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
        }
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
    getIndex(str: string): string {
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
    //tìm vị trí cần để thêm mới
    findVt(str: string): number {
        const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
        let index: number = start;
        for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
            if (this.lstCtietBcao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
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
    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
        const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        const itemLine = this.luyKeDetail.find(item => item.maNdung == initItem.maNdung);
        // them moi phan tu
        if (initItem.id) {
            const item: ItemData = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
            }
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            const item: ItemData = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: head + "." + (tail + 1).toString(),
                // luyKeGiaiNganTcong: itemLine?.luyKeGiaiNganTcong ? itemLine?.luyKeGiaiNganTcong : 0,
                // luyKeGiaiNganDtoan: itemLine?.luyKeGiaiNganDtoan ? itemLine?.luyKeGiaiNganDtoan : 0,
                // luyKeGiaiNganNguonKhac: itemLine?.luyKeGiaiNganNguonKhac ? itemLine?.luyKeGiaiNganNguonKhac : 0,
                // luyKeGiaiNganNguonQuy: itemLine?.luyKeGiaiNganNguonQuy ? itemLine?.luyKeGiaiNganNguonQuy : 0,
                // luyKeGiaiNganNstt: itemLine?.luyKeGiaiNganNstt ? itemLine?.luyKeGiaiNganNstt : 0,
                // luyKeGiaiNganCk: itemLine?.luyKeGiaiNganCk ? itemLine?.luyKeGiaiNganCk : 0,
            }
            // item.luyKeGiaiNganTcongTle = divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong);
            // item.luyKeGiaiNganDtoanTle = divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan);
            // item.luyKeGiaiNganNguonKhacTle = divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac);
            // item.luyKeGiaiNganNguonQuyTle = divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy);
            // item.luyKeGiaiNganNsttTle = divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt);
            // item.luyKeGiaiNganCkTle = divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk);
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.sum(item.stt);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
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
    //thêm cấp thấp hơn
    addLow(id: string, initItem: ItemData) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        let stt: string;
        if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt);
            for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
                if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        const itemLine = this.luyKeDetail.find(item => item.maNdung == initItem.maNdung);

        // them moi phan tu
        if (initItem.id) {
            const item: ItemData = {
                ...initItem,
                stt: stt,
            }
            this.lstCtietBcao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            // if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {

            // }
            const item: ItemData = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
                // luyKeGiaiNganTcong: itemLine?.luyKeGiaiNganTcong ? itemLine?.luyKeGiaiNganTcong : 0,
                // luyKeGiaiNganDtoan: itemLine?.luyKeGiaiNganDtoan ? itemLine?.luyKeGiaiNganDtoan : 0,
                // luyKeGiaiNganNguonKhac: itemLine?.luyKeGiaiNganNguonKhac ? itemLine?.luyKeGiaiNganNguonKhac : 0,
                // luyKeGiaiNganNguonQuy: itemLine?.luyKeGiaiNganNguonQuy ? itemLine?.luyKeGiaiNganNguonQuy : 0,
                // luyKeGiaiNganNstt: itemLine?.luyKeGiaiNganNstt ? itemLine?.luyKeGiaiNganNstt : 0,
                // luyKeGiaiNganCk: itemLine?.luyKeGiaiNganCk ? itemLine?.luyKeGiaiNganCk : 0,
            }
            // item.luyKeGiaiNganTcongTle = divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong);
            // item.luyKeGiaiNganDtoanTle = divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan);
            // item.luyKeGiaiNganNguonKhacTle = divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac);
            // item.luyKeGiaiNganNguonQuyTle = divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy);
            // item.luyKeGiaiNganNsttTle = divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt);
            // item.luyKeGiaiNganCkTle = divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk);
            this.lstCtietBcao.splice(index + 1, 0, item);
            this.sum(stt);
            this.updateEditCache();
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }

    }
    //xóa dòng
    deleteLine(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }

        this.replaceIndex(lstIndex, -1);
        this.sum(stt);
        this.updateEditCache();
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const data = this.lstCtietBcao.find(item => item.id === id);
        if (!data.maNdung) {
            this.deleteLine(id);
        }
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...data },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maNdung) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }


    updateChecked(id: string) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
                if (index == -1) {
                    this.allChecked = this.checkAllChild('0');
                    break;
                }
                nho = this.lstCtietBcao[index].checked;
            }
        }
    }
    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        let nho = true;
        this.lstCtietBcao.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked)) {
                nho = item.checked;
            }
        })
        return nho;
    }


    updateAllChecked() {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    deleteAllChecked() {
        const lstId: string[] = [];
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
    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(initItem: ItemData) {
        const itemLine = this.luyKeDetail.find(item => item.maNdung == initItem.maNdung);
        if (initItem.id) {
            const item: ItemData = {
                ...initItem,
                stt: "0.1",
            }
            this.lstCtietBcao.push(item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            const item: ItemData = {
                ...initItem,
                level: 0,
                id: uuid.v4() + 'FE',
                stt: "0.1",
                // luyKeGiaiNganTcong: itemLine?.luyKeGiaiNganTcong ? itemLine?.luyKeGiaiNganTcong : 0,
                // luyKeGiaiNganDtoan: itemLine?.luyKeGiaiNganDtoan ? itemLine?.luyKeGiaiNganDtoan : 0,
                // luyKeGiaiNganNguonKhac: itemLine?.luyKeGiaiNganNguonKhac ? itemLine?.luyKeGiaiNganNguonKhac : 0,
                // luyKeGiaiNganNguonQuy: itemLine?.luyKeGiaiNganNguonQuy ? itemLine?.luyKeGiaiNganNguonQuy : 0,
                // luyKeGiaiNganNstt: itemLine?.luyKeGiaiNganNstt ? itemLine?.luyKeGiaiNganNstt : 0,
                // luyKeGiaiNganCk: itemLine?.luyKeGiaiNganCk ? itemLine?.luyKeGiaiNganCk : 0,
            }
            // item.luyKeGiaiNganTcongTle = divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong);
            // item.luyKeGiaiNganDtoanTle = divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan);
            // item.luyKeGiaiNganNguonKhacTle = divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac);
            // item.luyKeGiaiNganNguonQuyTle = divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy);
            // item.luyKeGiaiNganNsttTle = divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt);
            // item.luyKeGiaiNganCkTle = divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk);
            this.lstCtietBcao.push(item);
            this.getTotal();
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    sortByIndex() {
        this.setDetail();
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

    setDetail() {
        this.lstCtietBcao.forEach(item => {
            item.level = this.noiDungFull.find(e => e.id == item.maNdung)?.level;
        })
    }

    getIdCha(maKM: number) {
        return this.noiDungFull.find(e => e.id == maKM)?.idCha;
    }

    sortWithoutIndex() {
        this.setDetail();
        let level = 0;
        let lstCtietBcaoTemp: ItemData[] = this.lstCtietBcao;
        this.lstCtietBcao = [];
        const data: ItemData = lstCtietBcaoTemp.find(e => e.level == 0);
        this.addFirst(data);
        lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
        let lstTemp: ItemData[] = lstCtietBcaoTemp.filter(e => e.level == level);
        while (lstTemp.length != 0 || level == 0) {
            lstTemp.forEach(item => {
                const idCha = this.getIdCha(item.maNdung);
                let index: number = this.lstCtietBcao.findIndex(e => e.maNdung === idCha);
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => this.getIdCha(e.maNdung) === idCha);
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: string) {
        const maNdung: number = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
        const obj = {
            maKhoanMuc: maNdung,
            lstKhoanMuc: this.noiDungFull,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách lĩnh vực',
            nzContent: DialogThemKhoanMucComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
                if (index == -1) {
                    const data: ItemData = {
                        ...this.initItem,
                        maNdung: res.maKhoanMuc,
                        level: this.noiDungFull.find(e => e.id == maNdung)?.level,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNdung == item.id) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            maNdung: item.id,
                            level: item.level,
                        };
                        this.addLow(id, data);
                    }

                })
                this.updateEditCache();
            }
        });

    }

    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    getDeleteStatus(maNdung: number) {
        if (this.luyKeDetail.findIndex(e => e.maNdung == maNdung) != -1) {
            return true;
        }
        return false;
    }

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...this.initItem,
                id: data.id,
                stt: data.stt,
                checked: data.checked,
                level: data.level,
                maNdung: data.maNdung,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].kphiSdungTcong = sumNumber([this.lstCtietBcao[index].kphiSdungTcong, item.kphiSdungTcong]);
                    this.lstCtietBcao[index].kphiSdungDtoan = sumNumber([this.lstCtietBcao[index].kphiSdungDtoan, item.kphiSdungDtoan]);
                    this.lstCtietBcao[index].kphiSdungNguonKhac = sumNumber([this.lstCtietBcao[index].kphiSdungNguonKhac, item.kphiSdungNguonKhac]);
                    this.lstCtietBcao[index].kphiSdungNguonQuy = sumNumber([this.lstCtietBcao[index].kphiSdungNguonQuy, item.kphiSdungNguonQuy]);
                    this.lstCtietBcao[index].kphiSdungNstt = sumNumber([this.lstCtietBcao[index].kphiSdungNstt, item.kphiSdungNstt]);
                    this.lstCtietBcao[index].kphiSdungCk = sumNumber([this.lstCtietBcao[index].kphiSdungCk, item.kphiSdungCk]);
                    this.lstCtietBcao[index].kphiChuyenSangTcong = sumNumber([this.lstCtietBcao[index].kphiChuyenSangTcong, item.kphiChuyenSangTcong]);
                    this.lstCtietBcao[index].kphiChuyenSangDtoan = sumNumber([this.lstCtietBcao[index].kphiChuyenSangDtoan, item.kphiChuyenSangDtoan]);
                    this.lstCtietBcao[index].kphiChuyenSangNguonKhac = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNguonKhac, item.kphiChuyenSangNguonKhac]);
                    this.lstCtietBcao[index].kphiChuyenSangNguonQuy = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNguonQuy, item.kphiChuyenSangNguonQuy]);
                    this.lstCtietBcao[index].kphiChuyenSangNstt = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNstt, item.kphiChuyenSangNstt]);
                    this.lstCtietBcao[index].kphiChuyenSangCk = sumNumber([this.lstCtietBcao[index].kphiChuyenSangCk, item.kphiChuyenSangCk]);
                    this.lstCtietBcao[index].dtoanGiaoTcong = sumNumber([this.lstCtietBcao[index].dtoanGiaoTcong, item.dtoanGiaoTcong]);
                    this.lstCtietBcao[index].dtoanGiaoDtoan = sumNumber([this.lstCtietBcao[index].dtoanGiaoDtoan, item.dtoanGiaoDtoan]);
                    this.lstCtietBcao[index].dtoanGiaoNguonKhac = sumNumber([this.lstCtietBcao[index].dtoanGiaoNguonKhac, item.dtoanGiaoNguonKhac]);
                    this.lstCtietBcao[index].dtoanGiaoNguonQuy = sumNumber([this.lstCtietBcao[index].dtoanGiaoNguonQuy, item.dtoanGiaoNguonQuy]);
                    this.lstCtietBcao[index].dtoanGiaoNstt = sumNumber([this.lstCtietBcao[index].dtoanGiaoNstt, item.dtoanGiaoNstt]);
                    this.lstCtietBcao[index].dtoanGiaoCk = sumNumber([this.lstCtietBcao[index].dtoanGiaoCk, item.dtoanGiaoCk]);
                    this.lstCtietBcao[index].giaiNganThangBcaoTcong = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoTcong, item.giaiNganThangBcaoTcong]);
                    this.lstCtietBcao[index].giaiNganThangBcaoDtoan = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoDtoan, item.giaiNganThangBcaoDtoan]);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, item.giaiNganThangBcaoNguonKhac]);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, item.giaiNganThangBcaoNguonQuy]);
                    this.lstCtietBcao[index].giaiNganThangBcaoNstt = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoNstt, item.giaiNganThangBcaoNstt]);
                    this.lstCtietBcao[index].giaiNganThangBcaoCk = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoCk, item.giaiNganThangBcaoCk]);
                    this.lstCtietBcao[index].luyKeGiaiNganTcong = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                    this.lstCtietBcao[index].luyKeGiaiNganDtoan = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDtoan, item.luyKeGiaiNganDtoan]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonKhac = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, item.luyKeGiaiNganNguonKhac]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuy = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
                    this.lstCtietBcao[index].luyKeGiaiNganNstt = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNstt, item.luyKeGiaiNganNstt]);
                    this.lstCtietBcao[index].luyKeGiaiNganCk = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganCk, item.luyKeGiaiNganCk]);

                    this.lstCtietBcao[index].giaiNganThangBcaoTcongTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoTcong, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].giaiNganThangBcaoDtoanTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonKhacTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonQuyTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].giaiNganThangBcaoNsttTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNstt, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].giaiNganThangBcaoCkTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoCk, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].luyKeGiaiNganTcongTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].luyKeGiaiNganDtoanTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonKhacTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
                    this.lstCtietBcao[index].luyKeGiaiNganNsttTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNstt, this.lstCtietBcao[index].kphiSdungNstt);
                    this.lstCtietBcao[index].luyKeGiaiNganCkTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganCk, this.lstCtietBcao[index].kphiSdungCk);
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
                this.total.kphiSdungTcong = sumNumber([this.total.kphiSdungTcong, item.kphiSdungTcong]);
                this.total.kphiSdungDtoan = sumNumber([this.total.kphiSdungDtoan, item.kphiSdungDtoan]);
                this.total.kphiSdungNguonKhac = sumNumber([this.total.kphiSdungNguonKhac, item.kphiSdungNguonKhac]);
                this.total.kphiSdungNguonQuy = sumNumber([this.total.kphiSdungNguonQuy, item.kphiSdungNguonQuy]);
                this.total.kphiSdungNstt = sumNumber([this.total.kphiSdungNstt, item.kphiSdungNstt]);
                this.total.kphiSdungCk = sumNumber([this.total.kphiSdungCk, item.kphiSdungCk]);
                this.total.kphiChuyenSangTcong = sumNumber([this.total.kphiChuyenSangTcong, item.kphiChuyenSangTcong]);
                this.total.kphiChuyenSangDtoan = sumNumber([this.total.kphiChuyenSangDtoan, item.kphiChuyenSangDtoan]);
                this.total.kphiChuyenSangNguonKhac = sumNumber([this.total.kphiChuyenSangNguonKhac, item.kphiChuyenSangNguonKhac]);
                this.total.kphiChuyenSangNguonQuy = sumNumber([this.total.kphiChuyenSangNguonQuy, item.kphiChuyenSangNguonQuy]);
                this.total.kphiChuyenSangNstt = sumNumber([this.total.kphiChuyenSangNstt, item.kphiChuyenSangNstt]);
                this.total.kphiChuyenSangCk = sumNumber([this.total.kphiChuyenSangCk, item.kphiChuyenSangCk]);
                this.total.dtoanGiaoTcong = sumNumber([this.total.dtoanGiaoTcong, item.dtoanGiaoTcong]);
                this.total.dtoanGiaoDtoan = sumNumber([this.total.dtoanGiaoDtoan, item.dtoanGiaoDtoan]);
                this.total.dtoanGiaoNguonKhac = sumNumber([this.total.dtoanGiaoNguonKhac, item.dtoanGiaoNguonKhac]);
                this.total.dtoanGiaoNguonQuy = sumNumber([this.total.dtoanGiaoNguonQuy, item.dtoanGiaoNguonQuy]);
                this.total.dtoanGiaoNstt = sumNumber([this.total.dtoanGiaoNstt, item.dtoanGiaoNstt]);
                this.total.dtoanGiaoCk = sumNumber([this.total.dtoanGiaoCk, item.dtoanGiaoCk]);
                this.total.giaiNganThangBcaoTcong = sumNumber([this.total.giaiNganThangBcaoTcong, item.giaiNganThangBcaoTcong]);
                this.total.giaiNganThangBcaoDtoan = sumNumber([this.total.giaiNganThangBcaoDtoan, item.giaiNganThangBcaoDtoan]);
                this.total.giaiNganThangBcaoNguonKhac = sumNumber([this.total.giaiNganThangBcaoNguonKhac, item.giaiNganThangBcaoNguonKhac]);
                this.total.giaiNganThangBcaoNguonQuy = sumNumber([this.total.giaiNganThangBcaoNguonQuy, item.giaiNganThangBcaoNguonQuy]);
                this.total.giaiNganThangBcaoNstt = sumNumber([this.total.giaiNganThangBcaoNstt, item.giaiNganThangBcaoNstt]);
                this.total.giaiNganThangBcaoCk = sumNumber([this.total.giaiNganThangBcaoCk, item.giaiNganThangBcaoCk]);
                this.total.luyKeGiaiNganTcong = sumNumber([this.total.luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                this.total.luyKeGiaiNganDtoan = sumNumber([this.total.luyKeGiaiNganDtoan, item.luyKeGiaiNganDtoan]);
                this.total.luyKeGiaiNganNguonKhac = sumNumber([this.total.luyKeGiaiNganNguonKhac, item.luyKeGiaiNganNguonKhac]);
                this.total.luyKeGiaiNganNguonQuy = sumNumber([this.total.luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
                this.total.luyKeGiaiNganNstt = sumNumber([this.total.luyKeGiaiNganNstt, item.luyKeGiaiNganNstt]);
                this.total.luyKeGiaiNganCk = sumNumber([this.total.luyKeGiaiNganCk, item.luyKeGiaiNganCk]);
            }
        })
        this.total.giaiNganThangBcaoTcongTle = divNumber(this.total.giaiNganThangBcaoTcong, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoDtoanTle = divNumber(this.total.giaiNganThangBcaoDtoan, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoNguonKhacTle = divNumber(this.total.giaiNganThangBcaoNguonKhac, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoNguonQuyTle = divNumber(this.total.giaiNganThangBcaoNguonQuy, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoNsttTle = divNumber(this.total.giaiNganThangBcaoNstt, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoCkTle = divNumber(this.total.giaiNganThangBcaoCk, this.total.kphiSdungTcong);
        this.total.luyKeGiaiNganTcongTle = divNumber(this.total.luyKeGiaiNganTcong, this.total.kphiSdungTcong);
        this.total.luyKeGiaiNganDtoanTle = divNumber(this.total.luyKeGiaiNganDtoan, this.total.kphiSdungDtoan);
        this.total.luyKeGiaiNganNguonKhacTle = divNumber(this.total.luyKeGiaiNganNguonKhac, this.total.kphiSdungNguonKhac);
        this.total.luyKeGiaiNganNguonQuyTle = divNumber(this.total.luyKeGiaiNganNguonQuy, this.total.kphiSdungNguonQuy);
        this.total.luyKeGiaiNganNsttTle = divNumber(this.total.luyKeGiaiNganNstt, this.total.kphiSdungNstt);
        this.total.luyKeGiaiNganCkTle = divNumber(this.total.luyKeGiaiNganCk, this.total.kphiSdungCk);
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.kphiSdungDtoan = sumNumber([this.editCache[id].data.kphiChuyenSangDtoan, this.editCache[id].data.dtoanGiaoDtoan]);
        this.editCache[id].data.kphiSdungNguonKhac = sumNumber([this.editCache[id].data.kphiChuyenSangNguonKhac, this.editCache[id].data.dtoanGiaoNguonKhac]);
        this.editCache[id].data.kphiSdungNguonQuy = sumNumber([this.editCache[id].data.kphiChuyenSangNguonQuy, this.editCache[id].data.dtoanGiaoNguonQuy]);
        this.editCache[id].data.kphiSdungNstt = sumNumber([this.editCache[id].data.kphiChuyenSangNstt, this.editCache[id].data.dtoanGiaoNstt]);
        this.editCache[id].data.kphiSdungCk = sumNumber([this.editCache[id].data.kphiChuyenSangCk, this.editCache[id].data.dtoanGiaoCk]);

        this.editCache[id].data.kphiSdungTcong = sumNumber([this.editCache[id].data.kphiSdungDtoan, this.editCache[id].data.kphiSdungNguonKhac, this.editCache[id].data.kphiSdungNguonQuy,
        this.editCache[id].data.kphiSdungNstt, this.editCache[id].data.kphiSdungCk]);

        this.editCache[id].data.kphiChuyenSangTcong = sumNumber([this.editCache[id].data.kphiChuyenSangDtoan, this.editCache[id].data.kphiChuyenSangNguonKhac, this.editCache[id].data.kphiChuyenSangNguonQuy,
        this.editCache[id].data.kphiChuyenSangNstt, this.editCache[id].data.kphiChuyenSangCk]);

        this.editCache[id].data.dtoanGiaoTcong = sumNumber([this.editCache[id].data.dtoanGiaoDtoan, this.editCache[id].data.dtoanGiaoNguonKhac, this.editCache[id].data.dtoanGiaoNguonQuy,
        this.editCache[id].data.dtoanGiaoNstt, this.editCache[id].data.dtoanGiaoCk]);

        this.editCache[id].data.giaiNganThangBcaoTcong = sumNumber([this.editCache[id].data.giaiNganThangBcaoDtoan, this.editCache[id].data.giaiNganThangBcaoNguonKhac, this.editCache[id].data.giaiNganThangBcaoNguonQuy,
        this.editCache[id].data.giaiNganThangBcaoNstt, this.editCache[id].data.giaiNganThangBcaoCk]);

        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([this.editCache[id].data.luyKeGiaiNganDtoan, this.editCache[id].data.luyKeGiaiNganNguonKhac, this.editCache[id].data.luyKeGiaiNganNguonQuy,
        this.editCache[id].data.luyKeGiaiNganNstt, this.editCache[id].data.luyKeGiaiNganCk]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([data.luyKeGiaiNganTcong, this.editCache[id].data.giaiNganThangBcaoTcong, -data.giaiNganThangBcaoTcong]);
        this.editCache[id].data.luyKeGiaiNganDtoan = sumNumber([data.luyKeGiaiNganDtoan, this.editCache[id].data.giaiNganThangBcaoDtoan, -data.giaiNganThangBcaoDtoan]);
        this.editCache[id].data.luyKeGiaiNganNguonKhac = sumNumber([data.luyKeGiaiNganNguonKhac, this.editCache[id].data.giaiNganThangBcaoNguonKhac, -data.giaiNganThangBcaoNguonKhac]);
        this.editCache[id].data.luyKeGiaiNganNguonQuy = sumNumber([data.luyKeGiaiNganNguonQuy, this.editCache[id].data.giaiNganThangBcaoNguonQuy, -data.giaiNganThangBcaoNguonQuy]);
        this.editCache[id].data.luyKeGiaiNganNstt = sumNumber([data.luyKeGiaiNganNstt, this.editCache[id].data.giaiNganThangBcaoNstt, -data.giaiNganThangBcaoNstt]);
        this.editCache[id].data.luyKeGiaiNganCk = sumNumber([data.luyKeGiaiNganCk, this.editCache[id].data.giaiNganThangBcaoCk, -data.giaiNganThangBcaoCk]);

        //tinh ty le
        this.editCache[id].data.giaiNganThangBcaoTcongTle = divNumber(this.editCache[id].data.giaiNganThangBcaoTcong, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoDtoanTle = divNumber(this.editCache[id].data.giaiNganThangBcaoDtoan, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoNguonKhacTle = divNumber(this.editCache[id].data.giaiNganThangBcaoNguonKhac, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoNguonQuyTle = divNumber(this.editCache[id].data.giaiNganThangBcaoNguonQuy, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoNsttTle = divNumber(this.editCache[id].data.giaiNganThangBcaoNstt, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoCkTle = divNumber(this.editCache[id].data.giaiNganThangBcaoCk, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.luyKeGiaiNganTcongTle = divNumber(this.editCache[id].data.luyKeGiaiNganTcong, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.luyKeGiaiNganDtoanTle = divNumber(this.editCache[id].data.luyKeGiaiNganDtoan, this.editCache[id].data.kphiSdungDtoan);
        this.editCache[id].data.luyKeGiaiNganNguonKhacTle = divNumber(this.editCache[id].data.luyKeGiaiNganNguonKhac, this.editCache[id].data.kphiSdungNguonKhac);
        this.editCache[id].data.luyKeGiaiNganNguonQuyTle = divNumber(this.editCache[id].data.luyKeGiaiNganNguonQuy, this.editCache[id].data.kphiSdungNguonQuy);
        this.editCache[id].data.luyKeGiaiNganNsttTle = divNumber(this.editCache[id].data.luyKeGiaiNganNstt, this.editCache[id].data.kphiSdungNstt);
        this.editCache[id].data.luyKeGiaiNganCkTle = divNumber(this.editCache[id].data.luyKeGiaiNganCk, this.editCache[id].data.kphiSdungCk)
    }

    export() {
        const request = {
            bcaoCtietId: this.id,
            bcaoId: this.idBcao,
            dviTien: this.maDviTien,
        }
        const baoCao = "phuLuc1.xlsx";
        this.quanLyVonPhiService.exportBaoCao(request).toPromise().then(
            (data) => {
                fileSaver.saveAs(data, baoCao);
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    // changeMoney() {
    //     if (!this.moneyUnit) {
    //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_MONEY);
    //         return;
    //     }
    //     this.lstCtietBcao.forEach(item => {
    //         item.kphiSdungTcong = exchangeMoney(item.kphiSdungTcong, this.maDviTien, this.moneyUnit);
    //         item.kphiSdungDtoan = exchangeMoney(item.kphiSdungDtoan, this.maDviTien, this.moneyUnit);
    //         item.kphiSdungNguonKhac = exchangeMoney(item.kphiSdungNguonKhac, this.maDviTien, this.moneyUnit);
    //         item.kphiSdungNguonQuy = exchangeMoney(item.kphiSdungNguonQuy, this.maDviTien, this.moneyUnit);
    //         item.kphiSdungNstt = exchangeMoney(item.kphiSdungNstt, this.maDviTien, this.moneyUnit);
    //         item.kphiSdungCk = exchangeMoney(item.kphiSdungCk, this.maDviTien, this.moneyUnit);
    //         item.kphiChuyenSangTcong = exchangeMoney(item.kphiChuyenSangTcong, this.maDviTien, this.moneyUnit);
    //         item.kphiChuyenSangDtoan = exchangeMoney(item.kphiChuyenSangDtoan, this.maDviTien, this.moneyUnit);
    //         item.kphiChuyenSangNguonKhac = exchangeMoney(item.kphiChuyenSangNguonKhac, this.maDviTien, this.moneyUnit);
    //         item.kphiChuyenSangNguonQuy = exchangeMoney(item.kphiChuyenSangNguonQuy, this.maDviTien, this.moneyUnit);
    //         item.kphiChuyenSangNstt = exchangeMoney(item.kphiChuyenSangNstt, this.maDviTien, this.moneyUnit);
    //         item.kphiChuyenSangCk = exchangeMoney(item.kphiChuyenSangCk, this.maDviTien, this.moneyUnit);
    //         item.dtoanGiaoTcong = exchangeMoney(item.dtoanGiaoTcong, this.maDviTien, this.moneyUnit);
    //         item.dtoanGiaoDtoan = exchangeMoney(item.dtoanGiaoDtoan, this.maDviTien, this.moneyUnit);
    //         item.dtoanGiaoNguonKhac = exchangeMoney(item.dtoanGiaoNguonKhac, this.maDviTien, this.moneyUnit);
    //         item.dtoanGiaoNguonQuy = exchangeMoney(item.dtoanGiaoNguonQuy, this.maDviTien, this.moneyUnit);
    //         item.dtoanGiaoNstt = exchangeMoney(item.dtoanGiaoNstt, this.maDviTien, this.moneyUnit);
    //         item.dtoanGiaoCk = exchangeMoney(item.dtoanGiaoCk, this.maDviTien, this.moneyUnit);
    //         item.giaiNganThangBcaoTcong = exchangeMoney(item.giaiNganThangBcaoTcong, this.maDviTien, this.moneyUnit);
    //         item.giaiNganThangBcaoDtoan = exchangeMoney(item.giaiNganThangBcaoDtoan, this.maDviTien, this.moneyUnit);
    //         item.giaiNganThangBcaoNguonKhac = exchangeMoney(item.giaiNganThangBcaoNguonKhac, this.maDviTien, this.moneyUnit);
    //         item.giaiNganThangBcaoNguonQuy = exchangeMoney(item.giaiNganThangBcaoNguonQuy, this.maDviTien, this.moneyUnit);
    //         item.giaiNganThangBcaoNstt = exchangeMoney(item.giaiNganThangBcaoNstt, this.maDviTien, this.moneyUnit);
    //         item.giaiNganThangBcaoCk = exchangeMoney(item.giaiNganThangBcaoCk, this.maDviTien, this.moneyUnit);
    //         item.luyKeGiaiNganTcong = exchangeMoney(item.luyKeGiaiNganTcong, this.maDviTien, this.moneyUnit);
    //         item.luyKeGiaiNganDtoan = exchangeMoney(item.luyKeGiaiNganDtoan, this.maDviTien, this.moneyUnit);
    //         item.luyKeGiaiNganNguonKhac = exchangeMoney(item.luyKeGiaiNganNguonKhac, this.maDviTien, this.moneyUnit);
    //         item.luyKeGiaiNganNguonQuy = exchangeMoney(item.luyKeGiaiNganNguonQuy, this.maDviTien, this.moneyUnit);
    //         item.luyKeGiaiNganNstt = exchangeMoney(item.luyKeGiaiNganNstt, this.maDviTien, this.moneyUnit);
    //         item.luyKeGiaiNganCk = exchangeMoney(item.luyKeGiaiNganCk, this.maDviTien, this.moneyUnit);
    //     })
    //     this.maDviTien = this.moneyUnit;
    //     this.updateEditCache();
    // }

}
