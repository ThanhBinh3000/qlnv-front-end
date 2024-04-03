import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";
import { HuongDanSuDungService } from 'src/app/services/tro-giup/huong-dan-su-dung.service';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { FileDinhKem } from 'src/app/models/CuuTro';

@Component({
    selector: 'app-huong-dan-su-dung',
    templateUrl: './huong-dan-su-dung.component.html',
    styleUrls: ['./huong-dan-su-dung.component.scss']
})
export class HuongDanSuDungComponent extends Base2Component implements OnInit {
    listPhanLoai: any[] = []
    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private danhMucDungChungService: DanhMucDungChungService,
        private huongDanSuDungService: HuongDanSuDungService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, huongDanSuDungService);
        this.formData = this.fb.group({
            title: [],
            classify: [],
            status: [],
            dateCreated: [],
            startDate: [],
            endDate: [],
        })
    }
    disabledStartDate = (startValue: Date): boolean => {
        if (startValue && this.formData.value.endDate) {
            return startValue.getTime() > this.formData.value.endDate.getTime();
        } else {
            return false;
        }
    };

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.startDate) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.startDate.getTime();
    };

    async ngOnInit() {
        try {
            this.initData()
            await this.timKiem();
            await this.spinner.hide();

        } catch (e) {
            console.log('error: ', e)
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
    }

    async initData() {
        this.userInfo = this.userService.getUserLogin();
        await this.loadDsPhanLoai();
    }

    async loadDsPhanLoai() {
        const res = await this.danhMucDungChungService.search({ loai: "PHAN_LOAI_THONG_TIN" });
        if (res.msg !== MESSAGE.SUCCESS) return;
        this.listPhanLoai = Array.isArray(res?.data?.content) ? res.data.content : [];
    }
    downloadFile(item: FileDinhKem) {
        this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
            saveAs(blob, item.fileName);
        });
    }
    async timKiem() {
        await this.spinner.show();
        try {
            let body = this.formData.value
            body.paggingReq = {
                limit: this.pageSize,
                page: this.page - 1
            }
            let res = await this.huongDanSuDungService.getDanhSachHuongDan(body);
            if (res.msg == MESSAGE.SUCCESS) {
                let data = res.data;
                this.dataTable = data.content;
                this.totalRecord = data.totalElements;
                if (this.dataTable && this.dataTable.length > 0) {
                    this.dataTable.forEach((item) => {
                        item.checked = false;
                    });
                }
                this.dataTableAll = cloneDeep(this.dataTable);
            } else {
                this.dataTable = [];
                this.totalRecord = 0;
                this.notification.error(MESSAGE.ERROR, res.msg);
            }
        } catch (e) {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            await this.spinner.hide();
        }
    }
}
// @NgModule({
//     declarations: [
//         HuongDanSuDungComponent
//     ],
//     imports: [
//         CommonModule,
//         DirectivesModule,
//         NzStatisticModule,
//         NzPipesModule,
//         MainModule,
//         ComponentsModule,
//     ],
//     providers: [DatePipe],
// })
// export class HuongDanSuDungModule {
// }