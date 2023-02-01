import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { addChild, addHead, addParent, deleteRow, displayNumber, divNumber, exchangeMoney, getHead, replaceIndex, sortByIndex, sortWithoutIndex, sumNumber } from 'src/app/Utility/func';
import { BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from "src/app/Utility/utils";
import * as uuid from "uuid";


export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdung: string;
    tenNdung: string;
    kphiSdungTcong: number;
    kphiSdungDtoan: number;
    kphiSdungNguonKhac: number;
    kphiSdungNguonQuy: number;
    kphiSdungNstt: number;
    kphiSdungCk: number;
    kphiChuyenSangTcong: number;
    kphiChuyenSangDtoan: number;
    kphiChuyenSangNguonKhac: number;
    kphiChuyenSangNguonQuy: number;
    kphiChuyenSangNstt: number;
    kphiChuyenSangCk: number;
    dtoanGiaoTcong: number;
    dtoanGiaoDtoan: number;
    dtoanGiaoNguonKhac: number;
    dtoanGiaoNguonQuy: number;
    dtoanGiaoNstt: number;
    dtoanGiaoCk: number;
    giaiNganThangBcaoTcong: number;
    giaiNganThangBcaoTcongTle: number;
    giaiNganThangBcaoDtoan: number;
    giaiNganThangBcaoDtoanTle: number;
    giaiNganThangBcaoNguonKhac: number;
    giaiNganThangBcaoNguonKhacTle: number;
    giaiNganThangBcaoNguonQuy: number;
    giaiNganThangBcaoNguonQuyTle: number;
    giaiNganThangBcaoNstt: number;
    giaiNganThangBcaoNsttTle: number;
    giaiNganThangBcaoCk: number;
    giaiNganThangBcaoCkTle: number;
    luyKeGiaiNganTcong: number;
    luyKeGiaiNganTcongTle: number;
    luyKeGiaiNganDtoan: number;
    luyKeGiaiNganDtoanTle: number;
    luyKeGiaiNganNguonKhac: number;
    luyKeGiaiNganNguonKhacTle: number;
    luyKeGiaiNganNguonQuy: number;
    luyKeGiaiNganNguonQuyTle: number;
    luyKeGiaiNganNstt: number;
    luyKeGiaiNganNsttTle: number;
    luyKeGiaiNganCk: number;
    luyKeGiaiNganCkTle: number;
}

@Component({
    selector: 'app-phu-luc-1',
    templateUrl: './phu-luc-1.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donVis: any = [];
    noiDungs: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    luyKeDetail: any[] = [];
    maLoaiBcao: string;
    maCntt: string;
    maSuaChua: string;
    scrollX = (350 + 42 * BOX_NUMBER_WIDTH + 200).toString() + 'px';

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
    statusEdit: boolean;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;

    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private danhMucService: DanhMucHDVService,
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
        await this.danhMucService.dMNoiDungPhuLuc1().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    data.data.forEach(item => {
                        this.noiDungs.push({
                            ...item,
                            level: item.ma.split('.').length - 2,
                        })
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
        this.id = this.data?.id;
        this.idBcao = this.data?.idBcao;
        this.maPhuLuc = this.data?.maPhuLuc;
        this.maLoaiBcao = this.data?.maLoaiBcao;
        this.maDviTien = this.data?.maDviTien ? this.data.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namBcao = this.data?.namBcao;
        this.luyKeDetail = this.data?.luyKeDetail?.lstCtietBcaos;
        this.status = this.data?.status;
        this.statusEdit = !this.status && this.maLoaiBcao != '527';
        if (this.statusEdit) {
            this.scrollX = (350 + 42 * BOX_NUMBER_WIDTH).toString() + 'px';
        }
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.maCntt = this.data.extraDataPL2?.maNdung;
        this.maSuaChua = this.data.extraDataPL3?.maNdung;

        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                giaiNganThangBcaoTcongTle: divNumber(item.giaiNganThangBcaoTcong, item.kphiSdungTcong),
                giaiNganThangBcaoDtoanTle: divNumber(item.giaiNganThangBcaoDtoan, item.kphiSdungDtoan),
                giaiNganThangBcaoNguonKhacTle: divNumber(item.giaiNganThangBcaoNguonKhac, item.kphiSdungNguonKhac),
                giaiNganThangBcaoNguonQuyTle: divNumber(item.giaiNganThangBcaoNguonQuy, item.kphiSdungNguonQuy),
                giaiNganThangBcaoNsttTle: divNumber(item.giaiNganThangBcaoNstt, item.kphiSdungNstt),
                giaiNganThangBcaoCkTle: divNumber(item.giaiNganThangBcaoCk, item.kphiSdungCk),
                luyKeGiaiNganTcongTle: divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong),
                luyKeGiaiNganDtoanTle: divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan),
                luyKeGiaiNganNguonKhacTle: divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac),
                luyKeGiaiNganNguonQuyTle: divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy),
                luyKeGiaiNganNsttTle: divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt),
                luyKeGiaiNganCkTle: divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk),
                checked: false,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            this.luyKeDetail.forEach(item => {
                this.lstCtietBcao.push({
                    ...item,
                    luyKeGiaiNganTcongTle: divNumber(item.luyKeGiaiNganTcong, item.kphiSdungTcong),
                    luyKeGiaiNganDtoanTle: divNumber(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan),
                    luyKeGiaiNganNguonKhacTle: divNumber(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac),
                    luyKeGiaiNganNguonQuyTle: divNumber(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy),
                    luyKeGiaiNganNsttTle: divNumber(item.luyKeGiaiNganNstt, item.kphiSdungNstt),
                    luyKeGiaiNganCkTle: divNumber(item.luyKeGiaiNganCk, item.kphiSdungCk),
                    checked: false,
                    id: uuid.v4() + 'FE',
                })
            })
        }

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0]?.stt) {
                this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maNdung');
            } else {
                this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
            }
        }

        this.linkData(this.data.extraDataPL2?.maNdung);
        this.linkData(this.data.extraDataPL3?.maNdung);
        this.getTotal();
        this.lstCtietBcao.forEach(item => {
            item.tenNdung = this.noiDungs.find(e => e.ma == item.maNdung)?.giaTri;
        })
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
            if (item.kphiSdungTcong > MONEY_LIMIT || item.kphiChuyenSangTcong > MONEY_LIMIT || item.dtoanGiaoTcong > MONEY_LIMIT ||
                item.giaiNganThangBcaoTcong > MONEY_LIMIT || item.luyKeGiaiNganTcong > MONEY_LIMIT) {
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

    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = addParent(id, initItem, this.lstCtietBcao);
        const data = this.lstCtietBcao.find(e => e.maNdung == initItem.maNdung);
        if (data.maNdung == this.data.extraDataPL2?.maNdung || data.maNdung == this.data.extraDataPL3?.maNdung) {
            this.linkData(data.maNdung)
        }
        this.sum(data.stt);
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
        const data = this.lstCtietBcao.find(e => e.maNdung == initItem.maNdung);

        if (data.maNdung == this.data.extraDataPL2?.maNdung || data.maNdung == this.data.extraDataPL3?.maNdung) {
            this.linkData(data.maNdung)
        }
        this.sum(data.stt);

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
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...data },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
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
            nzTitle: 'Danh sách nội dung ',
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
                        ...new ItemData(),
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
                            ...new ItemData(),
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

    getDeleteStatus(data: ItemData) {
        return this.luyKeDetail.findIndex(e => e.maNdung == data.maNdung) != -1;
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
                    this.lstCtietBcao[index].kphiSdungTcong = sumNumber([this.lstCtietBcao[index].kphiSdungTcong, item.kphiSdungTcong]);
                    this.lstCtietBcao[index].kphiSdungDtoan = sumNumber([this.lstCtietBcao[index].kphiSdungDtoan, item.kphiSdungDtoan]);
                    this.lstCtietBcao[index].kphiSdungNguonKhac = sumNumber([this.lstCtietBcao[index].kphiSdungNguonKhac, item.kphiSdungNguonKhac]);
                    this.lstCtietBcao[index].kphiSdungNguonQuy = sumNumber([this.lstCtietBcao[index].kphiSdungNguonQuy, item.kphiSdungNguonQuy]);
                    this.lstCtietBcao[index].kphiSdungNstt = sumNumber([this.lstCtietBcao[index].kphiSdungNstt, item.kphiSdungNstt]);
                    this.lstCtietBcao[index].kphiSdungCk = sumNumber([this.lstCtietBcao[index].kphiSdungCk, item.kphiSdungCk]);
                    this.lstCtietBcao[index].kphiChuyenSangTcong = sumNumber([this.lstCtietBcao[index].kphiChuyenSangTcong, item.kphiChuyenSangTcong]);
                    this.lstCtietBcao[index].kphiChuyenSangDtoan = sumNumber([this.lstCtietBcao[index].kphiChuyenSangDtoan, item.kphiChuyenSangDtoan]);
                    this.lstCtietBcao[index].kphiChuyenSangNguonKhac = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNguonKhac, item.kphiChuyenSangNguonKhac]);
                    this.lstCtietBcao[index].kphiChuyenSangNguonQuy = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNguonQuy, item.kphiChuyenSangNguonQuy]);
                    this.lstCtietBcao[index].kphiChuyenSangNstt = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNstt, item.kphiChuyenSangNstt]);
                    this.lstCtietBcao[index].kphiChuyenSangCk = sumNumber([this.lstCtietBcao[index].kphiChuyenSangCk, item.kphiChuyenSangCk]);
                    this.lstCtietBcao[index].dtoanGiaoTcong = sumNumber([this.lstCtietBcao[index].dtoanGiaoTcong, item.dtoanGiaoTcong]);
                    this.lstCtietBcao[index].dtoanGiaoDtoan = sumNumber([this.lstCtietBcao[index].dtoanGiaoDtoan, item.dtoanGiaoDtoan]);
                    this.lstCtietBcao[index].dtoanGiaoNguonKhac = sumNumber([this.lstCtietBcao[index].dtoanGiaoNguonKhac, item.dtoanGiaoNguonKhac]);
                    this.lstCtietBcao[index].dtoanGiaoNguonQuy = sumNumber([this.lstCtietBcao[index].dtoanGiaoNguonQuy, item.dtoanGiaoNguonQuy]);
                    this.lstCtietBcao[index].dtoanGiaoNstt = sumNumber([this.lstCtietBcao[index].dtoanGiaoNstt, item.dtoanGiaoNstt]);
                    this.lstCtietBcao[index].dtoanGiaoCk = sumNumber([this.lstCtietBcao[index].dtoanGiaoCk, item.dtoanGiaoCk]);
                    this.lstCtietBcao[index].giaiNganThangBcaoTcong = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoTcong, item.giaiNganThangBcaoTcong]);
                    this.lstCtietBcao[index].giaiNganThangBcaoDtoan = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoDtoan, item.giaiNganThangBcaoDtoan]);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, item.giaiNganThangBcaoNguonKhac]);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, item.giaiNganThangBcaoNguonQuy]);
                    this.lstCtietBcao[index].giaiNganThangBcaoNstt = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoNstt, item.giaiNganThangBcaoNstt]);
                    this.lstCtietBcao[index].giaiNganThangBcaoCk = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoCk, item.giaiNganThangBcaoCk]);
                    this.lstCtietBcao[index].luyKeGiaiNganTcong = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                    this.lstCtietBcao[index].luyKeGiaiNganDtoan = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDtoan, item.luyKeGiaiNganDtoan]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonKhac = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, item.luyKeGiaiNganNguonKhac]);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuy = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
                    this.lstCtietBcao[index].luyKeGiaiNganNstt = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganNstt, item.luyKeGiaiNganNstt]);
                    this.lstCtietBcao[index].luyKeGiaiNganCk = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganCk, item.luyKeGiaiNganCk]);

                    this.lstCtietBcao[index].giaiNganThangBcaoTcongTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoTcong, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].giaiNganThangBcaoDtoanTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonKhacTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
                    this.lstCtietBcao[index].giaiNganThangBcaoNguonQuyTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
                    this.lstCtietBcao[index].giaiNganThangBcaoNsttTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNstt, this.lstCtietBcao[index].kphiSdungNstt);
                    this.lstCtietBcao[index].giaiNganThangBcaoCkTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoCk, this.lstCtietBcao[index].kphiSdungCk);
                    this.lstCtietBcao[index].luyKeGiaiNganTcongTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].kphiSdungTcong);
                    this.lstCtietBcao[index].luyKeGiaiNganDtoanTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonKhacTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
                    this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
                    this.lstCtietBcao[index].luyKeGiaiNganNsttTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNstt, this.lstCtietBcao[index].kphiSdungNstt);
                    this.lstCtietBcao[index].luyKeGiaiNganCkTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganCk, this.lstCtietBcao[index].kphiSdungCk);
                }
            })
            stt = getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.kphiSdungTcong = sumNumber([this.total.kphiSdungTcong, item.kphiSdungTcong]);
                this.total.kphiSdungDtoan = sumNumber([this.total.kphiSdungDtoan, item.kphiSdungDtoan]);
                this.total.kphiSdungNguonKhac = sumNumber([this.total.kphiSdungNguonKhac, item.kphiSdungNguonKhac]);
                this.total.kphiSdungNguonQuy = sumNumber([this.total.kphiSdungNguonQuy, item.kphiSdungNguonQuy]);
                this.total.kphiSdungNstt = sumNumber([this.total.kphiSdungNstt, item.kphiSdungNstt]);
                this.total.kphiSdungCk = sumNumber([this.total.kphiSdungCk, item.kphiSdungCk]);
                this.total.kphiChuyenSangTcong = sumNumber([this.total.kphiChuyenSangTcong, item.kphiChuyenSangTcong]);
                this.total.kphiChuyenSangDtoan = sumNumber([this.total.kphiChuyenSangDtoan, item.kphiChuyenSangDtoan]);
                this.total.kphiChuyenSangNguonKhac = sumNumber([this.total.kphiChuyenSangNguonKhac, item.kphiChuyenSangNguonKhac]);
                this.total.kphiChuyenSangNguonQuy = sumNumber([this.total.kphiChuyenSangNguonQuy, item.kphiChuyenSangNguonQuy]);
                this.total.kphiChuyenSangNstt = sumNumber([this.total.kphiChuyenSangNstt, item.kphiChuyenSangNstt]);
                this.total.kphiChuyenSangCk = sumNumber([this.total.kphiChuyenSangCk, item.kphiChuyenSangCk]);
                this.total.dtoanGiaoTcong = sumNumber([this.total.dtoanGiaoTcong, item.dtoanGiaoTcong]);
                this.total.dtoanGiaoDtoan = sumNumber([this.total.dtoanGiaoDtoan, item.dtoanGiaoDtoan]);
                this.total.dtoanGiaoNguonKhac = sumNumber([this.total.dtoanGiaoNguonKhac, item.dtoanGiaoNguonKhac]);
                this.total.dtoanGiaoNguonQuy = sumNumber([this.total.dtoanGiaoNguonQuy, item.dtoanGiaoNguonQuy]);
                this.total.dtoanGiaoNstt = sumNumber([this.total.dtoanGiaoNstt, item.dtoanGiaoNstt]);
                this.total.dtoanGiaoCk = sumNumber([this.total.dtoanGiaoCk, item.dtoanGiaoCk]);
                this.total.giaiNganThangBcaoTcong = sumNumber([this.total.giaiNganThangBcaoTcong, item.giaiNganThangBcaoTcong]);
                this.total.giaiNganThangBcaoDtoan = sumNumber([this.total.giaiNganThangBcaoDtoan, item.giaiNganThangBcaoDtoan]);
                this.total.giaiNganThangBcaoNguonKhac = sumNumber([this.total.giaiNganThangBcaoNguonKhac, item.giaiNganThangBcaoNguonKhac]);
                this.total.giaiNganThangBcaoNguonQuy = sumNumber([this.total.giaiNganThangBcaoNguonQuy, item.giaiNganThangBcaoNguonQuy]);
                this.total.giaiNganThangBcaoNstt = sumNumber([this.total.giaiNganThangBcaoNstt, item.giaiNganThangBcaoNstt]);
                this.total.giaiNganThangBcaoCk = sumNumber([this.total.giaiNganThangBcaoCk, item.giaiNganThangBcaoCk]);
                this.total.luyKeGiaiNganTcong = sumNumber([this.total.luyKeGiaiNganTcong, item.luyKeGiaiNganTcong]);
                this.total.luyKeGiaiNganDtoan = sumNumber([this.total.luyKeGiaiNganDtoan, item.luyKeGiaiNganDtoan]);
                this.total.luyKeGiaiNganNguonKhac = sumNumber([this.total.luyKeGiaiNganNguonKhac, item.luyKeGiaiNganNguonKhac]);
                this.total.luyKeGiaiNganNguonQuy = sumNumber([this.total.luyKeGiaiNganNguonQuy, item.luyKeGiaiNganNguonQuy]);
                this.total.luyKeGiaiNganNstt = sumNumber([this.total.luyKeGiaiNganNstt, item.luyKeGiaiNganNstt]);
                this.total.luyKeGiaiNganCk = sumNumber([this.total.luyKeGiaiNganCk, item.luyKeGiaiNganCk]);
            }
        })
        this.total.giaiNganThangBcaoTcongTle = divNumber(this.total.giaiNganThangBcaoTcong, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoDtoanTle = divNumber(this.total.giaiNganThangBcaoDtoan, this.total.kphiSdungDtoan);
        this.total.giaiNganThangBcaoNguonKhacTle = divNumber(this.total.giaiNganThangBcaoNguonKhac, this.total.kphiSdungNguonKhac);
        this.total.giaiNganThangBcaoNguonQuyTle = divNumber(this.total.giaiNganThangBcaoNguonQuy, this.total.kphiSdungNguonQuy);
        this.total.giaiNganThangBcaoNsttTle = divNumber(this.total.giaiNganThangBcaoNstt, this.total.kphiSdungNstt);
        this.total.giaiNganThangBcaoCkTle = divNumber(this.total.giaiNganThangBcaoCk, this.total.kphiSdungCk);
        this.total.luyKeGiaiNganTcongTle = divNumber(this.total.luyKeGiaiNganTcong, this.total.kphiSdungTcong);
        this.total.luyKeGiaiNganDtoanTle = divNumber(this.total.luyKeGiaiNganDtoan, this.total.kphiSdungDtoan);
        this.total.luyKeGiaiNganNguonKhacTle = divNumber(this.total.luyKeGiaiNganNguonKhac, this.total.kphiSdungNguonKhac);
        this.total.luyKeGiaiNganNguonQuyTle = divNumber(this.total.luyKeGiaiNganNguonQuy, this.total.kphiSdungNguonQuy);
        this.total.luyKeGiaiNganNsttTle = divNumber(this.total.luyKeGiaiNganNstt, this.total.kphiSdungNstt);
        this.total.luyKeGiaiNganCkTle = divNumber(this.total.luyKeGiaiNganCk, this.total.kphiSdungCk);
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.kphiSdungDtoan = sumNumber([this.editCache[id].data.kphiChuyenSangDtoan, this.editCache[id].data.dtoanGiaoDtoan]);
        this.editCache[id].data.kphiSdungNguonKhac = sumNumber([this.editCache[id].data.kphiChuyenSangNguonKhac, this.editCache[id].data.dtoanGiaoNguonKhac]);
        this.editCache[id].data.kphiSdungNguonQuy = sumNumber([this.editCache[id].data.kphiChuyenSangNguonQuy, this.editCache[id].data.dtoanGiaoNguonQuy]);
        this.editCache[id].data.kphiSdungNstt = sumNumber([this.editCache[id].data.kphiChuyenSangNstt, this.editCache[id].data.dtoanGiaoNstt]);
        this.editCache[id].data.kphiSdungCk = sumNumber([this.editCache[id].data.kphiChuyenSangCk, this.editCache[id].data.dtoanGiaoCk]);

        this.editCache[id].data.kphiSdungTcong = sumNumber([this.editCache[id].data.kphiSdungDtoan, this.editCache[id].data.kphiSdungNguonKhac, this.editCache[id].data.kphiSdungNguonQuy,
        this.editCache[id].data.kphiSdungNstt, this.editCache[id].data.kphiSdungCk]);

        this.editCache[id].data.kphiChuyenSangTcong = sumNumber([this.editCache[id].data.kphiChuyenSangDtoan, this.editCache[id].data.kphiChuyenSangNguonKhac, this.editCache[id].data.kphiChuyenSangNguonQuy,
        this.editCache[id].data.kphiChuyenSangNstt, this.editCache[id].data.kphiChuyenSangCk]);

        this.editCache[id].data.dtoanGiaoTcong = sumNumber([this.editCache[id].data.dtoanGiaoDtoan, this.editCache[id].data.dtoanGiaoNguonKhac, this.editCache[id].data.dtoanGiaoNguonQuy,
        this.editCache[id].data.dtoanGiaoNstt, this.editCache[id].data.dtoanGiaoCk]);

        this.editCache[id].data.giaiNganThangBcaoTcong = sumNumber([this.editCache[id].data.giaiNganThangBcaoDtoan, this.editCache[id].data.giaiNganThangBcaoNguonKhac, this.editCache[id].data.giaiNganThangBcaoNguonQuy,
        this.editCache[id].data.giaiNganThangBcaoNstt, this.editCache[id].data.giaiNganThangBcaoCk]);

        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([this.editCache[id].data.luyKeGiaiNganDtoan, this.editCache[id].data.luyKeGiaiNganNguonKhac, this.editCache[id].data.luyKeGiaiNganNguonQuy,
        this.editCache[id].data.luyKeGiaiNganNstt, this.editCache[id].data.luyKeGiaiNganCk]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganTcong = sumNumber([data.luyKeGiaiNganTcong, this.editCache[id].data.giaiNganThangBcaoTcong, -data.giaiNganThangBcaoTcong]);
        this.editCache[id].data.luyKeGiaiNganDtoan = sumNumber([data.luyKeGiaiNganDtoan, this.editCache[id].data.giaiNganThangBcaoDtoan, -data.giaiNganThangBcaoDtoan]);
        this.editCache[id].data.luyKeGiaiNganNguonKhac = sumNumber([data.luyKeGiaiNganNguonKhac, this.editCache[id].data.giaiNganThangBcaoNguonKhac, -data.giaiNganThangBcaoNguonKhac]);
        this.editCache[id].data.luyKeGiaiNganNguonQuy = sumNumber([data.luyKeGiaiNganNguonQuy, this.editCache[id].data.giaiNganThangBcaoNguonQuy, -data.giaiNganThangBcaoNguonQuy]);
        this.editCache[id].data.luyKeGiaiNganNstt = sumNumber([data.luyKeGiaiNganNstt, this.editCache[id].data.giaiNganThangBcaoNstt, -data.giaiNganThangBcaoNstt]);
        this.editCache[id].data.luyKeGiaiNganCk = sumNumber([data.luyKeGiaiNganCk, this.editCache[id].data.giaiNganThangBcaoCk, -data.giaiNganThangBcaoCk]);

        //tinh ty le
        this.editCache[id].data.giaiNganThangBcaoTcongTle = divNumber(this.editCache[id].data.giaiNganThangBcaoTcong, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoDtoanTle = divNumber(this.editCache[id].data.giaiNganThangBcaoDtoan, this.editCache[id].data.kphiSdungDtoan);
        this.editCache[id].data.giaiNganThangBcaoNguonKhacTle = divNumber(this.editCache[id].data.giaiNganThangBcaoNguonKhac, this.editCache[id].data.kphiSdungNguonKhac);
        this.editCache[id].data.giaiNganThangBcaoNguonQuyTle = divNumber(this.editCache[id].data.giaiNganThangBcaoNguonQuy, this.editCache[id].data.kphiSdungNguonQuy);
        this.editCache[id].data.giaiNganThangBcaoNsttTle = divNumber(this.editCache[id].data.giaiNganThangBcaoNstt, this.editCache[id].data.kphiSdungNstt);
        this.editCache[id].data.giaiNganThangBcaoCkTle = divNumber(this.editCache[id].data.giaiNganThangBcaoCk, this.editCache[id].data.kphiSdungCk);
        this.editCache[id].data.luyKeGiaiNganTcongTle = divNumber(this.editCache[id].data.luyKeGiaiNganTcong, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.luyKeGiaiNganDtoanTle = divNumber(this.editCache[id].data.luyKeGiaiNganDtoan, this.editCache[id].data.kphiSdungDtoan);
        this.editCache[id].data.luyKeGiaiNganNguonKhacTle = divNumber(this.editCache[id].data.luyKeGiaiNganNguonKhac, this.editCache[id].data.kphiSdungNguonKhac);
        this.editCache[id].data.luyKeGiaiNganNguonQuyTle = divNumber(this.editCache[id].data.luyKeGiaiNganNguonQuy, this.editCache[id].data.kphiSdungNguonQuy);
        this.editCache[id].data.luyKeGiaiNganNsttTle = divNumber(this.editCache[id].data.luyKeGiaiNganNstt, this.editCache[id].data.kphiSdungNstt);
        this.editCache[id].data.luyKeGiaiNganCkTle = divNumber(this.editCache[id].data.luyKeGiaiNganCk, this.editCache[id].data.kphiSdungCk)
    }

    //chuyen du lieu tu phu luc 2 va 3 sang phu luc 1
    linkData(ma: string) {
        if (this.data.extraDataPL2 && ma == this.data.extraDataPL2?.maNdung) {
            const index = this.lstCtietBcao.findIndex(e => e.maNdung == this.data.extraDataPL2.maNdung);
            if (index != -1) {
                this.lstCtietBcao[index].dtoanGiaoDtoan = this.data.extraDataPL2.dtoanGiaoDtoan;
                this.lstCtietBcao[index].dtoanGiaoNguonKhac = this.data.extraDataPL2.dtoanGiaoNguonKhac;
                this.lstCtietBcao[index].dtoanGiaoNguonQuy = this.data.extraDataPL2.dtoanGiaoNguonQuy;
                this.lstCtietBcao[index].giaiNganThangBcaoDtoan = this.data.extraDataPL2.giaiNganThangBcaoDtoan;
                this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac = this.data.extraDataPL2.giaiNganThangBcaoNguonKhac;
                this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy = this.data.extraDataPL2.giaiNganThangBcaoNguonQuy;
                this.lstCtietBcao[index].luyKeGiaiNganDtoan = this.data.extraDataPL2.luyKeGiaiNganDtoan;
                this.lstCtietBcao[index].luyKeGiaiNganNguonKhac = this.data.extraDataPL2.luyKeGiaiNganNguonKhac;
                this.lstCtietBcao[index].luyKeGiaiNganNguonQuy = this.data.extraDataPL2.luyKeGiaiNganNguonQuy;
                this.changeData(index);
            }
        }
        if (this.data.extraDataPL3 && ma == this.data.extraDataPL3?.maNdung) {
            const index = this.lstCtietBcao.findIndex(e => e.maNdung == this.data.extraDataPL3.maNdung);
            if (index != -1) {
                this.lstCtietBcao[index].dtoanGiaoDtoan = this.data.extraDataPL3.dtoanGiaoDtoan;
                this.lstCtietBcao[index].giaiNganThangBcaoDtoan = this.data.extraDataPL3.giaiNganThangBcaoDtoan;
                this.lstCtietBcao[index].luyKeGiaiNganDtoan = this.data.extraDataPL3.luyKeGiaiNganDtoan;
                this.changeData(index);
            }

        }
    }

    changeData(index: number) {
        this.lstCtietBcao[index].kphiSdungDtoan = sumNumber([this.lstCtietBcao[index].kphiChuyenSangDtoan, this.lstCtietBcao[index].dtoanGiaoDtoan]);
        this.lstCtietBcao[index].kphiSdungNguonKhac = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNguonKhac, this.lstCtietBcao[index].dtoanGiaoNguonKhac]);
        this.lstCtietBcao[index].kphiSdungNguonQuy = sumNumber([this.lstCtietBcao[index].kphiChuyenSangNguonQuy, this.lstCtietBcao[index].dtoanGiaoNguonQuy]);

        this.lstCtietBcao[index].kphiSdungTcong = sumNumber([this.lstCtietBcao[index].kphiSdungDtoan, this.lstCtietBcao[index].kphiSdungNguonKhac, this.lstCtietBcao[index].kphiSdungNguonQuy,
        this.lstCtietBcao[index].kphiSdungNstt, this.lstCtietBcao[index].kphiSdungCk]);

        this.lstCtietBcao[index].dtoanGiaoTcong = sumNumber([this.lstCtietBcao[index].dtoanGiaoDtoan, this.lstCtietBcao[index].dtoanGiaoNguonKhac, this.lstCtietBcao[index].dtoanGiaoNguonQuy,
        this.lstCtietBcao[index].dtoanGiaoNstt, this.lstCtietBcao[index].dtoanGiaoCk]);

        this.lstCtietBcao[index].giaiNganThangBcaoTcong = sumNumber([this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy,
        this.lstCtietBcao[index].giaiNganThangBcaoNstt, this.lstCtietBcao[index].giaiNganThangBcaoCk]);

        this.lstCtietBcao[index].luyKeGiaiNganTcong = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].luyKeGiaiNganNguonQuy,
        this.lstCtietBcao[index].luyKeGiaiNganNstt, this.lstCtietBcao[index].luyKeGiaiNganCk]);
        //tinh lai ty le
        this.lstCtietBcao[index].giaiNganThangBcaoTcongTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoTcong, this.lstCtietBcao[index].kphiSdungTcong);
        this.lstCtietBcao[index].giaiNganThangBcaoDtoanTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
        this.lstCtietBcao[index].giaiNganThangBcaoNguonKhacTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
        this.lstCtietBcao[index].giaiNganThangBcaoNguonQuyTle = divNumber(this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
        this.lstCtietBcao[index].luyKeGiaiNganTcongTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].kphiSdungTcong);
        this.lstCtietBcao[index].luyKeGiaiNganDtoanTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
        this.lstCtietBcao[index].luyKeGiaiNganNguonKhacTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
        this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = divNumber(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
        this.sum(this.lstCtietBcao[index].stt)
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
