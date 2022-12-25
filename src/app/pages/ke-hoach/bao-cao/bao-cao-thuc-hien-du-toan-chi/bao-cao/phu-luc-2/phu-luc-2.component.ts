import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { findIndex, getHead, getTail } from 'src/app/Utility/func';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, getName, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-2.constant';


export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdung: string;
    tenNdung: string;
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
    noiDungs: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    luyKeDetail: any[] = [];

    //thong tin chung
    idBcao: string;
    id: string;
    namBcao: number;
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
        this.namBcao = this.data?.namBcao;
        this.luyKeDetail = this.data?.luyKeDetail?.lstCtietBcaos;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        //tinh toan level va ten cho danh muc
        DANH_MUC.forEach(item => {
            this.noiDungs.push({
                ...item,
                level: item.ma.split('.').length - 2,
                giaTri: getName(this.namBcao, item.giaTri),
            })
        })
        //them cac ban ghi va tinh toan lai ty le cho chung
        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                giaiNganThangTcongTle: divNumber(item.giaiNganThangTcong, item.dtoanSdungNamTcong),
                giaiNganThangNguonNsnnTle: divNumber(item.giaiNganThangNguonNsnn, item.dtoanSdungNamNguonNsnn),
                giaiNganThangNguonSnTle: divNumber(item.giaiNganThangNguonSn, item.dtoanSdungNamNguonSn),
                giaiNganThangNguonQuyTle: divNumber(item.giaiNganThangNguonQuy, item.dtoanSdungNamNguonQuy),
                luyKeGiaiNganTcongTle: divNumber(item.luyKeGiaiNganTcong, item.dtoanSdungNamTcong),
                luyKeGiaiNganNguonNsnnTle: divNumber(item.luyKeGiaiNganNguonNsnn, item.dtoanSdungNamNguonNsnn),
                luyKeGiaiNganNguonSnTle: divNumber(item.luyKeGiaiNganNguonSn, item.dtoanSdungNamNguonSn),
                luyKeGiaiNganNguonQuyTle: divNumber(item.luyKeGiaiNganNguonQuy, item.dtoanSdungNamNguonQuy),
                checked: false,
            })
        })
        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.sortWithoutIndex();
            } else {
                this.sortByIndex();
            }
        } else {
            //neu co luy ke thi them vao trong list
            this.luyKeDetail.forEach(item => {
                this.lstCtietBcao.push({
                    ...item,
                    luyKeGiaiNganTcongTle: divNumber(item.luyKeGiaiNganTcong, item.dtoanSdungNamTcong),
                    luyKeGiaiNganNguonNsnnTle: divNumber(item.luyKeGiaiNganNguonNsnn, item.dtoanSdungNamNguonNsnn),
                    luyKeGiaiNganNguonSnTle: divNumber(item.luyKeGiaiNganNguonSn, item.dtoanSdungNamNguonSn),
                    luyKeGiaiNganNguonQuyTle: divNumber(item.luyKeGiaiNganNguonQuy, item.dtoanSdungNamNguonQuy),
                    checked: false,
                    id: uuid.v4() + 'FE',
                })
            })
            this.sortByIndex();
        }

        this.lstCtietBcao.forEach(item => {
            item.tenNdung = this.noiDungs.find(e => e.ma == item.maNdung)?.giaTri;
        })
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
            if (item.dtoanSdungNamTcong > MONEY_LIMIT || item.giaiNganThangTcong > MONEY_LIMIT || item.luyKeGiaiNganTcong > MONEY_LIMIT) {
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
                        data: data.data,
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
            xau = String.fromCharCode(k + 64);
        }
        if (n == 1) {
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (n == 2) {
            xau = chiSo[n];
        }
        if (n == 3) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        }
        if (n == 4) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 5) {
            xau = "-";
        }
        return xau;
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
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
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
        // them moi phan tu
        const item: ItemData = {
            ...initItem,
            stt: head + "." + (tail + 1).toString(),
            id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
        }
        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.sum(item.stt);
        this.updateEditCache();
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
        // them moi phan tu
        const item: ItemData = {
            ...initItem,
            stt: stt,
            id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
        }
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.sum(stt);
        this.updateEditCache();
    }
    //xóa dòng
    deleteLine(id: string) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
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
        const item: ItemData = {
            ...initItem,
            stt: '0.1',
            level: 0,
            id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
        }
        this.lstCtietBcao.push(item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
        this.getTotal();
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

    setDetail() {
        this.lstCtietBcao.forEach(item => {
            item.level = item.maNdung.split('.').length - 2;
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
                let index: number = this.lstCtietBcao.findIndex(e => e.maNdung === getHead(item.maNdung));
                if (index != -1) {
                    this.addLow(this.lstCtietBcao[index].id, item);
                } else {
                    index = this.lstCtietBcao.findIndex(e => getHead(e.maNdung) === getHead(item.maNdung));
                    this.addSame(this.lstCtietBcao[index].id, item);
                }
            })
            level += 1;
            lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
        }
    }

    addLine(id: string) {
        const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
        const obj = {
            ma: maNdung,
            lstDanhMuc: this.noiDungs,
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
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...this.initItem,
                        maNdung: res.ma,
                        level: this.noiDungs.find(e => e.ma == res.ma)?.level,
                        tenNdung: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdung == res.ma)?.id;
                res.lstDanhMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNdung == item.ma) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            maNdung: item.ma,
                            level: item.level,
                            tenNdung: item.giaTri,
                        };
                        this.addLow(id, data);
                    }
                })
                this.updateEditCache();
            }
        });

    }

    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    sum(stt: string) {
        stt = getHead(stt);
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
                tenNdung: data.tenNdung,
            }
            this.lstCtietBcao.forEach(item => {
                if (getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].dtoanSdungNamTcong = sumNumber([this.lstCtietBcao[index].dtoanSdungNamTcong, item.dtoanSdungNamTcong]);
                    this.lstCtietBcao[index].dtoanSdungNamNguonNsnn = sumNumber([this.lstCtietBcao[index].dtoanSdungNamNguonNsnn, item.dtoanSdungNamNguonNsnn]);
                    this.lstCtietBcao[index].dtoanSdungNamNguonSn = sumNumber([this.lstCtietBcao[index].dtoanSdungNamNguonSn, item.dtoanSdungNamNguonSn]);
                    this.lstCtietBcao[index].dtoanSdungNamNguonQuy = sumNumber([this.lstCtietBcao[index].dtoanSdungNamNguonQuy, item.dtoanSdungNamNguonQuy]);
                    this.lstCtietBcao[index].giaiNganThangTcong = sumNumber([this.lstCtietBcao[index].giaiNganThangTcong, item.giaiNganThangTcong]);
                    this.lstCtietBcao[index].giaiNganThangNguonNsnn = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonNsnn, item.giaiNganThangNguonNsnn]);
                    this.lstCtietBcao[index].giaiNganThangNguonSn = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonSn, item.giaiNganThangNguonSn]);
                    this.lstCtietBcao[index].giaiNganThangNguonQuy = sumNumber([this.lstCtietBcao[index].giaiNganThangNguonQuy, item.giaiNganThangNguonQuy]);
                    this.lstCtietBcao[index].luyKeGiaiNganTcong = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonNsnn = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonNsnn, item.luyKeGiaiNganNguonNsnn]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonSn = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonSn, item.luyKeGiaiNganNguonSn]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuy = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
                    // chua co tinh ty le
                }
                this.lstCtietBcao[index].giaiNganThangTcongTle = divNumber(this.lstCtietBcao[index].giaiNganThangTcong, this.lstCtietBcao[index].dtoanSdungNamTcong);
                this.lstCtietBcao[index].giaiNganThangNguonNsnnTle = divNumber(this.lstCtietBcao[index].giaiNganThangNguonNsnn, this.lstCtietBcao[index].dtoanSdungNamNguonNsnn);
                this.lstCtietBcao[index].giaiNganThangNguonSnTle = divNumber(this.lstCtietBcao[index].giaiNganThangNguonSn, this.lstCtietBcao[index].dtoanSdungNamNguonSn);
                this.lstCtietBcao[index].giaiNganThangNguonQuyTle = divNumber(this.lstCtietBcao[index].giaiNganThangNguonQuy, this.lstCtietBcao[index].dtoanSdungNamNguonQuy);
                this.lstCtietBcao[index].luyKeGiaiNganTcongTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].dtoanSdungNamTcong);
                this.lstCtietBcao[index].luyKeGiaiNganNguonNsnnTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonNsnn, this.lstCtietBcao[index].dtoanSdungNamNguonNsnn);
                this.lstCtietBcao[index].luyKeGiaiNganNguonSnTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonSn, this.lstCtietBcao[index].dtoanSdungNamNguonSn);
                this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].dtoanSdungNamNguonQuy);
            })
            stt = getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.dtoanSdungNamTcong = sumNumber([this.total.dtoanSdungNamTcong, item.dtoanSdungNamTcong]);
                this.total.dtoanSdungNamNguonNsnn = sumNumber([this.total.dtoanSdungNamNguonNsnn, item.dtoanSdungNamNguonNsnn]);
                this.total.dtoanSdungNamNguonSn = sumNumber([this.total.dtoanSdungNamNguonSn, item.dtoanSdungNamNguonSn]);
                this.total.dtoanSdungNamNguonQuy = sumNumber([this.total.dtoanSdungNamNguonQuy, item.dtoanSdungNamNguonQuy]);
                this.total.giaiNganThangTcong = sumNumber([this.total.giaiNganThangTcong, item.giaiNganThangTcong]);
                this.total.giaiNganThangNguonNsnn = sumNumber([this.total.giaiNganThangNguonNsnn, item.giaiNganThangNguonNsnn]);
                this.total.giaiNganThangNguonSn = sumNumber([this.total.giaiNganThangNguonSn, item.giaiNganThangNguonSn]);
                this.total.giaiNganThangNguonQuy = sumNumber([this.total.giaiNganThangNguonQuy, item.giaiNganThangNguonQuy]);
                this.total.luyKeGiaiNganTcong = sumNumber([this.total.luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                this.total.luyKeGiaiNganNguonNsnn = sumNumber([this.total.luyKeGiaiNganNguonNsnn, item.luyKeGiaiNganNguonNsnn]);
                this.total.luyKeGiaiNganNguonSn = sumNumber([this.total.luyKeGiaiNganNguonSn, item.luyKeGiaiNganNguonSn]);
                this.total.luyKeGiaiNganNguonQuy = sumNumber([this.total.luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
            }
        })
        this.total.giaiNganThangTcongTle = divNumber(this.total.giaiNganThangTcong, this.total.dtoanSdungNamTcong);
        this.total.giaiNganThangNguonNsnnTle = divNumber(this.total.giaiNganThangNguonNsnn, this.total.dtoanSdungNamNguonNsnn);
        this.total.giaiNganThangNguonSnTle = divNumber(this.total.giaiNganThangNguonSn, this.total.dtoanSdungNamNguonSn);
        this.total.giaiNganThangNguonQuyTle = divNumber(this.total.giaiNganThangNguonQuy, this.total.dtoanSdungNamNguonQuy);
        this.total.luyKeGiaiNganTcongTle = divNumber(this.total.luyKeGiaiNganTcong, this.total.dtoanSdungNamTcong);
        this.total.luyKeGiaiNganNguonNsnnTle = divNumber(this.total.luyKeGiaiNganNguonNsnn, this.total.dtoanSdungNamNguonNsnn);
        this.total.luyKeGiaiNganNguonSnTle = divNumber(this.total.luyKeGiaiNganNguonSn, this.total.dtoanSdungNamNguonSn);
        this.total.luyKeGiaiNganNguonQuyTle = divNumber(this.total.luyKeGiaiNganNguonQuy, this.total.dtoanSdungNamNguonQuy);
    }


    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.dtoanSdungNamTcong = sumNumber([this.editCache[id].data.dtoanSdungNamNguonNsnn, this.editCache[id].data.dtoanSdungNamNguonSn, this.editCache[id].data.dtoanSdungNamNguonQuy]);
        this.editCache[id].data.giaiNganThangTcong = sumNumber([this.editCache[id].data.giaiNganThangNguonNsnn, this.editCache[id].data.giaiNganThangNguonSn, this.editCache[id].data.giaiNganThangNguonQuy]);
        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([this.editCache[id].data.luyKeGiaiNganNguonNsnn, this.editCache[id].data.luyKeGiaiNganNguonSn, this.editCache[id].data.luyKeGiaiNganNguonQuy]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([data.luyKeGiaiNganTcong, this.editCache[id].data.giaiNganThangTcong, -data.giaiNganThangTcong]);
        this.editCache[id].data.luyKeGiaiNganNguonNsnn = sumNumber([data.luyKeGiaiNganNguonNsnn, this.editCache[id].data.giaiNganThangNguonNsnn, -data.giaiNganThangNguonNsnn]);
        this.editCache[id].data.luyKeGiaiNganNguonSn = sumNumber([data.luyKeGiaiNganNguonSn, this.editCache[id].data.giaiNganThangNguonSn, -data.giaiNganThangNguonSn]);
        this.editCache[id].data.luyKeGiaiNganNguonQuy = sumNumber([data.luyKeGiaiNganNguonQuy, this.editCache[id].data.giaiNganThangNguonQuy, -data.giaiNganThangNguonQuy]);
        //tinh ty le
        this.editCache[data.id].data.giaiNganThangTcongTle = divNumber(this.editCache[data.id].data.giaiNganThangTcong, this.editCache[data.id].data.dtoanSdungNamTcong);
        this.editCache[data.id].data.giaiNganThangNguonNsnnTle = divNumber(this.editCache[data.id].data.giaiNganThangNguonNsnn, this.editCache[data.id].data.dtoanSdungNamNguonNsnn);
        this.editCache[data.id].data.giaiNganThangNguonSnTle = divNumber(this.editCache[data.id].data.giaiNganThangNguonSn, this.editCache[data.id].data.dtoanSdungNamNguonSn);
        this.editCache[data.id].data.giaiNganThangNguonQuyTle = divNumber(this.editCache[data.id].data.giaiNganThangNguonQuy, this.editCache[data.id].data.dtoanSdungNamNguonQuy);
        this.editCache[data.id].data.luyKeGiaiNganTcongTle = divNumber(this.editCache[data.id].data.luyKeGiaiNganTcong, this.editCache[data.id].data.dtoanSdungNamTcong);
        this.editCache[data.id].data.luyKeGiaiNganNguonNsnnTle = divNumber(this.editCache[data.id].data.luyKeGiaiNganNguonNsnn, this.editCache[data.id].data.dtoanSdungNamNguonNsnn);
        this.editCache[data.id].data.luyKeGiaiNganNguonSnTle = divNumber(this.editCache[data.id].data.luyKeGiaiNganNguonSn, this.editCache[data.id].data.dtoanSdungNamNguonSn);
        this.editCache[data.id].data.luyKeGiaiNganNguonQuyTle = divNumber(this.editCache[data.id].data.luyKeGiaiNganNguonQuy, this.editCache[data.id].data.dtoanSdungNamNguonQuy);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
