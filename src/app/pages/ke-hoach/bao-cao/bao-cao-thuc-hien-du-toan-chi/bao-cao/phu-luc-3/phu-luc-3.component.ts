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
import { addChild, addHead, addParent, deleteRow, displayNumber, exchangeMoney, getHead, percent, sortByIndex, sortWithoutIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DIADIEM } from '../bao-cao.constant';


export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maDan: string;
    tenDan: string;
    ddiemXdung: number;
    qddtSoQdinh: string;
    qddtTmdtTso: number;
    qddtTmdtNsnn: number;
    luyKeVonTso: number;
    luyKeVonNsnn: number;
    luyKeVonDt: number;
    luyKeVonThue: number;
    luyKeVonScl: number;
    luyKeGiaiNganHetNamTso: number;
    luyKeGiaiNganHetNamNsnnTso: number;
    luyKeGiaiNganHetNamNsnnKhNamTruoc: number;
    khoachVonNamTruocKeoDaiTso: number;
    khoachVonNamTruocKeoDaiDtpt: number;
    khoachVonNamTruocKeoDaiVonKhac: number;
    khoachNamVonTso: number;
    khoachNamVonNsnn: number;
    khoachNamVonDt: number;
    khoachNamVonThue: number;
    khoachNamVonScl: number;
    kluongThienTso: number;
    kluongThienThangBcao: number;
    giaiNganTso: number;
    giaiNganTsoTle: number;
    giaiNganNsnn: number;
    giaiNganNsnnVonDt: number;
    giaiNganNsnnVonThue: number;
    giaiNganNsnnVonScl: number;
    giaiNganNsnnTle: number;
    giaiNganNsnnTleVonDt: number;
    giaiNganNsnnTleVonThue: number;
    giaiNganNsnnTleVonScl: number;
    luyKeGiaiNganDauNamTso: number;
    luyKeGiaiNganDauNamTsoTle: number;
    luyKeGiaiNganDauNamNsnn: number;
    luyKeGiaiNganDauNamNsnnVonDt: number;
    luyKeGiaiNganDauNamNsnnVonThue: number;
    luyKeGiaiNganDauNamNsnnVonScl: number;
    luyKeGiaiNganDauNamNsnnTle: number;
    luyKeGiaiNganDauNamNsnnTleVonDt: number;
    luyKeGiaiNganDauNamNsnnTleVonThue: number;
    luyKeGiaiNganDauNamNsnnTleVonScl: number;
    ndungCviecHthanhCuoiThang: number;
    ndungCviecDangThien: number;
    khoachThienNdungCviecThangConLaiNam: number;
    ghiChu: string;
}

@Component({
    selector: 'app-phu-luc-3',
    templateUrl: './phu-luc-3.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIIIComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    maDans: any[] = [];
    ddiemXdungs: any[] = DIADIEM;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    luyKeDetail: any[] = [];
    maLoaiBcao: string;

    //thong tin chung
    id: string;
    idBcao: string;
    namHienHanh: number;
    maPhuLuc: string;
    thuyetMinh: string;
    maDviTien: string;
    listIdDelete = "";
    trangThaiPhuLuc = '1';
    initItem: ItemData = new ItemData();
    total: ItemData = new ItemData();
    scrollX = (500 + 41 * BOX_NUMBER_WIDTH + 1000).toString() + 'px';
    amount = AMOUNT;
    quatity = QUATITY;
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
        private danhMucService: DanhMucDungChungService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL3');
        if (category) {
            category.data.forEach(
                item => {
                    this.maDans.push({
                        ...item,
                        level: item.ma?.split('.').length - 2,
                    })
                }
            )
        }

        this.id = this.data?.id;
        this.idBcao = this.data?.idBcao;
        this.maPhuLuc = this.data?.maPhuLuc;
        this.maLoaiBcao = this.data?.maLoaiBcao;
        this.maDviTien = this.data?.maDviTien ? this.data?.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.namHienHanh = this.data?.namHienHanh;
        this.luyKeDetail = this.data?.luyKeDetail?.lstCtietBcaos;
        this.status = this.data?.status;
        this.statusEdit = !this.status && this.maLoaiBcao != '527';
        if (this.startEdit) {
            this.scrollX = (500 + 41 * BOX_NUMBER_WIDTH + 800).toString() + 'px';
        }
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                level: this.maDans.find(e => e.id == item.maDan)?.level,
                giaiNganTsoTle: percent(item.giaiNganTso, item.khoachNamVonTso),
                giaiNganNsnnTle: percent(item.giaiNganNsnn, item.khoachNamVonNsnn),
                giaiNganNsnnTleVonDt: percent(item.giaiNganNsnnVonDt, item.khoachNamVonDt),
                giaiNganNsnnTleVonThue: percent(item.giaiNganNsnnVonThue, item.khoachNamVonThue),
                giaiNganNsnnTleVonScl: percent(item.giaiNganNsnnVonScl, item.khoachNamVonScl),
                luyKeGiaiNganDauNamTsoTle: percent(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso),
                luyKeGiaiNganDauNamNsnnTle: percent(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn),
                luyKeGiaiNganDauNamNsnnTleVonDt: percent(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt),
                luyKeGiaiNganDauNamNsnnTleVonThue: percent(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue),
                luyKeGiaiNganDauNamNsnnTleVonScl: percent(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl),
                checked: false,
            })
        })

        if (this.lstCtietBcao.length == 0) {
            this.luyKeDetail.forEach(item => {
                this.lstCtietBcao.push({
                    ...item,
                    luyKeGiaiNganDauNamTsoTle: percent(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso),
                    luyKeGiaiNganDauNamNsnnTle: percent(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn),
                    luyKeGiaiNganDauNamNsnnTleVonDt: percent(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt),
                    luyKeGiaiNganDauNamNsnnTleVonThue: percent(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue),
                    luyKeGiaiNganDauNamNsnnTleVonScl: percent(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl),
                    checked: false,
                    id: uuid.v4() + 'FE',
                })
            })
        }

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maDan');
            } else {
                this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
            }
        }

        this.lstCtietBcao.forEach(item => {
            item.tenDan = this.maDans.find(e => e.ma == item.maDan)?.giaTri;
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
            if (item.qddtTmdtTso > MONEY_LIMIT || item.qddtTmdtNsnn > MONEY_LIMIT || item.luyKeVonTso > MONEY_LIMIT ||
                item.luyKeGiaiNganHetNamTso > MONEY_LIMIT || item.luyKeGiaiNganHetNamNsnnTso > MONEY_LIMIT ||
                item.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEY_LIMIT || item.khoachVonNamTruocKeoDaiTso > MONEY_LIMIT || item.khoachVonNamTruocKeoDaiDtpt > MONEY_LIMIT ||
                item.khoachVonNamTruocKeoDaiVonKhac > MONEY_LIMIT || item.khoachNamVonTso > MONEY_LIMIT ||
                item.giaiNganTso > MONEY_LIMIT || item.luyKeGiaiNganDauNamTso > MONEY_LIMIT ||
                item.kluongThienTso > MONEY_LIMIT || item.kluongThienThangBcao > MONEY_LIMIT) {
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
            xau = String.fromCharCode(k + 96).toUpperCase();
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
        if (!data.maDan) {
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
        if (!this.editCache[id].data.maDan) {
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
        const maDan: string = this.lstCtietBcao.find(e => e.id == id)?.maDan;
        const obj = {
            ma: maDan,
            lstDanhMuc: this.maDans,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách dự án',
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maDan == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...new ItemData(),
                        maDan: res.ma,
                        level: this.maDans.find(e => e.ma == res.ma)?.level,
                        tenDan: this.maDans.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.lstCtietBcao = addHead(data, this.lstCtietBcao);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maDan == res.ma)?.id;
                res.lstDanhMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maDan == item.ma) == -1) {
                        const data: ItemData = {
                            ...new ItemData(),
                            maDan: item.ma,
                            level: item.level,
                            tenDan: item.giaTri,
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
        return this.luyKeDetail.findIndex(e => e.maDan == data.maDan) != -1;
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
                maDan: data.maDan,
                ddiemXdung: data.ddiemXdung, // pl 3
                qddtSoQdinh: data.qddtSoQdinh,
                ghiChu: data.ghiChu, // pl 3
                khoachThienNdungCviecThangConLaiNam: data.khoachThienNdungCviecThangConLaiNam, // pl 3
                ndungCviecDangThien: data.ndungCviecDangThien, // pl 3
                ndungCviecHthanhCuoiThang: data.ndungCviecHthanhCuoiThang, // pl 3
                tenDan: data.tenDan,
            }
            this.lstCtietBcao.forEach(item => {
                if (getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].qddtTmdtTso = sumNumber([this.lstCtietBcao[index].qddtTmdtTso, item.qddtTmdtTso]);
                    this.lstCtietBcao[index].qddtTmdtNsnn = sumNumber([this.lstCtietBcao[index].qddtTmdtNsnn, item.qddtTmdtNsnn]);
                    this.lstCtietBcao[index].luyKeVonTso = sumNumber([this.lstCtietBcao[index].luyKeVonTso, item.luyKeVonTso]);
                    this.lstCtietBcao[index].luyKeVonNsnn = sumNumber([this.lstCtietBcao[index].luyKeVonNsnn, item.luyKeVonNsnn]);
                    this.lstCtietBcao[index].luyKeVonDt = sumNumber([this.lstCtietBcao[index].luyKeVonDt, item.luyKeVonDt]);
                    this.lstCtietBcao[index].luyKeVonThue = sumNumber([this.lstCtietBcao[index].luyKeVonThue, item.luyKeVonThue]);
                    this.lstCtietBcao[index].luyKeVonScl = sumNumber([this.lstCtietBcao[index].luyKeVonScl, item.luyKeVonScl]);
                    this.lstCtietBcao[index].luyKeGiaiNganHetNamTso = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganHetNamTso, item.luyKeGiaiNganHetNamTso]);
                    this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnTso = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnTso, item.luyKeGiaiNganHetNamNsnnTso]);
                    this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnKhNamTruoc = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganHetNamNsnnKhNamTruoc, item.luyKeGiaiNganHetNamNsnnKhNamTruoc]);
                    this.lstCtietBcao[index].khoachVonNamTruocKeoDaiTso = sumNumber([this.lstCtietBcao[index].khoachVonNamTruocKeoDaiTso, item.khoachVonNamTruocKeoDaiTso]);
                    this.lstCtietBcao[index].khoachVonNamTruocKeoDaiDtpt = sumNumber([this.lstCtietBcao[index].khoachVonNamTruocKeoDaiDtpt, item.khoachVonNamTruocKeoDaiDtpt]);
                    this.lstCtietBcao[index].khoachVonNamTruocKeoDaiVonKhac = sumNumber([this.lstCtietBcao[index].khoachVonNamTruocKeoDaiVonKhac, item.khoachVonNamTruocKeoDaiVonKhac]);
                    this.lstCtietBcao[index].khoachNamVonTso = sumNumber([this.lstCtietBcao[index].khoachNamVonTso, item.khoachNamVonTso]);
                    this.lstCtietBcao[index].khoachNamVonNsnn = sumNumber([this.lstCtietBcao[index].khoachNamVonNsnn, item.khoachNamVonNsnn]);
                    this.lstCtietBcao[index].khoachNamVonDt = sumNumber([this.lstCtietBcao[index].khoachNamVonDt, item.khoachNamVonDt]);
                    this.lstCtietBcao[index].khoachNamVonThue = sumNumber([this.lstCtietBcao[index].khoachNamVonThue, item.khoachNamVonThue]);
                    this.lstCtietBcao[index].khoachNamVonScl = sumNumber([this.lstCtietBcao[index].khoachNamVonScl, item.khoachNamVonScl]);
                    this.lstCtietBcao[index].kluongThienTso = sumNumber([this.lstCtietBcao[index].kluongThienTso, item.kluongThienTso]);
                    this.lstCtietBcao[index].kluongThienThangBcao = sumNumber([this.lstCtietBcao[index].kluongThienThangBcao, item.kluongThienThangBcao]);
                    this.lstCtietBcao[index].giaiNganTso = sumNumber([this.lstCtietBcao[index].giaiNganTso, item.giaiNganTso]);
                    this.lstCtietBcao[index].giaiNganNsnn = sumNumber([this.lstCtietBcao[index].giaiNganNsnn, item.giaiNganNsnn]);
                    this.lstCtietBcao[index].giaiNganNsnnVonDt = sumNumber([this.lstCtietBcao[index].giaiNganNsnnVonDt, item.giaiNganNsnnVonDt]);
                    this.lstCtietBcao[index].giaiNganNsnnVonThue = sumNumber([this.lstCtietBcao[index].giaiNganNsnnVonThue, item.giaiNganNsnnVonThue]);
                    this.lstCtietBcao[index].giaiNganNsnnVonScl = sumNumber([this.lstCtietBcao[index].giaiNganNsnnVonScl, item.giaiNganNsnnVonScl]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamTso = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamTso, item.luyKeGiaiNganDauNamTso]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn, item.luyKeGiaiNganDauNamNsnn]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt, item.luyKeGiaiNganDauNamNsnnVonDt]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue, item.luyKeGiaiNganDauNamNsnnVonThue]);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl = sumNumber([this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl, item.luyKeGiaiNganDauNamNsnnVonScl]);

                    this.lstCtietBcao[index].giaiNganTsoTle = percent(this.lstCtietBcao[index].giaiNganTso, this.lstCtietBcao[index].khoachNamVonTso);
                    this.lstCtietBcao[index].giaiNganNsnnTle = percent(this.lstCtietBcao[index].giaiNganNsnn, this.lstCtietBcao[index].khoachNamVonNsnn);
                    this.lstCtietBcao[index].giaiNganNsnnTleVonDt = percent(this.lstCtietBcao[index].giaiNganNsnnVonDt, this.lstCtietBcao[index].khoachNamVonDt);
                    this.lstCtietBcao[index].giaiNganNsnnTleVonThue = percent(this.lstCtietBcao[index].giaiNganNsnnVonThue, this.lstCtietBcao[index].khoachNamVonThue);
                    this.lstCtietBcao[index].giaiNganNsnnTleVonScl = percent(this.lstCtietBcao[index].giaiNganNsnnVonScl, this.lstCtietBcao[index].khoachNamVonScl);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamTsoTle = percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamTso, this.lstCtietBcao[index].khoachNamVonTso);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTle = percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn, this.lstCtietBcao[index].khoachNamVonNsnn);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonDt = percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt, this.lstCtietBcao[index].khoachNamVonDt);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonThue = percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue, this.lstCtietBcao[index].khoachNamVonThue);
                    this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonScl = percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl, this.lstCtietBcao[index].khoachNamVonScl);
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
                this.total.qddtTmdtTso = sumNumber([this.total.qddtTmdtTso, item.qddtTmdtTso]);
                this.total.qddtTmdtNsnn = sumNumber([this.total.qddtTmdtNsnn, item.qddtTmdtNsnn]);
                this.total.luyKeVonTso = sumNumber([this.total.luyKeVonTso, item.luyKeVonTso]);
                this.total.luyKeVonNsnn = sumNumber([this.total.luyKeVonNsnn, item.luyKeVonNsnn]);
                this.total.luyKeVonDt = sumNumber([this.total.luyKeVonDt, item.luyKeVonDt]);
                this.total.luyKeVonThue = sumNumber([this.total.luyKeVonThue, item.luyKeVonThue]);
                this.total.luyKeVonScl = sumNumber([this.total.luyKeVonScl, item.luyKeVonScl]);
                this.total.luyKeGiaiNganHetNamTso = sumNumber([this.total.luyKeGiaiNganHetNamTso, item.luyKeGiaiNganHetNamTso]);
                this.total.luyKeGiaiNganHetNamNsnnTso = sumNumber([this.total.luyKeGiaiNganHetNamNsnnTso, item.luyKeGiaiNganHetNamNsnnTso]);
                this.total.luyKeGiaiNganHetNamNsnnKhNamTruoc = sumNumber([this.total.luyKeGiaiNganHetNamNsnnKhNamTruoc, item.luyKeGiaiNganHetNamNsnnKhNamTruoc]);
                this.total.khoachVonNamTruocKeoDaiTso = sumNumber([this.total.khoachVonNamTruocKeoDaiTso, item.khoachVonNamTruocKeoDaiTso]);
                this.total.khoachVonNamTruocKeoDaiDtpt = sumNumber([this.total.khoachVonNamTruocKeoDaiDtpt, item.khoachVonNamTruocKeoDaiDtpt]);
                this.total.khoachVonNamTruocKeoDaiVonKhac = sumNumber([this.total.khoachVonNamTruocKeoDaiVonKhac, item.khoachVonNamTruocKeoDaiVonKhac]);
                this.total.khoachNamVonTso = sumNumber([this.total.khoachNamVonTso, item.khoachNamVonTso]);
                this.total.khoachNamVonNsnn = sumNumber([this.total.khoachNamVonNsnn, item.khoachNamVonNsnn]);
                this.total.khoachNamVonDt = sumNumber([this.total.khoachNamVonDt, item.khoachNamVonDt]);
                this.total.khoachNamVonThue = sumNumber([this.total.khoachNamVonThue, item.khoachNamVonThue]);
                this.total.khoachNamVonScl = sumNumber([this.total.khoachNamVonScl, item.khoachNamVonScl]);
                this.total.kluongThienTso = sumNumber([this.total.kluongThienTso, item.kluongThienTso]);
                this.total.kluongThienThangBcao = sumNumber([this.total.kluongThienThangBcao, item.kluongThienThangBcao]);
                this.total.giaiNganTso = sumNumber([this.total.giaiNganTso, item.giaiNganTso]);
                this.total.giaiNganNsnn = sumNumber([this.total.giaiNganNsnn, item.giaiNganNsnn]);
                this.total.giaiNganNsnnVonDt = sumNumber([this.total.giaiNganNsnnVonDt, item.giaiNganNsnnVonDt]);
                this.total.giaiNganNsnnVonThue = sumNumber([this.total.giaiNganNsnnVonThue, item.giaiNganNsnnVonThue]);
                this.total.giaiNganNsnnVonScl = sumNumber([this.total.giaiNganNsnnVonScl, item.giaiNganNsnnVonScl]);
                this.total.luyKeGiaiNganDauNamTso = sumNumber([this.total.luyKeGiaiNganDauNamTso, item.luyKeGiaiNganDauNamTso]);
                this.total.luyKeGiaiNganDauNamNsnn = sumNumber([this.total.luyKeGiaiNganDauNamNsnn, item.luyKeGiaiNganDauNamNsnn]);
                this.total.luyKeGiaiNganDauNamNsnnVonDt = sumNumber([this.total.luyKeGiaiNganDauNamNsnnVonDt, item.luyKeGiaiNganDauNamNsnnVonDt]);
                this.total.luyKeGiaiNganDauNamNsnnVonThue = sumNumber([this.total.luyKeGiaiNganDauNamNsnnVonThue, item.luyKeGiaiNganDauNamNsnnVonThue]);
                this.total.luyKeGiaiNganDauNamNsnnVonScl = sumNumber([this.total.luyKeGiaiNganDauNamNsnnVonScl, item.luyKeGiaiNganDauNamNsnnVonScl]);
            }
        })
        this.total.giaiNganTsoTle = percent(this.total.giaiNganTso, this.total.khoachNamVonTso);
        this.total.giaiNganNsnnTle = percent(this.total.giaiNganNsnn, this.total.khoachNamVonNsnn);
        this.total.giaiNganNsnnTleVonDt = percent(this.total.giaiNganNsnnVonDt, this.total.khoachNamVonDt);
        this.total.giaiNganNsnnTleVonThue = percent(this.total.giaiNganNsnnVonThue, this.total.khoachNamVonThue);
        this.total.giaiNganNsnnTleVonScl = percent(this.total.giaiNganNsnnVonScl, this.total.khoachNamVonScl);
        this.total.luyKeGiaiNganDauNamTsoTle = percent(this.total.luyKeGiaiNganDauNamTso, this.total.khoachNamVonTso);
        this.total.luyKeGiaiNganDauNamNsnnTle = percent(this.total.luyKeGiaiNganDauNamNsnn, this.total.khoachNamVonNsnn);
        this.total.luyKeGiaiNganDauNamNsnnTleVonDt = percent(this.total.luyKeGiaiNganDauNamNsnnVonDt, this.total.khoachNamVonDt);
        this.total.luyKeGiaiNganDauNamNsnnTleVonThue = percent(this.total.luyKeGiaiNganDauNamNsnnVonThue, this.total.khoachNamVonThue);
        this.total.luyKeGiaiNganDauNamNsnnTleVonScl = percent(this.total.luyKeGiaiNganDauNamNsnnVonScl, this.total.khoachNamVonScl);
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.luyKeVonTso = sumNumber([this.editCache[id].data.luyKeVonNsnn, this.editCache[id].data.luyKeVonDt, this.editCache[id].data.luyKeVonThue, this.editCache[id].data.luyKeVonScl]);
        this.editCache[id].data.khoachVonNamTruocKeoDaiTso = sumNumber([this.editCache[id].data.khoachVonNamTruocKeoDaiDtpt, this.editCache[id].data.khoachVonNamTruocKeoDaiVonKhac]);
        this.editCache[id].data.khoachNamVonTso = sumNumber([this.editCache[id].data.khoachNamVonNsnn, this.editCache[id].data.khoachNamVonDt, this.editCache[id].data.khoachNamVonThue, this.editCache[id].data.khoachNamVonScl]);
        this.editCache[id].data.giaiNganTso = sumNumber([this.editCache[id].data.giaiNganNsnn, this.editCache[id].data.giaiNganNsnnVonDt, this.editCache[id].data.giaiNganNsnnVonThue, this.editCache[id].data.giaiNganNsnnVonScl]);
        this.editCache[id].data.luyKeGiaiNganDauNamTso = sumNumber([this.editCache[id].data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganDauNamTso = sumNumber([data.luyKeGiaiNganDauNamTso, this.editCache[id].data.giaiNganTso, - data.giaiNganTso]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnn = sumNumber([data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.giaiNganNsnn, - data.giaiNganNsnn]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt = sumNumber([data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.giaiNganNsnnVonDt, - data.giaiNganNsnnVonDt]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue = sumNumber([data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.giaiNganNsnnVonThue, - data.giaiNganNsnnVonThue]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl = sumNumber([data.luyKeGiaiNganDauNamNsnnVonScl, this.editCache[id].data.giaiNganNsnnVonScl, - data.giaiNganNsnnVonScl]);

        //tinh ty le
        this.editCache[id].data.giaiNganTsoTle = percent(this.editCache[id].data.giaiNganTso, this.editCache[id].data.khoachNamVonTso);
        this.editCache[id].data.giaiNganNsnnTle = percent(this.editCache[id].data.giaiNganNsnn, this.editCache[id].data.khoachNamVonNsnn);
        this.editCache[id].data.giaiNganNsnnTleVonDt = percent(this.editCache[id].data.giaiNganNsnnVonDt, this.editCache[id].data.khoachNamVonDt);
        this.editCache[id].data.giaiNganNsnnTleVonThue = percent(this.editCache[id].data.giaiNganNsnnVonThue, this.editCache[id].data.khoachNamVonThue);
        this.editCache[id].data.giaiNganNsnnTleVonScl = percent(this.editCache[id].data.giaiNganNsnnVonScl, this.editCache[id].data.khoachNamVonScl);
        this.editCache[id].data.luyKeGiaiNganDauNamTsoTle = percent(this.editCache[id].data.luyKeGiaiNganDauNamTso, this.editCache[id].data.khoachNamVonTso);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTle = percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.khoachNamVonNsnn);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonDt = percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.khoachNamVonDt);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonThue = percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.khoachNamVonThue);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonScl = percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl, this.editCache[id].data.khoachNamVonScl);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }

}
