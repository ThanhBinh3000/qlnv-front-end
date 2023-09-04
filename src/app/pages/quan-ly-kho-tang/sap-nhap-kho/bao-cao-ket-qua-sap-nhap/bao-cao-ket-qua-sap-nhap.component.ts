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
    selector: 'app-bao-cao-ket-qua-sap-nhap',
    templateUrl: './bao-cao-ket-qua-sap-nhap.component.html',
    styleUrls: ['./bao-cao-ket-qua-sap-nhap.component.scss']
})
export class BaoCaoKetQuaSapNhapComponent extends Base2Component implements OnInit {

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
            soBaoCao: [],
            soBienBanSapNhap: [],
            noiDung: [],
            ngayBaoCaoTu: [],
            ngayBaoCaoDen: [],
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
        { ma: this.STATUS.BAN_HANH, giaTri: "Hoàn thành" },
    ];
    ObTrangThai: { [key: string]: string } = {
        [this.STATUS.DU_THAO]: "Dự thảo",
        [this.STATUS.BAN_HANH]: "Hoàn thành"
    }
    disabledStartNgayKy = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayBaoCaoDen) {
            return startValue.getTime() >= this.formData.value.ngayBaoCaoDen.getTime();
        }
        return false;
    };

    disabledEndNgayKy = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayBaoCaoTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayBaoCaoTu.getTime();
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

}
