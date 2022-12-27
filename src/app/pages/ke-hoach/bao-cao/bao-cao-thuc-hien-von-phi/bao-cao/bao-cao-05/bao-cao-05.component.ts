import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogThemVatTuComponent } from 'src/app/components/dialog/dialog-vat-tu/dialog-vat-tu.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { findIndex, getHead, getTail } from 'src/app/Utility/func';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, mulNumber, NOT_OK, OK, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";

export class ItemData {
    id: string;
    header: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdungChi: string;
    tenNdung: string;
    trongDotTcong: number;
    luyKeTcong: number;
    listCtiet: vatTu[] = [];
    ghiChu: string;
}

export class vatTu {
    id: string;
    maVtu: string;
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
    listVtus: any[] = [];
    luyKes: ItemData[] = [];
    lstCtietBcao: ItemData[] = [];
    noiDungChis: any[] = [];
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
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
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
        this.idBaoCao = this.data?.idBaoCao;
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
        this.listVtus = this.data?.lstVtus;

        await this.getListNdung();
        await this.getDinhMuc();
        if (this.lstCtietBcao.length == 0) {
            if (this.luyKes.length > 0) {
                this.luyKes.forEach(item => {
                    const lstCtiet: vatTu[] = [];
                    item.listCtiet.forEach(e => {
                        lstCtiet.push({
                            ...e,
                            sl: (e.loaiMatHang == 1 || !this.data?.dotBcao) ? e.sl : 0,
                        })
                    })
                    this.lstCtietBcao.push({
                        ...item,
                        listCtiet: lstCtiet,
                        trongDotTcong: !this.data?.dotBcao ? item.trongDotTcong : 0,
                        tenNdung: this.noiDungChis.find(e => e.ma == item.maNdungChi)?.giaTri,
                        id: uuid.v4() + 'FE',
                    })
                })
            } else {
                this.noiDungChis.forEach(item => {
                    this.lstCtietBcao.push({
                        ...new ItemData(),
                        maNdungChi: item.ma,
                        tenNdung: item.giaTri,
                        stt: item.ma,
                        listCtiet: [],
                        id: uuid.v4() + "FE",
                    })
                });
            }
        } else {
            this.lstCtietBcao.forEach(item => {
                item.tenNdung = this.noiDungChis.find(e => e.ma == item.maNdungChi)?.giaTri;
            })
        }

        this.lstCtietBcao.forEach(item => {
            item.listCtiet.sort((a, b) => parseInt(a.maVtu, 10) - parseInt(b.maVtu, 10));
        })

        //lay thong tin cua cac cot
        this.lstCtietBcao[0]?.listCtiet.forEach(item => {
            if (item.loaiMatHang == 0) {
                this.listColTemp.push({
                    id: item.id,
                    maVtu: item.maVtu,
                    colName: this.listVtus.find(e => e.ma == item.maVtu)?.ten,
                });
            }
        });

        //sap xep lai so thu tu
        if (!this.lstCtietBcao[0].stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maNdungChi;
            })
        }

        if (this.trangThaiPhuLuc == '3' && this.data?.isOffice) {
            this.tinhDinhMuc(this.lstCtietBcao.find(e => e.maNdungChi == '0.1.1'));
        }

        this.sortByIndex();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    async getListNdung() {
        //lay danh muc noi dung chi
        await this.quanLyVonPhiService.getListCategory('NOI_DUNG_CHI05').toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    res.data.forEach(item => {
                        this.noiDungChis.push({
                            ...item,
                            level: item.ma?.split('.').length - 2,
                        })
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '03',
            loaiBaoQuan: 'LD',
            maDvi: this.maDvi,
        }
        await this.baoCaoThucHienVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dinhMucs = res.data;
                    this.dinhMucs.forEach(item => {
                        if (!item.cloaiVthh.startsWith('02')) {
                            item.nvChuyenMonDviTt = (item.nvChuyenMonDviTt ? item.nvChuyenMonDviTt : 0) / 1000;
                            item.nvChuyenMonVp = (item.nvChuyenMonVp ? item.nvChuyenMonVp : 0) / 1000;
                            item.dieuHanhDviTt = (item.dieuHanhDviTt ? item.dieuHanhDviTt : 0) / 1000;
                            item.dieuHanhVp = (item.dieuHanhVp ? item.dieuHanhVp : 0) / 1000;
                            item.ttCaNhanDviTt = (item.ttCaNhanDviTt ? item.ttCaNhanDviTt : 0) / 1000;
                            item.ttCaNhanVp = (item.ttCaNhanVp ? item.ttCaNhanVp : 0) / 1000;
                            item.tcDhNvCm = (item.tcDhNvCm ? item.tcDhNvCm : 0) / 1000;
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
            await this.baoCaoThucHienVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
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
        this.baoCaoThucHienVonPhiService.baoCaoCapNhatChiTiet(baoCaoChiTietTemp).toPromise().then(
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

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = getHead(this.lstCtietBcao[item].stt) + "." + (getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }
    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id == id); // vi tri hien tai
        const head: string = getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const tail: number = getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
        const ind: number = findIndex(this.lstCtietBcao[index].stt, this.lstCtietBcao); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
            if (getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        //them phan tu moi
        const item: ItemData = {
            ...initItem,
            stt: head + "." + (tail + 1).toString(),
        }
        item.level = item.stt.split('.').length - 2;
        if (!initItem?.id) {
            item.id == uuid.v4() + 'FE';
            item.listCtiet = [];
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
                    sl: 0,
                };
                item.listCtiet.push(objTrongD);
                item.listCtiet.push(objLke);
            });
        }

        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
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
        if (this.lstCtietBcao.findIndex(e => getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = findIndex(data.stt, this.lstCtietBcao);
            for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
                if (getHead(this.lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (getTail(this.lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }
        //them moi phan tu
        const item: ItemData = {
            ...initItem,
            stt: stt,
        }
        item.level = item.stt.split('.').length - 2;
        if (!initItem?.id) {
            item.id = uuid.v4() + "FE",
                item.listCtiet = [];
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
                    sl: 0,
                };
                item.listCtiet.push(objTrongD);
                item.listCtiet.push(objLke);
            });
        }
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
    //xóa dòng
    deleteLine(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id == id); // vi tri hien tai
        // khong tim thay thi out ra
        if (index == -1) return;
        const stt: string = this.lstCtietBcao[index].stt;
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (getHead(this.lstCtietBcao[i].stt) == head) {
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
        //nếu kkhác II.1 và  II.2 thì sẽ cộng lên trên mức to hơn nguoc lai thi tru qua lai cho nhau
        if (this.lstCtietBcao[index].maNdungChi != '0.2.1' && this.lstCtietBcao[index].maNdungChi != '0.2.2') {
            this.sum(this.lstCtietBcao[index].stt);
        } else {
            let indexHieu: number;
            if (this.lstCtietBcao[index].maNdungChi == '0.2.1') {
                indexHieu = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.2.2');
            } else {
                indexHieu = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.2.1');
            }
            if (indexHieu != -1) {
                const indexTong = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.2');
                this.lstCtietBcao[indexHieu].trongDotTcong = this.lstCtietBcao[indexTong].trongDotTcong - this.lstCtietBcao[index].trongDotTcong;
                this.lstCtietBcao[indexHieu].luyKeTcong = this.lstCtietBcao[indexTong].luyKeTcong - this.lstCtietBcao[index].luyKeTcong;
                this.lstCtietBcao[indexHieu].listCtiet.forEach(item => {
                    item.sl = sumNumber([this.lstCtietBcao[indexTong].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl,
                    -this.lstCtietBcao[index].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl])
                })
            }
        }

        //tinh toán chênh lệch số lượng giữa các dòng phần trong đó
        if (this.lstCtietBcao[index].maNdungChi == '0.1.3' || this.lstCtietBcao[index].maNdungChi == '0.1.4') {
            const soLuongThucHienGop = this.lstCtietBcao.find(item => item.maNdungChi == '0.1.2');
            const soLuongThucHienNamTruoc = this.lstCtietBcao.find(item => item.maNdungChi == '0.1.3');
            const soLuongThucHienNamNay = this.lstCtietBcao.find(item => item.maNdungChi == '0.1.4');
            if (soLuongThucHienGop) {
                soLuongThucHienGop?.listCtiet?.forEach(item => {
                    item.sl = sumNumber([soLuongThucHienNamTruoc?.listCtiet?.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl,
                    soLuongThucHienNamNay?.listCtiet?.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl]);
                })
                soLuongThucHienGop.trongDotTcong = sumNumber([soLuongThucHienNamTruoc.trongDotTcong, soLuongThucHienNamNay.trongDotTcong]);
                soLuongThucHienGop.luyKeTcong = sumNumber([soLuongThucHienNamTruoc.luyKeTcong, soLuongThucHienNamNay.luyKeTcong]);
            }
        }

        //tinh dinh muc
        if (this.lstCtietBcao[index].maNdungChi == '0.1.1') {
            this.tinhDinhMuc(this.lstCtietBcao[index]);
        }

        this.updateEditCache();
    }

    getDmValue(cuc: number, vp: number) {
        if (this.userService.isChiCuc()) {
            return cuc;
        }
        if (this.data.isOffice) {
            return vp;
        }
        return sumNumber([cuc, vp]);
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
        const nvChuyenMon = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.1.5.1.2');
        const ttCaNhan = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.1.5.1.1');
        // const cucDh = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.1.5.2');
        const tongCucDh = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.1.5.2');

        if (nvChuyenMon) {
            this.lstCtietBcao[nvChuyenMon].listCtiet.forEach(item => {
                if (item.loaiMatHang == 0) {
                    const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                    const dm = this.dinhMucs.find(e => e.cloaiVthh == item.maVtu);
                    if (dm) {
                        item.sl = mulNumber(sl, this.getDmValue(dm.nvChuyenMonDviTt, dm.nvChuyenMonVp));
                    }
                }
            })
            this.tinhTongDm(nvChuyenMon);
            this.sum(this.lstCtietBcao[nvChuyenMon].stt);
        }

        if (ttCaNhan) {
            this.lstCtietBcao[ttCaNhan].listCtiet.forEach(item => {
                if (item.loaiMatHang == 0) {
                    const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                    const dm = this.dinhMucs.find(e => e.cloaiVthh == item.maVtu);
                    if (dm) {
                        item.sl = mulNumber(sl, this.getDmValue(dm.ttCaNhanDviTt, dm.ttCaNhanVp));
                    }
                }
            })
            this.tinhTongDm(ttCaNhan);
            this.sum(this.lstCtietBcao[ttCaNhan].stt);
        }

        // if (cucDh) {
        //     this.lstCtietBcao[cucDh].listCtiet.forEach(item => {
        //         if (item.loaiMatHang == 0) {
        //             const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
        //             const dm = this.dinhMucs.find(e => e.cloaiVthh == item.maVtu);
        //             if (dm) {
        //                 item.sl = mulNumber(sl, this.getDmValue(dm.dieuHanhDviTt, dm.dieuHanhVp));
        //             }
        //         }
        //     })
        //     this.tinhTongDm(cucDh);
        //     this.sum(this.lstCtietBcao[cucDh].stt);
        // }

        if (tongCucDh) {
            this.lstCtietBcao[tongCucDh].listCtiet.forEach(item => {
                if (item.loaiMatHang == 0) {
                    const sl = soLuong.find(e => e.maVtu == item.maVtu)?.sl;
                    const dm = this.dinhMucs.find(e => e.cloaiVthh == item.maVtu);
                    if (dm) {
                        item.sl = mulNumber(sl, dm.tcDhNvCm);
                    }
                }
            })

            this.tinhTongDm(tongCucDh);
            this.sum(this.lstCtietBcao[tongCucDh].stt);
        }
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
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == getHead(this.lstCtietBcao[index].stt));
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
            if ((getHead(item.stt) == str) && (!item.checked)) {
                nho = item.checked;
            }
        })
        return nho;
    }


    updateAllChecked() {
        this.lstCtietBcao.forEach(item => {
            if (this.checkDelete(item)) {
                item.checked = this.allChecked;
            }
        })
    }

    deleteAllChecked() {
        const lstId: string[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked && this.checkDelete(item)) {
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
        const item: ItemData = {
            ...initItem,
            stt: '0.1',
            level: 0,
        }
        if (!initItem?.id) {
            item.listCtiet = [];
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
                    sl: 0,
                };
                item.listCtiet.push(objTrongD);
                item.listCtiet.push(objLke);
            });
        }
        this.lstCtietBcao.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
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
            if (getTail(item1.stt) > getTail(item2.stt)) {
                return -1;
            }
            if (getTail(item1.stt) < getTail(item2.stt)) {
                return 1;
            }
            return 0;
        });
        const lstTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == getHead(item.stt));
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
            item.level = item.stt.split('.').length - 2;
        })
    }

    addLine(id: string) {
        const maNdung = this.lstCtietBcao.find(e => e.id == id)?.maNdungChi;
        const obj = {
            ma: maNdung,
            lstDanhMuc: this.noiDungChis,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogChonDanhMucComponent,
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdungChi == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...new ItemData(),
                        maNdungChi: res.ma,
                        level: this.noiDungChis.find(e => e.ma == res.ma)?.level,
                        tenNdung: this.noiDungChis.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        await this.addFirst(data);
                    } else {
                        await this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdungChi == res.ma)?.id;

                res.lstKhoanMuc.forEach(item => {
                    const data: ItemData = {
                        ...new ItemData(),
                        maNdungChi: item.ma,
                        level: item.level,
                        tenNdung: item.giaTri
                    };
                    this.addLow(id, data);
                })
                this.sum(this.lstCtietBcao.find(e => e.id == id).stt + '.1');
                this.updateEditCache();
            }
        });
    }

    getColTotal(id: any) {
        const itemLine = this.luyKes?.find(item => item.maNdungChi == this.editCache[id].data.maNdungChi)?.listCtiet;
        this.editCache[id].data.trongDotTcong = 0;
        this.editCache[id].data.luyKeTcong = 0;
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == 0) {
                    this.editCache[id].data.trongDotTcong = sumNumber([this.editCache[id].data.trongDotTcong, e.sl]);
                    //set luy ke tuong ung = luy ke default + chi tiet theo dot
                    const sl = itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == 1)?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == 1)?.sl : 0;
                    this.editCache[id].data.listCtiet.find(a => a.maVtu == e.maVtu && a.loaiMatHang == 1).sl = sumNumber([sl, e.sl]);
                }
            })
        }
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == 1) {
                    this.editCache[id].data.luyKeTcong = sumNumber([this.editCache[id].data.luyKeTcong, e.sl]);
                }
            })
        }
    }

    addNewCol() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogDanhSachVatTuHangHoaComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (res) => {
            if (res) {
                this.lstCtietBcao.forEach(data => {
                    const objTrongD = {
                        id: uuid.v4() + 'FE',
                        maVtu: res.ma,
                        loaiMatHang: 0,
                        sl: 0,
                    }
                    const objLke = {
                        id: uuid.v4() + 'FE',
                        maVtu: res.ma,
                        loaiMatHang: 1,
                        sl: 0,
                    }
                    data.listCtiet.push(objTrongD);
                    data.listCtiet.push(objLke);
                })
                this.listColTemp.push({
                    id: uuid.v4() + 'FE',
                    maVtu: res.ma,
                    colName: res.ten,
                });
                this.updateEditCache();
            }
        });
    }

    deleteCol(maVtu: string) {
        this.lstCtietBcao.forEach(data => {
            data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
        })
        this.getColTotal2();
        this.updateEditCache();
        this.listColTemp = this.listColTemp.filter(e => e.maVtu != maVtu);
    }

    getColTotal2() {
        this.lstCtietBcao.forEach(e => {
            e.trongDotTcong = 0;
            e.luyKeTcong = 0;
            e.listCtiet.forEach(el => {
                e.trongDotTcong = sumNumber([e.trongDotTcong, el.loaiMatHang == 0 ? el.sl : 0]);
                e.luyKeTcong = sumNumber([e.luyKeTcong, el.loaiMatHang == 1 ? el.sl : 0]);
            });
        })
    }

    sum(stt: string) {
        this.calcuDeviant(this.lstCtietBcao.find(e => e.stt == stt).maNdungChi);
        stt = getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            data.listCtiet.filter(el => el.sl = 0);
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                checked: data.checked,
                level: data.level,
                maNdungChi: data.maNdungChi,
                tenNdung: data.tenNdung,
                listCtiet: data.listCtiet,
                ghiChu: data.ghiChu,
            }
            this.lstCtietBcao.forEach(item => {
                if (getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].trongDotTcong = sumNumber([this.lstCtietBcao[index].trongDotTcong, item.trongDotTcong]);
                    this.lstCtietBcao[index].luyKeTcong = sumNumber([this.lstCtietBcao[index].luyKeTcong, item.luyKeTcong]);
                    this.lstCtietBcao[index].listCtiet.filter(el => {
                        const sl = item.listCtiet.find(e => e.loaiMatHang == el.loaiMatHang && e.maVtu == el.maVtu).sl
                        el.sl = sumNumber([el.sl, sl]);
                    })
                }
            })
            //tinh lai chenh lech giua cac hang trong I, II, III
            this.calcuDeviant(data.maNdungChi);
            //neu danh muc dang sua la 0.1.5 thi gan gia tri cua no vao B(0.2)
            if (data.maNdungChi == '0.1.5') {
                const ind1 = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.2');
                const ind2 = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.2.1');
                const ind3 = this.lstCtietBcao.findIndex(e => e.maNdungChi == '0.2.2');
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
            stt = getHead(stt);
        }
        this.updateEditCache();
    }

    export() {
        const request = {
            bcaoCtietId: this.id,
            bcaoId: this.idBaoCao,
            dviTien: this.maDviTien,
        }
        this.baoCaoThucHienVonPhiService.exportBaoCao(request).toPromise().then(
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

    //tinh toan chech lech giua cac hang
    calcuDeviant(maNdung: string) {
        if (maNdung.startsWith('0.1.5') || maNdung.startsWith('0.1.6')) {
            const tail = maNdung.substring(5);
            const indexI = this.lstCtietBcao.findIndex(e => e.maNdungChi.startsWith('0.1.5') && e.maNdungChi.substring(5) == tail);
            const indexII = this.lstCtietBcao.findIndex(e => e.maNdungChi.startsWith('0.1.6') && e.maNdungChi.substring(5) == tail);
            const indexIII = this.lstCtietBcao.findIndex(e => e.maNdungChi.startsWith('0.1.7') && e.maNdungChi.substring(5) == tail);
            if (indexIII != -1) {
                this.lstCtietBcao[indexIII].listCtiet.forEach(item => {
                    const value1 = indexI == -1 ? 0 : this.lstCtietBcao[indexI].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
                    const value2 = indexII == -1 ? 0 : this.lstCtietBcao[indexII].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
                    item.sl = sumNumber([value1, - value2]);
                })
                this.lstCtietBcao[indexIII].trongDotTcong = sumNumber([indexI == -1 ? 0 : this.lstCtietBcao[indexI].trongDotTcong, indexII == -1 ? 0 : -this.lstCtietBcao[indexII].trongDotTcong]);
                this.lstCtietBcao[indexIII].luyKeTcong = sumNumber([indexI == -1 ? 0 : this.lstCtietBcao[indexI].luyKeTcong, indexII == -1 ? 0 : -this.lstCtietBcao[indexII].luyKeTcong]);
            }

        }
    }

    statusDeleteCol(maVtu: string) {
        if (this.luyKes.length > 0) {
            if (this.luyKes[0].listCtiet.findIndex(e => e.maVtu == maVtu) != -1) {
                return true;
            }
        }
        return false;
    }

    checkDelete(item: ItemData) {
        if (this.luyKes.findIndex(e => e.maNdungChi == item.maNdungChi) != -1) {
            return false;
        }
        if (item.maNdungChi.startsWith('0.1.5')) {
            return false;
        }
        if (item.level < 3) {
            return false;
        }
        return true;
    }

    checkEdit(item: ItemData) {
        if (item.maNdungChi == '0.1.2') {
            return false;
        }
        if (item.maNdungChi.startsWith('0.1.5')) {
            return false;
        }
        if (item.maNdungChi.startsWith('0.1.7') && item.level < 3) {
            return false;
        }
        const lstTemp = this.lstCtietBcao.filter(e => e.id != item.id);
        return lstTemp.every(e => !e.stt.startsWith(item.stt));
    }

    displayValue(ma: string, num: number): string {
        if (ma == '0.1') {
            return null;
        }
        if (ma != '0.1.1' && ma != '0.1.2' && ma != '0.1.3' && ma != '0.1.4') {
            num = exchangeMoney(num, '1', this.maDviTien);
        }
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }
}
