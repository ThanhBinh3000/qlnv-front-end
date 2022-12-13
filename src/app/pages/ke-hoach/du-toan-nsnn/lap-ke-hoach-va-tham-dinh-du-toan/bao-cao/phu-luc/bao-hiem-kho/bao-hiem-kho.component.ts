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
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
    id: any;
    stt: string;
    maDvi: string;
    diaChiKho: string;
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
                diaChiKho: null,
                tenNhaKho: null,
                khoiTichKhoDuoiM3: null,
                khoiTichKhoTuM3: null,
                slNhaKhoDuoi: null,
                slNhaKhoTu: null,
                slNhaKhoTong: null,
                duoiGtConLai: null,
                duoiHetKhauHao: null,
                duoiTongGtKho: null,
                tuGtConLai: null,
                tuHetKhauHao: null,
                tuTongGtKho: null,
                tong: null,
                level: null,
                checked: false,

            })
        } else {
            this.sortByIndex();
            // this.lstCtietBcao.forEach(e => {
            //     this.selectDonvi(e.maDvi);
            //     this.selectDiadiem(e.diaChiKho)
            // })
        }

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
            // if (item.ncauTbiNamNTtien > MONEY_LIMIT) {
            //     checkMoneyRange = false;
            //     return;
            // }
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
        // const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        // return lstTemp.every(e => !e.stt.startsWith(stt));
        if (stt.length != 3) {
            return true;
        }
        return false;
    }

    //check row
    checkAdd(data: ItemData) {
        if (data.stt.length == 3) {
            return true;
        }
        return false;
    }


    checkDelete(maDa: string) {
        if (maDa.length != 3) {
            return true;
        }
        return false;
    }
    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
        this.checkAddNewRow = true;
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
        // const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        // const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        // const lstIndex: number[] = [];
        // for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
        //     if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        //         lstIndex.push(i);
        //     }
        // }

        // this.replaceIndex(lstIndex, -1);
        this.updateEditCache();
    }
    // them dong moi
    addLine(stt: any): void {

        let index = -1;
        for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
            if (this.lstCtietBcao[i].stt.startsWith(stt)) {
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
            diaChiKho: '',
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


    selectDiadiem(idDiadiem: any) {
        if (idDiadiem != null && this.listDanhMucKho != undefined) {
            const nhaKho = this.listDanhMucKho.find(ts => ts?.tenDvi === idDiadiem);

            if (nhaKho != undefined) {
                this.listDiemKho = nhaKho?.children;
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

    async getDiaChiKho(id: string) {
        let nameKho = '';
        let diaDiem;
        let idDonVi = this.lstCtietBcao.find(item => item.id == id)?.maDvi;

        let capDonVi = this.listDanhSachCuc.find(e => e.maDvi === idDonVi)?.capDvi;
        if (capDonVi == "3") {
            diaDiem = this.listDanhMucKho.find(ts => ts.maDvi === idDonVi);
        } else {
            diaDiem = this.listDanhMucKho.find(ts => ts.maDviCha === idDonVi);
        }

        // nameKho =  diaDiem?.children.find( e => e.maDvi == idDonVi.diaChiKho);

        return ''
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
            if (item.stt.length != 3) {
                if (item.slNhaKhoDuoi != 0 && item.slNhaKhoDuoi < 5000) {
                    this.tongSoNhaKhoDuoi5000++;
                }
                if (item.slNhaKhoTu >= 5000) {
                    this.tongSoNhaKhoTren5000++;
                }
            }

        })
        this.lstCtietBcao[0].slNhaKhoDuoi = this.tongSoNhaKhoDuoi5000;
        this.lstCtietBcao[0].slNhaKhoTu = this.tongSoNhaKhoTren5000;
        this.lstCtietBcao[0].slNhaKhoTong = this.tongSoNhaKhoDuoi5000 + this.tongSoNhaKhoTren5000;
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
