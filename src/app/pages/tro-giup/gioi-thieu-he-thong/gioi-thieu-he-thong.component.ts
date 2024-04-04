import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HuongDanSuDungService } from 'src/app/services/tro-giup/huong-dan-su-dung.service';

@Component({
    selector: 'app-gioi-thieu-he-thong',
    templateUrl: './gioi-thieu-he-thong.component.html',
})
export class GioiThieuHeThongComponent extends Base2Component implements OnInit {
    listPhanLoai: any[] = []
    content: any;
    showGioiThieu: boolean = false;
    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private huongDanSuDungService: HuongDanSuDungService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, huongDanSuDungService);
    }

    async ngOnInit() {
        try {
            await this.timKiemGioiThieuMoiNhat();
            await this.spinner.hide();

        } catch (e) {
            console.log('error: ', e)
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }


    async timKiemGioiThieuMoiNhat() {
        await this.spinner.show();
        try {
            const body = {
                // classify: "1",
                status: true
            }
            let res = await this.huongDanSuDungService.getDanhSachHuongDan(body);
            if (res.msg == MESSAGE.SUCCESS) {
                let data = res.data;
                this.dataTable = Array.isArray(data.content) ? data.content : [];
                this.content = cloneDeep(this.dataTable)[0]?.content;
                if (this.content) {
                    this.showGioiThieu = true;
                }
            } else {
                this.dataTable = [];
                this.notification.error(MESSAGE.ERROR, res.msg);
            }
        } catch (e) {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            await this.spinner.hide();
        }
    }
    closeDlg() {
        this.showGioiThieu = false;
    }
}
