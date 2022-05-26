import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, QLNV_KHVONPHI_TC_THOP_NCAU_CHI_NSNN_GD3N } from "../../../../../Utility/utils";

export class ItemData {
    id!: any;
    stt!: number;
    maNdung!: string;
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
    //danh muc
    donVis: any = [];
    noiDungs: any[] = [];
    nhomChis: any[] = [];
    lstCtietBcao: ItemData[];
    donViTiens: any[] = DON_VI_TIEN;
    //thong tin chung
    id: any;
    trangThaiPhuLuc: string;
    namHienHanh: number;
    maBieuMau: string = "13";
    thuyetMinh: string;
    maDviTien: any;
    listIdDelete: string = "";
    //trang thai cac nut
    status: boolean = false;
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
            })
        })
        this.updateEditCache();

        this.danhMucService.dMNoiDung().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.noiDungs = res.data?.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        //get danh muc dự án
        this.danhMucService.dMLoaiChi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.nhomChis = data.data?.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        //lay danh sach danh muc don vi
        await this.danhMucService.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
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
    async save() {
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
        let lstCtietBcaoTemp: any = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            let namHienHanhDtoan = mulMoney(item.namHienHanhDtoan, this.maDviTien);
            let namHienHanhUocThien = mulMoney(item.namHienHanhUocThien, this.maDviTien);
            let tranChiN = mulMoney(item.tranChiN, this.maDviTien);
            let ncauChiN = mulMoney(item.ncauChiN, this.maDviTien);
            let clechTranChiVsNcauChiN = mulMoney(item.clechTranChiVsNcauChiN, this.maDviTien);
            let tranChiN1 = mulMoney(item.tranChiN1, this.maDviTien);
            let ncauChiN1 = mulMoney(item.ncauChiN1, this.maDviTien);
            let clechTranChiVsNcauChiN1 = mulMoney(item.clechTranChiVsNcauChiN1, this.maDviTien);
            let tranChiN2 = mulMoney(item.tranChiN2, this.maDviTien);
            let ncauChiN2 = mulMoney(item.ncauChiN2, this.maDviTien);
            let clechTranChiVsNcauChiN2 = mulMoney(item.clechTranChiVsNcauChiN2, this.maDviTien);
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

        let request = {
            id: this.id,
            lstCtietLapThamDinhs: lstCtietBcaoTemp,
            maBieuMau: this.maBieuMau,
            maDviTien: this.maDviTien,
            nguoiBcao: this.data?.nguoiBcao,
            lyDoTuChoi: this.data?.lyDoTuChoi,
            thuyetMinh: this.thuyetMinh,
            trangThai: this.trangThaiPhuLuc,
        };
        this.quanLyVonPhiService.updateLapThamDinh(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
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

    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            id: uuid.v4(),
            stt: 0,
            maNdung: '',
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
        };

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // xoa dong
    deleteById(id: any): void {
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    }

    // xóa với checkbox
    deleteSelected() {
        // add list delete id
        this.lstCtietBcao.filter(item => {
            if (item.checked == true && typeof item.id == "number") {
                this.listIdDelete += item.id + ","
            }
        })
        // delete object have checked = true
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
        this.allChecked = false;
    }

    updateAllChecked(): void {
        if (this.allChecked) {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: false
            }));
        }
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCtietBcao.every(item => item.checked)) {
            this.allChecked = true;
        }
    }

    redirectChiTieuKeHoachNam() {
        // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
        this.location.back()
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // if (!this.lstCtietBcao[index].maCucDtnnKvuc) {
        //     this.deleteById(id);
        //     return;
        // }
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    //update khi sửa
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maNdung
            || (!this.editCache[id].data.namHienHanhDtoan && this.editCache[id].data.namHienHanhDtoan !== 0)
            || (!this.editCache[id].data.namHienHanhUocThien && this.editCache[id].data.namHienHanhUocThien !== 0)
            || (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0)
            || (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.changeModel(id);
        this.editCache[id].data.checked = this.lstCtietBcao.find(
            (item) => item.id === id,
        ).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
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

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN1 = this.editCache[id].data.tranChiN1 - this.editCache[id].data.ncauChiN1;
        this.editCache[id].data.ssanhNcauNVoiN1 = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.namHienHanhUocThien).toFixed(3));
        this.editCache[id].data.clechTranChiVsNcauChiN1 = this.editCache[id].data.tranChiN1 - this.editCache[id].data.ncauChiN1;
        this.editCache[id].data.clechTranChiVsNcauChiN2 = this.editCache[id].data.tranChiN2 - this.editCache[id].data.ncauChiN2;
    }


}
