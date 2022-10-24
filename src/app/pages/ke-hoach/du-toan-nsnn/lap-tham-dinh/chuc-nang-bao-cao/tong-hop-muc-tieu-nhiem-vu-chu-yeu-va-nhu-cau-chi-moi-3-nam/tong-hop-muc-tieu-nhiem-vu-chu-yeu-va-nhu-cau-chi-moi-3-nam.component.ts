import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { LINH_VUC_CHI } from './tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam.constant';

export class ItemData {
    id: string;
    stt: string;
    maLvuc: number;
    level: number;
    mtieuNvu: string;
    csPhapLyThien: string;
    hdongChuYeu: string;
    nguonKphi: string;
    ncauChiTongSo: number;
    ncauChiTrongDoChiCs: number;
    ncauChiTrongDoChiMoi: number;
    ncauChiChiaRaDtuPtrien: number;
    ncauChiChiaRaChiCs1: number;
    ncauChiChiaRaChiMoi1: number;
    ncauChiChiaRaChiTx: number;
    ncauChiChiaRaChiCs2: number;
    ncauChiChiaRaChiMoi2: number;
    checked: boolean;
}


@Component({
    selector: 'app-tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam',
    templateUrl: './tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam.component.html',
    styleUrls: ['../bao-cao/bao-cao.component.scss']
})
export class TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donVis: any = [];
    linhVucChis: any[] = LINH_VUC_CHI;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //thong tin chung
    initItem: ItemData = {
        ...new ItemData(),
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
    total: ItemData = new ItemData();
    id: string;
    namHienHanh: number;
    maBieuMau: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    maDviTien = '1';
    listIdDelete = "";
    trangThaiPhuLuc: string;
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
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }


    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization(){
        this.spinner.show();
        this.id = this.data?.id;
        this.maBieuMau = this.data?.maBieuMau;
        this.maDviTien = this.data?.maDviTien ? this.data?.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namHienHanh = this.data?.namHienHanh;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.data?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                checked: false,
            })
        })
        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0]?.stt) {
                this.sortWithoutIndex();
            } else {
                this.sortByIndex();
            }
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

    // luu
    async save(trangThai: string) {
        let checkSaveEdit;
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
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            if (item.ncauChiTongSo > MONEY_LIMIT || item.ncauChiTrongDoChiCs > MONEY_LIMIT || item.ncauChiTrongDoChiMoi > MONEY_LIMIT ||
                item.ncauChiChiaRaDtuPtrien > MONEY_LIMIT || item.ncauChiChiaRaChiCs1 > MONEY_LIMIT || item.ncauChiChiaRaChiMoi1 > MONEY_LIMIT ||
                item.ncauChiChiaRaChiTx > MONEY_LIMIT || item.ncauChiChiaRaChiCs2 > MONEY_LIMIT || item.ncauChiChiaRaChiMoi2 > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange) {
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
            lstCtietLapThamDinhs: lstCtietBcaoTemp,
            maBieuMau: this.maBieuMau,
            maDviTien: this.maDviTien,
            nguoiBcao: this.data?.nguoiBcao,
            lyDoTuChoi: this.data?.lyDoTuChoi,
            thuyetMinh: this.thuyetMinh,
            trangThai: trangThai,
        };
        this.spinner.show();
        this.quanLyVonPhiService.updateLapThamDinh(request).toPromise().then(
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
            await this.quanLyVonPhiService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = mcn;
                    this.getStatusButton();
                    const obj = {
                        trangThai: mcn,
                        lyDoTuChoi: lyDoTuChoi,
                    }
                    this.dataChange.emit(obj);
                    if (mcn == "0") {
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
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
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
            if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
                this.sum(stt);
                this.updateEditCache();
            }
            const item: ItemData = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (this.editCache[id].data.ncauChiChiaRaChiCs1 < 0 ||
            this.editCache[id].data.ncauChiChiaRaChiCs2 < 0 ||
            this.editCache[id].data.ncauChiChiaRaChiMoi1 < 0 ||
            this.editCache[id].data.ncauChiChiaRaChiMoi2 < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
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
                id: uuid.v4() + 'FE',
                stt: "0.1",
                level: 0,
            }
            this.lstCtietBcao.push(item);

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
            item.level = this.linhVucChis.find(e => e.id == item.maLvuc)?.level;
        })
    }

    getIdCha(maKM: number) {
        return this.linhVucChis.find(e => e.id == maKM)?.idCha;
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
                const idCha = this.getIdCha(item.maLvuc);
                let index: number = this.lstCtietBcao.findIndex(e => e.maLvuc === idCha);
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => this.getIdCha(e.maLvuc) === idCha);
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: string) {
        const maLvuc: number = this.lstCtietBcao.find(e => e.id == id)?.maLvuc;
        const obj = {
            maKhoanMuc: maLvuc,
            lstKhoanMuc: this.linhVucChis,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách lĩnh vực chi',
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maLvuc == res.maKhoanMuc);
                if (index == -1) {
                    const data: ItemData = {
                        ...this.initItem,
                        maLvuc: res.maKhoanMuc,
                        level: this.linhVucChis.find(e => e.id == maLvuc)?.level,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maLvuc == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maLvuc == item.id) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            maLvuc: item.id,
                            level: item.level,
                        };
                        this.addLow(id, data);
                    }
                })
                this.updateEditCache();
            }
        });

    }


    changeModel(id: string): void {
        this.editCache[id].data.ncauChiChiaRaDtuPtrien = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiMoi1]);
        this.editCache[id].data.ncauChiChiaRaChiTx = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs2, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
        this.editCache[id].data.ncauChiTrongDoChiCs = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiCs2]);
        this.editCache[id].data.ncauChiTrongDoChiMoi = sumNumber([this.editCache[id].data.ncauChiChiaRaChiMoi1, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
        this.editCache[id].data.ncauChiTongSo = sumNumber([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
    }

    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
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
                maLvuc: data.maLvuc,
                checked: data.checked,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].ncauChiTongSo = sumNumber([this.lstCtietBcao[index].ncauChiTongSo, item.ncauChiTongSo]);
                    this.lstCtietBcao[index].ncauChiTrongDoChiCs = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
                    this.lstCtietBcao[index].ncauChiTrongDoChiMoi = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
                    this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
                    this.lstCtietBcao[index].ncauChiChiaRaChiCs1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
                    this.lstCtietBcao[index].ncauChiChiaRaChiMoi1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
                    this.lstCtietBcao[index].ncauChiChiaRaChiTx = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
                    this.lstCtietBcao[index].ncauChiChiaRaChiCs2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
                    this.lstCtietBcao[index].ncauChiChiaRaChiMoi2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);
                }
            })
            stt = this.getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.ncauChiTongSo = 0;
        this.total.ncauChiTrongDoChiCs = 0;
        this.total.ncauChiTrongDoChiMoi = 0;
        this.total.ncauChiChiaRaDtuPtrien = 0;
        this.total.ncauChiChiaRaChiCs1 = 0;
        this.total.ncauChiChiaRaChiMoi1 = 0;
        this.total.ncauChiChiaRaChiTx = 0;
        this.total.ncauChiChiaRaChiCs2 = 0;
        this.total.ncauChiChiaRaChiMoi2 = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.ncauChiTongSo = sumNumber([this.total.ncauChiTongSo, item.ncauChiTongSo]);
                this.total.ncauChiTrongDoChiCs = sumNumber([this.total.ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
                this.total.ncauChiTrongDoChiMoi = sumNumber([this.total.ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
                this.total.ncauChiChiaRaDtuPtrien = sumNumber([this.total.ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
                this.total.ncauChiChiaRaChiCs1 = sumNumber([this.total.ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
                this.total.ncauChiChiaRaChiMoi1 = sumNumber([this.total.ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
                this.total.ncauChiChiaRaChiTx = sumNumber([this.total.ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
                this.total.ncauChiChiaRaChiCs2 = sumNumber([this.total.ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
                this.total.ncauChiChiaRaChiMoi2 = sumNumber([this.total.ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);
            }
        })
    }

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

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

    // changeMoney() {
    //     if (!this.moneyUnit) {
    //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_MONEY);
    //         return;
    //     }
    //     this.lstCtietBcao.forEach(item => {
    //         item.ncauChiTongSo = exchangeMoney(item.ncauChiTongSo, this.maDviTien, this.moneyUnit);
    //         item.ncauChiTrongDoChiCs = exchangeMoney(item.ncauChiTrongDoChiCs, this.maDviTien, this.moneyUnit);
    //         item.ncauChiTrongDoChiMoi = exchangeMoney(item.ncauChiTrongDoChiMoi, this.maDviTien, this.moneyUnit);
    //         item.ncauChiChiaRaDtuPtrien = exchangeMoney(item.ncauChiChiaRaDtuPtrien, this.maDviTien, this.moneyUnit);
    //         item.ncauChiChiaRaChiCs1 = exchangeMoney(item.ncauChiChiaRaChiCs1, this.maDviTien, this.moneyUnit);
    //         item.ncauChiChiaRaChiMoi1 = exchangeMoney(item.ncauChiChiaRaChiMoi1, this.maDviTien, this.moneyUnit);
    //         item.ncauChiChiaRaChiTx = exchangeMoney(item.ncauChiChiaRaChiTx, this.maDviTien, this.moneyUnit);
    //         item.ncauChiChiaRaChiCs2 = exchangeMoney(item.ncauChiChiaRaChiCs2, this.maDviTien, this.moneyUnit);
    //         item.ncauChiChiaRaChiMoi2 = exchangeMoney(item.ncauChiChiaRaChiMoi2, this.maDviTien, this.moneyUnit);
    //     })
    //     this.maDviTien = this.moneyUnit;
    //     this.updateEditCache();
    // }

}
