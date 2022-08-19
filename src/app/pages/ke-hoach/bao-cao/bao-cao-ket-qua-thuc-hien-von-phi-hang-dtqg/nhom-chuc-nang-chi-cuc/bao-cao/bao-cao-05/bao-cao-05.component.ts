import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";

import { DialogThemVatTuComponent } from 'src/app/components/dialog/dialog-vat-tu/dialog-vat-tu.component';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { displayNumber, DON_VI_TIEN, LA_MA, NOT_OK, OK, sumNumber } from "src/app/Utility/utils";
import { LISTBIEUMAUDOT } from '../bao-cao.constant';

export class ItemDataMau0405 {
    id = null;
    header = null;
    stt = '0';
    checked = false;
    level = 0;
    bcaoCtietId = null;
    maNdungChi = null;
    trongDotTcong = 0;
    trongDotThoc = 0;
    trongDotGao = 0;
    luyKeTcong = 0;
    luyKeThoc = 0;
    luyKeGao = 0;
    listCtiet: vatTu[] = [];
    ghiChu = null;
    maNdungChiCha = null;
}
export class vatTu {
    id: any;
    maVtu: any;
    loaiMatHang: any;
    sl: any;
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
    listDonvitinh: any[] = [];
    listVattu: any[] = [];
    lstVatTuFull = [];
    luyKes = [];
    //nhóm biến biểu mẫu 05
    lstCtietBcao5: ItemDataMau0405[] = [];
    noiDungChis: any[] = [];
    noiDungChiFull: any[] = [];
    //thong tin chung
    id: any;
    lstCTietBaoCaoTemp: any[] = [];
    idBaoCao: string;        //id bao cao to

    thuyetMinh: string;
    maDviTien = '1';
    tuNgay: any;
    denNgay: any;

    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusBtnExport: boolean;
    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemDataMau0405 } } = {};
    formatter = value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;
    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }

    async ngOnInit() {
        this.id = this.data?.id;
        this.maDviTien = this.data?.maDviTien;
        this.thuyetMinh = this.data?.thuyetMinh;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.statusBtnOk = this.data?.statusBtnOk;
        this.statusBtnExport = this.data?.statusBtnExport;
        this.lstCTietBaoCaoTemp = this.data?.lstCtietBcaos;
        this.luyKes = await this.data?.luyKes.find(item => item.maLoai == '9')?.lstCtietBcaos;
        this.spinner.show();
        //lấy danh sách nội dung chi
        await this.danhMucService.dMNoiDungChi05().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.noiDungChis = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        await this.noiDungChis.forEach(item => {
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
        await this.addListNoiDungChi(this.noiDungChiFull);
        // 05/BCPBQ
        await this.lstCTietBaoCaoTemp?.filter(async el => {
            await el.listCtiet.sort((a, b) => a.maVtu - b.maVtu);
            this.lstCtietBcao5.push(el);
            this.updateEditCache();
        });
        //lấy danh sách vật tư
        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVattu = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        await this.addListVatTu(this.listVattu, 0);
        this.lstCTietBaoCaoTemp[0]?.listCtiet.filter(el => {
            if (el.loaiMatHang == 0) {
                el.colName = this.lstVatTuFull.find(e => e.id == el.maVtu)?.ten;
                this.listColTemp.push(el);
            }
        });


        const dataPL = new ItemDataMau0405();
        if (this.lstCtietBcao5.length == 0) {
            await this.noiDungChiFull.forEach(element => {
                const data: any = {
                    ...dataPL,
                    maNdungChi: element.id,
                    maVtu: element.id,
                    level: element.level,
                    stt: element.ghiChu,
                    header: '5-B',
                    listCtiet: [],
                    id: uuid.v4() + "FE",
                };
                this.lstCtietBcao5.push(data);
            });
            this.updateEditCache();
        }

        if (this.lstCtietBcao5.length > 0) {
            if (!this.lstCtietBcao5[0].stt) {
                const lstTemp = [];
                await this.noiDungChiFull.forEach(element => {
                    lstTemp.push(this.lstCtietBcao5.find(item => item.maNdungChi == element.id));
                });
                this.lstCtietBcao5 = lstTemp;
                await this.sortWithoutIndex();
            } else {
                await this.sortByIndex();
            }
        }

        this.updateEditCache();
        //danh sách đơn vị tính (đơn vị đo lường )
        this.quanLyVonPhiService.dmDonvitinh().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.listDonvitinh = data.data?.content;

                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
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

    addListVatTu(listVattu, idCha) {
        listVattu.forEach(item => {
            item = {
                ...item,
                tenDm: item.ten,
                level: Number(item.cap) - 1,
                idCha: idCha,
            }
            this.lstVatTuFull.push(item);
            if (item.child) {
                this.addListVatTu(item.child, item.id);
            }
        });
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

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string, dauMuc: string, dauMucCha: string): string {
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
                k = k - 3;
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
        return str?.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }
    //tìm vị trí cần để thêm mới
    findVt(str: string): number {
        const baoCao = this.lstCtietBcao5
        const start: number = baoCao.findIndex(e => e.stt == str);
        let index: number = start;
        for (let i = start + 1; i < baoCao.length; i++) {
            if (baoCao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }
    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        const baoCao = this.lstCtietBcao5;
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(baoCao[item].stt) + "." + (this.getTail(baoCao[item].stt) + heSo).toString();
            const nho = baoCao[item].stt;
            baoCao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    addLine(id: any) {
        let baoCao = this.lstCtietBcao5;

        const dataPL = new ItemDataMau0405();
        const lstKmTemp = this.noiDungChiFull;
        const maKm = baoCao?.find(e => e.id == id)?.maNdungChi;
        const obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
            baoCaos: baoCao,
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
                const index: number = baoCao.findIndex(e => e.maNdungChi == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: res.maKhoanMuc,
                        maVtu: res.maKhoanMuc,
                        level: lstKmTemp.find(e => e.id == maKm)?.level,
                    };
                    if (baoCao.length == 0) {
                        await this.addFirst(data);
                    } else {
                        await this.addSame(id, data);
                        //tinh lai luy ke cho lop cha
                        this.sum(baoCao.find(e => e.id == id).stt);
                    }
                }
                baoCao = this.lstCtietBcao5;
                id = baoCao.find(e => e.maNdungChi == res.maKhoanMuc)?.id;

                res.lstKhoanMuc.forEach(item => {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: item.id,
                        maVtu: item.id,
                        level: item.level,
                    };
                    this.addLow(id, data);
                })
                this.sum(baoCao.find(e => e.id == id).stt + '.1');
                this.updateEditCache();
            }
        });
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        const baoCao = this.lstCtietBcao5;
        baoCao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(initItem: any) {
        const listVtu: vatTu[] = [];
        const itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            const objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            const objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });
        const baoCao = [];
        let item;
        if (initItem?.id) {
            item = {
                ...initItem,
                stt: "0.1",
                listCtiet: listVtu,
            }
        } else {
            item = {
                ...initItem,
                id: uuid.v4() + 'FE',
                stt: "0.1",
                listCtiet: listVtu,
            }
        }
        baoCao.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
        this.lstCtietBcao5 = baoCao;
    }

    //thêm cấp thấp hơn
    addLow(id: any, initItem) {
        const baoCao = this.lstCtietBcao5;
        const data = baoCao.find(e => e.id == id);
        let index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        let stt: string;
        if (baoCao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt);
            for (let i = baoCao.length - 1; i >= 0; i--) {
                if (this.getHead(baoCao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(baoCao[i].stt) + 1).toString();
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
                loaiMatHang: '0',
                sl: 0,
            };
            const objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });

        // them moi phan tu
        if (initItem?.id) {
            const item = {
                ...initItem,
                stt: stt,
                listCtiet: listVtu,
            }
            baoCao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            if (baoCao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
                this.sum(stt);
            }
            const item = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
                listCtiet: listVtu,
                maNdungChiCha: Number(baoCao[index].maNdungChi),
            }
            baoCao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    //thêm ngang cấp
    addSame(id: any, initItem) {
        const baoCao = this.lstCtietBcao5;
        const index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        const head: string = this.getHead(baoCao[index].stt); // lay phan dau cua so tt
        const tail: number = this.getTail(baoCao[index].stt); // lay phan duoi cua so tt
        const ind: number = this.findVt(baoCao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = baoCao.length - 1; i > ind; i--) {
            if (this.getHead(baoCao[i].stt) == head) {
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
                loaiMatHang: '0',
                sl: 0,
            };
            const objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0
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
                listCtiet: listVtu,
            }
            baoCao.splice(ind + 1, 0, item);
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
                maNdungChiCha: Number(baoCao[index].maNdungChiCha),
            }
            baoCao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    //xóa dòng
    deleteLine(id: any) {
        let baoCao = this.lstCtietBcao5;
        const index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        // khong tim thay thi out ra
        if (index == -1) return;
        const stt: string = baoCao[index].stt;
        const nho: string = baoCao[index].stt;
        const head: string = this.getHead(baoCao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        baoCao = baoCao.filter(e => !e.stt.startsWith(nho));
        this.lstCtietBcao5 = baoCao;
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = baoCao.length - 1; i >= index; i--) {
            if (this.getHead(baoCao[i].stt) == head) {
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
        const baoCao = this.lstCtietBcao5;
        // lay vi tri hang minh sua
        const index = baoCao.findIndex(item => item.id == id);
        // xoa dong neu truoc do chua co du lieu
        if (!baoCao[index].maNdungChi) {
            this.deleteLine(id);
            return;
        }
        //return du lieu
        this.editCache[id] = {
            data: { ...baoCao[index] },
            edit: false
        };
    }

    // luu thay doi
    async saveEdit(id: string): Promise<void> {
        if (!this.editCache[id].data.maNdungChi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
            return;
        }
        const baoCao = this.lstCtietBcao5;
        this.editCache[id].data.checked = baoCao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = baoCao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(baoCao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.calcuDeviant(baoCao[index].maNdungChi);
        if (baoCao[index].maNdungChi != 13869 && baoCao[index].maNdungChi != 13841) {
            this.sum(baoCao[index].stt);
        }
        const soLuongThucHienGop = baoCao.find(item => item.stt == '0.1.2');
        const soLuongThucHienNamTruoc = baoCao.find(item => item.stt == '0.1.3');
        const soLuongThucHienNamNay = baoCao.find(item => item.stt == '0.1.4');
        if (soLuongThucHienGop) {
            await soLuongThucHienGop?.listCtiet?.forEach(item => {
                item.sl = soLuongThucHienNamTruoc?.listCtiet?.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl
                    + soLuongThucHienNamNay?.listCtiet?.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
            })
            soLuongThucHienGop.trongDotTcong = soLuongThucHienNamTruoc.trongDotTcong + soLuongThucHienNamNay.trongDotTcong;
            soLuongThucHienGop.luyKeTcong = soLuongThucHienNamTruoc.luyKeTcong + soLuongThucHienNamNay.luyKeTcong;
        }
        //tinh toan hieu cua muc B
        let index1: number;
        if (baoCao[index].maNdungChi == 13869) {
            index1 = this.lstCtietBcao5.findIndex(e => e.maNdungChi == 13841);
        }
        if (baoCao[index].maNdungChi == 13841) {
            index1 = this.lstCtietBcao5.findIndex(e => e.maNdungChi == 13869);
        }
        if ((index1 || index1 === 0) && index1 != -1) {
            const indexTong = this.lstCtietBcao5.findIndex(e => e.maNdungChi == 13868);
            this.lstCtietBcao5[index1].trongDotTcong = this.lstCtietBcao5[indexTong].trongDotTcong - this.lstCtietBcao5[index].trongDotTcong;
            this.lstCtietBcao5[index1].luyKeTcong = this.lstCtietBcao5[indexTong].luyKeTcong - this.lstCtietBcao5[index].luyKeTcong;
            this.lstCtietBcao5[index1].listCtiet.forEach(item => {
                item.sl = sumNumber([this.lstCtietBcao5[indexTong].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl,
                -this.lstCtietBcao5[index].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl])
            })
        }
    }

    updateChecked(id: any) {
        const baoCao = this.lstCtietBcao5;
        const data = baoCao.find(e => e.id == id);
        //đặt các phần tử con có cùng trạng thái với nó
        baoCao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        let index: number = baoCao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = baoCao[index].checked;
            while (nho != this.checkAllChild(baoCao[index].stt)) {
                baoCao[index].checked = !nho;
                index = baoCao.findIndex(e => e.stt == this.getHead(baoCao[index].stt));
                if (index == -1) {
                    this.allChecked = !nho;
                    break;
                }
                nho = baoCao[index].checked;
            }
        }
    }

    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        const baoCao = this.lstCtietBcao5;
        let nho = true;
        baoCao.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
                nho = item.checked;
            }
        })
        return nho;
    }

    // update all
    updateAllChecked(): void {

        const baoCao = this.lstCtietBcao5;
        baoCao.filter(item => {
            if (item.level > 2) {
                item.checked = this.allChecked
            }
        });
    }

    deleteAllChecked() {

        const baoCao = this.lstCtietBcao5;
        const lstId: any[] = [];
        baoCao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (baoCao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item,);
            }
        })
    }



    async sortByIndex() {

        await this.setDetail();
        let baoCao = this.lstCtietBcao5;
        baoCao.sort((item1, item2) => {
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
        const lstTemp: any[] = [];
        baoCao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })
        baoCao = lstTemp;
        this.lstCtietBcao5 = baoCao;
    }

    setDetail() {
        const baoCao = this.lstCtietBcao5;
        baoCao.forEach(item => {
            item.level = this.noiDungChiFull.find(e => e.id == item.maNdungChi)?.level;
        })
        this.lstCtietBcao5 = baoCao;
    }

    getIdCha(maKM: any) {
        return this.noiDungChiFull.find(e => e.id == maKM)?.idCha;
    }

    async sortWithoutIndex() {

        await this.setDetail();
        let baoCao = this.lstCtietBcao5;
        this.setDetail();
        let level = 0;
        let danhSachChiTietBaoCaoTemp: any[] = baoCao;
        baoCao = [];
        const data = danhSachChiTietBaoCaoTemp.find(e => e.level == 0);
        await this.addFirst(data);
        baoCao = this.lstCtietBcao5;
        danhSachChiTietBaoCaoTemp = danhSachChiTietBaoCaoTemp.filter(e => e.id != data.id);
        let lstTemp = danhSachChiTietBaoCaoTemp.filter(e => e.level == level);
        while (lstTemp.length != 0 || level == 0) {
            lstTemp.forEach(item => {
                const idCha = this.getIdCha(item.maNdungChi);
                let index: number = baoCao.findIndex(e => e.maNdungChi == idCha);
                if (index != -1) {
                    this.addLow(baoCao[index].id, item);
                } else {
                    index = baoCao.findIndex(e => this.getIdCha(e.maNdungChi) == idCha);
                    this.addSame(baoCao[index].id, item);
                }
            })
            level += 1;
            lstTemp = danhSachChiTietBaoCaoTemp.filter(e => e.level == level);
            baoCao = this.lstCtietBcao5;
        }
    }

    getLowStatus(str: string) {
        const baoCao = this.lstCtietBcao5;
        const index: number = baoCao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        //kiem tra xem hang dang xet cos phai la hieu cua 2 hang khac ko
        const maNdung = baoCao.find(e => e.stt == str)?.maNdungChi;
        if (this.getRoleCalculate(maNdung) == '7') {
            return false;
        }
        return true;
    }

    tinhTong(id: any) {
        //luy ke default
        const itemLine = this.luyKes?.find(item => item.maNdungChi == this.editCache[id].data.maNdungChi)?.listCtiet;

        let tonglstChitietVtuTrongDot = 0;
        let tonglstChitietVtuLuyke = 0;
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == '0') {
                    tonglstChitietVtuTrongDot += e.sl;
                    //set luy ke tuong ung = luy ke default + chi tiet theo dot
                    const sl = itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0;
                    this.editCache[id].data.listCtiet.find(a => a.maVtu == e.maVtu && a.loaiMatHang == '1').sl = sl + e.sl;
                }
            })
        }
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == '1') {
                    tonglstChitietVtuLuyke += e.sl;
                }
            })
        }
        this.editCache[id].data.trongDotTcong = tonglstChitietVtuTrongDot;
        this.editCache[id].data.luyKeTcong = tonglstChitietVtuLuyke;
    }

    addAllCol() {
        const lstDviChon = this.lstVatTuFull.filter(item => this.listColTemp?.findIndex(data => data.maVtu == item.id) == -1);
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách vật tư',
            nzContent: DialogLuaChonThemDonViComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                danhSachDonVi: lstDviChon
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(async item => {
                    await this.addCol(item);
                })
                // this.lstCtietBcao.forEach(item => {
                //   this.total(item.id);
                // })
                // 
            }

            this.updateEditCache();

        });
    }

    addCol(vatTu: any) {

        const baoCao = this.lstCtietBcao5;
        baoCao.forEach(async data => {
            const itemLine = this.luyKes?.find(item => item.maNdungChi == data.maNdungChi)?.listCtiet;
            const objTrongD = {
                id: uuid.v4() + 'FE',
                maVtu: vatTu.id,
                colName: vatTu.ten,
                loaiMatHang: '0',
                sl: 0,
            }
            const objLke = {
                id: uuid.v4() + 'FE',
                maVtu: vatTu.id,
                colName: vatTu.ten,
                loaiMatHang: '1',
                sl: itemLine?.find(item => item.maVtu == vatTu.id && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == vatTu.id && item.loaiMatHang == '1')?.sl : 0,
            }
            data.listCtiet.push(objTrongD);
            data.listCtiet.push(objLke);
        })

        this.listColTemp.push({
            id: uuid.v4() + 'FE',
            maVtu: vatTu.id,
            colName: vatTu.ten,
            loaiMatHang: '0',
            sl: 0,
        });
    }

    deleteCol(maVtu: string) {

        const baoCao = this.lstCtietBcao5;
        baoCao.forEach(data => {
            data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
        })
        this.listColTemp = this.listColTemp.filter(e => e.maVtu != maVtu);
        this.tinhTong2();
    }

    tinhTong2() {
        let tonglstChitietVtuTrongDot = 0;
        let tonglstChitietVtuLuyke = 0;
        this.lstCTietBaoCaoTemp.forEach(e => {
            e.listCtiet.forEach(el => {
                if (el.loaiMatHang == '0') {
                    tonglstChitietVtuTrongDot += el.sl;
                } else {
                    tonglstChitietVtuLuyke += el.sl;
                }
            });
            e.trongDotTcong = tonglstChitietVtuTrongDot;
            e.luyKeTcong = tonglstChitietVtuLuyke;
        })
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
        const baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCtietBcao5));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = this.tuNgay;
        baoCaoChiTietTemp.denNgay = this.denNgay;

        const checkMoneyRange = true;
        let checkPersonReport = true;

        // validate nguoi thuc hien bao cao
        if (!baoCaoChiTietTemp.nguoiBcao) {
            checkPersonReport = false;
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
            return;
        }
        // validate bao cao
        if (baoCaoChiTietTemp.id?.length != 36) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.SAVEREPORT);
            return;
        }
        baoCaoChiTietTemp.trangThai = maChucNang;
        let checkSaveEdit;

        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
            if (this.editCache[data.id].edit == true) {
                checkSaveEdit = false;
                return;
            }
            if (data.id?.length == 38) {
                data.id = null;
            }
        })

        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        if (!checkMoneyRange == true) {
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

    sum(stt: string) {
        const dataPL = new ItemDataMau0405();
        const baoCaoTemp = this.lstCtietBcao5;
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = baoCaoTemp.findIndex(e => e.stt == stt);
            const data = baoCaoTemp[index];
            data.listCtiet.filter(el => el.sl = 0);
            baoCaoTemp[index] = {
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
            baoCaoTemp.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    baoCaoTemp[index].trongDotTcong += item.trongDotTcong;
                    baoCaoTemp[index].trongDotThoc += item.trongDotThoc;
                    baoCaoTemp[index].trongDotGao += item.trongDotGao;
                    baoCaoTemp[index].luyKeTcong += item.luyKeTcong;
                    baoCaoTemp[index].luyKeThoc += item.luyKeThoc;
                    baoCaoTemp[index].luyKeGao += item.luyKeGao;
                    baoCaoTemp[index].listCtiet.filter(el => {
                        el.sl += item.listCtiet.find(e => e.loaiMatHang == el.loaiMatHang && e.maVtu == el.maVtu).sl;
                    })
                }
            })
            this.calcuDeviant(data.maNdungChi);
            if (data.maNdungChi == 13847) {
                const ind1 = this.lstCtietBcao5.findIndex(e => e.maNdungChi == 13868);
                const ind2 = this.lstCtietBcao5.findIndex(e => e.maNdungChi == 13869);
                const ind3 = this.lstCtietBcao5.findIndex(e => e.maNdungChi == 13841);
                if (ind1 != -1) {
                    this.lstCtietBcao5[ind1].trongDotTcong = this.lstCtietBcao5[index].trongDotTcong;
                    this.lstCtietBcao5[ind1].luyKeTcong = this.lstCtietBcao5[index].luyKeTcong;
                    if (ind3 != -1) {
                        this.lstCtietBcao5[ind3].trongDotTcong = sumNumber([this.lstCtietBcao5[ind1].trongDotTcong, ind2 == -1 ? 0 : this.lstCtietBcao5[ind2].trongDotTcong]);
                        this.lstCtietBcao5[ind3].luyKeTcong = sumNumber([this.lstCtietBcao5[ind1].luyKeTcong, ind2 == -1 ? 0 : this.lstCtietBcao5[ind2].luyKeTcong]);
                    }
                    this.lstCtietBcao5[ind1].listCtiet.forEach(item => {
                        item.sl = this.lstCtietBcao5[index].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu).sl;
                        if (ind3 != -1) {
                            const subIndex = this.lstCtietBcao5[ind3].listCtiet.findIndex(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu);
                            const sl1: number = ind2 == -1 ? 0 : this.lstCtietBcao5[ind2].listCtiet.find(e => e.loaiMatHang == item.loaiMatHang && e.maVtu == item.maVtu)?.sl;
                            this.lstCtietBcao5[ind3].listCtiet[subIndex].sl = sumNumber([item.sl, - sl1]);
                        }
                    })
                }
            }
            stt = this.getHead(stt);
        }
        this.updateEditCache();
        // this.getTotal();
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
    calcuDeviant(maNdung: string) {
        //debugger
        const maCap = this.noiDungChiFull.find(e => e.id == maNdung)?.ghiChu;
        if (maCap || maCap === 0) {
            const indexI: number = this.lstCtietBcao5.findIndex(e => this.getMaCap(e.maNdungChi) == maCap && this.getRoleCalculate(e.maNdungChi) == '5');
            const indexII: number = this.lstCtietBcao5.findIndex(e => this.getMaCap(e.maNdungChi) == maCap && this.getRoleCalculate(e.maNdungChi) == '6');
            const indexIII: number = this.lstCtietBcao5.findIndex(e => this.getMaCap(e.maNdungChi) == maCap && this.getRoleCalculate(e.maNdungChi) == '7');
            if (indexIII != -1) {
                this.lstCtietBcao5[indexIII].trongDotTcong = sumNumber([indexI == -1 ? 0 : this.lstCtietBcao5[indexI].trongDotTcong, indexII == -1 ? 0 : -this.lstCtietBcao5[indexII].trongDotTcong]);
                this.lstCtietBcao5[indexIII].luyKeTcong = sumNumber([indexI == -1 ? 0 : this.lstCtietBcao5[indexI].luyKeTcong, indexII == -1 ? 0 : -this.lstCtietBcao5[indexII].luyKeTcong]);
                this.lstCtietBcao5[indexIII].listCtiet.forEach(item => {
                    const value1 = indexI == -1 ? 0 : this.lstCtietBcao5[indexI].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
                    const value2 = indexII == -1 ? 0 : this.lstCtietBcao5[indexII].listCtiet.find(e => e.maVtu == item.maVtu && e.loaiMatHang == item.loaiMatHang)?.sl;
                    item.sl = sumNumber([value1, - value2]);
                })

            }
        }
    }

    displayValue(num: number): string {
        return displayNumber(num);
    }
}
