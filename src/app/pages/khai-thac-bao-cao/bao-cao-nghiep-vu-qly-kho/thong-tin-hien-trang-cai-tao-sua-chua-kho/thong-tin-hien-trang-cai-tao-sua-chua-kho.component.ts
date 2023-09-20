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
    selector: 'app-thong-tin-hien-trang-cai-tao-sua-chua-kho',
    templateUrl: './thong-tin-hien-trang-cai-tao-sua-chua-kho.component.html',
    styleUrls: ['./thong-tin-hien-trang-cai-tao-sua-chua-kho.component.scss']
})
export class ThongTinHienTrangCaiTaoSuaChuaKho extends Base2Component implements OnInit
// , AfterViewInit, OnDestroy 
{
    pdfSrc: any;
    excelSrc: any;
    pdfBlob: any;
    excelBlob: any;
    selectedVthhCache: any;
    selectedCloaiVthhCache: any;
    showDlgPreview = false;
    listNam: any[] = [];
    listCuc: any[] = [];
    listChiCuc: any[] = [];
    listTrangThaiSn: any[] = [
        { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
        { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
    ];
    listVthh: any[] = [];
    listCloaiVthh: any[] = [];
    rows: any[] = [];

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
                nam: [dayjs().get("year"), [Validators.required]],
                maCuc: ['', [Validators.required]],
                maChiCuc: [''],
                trangThai: ['']
            }
        );
    }

    async ngOnInit() {
        if (this.userService.isChiCuc()) {
            this.formData.controls["maCuc"].clearValidators();
        }
        await this.spinner.show();
        try {
            for (let i = -3; i < 23; i++) {
                this.listNam.push({
                    value: dayjs().get("year") - i,
                    text: dayjs().get("year") - i
                });
            }
            // await Promise.all([
            //     this.loadDsDonVi(),
            //     this.loadDsVthh()
            // ]);
            await this.loadDonVi(this.userInfo.MA_DVI)
        } catch (e) {
            console.log("error: ", e);
            await this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        await this.spinner.hide();
    }

    downloadPdf() {
        saveAs(this.pdfBlob, "thong_tin_hien_trang_cai_tao_sua_chua_kho.pdf");
    }

    closeDlg() {
        this.showDlgPreview = false;
    }
    clearFilter() {
        // this.formData.reset();
        this.formData.patchValue({
            nam: dayjs().get('year'),
            maChiCuc: "",
            trangThai: ""
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
            body.fileName = "thong_tin_hien_trang_cai_tao_sua_chua_kho.jrxml";
            body.tenBaoCao = "Thông tin về hiện trạng cải tạo, sửa chữa kho";
            await this.bcNvQuanLyKhoTangService.baoCaoThongTinHienTrangCaiTaoSuaChuaKho(body).then(async s => {
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
            body.fileName = "thong_tin_hien_trang_cai_tao_sua_chua_kho.jrxml";
            body.tenBaoCao = "Thông tin về hiện trạng cải tạo, sửa chữa kho";
            await this.bcNvQuanLyKhoTangService.baoCaoThongTinHienTrangCaiTaoSuaChuaKho(body).then(async s => {
                this.excelBlob = s;
                this.excelSrc = await new Response(s).arrayBuffer();
                saveAs(this.excelBlob, "thong_tin_hien_trang_cai_tao_sua_chua_kho.xlsx");
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
