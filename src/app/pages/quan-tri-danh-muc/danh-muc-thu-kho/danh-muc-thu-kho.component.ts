import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from "../../../services/user.service";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { ThemmoiThukhoComponent } from './themmoi-thukho/themmoi-thukho.component';
import { DanhMucThuKhoService } from 'src/app/services/danh-muc-thu-kho.service';
import { DatePipe } from '@angular/common';
import {Router} from "@angular/router";


@Component({
  selector: 'app-danh-muc-thu-kho',
  templateUrl: './danh-muc-thu-kho.component.html',
  styleUrls: ['./danh-muc-thu-kho.component.scss']
})
export class DanhMucThuKhoComponent extends Base2Component implements OnInit {

  listTrangThai = [
    { "ma": "Hoạt", "giaTri": "Hoạt động" },
    { "ma": "Không", "giaTri": "Không hoạt động" }
  ];
  datePipe = new DatePipe('en-US');

  listDvi :any = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    userService: UserService,
    private router: Router,
    private donviService: DonviService,
    private danhMucThuKhoService: DanhMucThuKhoService
  ) {
    super(httpClient, storageService, notification, spinner, modal, userService);
    this.formData = this.fb.group({
      maThuKho: null,
      fullName: null,
      cccd: null,
      status: null,
      position: "CBTHUKHO",
      maDviLike : this.userInfo.MA_DVI,
      maDvi : null
    })
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_THU_KHO')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.loadDsChiCuc();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      position: "CBTHUKHO",
      maDviLike : this.userInfo.MA_DVI
    })
    this.search();
  }

  export() {

  }

  async search() {
    this.spinner.show();
    await super.search();
    this.spinner.hide()
  }

  getDetail(data) {
    this.danhMucThuKhoService.getDetail(data.id).then((res) => {
      res.data?.forEach(i => {
        i.tuNgayFormat = this.datePipe.transform(i.tuNgay, 'dd/MM/yyyy')
        i.denNgayFormat = i.denNgay ? this.datePipe.transform(i.tuNgay, 'dd/MM/yyyy') : ''
      });
      const modalQD = this.modal.create({
        nzTitle: 'Xem lịch sử giao kho',
        nzContent: DialogTableSelectionComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTable: res.data,
          dataHeader: ['Từ ngày', 'Đến ngày', 'Quản lý kho'],
          dataColumn: ['tuNgayFormat', 'denNgayFormat', 'quanLyKho'],
          isView: true
        },
      });
    });
  }

  edit(data) {
    this.spinner.show();
    this.donviService.layTatCaDviDmKho({ 'maDvi': data.dvql, 'type': ['DV', 'MLK'] }).then((res) => {
      this.spinner.hide();
      const modalQD = this.modal.create({
        nzTitle: 'Giao kho cho thủ kho',
        nzContent: ThemmoiThukhoComponent,
        nzMaskClosable: false,
        nzClosable: true,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {
          dataTree: res.data,
          idThuKho: data.id
        },
      });
    });

  }

  async loadDsChiCuc() {
    let res = await this.donviService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.listDvi = res.data
      this.listDvi = this.listDvi.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

}
