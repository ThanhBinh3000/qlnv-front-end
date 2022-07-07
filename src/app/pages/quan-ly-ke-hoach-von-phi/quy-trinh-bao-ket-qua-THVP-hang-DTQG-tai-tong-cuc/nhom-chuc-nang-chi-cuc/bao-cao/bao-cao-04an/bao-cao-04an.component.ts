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
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, LA_MA, NOT_OK, OK } from "../../../../../../Utility/utils";
import { LISTBIEUMAUDOT } from '../bao-cao.constant';
import { LINH_VUC } from './bao-cao-04an.constant';

export class ItemDataMau0405 {
    bcaoCtietId = null;
    id = null;
    header = null;
    stt = '0';
    checked = false;
    level = 0;
    maNdungChi = null;
    maNdungChiCha = null;

    trongDotTcong = 0;
    trongDotThoc = 0;
    trongDotGao = 0;
    luyKeTcong = 0;
    luyKeThoc = 0;
    luyKeGao = 0;
    listCtiet: vatTu[] = [];
    ghiChu = null;
}
export class vatTu {
    id: any;
    maVtu: any;
    loaiMatHang: any;
    sl: any;
}

@Component({
    selector: 'app-bao-cao-04an',
    templateUrl: './bao-cao-04an.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao04anComponent implements OnInit {
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
    //nhóm biến biểu mẫu 04an
    lstCtietBcao4anI1: ItemDataMau0405[] = [];
    lstCtietBcao4anI2: ItemDataMau0405[] = [];
    lstCtietBcao4anI3: ItemDataMau0405[] = [];
    lstCtietBcao4anII11: ItemDataMau0405[] = [];
    lstCtietBcao4anII12: ItemDataMau0405[] = [];
    lstCtietBcao4anII2: ItemDataMau0405[] = [];
    lstCtietBcao4anII3: ItemDataMau0405[] = [];
    lstCtietBcao4anIII1: ItemDataMau0405[] = [];
    lstCtietBcao4anIII2: ItemDataMau0405[] = [];
    lstCtietBcao4anIII3: ItemDataMau0405[] = [];
    lstCtietBcao4anB: ItemDataMau0405[] = [];
    noiDungChis: any[] = [];
    noiDungChiFull: any[] = [];
    //thong tin chung
    id: any;
    lstCTietBaoCaoTemp: any[] = [];

    thuyetMinh: string;
    maDviTien: string = '1';
    tuNgay: any;
    denNgay: any;
    listIdDelete: string = "";
    trangThaiPhuLuc: string = '1';
    idBaoCao: string;        //id bao cao to

    //trang thai cac nut
    status: boolean = false;
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
        this.luyKes = await this.data?.luyKes.find(item => item.maLoai == '7')?.lstCtietBcaos;
        this.spinner.show();
        // 04an
        await this.lstCTietBaoCaoTemp?.filter(async el => {
            await el.listCtiet.sort((a, b) => a.maVtu - b.maVtu);
            this.lstCtietBcao4anB.push(el);
            this.updateEditCache('4an-B');
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

        let dataPL;                 // du lieu default phu luc
        dataPL = new ItemDataMau0405();
        if (this.lstCtietBcao4anB.length == 0) {
            await this.noiDungChiFull.forEach(element => {
                let data: any = {
                    ...dataPL,
                    maNdungChi: element.id,
                    maVtu: element.id,
                    level: element.level,
                    stt: element.ghiChu,
                    header: '4an-B',
                    listCtiet: [],
                    id: uuid.v4() + "FE",
                };
                this.lstCtietBcao4anB.push(data);
            });
            this.updateEditCache('4an-B');
        }
        if (this.lstCtietBcao4anB.length > 0) {
            if (!this.lstCtietBcao4anB[0].stt) {
                let lstTemp = [];
                await this.noiDungChiFull.forEach(element => {
                    lstTemp.push(this.lstCtietBcao4anB.find(item => item.maNdungChi == element.id));
                });
                this.lstCtietBcao4anB = lstTemp;
                await this.sortWithoutIndex();
            } else {
                await this.sortByIndex();
            }
        }
        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
        idPhuLuc.forEach(phuLuc => {
            this.updateEditCache(phuLuc);
        })
        this.spinner.hide();
    }

    addListNoiDungChi(noiDungChiTemp) {
        let a = [];
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
        let WindowPrt = window.open(
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
            var xau: string = "";
            let chiSo: any = str.split('.');
            var n: number = chiSo.length - 1;
            var k: number = parseInt(chiSo[n], 10);
            if (n == 0) {
                xau = String.fromCharCode(k + 96).toUpperCase();
            }
            if (n == 1) {
                k = k - 4
                for (var i = 0; i < this.soLaMa.length; i++) {
                    while (k >= this.soLaMa[i].gTri) {
                        xau += this.soLaMa[i].kyTu;
                        k -= this.soLaMa[i].gTri;
                    }
                }
            };
            if (n == 2) {
                xau = (parseInt(chiSo[n], 10)).toString();
            };
            if (n == 3) {
                xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
            };
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
        let baoCao = this.getBieuMau(phuLuc)
        var start: number = baoCao.findIndex(e => e.stt == str);
        var index: number = start;
        for (var i = start + 1; i < baoCao.length; i++) {
            if (baoCao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }
    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number, phuLuc: string) {
        let baoCao = this.getBieuMau(phuLuc);
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            var str = this.getHead(baoCao[item].stt) + "." + (this.getTail(baoCao[item].stt) + heSo).toString();
            var nho = baoCao[item].stt;
            baoCao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    addLine(id: any, phuLuc) {
        let baoCao = this.getBieuMau(phuLuc);
        let dataPL;                 // du lieu default phu luc
        let lstKmTemp;              // list khoan muc chinh
        var maKm;                   // ma khoan muc

        dataPL = new ItemDataMau0405();
        lstKmTemp = this.noiDungChiFull;
        maKm = baoCao.find(e => e.id == id)?.maNdungChi;
        dataPL.header = phuLuc;
        let obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
            baoCaos : baoCao,
            tab : '7',
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
                var index: number;
                index = baoCao.findIndex(e => e.maNdungChi == res.maKhoanMuc);
                if (index == -1) {
                    let data: any = {
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
                    var data: any = {
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
        let baoCao = this.getBieuMau(phuLuc);
        var index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        var head: string = this.getHead(baoCao[index].stt); // lay phan dau cua so tt
        var tail: number = this.getTail(baoCao[index].stt); // lay phan duoi cua so tt
        var ind: number = this.findVt(baoCao[index].stt, phuLuc); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        let lstIndex: number[] = [];
        for (var i = baoCao.length - 1; i > ind; i--) {
            if (this.getHead(baoCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1, phuLuc);
        var listVtu: vatTu[] = [];
        let itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            let objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            let objLke = {
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
            let item = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
                maLoai: '7',
                listCtiet: listVtu,
            }
            baoCao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: head + "." + (tail + 1).toString(),
                maLoai: '7',
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
        let baoCao = this.getBieuMau(phuLuc);
        baoCao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //thêm cấp thấp hơn
    addLow(id: any, initItem, phuLuc: string) {
        let baoCao = this.getBieuMau(phuLuc);
        var data = baoCao.find(e => e.id == id);
        var index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        var stt: string;
        if (baoCao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt, phuLuc);
            for (var i = baoCao.length - 1; i >= 0; i--) {
                if (this.getHead(baoCao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(baoCao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        var listVtu: vatTu[] = [];
        let itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            let objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            let objLke = {
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
            let item = {
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
            let item = {
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
        var index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        // khong tim thay thi out ra
        if (index == -1) return;
        var stt: string = baoCao[index].stt;
        var nho: string = baoCao[index].stt;
        var head: string = this.getHead(baoCao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        baoCao = baoCao.filter(e => !e.stt.startsWith(nho));
        this.setBieuMau(baoCao, phuLuc);
        //update lại số thức tự cho các phần tử cần thiết
        let lstIndex: number[] = [];
        for (var i = baoCao.length - 1; i >= index; i--) {
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
        let baoCao = this.getBieuMau(phuLuc);
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
        let baoCao = this.getBieuMau(phuLuc);
        this.editCache[id].data.checked = baoCao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = baoCao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(baoCao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(baoCao[index].stt, phuLuc);
        let soLuongThucHienGop = baoCao.find(item => item.stt == '0.1.2');
        let soLuongThucHienNamTruoc = baoCao.find(item => item.stt == '0.1.3');
        let soLuongThucHienNamNay = baoCao.find(item => item.stt == '0.1.4');
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
        let baoCao = this.getBieuMau(phuLuc);
        var data = baoCao.find(e => e.id == id);
        //đặt các phần tử con có cùng trạng thái với nó
        baoCao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        var index: number = baoCao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0', phuLuc);
        } else {
            var nho: boolean = baoCao[index].checked;
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
        let baoCao = this.getBieuMau(phuLuc);
        var nho: boolean = true;
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
        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
        idPhuLuc.forEach(phuLuc => {
            let baoCao = this.getBieuMau(phuLuc);
            baoCao.filter(item => {
                if (item.level > 2) {
                    item.checked = this.allChecked
                }
            });
        })
    }

    deleteAllChecked() {
        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
        idPhuLuc.forEach(phuLuc => {
            let baoCao = this.getBieuMau(phuLuc);
            var lstId: any[] = [];
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
        var listVtu: vatTu[] = [];
        let itemLine = this.luyKes?.find(item => item.maNdungChi == initItem.maNdungChi)?.listCtiet;
        this.listColTemp.forEach((e) => {
            let objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            let objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });
        let baoCao = [];
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
        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
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
            var lstTemp: any[] = [];
            baoCao.forEach(item => {
                var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
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
        let baoCao = this.getBieuMau(phuLuc);
        baoCao.forEach(item => {
            item.level = this.noiDungChiFull.find(e => e.id == item.maNdungChi)?.level;
        })
        this.setBieuMau(baoCao, phuLuc);
    }

    getIdCha(maKM: any) {
        return this.noiDungChiFull.find(e => e.id == maKM)?.idCha;
    }

    async sortWithoutIndex() {
        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
        await idPhuLuc.forEach(async phuLuc => {
            await this.setDetail(phuLuc);
            let baoCao = this.getBieuMau(phuLuc);
            this.setDetail(phuLuc);
            var level = 0;
            var danhSachChiTietBaoCaoTemp: any[] = baoCao;
            baoCao = [];
            var data = danhSachChiTietBaoCaoTemp.find(e => e.level == 0);
            await this.addFirst(data, phuLuc);
            baoCao = this.getBieuMau(phuLuc);
            danhSachChiTietBaoCaoTemp = danhSachChiTietBaoCaoTemp.filter(e => e.id != data.id);
            var lstTemp = danhSachChiTietBaoCaoTemp.filter(e => e.level == level);
            while (lstTemp.length != 0 || level == 0) {
                lstTemp.forEach(item => {
                    let idCha = this.getIdCha(item.maNdungChi);
                    var index: number = baoCao.findIndex(e => e.maNdungChi == idCha);
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
        let baoCao = this.getBieuMau(phuLuc);
        var index: number = baoCao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    getBieuMau(phuLuc) {
        switch (phuLuc) {
            // 4a nhap
            case '4an-I1':
                return this.lstCtietBcao4anI1;
            case '4an-I2':
                return this.lstCtietBcao4anI2;
            case '4an-I3':
                return this.lstCtietBcao4anI3;
            case '4an-II1.1':
                return this.lstCtietBcao4anII11;
            case '4an-II1.2':
                return this.lstCtietBcao4anII12;
            case '4an-II2':
                return this.lstCtietBcao4anII2;
            case '4an-II3':
                return this.lstCtietBcao4anII3;
            case '4an-III1':
                return this.lstCtietBcao4anIII1;
            case '4an-III2':
                return this.lstCtietBcao4anIII2;
            case '4an-III3':
                return this.lstCtietBcao4anIII3;
            case '4an-B':
                return this.lstCtietBcao4anB;
            default:
                return null;
        }
    }

    setBieuMau(listPhuLuc: any, phuLuc: string) {
        switch (phuLuc) {
            //4a nhap
            case '4an-I1':
                this.lstCtietBcao4anI1 = listPhuLuc;
                break;
            case '4an-I2':
                this.lstCtietBcao4anI2 = listPhuLuc;
                break;
            case '4an-I3':
                this.lstCtietBcao4anI3 = listPhuLuc;
                break;
            case '4an-II1.1':
                this.lstCtietBcao4anII11 = listPhuLuc;
                break;
            case '4an-II1.2':
                this.lstCtietBcao4anII12 = listPhuLuc;
                break;
            case '4an-II2':
                this.lstCtietBcao4anII2 = listPhuLuc;
                break;
            case '4an-II3':
                this.lstCtietBcao4anII3 = listPhuLuc;
                break;
            case '4an-III1':
                this.lstCtietBcao4anIII1 = listPhuLuc;
                break;
            case '4an-III2':
                this.lstCtietBcao4anIII2 = listPhuLuc;
                break;
            case '4an-III3':
                this.lstCtietBcao4anIII3 = listPhuLuc;
                break;
            case '4an-B':
                this.lstCtietBcao4anB = listPhuLuc;
                break;
            default:
                break;
        }
    }

    tinhTong(id: any) {
        //luy ke default
        let itemLine = this.luyKes?.find(item => item.maNdungChi == this.editCache[id].data.maNdungChi)?.listCtiet;

        let tonglstChitietVtuTrongDot = 0;
        let tonglstChitietVtuLuyke = 0;
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == '0') {
                    tonglstChitietVtuTrongDot += e.sl;
                    //set luy ke tuong ung = luy ke default + chi tiet theo dot
                    let sl = itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl ? itemLine?.find(item => item.maVtu == e.maVtu && item.loaiMatHang == '1')?.sl : 0;
                    this.editCache[id].data.listCtiet.find(a => a.maVtu == e.maVtu && a.loaiMatHang == '1').sl = sl + e.sl;                }
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
        let lstDviChon = this.lstVatTuFull.filter(item => this.listColTemp?.findIndex(data => data.maVtu == item.id) == -1);
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
            let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
            idPhuLuc.forEach(phuLuc => {
                this.updateEditCache(phuLuc);
            })
        });
    }

    addCol(vatTu: any) {

        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
        idPhuLuc.forEach(phuLuc => {
            let baoCao = this.getBieuMau(phuLuc);
            baoCao.forEach(data => {
                let itemLine = this.luyKes?.find(item => item.maNdungChi == data.maNdungChi)?.listCtiet;
                let objTrongD = {
                    id: uuid.v4() + 'FE',
                    maVtu: vatTu.id,
                    colName: vatTu.ten,
                    loaiMatHang: '0',
                    sl: 0,
                }
                let objLke = {
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
        let idPhuLuc = LISTBIEUMAUDOT[3].lstId;
        idPhuLuc.forEach(phuLuc => {
            let baoCao = this.getBieuMau(phuLuc);
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
        await this.saveMau04an();
        let baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = this.tuNgay;
        baoCaoChiTietTemp.denNgay = this.denNgay;

        let checkMoneyRange = true;
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

    async saveMau04an() {
        this.lstCTietBaoCaoTemp = [];
        await this.lstCtietBcao4anI1.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anI2.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anI3.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anII11.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anII12.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anII2.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anII3.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anIII1.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anIII2.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anIII3.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao4anB.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
    }

    sum(stt: string, phuLuc) {
        let dataPL = new ItemDataMau0405();
        let baoCaoTemp = this.getBieuMau(phuLuc);
        stt = this.getHead(stt);
        while (stt != '0') {
            var index = baoCaoTemp.findIndex(e => e.stt == stt);
            let data = baoCaoTemp[index];
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
                fileSaver.saveAs(data, '04a_BCPN-N.xlsx');
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }
}
