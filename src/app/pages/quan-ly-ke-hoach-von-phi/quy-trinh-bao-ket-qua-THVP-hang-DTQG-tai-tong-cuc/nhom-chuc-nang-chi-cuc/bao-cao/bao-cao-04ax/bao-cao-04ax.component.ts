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
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, LA_MA, NOT_OK, OK } from "../../../../../../Utility/utils";
import { LISTBIEUMAUDOT } from '../bao-cao.constant';
import { LINH_VUC } from './bao-cao-04ax.constant';

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
    selector: 'app-bao-cao-04ax',
    templateUrl: './bao-cao-04ax.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao04axComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    linhVucs: any[] = LINH_VUC;
    // lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    listColTemp: any[] = [];
    listVattu: any[] = [];
    lstVatTuFull = [];
    luyKes = [];
    //nhóm biến biểu mẫu 04ax
    lstCtietBcao4axI1: ItemDataMau0405[] = [];
    lstCtietBcao4axI2: ItemDataMau0405[] = [];
    lstCtietBcao4axI3: ItemDataMau0405[] = [];
    lstCtietBcao4axII11: ItemDataMau0405[] = [];
    lstCtietBcao4axII12: ItemDataMau0405[] = [];
    lstCtietBcao4axII2: ItemDataMau0405[] = [];
    lstCtietBcao4axII3: ItemDataMau0405[] = [];
    lstCtietBcao4axIII1: ItemDataMau0405[] = [];
    lstCtietBcao4axIII2: ItemDataMau0405[] = [];
    lstCtietBcao4axIII3: ItemDataMau0405[] = [];
    lstCtietBcao4axB: ItemDataMau0405[] = [];
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
    listIdDelete = "";
    trangThaiPhuLuc = '1';

    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusBtnExport: boolean;
    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemDataMau0405 } } = {};

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
        this.luyKes = await this.data?.luyKes.find(item => item.maLoai == '6')?.lstCtietBcaos;
        this.spinner.show();
        // 04ax
        await this.lstCTietBaoCaoTemp?.filter(async el => {
            await el.listCtiet.sort((a, b) => a.maVtu - b.maVtu);
            this.lstCtietBcao4axB.push(el);
            this.updateEditCache('4ax-B');
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

        //lấy danh sách nội dung chi
        await this.danhMucService.dMNoiDungChi04a().toPromise().then(res => {
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
        console.log(this.noiDungChiFull);
        const dataPL = new ItemDataMau0405();
        if (this.lstCtietBcao4axB.length == 0) {
            await this.noiDungChiFull.forEach(element => {
                const data: any = {
                    ...dataPL,
                    maNdungChi: element.id,
                    maVtu: element.id,
                    level: element.level,
                    stt: element.ghiChu,
                    header: '4ax-B',
                    listCtiet: [],
                    id: uuid.v4() + "FE",
                };
                this.lstCtietBcao4axB.push(data);
            });
            this.updateEditCache('4ax-B');
        }

        if (this.lstCtietBcao4axB.length > 0) {
            if (!this.lstCtietBcao4axB[0].stt) {
                const lstTemp = [];
                await this.noiDungChiFull.forEach(element => {
                     lstTemp.push(this.lstCtietBcao4axB.find(item => item.maNdungChi == element.id));
                });
                this.lstCtietBcao4axB = lstTemp;
                await this.sortWithoutIndex();
            } else {
                await this.sortByIndex();
            }
        }
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        idPhuLuc.forEach(phuLuc => {
            this.updateEditCache(phuLuc);
        })


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
                k = k - 4
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
    findVt(str: string, phuLuc): number {
        const baoCao = this.getBieuMau(phuLuc)
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
    replaceIndex(lstIndex: number[], heSo: number, phuLuc: string) {
        const baoCao = this.getBieuMau(phuLuc);
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(baoCao[item].stt) + "." + (this.getTail(baoCao[item].stt) + heSo).toString();
            const nho = baoCao[item].stt;
            baoCao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    addLine(id: any, phuLuc) {
        let baoCao = this.getBieuMau(phuLuc);
        const dataPL = new ItemDataMau0405();
        const lstKmTemp = this.noiDungChiFull;
        const maKm = baoCao.find(e => e.id == id)?.maNdungChi;
        dataPL.header = phuLuc;
        const obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
            baoCaos : baoCao,
            tab : '6',
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
                        await this.addFirst(data, phuLuc);
                    } else {
                        await this.addSame(id, data, phuLuc);
                        //tinh lai luy ke cho lop cha
                        this.sum(baoCao.find(e => e.id == id).stt, phuLuc);
                    }
                }
                baoCao = this.getBieuMau(phuLuc);
                id = baoCao.find(e => e.maNdungChi == res.maKhoanMuc)?.id;

                res.lstKhoanMuc.forEach(item => {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: item.id,
                        maVtu: item.id,
                        level: item.level,
                    };
                    this.addLow(id, data, phuLuc);
                })
                this.sum(baoCao.find(e => e.id == id).stt + '.1', phuLuc);
                this.updateEditCache(phuLuc);
            }
        });
    }

    //thêm ngang cấp
    addSame(id: any, initItem, phuLuc: string) {
        const baoCao = this.getBieuMau(phuLuc);
        const index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        const head: string = this.getHead(baoCao[index].stt); // lay phan dau cua so tt
        const tail: number = this.getTail(baoCao[index].stt); // lay phan duoi cua so tt
        const ind: number = this.findVt(baoCao[index].stt, phuLuc); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = baoCao.length - 1; i > ind; i--) {
            if (this.getHead(baoCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1, phuLuc);
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


        // them moi phan tu
        if (initItem?.id) {
            const item = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
                maLoai: '6',
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
                maLoai: '6',
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

    // gan editCache.data == lstCtietBcao
    updateEditCache(phuLuc: string): void {
        const baoCao = this.getBieuMau(phuLuc);
        baoCao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //thêm cấp thấp hơn
    addLow(id: any, initItem, phuLuc: string) {
        const baoCao = this.getBieuMau(phuLuc);
        const data = baoCao.find(e => e.id == id);
        let index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        let stt: string;
        if (baoCao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt, phuLuc);
            for (let i = baoCao.length - 1; i >= 0; i--) {
                if (this.getHead(baoCao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(baoCao[i].stt) + 1).toString();
                    break;
                }
            }
        }
        if (baoCao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
            this.sum(stt, phuLuc);
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
                sl: itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0,
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
                this.sum(stt, phuLuc);
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

    //xóa dòng
    deleteLine(id: any, phuLuc: string) {
        let baoCao = this.getBieuMau(phuLuc);
        const index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        // khong tim thay thi out ra
        if (index == -1) return;
        const stt: string = baoCao[index].stt;

        const nho: string = baoCao[index].stt;
        const head: string = this.getHead(baoCao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        baoCao = baoCao.filter(e => !e.stt.startsWith(nho));
        this.setBieuMau(baoCao, phuLuc);
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = baoCao.length - 1; i >= index; i--) {
            if (this.getHead(baoCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1, phuLuc);
        this.sum(stt, phuLuc);
        this.updateEditCache(phuLuc);
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string, phuLuc: string): void {
        const baoCao = this.getBieuMau(phuLuc);
        // lay vi tri hang minh sua
        const index = baoCao.findIndex(item => item.id == id);
        // xoa dong neu truoc do chua co du lieu
        if (!baoCao[index].maNdungChi) {
            this.deleteLine(id, phuLuc);
            return;
        }
        //return du lieu
        this.editCache[id] = {
            data: { ...baoCao[index] },
            edit: false
        };
    }

    // luu thay doi
    async saveEdit(id: string, phuLuc: string): Promise<void> {
        if (!this.editCache[id].data.maNdungChi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
            return;
        }
        const baoCao = this.getBieuMau(phuLuc);
        this.editCache[id].data.checked = baoCao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = baoCao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(baoCao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(baoCao[index].stt, phuLuc);
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
    }

    updateChecked(id: any, phuLuc: string) {
        const baoCao = this.getBieuMau(phuLuc);
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
            this.allChecked = this.checkAllChild('0', phuLuc);
        } else {
            let nho: boolean = baoCao[index].checked;
            while (nho != this.checkAllChild(baoCao[index].stt, phuLuc)) {
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
    checkAllChild(str: string, phuLuc: string): boolean {
        const baoCao = this.getBieuMau(phuLuc);
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
        // this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        idPhuLuc.forEach(phuLuc => {
            const baoCao = this.getBieuMau(phuLuc);
            baoCao.filter(item => {
                if (item.level > 2) {
                    item.checked = this.allChecked
                }
            });
        })
    }

    deleteAllChecked() {
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        idPhuLuc.forEach(phuLuc => {
            const baoCao = this.getBieuMau(phuLuc);
            const lstId: any[] = [];
            baoCao.forEach(item => {
                if (item.checked) {
                    lstId.push(item.id);
                }
            })
            lstId.forEach(item => {
                if (baoCao.findIndex(e => e.id == item) != -1) {
                    this.deleteLine(item, phuLuc);
                }
            })
        });
    }

    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(initItem: any, phuLuc: string) {
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
        this.setBieuMau(baoCao, phuLuc);
    }

    async sortByIndex() {
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        await idPhuLuc.forEach(async phuLuc => {
            await this.setDetail(phuLuc);
            let baoCao = this.getBieuMau(phuLuc);
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
            this.setBieuMau(baoCao, phuLuc);
        })
    }

    setDetail(phuLuc) {
        const baoCao = this.getBieuMau(phuLuc);
        baoCao.forEach(item => {
            item.level = this.noiDungChiFull.find(e => e.id == item.maNdungChi)?.level;
        })
        this.setBieuMau(baoCao, phuLuc);
    }

    getIdCha(maKM: any) {
        return this.noiDungChiFull.find(e => e.id == maKM)?.idCha;
    }

    async sortWithoutIndex() {
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        await idPhuLuc.forEach(async phuLuc => {
            await this.setDetail(phuLuc);
            let baoCao = this.getBieuMau(phuLuc);
            this.setDetail(phuLuc);
            let level = 0;
            let danhSachChiTietBaoCaoTemp: any[] = baoCao;
            baoCao = [];
            const data = danhSachChiTietBaoCaoTemp.find(e => e.level == 0);
            await this.addFirst(data, phuLuc);
            baoCao = this.getBieuMau(phuLuc);
            danhSachChiTietBaoCaoTemp = danhSachChiTietBaoCaoTemp.filter(e => e.id != data.id);
            let lstTemp = danhSachChiTietBaoCaoTemp.filter(e => e.level == level);
            while (lstTemp.length != 0 || level == 0) {
                lstTemp.forEach(item => {
                    const idCha = this.getIdCha(item.maNdungChi);
                    let index: number = baoCao.findIndex(e => e.maNdungChi == idCha);
                    if (index != -1) {
                        this.addLow(baoCao[index].id, item, phuLuc);
                    } else {
                        index = baoCao.findIndex(e => this.getIdCha(e.maNdungChi) == idCha);
                        this.addSame(baoCao[index].id, item, phuLuc);
                    }
                })
                level += 1;
                lstTemp = danhSachChiTietBaoCaoTemp.filter(e => e.level == level);
                baoCao = this.getBieuMau(phuLuc);
            }
        })
    }

    getLowStatus(str: string, phuLuc: string) {
        const baoCao = this.getBieuMau(phuLuc);
        const index: number = baoCao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    getBieuMau(phuLuc) {
        switch (phuLuc) {
            // 4a nhap
            case '4ax-I1':
                return this.lstCtietBcao4axI1;
            case '4ax-I2':
                return this.lstCtietBcao4axI2;
            case '4ax-I3':
                return this.lstCtietBcao4axI3;
            case '4ax-II1.1':
                return this.lstCtietBcao4axII11;
            case '4ax-II1.2':
                return this.lstCtietBcao4axII12;
            case '4ax-II2':
                return this.lstCtietBcao4axII2;
            case '4ax-II3':
                return this.lstCtietBcao4axII3;
            case '4ax-III1':
                return this.lstCtietBcao4axIII1;
            case '4ax-III2':
                return this.lstCtietBcao4axIII2;
            case '4ax-III3':
                return this.lstCtietBcao4axIII3;
            case '4ax-B':
                return this.lstCtietBcao4axB;
            default:
                return null;
        }
    }

    setBieuMau(listPhuLuc: any, phuLuc: string) {
        switch (phuLuc) {
            //4a nhap
            case '4ax-I1':
                this.lstCtietBcao4axI1 = listPhuLuc;
                break;
            case '4ax-I2':
                this.lstCtietBcao4axI2 = listPhuLuc;
                break;
            case '4ax-I3':
                this.lstCtietBcao4axI3 = listPhuLuc;
                break;
            case '4ax-II1.1':
                this.lstCtietBcao4axII11 = listPhuLuc;
                break;
            case '4ax-II1.2':
                this.lstCtietBcao4axII12 = listPhuLuc;
                break;
            case '4ax-II2':
                this.lstCtietBcao4axII2 = listPhuLuc;
                break;
            case '4ax-II3':
                this.lstCtietBcao4axII3 = listPhuLuc;
                break;
            case '4ax-III1':
                this.lstCtietBcao4axIII1 = listPhuLuc;
                break;
            case '4ax-III2':
                this.lstCtietBcao4axIII2 = listPhuLuc;
                break;
            case '4ax-III3':
                this.lstCtietBcao4axIII3 = listPhuLuc;
                break;
            case '4ax-B':
                this.lstCtietBcao4axB = listPhuLuc;
                break;
            default:
                break;
        }
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
            const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
            idPhuLuc.forEach(phuLuc => {
                this.updateEditCache(phuLuc);
            })
        });
    }

    addCol(vatTu: any) {
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        idPhuLuc.forEach(phuLuc => {
            const baoCao = this.getBieuMau(phuLuc);
            baoCao.forEach(data => {
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
        const idPhuLuc = LISTBIEUMAUDOT[2].lstId;
        idPhuLuc.forEach(phuLuc => {
            const baoCao = this.getBieuMau(phuLuc);
            baoCao.forEach(data => {
                data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
            })
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
                    this.trangThaiPhuLuc = trangThai;
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
        await this.saveMau04ax();
        const baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
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

    async saveMau04ax() {
        this.lstCTietBaoCaoTemp = [];
        await this.lstCtietBcao4axI1.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axI2.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axI3.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axII11.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axII12.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axII2.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axII3.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axIII1.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axIII2.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axIII3.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4axB.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
    }

    sum(stt: string, phuLuc) {
        const dataPL = new ItemDataMau0405();
        const baoCaoTemp = this.getBieuMau(phuLuc);
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
            stt = this.getHead(stt);
        }
        this.updateEditCache(phuLuc);
        // this.getTotal();
    }

    export() {
        this.quanLyVonPhiService.exportBaoCao(this.id, this.idBaoCao).toPromise().then(
            (data) => {
                fileSaver.saveAs(data, '04a_BCPN-X.xlsx');
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }
}
