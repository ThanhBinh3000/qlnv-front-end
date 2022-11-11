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
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DIADIEM } from '../bao-cao.constant';


export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maDan: number;
    ddiemXdung: number;
    qddtSoQdinh: string;
    qddtTmdtTso: number;
    qddtTmdtNsnn: number;
    luyKeVonTso: number;
    luyKeVonNsnn: number;
    luyKeVonDt: number;
    luyKeVonThue: number;
    luyKeVonScl: number;
    luyKeGiaiNganHetNamTso: number;
    luyKeGiaiNganHetNamNsnnTso: number;
    luyKeGiaiNganHetNamNsnnKhNamTruoc: number;
    khoachVonNamTruocKeoDaiTso: number;
    khoachVonNamTruocKeoDaiDtpt: number;
    khoachVonNamTruocKeoDaiVonKhac: number;
    khoachNamVonTso: number;
    khoachNamVonNsnn: number;
    khoachNamVonDt: number;
    khoachNamVonThue: number;
    khoachNamVonScl: number;
    kluongThienTso: number;
    kluongThienThangBcao: number;
    giaiNganTso: number;
    giaiNganTsoTle: number;
    giaiNganNsnn: number;
    giaiNganNsnnVonDt: number;
    giaiNganNsnnVonThue: number;
    giaiNganNsnnVonScl: number;
    giaiNganNsnnTle: number;
    giaiNganNsnnTleVonDt: number;
    giaiNganNsnnTleVonThue: number;
    giaiNganNsnnTleVonScl: number;
    luyKeGiaiNganDauNamTso: number;
    luyKeGiaiNganDauNamTsoTle: number;
    luyKeGiaiNganDauNamNsnn: number;
    luyKeGiaiNganDauNamNsnnVonDt: number;
    luyKeGiaiNganDauNamNsnnVonThue: number;
    luyKeGiaiNganDauNamNsnnVonScl: number;
    luyKeGiaiNganDauNamNsnnTle: number;
    luyKeGiaiNganDauNamNsnnTleVonDt: number;
    luyKeGiaiNganDauNamNsnnTleVonThue: number;
    luyKeGiaiNganDauNamNsnnTleVonScl: number;
    ndungCviecHthanhCuoiThang: number;
    ndungCviecDangThien: number;
    khoachThienNdungCviecThangConLaiNam: number;
    ghiChu: string;
}

@Component({
    selector: 'app-phu-luc-3',
    templateUrl: './phu-luc-3.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIIIComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    maDans: any[] = [];
    maDanFull: any[] = [];
    ddiemXdungs: any[] = DIADIEM;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    luyKeDetail: any[] = [];
    maLoaiBcao: string;

    //thong tin chung
    id: string;
    idBcao: string;
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
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
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
        await this.danhMucService.dMMaDuAnPhuLuc3().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.maDans = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );

        await this.maDans.forEach(item => {
            if (!item.maCha) {
                this.maDanFull.push({
                    ...item,
                    tenDm: item.giaTri,
                    ten: item.giaTri,
                    level: 0,
                    idCha: 0,
                })
            }
        })

        await this.addListMaDuAn(this.maDanFull);

        this.id = this.data?.id;
        this.idBcao = this.data?.idBcao;
        this.maPhuLuc = this.data?.maPhuLuc;
        this.maLoaiBcao = this.data?.maLoaiBcao;
        this.maDviTien = this.data?.maDviTien ? this.data?.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namHienHanh = this.data?.namHienHanh;
        this.luyKeDetail = this.data?.luyKeDetail?.lstCtietBcaos;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                level: this.maDanFull.find(e => e.id == item.maDan)?.level,
                giaiNganTsoTle: divNumber(item.giaiNganTso, item.khoachNamVonTso),
                giaiNganNsnnTle: divNumber(item.giaiNganNsnn, item.khoachNamVonNsnn),
                giaiNganNsnnTleVonDt: divNumber(item.giaiNganNsnnVonDt, item.khoachNamVonDt),
                giaiNganNsnnTleVonThue: divNumber(item.giaiNganNsnnVonThue, item.khoachNamVonThue),
                giaiNganNsnnTleVonScl: divNumber(item.giaiNganNsnnVonScl, item.khoachNamVonScl),
                luyKeGiaiNganDauNamTsoTle: divNumber(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso),
                luyKeGiaiNganDauNamNsnnTle: divNumber(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn),
                luyKeGiaiNganDauNamNsnnTleVonDt: divNumber(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt),
                luyKeGiaiNganDauNamNsnnTleVonThue: divNumber(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue),
                luyKeGiaiNganDauNamNsnnTleVonScl: divNumber(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl),
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
                    luyKeGiaiNganDauNamTsoTle: divNumber(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso),
                    luyKeGiaiNganDauNamNsnnTle: divNumber(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn),
                    luyKeGiaiNganDauNamNsnnTleVonDt: divNumber(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt),
                    luyKeGiaiNganDauNamNsnnTleVonThue: divNumber(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue),
                    luyKeGiaiNganDauNamNsnnTleVonScl: divNumber(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl),
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

    addListMaDuAn(maDanTemp) {
        const a = [];
        maDanTemp.forEach(item => {
            this.maDans.forEach(el => {
                if (item.ma == el.maCha) {
                    el = {
                        ...el,
                        tenDm: el.giaTri,
                        ten: item.giaTri,
                        level: item.level + 1,
                        idCha: item.id,
                    }
                    this.maDanFull.push(el);
                    a.push(el);
                }
            });
        })
        if (a.length > 0) {
            this.addListMaDuAn(a);
        }
    }

    getLoai(ma: number) {
        return this.maDanFull.find(e => e.id == ma)?.loai;
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
            if (item.qddtTmdtTso > MONEY_LIMIT || item.qddtTmdtNsnn > MONEY_LIMIT || item.luyKeVonTso > MONEY_LIMIT ||
                item.luyKeVonNsnn > MONEY_LIMIT || item.luyKeVonDt > MONEY_LIMIT || item.luyKeVonThue > MONEY_LIMIT ||
                item.luyKeVonScl > MONEY_LIMIT || item.luyKeGiaiNganHetNamTso > MONEY_LIMIT || item.luyKeGiaiNganHetNamNsnnTso > MONEY_LIMIT ||
                item.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEY_LIMIT || item.khoachVonNamTruocKeoDaiTso > MONEY_LIMIT || item.khoachVonNamTruocKeoDaiDtpt > MONEY_LIMIT ||
                item.khoachVonNamTruocKeoDaiVonKhac > MONEY_LIMIT || item.khoachNamVonTso > MONEY_LIMIT || item.khoachNamVonNsnn > MONEY_LIMIT ||
                item.khoachNamVonDt > MONEY_LIMIT || item.khoachNamVonThue > MONEY_LIMIT || item.khoachNamVonScl > MONEY_LIMIT ||
                item.giaiNganTso > MONEY_LIMIT || item.giaiNganNsnn > MONEY_LIMIT || item.giaiNganNsnnVonDt > MONEY_LIMIT ||
                item.giaiNganNsnnVonThue > MONEY_LIMIT || item.giaiNganNsnnVonScl > MONEY_LIMIT || item.luyKeGiaiNganDauNamTso > MONEY_LIMIT ||
                item.luyKeGiaiNganDauNamNsnn > MONEY_LIMIT || item.luyKeGiaiNganDauNamNsnnVonDt > MONEY_LIMIT || item.luyKeGiaiNganDauNamNsnnVonThue > MONEY_LIMIT ||
                item.luyKeGiaiNganDauNamNsnnVonScl > MONEY_LIMIT || item.kluongThienTso > MONEY_LIMIT || item.kluongThienThangBcao > MONEY_LIMIT) {
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
        this.baoCaoThucHienDuToanChiService.baoCaoCapNhatChiTiet(request).toPromise().then(
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
            await this.baoCaoThucHienDuToanChiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
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
            xau = String.fromCharCode(k + 96).toUpperCase();
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
        if (n == 3) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
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
        const itemLine = this.luyKeDetail.find(item => item.maDan == initItem.maDan);
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
                luyKeGiaiNganDauNamTso: itemLine?.luyKeGiaiNganDauNamTso ? itemLine?.luyKeGiaiNganDauNamTso : 0,
                luyKeGiaiNganDauNamNsnn: itemLine?.luyKeGiaiNganDauNamNsnn ? itemLine?.luyKeGiaiNganDauNamNsnn : 0,
                luyKeGiaiNganDauNamNsnnVonDt: itemLine?.luyKeGiaiNganDauNamNsnnVonDt ? itemLine?.luyKeGiaiNganDauNamNsnnVonDt : 0,
                luyKeGiaiNganDauNamNsnnVonThue: itemLine?.luyKeGiaiNganDauNamNsnnVonThue ? itemLine?.luyKeGiaiNganDauNamNsnnVonThue : 0,
                luyKeGiaiNganDauNamNsnnVonScl: itemLine?.luyKeGiaiNganDauNamNsnnVonScl ? itemLine?.luyKeGiaiNganDauNamNsnnVonScl : 0,
            }
            item.luyKeGiaiNganDauNamTsoTle = divNumber(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso);
            item.luyKeGiaiNganDauNamNsnnTle = divNumber(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn);
            item.luyKeGiaiNganDauNamNsnnTleVonDt = divNumber(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt);
            item.luyKeGiaiNganDauNamNsnnTleVonThue = divNumber(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue);
            item.luyKeGiaiNganDauNamNsnnTleVonScl = divNumber(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl);
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

        const itemLine = this.luyKeDetail.find(item => item.maDan == initItem.maDan);

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

            const item: ItemData = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
                luyKeGiaiNganDauNamTso: itemLine?.luyKeGiaiNganDauNamTso ? itemLine?.luyKeGiaiNganDauNamTso : 0,
                luyKeGiaiNganDauNamNsnn: itemLine?.luyKeGiaiNganDauNamNsnn ? itemLine?.luyKeGiaiNganDauNamNsnn : 0,
                luyKeGiaiNganDauNamNsnnVonDt: itemLine?.luyKeGiaiNganDauNamNsnnVonDt ? itemLine?.luyKeGiaiNganDauNamNsnnVonDt : 0,
                luyKeGiaiNganDauNamNsnnVonThue: itemLine?.luyKeGiaiNganDauNamNsnnVonThue ? itemLine?.luyKeGiaiNganDauNamNsnnVonThue : 0,
                luyKeGiaiNganDauNamNsnnVonScl: itemLine?.luyKeGiaiNganDauNamNsnnVonScl ? itemLine?.luyKeGiaiNganDauNamNsnnVonScl : 0,
            }
            item.luyKeGiaiNganDauNamTsoTle = divNumber(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso);
            item.luyKeGiaiNganDauNamNsnnTle = divNumber(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn);
            item.luyKeGiaiNganDauNamNsnnTleVonDt = divNumber(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt);
            item.luyKeGiaiNganDauNamNsnnTleVonThue = divNumber(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue);
            item.luyKeGiaiNganDauNamNsnnTleVonScl = divNumber(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl);
            this.lstCtietBcao.splice(index + 1, 0, item);
            if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
                this.sum(stt);
                this.updateEditCache();
            }
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
        if (!data.maDan) {
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
        if (!this.editCache[id].data.maDan) {
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
        const itemLine = this.luyKeDetail.find(item => item.maDan == initItem.maDan);
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
                luyKeGiaiNganDauNamTso: itemLine?.luyKeGiaiNganDauNamTso ? itemLine?.luyKeGiaiNganDauNamTso : 0,
                luyKeGiaiNganDauNamNsnn: itemLine?.luyKeGiaiNganDauNamNsnn ? itemLine?.luyKeGiaiNganDauNamNsnn : 0,
                luyKeGiaiNganDauNamNsnnVonDt: itemLine?.luyKeGiaiNganDauNamNsnnVonDt ? itemLine?.luyKeGiaiNganDauNamNsnnVonDt : 0,
                luyKeGiaiNganDauNamNsnnVonThue: itemLine?.luyKeGiaiNganDauNamNsnnVonThue ? itemLine?.luyKeGiaiNganDauNamNsnnVonThue : 0,
                luyKeGiaiNganDauNamNsnnVonScl: itemLine?.luyKeGiaiNganDauNamNsnnVonScl ? itemLine?.luyKeGiaiNganDauNamNsnnVonScl : 0,
            }
            item.luyKeGiaiNganDauNamTsoTle = divNumber(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso);
            item.luyKeGiaiNganDauNamNsnnTle = divNumber(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn);
            item.luyKeGiaiNganDauNamNsnnTleVonDt = divNumber(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt);
            item.luyKeGiaiNganDauNamNsnnTleVonThue = divNumber(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue);
            item.luyKeGiaiNganDauNamNsnnTleVonScl = divNumber(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl);
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
            item.level = this.maDanFull.find(e => e.id == item.maDan)?.level;
        })
    }

    getIdCha(maKM: number) {
        return this.maDanFull.find(e => e.id == maKM)?.idCha;
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
                const idCha = this.getIdCha(item.maDan);
                let index: number = this.lstCtietBcao.findIndex(e => e.maDan === idCha);
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => this.getIdCha(e.maDan) === idCha);
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: string) {
        const maDan: number = this.lstCtietBcao.find(e => e.id == id)?.maDan;
        const obj = {
            maKhoanMuc: maDan,
            lstKhoanMuc: this.maDanFull,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách dự án',
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maDan == res.maKhoanMuc);
                if (index == -1) {
                    const data: ItemData = {
                        ...this.initItem,
                        maDan: res.maKhoanMuc,
                        level: this.maDanFull.find(e => e.id == maDan)?.level,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maDan == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maDan == item.id) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            maDan: item.id,
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

    getDeleteStatus(data: ItemData) {
        if ((this.luyKeDetail.findIndex(e => e.maDan == data.maDan) != -1) && this.getLowStatus(data.stt)) {
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
                maDan: data.maDan,
                ddiemXdung: data.ddiemXdung, // pl 3
                qddtSoQdinh: data.qddtSoQdinh,
                ghiChu: data.ghiChu, // pl 3
                khoachThienNdungCviecThangConLaiNam: data.khoachThienNdungCviecThangConLaiNam, // pl 3
                ndungCviecDangThien: data.ndungCviecDangThien, // pl 3
                ndungCviecHthanhCuoiThang: data.ndungCviecHthanhCuoiThang, // pl 3
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].qddtTmdtTso = sumNumber([this.lstCtietBcao[index].qddtTmdtTso, item.qddtTmdtTso]);
                    this.lstCtietBcao[index].qddtTmdtNsnn = sumNumber([this.lstCtietBcao[index].qddtTmdtNsnn, item.qddtTmdtNsnn]);
                    this.lstCtietBcao[index].luyKeVonTso = sumNumber([this.lstCtietBcao[index].luyKeVonTso, item.luyKeVonTso]);
                    this.lstCtietBcao[index].luyKeVonNsnn = sumNumber([this.lstCtietBcao[index].luyKeVonNsnn, item.luyKeVonNsnn]);
                    this.lstCtietBcao[index].luyKeVonDt = sumNumber([this.lstCtietBcao[index].luyKeVonDt, item.luyKeVonDt]);
                    this.lstCtietBcao[index].luyKeVonThue = sumNumber([this.lstCtietBcao[index].luyKeVonThue, item.luyKeVonThue]);
                    this.lstCtietBcao[index].luyKeVonScl = sumNumber([this.lstCtietBcao[index].luyKeVonScl, item.luyKeVonScl]);
                    this.lstCtietBcao[index].luyKeGiaiNganHetNamTso = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganHetNamTso, item.luyKeGiaiNganHetNamTso]);
                    this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnTso = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnTso, item.luyKeGiaiNganHetNamNsnnTso]);
                    this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnKhNamTruoc = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnKhNamTruoc, item.luyKeGiaiNganHetNamNsnnKhNamTruoc]);
                    this.lstCtietBcao[index].khoachVonNamTruocKeoDaiTso = sumNumber([this.lstCtietBcao[index].khoachVonNamTruocKeoDaiTso, item.khoachVonNamTruocKeoDaiTso]);
                    this.lstCtietBcao[index].khoachVonNamTruocKeoDaiDtpt = sumNumber([this.lstCtietBcao[index].khoachVonNamTruocKeoDaiDtpt, item.khoachVonNamTruocKeoDaiDtpt]);
                    this.lstCtietBcao[index].khoachVonNamTruocKeoDaiVonKhac = sumNumber([this.lstCtietBcao[index].khoachVonNamTruocKeoDaiVonKhac, item.khoachVonNamTruocKeoDaiVonKhac]);
                    this.lstCtietBcao[index].khoachNamVonTso = sumNumber([this.lstCtietBcao[index].khoachNamVonTso, item.khoachNamVonTso]);
                    this.lstCtietBcao[index].khoachNamVonNsnn = sumNumber([this.lstCtietBcao[index].khoachNamVonNsnn, item.khoachNamVonNsnn]);
                    this.lstCtietBcao[index].khoachNamVonDt = sumNumber([this.lstCtietBcao[index].khoachNamVonDt, item.khoachNamVonDt]);
                    this.lstCtietBcao[index].khoachNamVonThue = sumNumber([this.lstCtietBcao[index].khoachNamVonThue, item.khoachNamVonThue]);
                    this.lstCtietBcao[index].khoachNamVonScl = sumNumber([this.lstCtietBcao[index].khoachNamVonScl, item.khoachNamVonScl]);
                    this.lstCtietBcao[index].kluongThienTso = sumNumber([this.lstCtietBcao[index].kluongThienTso, item.kluongThienTso]);
                    this.lstCtietBcao[index].kluongThienThangBcao = sumNumber([this.lstCtietBcao[index].kluongThienThangBcao, item.kluongThienThangBcao]);
                    this.lstCtietBcao[index].giaiNganTso = sumNumber([this.lstCtietBcao[index].giaiNganTso, item.giaiNganTso]);
                    this.lstCtietBcao[index].giaiNganNsnn = sumNumber([this.lstCtietBcao[index].giaiNganNsnn, item.giaiNganNsnn]);
                    this.lstCtietBcao[index].giaiNganNsnnVonDt = sumNumber([this.lstCtietBcao[index].giaiNganNsnnVonDt, item.giaiNganNsnnVonDt]);
                    this.lstCtietBcao[index].giaiNganNsnnVonThue = sumNumber([this.lstCtietBcao[index].giaiNganNsnnVonThue, item.giaiNganNsnnVonThue]);
                    this.lstCtietBcao[index].giaiNganNsnnVonScl = sumNumber([this.lstCtietBcao[index].giaiNganNsnnVonScl, item.giaiNganNsnnVonScl]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamTso = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamTso, item.luyKeGiaiNganDauNamTso]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn, item.luyKeGiaiNganDauNamNsnn]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt, item.luyKeGiaiNganDauNamNsnnVonDt]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue, item.luyKeGiaiNganDauNamNsnnVonThue]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl, item.luyKeGiaiNganDauNamNsnnVonScl]);

                    this.lstCtietBcao[index].giaiNganTsoTle = divNumber(this.lstCtietBcao[index].giaiNganTso, this.lstCtietBcao[index].khoachNamVonTso);
                    this.lstCtietBcao[index].giaiNganNsnnTle = divNumber(this.lstCtietBcao[index].giaiNganNsnn, this.lstCtietBcao[index].khoachNamVonNsnn);
                    this.lstCtietBcao[index].giaiNganNsnnTleVonDt = divNumber(this.lstCtietBcao[index].giaiNganNsnnVonDt, this.lstCtietBcao[index].khoachNamVonDt);
                    this.lstCtietBcao[index].giaiNganNsnnTleVonThue = divNumber(this.lstCtietBcao[index].giaiNganNsnnVonThue, this.lstCtietBcao[index].khoachNamVonThue);
                    this.lstCtietBcao[index].giaiNganNsnnTleVonScl = divNumber(this.lstCtietBcao[index].giaiNganNsnnVonScl, this.lstCtietBcao[index].khoachNamVonScl);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamTsoTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDauNamTso, this.lstCtietBcao[index].khoachNamVonTso);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn, this.lstCtietBcao[index].khoachNamVonNsnn);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonDt = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt, this.lstCtietBcao[index].khoachNamVonDt);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonThue = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue, this.lstCtietBcao[index].khoachNamVonThue);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonScl = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl, this.lstCtietBcao[index].khoachNamVonScl);
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
                this.total.qddtTmdtTso = sumNumber([this.total.qddtTmdtTso, item.qddtTmdtTso]);
                this.total.qddtTmdtNsnn = sumNumber([this.total.qddtTmdtNsnn, item.qddtTmdtNsnn]);
                this.total.luyKeVonTso = sumNumber([this.total.luyKeVonTso, item.luyKeVonTso]);
                this.total.luyKeVonNsnn = sumNumber([this.total.luyKeVonNsnn, item.luyKeVonNsnn]);
                this.total.luyKeVonDt = sumNumber([this.total.luyKeVonDt, item.luyKeVonDt]);
                this.total.luyKeVonThue = sumNumber([this.total.luyKeVonThue, item.luyKeVonThue]);
                this.total.luyKeVonScl = sumNumber([this.total.luyKeVonScl, item.luyKeVonScl]);
                this.total.luyKeGiaiNganHetNamTso = sumNumber([this.total.luyKeGiaiNganHetNamTso, item.luyKeGiaiNganHetNamTso]);
                this.total.luyKeGiaiNganHetNamNsnnTso = sumNumber([this.total.luyKeGiaiNganHetNamNsnnTso, item.luyKeGiaiNganHetNamNsnnTso]);
                this.total.luyKeGiaiNganHetNamNsnnKhNamTruoc = sumNumber([this.total.luyKeGiaiNganHetNamNsnnKhNamTruoc, item.luyKeGiaiNganHetNamNsnnKhNamTruoc]);
                this.total.khoachVonNamTruocKeoDaiTso = sumNumber([this.total.khoachVonNamTruocKeoDaiTso, item.khoachVonNamTruocKeoDaiTso]);
                this.total.khoachVonNamTruocKeoDaiDtpt = sumNumber([this.total.khoachVonNamTruocKeoDaiDtpt, item.khoachVonNamTruocKeoDaiDtpt]);
                this.total.khoachVonNamTruocKeoDaiVonKhac = sumNumber([this.total.khoachVonNamTruocKeoDaiVonKhac, item.khoachVonNamTruocKeoDaiVonKhac]);
                this.total.khoachNamVonTso = sumNumber([this.total.khoachNamVonTso, item.khoachNamVonTso]);
                this.total.khoachNamVonNsnn = sumNumber([this.total.khoachNamVonNsnn, item.khoachNamVonNsnn]);
                this.total.khoachNamVonDt = sumNumber([this.total.khoachNamVonDt, item.khoachNamVonDt]);
                this.total.khoachNamVonThue = sumNumber([this.total.khoachNamVonThue, item.khoachNamVonThue]);
                this.total.khoachNamVonScl = sumNumber([this.total.khoachNamVonScl, item.khoachNamVonScl]);
                this.total.kluongThienTso = sumNumber([this.total.kluongThienTso, item.kluongThienTso]);
                this.total.kluongThienThangBcao = sumNumber([this.total.kluongThienThangBcao, item.kluongThienThangBcao]);
                this.total.giaiNganTso = sumNumber([this.total.giaiNganTso, item.giaiNganTso]);
                this.total.giaiNganNsnn = sumNumber([this.total.giaiNganNsnn, item.giaiNganNsnn]);
                this.total.giaiNganNsnnVonDt = sumNumber([this.total.giaiNganNsnnVonDt, item.giaiNganNsnnVonDt]);
                this.total.giaiNganNsnnVonThue = sumNumber([this.total.giaiNganNsnnVonThue, item.giaiNganNsnnVonThue]);
                this.total.giaiNganNsnnVonScl = sumNumber([this.total.giaiNganNsnnVonScl, item.giaiNganNsnnVonScl]);
                this.total.luyKeGiaiNganDauNamTso = sumNumber([this.total.luyKeGiaiNganDauNamTso, item.luyKeGiaiNganDauNamTso]);
                this.total.luyKeGiaiNganDauNamNsnn = sumNumber([this.total.luyKeGiaiNganDauNamNsnn, item.luyKeGiaiNganDauNamNsnn]);
                this.total.luyKeGiaiNganDauNamNsnnVonDt = sumNumber([this.total.luyKeGiaiNganDauNamNsnnVonDt, item.luyKeGiaiNganDauNamNsnnVonDt]);
                this.total.luyKeGiaiNganDauNamNsnnVonThue = sumNumber([this.total.luyKeGiaiNganDauNamNsnnVonThue, item.luyKeGiaiNganDauNamNsnnVonThue]);
                this.total.luyKeGiaiNganDauNamNsnnVonScl = sumNumber([this.total.luyKeGiaiNganDauNamNsnnVonScl, item.luyKeGiaiNganDauNamNsnnVonScl]);
            }
        })
        this.total.giaiNganTsoTle = divNumber(this.total.giaiNganTso, this.total.khoachNamVonTso);
        this.total.giaiNganNsnnTle = divNumber(this.total.giaiNganNsnn, this.total.khoachNamVonNsnn);
        this.total.giaiNganNsnnTleVonDt = divNumber(this.total.giaiNganNsnnVonDt, this.total.khoachNamVonDt);
        this.total.giaiNganNsnnTleVonThue = divNumber(this.total.giaiNganNsnnVonThue, this.total.khoachNamVonThue);
        this.total.giaiNganNsnnTleVonScl = divNumber(this.total.giaiNganNsnnVonScl, this.total.khoachNamVonScl);
        this.total.luyKeGiaiNganDauNamTsoTle = divNumber(this.total.luyKeGiaiNganDauNamTso, this.total.khoachNamVonTso);
        this.total.luyKeGiaiNganDauNamNsnnTle = divNumber(this.total.luyKeGiaiNganDauNamNsnn, this.total.khoachNamVonNsnn);
        this.total.luyKeGiaiNganDauNamNsnnTleVonDt = divNumber(this.total.luyKeGiaiNganDauNamNsnnVonDt, this.total.khoachNamVonDt);
        this.total.luyKeGiaiNganDauNamNsnnTleVonThue = divNumber(this.total.luyKeGiaiNganDauNamNsnnVonThue, this.total.khoachNamVonThue);
        this.total.luyKeGiaiNganDauNamNsnnTleVonScl = divNumber(this.total.luyKeGiaiNganDauNamNsnnVonScl, this.total.khoachNamVonScl);
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.luyKeVonTso = sumNumber([this.editCache[id].data.luyKeVonNsnn, this.editCache[id].data.luyKeVonDt, this.editCache[id].data.luyKeVonThue, this.editCache[id].data.luyKeVonScl]);
        this.editCache[id].data.khoachVonNamTruocKeoDaiTso = sumNumber([this.editCache[id].data.khoachVonNamTruocKeoDaiDtpt, this.editCache[id].data.khoachVonNamTruocKeoDaiVonKhac]);
        this.editCache[id].data.khoachNamVonTso = sumNumber([this.editCache[id].data.khoachNamVonNsnn, this.editCache[id].data.khoachNamVonDt, this.editCache[id].data.khoachNamVonThue, this.editCache[id].data.khoachNamVonScl]);
        this.editCache[id].data.giaiNganTso = sumNumber([this.editCache[id].data.giaiNganNsnn, this.editCache[id].data.giaiNganNsnnVonDt, this.editCache[id].data.giaiNganNsnnVonThue, this.editCache[id].data.giaiNganNsnnVonScl]);
        this.editCache[id].data.luyKeGiaiNganDauNamTso = sumNumber([this.editCache[id].data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganDauNamTso = sumNumber([data.luyKeGiaiNganDauNamTso, this.editCache[id].data.giaiNganTso, - data.giaiNganTso]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnn = sumNumber([data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.giaiNganNsnn, - data.giaiNganNsnn]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt = sumNumber([data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.giaiNganNsnnVonDt, - data.giaiNganNsnnVonDt]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue = sumNumber([data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.giaiNganNsnnVonThue, - data.giaiNganNsnnVonThue]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl = sumNumber([data.luyKeGiaiNganDauNamNsnnVonScl, this.editCache[id].data.giaiNganNsnnVonScl, - data.giaiNganNsnnVonScl]);

        //tinh ty le
        this.editCache[id].data.giaiNganTsoTle = divNumber(this.editCache[id].data.giaiNganTso, this.editCache[id].data.khoachNamVonTso);
        this.editCache[id].data.giaiNganNsnnTle = divNumber(this.editCache[id].data.giaiNganNsnn, this.editCache[id].data.khoachNamVonNsnn);
        this.editCache[id].data.giaiNganNsnnTleVonDt = divNumber(this.editCache[id].data.giaiNganNsnnVonDt, this.editCache[id].data.khoachNamVonDt);
        this.editCache[id].data.giaiNganNsnnTleVonThue = divNumber(this.editCache[id].data.giaiNganNsnnVonThue, this.editCache[id].data.khoachNamVonThue);
        this.editCache[id].data.giaiNganNsnnTleVonScl = divNumber(this.editCache[id].data.giaiNganNsnnVonScl, this.editCache[id].data.khoachNamVonScl);
        this.editCache[id].data.luyKeGiaiNganDauNamTsoTle = divNumber(this.editCache[id].data.luyKeGiaiNganDauNamTso, this.editCache[id].data.khoachNamVonTso);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTle = divNumber(this.editCache[id].data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.khoachNamVonNsnn);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonDt = divNumber(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.khoachNamVonDt);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonThue = divNumber(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.khoachNamVonThue);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonScl = divNumber(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl, this.editCache[id].data.khoachNamVonScl);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
