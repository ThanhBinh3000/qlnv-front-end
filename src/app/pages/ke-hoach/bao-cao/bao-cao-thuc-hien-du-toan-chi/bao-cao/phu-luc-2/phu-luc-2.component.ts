import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { addChild, addHead, addParent, deleteRow, displayNumber, exchangeMoney, getHead, getName, percent, sortByIndex, sortWithoutIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";


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
    scrollX = (350 + 20 * BOX_NUMBER_WIDTH + 200).toString() + 'px';
    amount = AMOUNT;
    quatity = QUATITY;
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
        private danhMucService: DanhMucDungChungService,
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
        if (this.status) {
            this.scrollX = (350 + 20 * BOX_NUMBER_WIDTH).toString() + 'px';
        }
        this.statusBtnFinish = this.data?.statusBtnFinish;
        //lay danh muc va ten danh muc
        const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL2');
        if (category) {
            category.data.forEach(
                item => {
                    this.noiDungs.push({
                        ...item,
                        level: item.ma?.split('.').length - 2,
                        giaTri: getName(this.namBcao, item.giaTri),
                    })
                }
            )
        }
        //them cac ban ghi va tinh toan lai ty le cho chung
        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                giaiNganThangTcongTle: percent(item.giaiNganThangTcong, item.dtoanSdungNamTcong),
                giaiNganThangNguonNsnnTle: percent(item.giaiNganThangNguonNsnn, item.dtoanSdungNamNguonNsnn),
                giaiNganThangNguonSnTle: percent(item.giaiNganThangNguonSn, item.dtoanSdungNamNguonSn),
                giaiNganThangNguonQuyTle: percent(item.giaiNganThangNguonQuy, item.dtoanSdungNamNguonQuy),
                luyKeGiaiNganTcongTle: percent(item.luyKeGiaiNganTcong, item.dtoanSdungNamTcong),
                luyKeGiaiNganNguonNsnnTle: percent(item.luyKeGiaiNganNguonNsnn, item.dtoanSdungNamNguonNsnn),
                luyKeGiaiNganNguonSnTle: percent(item.luyKeGiaiNganNguonSn, item.dtoanSdungNamNguonSn),
                luyKeGiaiNganNguonQuyTle: percent(item.luyKeGiaiNganNguonQuy, item.dtoanSdungNamNguonQuy),
                checked: false,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            this.luyKeDetail.forEach(item => {
                this.lstCtietBcao.push({
                    ...item,
                    luyKeGiaiNganTcongTle: percent(item.luyKeGiaiNganTcong, item.dtoanSdungNamTcong),
                    luyKeGiaiNganNguonNsnnTle: percent(item.luyKeGiaiNganNguonNsnn, item.dtoanSdungNamNguonNsnn),
                    luyKeGiaiNganNguonSnTle: percent(item.luyKeGiaiNganNguonSn, item.dtoanSdungNamNguonSn),
                    luyKeGiaiNganNguonQuyTle: percent(item.luyKeGiaiNganNguonQuy, item.dtoanSdungNamNguonQuy),
                    checked: false,
                    id: uuid.v4() + 'FE',
                })
            })
        }

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maNdung');
            } else {
                this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
            }
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


    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = addParent(id, initItem, this.lstCtietBcao);
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
        this.lstCtietBcao = addChild(id, initItem, this.lstCtietBcao);
    }
    //xóa dòng
    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = deleteRow(id, this.lstCtietBcao);
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
                        this.lstCtietBcao = addHead(data, this.lstCtietBcao);
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
        return this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1;
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
                this.lstCtietBcao[index].giaiNganThangTcongTle = percent(this.lstCtietBcao[index].giaiNganThangTcong, this.lstCtietBcao[index].dtoanSdungNamTcong);
                this.lstCtietBcao[index].giaiNganThangNguonNsnnTle = percent(this.lstCtietBcao[index].giaiNganThangNguonNsnn, this.lstCtietBcao[index].dtoanSdungNamNguonNsnn);
                this.lstCtietBcao[index].giaiNganThangNguonSnTle = percent(this.lstCtietBcao[index].giaiNganThangNguonSn, this.lstCtietBcao[index].dtoanSdungNamNguonSn);
                this.lstCtietBcao[index].giaiNganThangNguonQuyTle = percent(this.lstCtietBcao[index].giaiNganThangNguonQuy, this.lstCtietBcao[index].dtoanSdungNamNguonQuy);
                this.lstCtietBcao[index].luyKeGiaiNganTcongTle = percent(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].dtoanSdungNamTcong);
                this.lstCtietBcao[index].luyKeGiaiNganNguonNsnnTle = percent(this.lstCtietBcao[index].luyKeGiaiNganNguonNsnn, this.lstCtietBcao[index].dtoanSdungNamNguonNsnn);
                this.lstCtietBcao[index].luyKeGiaiNganNguonSnTle = percent(this.lstCtietBcao[index].luyKeGiaiNganNguonSn, this.lstCtietBcao[index].dtoanSdungNamNguonSn);
                this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = percent(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].dtoanSdungNamNguonQuy);
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
        this.total.giaiNganThangTcongTle = percent(this.total.giaiNganThangTcong, this.total.dtoanSdungNamTcong);
        this.total.giaiNganThangNguonNsnnTle = percent(this.total.giaiNganThangNguonNsnn, this.total.dtoanSdungNamNguonNsnn);
        this.total.giaiNganThangNguonSnTle = percent(this.total.giaiNganThangNguonSn, this.total.dtoanSdungNamNguonSn);
        this.total.giaiNganThangNguonQuyTle = percent(this.total.giaiNganThangNguonQuy, this.total.dtoanSdungNamNguonQuy);
        this.total.luyKeGiaiNganTcongTle = percent(this.total.luyKeGiaiNganTcong, this.total.dtoanSdungNamTcong);
        this.total.luyKeGiaiNganNguonNsnnTle = percent(this.total.luyKeGiaiNganNguonNsnn, this.total.dtoanSdungNamNguonNsnn);
        this.total.luyKeGiaiNganNguonSnTle = percent(this.total.luyKeGiaiNganNguonSn, this.total.dtoanSdungNamNguonSn);
        this.total.luyKeGiaiNganNguonQuyTle = percent(this.total.luyKeGiaiNganNguonQuy, this.total.dtoanSdungNamNguonQuy);
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
        this.editCache[data.id].data.giaiNganThangTcongTle = percent(this.editCache[data.id].data.giaiNganThangTcong, this.editCache[data.id].data.dtoanSdungNamTcong);
        this.editCache[data.id].data.giaiNganThangNguonNsnnTle = percent(this.editCache[data.id].data.giaiNganThangNguonNsnn, this.editCache[data.id].data.dtoanSdungNamNguonNsnn);
        this.editCache[data.id].data.giaiNganThangNguonSnTle = percent(this.editCache[data.id].data.giaiNganThangNguonSn, this.editCache[data.id].data.dtoanSdungNamNguonSn);
        this.editCache[data.id].data.giaiNganThangNguonQuyTle = percent(this.editCache[data.id].data.giaiNganThangNguonQuy, this.editCache[data.id].data.dtoanSdungNamNguonQuy);
        this.editCache[data.id].data.luyKeGiaiNganTcongTle = percent(this.editCache[data.id].data.luyKeGiaiNganTcong, this.editCache[data.id].data.dtoanSdungNamTcong);
        this.editCache[data.id].data.luyKeGiaiNganNguonNsnnTle = percent(this.editCache[data.id].data.luyKeGiaiNganNguonNsnn, this.editCache[data.id].data.dtoanSdungNamNguonNsnn);
        this.editCache[data.id].data.luyKeGiaiNganNguonSnTle = percent(this.editCache[data.id].data.luyKeGiaiNganNguonSn, this.editCache[data.id].data.dtoanSdungNamNguonSn);
        this.editCache[data.id].data.luyKeGiaiNganNguonQuyTle = percent(this.editCache[data.id].data.luyKeGiaiNganNguonQuy, this.editCache[data.id].data.dtoanSdungNamNguonQuy);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
