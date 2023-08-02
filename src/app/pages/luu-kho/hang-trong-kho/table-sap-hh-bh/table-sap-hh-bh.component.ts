import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {TongHopScService} from "../../../../services/sua-chua/tongHopSc.service";
import {ThemmoiThComponent} from "../../../sua-chua/tong-hop/themmoi-th/themmoi-th.component";
import {MESSAGE} from "../../../../constants/message";
import {ChitietThComponent} from "../../../sua-chua/tong-hop/chitiet-th/chitiet-th.component";
import {Base3Component} from "../../../../components/base3/base3.component";
import { cloneDeep, chain } from 'lodash';

@Component({
  selector: 'app-table-sap-hh-bh',
  templateUrl: './table-sap-hh-bh.component.html',
  styleUrls: ['./table-sap-hh-bh.component.scss']
})
export class TableSapHhBhComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private tongHopScService: TongHopScService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, tongHopScService);
    this.formData = this.fb.group({
      nam: null,
      maSc: null,
      maCc: null,
      ngayTu: null,
      ngayDen: null,
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      // this.search(),
    ])
    this.buildTableView()
    await this.spinner.hide();

  }

  async buildTableView() {
    await this.dataTable.forEach(item => {
      item.expandSet = true;
      item.groupChiCuc = chain(item.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
          tenDonVi: key,
          children: value,
        })
      ).value()
    })
    console.log(this.dataTable)
  }

  openDialogDs() {
    if (this.userService.isAccessPermisson('SCHDTQG_THDSCSC_TONGHOP')) {
      const modalGT = this.modal.create({
        nzTitle: 'Tổng hợp danh sách cần sửa chữa',
        nzContent: ThemmoiThComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
    }
  }

  showDetail(idTh) {
    if (idTh) {
      const modalGT = this.modal.create({
        nzTitle: 'Tổng hợp danh sách cần sửa chữa',
        nzContent: ChitietThComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          id: idTh
        },
      });
      modalGT.afterClose.subscribe((data) => {
        if (data) {
          this.ngOnInit()
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }
  }

}
