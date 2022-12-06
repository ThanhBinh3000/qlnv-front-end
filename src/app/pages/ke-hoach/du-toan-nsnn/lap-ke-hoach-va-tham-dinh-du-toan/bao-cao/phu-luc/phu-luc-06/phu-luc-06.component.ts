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
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, mulNumber } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DialogThemKhoanMucComponent } from '../../../../dieu-chinh-du-toan/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
export class ItemData {
    id: any;
    stt: string;
    tenTaiSan: string;
    dviTinh: any;
    donGiaTdTheoQd: number;
    ncauTbiNamNSluong: number;
    ncauTbiNamNTtien: number;
    ncauTbiNamNSluongTd: number;
    ncauTbiNamNTtienTd: number;
    ncauTbiNamN1Sluong: number;
    ncauTbiNamN1Ttien: number;
    ncauTbiNamN2Sluong: number;
    ncauTbiNamN2Ttien: number;
    level: any;
    checked: boolean;
}
@Component({
    selector: 'app-phu-luc-06',
    templateUrl: './phu-luc-06.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})
export class PhuLuc06Component implements OnInit {
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

    tongSoThanhTien1: number;
    tongSoThanhTien2: number;
    tongSoThanhTien3: number;
    tongSoThanhTien4: number;

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
        this.updateEditCache();
        this.getStatusButton();

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
                            item.tongDmuc = Math.round(divNumber(item.tongDmuc, 1000));
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
                        tenTaiSan: vatTuCon.ma,
                        dviTinh: vatTuCon.maDviTinh,
                        maCha: "0",
                        level: 0,
                    })
                })
            }
        })

        this.lstVatTuFull = vatTuTemp;
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
            if (item.ncauTbiNamNTtien > MONEY_LIMIT) {
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
                    this._modalRef.close(this.formDetail);
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
                this._modalRef.close(this.formDetail);
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
    addLine(id: number): void {

        const item: ItemData = {

            id: uuid.v4() + 'FE',
            stt: '',
            tenTaiSan: '',
            dviTinh: '',
            donGiaTdTheoQd: 0,
            ncauTbiNamNSluong: 0,
            ncauTbiNamNTtien: 0,
            ncauTbiNamNSluongTd: 0,
            ncauTbiNamNTtienTd: 0,
            ncauTbiNamN1Sluong: 0,
            ncauTbiNamN1Ttien: 0,
            ncauTbiNamN2Sluong: 0,
            ncauTbiNamN2Ttien: 0,
            level: '',
            checked: false,
        }

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    selectTaisan(idTaiSan: any, idRow: any) {
        const taiSan = this.lstVatTuFull.find(ts => ts.id === idTaiSan);
        this.editCache[idRow].data.dviTinh = taiSan.dviTinh;
    }



    tinhTong() {
        this.tongSoThanhTien1 = 0;
        this.tongSoThanhTien2 = 0;
        this.tongSoThanhTien3 = 0;
        this.tongSoThanhTien4 = 0;
        this.lstCtietBcao.forEach(item => {
            this.tongSoThanhTien1 += item.ncauTbiNamNTtien;
            this.tongSoThanhTien2 += item.ncauTbiNamNTtienTd;
            this.tongSoThanhTien3 += item.ncauTbiNamN1Ttien;
            this.tongSoThanhTien4 += item.ncauTbiNamN2Ttien;
        })
    }

    changeModel(id: string): void {

        this.editCache[id].data.ncauTbiNamNTtien = mulNumber(this.editCache[id].data.donGiaTdTheoQd, this.editCache[id].data.ncauTbiNamNSluong);
        this.editCache[id].data.ncauTbiNamN1Ttien = mulNumber(this.editCache[id].data.donGiaTdTheoQd, this.editCache[id].data.ncauTbiNamN1Sluong);
        this.editCache[id].data.ncauTbiNamN2Ttien = mulNumber(this.editCache[id].data.donGiaTdTheoQd, this.editCache[id].data.ncauTbiNamN2Sluong);
        this.editCache[id].data.ncauTbiNamNTtienTd = mulNumber(this.editCache[id].data.donGiaTdTheoQd, this.editCache[id].data.ncauTbiNamNSluongTd);
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
