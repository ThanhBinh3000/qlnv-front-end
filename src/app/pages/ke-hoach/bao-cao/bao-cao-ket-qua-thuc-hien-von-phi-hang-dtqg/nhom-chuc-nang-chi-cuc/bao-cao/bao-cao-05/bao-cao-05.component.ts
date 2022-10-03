import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogThemVatTuComponent } from 'src/app/components/dialog/dialog-vat-tu/dialog-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, mulNumber, NOT_OK, OK, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";

export class ItemData {
    bcaoCtietId: string;
    id: string;
    header: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdungChi: number;
    maNdungChiCha: number;

    trongDotTcong: number;
    trongDotThoc: number;
    trongDotGao: number;
    luyKeTcong: number;
    luyKeThoc: number;
    luyKeGao: number;
    listCtiet: vatTu[] = [];
    ghiChu: string;
}

export class vatTu {
    id: string;
    maVtu: any;
    loaiMatHang: number;
    sl: number;
}

@Component({
    selector: 'app-bao-cao-05',
    templateUrl: './bao-cao-05.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao05Component implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    listColTemp: any[] = [];
    listVattu: any[] = [];
    lstVatTuFull = [];
    luyKes: ItemData[] = [];
    lstCtietBcao: ItemData[] = [];
    noiDungChis: any[] = [];
    noiDungChiFull: any[] = [];
    dinhMucs: any[] = [];
    //thong tin chung
    id: string;
    maDvi: string;
    thuyetMinh: string;
    maDviTien: string;
    tuNgay: any;
    denNgay: any;
    namBcao: number;
    listIdDelete = "";
    trangThaiPhuLuc = '1';
    idBaoCao: string;        //id bao cao to

    idB: number;
    idB1: number;
    idB2: number;

    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusBtnExport: boolean;
    allChecked = false;
    editMoneyUnit = false;
    isDataAvailable = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private spinner: NgxSpinnerService,
        private userService: UserService,
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
        //lay thong tin chung cho bao cao 04an
        this.id = this.data?.id;
        this.maDvi = this.data?.maDvi;
        this.maDviTien = this.data?.maDviTien ? this.data?.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.statusBtnExport = this.data?.statusBtnExport;
        this.lstCtietBcao = this.data?.lstCtietBcaos;
        this.namBcao = this.data?.namBcao;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.luyKes = this.data?.luyKes.find(item => item.maLoai == '9')?.lstCtietBcaos;

        await this.getListNdung();
        await this.getListVtu();
        await this.getDinhMuc();

        if (this.lstCtietBcao.length > 0) {
            //xap xep lai cac phan tu va lay thong tin cac vat tu da duoc chon
            this.lstCtietBcao?.filter(item => {
                item.listCtiet.sort((a, b) => a.maVtu - b.maVtu);
            });
            this.lstCtietBcao[0]?.listCtiet.forEach(item => {
                if (item.loaiMatHang == 0) {
                    this.listColTemp.push({
                        id: item.id,
                        maVtu: item.maVtu,
                        colName: this.lstVatTuFull.find(e => e.id == item.maVtu)?.ten,
                    });
                }
            });
        } else {
            if (this.luyKes.length > 0) {
                this.luyKes.forEach(item => {
                    item.listCtiet.sort((a, b) => a.maVtu - b.maVtu);
                });
                this.luyKes[0].listCtiet.forEach(item => {
                    if (item.loaiMatHang == 0) {
                        this.listColTemp.push({
                            id: item.id,
                            maVtu: item.maVtu,
                            colName: this.lstVatTuFull.find(e => e.id == item.maVtu)?.ten,
                        });
                    }
                })
                this.luyKes.forEach(item => {
                    const lstCtiet: vatTu[] = [];
                    item.listCtiet.forEach(e => {
                        lstCtiet.push({
                            ...e,
                            sl: e.loaiMatHang == 0 ? 0 : e.sl,
                        })
                    })
                    this.lstCtietBcao.push({
                        ...item,
                        listCtiet: lstCtiet,
                        trongDotTcong: 0,
                        header: '5-B',
                        id: uuid.v4() + 'FE',
                    })
                })
            } else {
                const dataPL = new ItemData();
                this.noiDungChiFull.forEach(element => {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: element.id,
                        maVtu: element.id,
                        level: element.level,
                        stt: element.ma,
                        header: '5-B',
                        listCtiet: [],
                        id: uuid.v4() + "FE",
                    };
                    this.lstCtietBcao.push(data);
                });
            }
        }

        //sap xep lai so thu tu
        if (!this.lstCtietBcao[0].stt) {
            const lstTemp = [];
            await this.noiDungChiFull.forEach(element => {
                const temp: ItemData = this.lstCtietBcao.find(item => item.maNdungChi == element.id);
                if (temp) {
                    lstTemp.push(temp);
                }
            });
            this.lstCtietBcao = lstTemp;
            this.sortWithoutIndex();
        } else {
            this.sortByIndex();
        }

        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    async getListNdung() {
        //lay danh muc noi dung chi
        await this.danhMucService.dMNoiDungChi05().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.noiDungChis = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.noiDungChis.forEach(item => {
            if (!item.maCha) {
                this.noiDungChiFull.push({
                    ...item,
                    tenDm: item.giaTri,
                    ten: item.giaTri,
                    level: 0,
                    idCha: 0,
                })
            }
        })
        this.addListNoiDungChi(this.noiDungChiFull);
        this.noiDungChiFull.sort((item1, item2) => {
            if (item1.level > item2.level) {
                return -1;
            }
            if (item1.level < item2.level) {
                return 1;
            }
            if (this.getTail(item1.ma) > this.getTail(item2.ma)) {
                return 1;
            }
            if (this.getTail(item1.ma) < this.getTail(item2.ma)) {
                return -1;
            }
            return 0;
        });
        this.idB = this.noiDungChiFull.find(e => e.ma == '0.2')?.id;
        this.idB1 = this.noiDungChiFull.find(e => e.ma == '0.2.1')?.id;
        this.idB2 = this.noiDungChiFull.find(e => e.ma == '0.2.2')?.id;
    }

    addListNoiDungChi(noiDungChiTemp) {
        const a = [];
        noiDungChiTemp.forEach(item => {
            this.noiDungChis.forEach(el => {
                if (item.ma == el.maCha) {
                    el = {
                        ...el,
                        tenDm: el.giaTri,
                        ten: el.giaTri,
                        level: item.level + 1,
                        idCha: item.id,
                    }
                    this.noiDungChiFull.push(el);
                    a.push(el);
                }
            });
        })
        if (a.length > 0) {
            this.addListNoiDungChi(a);
        }
    }

    async getListVtu() {
        //lay danh sach vat tu
        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVattu = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.listVattu.forEach(data => {
            switch (data.ma) {
                case '04':
                    data.child.forEach(item => {
                        this.lstVatTuFull.push({
                            ...item,
                            tenDm: item.ten,
                        })
                    })
                    break;
                case '01':
                    data.child.forEach(item => {
                        this.lstVatTuFull.push({
                            ...item,
                            tenDm: item.ten,
                        })
                    })
                    break;
                case '02':
                    data.child.forEach(item => {
                        item.child.forEach(e => {
                            this.lstVatTuFull.push({
                                ...e,
                                tenDm: e.ten,
                            })
                        })
                    })
                    break;
                default:
                    break;
            }
        })
    }

    getDinhMuc() {
        const request = {
            loaiDinhMuc: '03',
            loaiBaoQuan: 'LDM',
            maDvi: this.maDvi,
        }
        this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dinhMucs = res.data;
                    this.dinhMucs.forEach(item => {
                        if (!item.loaiVthh.startsWith('04')) {
                            item.nvChuyenMonKv = divNumber(item.nvChuyenMonKv, 1000);
                            item.nvChuyenMonTc = divNumber(item.nvChuyenMonTc, 1000);
                            item.tcDieuHanhKv = divNumber(item.tcDieuHanhKv, 1000);
                            item.tcDieuHanhTc = divNumber(item.tcDieuHanhTc, 1000);
                            item.ttCaNhanKv = divNumber(item.ttCaNhanKv, 1000);
                            item.ttCaNhanTc = divNumber(item.ttCaNhanTc, 1000);
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
        if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    //show popup tu choi dùng cho nut ok - not ok
    async pheDuyetChiTiet(mcn: string) {
        this.spinner.show();
        if (mcn == OK) {
            await this.pheDuyetBieuMau(mcn, null);
        } else if (mcn == NOT_OK) {
            const modalTuChoi = this.modal.create({
                nzTitle: 'Not OK',
                nzContent: DialogTuChoiComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzWidth: '900px',
                nzFooter: null,
                nzComponentParams: {},
            });
            modalTuChoi.afterClose.toPromise().then(async (text) => {
                if (text) {
                    await this.pheDuyetBieuMau(mcn, text);
                }
            });
        }
        this.spinner.hide();
    }

    //call api duyet bieu mau
    async pheDuyetBieuMau(trangThai: any, lyDo: string) {
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                trangThai: trangThai,
                lyDoTuChoi: lyDo,
            };
            this.spinner.show();
            await this.quanLyVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = trangThai;
                    this.getStatusButton();
                    this.dataChange.emit(data.data);
                    if (trangThai == '0') {
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
        this.spinner.hide();
    }

    async saveAppendix(maChucNang: string) {
        // validate nguoi thuc hien bao cao
        if (!this.data.nguoiBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
            return;
        }
        // validate bao cao
        if (this.id?.length != 36) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.SAVEREPORT);
            return;
        }

        const baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCtietBcao));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = this.tuNgay;
        baoCaoChiTietTemp.denNgay = this.denNgay;
        baoCaoChiTietTemp.trangThai = maChucNang;

        //kiem tra cac dong du lieu da dc luu chua
        let checkSaveEdit = true;
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
            if (this.editCache[data.id].edit == true) {
                checkSaveEdit = false;
                return;
            }
            if (data.id?.length == 38) {
                data.id = null;
            }
        })
        if (!checkSaveEdit) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai tien va check do lon cua tien
        let checkMoneyRange = true;
        baoCaoChiTietTemp.lstCtietBcaos.forEach(item => {
            if (item.trongDotTcong > MONEY_LIMIT || item.luyKeTcong > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
        })
        if (!checkMoneyRange) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        //call service cap nhat phu luc
        this.spinner.show();
        this.quanLyVonPhiService.baoCaoCapNhatChiTiet(baoCaoChiTietTemp).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    this.dataChange.emit(data.data);
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.spinner.hide();
                }
            },
            err => {
                this.spinner.hide();
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        if (str) {
            str = str.substring(str.indexOf('.') + 1, str.length);
            let xau = "";
            const chiSo: string[] = str.split('.');
            const n: number = chiSo.length - 1;
            let k: number = parseInt(chiSo[n], 10);
            if (n == 0) {
                xau = String.fromCharCode(k + 96).toUpperCase();
            }
            if (n == 1) {
                k = k - 4;
                for (let i = 0; i < this.soLaMa.length; i++) {
                    while (k >= this.soLaMa[i].gTri) {
                        xau += this.soLaMa[i].kyTu;
                        k -= this.soLaMa[i].gTri;
                    }
                }
            }
            if (n == 2) {
                xau = (parseInt(chiSo[n], 10)).toString();
            }
            if (n == 3) {
                xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
            }
            if (n == 4) {
                xau = "-";
            }
            if (n == 5) {
                xau = "+";
            }
            return xau;
        }
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
        const index: number = this.lstCtietBcao.findIndex(e => e.id == id); // vi tri hien tai
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
        const listVtu: vatTu[] = [];
        const itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            const objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: 0,
                sl: 0,
            };
            const objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: 1,
                sl: 0,//itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });


        // them moi phan tu
        if (initItem?.id) {
            const item = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
                maLoai: '9',
                //listCtiet: listVtu,
            }
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            const item = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: head + "." + (tail + 1).toString(),
                maLoai: '9',
                listCtiet: listVtu,
                maNdungChiCha: Number(this.lstCtietBcao[index].maNdungChiCha),
            }
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            const data: vatTu[] = [];
            item.listCtiet.forEach(e => {
                data.push({ ...e });
            })
            this.editCache[item.id] = {
                edit: false,
                data: {
                    ...item,
                    listCtiet: data,
                }
            };
        });
    }
    //thêm cấp thấp hơn
    addLow(id: string, initItem: ItemData) {
        const data = this.lstCtietBcao.find(e => e.id == id);
        let index: number = this.lstCtietBcao.findIndex(e => e.id == id); // vi tri hien tai
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

        const listVtu: vatTu[] = [];
        const itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            const objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: 0,
                sl: 0,
            };
            const objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: 1,
                sl: 0,//itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });

        // them moi phan tu
        if (initItem?.id) {
            const item = {
                ...initItem,
                stt: stt,
                //listCtiet: listVtu,
            }
            this.lstCtietBcao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
                this.sum(stt);
            }
            const item = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
                listCtiet: listVtu,
                maNdungChiCha: Number(this.lstCtietBcao[index].maNdungChi),
            }
            this.lstCtietBcao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }
    //xóa dòng
    deleteLine(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id == id); // vi tri hien tai
        // khong tim thay thi out ra
        if (index == -1) return;
        const stt: string = this.lstCtietBcao[index].stt;
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = this.lstCtietBcao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.calcuDeviant(this.lstCtietBcao[index].maNdungChi);
        if (this.lstCtietBcao[index].maNdungChi != 13869 && this.lstCtietBcao[index].maNdungChi != 13841) {
            this.sum(this.lstCtietBcao[index].stt);
        }
        const soLuongThucHienGop = this.lstCtietBcao.find(item => item.stt == '0.1.2');
        const soLuongThucHienNamTruoc = this.lstCtietBcao.find(item => item.stt == '0.1.3');
        const soLuongThucHienNamNay = this.lstCtietBcao.find(item => item.stt == '0.1.4');
        if (soLuongThucHienGop) {
            soLuongThucHienGop?.listCtiet?.forEach(item => {
                item.sl = sumNumber([soLuongThucHienNamTruoc?.listCtiet?.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl,
                soLuongThucHienNamNay?.listCtiet?.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl]);
            })
            soLuongThucHienGop.trongDotTcong = sumNumber([soLuongThucHienNamTruoc.trongDotTcong, soLuongThucHienNamNay.trongDotTcong]);
            soLuongThucHienGop.luyKeTcong = sumNumber([soLuongThucHienNamTruoc.luyKeTcong, soLuongThucHienNamNay.luyKeTcong]);
        }
        //tinh toan hieu cua muc B
        let index1: number;
        if (this.lstCtietBcao[index].maNdungChi == this.idB1) {
            index1 = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.idB2);
        }
        if (this.lstCtietBcao[index].maNdungChi == this.idB2) {
            index1 = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.idB1);
        }
        if ((index1 || index1 === 0) && index1 != -1) {
            const indexTong = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.idB);
            this.lstCtietBcao[index1].trongDotTcong = this.lstCtietBcao[indexTong].trongDotTcong - this.lstCtietBcao[index].trongDotTcong;
            this.lstCtietBcao[index1].luyKeTcong = this.lstCtietBcao[indexTong].luyKeTcong - this.lstCtietBcao[index].luyKeTcong;
            this.lstCtietBcao[index1].listCtiet.forEach(item => {
                item.sl = sumNumber([this.lstCtietBcao[indexTong].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl,
                -this.lstCtietBcao[index].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl])
            })
        }

        //tinh dinh muc
        const maId = this.noiDungChiFull.find(e => e.id == this.lstCtietBcao[index].maNdungChi)?.ma;
        if (maId == '0.1.1') {
            this.tinhDinhMuc(this.lstCtietBcao[index]);
        }
    }

    findId(ma: string) {
        return this.noiDungChiFull.find(e => e.ma == ma)?.id;
    }

    tinhDinhMuc(data: ItemData) {
        const soLuong = [];
        data.listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                soLuong.push({
                    maVtu: item.maVtu,
                    sl: item.sl,
                })
            }
        })
        const nvChuyenMon = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.findId('0.1.5.1.1'));
        const ttCaNhan = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.findId('0.1.5.1.2'));
        const cucDh = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.findId('0.1.5.2'));
        const tongCucDh = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.findId('0.1.5.3'));

        this.lstCtietBcao[nvChuyenMon].listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                const maVtu = this.lstVatTuFull.find(e => e.id == item.maVtu)?.ma;
                const dm = this.dinhMucs.find(e => e.loaiVthh == maVtu);
                if (this.userService.isChiCuc()) {
                    item.sl = mulNumber(sl, dm.nvChuyenMonDviTt);
                } else {
                    item.sl = mulNumber(sl, sumNumber([dm.nvChuyenMonDviTt, dm.nvChuyenMonVp]));
                }
            }
        })
        this.tinhTongDm(nvChuyenMon);

        this.lstCtietBcao[ttCaNhan].listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                const maVtu = this.lstVatTuFull.find(e => e.id == item.maVtu)?.ma;
                const dm = this.dinhMucs.find(e => e.loaiVthh == maVtu);
                if (this.userService.isChiCuc()) {
                    item.sl = mulNumber(sl, dm.ttCaNhanDviTt);
                } else {
                    item.sl = mulNumber(sl, sumNumber([dm.ttCaNhanDviTt, dm.ttCaNhanVp]));
                }
            }
        })
        this.tinhTongDm(ttCaNhan);

        this.lstCtietBcao[cucDh].listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                const maVtu = this.lstVatTuFull.find(e => e.id == item.maVtu)?.ma;
                const dm = this.dinhMucs.find(e => e.loaiVthh == maVtu);
                if (this.userService.isChiCuc()) {
                    item.sl = mulNumber(sl, dm.dieuHanhDviTt);
                } else {
                    item.sl = mulNumber(sl, sumNumber([dm.dieuHanhDviTt, dm.dieuHanhVp]));
                }
            }
        })
        this.tinhTongDm(cucDh);

        this.lstCtietBcao[tongCucDh].listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                const maVtu = this.lstVatTuFull.find(e => e.id == item.maVtu)?.ma;
                const dm = this.dinhMucs.find(e => e.loaiVthh == maVtu);
                item.sl = mulNumber(sl, dm.tcDhNvCm);
            }
        })
        this.tinhTongDm(tongCucDh);

        this.sum(this.lstCtietBcao[nvChuyenMon].stt);
    }

    tinhTongDm(index: number) {
        const itemLine = this.luyKes?.find(item => item.maNdungChi == this.lstCtietBcao[index].maNdungChi)?.listCtiet;
        this.lstCtietBcao[index].trongDotTcong = 0;
        this.lstCtietBcao[index].luyKeTcong = 0;
        this.lstCtietBcao[index].listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                this.lstCtietBcao[index].trongDotTcong += item.sl;
            } else {
                const slTrongDot = this.lstCtietBcao[index].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == 0)?.sl;
                let slLuyKe = 0;
                if (itemLine) {
                    slLuyKe = itemLine.find(e => e.maVtu == item.maVtu && e.loaiMatHang == 1)?.sl ? itemLine.find(e => e.maVtu == item.maVtu && e.loaiMatHang == 1)?.sl : 0;
                }

                item.sl = sumNumber([slTrongDot, slLuyKe]);
                this.lstCtietBcao[index].luyKeTcong += item.sl;
            }
        })
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
            if (item.level > 2) {
                item.checked = this.allChecked;
            }
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
        const listVtu: vatTu[] = [];
        const itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            const objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: 0,
                sl: 0,
            };
            const objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: 1,
                sl: 0,//itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });
        let item;
        if (initItem?.id) {
            item = {
                ...initItem,
                stt: "0.1",
                //listCtiet: listVtu,
            }
        } else {
            item = {
                ...initItem,
                id: uuid.v4() + 'FE',
                stt: "0.1",
                listCtiet: listVtu,
            }
        }
        this.lstCtietBcao.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
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
            item.level = this.noiDungChiFull.find(e => e.id == item.maNdungChi)?.level;
        })
    }

    getIdCha(maKM: number) {
        return this.noiDungChiFull.find(e => e.id == maKM)?.idCha;
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
                const idCha = this.getIdCha(item.maNdungChi);
                let index: number = this.lstCtietBcao.findIndex(e => e.maNdungChi === idCha);
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => this.getIdCha(e.maNdungChi) === idCha);
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: string) {
        const dataPL = new ItemData();
        const lstKmTemp = this.noiDungChiFull;
        const maKm = this.lstCtietBcao.find(e => e.id == id)?.maNdungChi;
        const obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
            baoCaos: this.lstCtietBcao,
            tab: '9',
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogThemVatTuComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalIn.afterClose.subscribe(async (res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdungChi == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: res.maKhoanMuc,
                        maVtu: res.maKhoanMuc,
                        level: lstKmTemp.find(e => e.id == maKm)?.level,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        await this.addFirst(data);
                    } else {
                        await this.addSame(id, data);
                        //tinh lai luy ke cho lop cha
                        this.sum(this.lstCtietBcao.find(e => e.id == id).stt);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdungChi == res.maKhoanMuc)?.id;

                res.lstKhoanMuc.forEach(item => {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: item.id,
                        maVtu: item.id,
                        level: item.level,
                    };
                    this.addLow(id, data);
                })
                this.sum(this.lstCtietBcao.find(e => e.id == id).stt + '.1');
                this.updateEditCache();
            }
        });
    }

    getLowStatus(str: string) {
        //kiem tra xem hang dang xet cos phai la hieu cua 2 hang khac ko
        const maNdung = this.lstCtietBcao.find(e => e.stt == str)?.maNdungChi;
        if (this.noiDungChiFull.find(e => e.id == maNdung)?.ma.startsWith('0.1.5')) {
            return true;
        }
        if (this.getRoleCalculate(maNdung) == '7') {
            return true;
        }
        //kiem tra xem co ton tai ban ghi level con hay ko
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    tinhTong(id: any) {
        //luy ke default
        const itemLine = this.luyKes?.find(item => item.maNdungChi == this.editCache[id].data.maNdungChi)?.listCtiet;

        let tongTrongDot = 0;
        let tongLuyke = 0;
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == 0) {
                    tongTrongDot = sumNumber([tongTrongDot, e.sl]);
                    //set luy ke tuong ung = luy ke default + chi tiet theo dot
                    const sl = itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == 1)?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == 1)?.sl : 0;
                    this.editCache[id].data.listCtiet.find(a => a.maVtu == e.maVtu && a.loaiMatHang == 1).sl = sumNumber([sl, e.sl]);
                }
            })
        }

        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == 1) {
                    tongLuyke = sumNumber([tongLuyke, e.sl]);
                }
            })
        }
        this.editCache[id].data.trongDotTcong = tongTrongDot;
        this.editCache[id].data.luyKeTcong = tongLuyke;
    }

    addAllCol() {
        const lstDviChon = this.lstVatTuFull.filter(item => this.listColTemp?.findIndex(data => data.maVtu == item.id) == -1);
        const obj = {
            danhSachDonVi: lstDviChon,
            multi: true,
        }
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách vật tư',
            nzContent: DialogLuaChonThemDonViComponent,
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
                res.forEach(async item => {
                    this.addCol(item);
                })
            }
            this.updateEditCache();
        });
    }

    addCol(vatTu: any) {
        this.lstCtietBcao.forEach(data => {
            const itemLine = this.luyKes?.find(item => item.maNdungChi == data.maNdungChi)?.listCtiet;
            const objTrongD = {
                id: uuid.v4() + 'FE',
                maVtu: vatTu.id,
                loaiMatHang: 0,
                sl: 0,
            }
            const objLke = {
                id: uuid.v4() + 'FE',
                maVtu: vatTu.id,
                loaiMatHang: 1,
                sl: 0,//itemLine?.find(item => item.maVtu == vatTu.id && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == vatTu.id && item.loaiMatHang == '1')?.sl : 0,
            }
            data.listCtiet.push(objTrongD);
            data.listCtiet.push(objLke);
        })
        this.listColTemp.push({
            id: uuid.v4() + 'FE',
            maVtu: vatTu.id,
            colName: vatTu.ten,
        });
    }

    deleteCol(maVtu: string) {
        this.lstCtietBcao.forEach(data => {
            data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
        })
        this.tinhTong2();
        this.updateEditCache();
        this.listColTemp = this.listColTemp.filter(e => e.maVtu != maVtu);
    }

    tinhTong2() {
        this.lstCtietBcao.forEach(e => {
            let tonglstChitietVtuTrongDot = 0;
            let tonglstChitietVtuLuyke = 0;
            e.listCtiet.forEach(el => {
                if (el.loaiMatHang == 0) {
                    tonglstChitietVtuTrongDot = sumNumber([tonglstChitietVtuTrongDot, el.sl]);
                } else {
                    tonglstChitietVtuLuyke = sumNumber([tonglstChitietVtuLuyke, el.sl]);
                }
            });
            e.trongDotTcong = tonglstChitietVtuTrongDot;
            e.luyKeTcong = tonglstChitietVtuLuyke;
        })
    }

    sum(stt: string) {
        const dataPL = new ItemData();
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            data.listCtiet.filter(el => el.sl = 0);
            this.lstCtietBcao[index] = {
                ...dataPL,
                id: data.id,
                stt: data.stt,
                header: data.header,
                checked: data.checked,
                level: data.level,
                bcaoCtietId: data.bcaoCtietId,
                maNdungChi: data.maNdungChi,
                maNdungChiCha: data.maNdungChiCha,
                listCtiet: data.listCtiet,
                ghiChu: data.ghiChu,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].trongDotTcong = sumNumber([this.lstCtietBcao[index].trongDotTcong, item.trongDotTcong]);
                    this.lstCtietBcao[index].luyKeTcong = sumNumber([this.lstCtietBcao[index].luyKeTcong, item.luyKeTcong]);
                    this.lstCtietBcao[index].listCtiet.filter(el => {
                        const sl = item.listCtiet.find(e => e.loaiMatHang == el.loaiMatHang && e.maVtu == el.maVtu).sl
                        el.sl = sumNumber([el.sl, sl]);
                    })
                }
            })
            this.calcuDeviant(data.maNdungChi);
            if (data.maNdungChi == 13847) {
                const ind1 = this.lstCtietBcao.findIndex(e => e.maNdungChi == 13868);
                const ind2 = this.lstCtietBcao.findIndex(e => e.maNdungChi == 13869);
                const ind3 = this.lstCtietBcao.findIndex(e => e.maNdungChi == 13841);
                if (ind1 != -1) {
                    this.lstCtietBcao[ind1].trongDotTcong = this.lstCtietBcao[index].trongDotTcong;
                    this.lstCtietBcao[ind1].luyKeTcong = this.lstCtietBcao[index].luyKeTcong;
                    if (ind3 != -1) {
                        this.lstCtietBcao[ind3].trongDotTcong = sumNumber([this.lstCtietBcao[ind1].trongDotTcong, ind2 == -1 ? 0 : this.lstCtietBcao[ind2].trongDotTcong]);
                        this.lstCtietBcao[ind3].luyKeTcong = sumNumber([this.lstCtietBcao[ind1].luyKeTcong, ind2 == -1 ? 0 : this.lstCtietBcao[ind2].luyKeTcong]);
                    }
                    this.lstCtietBcao[ind1].listCtiet.forEach(item => {
                        item.sl = this.lstCtietBcao[index].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl;
                        if (ind3 != -1) {
                            const subIndex = this.lstCtietBcao[ind3].listCtiet.findIndex(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu);
                            const sl1: number = ind2 == -1 ? 0 : this.lstCtietBcao[ind2].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu)?.sl;
                            this.lstCtietBcao[ind3].listCtiet[subIndex].sl = sumNumber([item.sl, - sl1]);
                        }
                    })
                }
            }
            stt = this.getHead(stt);
        }
        this.updateEditCache();
    }

    export() {
        this.quanLyVonPhiService.exportBaoCao(this.id, this.idBaoCao).toPromise().then(
            (data) => {
                fileSaver.saveAs(data, '05BCBPQ.xlsx');
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    // action print
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

    //
    getRoleCalculate(maNdung: number): string {
        const str: string = this.noiDungChiFull.find(e => e.id == maNdung)?.ma;
        const index: string[] = str.split('.');
        return index[2];
    }
    //tra ve ma de kiem tra xem co dung III = II - I
    getMaCap(maNdung: number): string {
        return this.noiDungChiFull.find(e => e.id == maNdung)?.ghiChu;
    }
    //tinh toan chech lech giua cac hang
    calcuDeviant(maNdung: number) {
        //debugger
        const maCap = this.noiDungChiFull.find(e => e.id == maNdung)?.ghiChu;
        if (maCap || maCap === 0) {
            const indexI: number = this.lstCtietBcao.findIndex(e => this.getMaCap(e.maNdungChi) == maCap && this.getRoleCalculate(e.maNdungChi) == '5');
            const indexII: number = this.lstCtietBcao.findIndex(e => this.getMaCap(e.maNdungChi) == maCap && this.getRoleCalculate(e.maNdungChi) == '6');
            const indexIII: number = this.lstCtietBcao.findIndex(e => this.getMaCap(e.maNdungChi) == maCap && this.getRoleCalculate(e.maNdungChi) == '7');
            if (indexIII != -1) {
                this.lstCtietBcao[indexIII].trongDotTcong = sumNumber([indexI == -1 ? 0 : this.lstCtietBcao[indexI].trongDotTcong, indexII == -1 ? 0 : -this.lstCtietBcao[indexII].trongDotTcong]);
                this.lstCtietBcao[indexIII].luyKeTcong = sumNumber([indexI == -1 ? 0 : this.lstCtietBcao[indexI].luyKeTcong, indexII == -1 ? 0 : -this.lstCtietBcao[indexII].luyKeTcong]);
                this.lstCtietBcao[indexIII].listCtiet.forEach(item => {
                    const value1 = indexI == -1 ? 0 : this.lstCtietBcao[indexI].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
                    const value2 = indexII == -1 ? 0 : this.lstCtietBcao[indexII].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
                    item.sl = sumNumber([value1, - value2]);
                })

            }
        }
    }

    statusDeleteRow(item: ItemData) {
        if (this.luyKes.findIndex(e => e.maNdungChi == item.maNdungChi) != -1) {
            return false;
        }
        if (item.level > 2) {
            return false;
        }
        return true;
    }

    statusDeleteCol(maVtu: number) {
        if (this.luyKes.length > 0) {
            if (this.luyKes[0].listCtiet.findIndex(e => e.maVtu == maVtu) != -1) {
                return true;
            }
        }
        return false;
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    displayNumber(num: number): string {
        return displayNumber(num);
    }
    //check xem co phai so luong ko
    checkNumber(id: number) {
        const ma = this.noiDungChiFull.find(e => e.id == id)?.ma;
        if (ma == '0.1.1' || ma == '0.1.2' || ma == '0.1.3' || ma == '0.1.4') {
            return true;
        }
        return false;
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }
}
