import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {StorageService} from "../../../../../../services/storage.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";

@Component({
  selector: 'app-dcnb-nbcc-tdtk-xuat-kho-vat-tu',
  templateUrl: './dcnb-nbcc-tdtk-xuat-kho-vat-tu.component.html',
  styleUrls: ['./dcnb-nbcc-tdtk-xuat-kho-vat-tu.component.scss']
})
export class DcnbNbccTdtkXuatKhoVatTuComponent extends Base2Component implements OnInit {
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
