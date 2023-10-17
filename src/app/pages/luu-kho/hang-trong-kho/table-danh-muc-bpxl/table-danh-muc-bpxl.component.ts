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

  title : string = ''

  async ngOnInit() {
    await this.spinner.show();
    await Promise.all([
      this.bindingParam(),
    ])
    await this.buildTableView()
    await this.spinner.hide();
  }

  async bindingParam(){
    let trangThai = ''
    let typeBpxl = ''
    let vaiTro = 'CBTHUKHO'
    switch (this.router.url) {
      case '/luu-kho/hang-trong-kho/thanh-ly':
        typeBpxl = '1';
        this.title = 'thanh lý';
        break;
      case '/luu-kho/hang-trong-kho/tieu-huy':
        typeBpxl = '2';
        this.title = 'tiêu hủy';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-bao-hanh':
        typeBpxl = '3';
        this.title = 'bảo hành';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-giam-cl':
        typeBpxl = '4';
        this.title = 'bảo hành';
        break;
      case '/luu-kho/hang-trong-kho/hong-hoc-sua-chua':
        typeBpxl = '5';
        this.title = 'sửa chữa'
        break;
      case '/luu-kho/hang-trong-kho/sap-het-han-bao-hanh':
        typeBpxl = '6';
        this.title = 'sắp hết hạn bảo hành';
        vaiTro = null;
        trangThai = null;
        break;
      case '/luu-kho/hang-trong-kho/het-han-luu-kho':
        typeBpxl = '7';
        this.title = 'sửa chữa'
        vaiTro = null;
        trangThai = null;
        break;
      case '/luu-kho/hang-trong-kho/da-het-han':
        typeBpxl = '8';
        this.title = 'đã hết hạn bảo hành, chưa hết hạn lưu kho'
        vaiTro = null;
        trangThai = null;
        break;
      default :
        break;
    }
    this.formData.patchValue({
      bienPhapXl : typeBpxl,
      trangThai : trangThai,
      vaiTro : vaiTro
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
