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
import { BienBanSapNhapKhoService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/bien-ban-sap-nhap-kho.service';


@Component({
    selector: 'app-bien-ban-sap-nhap-kho',
    templateUrl: './bien-ban-sap-nhap-kho.component.html',
    styleUrls: ['./bien-ban-sap-nhap-kho.component.scss']
})
export class BienBanSapNhapKhoComponent extends Base2Component implements OnInit {

    CHUC_NANG = CHUC_NANG;
    STATUS = STATUS;

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private bienBanSapNhapKhoService: BienBanSapNhapKhoService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, bienBanSapNhapKhoService);
        this.formData = this.fb.group({
            tenDvi: [],
            maDvi: [],
            nam: [],
            soBienBan: [],
            soQuyetDinh: [],
            trichYeu: [],
            ngayKyTu: [],
            ngayKyDen: [],
            trangThai: [],
        })
    }

    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    isVatTu: boolean = false;
    isView = false;
    children: any = [];
    listTrangThai: any[] = [
        { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Hoàn thành" },
    ];
    ObTrangThai: { [key: string]: string } = {
        [this.STATUS.DU_THAO]: "Dự thảo",
        [this.STATUS.DA_HOAN_THANH]: "Hoàn thành"
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

    ngOnInit(): void {
        try {
            this.initData()
            this.timKiem();
        } catch (e) {
            console.log('error: ', e)
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }

    async search(roles?): Promise<void> {
        await super.search(roles);
    }

    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.userdetail.maDvi = this.userInfo.MA_DVI;
        this.userdetail.tenDvi = this.userInfo.TEN_DVI;
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

    redirectDetail(id, b: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isView = b;
    }

    async showList() {
        this.isDetail = false;
        await this.search();
    }
    checkRoleAdd() {
        return this.userService.isAccessPermisson("QLKT_THSDK_BBSN_THEM") && this.userService.isChiCuc()
    };
    checkRoleDeleteAll() {
        return this.userService.isAccessPermisson("QLKT_THSDK_BBSN_XOA") && this.userService.isChiCuc()
    };
    checkRoleView(trangThai: string) {
        return !this.checkRoleEdit(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson("QLKT_THSDK_BBSN_XEM")
    };
    checkRoleEdit(trangThai: string) {
        return trangThai === STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_BBSN_THEM") && this.userService.isChiCuc()
    };
    checkRoleDelete(trangThai: string) {
        return trangThai === STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_BBSN_XOA") && this.userService.isChiCuc()
    }
    checkRoleExport() {
        return this.userService.isAccessPermisson("QLKT_THSDK_BBSN_EXP")
    }
}
