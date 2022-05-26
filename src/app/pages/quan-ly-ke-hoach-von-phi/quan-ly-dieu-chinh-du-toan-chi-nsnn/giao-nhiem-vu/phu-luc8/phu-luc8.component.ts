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
import { DON_VI_TIEN, QLNV_KHVONPHI_TC_THOP_NCAU_CHI_NSNN_GD3N } from "../../../../../Utility/utils";

export class ItemData {
    id!: any;
    stt!: number;
    maCongTrinh: string;
    kh2021: number;
    lkeVcap: number;
    gtriCtrinh: number;
    dxuatDchinhTong: number;
    dxuatDchinhTang: number;
    dxuatDchinhGiam: number;
    kh2021SauDchinh: number;
    ghiChu: string;
    checked!: boolean;
}

@Component({
  selector: 'app-phu-luc8',
  templateUrl: './phu-luc8.component.html',
})
export class PhuLuc8Component implements OnInit {
    @Input() data;
    //danh muc
    donVis: any = [];
    congTrinhs: any[] = [];
    nhomChis: any[] = [];
    lstDchinh: ItemData[];
    donViTiens: any[] = DON_VI_TIEN;
    //thong tin chung
    namBcao: any;
    maLoaiBaoCao: string = QLNV_KHVONPHI_TC_THOP_NCAU_CHI_NSNN_GD3N;
    thuyetMinh: string;
    maDviTien: any;
    listIdDelete: string = "";
    //trang thai cac nut
    status: boolean = false;

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

        this.lstDchinh = this.data?.lstCtiet;
        this.updateEditCache();

        this.danhMucService.dMNoiDung().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.congTrinhs = res.data?.content;
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

    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            id: uuid.v4(),
            stt: 0,
            maCongTrinh: '',
            kh2021: 0,
            lkeVcap: 0,
            gtriCtrinh: 0,
            dxuatDchinhTong: 0,
            dxuatDchinhTang: 0,
            dxuatDchinhGiam: 0,
            kh2021SauDchinh: 0,
            ghiChu: '',
            checked: false,
        };

        this.lstDchinh.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // xoa dong
    deleteById(id: any): void {
        this.lstDchinh = this.lstDchinh.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    }

    // xóa với checkbox
    deleteSelected() {
        // add list delete id
        this.lstDchinh.filter(item => {
            if (item.checked == true && typeof item.id == "number") {
                this.listIdDelete += item.id + ","
            }
        })
        // delete object have checked = true
        this.lstDchinh = this.lstDchinh.filter(item => item.checked != true)
        this.allChecked = false;
    }

    updateAllChecked(): void {
        if (this.allChecked) {
            this.lstDchinh = this.lstDchinh.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstDchinh = this.lstDchinh.map(item => ({
                ...item,
                checked: false
            }));
        }
    }

    updateSingleChecked(): void {
        if (this.lstDchinh.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstDchinh.every(item => item.checked)) {
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
        const index = this.lstDchinh.findIndex(item => item.id === id);
        // if (!this.lstDchinh[index].maCucDtnnKvuc) {
        //     this.deleteById(id);
        //     return;
        // }
        this.editCache[id] = {
            data: { ...this.lstDchinh[index] },
            edit: false
        };
    }

    //update khi sửa
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maCongTrinh
            || (!this.editCache[id].data.dxuatDchinhGiam && this.editCache[id].data.dxuatDchinhGiam !== 0)
            || (!this.editCache[id].data.dxuatDchinhTang && this.editCache[id].data.dxuatDchinhTang !== 0)
            || (!this.editCache[id].data.dxuatDchinhTong && this.editCache[id].data.dxuatDchinhTong !== 0)
            || (!this.editCache[id].data.gtriCtrinh && this.editCache[id].data.gtriCtrinh !== 0)
            || (!this.editCache[id].data.dxuatDchinhGiam && this.editCache[id].data.dxuatDchinhGiam !== 0)
            || (!this.editCache[id].data.dxuatDchinhTang && this.editCache[id].data.dxuatDchinhTang !== 0)
            || (!this.editCache[id].data.dxuatDchinhTong && this.editCache[id].data.dxuatDchinhTong !== 0)
            || (!this.editCache[id].data.kh2021SauDchinh && this.editCache[id].data.kh2021SauDchinh !== 0)
            ) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        // this.changeModel(id);
        this.editCache[id].data.checked = this.lstDchinh.find(
            (item) => item.id === id,
        ).checked; // set checked editCache = checked lstDchinh
        const index = this.lstDchinh.findIndex((item) => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstDchinh[index], this.editCache[id].data); // set lai data cua lstDchinh[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    // gan editCache.data == lstDchinh
    updateEditCache(): void {
        this.lstDchinh.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //gia tri cac o input thay doi thi tinh toan lai
    // changeModel(id: string): void {
    //     this.editCache[id].data.clechTranChiVsNcauChiN1 = this.editCache[id].data.tranChiN1 - this.editCache[id].data.ncauChiN1;
    //     this.editCache[id].data.ssanhNcauNVoiN1 = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
    //     this.editCache[id].data.clechTranChiVsNcauChiN2 = this.editCache[id].data.tranChiN2 - this.editCache[id].data.ncauChiN2;
    //     this.editCache[id].data.clechTranChiVsNcauChiN3 = this.editCache[id].data.tranChiN3 - this.editCache[id].data.ncauChiN3;
    // }


}
