import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, LA_MA, QLNV_KHVONPHI_TC_CTIET_NCAU_CHI_TX_GD3N } from "../../../../../Utility/utils";
// import { LA_MA } from '../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { Role } from '../../quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { LINH_VUC } from './phu-luc4.constant';

export class ItemData {
    id: any;
    stt: string;
    level: number;
    loaiMatHang: string;
    maDviTinh: number;
    slBquanKh: number;
    slBquanTte: number;
    slBquanUocThien: number;
    slBquanTcong: number;
    dinhMuc: number;
    thanhTien: number;
    dtoanThieuNTruoc: number;
    tongNcauKphi: number;
    kphiTcong: number;
    kphiQtoanNtruoc: number;
    kphiDtoanGiaoTnam: number;
    kphiPvcTcDchuyen: number;
    dtoanDchinh: number;
    checked!: boolean;
}
@Component({
  selector: 'app-phu-luc4',
  templateUrl: './phu-luc4.component.html',
})
export class PhuLuc4Component implements OnInit {
    @Input() data;
    //danh muc
    donVis: any = [];
    matHangs: any[] = LINH_VUC;
    lstCTietBCao: ItemData[];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    //thong tin chung
    namBcao: number = 2022;
    maLoaiBaoCao: string = QLNV_KHVONPHI_TC_CTIET_NCAU_CHI_TX_GD3N;
    thuyetMinh: string;
    maDviTien: any;
    listIdDelete: string = "";
    trangThaiPhuLuc: string = '1';
    initItem: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        loaiMatHang: '',
        maDviTinh: 0,
        slBquanKh: 0,
        slBquanTte: 0,
        slBquanUocThien: 0,
        slBquanTcong: 0,
        dinhMuc: 0,
        thanhTien: 0,
        dtoanThieuNTruoc: 0,
        tongNcauKphi: 0,
        kphiTcong: 0,
        kphiQtoanNtruoc: 0,
        kphiDtoanGiaoTnam: 0,
        kphiPvcTcDchuyen: 0,
        dtoanDchinh: 0,
        checked: false,
    };
    //trang thai cac nut
    status: boolean = false;
    statusBtnDone: boolean;
    statusBtnOK: boolean;
    statusBtnSave: boolean;

    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(private router: Router,
        private routerActive: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private userService: UserService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private location: Location,
        private fb: FormBuilder,
        private modal: NzModalService,
    ) {
    }

    async ngOnInit() {

        this.lstCTietBCao = this.data?.lstCTiet;
        this.updateEditCache();

        //lay danh sach danh muc don vi
        await this.danhMucService.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        this.spinner.hide();
    }

    getStatusButton() {
        const roles = new Role();
        this.statusBtnDone = roles.getRoleDone(this.trangThaiPhuLuc, 3);
        this.statusBtnOK = roles.getRoleOK(this.trangThaiPhuLuc, 3);
        this.statusBtnSave = roles.getRoleSaveBM(this.trangThaiPhuLuc, 3);
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        var xau: string = "";
        let chiSo: any = str.split('.');
        var n: number = chiSo.length - 1;
        var k: number = parseInt(chiSo[n], 10);
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
        var start: number = this.lstCTietBCao.findIndex(e => e.stt == str);
        var index: number = start;
        for (var i = start + 1; i < this.lstCTietBCao.length; i++) {
            if (this.lstCTietBCao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }
    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            var str = this.getHead(this.lstCTietBCao[item].stt) + "." + (this.getTail(this.lstCTietBCao[item].stt) + heSo).toString();
            var nho = this.lstCTietBCao[item].stt;
            this.lstCTietBCao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }
    //thêm ngang cấp
    addSame(id: any, initItem: ItemData) {
        var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
        var head: string = this.getHead(this.lstCTietBCao[index].stt); // lay phan dau cua so tt
        var tail: number = this.getTail(this.lstCTietBCao[index].stt); // lay phan duoi cua so tt
        var ind: number = this.findVt(this.lstCTietBCao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        let lstIndex: number[] = [];
        for (var i = this.lstCTietBCao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCTietBCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        // them moi phan tu
        if (initItem.id) {
            let item: ItemData = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
            }
            this.lstCTietBCao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item: ItemData = {
                ...initItem,
                id: uuid.v4(),
                stt: head + "." + (tail + 1).toString(),
            }
            this.lstCTietBCao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    // gan editCache.data == lstCTietBCao
    updateEditCache(): void {
        this.lstCTietBCao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }
    //thêm cấp thấp hơn
    addLow(id: any, initItem: ItemData) {
        var data: ItemData = this.lstCTietBCao.find(e => e.id === id);
        var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
        var stt: string;
        if (this.lstCTietBCao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt);
            for (var i = this.lstCTietBCao.length - 1; i >= 0; i--) {
                if (this.getHead(this.lstCTietBCao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(this.lstCTietBCao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        // them moi phan tu
        if (initItem.id) {
            let item: ItemData = {
                ...initItem,
                stt: stt,
            }
            this.lstCTietBCao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item: ItemData = {
                ...initItem,
                id: uuid.v4(),
                stt: stt,
            }
            this.lstCTietBCao.splice(index + 1, 0, item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }
    //xóa dòng
    deleteLine(id: any) {
        var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
        var nho: string = this.lstCTietBCao[index].stt;
        var head: string = this.getHead(this.lstCTietBCao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        this.lstCTietBCao = this.lstCTietBCao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        let lstIndex: number[] = [];
        for (var i = this.lstCTietBCao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCTietBCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }

        this.replaceIndex(lstIndex, -1);

        this.updateEditCache();
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCTietBCao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCTietBCao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao

        const index = this.lstCTietBCao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }


    updateChecked(id: any) {
        var data: ItemData = this.lstCTietBCao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCTietBCao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        var index: number = this.lstCTietBCao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            var nho: boolean = this.lstCTietBCao[index].checked;
            while (nho != this.checkAllChild(this.lstCTietBCao[index].stt)) {
                this.lstCTietBCao[index].checked = !nho;
                index = this.lstCTietBCao.findIndex(e => e.stt == this.getHead(this.lstCTietBCao[index].stt));
                if (index == -1) {
                    this.allChecked = !nho;
                    break;
                }
                nho = this.lstCTietBCao[index].checked;
            }
        }
    }
    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        var nho: boolean = true;
        this.lstCTietBCao.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
                nho = item.checked;
            }
        })
        return nho;
    }


    updateAllChecked() {
        this.lstCTietBCao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    deleteAllChecked() {
        var lstId: any[] = [];
        this.lstCTietBCao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCTietBCao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    }
    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(initItem: ItemData) {
        if (initItem.id) {
            let item: ItemData = {
                ...initItem,
                stt: "0.1",
            }
            this.lstCTietBCao.push(item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item: ItemData = {
                ...initItem,
                id: uuid.v4() + 'FE',
                stt: "0.1",
            }
            this.lstCTietBCao.push(item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    sortByIndex() {
        this.setDetail();
        this.lstCTietBCao.sort((item1, item2) => {
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
        this.lstCTietBCao.forEach(item => {
            var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCTietBCao = lstTemp;
    }

    setDetail() {
        this.lstCTietBCao.forEach(item => {
            item.level = this.matHangs.find(e => e.id == item.loaiMatHang)?.level;
        })
    }

    getIdCha(maKM: any) {
        return this.matHangs.find(e => e.id == maKM)?.idCha;
    }

    sortWithoutIndex() {
        this.setDetail();
        var level = 0;
        var lstCTietBCaoTemp: ItemData[] = this.lstCTietBCao;
        this.lstCTietBCao = [];
        var data: ItemData = lstCTietBCaoTemp.find(e => e.level == 0);
        this.addFirst(data);
        lstCTietBCaoTemp = lstCTietBCaoTemp.filter(e => e.id != data.id);
        var lstTemp: ItemData[] = lstCTietBCaoTemp.filter(e => e.level == level);
        while (lstTemp.length != 0 || level == 0) {
            lstTemp.forEach(item => {
                let idCha = this.getIdCha(item.loaiMatHang);
                var index: number = this.lstCTietBCao.findIndex(e => e.loaiMatHang === idCha);
                if (index != -1) {
                    this.addLow(this.lstCTietBCao[index].id, item);
                } else {
                    index = this.lstCTietBCao.findIndex(e => this.getIdCha(e.loaiMatHang) === idCha);
                    this.addSame(this.lstCTietBCao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCTietBCaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: any) {
        var loaiMatHang: any = this.lstCTietBCao.find(e => e.id == id)?.loaiMatHang;
        let obj = {
            maKhoanMuc: loaiMatHang,
            lstKhoanMuc: this.matHangs,
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
                var index: number = this.lstCTietBCao.findIndex(e => e.loaiMatHang == res.maKhoanMuc);
                if (index == -1) {
                    let data: any = {
                        ...this.initItem,
                        loaiMatHang: res.maKhoanMuc,
                        level: this.matHangs.find(e => e.id == loaiMatHang)?.level,
                    };
                    if (this.lstCTietBCao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCTietBCao.find(e => e.loaiMatHang == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    var data: ItemData = {
                        ...this.initItem,
                        loaiMatHang: item.id,
                        level: item.level,
                    };
                    this.addLow(id, data);
                })
                this.updateEditCache();
            }
        });

    }

    // changeModel(id: string): void {
    //     this.editCache[id].data.bcheChuaSdungCong = Number(this.editCache[id].data.bcheChuaSdungLuongHeSo234) + Number(this.editCache[id].data.bcheChuaSdungCkdg);
    //     this.editCache[id].data.bcheChuaSdung = Number(this.editCache[id].data.bcheGia0N1) - Number(this.editCache[id].data.dkienCcvcCoMat0101n1);
    //     this.editCache[id].data.ccvc0101n1Cong = Number(this.editCache[id].data.ccvc0101n1Luong) + Number(this.editCache[id].data.ccvc0101n1Pcap) + Number(this.editCache[id].data.ccvc0101n1Ckdg);
    //     this.editCache[id].data.tongSo = Number(this.editCache[id].data.ccvc0101n1Cong) + Number(this.editCache[id].data.quyLuongTangThemDoNangBacLuongCcvc0101n1) + Number(this.editCache[id].data.bcheChuaSdungCong);
    //     this.editCache[id].data.tongQuyLuongPcapCkdgTheoLuongCcvcHdld = Number(this.editCache[id].data.tongSo) + Number(this.editCache[id].data.ccvc0101n1Ckdg) + Number(this.editCache[id].data.quyLuongTangThemDoNangBacLuongCcvc0101n1) + Number(this.editCache[id].data.bcheChuaSdungCkdg);
    // }

}
