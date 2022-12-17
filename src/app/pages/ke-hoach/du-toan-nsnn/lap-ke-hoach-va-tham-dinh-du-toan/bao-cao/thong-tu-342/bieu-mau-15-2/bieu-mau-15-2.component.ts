import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, mulNumber, sumNumber } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DANH_MUC } from '../../thong-tu-342/bieu-mau-15-2/bieu-mau-15-2.constant';

export class ItemData {
    id: any;
    stt: string;
    donVi: string;
    tenDmuc: string;
    dtTsoNguoiLv: number;
    dtTongQlPcap: number;
    dtQlPcapTso: number;
    dtQlPcapLuongBac: number;
    dtQlPcapPcapLuong: number;
    dtQlPcapDgopLuong: number;
    dtQlPcapHdLd: number;
    dtKphiNsnn: number;
    dtKphiSnDvu: number;
    dtKphiPhiDlai: number;
    dtKphiHphap: number;
    uocThTsoNguoiLv: number;
    uocThTsoBcTdiem: number;
    uocThTsoVcCc: number;
    uocThTongQlPcap: number;
    uocThQlPcapTso: number;
    uocThQlPcapLuongBac: number;
    uocThQlPcapPcapLuong: number;
    uocThQlPcapDgopLuong: number;
    uocThQlPcapHdLd: number;
    uocThKphiNsnn: number;
    uocThKphiSnDvu: number;
    uocThKphiPhiDlai: number;
    uocThKphiHphap: number;
    namKhTsoNguoiLv: number;
    namKhTongQlPcap: number;
    namKhQlPcapTso: number;
    namKhQlPcapLuongBac: number;
    namKhQlPcapPcapLuong: number;
    namKhQlPcapDgopLuong: number;
    namKhQlPcapHdLd: number;
    namKhKphiNsnn: number;
    namKhKphiSnDvu: number;
    namKhKphiPhiDlai: number;
    namKhKphiHphap: number;
    level: any;
    checked: boolean;
}
@Component({
    selector: 'app-bieu-mau-15-2',
    templateUrl: './bieu-mau-15-2.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau152Component implements OnInit {
    @Input() dataInfo;



    donViTiens: any[] = DON_VI_TIEN;
    editMoneyUnit = false;
    maDviTien: string = '1';
    lstCtietBcao: ItemData[] = [];
    formDetail: any;
    thuyetMinh: string;
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    listDonVi: any[] = DANH_MUC;
    lstVatTuFull = [];
    isDataAvailable = false;
    dsDinhMuc: any[] = [];
    maDviTao: any;
    soLaMa: any[] = LA_MA;
    allChecked = false;

    namBaoCao: string;
    namTruoc: string;
    namKeHoach: string;

    //bien tinh tong
    tongSo1: number;
    tongSo2: number;
    tongSo3: number;
    tongSo4: number;
    tongSo5: number;
    tongSo6: number;
    tongSo7: number;
    tongSo8: number;
    tongSo9: number;
    tongSo10: number;
    tongSo11: number;
    tongSo12: number;
    tongSo13: number;
    tongSo14: number;
    tongSo15: number;
    tongSo16: number;
    tongSo17: number;
    tongSo18: number;
    tongSo19: number;
    tongSo20: number;
    tongSo21: number;
    tongSo22: number;
    tongSo23: number;
    tongSo24: number;
    tongSo25: number;
    tongSo26: number;
    tongSo27: number;
    tongSo28: number;
    tongSo29: number;
    tongSo30: number;
    tongSo31: number;
    tongSo32: number;
    tongSo33: number;
    tongSo34: number;
    tongSo35: number;
    tongSo36: number;
    tongSo37: number;
    tongSo38: number;
    tongSo39: number;
    tongSo40: number;
    tongSo41: number;
    tongSo42: number;
    tongSo43: number;
    tongSo44: number;
    tongSo45: number;
    tongSo46: number;


    checkViewTD: boolean;
    checkEditTD: boolean;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMucService: DanhMucHDVService,
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
        this.maDviTao = this.dataInfo?.maDvi;
        this.namBaoCao = this.dataInfo?.namBcao;
        this.namTruoc = (Number(this.namBaoCao) - 1).toString();
        this.namKeHoach = (Number(this.namBaoCao) + 1).toString();
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        // this.checkEditTD = this.dataInfo?.editAppraisalValue;
        // this.checkViewTD = this.dataInfo?.viewAppraisalValue;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            this.listDonVi.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    donVi: e.ma,
                    tenDmuc: e.giaTri,
                    dtTsoNguoiLv: null,
                    dtTongQlPcap: null,
                    dtQlPcapTso: null,
                    dtQlPcapLuongBac: null,
                    dtQlPcapPcapLuong: null,
                    dtQlPcapDgopLuong: null,
                    dtQlPcapHdLd: null,
                    dtKphiNsnn: null,
                    dtKphiSnDvu: null,
                    dtKphiPhiDlai: null,
                    dtKphiHphap: null,
                    uocThTsoNguoiLv: null,
                    uocThTsoBcTdiem: null,
                    uocThTsoVcCc: null,
                    uocThTongQlPcap: null,
                    uocThQlPcapTso: null,
                    uocThQlPcapLuongBac: null,
                    uocThQlPcapPcapLuong: null,
                    uocThQlPcapDgopLuong: null,
                    uocThQlPcapHdLd: null,
                    uocThKphiNsnn: null,
                    uocThKphiSnDvu: null,
                    uocThKphiPhiDlai: null,
                    uocThKphiHphap: null,
                    namKhTsoNguoiLv: null,
                    namKhTongQlPcap: null,
                    namKhQlPcapTso: null,
                    namKhQlPcapLuongBac: null,
                    namKhQlPcapPcapLuong: null,
                    namKhQlPcapDgopLuong: null,
                    namKhQlPcapHdLd: null,
                    namKhKphiNsnn: null,
                    namKhKphiSnDvu: null,
                    namKhKphiPhiDlai: null,
                    namKhKphiHphap: null,
                    level: '',
                    checked: false,
                })
            })
            this.setLevel();
            this.lstCtietBcao.forEach(item => {
                item.tenDmuc += this.getName(item.level, item.donVi);
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.donVi;
            })
        }
        this.sortByIndex();
        this.updateEditCache();
        this.getStatusButton();

        this.spinner.hide();
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
            if (item.dtTsoNguoiLv > MONEY_LIMIT || item.dtTongQlPcap > MONEY_LIMIT || item.dtQlPcapTso > MONEY_LIMIT || item.dtQlPcapLuongBac > MONEY_LIMIT
                || item.dtQlPcapPcapLuong > MONEY_LIMIT || item.dtQlPcapDgopLuong > MONEY_LIMIT || item.dtQlPcapHdLd > MONEY_LIMIT || item.dtKphiNsnn > MONEY_LIMIT || item.dtKphiSnDvu > MONEY_LIMIT ||
                item.dtKphiPhiDlai > MONEY_LIMIT || item.dtKphiHphap > MONEY_LIMIT || item.uocThTsoNguoiLv > MONEY_LIMIT || item.uocThTsoBcTdiem > MONEY_LIMIT || item.uocThTsoVcCc > MONEY_LIMIT || item.uocThTongQlPcap > MONEY_LIMIT ||
                item.uocThQlPcapTso > MONEY_LIMIT || item.uocThQlPcapLuongBac > MONEY_LIMIT || item.uocThQlPcapPcapLuong > MONEY_LIMIT || item.uocThQlPcapDgopLuong > MONEY_LIMIT || item.uocThQlPcapHdLd > MONEY_LIMIT || item.uocThKphiNsnn > MONEY_LIMIT ||
                item.uocThKphiSnDvu > MONEY_LIMIT || item.uocThKphiPhiDlai > MONEY_LIMIT || item.uocThKphiHphap > MONEY_LIMIT || item.namKhTsoNguoiLv > MONEY_LIMIT || item.namKhTongQlPcap > MONEY_LIMIT || item.namKhQlPcapTso > MONEY_LIMIT || item.namKhQlPcapLuongBac > MONEY_LIMIT ||
                item.namKhQlPcapPcapLuong > MONEY_LIMIT || item.namKhQlPcapDgopLuong > MONEY_LIMIT || item.namKhQlPcapHdLd > MONEY_LIMIT || item.namKhKphiNsnn > MONEY_LIMIT || item.namKhKphiSnDvu > MONEY_LIMIT || item.namKhKphiPhiDlai > MONEY_LIMIT || item.namKhKphiHphap > MONEY_LIMIT) {
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

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        this.spinner.show();
        this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
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

    // luu thay doi
    saveEdit(id: string): void {

        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.tinhTong();
        this.updateEditCache();
    }
    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
        this.tinhTong();
    }

    deleteAllChecked() {
        const lstId: any[] = [];
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

    // xoa dong
    deleteById(id: string): void {
        // this.tongTien -= this.lstCtietBcao.find(e => e.id == id).thanhTien;
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    // click o checkbox all
    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                ...item,
                checked: false
            }));
        }
    }

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
    // them dong moi


    addLine(stt: string) {
        let index = -1;
        for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
            if (this.lstCtietBcao[i].stt == stt) {
                index = i;
                break;
            }
        }

        const tail = stt == this.lstCtietBcao[index]?.stt ? '1' : (this.getTail(this.lstCtietBcao[index]?.stt) + 1).toString();
        const item: ItemData = {
            ... new ItemData(),
            id: uuid.v4() + 'FE',
            stt: stt + '.' + tail,
            donVi: null,
            tenDmuc: null,
            dtTsoNguoiLv: null,
            dtTongQlPcap: null,
            dtQlPcapTso: null,
            dtQlPcapLuongBac: null,
            dtQlPcapPcapLuong: null,
            dtQlPcapDgopLuong: null,
            dtQlPcapHdLd: null,
            dtKphiNsnn: null,
            dtKphiSnDvu: null,
            dtKphiPhiDlai: null,
            dtKphiHphap: null,
            uocThTsoNguoiLv: null,
            uocThTsoBcTdiem: null,
            uocThTsoVcCc: null,
            uocThTongQlPcap: null,
            uocThQlPcapTso: null,
            uocThQlPcapLuongBac: null,
            uocThQlPcapPcapLuong: null,
            uocThQlPcapDgopLuong: null,
            uocThQlPcapHdLd: null,
            uocThKphiNsnn: null,
            uocThKphiSnDvu: null,
            uocThKphiPhiDlai: null,
            uocThKphiHphap: null,
            namKhTsoNguoiLv: null,
            namKhTongQlPcap: null,
            namKhQlPcapTso: null,
            namKhQlPcapLuongBac: null,
            namKhQlPcapPcapLuong: null,
            namKhQlPcapDgopLuong: null,
            namKhQlPcapHdLd: null,
            namKhKphiNsnn: null,
            namKhKphiSnDvu: null,
            namKhKphiPhiDlai: null,
            namKhKphiHphap: null,
            level: '',
            checked: false,
        }
        const str: string[] = item.stt.split('.');
        item.level = str.length - 2;
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
        this.sortByIndex();
    }


    checkAdd(data: ItemData) {
        if (data.stt.length == 3) {
            return true;
        }
        return false;
    }

    checkDelete(stt: string) {
        if (stt.length != 3) {
            return true;
        }
        return false;
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
            xau = chiSo[n];
        }
        if (n == 3) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    }

    sortByIndex() {
        this.setLevel();
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


    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
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
                donVi: data.donVi,
                tenDmuc: data.tenDmuc,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {

                }
            })
            stt = this.getHead(stt);
        }

    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    getName(level: number, ma: string) {
        const type = this.getTail(ma);
        let str = '';
        if (level == 1) {
            switch (type) {
                case 1:
                    str = (Number(this.namBaoCao) - 1).toString();
                    break;
                case 2:
                    str = this.namBaoCao.toString();
                    break;
                case 3:
                    str = this.namBaoCao.toString();
                    break;
                case 4:
                    str = (Number(this.namBaoCao) - 2).toString() + '-' + (this.namBaoCao + 2).toString();
                    break;
                default:
                    break;
            }
        }
        return str;
    }
    selectTaisan(idTaiSan: any, idRow: any) {
        // const taiSan = this.lstVatTuFull.find(ts => ts.id === idTaiSan);
        // this.editCache[idRow].data.dviTinh = taiSan.dviTinh;
    }



    tinhTong() {
        this.tongSo1 = 0;
        this.tongSo2 = 0;
        this.tongSo3 = 0;
        this.tongSo4 = 0;
        this.tongSo5 = 0;
        this.tongSo6 = 0;
        this.tongSo7 = 0;
        this.tongSo8 = 0;
        this.tongSo9 = 0;
        this.tongSo10 = 0;
        this.tongSo11 = 0;
        this.tongSo12 = 0;
        this.tongSo13 = 0;
        this.tongSo14 = 0;
        this.tongSo15 = 0;
        this.tongSo16 = 0;
        this.tongSo17 = 0;
        this.tongSo18 = 0;
        this.tongSo19 = 0;
        this.tongSo20 = 0;
        this.tongSo21 = 0;
        this.tongSo22 = 0;
        this.tongSo23 = 0;
        this.tongSo24 = 0;
        this.tongSo25 = 0;
        this.tongSo26 = 0;
        this.tongSo27 = 0;
        this.tongSo28 = 0;
        this.tongSo29 = 0;
        this.tongSo30 = 0;
        this.tongSo31 = 0;
        this.tongSo32 = 0;
        this.tongSo33 = 0;
        this.tongSo34 = 0;
        this.tongSo35 = 0;
        this.tongSo36 = 0;
        this.tongSo37 = 0;
        this.tongSo38 = 0;
        this.tongSo39 = 0;
        this.tongSo40 = 0;
        this.tongSo41 = 0;
        this.tongSo42 = 0;
        this.tongSo43 = 0;
        this.tongSo44 = 0;
        this.tongSo45 = 0;
        this.tongSo46 = 0;
        this.lstCtietBcao.forEach(item => {
            this.tongSo1 += Number(item.dtTsoNguoiLv);
            this.tongSo2 += item.dtTongQlPcap;
            this.tongSo3 += item.dtQlPcapTso;
            this.tongSo4 += item.dtQlPcapLuongBac;
            this.tongSo5 += item.dtQlPcapPcapLuong;
            this.tongSo6 += item.dtQlPcapDgopLuong;
            this.tongSo7 += item.dtQlPcapHdLd;
            this.tongSo8 += item.dtKphiNsnn;
            this.tongSo9 += item.dtKphiSnDvu;
            this.tongSo10 += item.dtKphiPhiDlai;
            this.tongSo11 += item.dtKphiHphap;
            this.tongSo12 += item.uocThTsoNguoiLv;
            this.tongSo13 += item.uocThTsoBcTdiem;
            this.tongSo14 += item.uocThTsoVcCc;
            this.tongSo15 += item.uocThTongQlPcap;
            this.tongSo16 += item.uocThQlPcapTso;
            this.tongSo17 += item.uocThQlPcapLuongBac;
            this.tongSo18 += item.uocThQlPcapPcapLuong;
            this.tongSo19 += item.uocThQlPcapDgopLuong;
            this.tongSo20 += item.uocThQlPcapHdLd;
            this.tongSo21 += item.uocThKphiNsnn;
            this.tongSo22 += item.uocThKphiSnDvu;
            this.tongSo23 += item.uocThKphiPhiDlai;
            this.tongSo24 += item.uocThKphiHphap;;
            this.tongSo25 += item.namKhTsoNguoiLv;
            this.tongSo26 += item.namKhTongQlPcap;
            this.tongSo27 += item.namKhQlPcapTso;
            this.tongSo28 += item.namKhQlPcapLuongBac;
            this.tongSo29 += item.namKhQlPcapPcapLuong;
            this.tongSo30 += item.namKhQlPcapDgopLuong;
            this.tongSo31 += item.namKhQlPcapHdLd;
            this.tongSo32 += item.namKhKphiNsnn;
            this.tongSo33 += item.namKhKphiSnDvu;
            this.tongSo34 += item.namKhKphiPhiDlai;
            this.tongSo35 += item.namKhKphiHphap;

        })
    }

    changeModel(id: string): void {

        this.editCache[id].data.dtQlPcapTso = this.editCache[id].data.dtQlPcapLuongBac + this.editCache[id].data.dtQlPcapPcapLuong + this.editCache[id].data.dtQlPcapDgopLuong;

        this.editCache[id].data.uocThQlPcapTso = this.editCache[id].data.uocThQlPcapLuongBac + this.editCache[id].data.uocThQlPcapLuongBac + this.editCache[id].data.uocThQlPcapDgopLuong;

        this.editCache[id].data.namKhQlPcapTso = this.editCache[id].data.namKhQlPcapLuongBac + this.editCache[id].data.namKhQlPcapPcapLuong + this.editCache[id].data.namKhQlPcapDgopLuong;

        this.editCache[id].data.dtTongQlPcap = this.editCache[id].data.dtQlPcapTso + this.editCache[id].data.dtQlPcapHdLd;
        this.editCache[id].data.uocThTongQlPcap = this.editCache[id].data.uocThQlPcapTso + this.editCache[id].data.uocThQlPcapHdLd;
        this.editCache[id].data.namKhTongQlPcap = this.editCache[id].data.namKhQlPcapTso + this.editCache[id].data.namKhQlPcapHdLd;

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



    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
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

}
