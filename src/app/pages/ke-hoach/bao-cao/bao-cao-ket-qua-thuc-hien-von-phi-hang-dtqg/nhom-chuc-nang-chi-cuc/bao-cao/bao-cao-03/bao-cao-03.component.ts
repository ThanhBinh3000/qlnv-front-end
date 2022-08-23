import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { displayNumber, divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney, NOT_OK, OK, Utils } from "src/app/Utility/utils";
import { LISTBIEUMAUDOT } from '../bao-cao.constant';
import { DialogThemVatTuComponent } from 'src/app/components/dialog/dialog-vat-tu/dialog-vat-tu.component';
import { DatePipe } from '@angular/common';

export class ItemDataMau03 {
    id = null;
    header = null;
    stt = '0';
    checked = false;
    level = 0;
    maVtu = null;
    maVtuCha = null;
    bcaoCtietId = null;

    maDviTinh = null;
    soLuongKhoach = 0;
    soLuongTte = 0;
    dgGiaKhoach = 0;
    dgGiaBanTthieu = 0;
    dgGiaBanTte = 0;
    ttGiaHtoan = 0;
    ttGiaBanTte = 0;
    ttClechGiaTteVaGiaHtoan = 0;
    ghiChu = null;

}

@Component({
    selector: 'app-bao-cao-03',
    templateUrl: './bao-cao-03.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao03Component implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    listVattu: any[] = [];
    lstVatTuFull = [];
    //nhóm biến biểu mẫu 03
    lstCtietBcao031: ItemDataMau03[] = [];
    lstCtietBcao032: ItemDataMau03[] = [];
    lstCtietBcao033: ItemDataMau03[] = [];
    listDonvitinh: any[] = [];

    //thong tin chung
    id: any;
    idBaoCao: string;        //id bao cao to
    lstCTietBaoCaoTemp: any[] = [];

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
    editCache: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {};
    soLuongKhoachXb = null;
    soLuongTteXb = null;
    dgGiaKhoachXb = null;
    dgGiaBanTthieuXb = null;
    dgGiaBanTteXb = null;
    ttGiaHtoanXb = null;
    ttGiaBanTteXb = null;
    ttClechGiaTteVaGiaHtoanXb = null;
    soLuongKhoachXCTVT = null;
    soLuongTteXCTVT = null;
    dgGiaKhoachXCTVT = null;
    dgGiaBanTthieuXCTVT = null;
    dgGiaBanTteXCTVT = null;
    ttGiaHtoanXCTVT = null;
    ttGiaBanTteXCTVT = null;
    ttClechGiaTteVaGiaHtoanXCTVT = null;
    soLuongKhoachXk = null;
    soLuongTteXk = null;
    dgGiaKhoachXk = null;
    dgGiaBanTthieuXk = null;
    dgGiaBanTteXk = null;
    ttGiaHtoanXk = null;
    ttGiaBanTteXk = null;
    ttClechGiaTteVaGiaHtoanXk = null;
    formatter = value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;
    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private datePipe: DatePipe,
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
        this.tuNgay = this.data?.tuNgay;
        this.denNgay = this.data?.denNgay;
        //chia tien
        this.lstCTietBaoCaoTemp.forEach(item => {
            item.dgGiaKhoach = divMoney(item.dgGiaKhoach, this.maDviTien);
            item.dgGiaBanTthieu = divMoney(item.dgGiaBanTthieu, this.maDviTien);
            item.dgGiaBanTte = divMoney(item.dgGiaBanTte, this.maDviTien);
            item.ttGiaHtoan = divMoney(item.ttGiaHtoan, this.maDviTien);
            item.ttGiaBanTte = divMoney(item.ttGiaBanTte, this.maDviTien);
            item.ttClechGiaTteVaGiaHtoan = divMoney(item.ttClechGiaTteVaGiaHtoan, this.maDviTien);
        })
        // 03
        await this.lstCTietBaoCaoTemp?.filter(async el => {
            switch (el.header) {
                case '31':
                    this.lstCtietBcao031.push(el);
                    this.updateEditCache('31');
                    break;
                case '32':
                    this.lstCtietBcao032.push(el);
                    this.updateEditCache('32');
                    break;
                case '33':
                    this.lstCtietBcao033.push(el);
                    this.updateEditCache('33');
                    break;
                default:
                    break;
            }
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
        await this.quanLyVonPhiService.dmDonvitinh().toPromise().then(
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
        if (this.lstCTietBaoCaoTemp.length > 0) {
            if (!this.lstCTietBaoCaoTemp[0].stt) {
                await this.sortWithoutIndex();
            } else {
                await this.sortByIndex();
            }
        }
        this.changeModel();
        const idPhuLuc = LISTBIEUMAUDOT[1].lstId;
        idPhuLuc.forEach(phuLuc => {
            this.updateEditCache(phuLuc);
        })
        this.spinner.hide();
    }

    async addListVatTu(listVattu, idCha) {
        await listVattu.forEach(async item => {
            item = {
                ...item,
                tenDm: item.ten,
                level: Number(item.cap) - 1,
                idCha: idCha,
            }
            this.lstVatTuFull.push(item);
            if (item.child) {
                await this.addListVatTu(item.child, item.id);
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
    getChiMuc(str: string, dauMuc: string): string {
        if (str) {
            str = str.substring(str.indexOf('.') + 1, str.length);
            let xau = "";
            const chiSo: string[] = str.split('.');
            const n: number = chiSo.length - 1;
            let k: number = parseInt(chiSo[n], 10);
            if (dauMuc == '1') {
                if (n == 0) {
                    xau = chiSo[n];
                }
                if (n == 1) {
                    xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
                }
                if (n == 2) {
                    xau = String.fromCharCode(k + 96);
                }
                if (n == 3) {
                    xau = "-";
                }
                return xau;
            } else if (dauMuc == '2') {
                if (n == 0) {
                    xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
                }
                if (n == 1) {
                    xau = String.fromCharCode(k + 96);
                }
                if (n == 2) {
                    xau = "-";
                }
                return xau;
            } else if (dauMuc == '3') {
                if (n == 0) {
                    xau = String.fromCharCode(k + 96);
                }
                if (n == 1) {
                    xau = "-";
                }
                return xau;
            } else if (dauMuc == '4') {
                if (n == 0) {
                    xau = "-";
                }
                return xau;
            } else {
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
        if (heSo == -1) {
            lstIndex.reverse();
        }
        const baoCao = this.getBieuMau(phuLuc);
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(baoCao[item].stt) + "." + (this.getTail(baoCao[item].stt) + heSo).toString();
            const nho = baoCao[item].stt;
            baoCao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
        this.setBieuMau(baoCao, phuLuc);
    }

    addLine(id: any, phuLuc) {
        let baoCao = this.getBieuMau(phuLuc);

        const dataPL = new ItemDataMau03();
        const lstKmTemp = this.lstVatTuFull;
        const maKm = baoCao.find(e => e.id == id)?.maVtu;
        dataPL.header = phuLuc;
        const obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
            baoCaos: baoCao,
            tab: '5',
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
                const index: number = baoCao.findIndex(e => e.maVtu == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: res.maKhoanMuc,
                        maVtu: res.maKhoanMuc,
                        maDviTinh: res.maDviTinh,
                        level: lstKmTemp.find(e => e.id == maKm)?.level,
                    };
                    if (baoCao.length == 0) {
                        await this.addFirst(data, phuLuc);
                    } else {
                        await this.addSame(id, data, phuLuc);
                    }
                }
                baoCao = this.getBieuMau(phuLuc);
                id = baoCao.find(e => e.maVtu == res.maKhoanMuc)?.id;

                res.lstKhoanMuc.forEach(item => {
                    const data: any = {
                        ...dataPL,
                        maNdungChi: item.id,
                        maVtu: item.id,
                        maDviTinh: item.maDviTinh,
                        level: item.level,
                    };
                    this.addLow(id, data, phuLuc);
                })
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

        // them moi phan tu
        if (initItem?.id) {
            const item = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
                maLoai: '5',
                listCtiet: []
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
                maLoai: '5',
                listCtiet: []
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

        // them moi phan tu
        if (initItem?.id) {
            const item = {
                ...initItem,
                stt: stt,
                listCtiet: []
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
                listCtiet: []
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
        if (!baoCao[index].maVtu) {
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
    saveEdit(id: string, phuLuc: string): void {
        if (!this.editCache[id].data.maVtu) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
            return;
        }
        const baoCao = this.getBieuMau(phuLuc);
        this.editCache[id].data.checked = baoCao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = baoCao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(baoCao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(baoCao[index].stt, phuLuc);
        this.changeModel();
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
        const idPhuLuc = LISTBIEUMAUDOT[1].lstId;
        idPhuLuc.forEach(phuLuc => {
            const baoCao = this.getBieuMau(phuLuc);
            baoCao.filter(item =>
                item.checked = this.allChecked
            );
        })
    }

    deleteAllChecked() {
        const idPhuLuc = LISTBIEUMAUDOT[1].lstId;
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
        const baoCao = [];
        let item;
        if (initItem?.id) {
            item = {
                ...initItem,
                stt: "0.1",
                listCtiet: []
            }
        } else {
            item = {
                ...initItem,
                id: uuid.v4() + 'FE',
                stt: "0.1",
                level: 0,
                listCtiet: []
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
        const idPhuLuc = LISTBIEUMAUDOT[1].lstId;
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
            item.level = this.lstVatTuFull.find(e => e.id == item.maVtu)?.level;
        })
        this.setBieuMau(baoCao, phuLuc);
    }

    getIdCha(maKM: any) {
        return this.lstVatTuFull.find(e => e.id == maKM)?.idCha;
    }

    async sortWithoutIndex() {
        const idPhuLuc = LISTBIEUMAUDOT[1].lstId;
        await idPhuLuc.forEach(async phuLuc => {
            await this.setDetail(phuLuc);
            let baoCao = this.getBieuMau(phuLuc);
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
                    const idCha = this.getIdCha(item.maVtu);
                    let index: number = baoCao.findIndex(e => e.maVtu == idCha);
                    if (index != -1) {
                        this.addLow(baoCao[index].id, item, phuLuc);
                    } else {
                        index = baoCao.findIndex(e => this.getIdCha(e.maVtu) == idCha);
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
            case '31':
                return this.lstCtietBcao031;
            case '32':
                return this.lstCtietBcao032;
            case '33':
                return this.lstCtietBcao033;
            default:
                return null;
        }
    }

    setBieuMau(listPhuLuc: any, phuLuc: string) {
        switch (phuLuc) {
            case '31':
                this.lstCtietBcao031 = listPhuLuc;
                break;
            case '32':
                this.lstCtietBcao032 = listPhuLuc;
                break;
            case '33':
                this.lstCtietBcao033 = listPhuLuc;
                break;
            default:
                break;
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
        this.lstCTietBaoCaoTemp = [];
        this.saveMau03(this.lstCtietBcao031);
        this.saveMau03(this.lstCtietBcao032);
        this.saveMau03(this.lstCtietBcao033);
        //check khoang gia tien co qua lon ko
        let checkMoneyRange = true;
        this.lstCTietBaoCaoTemp.forEach(item => {
            if (item.dgGiaKhoach > MONEY_LIMIT || item.dgGiaBanTthieu > MONEY_LIMIT || item.dgGiaBanTte > MONEY_LIMIT ||
                item.ttGiaHtoan > MONEY_LIMIT || item.ttGiaBanTte > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }

        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        const baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = typeof this.tuNgay == 'string' ? new Date(this.tuNgay) : this.tuNgay;
        baoCaoChiTietTemp.denNgay = typeof this.denNgay == 'string' ? new Date(this.denNgay) : this.denNgay;

        if (this.datePipe.transform(baoCaoChiTietTemp.tuNgay, Utils.FORMAT_DATE_STR) > this.datePipe.transform(baoCaoChiTietTemp.denNgay, Utils.FORMAT_DATE_STR)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_DAY);
            return;
        }

        if (!baoCaoChiTietTemp.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

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

    async saveMau03(lstCTietBCao: ItemDataMau03[]) {
        lstCTietBCao.forEach(item => {
            this.lstCTietBaoCaoTemp.push({
                ...item,
                dgGiaKhoach: mulMoney(item.dgGiaKhoach, this.maDviTien),
                dgGiaBanTthieu: mulMoney(item.dgGiaBanTthieu, this.maDviTien),
                dgGiaBanTte: mulMoney(item.dgGiaBanTte, this.maDviTien),
                ttGiaHtoan: mulMoney(item.ttGiaHtoan, this.maDviTien),
                ttGiaBanTte: mulMoney(item.ttGiaBanTte, this.maDviTien),
                ttClechGiaTteVaGiaHtoan: mulMoney(item.ttClechGiaTteVaGiaHtoan, this.maDviTien),
            })
        })
    }

    //tinh tong
    changeModel03(id: any, loaiList: any) {
        this.editCache[id].data.ttGiaHtoan = Number(this.editCache[id].data.soLuongTte) * Number(this.editCache[id].data.dgGiaKhoach);
        this.editCache[id].data.ttGiaBanTte = Number(this.editCache[id].data.soLuongTte) * Number(this.editCache[id].data.dgGiaBanTte);
        this.editCache[id].data.ttClechGiaTteVaGiaHtoan = Number(this.editCache[id].data.ttGiaBanTte) - Number(this.editCache[id].data.ttGiaHtoan);
    }

    sum(stt: string, phuLuc) {
        const dataPL = new ItemDataMau03();
        const baoCaoTemp = this.getBieuMau(phuLuc);
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = baoCaoTemp.findIndex(e => e.stt == stt);
            const data = baoCaoTemp[index];
            baoCaoTemp[index] = {
                ...dataPL,
                id: data.id,
                stt: data.stt,
                header: data.header,
                checked: data.checked,
                level: data.level,
                bcaoCtietId: data.bcaoCtietId,
                maVtu: data.maVtu,
                ghiChu: data.ghiChu,
                maVtuCha: data.maVtuCha,
                maDviTinh: data.maDviTinh,
            }
            baoCaoTemp.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    baoCaoTemp[index].soLuongKhoach += item.soLuongKhoach;
                    baoCaoTemp[index].soLuongTte += item.soLuongTte;
                    baoCaoTemp[index].ttGiaHtoan += item.ttGiaHtoan;
                    baoCaoTemp[index].ttGiaBanTte += item.ttGiaBanTte;
                    baoCaoTemp[index].ttClechGiaTteVaGiaHtoan += item.ttClechGiaTteVaGiaHtoan;
                    baoCaoTemp[index].dgGiaKhoach = null;
                    baoCaoTemp[index].dgGiaBanTthieu = null;
                    baoCaoTemp[index].dgGiaBanTte = null;
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
                fileSaver.saveAs(data, '03BCX.xlsx');
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }


    async changeModel() {
        this.soLuongKhoachXb = 0;
        this.soLuongTteXb = 0;
        // this.dgGiaKhoachXb = 0;
        // this.dgGiaBanTthieuXb = 0;
        // this.dgGiaBanTteXb = 0;
        this.ttGiaHtoanXb = 0;
        this.ttGiaBanTteXb = 0;
        this.ttClechGiaTteVaGiaHtoanXb = 0;
        this.soLuongKhoachXCTVT = 0;
        this.soLuongTteXCTVT = 0;
        this.dgGiaKhoachXCTVT = 0;
        this.dgGiaBanTthieuXCTVT = 0;
        this.dgGiaBanTteXCTVT = 0;
        this.ttGiaHtoanXCTVT = 0;
        this.ttGiaBanTteXCTVT = 0;
        this.ttClechGiaTteVaGiaHtoanXCTVT = 0;
        this.soLuongKhoachXk = 0;
        this.soLuongTteXk = 0;
        this.dgGiaKhoachXk = 0;
        this.dgGiaBanTthieuXk = 0;
        this.dgGiaBanTteXk = 0;
        this.ttGiaHtoanXk = 0;
        this.ttGiaBanTteXk = 0;
        this.ttClechGiaTteVaGiaHtoanXk = 0;
        await this.lstCtietBcao031.forEach(element => {
            if (element?.stt?.split('.').length == 2) {
                this.soLuongKhoachXb += Number(element.soLuongKhoach);
                this.soLuongTteXb += Number(element.soLuongTte);
                // this.dgGiaKhoachXb += Number(element.dgGiaKhoach);
                // this.dgGiaBanTthieuXb += Number(element.dgGiaBanTthieu);
                // this.dgGiaBanTteXb += Number(element.dgGiaBanTte);
                this.ttGiaHtoanXb += Number(element.ttGiaHtoan);
                this.ttGiaBanTteXb += Number(element.ttGiaBanTte);
                this.ttClechGiaTteVaGiaHtoanXb += Number(element.ttClechGiaTteVaGiaHtoan);
            }
        })
        await this.lstCtietBcao032.forEach(element => {
            if (element?.stt?.split('.').length == 2) {
                this.soLuongKhoachXCTVT += Number(element.soLuongKhoach);
                this.soLuongTteXCTVT += Number(element.soLuongTte);
                // this.dgGiaKhoachXCTVT += Number(element.dgGiaKhoach);
                // this.dgGiaBanTthieuXCTVT += Number(element.dgGiaBanTthieu);
                // this.dgGiaBanTteXCTVT += Number(element.dgGiaBanTte);
                this.ttGiaHtoanXCTVT += Number(element.ttGiaHtoan);
                this.ttGiaBanTteXCTVT += Number(element.ttGiaBanTte);
                this.ttClechGiaTteVaGiaHtoanXCTVT += Number(element.ttClechGiaTteVaGiaHtoan);
            }
        })
        await this.lstCtietBcao033.forEach(element => {
            if (element?.stt?.split('.').length == 2) {
                this.soLuongKhoachXk += Number(element.soLuongKhoach);
                this.soLuongTteXk += Number(element.soLuongTte);
                // this.dgGiaKhoachXk += Number(element.dgGiaKhoach);
                // this.dgGiaBanTthieuXk += Number(element.dgGiaBanTthieu);
                // this.dgGiaBanTteXk += Number(element.dgGiaBanTte);
                this.ttGiaHtoanXk += Number(element.ttGiaHtoan);
                this.ttGiaBanTteXk += Number(element.ttGiaBanTte);
                this.ttClechGiaTteVaGiaHtoanXk += Number(element.ttClechGiaTteVaGiaHtoan);
            }
        })
    }

    displayValue(num: number): string {
        return displayNumber(num);
    }
}
