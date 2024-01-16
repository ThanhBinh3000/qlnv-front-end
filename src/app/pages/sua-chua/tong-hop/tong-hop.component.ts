import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { StorageService } from 'src/app/services/storage.service';
import { TongHopScService } from 'src/app/services/sua-chua/tongHopSc.service';
import { ThemmoiThComponent } from './themmoi-th/themmoi-th.component';
import { MESSAGE } from "../../../constants/message";
import { cloneDeep, chain , isEmpty } from 'lodash';
import { ChitietThComponent } from "./chitiet-th/chitiet-th.component";
import {DonviService} from "../../../services/donvi.service";

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base3Component implements OnInit {

  dsDonvi: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private tongHopScService: TongHopScService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, tongHopScService);
    this.formData = this.fb.group({
      namSr: null,
      maDanhSach: null,
      ngayTu: null,
      ngayDen: null,
      maDviSr: null,
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.search(),
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
  }

  async loadDsDonVi() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }
  }

  openDialogDs(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    if (this.userService.isAccessPermisson('SCHDTQG_THDSCSC_TONGHOP')) {
      const modalGT = this.modal.create({
        nzTitle: 'TỔNG HỢP DANH SÁCH HÀNG CẦN SỬA CHỮA',
        nzContent: ThemmoiThComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
        },
      });
      modalGT.afterClose.subscribe((data) => {
        if (data) {
          this.searchData()
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ACCESS_DENIED);
    }
  }

  showDetail(idTh) {
    if (idTh) {
      const modalGT = this.modal.create({
        nzTitle: 'TỔNG HỢP DANH SÁCH CẦN SỬA CHỮA',
        nzContent: ChitietThComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '1500px',
        nzFooter: null,
        nzComponentParams: {
          id: idTh
        },
      });
      modalGT.afterClose.subscribe((data) => {
        if (data) {
          this.searchData()
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }
  }

  async searchData() {
    await this.search();
    await this.buildTableView()
  }

}
