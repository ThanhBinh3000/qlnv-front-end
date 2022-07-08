import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney, Utils } from "../../../../../Utility/utils";
import { NOI_DUNG } from './tong-hop-nhu-cau-chi-nsnn-3-nam.constant';

export class ItemData {
    id!: string;
    stt!: string;
    level: number;
    maNdung!: number;
    namHienHanhDtoan!: number;
    namHienHanhUocThien!: number;
    tranChiN!: number;
    ncauChiN!: number;
    clechTranChiVsNcauChiN: number;
    ssanhNcauNVoiN1: number;
    tranChiN1!: number;
    ncauChiN1!: number;
    clechTranChiVsNcauChiN1: number;
    tranChiN2!: number;
    ncauChiN2!: number;
    clechTranChiVsNcauChiN2: number;
    checked!: boolean;
}

@Component({
    selector: 'app-tong-hop-nhu-cau-chi-nsnn-3-nam',
    templateUrl: './tong-hop-nhu-cau-chi-nsnn-3-nam.component.html',
    styleUrls: ['../bao-cao/bao-cao.component.scss']
})
export class TongHopNhuCauChiNsnn3NamComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donVis: any = [];
    noiDungs: any[] = NOI_DUNG;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    //thong tin chung
    id: string;
    trangThaiPhuLuc: string;
    namHienHanh: number;
    maBieuMau = "13";
    thuyetMinh: string;
    maDviTien: string;
    listIdDelete = "";
    initItem: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        maNdung: 0,
        namHienHanhDtoan: 0,
        namHienHanhUocThien: 0,
        tranChiN: 0,
        ncauChiN: 0,
        clechTranChiVsNcauChiN: 0,
        ssanhNcauNVoiN1: 0,
        tranChiN1: 0,
        ncauChiN1: 0,
        clechTranChiVsNcauChiN1: 0,
        tranChiN2: 0,
        ncauChiN2: 0,
        clechTranChiVsNcauChiN2: 0,
        checked: false,
    }
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;

    allChecked = false;                         // check all checkbox
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
        this.spinner.show();
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
                namHienHanhDtoan: divMoney(item.namHienHanhDtoan, this.maDviTien),
                namHienHanhUocThien: divMoney(item.namHienHanhUocThien, this.maDviTien),
                tranChiN: divMoney(item.tranChiN, this.maDviTien),
                ncauChiN: divMoney(item.ncauChiN, this.maDviTien),
                clechTranChiVsNcauChiN: divMoney(item.clechTranChiVsNcauChiN, this.maDviTien),
                tranChiN1: divMoney(item.tranChiN1, this.maDviTien),
                ncauChiN1: divMoney(item.ncauChiN1, this.maDviTien),
                clechTranChiVsNcauChiN1: divMoney(item.clechTranChiVsNcauChiN1, this.maDviTien),
                tranChiN2: divMoney(item.tranChiN2, this.maDviTien),
                ncauChiN2: divMoney(item.ncauChiN2, this.maDviTien),
                clechTranChiVsNcauChiN2: divMoney(item.clechTranChiVsNcauChiN2, this.maDviTien),
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

        // //lay danh sach danh muc don vi
        // await this.danhMucService.dMDonVi().toPromise().then(
        //     (data) => {
        //         if (data.statusCode == 0) {
        //             this.donVis = data.data;
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        //     }
        // );
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
        const data1: ItemData = this.lstCtietBcao.find(e => e.maNdung == 100);
        const data2: ItemData = this.lstCtietBcao.find(e => e.maNdung == 200);
        const data3: ItemData = this.lstCtietBcao.find(e => e.maNdung == 300);
        if ((data2 ||data3) && !data1){
            this.notification.warning(MESSAGE.WARNING, "Yêu cầu có trường TỔNG NHU CẦU CHI");
            return;
        }
        if (data2 && !data3){
            this.notification.warning(MESSAGE.WARNING, "Yêu cầu có trường NHU CẦU CÒN LẠI");
            return;
        }
        if (data1 && data2 && data3) {
            if (data1.namHienHanhDtoan - data2.namHienHanhDtoan != data3.namHienHanhDtoan ||
                data1.namHienHanhUocThien - data2.namHienHanhUocThien != data3.namHienHanhUocThien ||
                // data1.tranChiN - data2.tranChiN != data3.tranChiN ||
                data1.ncauChiN - data2.ncauChiN != data3.ncauChiN ||
                // data1.tranChiN1 - data2.tranChiN1 != data3.tranChiN1 ||
                data1.ncauChiN1 - data2.ncauChiN1 != data3.ncauChiN1 ||
                // data1.tranChiN2 - data2.tranChiN2 != data3.tranChiN2 ||
                data1.ncauChiN2 - data2.ncauChiN2 != data3.ncauChiN2) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.ERROR_DATA +
                    this.getChiMuc(data3.stt) + ' = ' + this.getChiMuc(data1.stt) + ' - ' + this.getChiMuc(data2.stt));
                return;
            }
        }
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
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            const namHienHanhDtoan = mulMoney(item.namHienHanhDtoan, this.maDviTien);
            const namHienHanhUocThien = mulMoney(item.namHienHanhUocThien, this.maDviTien);
            const tranChiN = mulMoney(item.tranChiN, this.maDviTien);
            const ncauChiN = mulMoney(item.ncauChiN, this.maDviTien);
            const clechTranChiVsNcauChiN = mulMoney(item.clechTranChiVsNcauChiN, this.maDviTien);
            const tranChiN1 = mulMoney(item.tranChiN1, this.maDviTien);
            const ncauChiN1 = mulMoney(item.ncauChiN1, this.maDviTien);
            const clechTranChiVsNcauChiN1 = mulMoney(item.clechTranChiVsNcauChiN1, this.maDviTien);
            const tranChiN2 = mulMoney(item.tranChiN2, this.maDviTien);
            const ncauChiN2 = mulMoney(item.ncauChiN2, this.maDviTien);
            const clechTranChiVsNcauChiN2 = mulMoney(item.clechTranChiVsNcauChiN2, this.maDviTien);
            if (namHienHanhDtoan > MONEY_LIMIT || namHienHanhUocThien > MONEY_LIMIT ||
                tranChiN > MONEY_LIMIT || ncauChiN > MONEY_LIMIT || clechTranChiVsNcauChiN > MONEY_LIMIT ||
                tranChiN1 > MONEY_LIMIT || ncauChiN1 > MONEY_LIMIT || clechTranChiVsNcauChiN1 > MONEY_LIMIT ||
                tranChiN2 > MONEY_LIMIT || ncauChiN2 > MONEY_LIMIT || clechTranChiVsNcauChiN2 > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                namHienHanhDtoan: namHienHanhDtoan,
                namHienHanhUocThien: namHienHanhUocThien,
                tranChiN: tranChiN,
                ncauChiN: ncauChiN,
                clechTranChiVsNcauChiN: clechTranChiVsNcauChiN,
                tranChiN1: tranChiN1,
                ncauChiN1: ncauChiN1,
                clechTranChiVsNcauChiN1: clechTranChiVsNcauChiN1,
                tranChiN2: tranChiN2,
                ncauChiN2: ncauChiN2,
                clechTranChiVsNcauChiN2: clechTranChiVsNcauChiN2,
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
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0){
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
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "";
        }
        // if (n == 5) {
        //     xau = "-";
        // }
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
        if ((!this.editCache[id].data.namHienHanhDtoan && this.editCache[id].data.namHienHanhDtoan !== 0) ||
            (!this.editCache[id].data.namHienHanhUocThien && this.editCache[id].data.namHienHanhUocThien !== 0) ||
            (!this.editCache[id].data.ncauChiN && this.editCache[id].data.ncauChiN !== 0) ||
            (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
            return;
        }
        if (this.editCache[id].data.namHienHanhDtoan < 0 ||
            this.editCache[id].data.namHienHanhUocThien < 0 ||
            this.editCache[id].data.tranChiN < 0 ||
            this.editCache[id].data.ncauChiN < 0 ||
            this.editCache[id].data.tranChiN1 < 0 ||
            this.editCache[id].data.ncauChiN1 < 0 ||
            this.editCache[id].data.tranChiN2 < 0 ||
            this.editCache[id].data.ncauChiN2 < 0) {
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
        if (initItem?.id) {
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
                maNdung: data.maNdung,
                checked: data.checked,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].namHienHanhDtoan += item.namHienHanhDtoan;
                    this.lstCtietBcao[index].namHienHanhUocThien += item.namHienHanhUocThien;
                    this.lstCtietBcao[index].tranChiN += item.tranChiN;
                    this.lstCtietBcao[index].ncauChiN += item.ncauChiN;
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN += item.clechTranChiVsNcauChiN;
                    this.lstCtietBcao[index].tranChiN1 += item.tranChiN1;
                    this.lstCtietBcao[index].ncauChiN1 += item.ncauChiN1;
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN1 += item.clechTranChiVsNcauChiN1;
                    this.lstCtietBcao[index].tranChiN2 += item.tranChiN2;
                    this.lstCtietBcao[index].ncauChiN2 += item.ncauChiN2;
                    this.lstCtietBcao[index].clechTranChiVsNcauChiN2 += item.clechTranChiVsNcauChiN2;
                    if (!this.lstCtietBcao[index].namHienHanhUocThien) {
                        this.lstCtietBcao[index].ssanhNcauNVoiN1 = 0;
                    } else {
                        this.lstCtietBcao[index].ssanhNcauNVoiN1 = Number((this.lstCtietBcao[index].tranChiN / this.lstCtietBcao[index].namHienHanhUocThien).toFixed(Utils.ROUND));
                    }
                }
            })
            stt = this.getHead(stt);
        }
    }

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN = Number(this.editCache[id].data.tranChiN) - Number(this.editCache[id].data.ncauChiN);
        if (!this.editCache[id].data.namHienHanhUocThien) {
            this.editCache[id].data.ssanhNcauNVoiN1 = 0;
        } else {
            this.editCache[id].data.ssanhNcauNVoiN1 = Number((this.editCache[id].data.ncauChiN / this.editCache[id].data.namHienHanhUocThien).toFixed(Utils.ROUND));
        }
        this.editCache[id].data.clechTranChiVsNcauChiN1 = Number(this.editCache[id].data.tranChiN1) - Number(this.editCache[id].data.ncauChiN1);
        this.editCache[id].data.clechTranChiVsNcauChiN2 = Number(this.editCache[id].data.tranChiN2) - Number(this.editCache[id].data.ncauChiN2);
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
}
