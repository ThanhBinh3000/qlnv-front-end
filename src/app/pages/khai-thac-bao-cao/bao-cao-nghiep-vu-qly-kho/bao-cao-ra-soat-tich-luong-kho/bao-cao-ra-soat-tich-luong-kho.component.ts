import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ThongTu1452013Service } from "../../../../services/bao-cao/ThongTu1452013.service";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { MESSAGE } from "../../../../constants/message";
import { Base2Component } from "../../../../components/base2/base2.component";
import { saveAs } from "file-saver";
import { ThongTu1302018Service } from "../../../../services/bao-cao/ThongTu1302018.service";
// import { Subscription } from 'rxjs';
import { BcNvQuanLyKhoTangService } from 'src/app/services/bao-cao/BcNvQuanLyKhoTang.service';

@Component({
    selector: 'app-bao-cao-ra-soat-tich-luong-kho',
    templateUrl: './bao-cao-ra-soat-tich-luong-kho.component.html',
    styleUrls: ['./bao-cao-ra-soat-tich-luong-kho.component.scss']
})
export class BaoCaoRaSoatTichLuongKho extends Base2Component implements OnInit
// , AfterViewInit, OnDestroy 
{
    pdfSrc: any;
    excelSrc: any;
    pdfBlob: any;
    excelBlob: any;
    selectedVthhCache: any;
    selectedCloaiVthhCache: any;
    showDlgPreview = false;
    listCuc: any[] = [];
    listChiCuc: any[] = [];

    // cucChangeSub: Subscription;
    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private bcNvQuanLyKhoTangService: BcNvQuanLyKhoTangService,
        public userService: UserService,
        private donViService: DonviService,
        private danhMucService: DanhMucService,
        public globals: Globals,
    ) {
        super(httpClient, storageService, notification, spinner, modal, bcNvQuanLyKhoTangService);
        this.formData = this.fb.group(
            {
                maCuc: ['', [Validators.required]],
                maChiCuc: [''],
            }
        );
    }

    async ngOnInit() {
        if (this.userService.isChiCuc()) {
            this.formData.controls["maCuc"].clearValidators();
        }
        await this.spinner.show();
        try {
            await this.loadDonVi(this.userInfo.MA_DVI)
        } catch (e) {
            console.log("error: ", e);
            await this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        await this.spinner.hide();
    }

    downloadPdf() {
        saveAs(this.pdfBlob, "ra_soat_tich_luong_kho_pdf.pdf");
    }

    closeDlg() {
        this.showDlgPreview = false;
    }
    clearFilter() {
        // this.formData.reset();
        this.formData.patchValue({
            maChiCuc: "",
        })
        if (this.userService.isTongCuc) {
            this.formData.controls["maCuc"].setValue("", { emitEvent: false });
            this.listChiCuc = []
        }
    }
    async preView() {
        try {
            this.spinner.show();
            this.helperService.markFormGroupTouched(this.formData);
            if (this.formData.invalid) {
                return;
            }
            let body = this.formData.value;
            body.typeFile = "pdf";
            body.fileName = "ra_soat_tich_luong_kho_pdf.jrxml";
            body.tenBaoCao = "Rà soát tích lượng kho";
            await this.bcNvQuanLyKhoTangService.baoCaoRaSoatTichLuongKho(body).then(async s => {
                this.pdfBlob = s;
                this.pdfSrc = await new Response(s).arrayBuffer();
            });
            this.showDlgPreview = true;
        } catch (e) {
            console.log(e);
        } finally {
            this.spinner.hide();
        }
    }

    async downloadExcel() {
        try {
            this.spinner.show();
            let body = this.formData.value;
            body.typeFile = "xlsx";
            body.fileName = "ra_soat_tich_luong_kho_pdf.jrxml";
            body.tenBaoCao = "Rà soát tích lượng kho";
            await this.bcNvQuanLyKhoTangService.baoCaoRaSoatTichLuongKho(body).then(async s => {
                this.excelBlob = s;
                this.excelSrc = await new Response(s).arrayBuffer();
                saveAs(this.excelBlob, "ra_soat_tich_luong_kho_pdf.xlsx");
            });
            this.showDlgPreview = true;
        } catch (e) {
            console.log(e);
        } finally {
            this.spinner.hide();
        }

    }
    async loadDonVi(maDviCha: string) {
        try {

            let body = {
                trangThai: "01",
                maDviCha,
                type: "DV"
            }
            if (this.userService.isTongCuc() || this.userService.isCuc()) {
                const res = await this.donViService.getDonViTheoMaCha(body);
                if (res.msg === MESSAGE.SUCCESS) {
                    if (this.userService.isTongCuc()) {
                        this.listCuc = res.data;
                        this.listChiCuc = [];
                    } else if (this.userService.isCuc()) {
                        this.formData.controls["maCuc"].setValue(this.userInfo.MA_DVI, { emitEvent: false })
                        this.listCuc = [{ maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI }];
                        this.listChiCuc = res.data;
                    }
                }
                else {
                    this.notification.error(MESSAGE.ERROR, res.msg)
                }
            }
            else if (this.userService.isChiCuc()) {
                this.formData.controls["maChiCuc"].setValue(this.userInfo.MA_DVI, { emitEvent: false })
                this.listChiCuc = [{ maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI }];
            }
        } catch (error) {
            console.log("e", error);
        }
    }
    async getDsDviCon(maDvCha: string) {
        try {

            let body = {
                trangThai: "01",
                maDviCha: maDvCha,
                type: "DV"
            };
            let res = await this.donViService.getDonViTheoMaCha(body);
            if (res.msg == MESSAGE.SUCCESS) {
                this.listChiCuc = res.data;
                this.formData.patchValue({ maChiCuc: "" })
            } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
            }
        } catch (error) {
            console.log("e", error)
        }
    }
    changeCuc(val: string) {
        this.getDsDviCon(val);
    }
    // ngAfterViewInit() {
    //     if (this.userService.isTongCuc()) {
    //         this.cucChangeSub = this.formData.get('maCuc').valueChanges.subscribe(val => {
    //             this.getDsDviCon(val);
    //         });
    //     }
    // }
    // ngOnDestroy() {
    //     this.cucChangeSub.unsubscribe();
    // }
}
