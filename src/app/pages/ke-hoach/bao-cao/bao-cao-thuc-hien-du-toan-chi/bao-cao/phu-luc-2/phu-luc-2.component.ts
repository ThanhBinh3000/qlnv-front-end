import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { NOI_DUNG_PL2 } from '../bao-cao.constant';


export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdung: number;
    dtoanSdungNamTcong: number;
    dtoanSdungNamNguonNsnn: number;
    dtoanSdungNamNguonSn: number;
    dtoanSdungNamNguonQuy: number;
    giaiNganThangTcong: number;
    giaiNganThangTcongTle: number;
    giaiNganThangNguonNsnn: number;
    giaiNganThangNguonNsnnTle: number;
    giaiNganThangNguonSn: number;
    giaiNganThangNguonSnTle: number;
    giaiNganThangNguonQuy: number;
    giaiNganThangNguonQuyTle: number;
    luyKeGiaiNganTcong: number;
    luyKeGiaiNganTcongTle: number;
    luyKeGiaiNganNguonNsnn: number;
    luyKeGiaiNganNguonNsnnTle: number;
    luyKeGiaiNganNguonSn: number;
    luyKeGiaiNganNguonSnTle: number;
    luyKeGiaiNganNguonQuy: number;
    luyKeGiaiNganNguonQuyTle: number;
}

@Component({
    selector: 'app-phu-luc-2',
    templateUrl: './phu-luc-2.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIIComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    noiDungs: any[] = NOI_DUNG_PL2;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    luyKeDetail: any[] = [];

    //thong tin chung
    idBcao: string;
    id: string;
    namHienHanh: number;
    maPhuLuc: string;
    thuyetMinh: string;
    maDviTien: string;
    listIdDelete = "";
    trangThaiPhuLuc = '1';
    initItem: ItemData = new ItemData();
    total: ItemData = new ItemData();
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
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
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
        this.id = this.data?.id;
        this.idBcao = this.data.idBcao;
        this.maPhuLuc = this.data?.maPhuLuc;
        this.maDviTien = this.data?.maDviTien ? this.data?.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namHienHanh = this.data?.namHienHanh;
        this.luyKeDetail = this.data?.luyKeDetail?.lstCtietBcaos;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                //chua co tinh ty le
                checked: false,
            })
        })
        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.sortWithoutIndex();
            } else {
                this.sortByIndex();
            }
        }
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

    getLoai(ma: number) {
        return this.noiDungs.find(e => e.id == ma)?.loai;
    }

    // luu
    async save(trangThai: string) {
        let checkSaveEdit;
        //check xem tat ca cac dong du lieu da luu chua?
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
            if (item.dtoanSdungNamTcong > MONEY_LIMIT || item.dtoanSdungNamNguonNsnn > MONEY_LIMIT || item.dtoanSdungNamNguonSn > MONEY_LIMIT ||
                item.dtoanSdungNamNguonQuy > MONEY_LIMIT || item.giaiNganThangTcong > MONEY_LIMIT || item.giaiNganThangNguonNsnn > MONEY_LIMIT ||
                item.giaiNganThangNguonSn > MONEY_LIMIT || item.giaiNganThangNguonQuy > MONEY_LIMIT || item.luyKeGiaiNganTcong > MONEY_LIMIT ||
                item.luyKeGiaiNganNguonNsnn > MONEY_LIMIT || item.luyKeGiaiNganNguonSn > MONEY_LIMIT || item.luyKeGiaiNganNguonQuy > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
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
        const request = {
            id: this.id,
            lstCtietBcaos: lstCtietBcaoTemp,
            maLoai: this.maPhuLuc,
            maDviTien: this.maDviTien,
            nguoiBcao: this.data?.nguoiBcao,
            lyDoTuChoi: this.data?.lyDoTuChoi,
            thuyetMinh: this.thuyetMinh,
            trangThai: trangThai,
        };
        this.spinner.show();
        this.baoCaoThucHienDuToanChiService.baoCaoCapNhatChiTiet(request).toPromise().then(
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
            await this.baoCaoThucHienDuToanChiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = mcn;
                    this.getStatusButton();
                    const obj = {
                        trangThai: mcn,
                        lyDoTuChoi: lyDoTuChoi,
                    }
                    this.dataChange.emit(obj);
                    if (mcn == '0') {
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
    getIndex(str: string): string {
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
        const itemLine = this.luyKeDetail.find(item => item.maNdung == initItem.maNdung);
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
                luyKeGiaiNganTcong: itemLine?.luyKeGiaiNganTcong ? itemLine?.luyKeGiaiNganTcong : 0,
                luyKeGiaiNganNguonNsnn: itemLine?.luyKeGiaiNganNguonNsnn ? itemLine?.luyKeGiaiNganNguonNsnn : 0,
                luyKeGiaiNganNguonSn: itemLine?.luyKeGiaiNganNguonSn ? itemLine?.luyKeGiaiNganNguonSn : 0,
                luyKeGiaiNganNguonQuy: itemLine?.luyKeGiaiNganNguonQuy ? itemLine?.luyKeGiaiNganNguonQuy : 0,
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

        const itemLine = this.luyKeDetail.find(item => item.maNdung == initItem.maNdung);

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
                luyKeGiaiNganTcong: itemLine?.luyKeGiaiNganTcong ? itemLine?.luyKeGiaiNganTcong : 0,
                luyKeGiaiNganNguonNsnn: itemLine?.luyKeGiaiNganNguonNsnn ? itemLine?.luyKeGiaiNganNguonNsnn : 0,
                luyKeGiaiNganNguonSn: itemLine?.luyKeGiaiNganNguonSn ? itemLine?.luyKeGiaiNganNguonSn : 0,
                luyKeGiaiNganNguonQuy: itemLine?.luyKeGiaiNganNguonQuy ? itemLine?.luyKeGiaiNganNguonQuy : 0,
            }
            //chua co tinh ty le

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
        const data = this.lstCtietBcao.find(item => item.id === id);
        if (!data.maNdung) {
            this.deleteLine(id);
        }
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...data },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maNdung) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
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
        const itemLine = this.luyKeDetail.find(item => item.maNdung == initItem.maNdung);
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
                level: 0,
                id: uuid.v4() + 'FE',
                stt: "0.1",
                luyKeGiaiNganTcong: itemLine?.luyKeGiaiNganTcong ? itemLine?.luyKeGiaiNganTcong : 0,
                luyKeGiaiNganNguonNsnn: itemLine?.luyKeGiaiNganNguonNsnn ? itemLine?.luyKeGiaiNganNguonNsnn : 0,
                luyKeGiaiNganNguonSn: itemLine?.luyKeGiaiNganNguonSn ? itemLine?.luyKeGiaiNganNguonSn : 0,
                luyKeGiaiNganNguonQuy: itemLine?.luyKeGiaiNganNguonQuy ? itemLine?.luyKeGiaiNganNguonQuy : 0,
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
            item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
        })
    }

    getIdCha(maKM: number) {
        return this.noiDungs.find(e => e.id == maKM)?.idCha;
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
                const idCha = this.getIdCha(item.maNdung);
                let index: number = this.lstCtietBcao.findIndex(e => e.maNdung === idCha);
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => this.getIdCha(e.maNdung) === idCha);
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: string) {
        const maNdung: number = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
        const obj = {
            maKhoanMuc: maNdung,
            lstKhoanMuc: this.noiDungs,
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
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
                if (index == -1) {
                    const data: ItemData = {
                        ...this.initItem,
                        maNdung: res.maKhoanMuc,
                        level: this.noiDungs.find(e => e.id == maNdung)?.level,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNdung == item.id) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            maNdung: item.id,
                            level: item.level,
                        };
                        this.addLow(id, data);
                    }

                })
                this.updateEditCache();
            }
        });

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
                checked: data.checked,
                level: data.level,
                maNdung: data.maNdung,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].dtoanSdungNamTcong = sumNumber([this.lstCtietBcao[index].dtoanSdungNamTcong, item.dtoanSdungNamTcong]);
                    this.lstCtietBcao[index].dtoanSdungNamNguonNsnn = sumNumber([this.lstCtietBcao[index].dtoanSdungNamNguonNsnn, item.dtoanSdungNamNguonNsnn]);
                    this.lstCtietBcao[index].dtoanSdungNamNguonSn = sumNumber([this.lstCtietBcao[index].dtoanSdungNamNguonSn, item.dtoanSdungNamNguonSn]);
                    this.lstCtietBcao[index].dtoanSdungNamNguonQuy = sumNumber([this.lstCtietBcao[index].dtoanSdungNamNguonQuy, item.dtoanSdungNamNguonQuy]);
                    this.lstCtietBcao[index].giaiNganThangTcong = sumNumber([this.lstCtietBcao[index].giaiNganThangTcong, item.giaiNganThangTcong]);
                    this.lstCtietBcao[index].giaiNganThangTcongTle = sumNumber([this.lstCtietBcao[index].giaiNganThangTcongTle, item.giaiNganThangTcongTle]);
                    this.lstCtietBcao[index].giaiNganThangNguonNsnn = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonNsnn, item.giaiNganThangNguonNsnn]);
                    this.lstCtietBcao[index].giaiNganThangNguonNsnnTle = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonNsnnTle, item.giaiNganThangNguonNsnnTle]);
                    this.lstCtietBcao[index].giaiNganThangNguonSn = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonSn, item.giaiNganThangNguonSn]);
                    this.lstCtietBcao[index].giaiNganThangNguonSnTle = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonSnTle, item.giaiNganThangNguonSnTle]);
                    this.lstCtietBcao[index].giaiNganThangNguonQuy = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonQuy, item.giaiNganThangNguonQuy]);
                    this.lstCtietBcao[index].giaiNganThangNguonQuyTle = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonQuyTle, item.giaiNganThangNguonQuyTle]);
                    this.lstCtietBcao[index].luyKeGiaiNganTcong = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                    this.lstCtietBcao[index].luyKeGiaiNganTcongTle = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganTcongTle, item.luyKeGiaiNganTcongTle]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonNsnn = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonNsnn, item.luyKeGiaiNganNguonNsnn]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonNsnnTle = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonNsnnTle, item.luyKeGiaiNganNguonNsnnTle]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonSn = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonSn, item.luyKeGiaiNganNguonSn]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonSnTle = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonSnTle, item.luyKeGiaiNganNguonSnTle]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuy = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle, item.luyKeGiaiNganNguonQuyTle]);
                    // chua co tinh ty le
                }
            })
            stt = this.getHead(stt);
        }
    }


    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.dtoanSdungNamTcong = sumNumber([this.editCache[id].data.dtoanSdungNamNguonNsnn, this.editCache[id].data.dtoanSdungNamNguonSn]);
        this.editCache[id].data.giaiNganThangTcong = sumNumber([this.editCache[id].data.giaiNganThangNguonNsnn, this.editCache[id].data.giaiNganThangNguonSn, this.editCache[id].data.giaiNganThangNguonQuy]);
        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([this.editCache[id].data.luyKeGiaiNganNguonNsnn, this.editCache[id].data.luyKeGiaiNganNguonSn, this.editCache[id].data.luyKeGiaiNganNguonQuy]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([data.luyKeGiaiNganTcong, this.editCache[id].data.giaiNganThangTcong, -data.giaiNganThangTcong]);
        this.editCache[id].data.luyKeGiaiNganNguonNsnn = sumNumber([data.luyKeGiaiNganNguonNsnn, this.editCache[id].data.giaiNganThangNguonNsnn, -data.giaiNganThangNguonNsnn]);
        this.editCache[id].data.luyKeGiaiNganNguonSn = sumNumber([data.luyKeGiaiNganNguonSn, this.editCache[id].data.giaiNganThangNguonSn, -data.giaiNganThangNguonSn]);
        this.editCache[id].data.luyKeGiaiNganNguonQuy = sumNumber([data.luyKeGiaiNganNguonQuy, this.editCache[id].data.giaiNganThangNguonQuy, -data.giaiNganThangNguonQuy]);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
