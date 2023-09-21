import { Component, OnInit } from '@angular/core';
import { XuatThanhLyComponent } from "src/app/pages/xuat/xuat-thanh-ly/xuat-thanh-ly.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";
import { CHUC_NANG } from 'src/app/constants/status';
import { chain, isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { TongHopThanhLyService } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import { FormGroup } from "@angular/forms";
import { DanhSachThanhLyService } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/DanhSachThanhLy.service";
import { NumberToRoman } from 'src/app/shared/commonFunction';
import { ChitietThComponent } from './chitiet-th/chitiet-th.component';
import { ThemmoiThComponent } from './themmoi-th/themmoi-th.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TongHopScService } from 'src/app/services/sua-chua/tongHopSc.service';
import { Base3Component } from 'src/app/components/base3/base3.component';

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
    private tongHopThanhLyService: TongHopThanhLyService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, tongHopThanhLyService);
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
