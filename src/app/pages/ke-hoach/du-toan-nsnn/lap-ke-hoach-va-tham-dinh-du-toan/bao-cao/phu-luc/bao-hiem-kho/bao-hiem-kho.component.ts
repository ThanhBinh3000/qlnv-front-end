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
import { UserService } from 'src/app/services/user.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA } from 'src/app/Utility/utils';
import { chain, cloneDeep } from 'lodash';
import * as uuid from 'uuid';

export class ItemData {
    id: any;
    stt: string;
    maDvi: string;
    maDiaChi: string;
    diaChiKho: string;
    maNhaKho: string;
    tenNhaKho: string;
    khoiTichKhoDuoiM3: number;
    khoiTichKhoTuM3: number;
    slNhaKhoDuoi: number;
    slNhaKhoTu: number;
    slNhaKhoTong: number;
    duoiGtConLai: number;
    duoiHetKhauHao: number;
    duoiTongGtKho: number;
    tuGtConLai: number;
    tuHetKhauHao: number;
    tuTongGtKho: number;
    tong: number;
    level: any;
    checked: boolean;
    stateSpan: number;
    countySpan: number
}
@Component({
    selector: 'app-bao-hiem-kho',
    templateUrl: './bao-hiem-kho.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class BaoHiemKhoComponent implements OnInit {
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
    listDanhMucKho: any[] = [];
    listDanhMucKhoFull: any[] = [];
    listDanhSachCuc: any[] = [];
    listDiemKho: any[] = [];
    listDiemKhoFull: any[] = [];
    isDataAvailable = false;
    dsDinhMuc: any[] = [];
    maDviTao: any;
    soLaMa: any[] = LA_MA;
    allChecked = false;
    userInfo: any;
    tenDviLogin: any;

    namBaoCao: string;
    namTruoc: string;
    namKeHoach: string;

    checkViewTD: boolean;
    checkEditTD: boolean;
    checkAddNewRow: boolean = false;

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

    tongSoNhaKhoDuoi5000: number;
    tongSoNhaKhoTren5000: number;
    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    checkHideElement: boolean;
    checkHideDuoi: boolean;
    checkHideTu: boolean;

    dataExt: any[] = [];


    maDviChon: any;
    maDiaChiKhoChon: any;
    maNhaKhoChon: any;

    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMucService: DanhMucHDVService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private userService: UserService,
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
        this.checkEditTD = false;
        this.checkViewTD = true;

        this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
            })
        })


        this.userInfo = this.userService.getUserLogin().DON_VI;
        const reqGetDonViCon = {
            maDviCha: this.maDviTao,
            trangThai: '01',
        }

        await this.quanLyVonPhiService.dmDviCon(reqGetDonViCon).toPromise().then(res => {
            if (res.statusCode == 0) {
                const donViLogin = {
                    tenDvi: this.userInfo.tenDvi,
                    maDvi: this.maDviTao,
                    capDvi: this.userInfo.capDvi
                }
                if (this.userInfo.capDvi != "3") {
                    this.listDanhSachCuc = res.data;
                }
                this.listDanhSachCuc.push(donViLogin);

            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })

        await this.quanLyVonPhiService.dmKho(this.maDviTao).toPromise().then(res => {
            if (res.statusCode == 0) {

                if (this.userInfo.capDvi == "3") {

                    this.listDanhMucKho = res.data;
                    this.listDanhMucKho = this.listDanhMucKho[0].children;

                } else {
                    this.listDanhMucKho = res.data;
                }
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })

        if (this.lstCtietBcao.length == 0) {
            this.lstCtietBcao.push({
                ...new ItemData(),
                id: uuid.v4() + 'FE',
                stt: "0.1",
                maDvi: this.maDviTao,
                maDiaChi: "",
                diaChiKho: "",
                maNhaKho: "",
                tenNhaKho: "",
                khoiTichKhoDuoiM3: 0,
                khoiTichKhoTuM3: 0,
                slNhaKhoDuoi: 0,
                slNhaKhoTu: 0,
                slNhaKhoTong: 0,
                duoiGtConLai: 0,
                duoiHetKhauHao: 0,
                duoiTongGtKho: 0,
                tuGtConLai: 0,
                tuHetKhauHao: 0,
                tuTongGtKho: 0,
                tong: 0,
                level: "",
                checked: false,
                stateSpan: 1,
                countySpan: 1,
            })
            this.updateEditCache();

        } else if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                await this.quanLyVonPhiService.getDmucDviTrucThuocTCDT().toPromise().then(res => {
                    if (res.statusCode == 0) {
                        const listDsDvi = res.data.children
                        // this.listDanhSachCuc = res.data;
                        listDsDvi.forEach(item => {
                            item.children.forEach(child => {
                                listDsDvi.push(child)
                            })
                        })
                        console.log(listDsDvi);
                        this.listDanhSachCuc = listDsDvi
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                })

                let lstLv1 = []
                this.lstCtietBcao.forEach(item => {
                    if (item.maNhaKho == null && item.diaChiKho == null && item.tenNhaKho == null) {
                        lstLv1.push({
                            ...item,
                            level: "1"
                        })
                    }
                })
                for (let i = 1; i <= lstLv1.length; i++) {
                    lstLv1.forEach(item => {
                        item.stt = "0." + i;
                    })
                }
                let lstCon = [];
                this.lstCtietBcao.forEach(item => {
                    if (item.maNhaKho !== null && item.diaChiKho !== null && item.tenNhaKho !== null) {
                        lstCon.push({
                            ...item,
                            level: "2"
                        })
                    }
                })
                let indexArr = []
                lstLv1.forEach(item => {
                    lstCon.forEach(itm => {
                        if(itm.maDvi.startsWith(item.maDvi)){
                            indexArr.push(itm)
                            for (let i = 1; i <= indexArr.length; i++){
                                itm.stt = item.stt + "." + i;
                            }
                        }
                    })
                })
                let a = lstLv1.concat(lstCon);
                this.lstCtietBcao = a
                this.processData();
                this.updateEditCache();
            } else {
                this.sortByIndex();
                this.updateEditCache();
            }
        }
        this.getStatusButton();
        this.tinhTong();
        this.spinner.hide();
    }

    setDetail() {
        this.lstCtietBcao.forEach(item => {
            item.level = this.listDanhSachCuc.find(e => e.id == item.maDvi)?.level;
        })
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
            // if (item.ncauTbiNamNTtien > MONEY_LIMIT) {
            //     checkMoneyRange = false;
            //     return;
            // }
            if (item.maDiaChi == null || item.maDvi == null) {
                item.maDiaChi == "";
                item.maDvi = "";
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
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 36) {
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
        this.checkAddNewRow = false;
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


    // xoa dong
    deleteById(id: string): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
        this.processData()
    }

    checkEdit(stt: string) {
        if (stt?.length != 3) {
            return true;
        }
        return false;
    }

    //check row
    checkAdd(data: ItemData) {
        if (data?.stt?.length == 3) {
            return true;
        }
        return false;
    }


    checkDelete(maDa: string) {
        if (maDa?.length != 3) {
            return true;
        }
        return false;
    }
    // start edit
    startEdit(id: string): void {
        // this.processData()
        this.lstCtietBcao.forEach(item => {
            item.countySpan = 1;
            item.stateSpan = 1;
        })
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
            this.maDviChon = this.editCache[id].data.maDvi,
                this.maDiaChiKhoChon = this.editCache[id].data.maDiaChi,
                this.maNhaKhoChon = this.editCache[id].data.maNhaKho,

                this.checkAddNewRow = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
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

    // them dong moi
    addLine(stt: any): void {

        let index = -1;
        for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
            if (this.lstCtietBcao[i]?.stt.startsWith(stt)) {
                index = i;
                break;
            }
        }
        const tail = stt == this.lstCtietBcao[index]?.stt ? '1' : (this.getTail(this.lstCtietBcao[index]?.stt) + 1).toString();
        const item: ItemData = {
            ...new ItemData,
            id: uuid.v4() + 'FE',
            stt: stt + '.' + tail,
            maDvi: '',
            maDiaChi: '',
            diaChiKho: '',
            maNhaKho: '',
            tenNhaKho: '',
            khoiTichKhoDuoiM3: 0,
            khoiTichKhoTuM3: 0,
            slNhaKhoDuoi: 0,
            slNhaKhoTu: 0,
            slNhaKhoTong: 0,
            duoiGtConLai: 0,
            duoiHetKhauHao: 0,
            duoiTongGtKho: 0,
            tuGtConLai: 0,
            tuHetKhauHao: 0,
            tuTongGtKho: 0,
            tong: 0,
            level: '',
            checked: false,
        }
        const str: string[] = item.stt.split('.');
        item.level = str.length - 2;
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
        this.checkAddNewRow = true;
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
        // if (n == 2) {
        //     xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        // }
        if (n == 2) {
            xau = "";
            // xau = String.fromCharCode(k + 96);
        }
        // if (n == 4) {
        //     xau = "-";
        // }
        return xau;
    }

    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }


    async selectDonvi(idDonvi: any) {

        let diaDiem;
        let capDonVi = this.listDanhSachCuc.find(e => e.maDvi === idDonvi)?.capDvi;
        await this.quanLyVonPhiService.dmKho(idDonvi).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listDanhMucKho = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        if (capDonVi == "3") {

            diaDiem = this.listDanhMucKho.find(ts => ts.maDvi === idDonvi);
        } else {
            diaDiem = this.listDanhMucKho.find(ts => ts.maDviCha === idDonvi);
        }

        this.listDanhMucKho = diaDiem?.children;
        for (let i = 0; i < diaDiem?.children.length; i++) {
            var index = this.listDanhMucKhoFull.findIndex(item => item.maDviCha === idDonvi);
            if (this.listDanhMucKhoFull.length == 0 || index == -1) {
                this.listDanhMucKhoFull.push(diaDiem?.children[i]);
            }
        }



    }


    selectDiadiem(Diadiem: any, id: any) {
        if (Diadiem != null && this.listDanhMucKho != undefined) {
            const diachinhaKho = this.listDanhMucKho.find(ts => ts?.tenDvi === Diadiem);

            if (diachinhaKho != undefined) {
                this.editCache[id].data.maDiaChi = diachinhaKho.maDvi;
                this.listDiemKho = diachinhaKho?.children;
                for (let i = 0; i < this.listDiemKho.length; i++) {
                    var index = this.listDiemKhoFull.findIndex(item => item.maDvi == this.listDiemKho[i].tenDvi)
                    if (index == -1 || this.listDiemKhoFull.length == 0) {
                        this.listDiemKhoFull.push(this.listDiemKho[i]);
                    }
                }
            }
        } else {
            return
        }

    }

    getmaNhaKho(nameNhaKho: string, id: any) {
        if (nameNhaKho != null && this.listDiemKho != undefined) {

            const nhaKho = this.listDiemKho.find(nk => nk?.tenDvi === nameNhaKho);
            if (nhaKho != undefined) {
                this.editCache[id].data.maNhaKho = nhaKho.maDvi;
            }
        }
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
        this.tongSoNhaKhoDuoi5000 = 0;
        this.tongSoNhaKhoTren5000 = 0;
        this.lstCtietBcao.forEach(item => {
            if (item.level == 1) {
                this.tongSo1 += item.khoiTichKhoDuoiM3;
                this.tongSo2 += item.khoiTichKhoTuM3;
                this.tongSo3 += item.slNhaKhoDuoi;
                this.tongSo4 += item.slNhaKhoTu;
                this.tongSo5 += item.slNhaKhoTong;
                this.tongSo6 += item.duoiGtConLai;
                this.tongSo7 += item.duoiHetKhauHao;
                this.tongSo8 += item.duoiTongGtKho;
                this.tongSo9 += item.tuGtConLai;
                this.tongSo10 += item.tuHetKhauHao;
                this.tongSo11 += item.tuTongGtKho;
                this.tongSo12 += item.tong;
            }
            if (item?.stt.length != 3) {
                if (item.khoiTichKhoDuoiM3 != 0 && item.khoiTichKhoDuoiM3 < 5000) {
                    this.tongSoNhaKhoDuoi5000++;
                }
                if (item.khoiTichKhoTuM3 >= 5000) {
                    this.tongSoNhaKhoTren5000++;
                }
            }

        })
        this.lstCtietBcao[0].slNhaKhoDuoi = this.tongSoNhaKhoDuoi5000;
        this.lstCtietBcao[0].slNhaKhoTu = this.tongSoNhaKhoTren5000;
        this.lstCtietBcao[0].slNhaKhoTong = this.tongSoNhaKhoDuoi5000 + this.tongSoNhaKhoTren5000;
        this.lstCtietBcao[0].duoiTongGtKho = this.tongSo8
        this.lstCtietBcao[0].tuTongGtKho = this.tongSo11
    }

    changeModel(id: string): void {

        this.editCache[id].data.slNhaKhoTong = this.editCache[id].data.slNhaKhoDuoi + this.editCache[id].data.slNhaKhoTu;
        this.editCache[id].data.duoiTongGtKho = this.editCache[id].data.duoiGtConLai + this.editCache[id].data.duoiHetKhauHao;
        this.editCache[id].data.tuTongGtKho = this.editCache[id].data.tuGtConLai + this.editCache[id].data.tuHetKhauHao;
        this.editCache[id].data.tong = this.editCache[id].data.duoiTongGtKho + this.editCache[id].data.tuTongGtKho;
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
        this.processData()
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

    processData() {
        const statesSeen = {};
        const countiesSeen = {};

        this.lstCtietBcao.forEach(item => {
            if (item.maDiaChi == null) {
                item.maDiaChi = "";
            }
            if (item.maDvi == null) {
                item.maDvi = "";
            }
        })

        this.dataExt = this.lstCtietBcao.sort((a, b) => {
            const stateComp = a.maDvi.localeCompare(b.maDvi);
            return stateComp ? stateComp : a?.maDiaChi.localeCompare(b.maDiaChi);
        }).map(x => {
            const stateSpan = statesSeen[x.maDvi] ? 0 :
                this.lstCtietBcao.filter(y => y.maDvi === x.maDvi).length;

            statesSeen[x.maDvi] = true;

            const countySpan = countiesSeen[x.maDvi] && countiesSeen[x.maDvi][x.maDiaChi] ? 0 : this.lstCtietBcao.filter(y => y.maDvi === x.maDvi && y.maDiaChi === x.maDiaChi).length;

            countiesSeen[x.maDvi] = countiesSeen[x.maDvi] || {};
            countiesSeen[x.maDvi][x.maDiaChi] = true;

            return { ...x, stateSpan, countySpan };
        });

        this.lstCtietBcao = this.dataExt

    }

}
