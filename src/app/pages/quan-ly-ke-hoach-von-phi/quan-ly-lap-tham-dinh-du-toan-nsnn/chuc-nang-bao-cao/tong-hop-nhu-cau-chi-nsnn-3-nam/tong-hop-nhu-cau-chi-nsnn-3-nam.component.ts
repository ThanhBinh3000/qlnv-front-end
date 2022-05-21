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
    maNdung!: String;
    maNhomChiNsnn!: String;
    dtoanN!: number;
    uocThienN!: number;
    tranChiN1!: number;
    ncauChiN1!: number;
    clechTranChiVsNcauChiN1: number;
    ssanhNcauNVoiN1: number;
    tranChiN2!: number;
    ncauChiN2!: number;
    clechTranChiVsNcauChiN2: number;
    tranChiN3!: number;
    ncauChiN3!: number;
    clechTranChiVsNcauChiN3: number;
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
    lstCTietBCao: ItemData[];
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

        this.lstCTietBCao = this.data?.lstCTiet;
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

    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            id: uuid.v4(),
            stt: 0,
            maNdung: '',
            maNhomChiNsnn: '',
            dtoanN: 0,
            uocThienN: 0,
            tranChiN1: 0,
            ncauChiN1: 0,
            clechTranChiVsNcauChiN1: 0,
            ssanhNcauNVoiN1: 0,
            tranChiN2: 0,
            ncauChiN2: 0,
            clechTranChiVsNcauChiN2: 0,
            tranChiN3: 0,
            ncauChiN3: 0,
            clechTranChiVsNcauChiN3: 0,
            checked: false,
        };

        this.lstCTietBCao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // xoa dong
    deleteById(id: any): void {
        this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
        if (typeof id == "number") {
            this.listIdDelete += id + ","
        }
    }

    // xóa với checkbox
    deleteSelected() {
        // add list delete id
        this.lstCTietBCao.filter(item => {
            if (item.checked == true && typeof item.id == "number") {
                this.listIdDelete += item.id + ","
            }
        })
        // delete object have checked = true
        this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
        this.allChecked = false;
    }

    updateAllChecked(): void {
        if (this.allChecked) {
            this.lstCTietBCao = this.lstCTietBCao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCTietBCao = this.lstCTietBCao.map(item => ({
                ...item,
                checked: false
            }));
        }
    }

    updateSingleChecked(): void {
        if (this.lstCTietBCao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCTietBCao.every(item => item.checked)) {
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
        const index = this.lstCTietBCao.findIndex(item => item.id === id);
        // if (!this.lstCTietBCao[index].maCucDtnnKvuc) {
        //     this.deleteById(id);
        //     return;
        // }
        this.editCache[id] = {
            data: { ...this.lstCTietBCao[index] },
            edit: false
        };
    }

    //update khi sửa
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maNdung || !this.editCache[id].data.maNhomChiNsnn
            || (!this.editCache[id].data.dtoanN && this.editCache[id].data.dtoanN !== 0)
            || (!this.editCache[id].data.uocThienN && this.editCache[id].data.uocThienN !== 0)
            || (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0)
            || (!this.editCache[id].data.ncauChiN2 && this.editCache[id].data.ncauChiN2 !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.changeModel(id);
        this.editCache[id].data.checked = this.lstCTietBCao.find(
            (item) => item.id === id,
        ).checked; // set checked editCache = checked lstCTietBCao
        const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    // gan editCache.data == lstCTietBCao
    updateEditCache(): void {
        this.lstCTietBCao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.clechTranChiVsNcauChiN1 = this.editCache[id].data.tranChiN1 - this.editCache[id].data.ncauChiN1;
        this.editCache[id].data.ssanhNcauNVoiN1 = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
        this.editCache[id].data.clechTranChiVsNcauChiN2 = this.editCache[id].data.tranChiN2 - this.editCache[id].data.ncauChiN2;
        this.editCache[id].data.clechTranChiVsNcauChiN3 = this.editCache[id].data.tranChiN3 - this.editCache[id].data.ncauChiN3;
    }


}
