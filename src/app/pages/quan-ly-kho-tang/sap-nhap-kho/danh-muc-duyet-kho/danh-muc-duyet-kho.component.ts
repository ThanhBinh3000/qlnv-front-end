import { DataService } from './../../../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import { Base2Component } from "../../../../components/base2/base2.component";
import { StorageService } from "../../../../services/storage.service";
import { CHUC_NANG, STATUS } from "../../../../constants/status";
import { UserLogin } from "../../../../models/userlogin";
import { MESSAGE } from "../../../../constants/message";
import { DanhMucDuyetKhoService } from "../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/danh-muc-duyet-kho.service";


@Component({
    selector: 'app-danh-muc-duyet-kho',
    templateUrl: './danh-muc-duyet-kho.component.html',
    styleUrls: ['./danh-muc-duyet-kho.component.scss']
})
export class DanhMucDuyetKhoComponent extends Base2Component implements OnInit {

    CHUC_NANG = CHUC_NANG;
    STATUS = STATUS;

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private dataService: DataService,
        private danhMucDuyetKhoService: DanhMucDuyetKhoService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, danhMucDuyetKhoService);
        this.formData = this.fb.group({
            tenDvi: [],
            maDvi: [],
            nam: [],
            soQuyetDinh: [],
            trichYeu: [],
            ngayKyTu: [],
            ngayKyDen: [],
            trangThai: [],
            trangThaiSn: [],
            tenTrangThai: [],
            tenTrangThaiSn: []
        })
    }

    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    quyetDinhId: number = 0;
    soQdGiaoNvXhSelected: string;
    isVatTu: boolean = false;
    isView = false;
    children: any = [];
    idPhieuKnCl: number = 0;
    openPhieuKnCl = false;
    listTrangThaiSn: any[] = [
        { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: "Chưa thực hiện" },
        { ma: this.STATUS.DANG_THUC_HIEN, giaTri: "Đang thực hiện" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },
    ];
    ObTrangThaiSn: { [key: string]: string } = {
        [this.STATUS.CHUA_THUC_HIEN]: "Chưa thực hiện",
        [this.STATUS.DANG_THUC_HIEN]: "Đang thực hiện",
        [this.STATUS.DA_HOAN_THANH]: "Đã hoàn thành",
    }
    listTrangThai: any[] = [
        { ma: "78", giaTri: "Chờ duyệt - CB Cục" },
        { ma: "03", giaTri: "Từ chối - CB Cục" },
        { ma: "02", giaTri: "Đã duyệt - CB Cục" },
    ];
    ObTrangThai: { [key: string]: string } = {
        "78": "Chờ duyệt - CB Cục",
        "03": "Từ chối - CB Cục",
        "02": "Đã duyệt - CB Cục"
    }
    disabledStartNgayKy = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayKyDen) {
            return startValue.getTime() >= this.formData.value.ngayKyDen.getTime();
        }
        return false;
    };

    disabledEndNgayKy = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayKyTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
    };

    async ngOnInit(): Promise<void> {
        try {
            this.dataService.currentData.subscribe(async (data) => {
                if (data && data.quyetDinhId) {
                    this.selectedId = null;
                    this.quyetDinhId = data.quyetDinhId
                    this.isDetail = true;
                    this.isView = true;
                } else {
                    await this.spinner.show();
                    this.initData()
                    await this.timKiem();
                }
            });
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
            this.dataService.removeData();
            this.spinner.hide();
        }
    }

    async search(roles?): Promise<void> {
        await super.search(roles);
    }

    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.userdetail.maDvi = this.userInfo.MA_DVI;
        this.userdetail.tenDvi = this.userInfo.TEN_DVI;
        this.formData.patchValue({ maDvi: this.userInfo.MA_DVI, tenDvi: this.userInfo.TEN_DVI })
    }

    async timKiem() {
        await this.spinner.show();
        try {
            await this.search();
        } catch (e) {
            console.log(e)
        }
        await this.spinner.hide();
    }

    redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
        this.selectedId = id;
        this.isDetail = true;
        this.isView = b;
        // this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
    }

    async showList() {
        this.isDetail = false;
        this.quyetDinhId = null;
        await this.search();
    }

    checkRoleView(trangThai: string) {
        return !this.checkRoleApprove(trangThai) && this.userService.isAccessPermisson("QLKT_THSDK_DDDM_XEM")
    }
    checkRoleApprove(trangThai: string) {
        return trangThai === "78" && this.userService.isAccessPermisson("QLKT_THSDK_DDDM_DUYET") && this.userService.isCuc()
    }
    checkRoleExport() {
        return this.userService.isAccessPermisson("QLKT_THSDK_DDDM_EXP")
    }
}
