import {Component, OnInit} from '@angular/core';
import {Base3Component} from "../../../../components/base3/base3.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {MESSAGE} from "../../../../constants/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {ChitietThComponent} from "../../../sua-chua/tong-hop/chitiet-th/chitiet-th.component";
import {TheoDoiBqDtlService} from "../../../../services/luu-kho/theoDoiBqDtl.service";
import { chain } from 'lodash';

@Component({
  selector: 'app-table-danh-muc-bpxl',
  templateUrl: './table-danh-muc-bpxl.component.html',
  styleUrls: ['./table-danh-muc-bpxl.component.scss']
})
export class TableDanhMucBpxlComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqDtlService: TheoDoiBqDtlService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqDtlService);
    this.formData = this.fb.group({
      nam: null,
      maSc: null,
      maCc: null,
      ngayTu: null,
      ngayDen: null,
      bienPhapXl : null,
      vaiTro : 'CBTHUKHO',
      trangThai : this.STATUS.DA_HOAN_THANH
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.bindingParam(),
    ])
    await this.buildTableView()
    await this.spinner.hide();
  }

  async bindingParam(){
    let typeBpxl = ''
    switch (this.router.url) {
      case '/luu-kho/hang-trong-kho/thanh-ly':
        typeBpxl = '1';
        break;
      case '/luu-kho/hang-trong-kho/tieu-huy':
        typeBpxl = '2';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-bao-hanh':
        typeBpxl = '3';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-giam-cl':
        typeBpxl = '4';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-sua-chua':
        typeBpxl = '5';
        break;
      default :
        break;
    }
    this.formData.patchValue({
      bienPhapXl : typeBpxl
    })
    await this.searchList();
  }

  async buildTableView() {
    this.dataTableAll = chain(this.dataTable).groupBy('tenLoaiVthh').map((value, key) => {
        let rs =  chain(value).groupBy('tenCloaiVthh').map((v,k)=>{
          return {
            tenCloaiVthh: k,
            expandSet : true,
            children: v,
          };
        }).value();
        return {
          tenLoaiVthh: key,
          expandSet : true,
          chilren: rs
        };
    }).value();
  }

  async searchList(){
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.theoDoiBqDtlService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTable = res.data;
      this.buildTableView();
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  showDetail(data) {
    this.router.navigate(['luu-kho/theo-doi-bao-quan/chi-tiet', data.idHdr]);
  }

}
