import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DonviService} from "../../../../services/donvi.service";
import {TinhTrangKhoHienThoiService} from "../../../../services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";
import {XuatDieuChuyenService} from "../xuat-dieu-chuyen.service";
import {DanhMucDungChungService} from "../../../../services/danh-muc-dung-chung.service";
import {MangLuoiKhoService} from "../../../../services/qlnv-kho/mangLuoiKho.service";

@Component({
  selector: 'app-dcnb-xuat-noi-bo-chi-cuc',
  templateUrl: './dcnb-xuat-noi-bo-chi-cuc.component.html',
  styleUrls: ['./dcnb-xuat-noi-bo-chi-cuc.component.scss']
})
export class DcnbXuatNoiBoChiCucComponent extends Base2Component implements OnInit {
  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private danhMucService: DanhMucService,
              private donViService: DonviService,
              private mangLuoiKhoService: MangLuoiKhoService,
              private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
              private dmTieuChuanService: DanhMucTieuChuanService,
              private keHoachDieuChuyenService: XuatDieuChuyenService,
              private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
              private dmService: DanhMucDungChungService,
              private cdr: ChangeDetectorRef,) {
    super(httpClient, storageService, notification, spinner, modal, keHoachDieuChuyenService);

  }


}
