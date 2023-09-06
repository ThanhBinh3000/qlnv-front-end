import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import {
    QuyetDinhDieuChuyenService
} from "../../../../services/qlnv-kho/dieu-chuyen-sap-nhap-kho/quyet-dinh-dieu-chuyen.service";
import { PhieuXuatHangHaoHutSapNhapService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/phieu-xuat-hang-hao-hut.service';
import { PhieuNhapHangSapNhapService } from 'src/app/services/qlnv-kho/dieu-chuyen-sap-nhap-kho/phieu-nhap-hang-sap-nhap.service';


@Component({
    selector: 'app-phieu-nhap-hang',
    templateUrl: './phieu-nhap-hang.component.html',
    styleUrls: ['./phieu-nhap-hang.component.scss']
})
export class PhieuNhapHangSapNhapComponent extends Base2Component implements OnInit {
    CHUC_NANG = CHUC_NANG;
    STATUS = STATUS;

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private quyetDinhDieuChuyenService: QuyetDinhDieuChuyenService,
        private phieuNhapHangSapNhapService: PhieuNhapHangSapNhapService
    ) {
        super(httpClient, storageService, notification, spinner, modal, phieuNhapHangSapNhapService);
        this.formData = this.fb.group({
            tenDvi: [],
            maDvi: [],
            nam: [],
            soPhieu: [],
            soQuyetDinh: [],
            ngayNhapKhoTu: [],
            ngayNhapKhoDen: [],
            trangThai: [],
        })
    }

    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    soQdGiaoNvXhSelected: string;
    isVatTu: boolean = false;
    isView = false;
    children: any = [];
    idPhieuKnCl: number = 0;
    openPhieuKnCl = false;
    // listTrangThai: any[] = [
    //     { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
    //     { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Hoàn thành" },
    // ];
    // ObTrangThai: { [key: string]: string } = {
    //     [this.STATUS.DU_THAO]: "Đang nhập dữ liệu",
    //     [this.STATUS.DA_HOAN_THANH]: "Hoàn thành"
    // }
    listTrangThai: any[] = [
        { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Hoàn thành" },
    ];
    ObTrangThai: { [key: string]: string } = {
        [this.STATUS.DU_THAO]: "Dự thảo",
        [this.STATUS.DA_HOAN_THANH]: "Hoàn thành"
    }
    disabledStartNgayKy = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayNhapKhoDen) {
            return startValue.getTime() >= this.formData.value.ngayNhapKhoDen.getTime();
        }
        return false;
    };

    disabledEndNgayKy = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayNhapKhoTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayNhapKhoTu.getTime();
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

    redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
        this.selectedId = id;
        this.isDetail = true;
        this.isView = b;
        this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
    }

    async showList() {
        this.isDetail = false;
        await this.search();
    };

    checkRoleAdd() {
        return this.userService.isAccessPermisson("QLKT_THSDK_PNH_THEM") && this.userService.isChiCuc()
    };
    checkRoleDeleteAll() {
        return this.userService.isAccessPermisson("QLKT_THSDK_PNH_XOA") && this.userService.isChiCuc()
    };
    checkRoleView(trangThai: string) {
        return !this.checkRoleEdit(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson("QLKT_THSDK_PNH_XEM")
    };
    checkRoleEdit(trangThai: string) {
        return trangThai === STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_PNH_THEM") && this.userService.isChiCuc()
    };
    checkRoleDelete(trangThai: string) {
        return trangThai === STATUS.DU_THAO && this.userService.isAccessPermisson("QLKT_THSDK_PNH_XOA") && this.userService.isChiCuc()
    };
    checkRoleExport() {
        return this.userService.isAccessPermisson("QLKT_THSDK_PNH_EXP")
    }

}
