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
import { DialogThemKhoanMucComponent } from '../../dialog-them-khoan-muc/dialog-them-khoan-muc.component';

export class ItemData {
    id: any;
    khVpLapTdinhCtietId: string;
    matHang: string;
    tenMatHang: string;
    dvTinh: string;
    thucHienNamTruoc: number;
    dtoanNamHtai: number;
    uocThNamHtai: number;
    dmucNamDtoan: number;
    sluongNamDtoan: number;
    ttienNamDtoan: number;
    sluongNamN1Td: number;
    ttienNamN1Td: number;
    sluongGiaoDtoan: number;
    ttienGiaoDtoan: number;
    sluongDchinhDtoan: number;
    ttienDchinhDtoan: number;
    stt: string;
    level: any;
    checked: boolean;
}

@Component({
    selector: 'app-phu-luc-03',
    templateUrl: './phu-luc-03.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class PhuLuc03Component implements OnInit {
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
    listVattu: any[] = [];
    lstVatTuFull = [];
    isDataAvailable = false;
    dsDinhMuc: any[] = [];
    maDviTao: any;
    soLaMa: any[] = LA_MA;
    allChecked = false;

    tongSoTHNT: number;
    tongSoDT: number;
    tongSoUTH: number;
    tongSoTT: number;
    tongSoTd: number;
    checkViewTD: boolean;
    checkEditTD: boolean;

    namBaoCao: number;

    initItem: ItemData = {


        id: null,
        khVpLapTdinhCtietId: '',
        matHang: '',
        tenMatHang: '',
        dvTinh: '',
        thucHienNamTruoc: null,
        dtoanNamHtai: null,
        uocThNamHtai: null,
        dmucNamDtoan: null,
        sluongNamDtoan: null,
        ttienNamDtoan: null,
        sluongNamN1Td: null,
        ttienNamN1Td: null,
        sluongGiaoDtoan: null,
        ttienGiaoDtoan: null,
        sluongDchinhDtoan: null,
        ttienDchinhDtoan: null,
        stt: '0',
        level: null,
        checked: false,
    };
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
        this.thuyetMinh = this.formDetail?.thuyetMinh;
        this.status = this.dataInfo?.status;
        this.namBaoCao = this.dataInfo?.namBcao;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.checkEditTD = this.dataInfo?.editAppraisalValue;
        this.checkViewTD = this.dataInfo?.viewAppraisalValue;
        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })
        await this.getDinhMuc();
        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVattu = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })

        await this.addVatTu();
        this.sortByIndex();
        // this.getTotal();
        this.updateEditCache();
        this.tinhTong();
        this.getStatusButton();
        console.log(this.lstCtietBcao);
        this.spinner.hide();
    }

    async getDinhMuc() {
        const request = {
            loaiDinhMuc: '03',
            maDvi: this.maDviTao,
        }
        this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMuc = res.data;
                    this.dsDinhMuc.forEach(item => {
                        if (!item.loaiVthh.startsWith('02')) {
                            item.tongDmuc = divNumber(item.tongDmuc, 1000);
                        }
                    })
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )

    }


    async addVatTu() {

        const vatTuTemp = []
        this.listVattu.forEach(vatTu => {
            if (vatTu.child) {
                vatTu.child.forEach(vatTuCon => {
                    vatTuTemp.push({
                        id: vatTuCon.ma,
                        tenDm: vatTuCon.ten,
                        matHang: vatTuCon.ma,
                        dvTinh: vatTuCon.dviTinh,
                        maCha: "0",
                        level: 0,
                    })
                })
            }
        })

        this.lstVatTuFull = vatTuTemp;
        this.dsDinhMuc.forEach(itmDm => {
            this.lstVatTuFull.push({
                id: itmDm.id,
                tenDm: itmDm.tenDinhMuc,
                matHang: itmDm.id,
                dvTinh: itmDm.donViTinh,
                maCha: itmDm.cloaiVthh,
                level: 1,
            })
        })

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


    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        if (n == 0) {
            xau = chiSo[n];
        }
        if (n == 1) {
            xau = "-";
        }
        return xau;
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
            if (item.ttienNamDtoan > MONEY_LIMIT) {
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
        // this.sum(this.lstCtietBcao[index].stt);
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

    deleteLine(id: any) {
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
        this.tinhTong();
        this.updateEditCache();
    }
    // them dong moi
    addLine(id: number): void {
        const loaiMatHang: any = this.lstCtietBcao.find(e => e.id == id)?.matHang;
        const obj = {
            maKhoanMuc: loaiMatHang,
            lstKhoanMuc: this.lstVatTuFull,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách mặt hàng',
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
                const index: number = this.lstCtietBcao.findIndex(e => e.matHang == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = {
                        ...this.initItem,
                        matHang: res.maKhoanMuc,
                        level: this.lstVatTuFull.find(e => e.id == loaiMatHang)?.level,
                        dvTinh: this.lstVatTuFull.find(e => e.id == loaiMatHang)?.dvTinh,
                        tenMatHang: this.lstVatTuFull.find(e => e.id == loaiMatHang)?.tenDm
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.matHang == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.matHang == item.id) == -1) {
                        const data: ItemData = {
                            ...this.initItem,
                            matHang: item.id,
                            level: item.level,
                            dvTinh: item.dvTinh,
                        };
                        this.addLow(id, data);
                    }
                })
                this.genderDinhMuc();
                this.updateEditCache();
            }
        });
    }

    genderDinhMuc() {
        this.lstCtietBcao.forEach(item => {

            this.dsDinhMuc.forEach(itemDm => {

                if (item.matHang == itemDm.id) {
                    item.dmucNamDtoan = itemDm.tongDmuc

                }
            })
            const tenDanhMuc = this.lstVatTuFull.find(itm => itm.id == item.matHang).tenDm;
            item.tenMatHang = tenDanhMuc;
        })
    }
    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(initItem: ItemData) {
        let dm = 0;
        this.dsDinhMuc.forEach(itm => {
            if (itm.loaiVthh == initItem.matHang) {
                dm = itm.tongDmuc;
            }
        })
        if (initItem?.id) {
            const item: ItemData = {
                ...initItem,
                stt: "0.1",
                dmucNamDtoan: dm != 0 ? dm : null,
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
                dmucNamDtoan: dm != 0 ? dm : null,
            }
            this.lstCtietBcao.push(item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };

        }
    }

    //thêm ngang cấp
    addSame(id: any, initItem: ItemData) {
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
        let dm = 0;
        this.dsDinhMuc.forEach(itm => {
            if (itm.loaiVthh == initItem.matHang) {
                dm = itm.tongDmuc;
            }
        })
        // them moi phan tu
        if (initItem?.id) {
            const item: ItemData = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
                dmucNamDtoan: dm != 0 ? dm : null,
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
                dmucNamDtoan: dm,
            }
            this.lstCtietBcao.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }


    //thêm cấp thấp hơn
    addLow(id: any, initItem: ItemData) {
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

        let dm = 0;
        this.dsDinhMuc.forEach(itm => {
            if (itm.loaiVthh == initItem.matHang) {
                dm = itm.tongDmuc;
            }
        })

        // them moi phan tu
        if (initItem?.id) {
            const item: ItemData = {
                ...initItem,
                stt: stt,
                dmucNamDtoan: dm != 0 ? dm : null,
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
                dmucNamDtoan: dm != 0 ? dm : null,
            }
            this.lstCtietBcao.splice(index + 1, 0, item);

            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }

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
                tenMatHang: data.tenMatHang,
                level: data.level,
                matHang: data.matHang,
            }
            for (let index = 1; index < this.lstCtietBcao.length; index++) {

                this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, this.lstCtietBcao[index].ttienNamDtoan]);
                this.lstCtietBcao[index].ttienNamN1Td = sumNumber([this.lstCtietBcao[index].ttienNamN1Td, this.lstCtietBcao[index].ttienNamN1Td]);
            }
            // this.lstCtietBcao.forEach(item => {
            //     if (this.getHead(item.stt) == stt && stt.length != 3) {
            //         this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, item.ttienNamDtoan]);
            //         this.lstCtietBcao[index].ttienNamN1Td = sumNumber([this.lstCtietBcao[index].ttienNamN1Td, item.ttienNamN1Td]);
            //     }
            // })
            stt = this.getHead(stt);
        }
        // this.getTotal();
    }
    tinhTong() {
        if (this.lstCtietBcao.length != 0) {
            this.tongSoTHNT = 0;
            this.tongSoDT = 0;
            this.tongSoUTH = 0;
            this.tongSoTT = 0;
            this.tongSoTd = 0;
            for (let index = 1; index < this.lstCtietBcao.length; index++) {
                this.tongSoTHNT += this.lstCtietBcao[index].thucHienNamTruoc;
                this.tongSoDT += this.lstCtietBcao[index].dtoanNamHtai;
                this.tongSoTT += this.lstCtietBcao[index].ttienNamDtoan;
                this.tongSoUTH += this.lstCtietBcao[index].uocThNamHtai;
                this.tongSoTd += this.lstCtietBcao[index].ttienNamN1Td;
            }

        } else {
            this.tongSoTHNT = null;
            this.tongSoDT = null;
            this.tongSoUTH = null;
            this.tongSoTT = null;
            this.tongSoTd = null;
        }


    }

    changeModel(id: string): void {
        this.editCache[id].data.ttienNamDtoan = mulNumber(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongNamDtoan);
        this.editCache[id].data.ttienNamN1Td = mulNumber(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongNamN1Td);

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