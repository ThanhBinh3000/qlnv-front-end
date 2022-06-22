import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, LA_MA, NOT_OK, OK } from "../../../../../../Utility/utils";
import { LISTBIEUMAUDOT, NOI_DUNG } from '../bao-cao.constant';
import { LINH_VUC } from './bao-cao-03.constant';

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
    maDviTien: string = '1';
    tuNgay: any;
    denNgay: any;
    listIdDelete: string = "";
    trangThaiPhuLuc: string = '1';

    //trang thai cac nut
    status: boolean = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;

    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {};
    soLuongKhoachXb = 0;
    soLuongTteXb = 0;
    dgGiaKhoachXb = 0;
    dgGiaBanTthieuXb = 0;
    dgGiaBanTteXb = 0;
    ttGiaHtoanXb = 0;
    ttGiaBanTteXb = 0;
    ttClechGiaTteVaGiaHtoanXb = 0;
    soLuongKhoachXCTVT = 0;
    soLuongTteXCTVT = 0;
    dgGiaKhoachXCTVT = 0;
    dgGiaBanTthieuXCTVT = 0;
    dgGiaBanTteXCTVT = 0;
    ttGiaHtoanXCTVT = 0;
    ttGiaBanTteXCTVT = 0;
    ttClechGiaTteVaGiaHtoanXCTVT = 0;
    soLuongKhoachXk = 0;
    soLuongTteXk = 0;
    dgGiaKhoachXk = 0;
    dgGiaBanTthieuXk = 0;
    dgGiaBanTteXk = 0;
    ttGiaHtoanXk = 0;
    ttGiaBanTteXk = 0;
    ttClechGiaTteVaGiaHtoanXk = 0;
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
        this.lstCTietBaoCaoTemp = this.data?.lstCtietBcaos;
        this.tuNgay = this.data?.tuNgay;
        this.denNgay = this.data?.denNgay;
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
        let idPhuLuc = LISTBIEUMAUDOT[1].lstId;
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
    getChiMuc(str: string, dauMuc: string): string {
        if (str) {
            str = str.substring(str.indexOf('.') + 1, str.length);
            var xau: string = "";
            let chiSo: any = str.split('.');
            var n: number = chiSo.length - 1;
            var k: number = parseInt(chiSo[n], 10);
            if (dauMuc == '1') {
                if (n == 0) {
                    xau = chiSo[n];
                };
                if (n == 1) {
                    xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
                };
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
                };
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
                    for (var i = 0; i < this.soLaMa.length; i++) {
                        while (k >= this.soLaMa[i].gTri) {
                            xau += this.soLaMa[i].kyTu;
                            k -= this.soLaMa[i].gTri;
                        }
                    }
                };
                if (n == 1) {
                    xau = chiSo[n];
                };
                if (n == 2) {
                    xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
                };
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

        dataPL = new ItemDataMau03();
        lstKmTemp = this.lstVatTuFull;
        maKm = baoCao.find(e => e.id == id)?.maVtu;
        dataPL.header = phuLuc;
        let obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogThemKhoanMucComponent,
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
                index = baoCao.findIndex(e => e.maVtu == res.maKhoanMuc);
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
                    }
                }
                baoCao = this.getBieuMau(phuLuc);
                id = baoCao.find(e => e.maVtu == res.maKhoanMuc)?.id;

                res.lstKhoanMuc.forEach(item => {
                    var data: any = {
                        ...dataPL,
                        maNdungChi: item.id,
                        maVtu: item.id,
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




        // them moi phan tu
        if (initItem?.id) {
            let item = {
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
            let item = {
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

        // them moi phan tu
        if (initItem?.id) {
            let item = {
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
            let item = {
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
        var index: number = baoCao.findIndex(e => e.id == id); // vi tri hien tai
        var stt: string = baoCao[index].stt;

        // khong tim thay thi out ra
        if (index == -1) return;
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
        let baoCao = this.getBieuMau(phuLuc);
        this.editCache[id].data.checked = baoCao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = baoCao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(baoCao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(baoCao[index].stt, phuLuc);
        this.changeModel();
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
        let idPhuLuc = LISTBIEUMAUDOT[1].lstId;
        idPhuLuc.forEach(phuLuc => {
            let baoCao = this.getBieuMau(phuLuc);
            baoCao.filter(item =>
                item.checked = this.allChecked
            );
        })
    }

    deleteAllChecked() {
        let idPhuLuc = LISTBIEUMAUDOT[1].lstId;
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
        let baoCao = [];
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
        let idPhuLuc = LISTBIEUMAUDOT[1].lstId;
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
            item.level = this.lstVatTuFull.find(e => e.id == item.maVtu)?.level;
        })
        this.setBieuMau(baoCao, phuLuc);
    }

    getIdCha(maKM: any) {
        return this.lstVatTuFull.find(e => e.id == maKM)?.idCha;
    }

    async sortWithoutIndex() {
        let idPhuLuc = LISTBIEUMAUDOT[1].lstId;
        await idPhuLuc.forEach(async phuLuc => {
            await this.setDetail(phuLuc);
            let baoCao = this.getBieuMau(phuLuc);
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
                    let idCha = this.getIdCha(item.maNdung);
                    var index: number = baoCao.findIndex(e => e.maVtu == idCha);
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
        let baoCao = this.getBieuMau(phuLuc);
        var index: number = baoCao.findIndex(e => this.getHead(e.stt) == str);
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
        await this.saveMau03();
        let baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = typeof this.tuNgay == 'string' ? new Date(this.tuNgay) : this.tuNgay;
        baoCaoChiTietTemp.denNgay = typeof this.denNgay == 'string' ? new Date(this.denNgay) : this.denNgay;

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

    async saveMau03() {
        this.lstCTietBaoCaoTemp = [];
        await this.lstCtietBcao031.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao032.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
        await this.lstCtietBcao033.forEach(e => {
            this.lstCTietBaoCaoTemp.push(e);
        })
    }

    //tinh tong
    changeModel03(id: any, loaiList: any) {
        this.editCache[id].data.ttGiaHtoan = Number(this.editCache[id].data.soLuongTte) * Number(this.editCache[id].data.dgGiaKhoach);
        this.editCache[id].data.ttGiaBanTte = Number(this.editCache[id].data.soLuongTte) * Number(this.editCache[id].data.dgGiaBanTte);
        this.editCache[id].data.ttClechGiaTteVaGiaHtoan = Number(this.editCache[id].data.ttGiaBanTte) - Number(this.editCache[id].data.ttGiaHtoan);
    }

    sum(stt: string, phuLuc) {
        let dataPL = new ItemDataMau03();
        let baoCaoTemp = this.getBieuMau(phuLuc);
        stt = this.getHead(stt);
        while (stt != '0') {
            var index = baoCaoTemp.findIndex(e => e.stt == stt);
            let data = baoCaoTemp[index];
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
                    baoCaoTemp[index].dgGiaKhoach += item.dgGiaKhoach;
                    baoCaoTemp[index].dgGiaBanTthieu += item.dgGiaBanTthieu;
                    baoCaoTemp[index].dgGiaBanTte += item.dgGiaBanTte;
                    baoCaoTemp[index].ttGiaHtoan += item.ttGiaHtoan;
                    baoCaoTemp[index].ttGiaBanTte += item.ttGiaBanTte;
                    baoCaoTemp[index].ttClechGiaTteVaGiaHtoan += item.ttClechGiaTteVaGiaHtoan;
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
        this.dgGiaKhoachXb = 0;
        this.dgGiaBanTthieuXb = 0;
        this.dgGiaBanTteXb = 0;
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
                this.dgGiaKhoachXb += Number(element.dgGiaKhoach);
                this.dgGiaBanTthieuXb += Number(element.dgGiaBanTthieu);
                this.dgGiaBanTteXb += Number(element.dgGiaBanTte);
                this.ttGiaHtoanXb += Number(element.ttGiaHtoan);
                this.ttGiaBanTteXb += Number(element.ttGiaBanTte);
                this.ttClechGiaTteVaGiaHtoanXb += Number(element.ttClechGiaTteVaGiaHtoan);
            }
        })
        await this.lstCtietBcao032.forEach(element => {
            if (element?.stt?.split('.').length == 2) {
                this.soLuongKhoachXCTVT += Number(element.soLuongKhoach);
                this.soLuongTteXCTVT += Number(element.soLuongTte);
                this.dgGiaKhoachXCTVT += Number(element.dgGiaKhoach);
                this.dgGiaBanTthieuXCTVT += Number(element.dgGiaBanTthieu);
                this.dgGiaBanTteXCTVT += Number(element.dgGiaBanTte);
                this.ttGiaHtoanXCTVT += Number(element.ttGiaHtoan);
                this.ttGiaBanTteXCTVT += Number(element.ttGiaBanTte);
                this.ttClechGiaTteVaGiaHtoanXCTVT += Number(element.ttClechGiaTteVaGiaHtoan);
            }
        })
        await this.lstCtietBcao033.forEach(element => {
            if (element?.stt?.split('.').length == 2) {
                this.soLuongKhoachXk += Number(element.soLuongKhoach);
                this.soLuongTteXk += Number(element.soLuongTte);
                this.dgGiaKhoachXk += Number(element.dgGiaKhoach);
                this.dgGiaBanTthieuXk += Number(element.dgGiaBanTthieu);
                this.dgGiaBanTteXk += Number(element.dgGiaBanTte);
                this.ttGiaHtoanXk += Number(element.ttGiaHtoan);
                this.ttGiaBanTteXk += Number(element.ttGiaBanTte);
                this.ttClechGiaTteVaGiaHtoanXk += Number(element.ttClechGiaTteVaGiaHtoan);
            }
        })
    }
}
