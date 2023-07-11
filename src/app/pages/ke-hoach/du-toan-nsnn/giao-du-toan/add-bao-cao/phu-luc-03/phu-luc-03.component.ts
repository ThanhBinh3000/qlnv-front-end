import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, exchangeMoney, mulNumber, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-03.constant';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    danhMuc: string;
    tenDanhMuc: string;
    maDviTinh: string;
    namDtCphiTaiCkhoSl: number;
    namDtCphiTaiCkhoDm: number;
    namDtCphiTaiCkhoTt: number;
    namDtCphiNgoaiCkhoBq: number;
    namDtCphiNgoaiCkhoTt: number;
    namDtTcong: number;
    checked: boolean;
}


@Component({
    selector: 'app-phu-luc-03',
    templateUrl: './phu-luc-03.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc03Component implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: any;
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    thuyetMinh: string;
    namTruoc: string;
    namBcao: number;
    namKeHoach: string;
    //danh muc
    linhVucChis: any[] = DANH_MUC;
    soLaMa: any[] = LA_MA;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    editMoneyUnit = false;
    isDataAvailable = false;
    checkViewTD: boolean;
    checkEditTD: boolean;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    listVatTu: any[] = [];
    listVatTu1: any[] = [];
    luongThuc: any[] = [];
    lstVatTuFull: any[] = [];
    lstvatTu: any[] = [];
    loaiHang: string;
    dsDinhMuc: any[] = [];
    allChecked = false;
    maDviTao: string;
    isSynthetic: any;
    amount = AMOUNT;
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private giaoDuToanService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private quanLyVonPhiService: QuanLyVonPhiService,

    ) {
    }


    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        this.formDetail = this.dataInfo?.data;
        this.namBcao = this.dataInfo?.namBcao;
        this.maDviTao = this.dataInfo?.maDvi;
        this.namTruoc = (Number(this.namBcao) - 1).toString();
        this.namKeHoach = (Number(this.namBcao) + 1).toString();
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.isSynthetic = this.dataInfo?.isSynthetic;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusBtnOk = this.dataInfo?.statusBtnOk;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.formDetail?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            this.linhVucChis.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenDanhMuc: e.giaTri,
                    danhMuc: e.ma,
                })
            })
            this.setLevel();
            this.lstCtietBcao.forEach(item => {
                item.tenDanhMuc += this.getName(item.level, item.danhMuc);
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.danhMuc;
            })
        }

        await this.getDinhMuc();


        this.lstCtietBcao.forEach(item => {
            const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc);
            if (!item.tenDanhMuc) {
                item.tenDanhMuc = dinhMuc?.tenDinhMuc;
                item.namDtCphiTaiCkhoDm = dinhMuc?.tongDmuc;
                item.maDviTinh = dinhMuc?.donViTinh;
                item.namDtCphiTaiCkhoTt = mulNumber(item.namDtCphiTaiCkhoDm, item.namDtCphiTaiCkhoSl);
            }
        })


        if (this.isSynthetic) {
            this.lstCtietBcao.forEach(item => {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc);
                item.namDtCphiTaiCkhoDm = dinhMuc?.tongDmuc;
                item.namDtCphiTaiCkhoTt = mulNumber(item.namDtCphiTaiCkhoDm, item.namDtCphiTaiCkhoSl);
                item.namDtTcong = sumNumber([item.namDtCphiTaiCkhoTt, item.namDtCphiNgoaiCkhoTt])
            })
            this.sum1()
        }

        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };


    sum1() {
        this.lstCtietBcao.forEach(itm => {
            let stt = this.getHead(itm.stt);
            while (stt != '0') {
                const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
                const data = this.lstCtietBcao[index];
                this.lstCtietBcao[index] = {
                    ...new ItemData(),
                    id: data.id,
                    stt: data.stt,
                    danhMuc: data.danhMuc,
                    tenDanhMuc: data.tenDanhMuc,
                    level: data.level,
                }
                this.lstCtietBcao.forEach(item => {
                    if (this.getHead(item.stt) == stt) {
                        this.lstCtietBcao[index].namDtCphiTaiCkhoTt = sumNumber([this.lstCtietBcao[index].namDtCphiTaiCkhoTt, item.namDtCphiTaiCkhoTt])
                        this.lstCtietBcao[index].namDtCphiNgoaiCkhoTt = sumNumber([this.lstCtietBcao[index].namDtCphiNgoaiCkhoTt, item.namDtCphiNgoaiCkhoTt])
                        this.lstCtietBcao[index].namDtTcong = sumNumber([this.lstCtietBcao[index].namDtTcong, item.namDtTcong])
                    }
                })
                stt = this.getHead(stt);
            }
            // this.getTotal();
            this.getTotal();
        })

    }

    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '02',
            maDvi: this.maDviTao,
        }
        await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMuc = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    getName(level: number, ma: string) {
        const type = this.getTail(ma);
        let str = '';
        return str;
    }

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
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

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.lstCtietBcaos = lstCtietBcaoTemp;
        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }
        request.trangThai = trangThai;
        this.spinner.show();
        this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this.formDetail = data.data;
                    this._modalRef.close({
                        formDetail: this.formDetail,
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        this.spinner.hide();
        this.getTotal()
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.formDetail?.id) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
            return;
        }
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.formDetail.trangThai = mcn;
                this.getStatusButton();
                if (mcn == "0") {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    formDetail: this.formDetail,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
        this.spinner.hide();
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
                this.save(mcn, text);
            }
        });
    }
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
            // xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
            xau = null;
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

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    // start edit
    startEdit(data: any): void {
        const id = data?.id;
        if (data.stt.startsWith("0.1")) {
            this.loaiHang = "LT"
        } else if (data.stt.startsWith("0.2")) {
            this.loaiHang = "VT"
        }
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal()
        this.updateEditCache();
    }

    changeVatTu(maDanhMuc: any, id: any) {
        this.editCache[id].data.tenDanhMuc = this.lstVatTuFull.find(vt => vt.id === maDanhMuc)?.ten;
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }
    changeModel(id: string): void {
        this.editCache[id].data.namDtCphiTaiCkhoTt = mulNumber(this.editCache[id].data.namDtCphiTaiCkhoSl, this.editCache[id].data.namDtCphiTaiCkhoDm);
        this.editCache[id].data.namDtCphiNgoaiCkhoTt = mulNumber(this.editCache[id].data.namDtCphiNgoaiCkhoBq, this.editCache[id].data.namDtCphiTaiCkhoSl);
        this.editCache[id].data.namDtTcong = sumNumber([this.editCache[id].data.namDtCphiNgoaiCkhoTt, this.editCache[id].data.namDtCphiTaiCkhoTt]);
    }

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                danhMuc: data.danhMuc,
                tenDanhMuc: data.tenDanhMuc,
                level: data.level,
                namDtCphiTaiCkhoSl: data.namDtCphiTaiCkhoSl,
                namDtCphiTaiCkhoDm: data.namDtCphiTaiCkhoDm,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].namDtCphiTaiCkhoTt = sumNumber([this.lstCtietBcao[index].namDtCphiTaiCkhoTt, item.namDtCphiTaiCkhoTt]);
                    this.lstCtietBcao[index].namDtCphiNgoaiCkhoTt = sumNumber([this.lstCtietBcao[index].namDtCphiNgoaiCkhoTt, item.namDtCphiNgoaiCkhoTt]);
                    this.lstCtietBcao[index].namDtCphiNgoaiCkhoBq = sumNumber([this.lstCtietBcao[index].namDtCphiNgoaiCkhoBq, item.namDtCphiNgoaiCkhoBq]);
                    this.lstCtietBcao[index].namDtTcong = sumNumber([this.lstCtietBcao[index].namDtTcong, item.namDtTcong]);
                }
            })
            stt = this.getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.namDtCphiTaiCkhoSl = sumNumber([this.total.namDtCphiTaiCkhoSl, item.namDtCphiTaiCkhoSl]);
                this.total.namDtCphiTaiCkhoDm = sumNumber([this.total.namDtCphiTaiCkhoDm, item.namDtCphiTaiCkhoDm]);
                this.total.namDtCphiTaiCkhoTt = sumNumber([this.total.namDtCphiTaiCkhoTt, item.namDtCphiTaiCkhoTt]);
                this.total.namDtCphiNgoaiCkhoTt = sumNumber([this.total.namDtCphiNgoaiCkhoTt, item.namDtCphiNgoaiCkhoTt]);
                this.total.namDtTcong = sumNumber([this.total.namDtTcong, item.namDtTcong]);
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    checkAdd(data: ItemData) {
        if ((data.level == 0 && data.danhMuc)) {
            return true;
        }
        return false;
    }

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 1) {
            return true;
        }
        return false;
    }

    //xóa dòng
    deleteLine(stt: string) {
        const head = this.getHead(stt);
        const tail = this.getTail(stt);
        this.lstCtietBcao = this.lstCtietBcao.filter(e => e.stt !== stt);
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(head) && item.stt != head && this.getTail(item.stt) > tail) {
                item.stt = head + '.' + (this.getTail(item.stt) - 1).toString();
            }
        })
        this.sum(stt);
        this.updateEditCache();
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

    handleCancel() {
        this._modalRef.close();
    }
    selectGoods() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogDanhSachVatTuHangHoaComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (data) => {
            if (data) {
                const dm = this.dsDinhMuc.find(e => e.cloaiVthh == data.ma);
                if (this.lstCtietBcao.findIndex(e => e.danhMuc == data.ma) == -1) {
                    let stt: any;
                    const index = this.lstCtietBcao.findIndex(e => e.danhMuc == '0.2');
                    if (data.ma.startsWith('02')) {
                        stt = '0.2.' + (this.lstCtietBcao.length - index).toString();
                        //them vat tu moi vao bang
                        this.lstCtietBcao.push({
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: stt,
                            danhMuc: data.ma,
                            tenDanhMuc: data.ten,
                            maDviTinh: dm?.donViTinh,
                            namDtCphiTaiCkhoDm: dm?.tongDmuc,
                            level: 1,
                        })
                        this.lstCtietBcao.forEach(e => {
                            if (e.stt.startsWith("0.2.")) {
                                this.lstCtietBcao[index].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcao[index].namDtCphiTaiCkhoSl = null;
                                this.lstCtietBcao[index].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcao[index].namDtCphiTaiCkhoTt = null;
                                this.lstCtietBcao[index].namDtCphiNgoaiCkhoTt = null;
                                this.lstCtietBcao[index].namDtTcong = null;
                                this.lstCtietBcao[index].namDtCphiNgoaiCkhoBq = null;
                            }
                        })
                        this.getTotal()
                        this.updateEditCache();
                    } else {
                        stt = '0.1.' + index.toString();
                        this.lstCtietBcao.splice(index, 0, {
                            ... new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: stt,
                            danhMuc: data.ma,
                            tenDanhMuc: data.ten,
                            maDviTinh: dm?.donViTinh,
                            namDtCphiTaiCkhoDm: dm?.tongDmuc,
                            level: 1,
                        })
                        const index2 = this.lstCtietBcao.findIndex(e => e.danhMuc == '0.1');
                        this.lstCtietBcao.forEach(e => {
                            if (e.stt.startsWith("0.1.")) {
                                this.lstCtietBcao[index2].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcao[index2].namDtCphiTaiCkhoSl = null;
                                this.lstCtietBcao[index2].namDtCphiTaiCkhoDm = null;
                                this.lstCtietBcao[index2].namDtCphiTaiCkhoTt = null;
                                this.lstCtietBcao[index2].namDtCphiNgoaiCkhoTt = null;
                                this.lstCtietBcao[index2].namDtTcong = null;
                                this.lstCtietBcao[index2].namDtCphiNgoaiCkhoBq = null;
                            }
                        })
                        this.getTotal()
                        this.updateEditCache();
                    }

                }
            }
        });
    }

    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != 0) {
                this.deleteLine(item);
            }
        })
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    updateAllChecked(): void {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    }
}


