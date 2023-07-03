import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../../services/storage.service";

@Component({
    selector: 'app-dcnb-ghc-ktclvt-ho-so-ky-thuat',
    templateUrl: './dcnb-ghc-ktclvt-ho-so-ky-thuat.component.html',
    styleUrls: ['./dcnb-ghc-ktclvt-ho-so-ky-thuat.component.scss']
})
export class DCNBGHCKtclvtHoSoKyThuatComponent extends Base2Component implements OnInit {
    tabSelected: number = 0;

    selectTab(tab: number) {
        this.tabSelected = tab;
    }

    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, undefined);
    }

    ngOnInit(): void {
    }

}
