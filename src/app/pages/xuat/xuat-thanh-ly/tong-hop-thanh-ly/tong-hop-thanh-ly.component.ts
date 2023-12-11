import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from "src/app/constants/message";
import { chain , isEmpty } from "lodash";
import { TongHopThanhLyService } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import { ChitietThComponent } from './chitiet-th/chitiet-th.component';
import { ThemmoiThComponent } from './themmoi-th/themmoi-th.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Base3Component } from 'src/app/components/base3/base3.component';
import {DonviService} from "../../../../services/donvi.service";

@Component({
  selector: 'app-tong-hop-thanh-ly',
  templateUrl: './tong-hop-thanh-ly.component.html',
  styleUrls: ['./tong-hop-thanh-ly.component.scss']
})
export class TongHopThanhLyComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: TongHopThanhLyService,
    private donviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      nam: null,
      maDanhSach: null,
      maDviSr: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.loadDsDonVi(),
      this.search(),
    ])
    this.buildTableView()
    await this.spinner.hide();

  }

  async buildTableView() {
    await this.dataTable.forEach(item => {
      item.expandSet = true;
      item.groupChiCuc = chain(item.children).groupBy('xhTlDanhSachHdr.tenChiCuc').map((value, key) => ({
        tenDonVi: key,
        children: value,
      })
      ).value()
    })
  }

  dsDonvi: any[] = [];
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
    const modalGT = this.modal.create({
      nzTitle: 'TỔNG HỢP DANH SÁCH HÀNG CẦN THANH LÝ',
      nzContent: ThemmoiThComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '700px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (data) {
        this.searchData()
      }
    });
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
