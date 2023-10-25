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
import { CuuTroVienTroComponent } from "../../cuu-tro-vien-tro.component";
import { CHUC_NANG } from "../../../../../../constants/status";

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
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bienBanTinhKhoService: BienBanTinhKhoService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
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
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idBangKe: number = 0;
  openBangKe = false;

  disabledStartNgayBd = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayBatDauXuatDen) {
      return startValue.getTime() >= this.formData.value.ngayBatDauXuatDen.getTime();
    }
    return false;
  };

  disabledEndNgayBd = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBatDauXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBatDauXuatTu.getTime();
  };

  disabledStartNgayKt = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKetThucXuatDen) {
      return startValue.getTime() >= this.formData.value.ngayKetThucXuatDen.getTime();
    }
    return false;
  };

  disabledEndNgayKt = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKetThucXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKetThucXuatTu.getTime();
  };

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      type: "XUAT_CTVT"
    });
    await super.search(roles);
    this.buildTableView();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    this.formData.patchValue({ loaiVthh: this.loaiVthh })
  }


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayBatDauXuat) {
        this.formData.value.ngayBatDauXuatTu = dayjs(this.formData.value.ngayBatDauXuat[0]).format('YYYY-MM-DD')
        this.formData.value.ngayBatDauXuatDen = dayjs(this.formData.value.ngayBatDauXuat[1]).format('YYYY-MM-DD')
      }
      if (this.formData.value.ngayKetThucXuat) {
        this.formData.value.ngayKetThucXuatTu = dayjs(this.formData.value.ngayKetThucXuat[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKetThucXuatDen = dayjs(this.formData.value.ngayKetThucXuat[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    console.log(this.dataTable, " key ? key : null,")
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
              soBbTinhKho: k != "null" ? k : '',
              tenDiemKho: soBb ? soBb.tenDiemKho : null,
              tenLoKho: soBb ? soBb.tenLoKho : null,
              ngayBatDauXuat: soBb ? soBb.ngayBatDauXuat : null,
              ngayKetThucXuat: soBb ? soBb.ngayKetThucXuat : null,
              trangThai: soBb ? soBb.trangThai : null,
              tenTrangThai: soBb ? soBb.tenTrangThai : null,
              maDvi: soBb ? soBb.maDvi : null,
              id: soBb ? soBb.id : null,
              childData: v ? v : null,
            }
          }
          ).value();
        let nam = quyetDinh ? quyetDinh.nam : null;
        let ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: nam,
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

  openPhieuXkModal(id: number) {
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }

  openBangKeModal(id: number) {
    this.idBangKe = id;
    this.openBangKe = true;
  }

  closeBangKeModal() {
    this.idBangKe = null;
    this.openBangKe = false;
  }
}
