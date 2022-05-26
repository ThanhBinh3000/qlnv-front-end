import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney, QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N } from "../../../../../Utility/utils";
// import { LA_MA } from '../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { LINH_VUC_CHI } from './tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam.constant';

export class ItemData {
    id: any;
    stt: string;
    maLvuc: number;
    lstLvuc: any[];
    status: boolean;
    mtieuNvu: string;
    csPhapLyThien: string;
    hdongChuYeu: string;
    nguonKphi: string;
    ncauChiTongSo: number;
    ncauChiTrongDoChiCs: number;
    ncauChiTrongDoChiMoi: number;
    ncauChiChiaRaDtuPtrien: number;
    ncauChiChiaRaChiCs1!: number;
    ncauChiChiaRaChiMoi1!: number;
    ncauChiChiaRaChiTx: number;
    ncauChiChiaRaChiCs2!: number;
    ncauChiChiaRaChiMoi2!: number;
    checked!: boolean;
}


@Component({
    selector: 'app-tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam',
    templateUrl: './tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam.component.html',
    styleUrls: ['../bao-cao/bao-cao.component.scss']
})
export class TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent implements OnInit {
    @Input() data;
    //danh muc
    donVis: any = [];
    linhVucChis: any[] = LINH_VUC_CHI;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[];
    donViTiens: any[] = DON_VI_TIEN;
    //thong tin chung
    initItem: ItemData = {
        id: null,
        stt: "0",
        maLvuc: 0,
        lstLvuc: [],
        status: false,
        mtieuNvu: "",
        csPhapLyThien: "",
        hdongChuYeu: "",
        nguonKphi: "",
        ncauChiTongSo: 0,
        ncauChiTrongDoChiCs: 0,
        ncauChiTrongDoChiMoi: 0,
        ncauChiChiaRaDtuPtrien: 0,
        ncauChiChiaRaChiCs1: 0,
        ncauChiChiaRaChiMoi1: 0,
        ncauChiChiaRaChiTx: 0,
        ncauChiChiaRaChiCs2: 0,
        ncauChiChiaRaChiMoi2: 0,
        checked: false,
    };
    id: any;
    namHienHanh: number;
    maBieuMau: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    maDviTien: any;
    listIdDelete: string = "";
    trangThaiPhuLuc: string;
    //trang thai cac nut
    status: boolean = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;

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
        this.id = this.data?.id;
        this.maBieuMau = this.data?.maBieuMau;
        this.maDviTien = this.data?.maDviTien;
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namHienHanh = this.data?.namHienHanh;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.data?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                ncauChiTongSo: divMoney(item.ncauChiTongSo, this.maDviTien),
                ncauChiTrongDoChiCs: divMoney(item.ncauChiTrongDoChiCs, this.maDviTien),
                ncauChiTrongDoChiMoi: divMoney(item.ncauChiTrongDoChiMoi, this.maDviTien),
                ncauChiChiaRaDtuPtrien: divMoney(item.ncauChiChiaRaDtuPtrien, this.maDviTien),
                ncauChiChiaRaChiCs1: divMoney(item.ncauChiChiaRaChiCs1, this.maDviTien),
                ncauChiChiaRaChiMoi1: divMoney(item.ncauChiChiaRaChiMoi1, this.maDviTien),
                ncauChiChiaRaChiTx: divMoney(item.ncauChiChiaRaChiTx, this.maDviTien),
                ncauChiChiaRaChiCs2: divMoney(item.ncauChiChiaRaChiCs2, this.maDviTien),
                ncauChiChiaRaChiMoi2: divMoney(item.ncauChiChiaRaChiMoi2, this.maDviTien),
            })
        })
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

    // luu
    async save() {
        let checkSaveEdit;
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
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
        let lstCtietBcaoTemp: any = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            let ncauChiTongSo = mulMoney(item.ncauChiTongSo, this.maDviTien);
            let ncauChiTrongDoChiCs = mulMoney(item.ncauChiTrongDoChiCs, this.maDviTien);
            let ncauChiTrongDoChiMoi = mulMoney(item.ncauChiTrongDoChiMoi, this.maDviTien);
            let ncauChiChiaRaDtuPtrien = mulMoney(item.ncauChiChiaRaDtuPtrien, this.maDviTien);
            let ncauChiChiaRaChiCs1 = mulMoney(item.ncauChiChiaRaChiCs1, this.maDviTien);
            let ncauChiChiaRaChiMoi1 = mulMoney(item.ncauChiChiaRaChiMoi1, this.maDviTien);
            let ncauChiChiaRaChiTx = mulMoney(item.ncauChiChiaRaChiTx, this.maDviTien);
            let ncauChiChiaRaChiCs2 = mulMoney(item.ncauChiChiaRaChiCs2, this.maDviTien);
            let ncauChiChiaRaChiMoi2 = mulMoney(item.ncauChiChiaRaChiMoi2, this.maDviTien);
            if (ncauChiTongSo > MONEY_LIMIT || ncauChiTrongDoChiCs > MONEY_LIMIT || ncauChiTrongDoChiMoi > MONEY_LIMIT ||
                ncauChiChiaRaDtuPtrien > MONEY_LIMIT || ncauChiChiaRaChiCs1 > MONEY_LIMIT || ncauChiChiaRaChiMoi1 > MONEY_LIMIT ||
                ncauChiChiaRaChiTx > MONEY_LIMIT || ncauChiChiaRaChiCs2 > MONEY_LIMIT || ncauChiChiaRaChiMoi2 > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                ncauChiTongSo: ncauChiTongSo,
                ncauChiTrongDoChiCs: ncauChiTrongDoChiCs,
                ncauChiTrongDoChiMoi: ncauChiTrongDoChiMoi,
                ncauChiChiaRaDtuPtrien: ncauChiChiaRaDtuPtrien,
                ncauChiChiaRaChiCs1: ncauChiChiaRaChiCs1,
                ncauChiChiaRaChiMoi1: ncauChiChiaRaChiMoi1,
                ncauChiChiaRaChiTx: ncauChiChiaRaChiTx,
                ncauChiChiaRaChiCs2: ncauChiChiaRaChiCs2,
                ncauChiChiaRaChiMoi2: ncauChiChiaRaChiMoi2,
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

        let request = {
            id: this.id,
            lstCtietLapThamDinhs: lstCtietBcaoTemp,
            maBieuMau: this.maBieuMau,
            maDviTien: this.maDviTien,
            nguoiBcao: this.data?.nguoiBcao,
            lyDoTuChoi: this.data?.lyDoTuChoi,
            thuyetMinh: this.thuyetMinh,
            trangThai: this.trangThaiPhuLuc,
        };
        this.quanLyVonPhiService.updateLapThamDinh(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
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
        var start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
        var index: number = start;
        for (var i = start + 1; i < this.lstCtietBcao.length; i++) {
            if (this.lstCtietBcao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            var str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            var nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }
    //thêm ngang cấp
    addSame(id: any, initItem: ItemData) {
        var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        var tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
        var ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        let lstIndex: number[] = [];
        for (var i = this.lstCtietBcao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
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
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item: ItemData = {
                ...initItem,
                id: uuid.v4() + 'FE',
                stt: head + "." + (tail + 1).toString(),
                lstLvuc: this.lstCtietBcao[index].lstLvuc,
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
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }
    //thêm cấp thấp hơn
    addLow(id: any, initItem: ItemData) {
        var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        //list các vị trí cần thay đôi lại stt
        let lstIndex: number[] = [];
        for (var i = this.lstCtietBcao.length - 1; i > index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == this.lstCtietBcao[index].stt) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        // them moi phan tu
        if (initItem.id) {
            let item: ItemData = {
                ...initItem,
                stt: this.lstCtietBcao[index].stt + ".1",
            }
            this.lstCtietBcao.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item: ItemData = {
                ...initItem,
                id: uuid.v4() + 'FE',
                lstLvuc: this.linhVucChis.filter(e => e.idCha == this.lstCtietBcao[index].maLvuc),
                stt: this.lstCtietBcao[index].stt + ".1",
            }
            this.lstCtietBcao.splice(index + 1, 0, item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }
    //xóa dòng
    deleteLine(id: any) {
        var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        var nho: string = this.lstCtietBcao[index].stt;
        var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        let lstIndex: number[] = [];
        for (var i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        if (!this.lstCtietBcao[index].maLvuc) {
            this.deleteLine(id);
            return;
        }
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        if (this.linhVucChis.findIndex(e => e.idCha == this.editCache[id].data.maLvuc) != -1) {
            this.editCache[id].data.status = true;
        }
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    updateChecked(id: any) {
        var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        var index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            var nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
                if (index == -1) {
                    this.allChecked = !nho;
                    break;
                }
                nho = this.lstCtietBcao[index].checked;
            }
        }
    }
    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        var nho: boolean = true;
        this.lstCtietBcao.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
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
        var lstId: any[] = [];
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
        if (initItem.id) {
            let item: ItemData = {
                ...initItem,
                stt: "0.1",
            }
            this.lstCtietBcao.push(item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item: ItemData = {
                ...initItem,
                id: uuid.v4() + 'FE',
                lstLvuc: this.linhVucChis.filter(e => e.idCha == 0),
                stt: "0.1",
            }
            this.lstCtietBcao.push(item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    sortByIndex() {
        this.lstCtietBcao.forEach(item => {
            this.setDetail(item.id);
        })
        this.lstCtietBcao.sort((item1, item2) => {
            if (item1.lstLvuc[0].level > item2.lstLvuc[0].level) {
                return 1;
            }
            if (item1.lstLvuc[0].level < item2.lstLvuc[0].level) {
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
        this.lstCtietBcao.forEach(item => {
            var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcao = lstTemp;
    }

    setDetail(id: any) {
        var index: number = this.lstCtietBcao.findIndex(item => item.id === id);
        var parentId: number = this.linhVucChis.find(e => e.id == this.lstCtietBcao[index].maLvuc).idCha;
        this.lstCtietBcao[index].lstLvuc = this.linhVucChis.filter(e => e.idCha == parentId);
        if (this.linhVucChis.findIndex(e => e.idCha === this.lstCtietBcao[index].maLvuc) == -1) {
            this.lstCtietBcao[index].status = false;
        } else {
            this.lstCtietBcao[index].status = true;
        }
    }

    sortWithoutIndex() {
        this.lstCtietBcao.forEach(item => {
            this.setDetail(item.id);
        })
        debugger
        var level = 0;
        var lstCTietBCaoTemp: ItemData[] = this.lstCtietBcao;
        this.lstCtietBcao = [];
        var data: ItemData = lstCTietBCaoTemp.find(e => e.lstLvuc[0].level == 0);
        this.addFirst(data);
        lstCTietBCaoTemp = lstCTietBCaoTemp.filter(e => e.id != data.id);
        var lstTemp: ItemData[] = lstCTietBCaoTemp.filter(e => e.lstLvuc[0].level == level);
        while (lstTemp.length != 0 || level == 0) {
            lstTemp.forEach(item => {
                var index: number = this.lstCtietBcao.findIndex(e => e.maLvuc === item.lstLvuc[0].idCha);
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => e.lstLvuc[0].idCha === item.lstLvuc[0].idCha);
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCTietBCaoTemp.filter(e => e.lstLvuc[0].level == level);
        }
    }


    changeModel(id: string): void {
        this.editCache[id].data.ncauChiTongSo = Number(this.editCache[id].data.ncauChiChiaRaChiCs1) + Number(this.editCache[id].data.ncauChiChiaRaChiCs2) + Number(this.editCache[id].data.ncauChiChiaRaChiMoi1) + Number(this.editCache[id].data.ncauChiChiaRaChiMoi2);
        this.editCache[id].data.ncauChiTrongDoChiCs = Number(this.editCache[id].data.ncauChiChiaRaChiCs1) + Number(this.editCache[id].data.ncauChiChiaRaChiCs2);
        this.editCache[id].data.ncauChiTrongDoChiMoi = Number(this.editCache[id].data.ncauChiChiaRaChiMoi1) + Number(this.editCache[id].data.ncauChiChiaRaChiMoi2);
        this.editCache[id].data.ncauChiChiaRaDtuPtrien = Number(this.editCache[id].data.ncauChiChiaRaChiCs1) + Number(this.editCache[id].data.ncauChiChiaRaChiMoi1);
        this.editCache[id].data.ncauChiChiaRaChiTx = Number(this.editCache[id].data.ncauChiChiaRaChiCs2) + Number(this.editCache[id].data.ncauChiChiaRaChiMoi2);
    }

}
