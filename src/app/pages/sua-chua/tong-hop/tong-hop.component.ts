import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { MmHienTrangMmService } from 'src/app/services/mm-hien-trang-mm.service';
import { StorageService } from 'src/app/services/storage.service';
import { TongHopScService } from 'src/app/services/sua-chua/tongHopSc.service';
import { ThemmoiThComponent } from './themmoi-th/themmoi-th.component';
import {MESSAGE} from "../../../constants/message";
import { cloneDeep, chain } from 'lodash';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base3Component implements OnInit {

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

  async ngOnInit(){
    await this.search();
    this.buildTableView()
  }

  buildTableView() {
    console.log(this.dataTable)
    this.dataTable.forEach( item => {
      item.expandSet = true;
      item.groupChiCuc = chain(item.children).groupBy('scDanhSachHdr.tenChiCuc').map((value, key) => ({
          tenDonVi: key,
          children: value,
        })
      ).value()
    })
  }

  openDialogDs() {
    if(this.userService.isAccessPermisson('SCHDTQG_THDSCSC_TONGHOP')){
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

}
