import { Component, OnInit, Input } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import * as uuid from "uuid";
import { PhieuXuatKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import { BienBanTinhKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanTinhKho.service';

@Component({
  selector: 'app-bien-ban-tinh-kho',
  templateUrl: './bien-ban-tinh-kho.component.html',
  styleUrls: ['./bien-ban-tinh-kho.component.scss']
})
export class BienBanTinhKhoComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoService);
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soBbTinhKho: null,
      ngayBatDauXuat: null,
      ngayBatDauXuatTu: null,
      ngayBatDauXuatDen: null,
      ngayKetThucXuat: null,
      ngayKetThucXuatTu: null,
      ngayKetThucXuatDen: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      soBbTinhKho: '',
      ngayBatDauXuat: '',
      ngayKetThucXuat: '',
      tenDiemKho: '',
      tenLoKho: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      soBkCanHang: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();


  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
    this.buildTableView();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }
  async timKiem() {
    if (this.formData.value.ngayBatDauXuat) {
      this.formData.value.ngayBatDauXuatTu = dayjs(this.formData.value.ngayBatDauXuat[0]).format('YYYY-MM-DD')
      this.formData.value.ngayBatDauXuatDen = dayjs(this.formData.value.ngayBatDauXuat[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKetThucXuat) {
      this.formData.value.ngayKetThucXuatTu = dayjs(this.formData.value.ngayKetThucXuat[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKetThucXuatDen = dayjs(this.formData.value.ngayKetThucXuat[1]).format('YYYY-MM-DD')
    }
    this.formData.value.loaiVthh = this.loaiVthh;
    this.formData.value.type = "XUAT_CAP";
    await this.search();
    this.dataTable.forEach(s => s.idVirtual = uuid.v4());
    this.buildTableView();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        let rs = chain(value)
          .groupBy("soBbTinhKho")
          .map((v, k) => {
            let soBb = v.find(s => s.soBbTinhKho === k)
            return {
              idVirtual: uuid.v4(),
              soBbTinhKho: k,
              tenDiemKho: soBb.tenDiemKho,
              tenLoKho: soBb.tenLoKho,
              ngayBatDauXuat: soBb.ngayBatDauXuat,
              ngayKetThucXuat: soBb.ngayKetThucXuat,
              trangThai: soBb.trangThai,
              tenTrangThai: soBb.tenTrangThai,
              maDvi: soBb.maDvi,
              id: soBb.id,
              childData: v
            }
          }
          ).value();
        let nam = quyetDinh.nam;
        let ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key, nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: rs
        };
      }).value();
    this.children = dataView
    this.expandAll()

  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }
}
