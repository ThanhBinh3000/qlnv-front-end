import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import dayjs from "dayjs";
import { UserLogin } from "src/app/models/userlogin";
import { MESSAGE } from "src/app/constants/message";
import { chain, isEmpty, groupBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  BangKeCanCtvtService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service";
import { CHUC_NANG } from "../../../../../../constants/status";
import { CuuTroVienTroComponent } from "../../cuu-tro-vien-tro.component";

@Component({
  selector: 'app-bang-ke-can',
  templateUrl: './bang-ke-can.component.html',
  styleUrls: ['./bang-ke-can.component.scss']
})
export class BangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() loaiXuat: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;
  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  expandSetString = new Set<string>();
  dataView: any = [];
  idPhieuXk: number = 0;
  openPhieuXk: boolean = false;
  idPhieuKnCl: number = 0;
  openPhieuKnCl: boolean = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    private bangKeCanCtvtService: BangKeCanCtvtService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanCtvtService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      id: [0],
      nam: [],
      soQdGiaoNvXh: [],
      soBangKe: [],
      loaiVthh: [],
      thoiGianGiaoNhan: [],
      thoiGianGiaoNhanTu: [],
      thoiGianGiaoNhanDen: [],
      ngayQdGiaoNvXh: [],
      ngayXuat: [],
      ngayXuatTu: [],
      ngayXuatDen: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      ngayKetThuc: [],
      type: []
    })
  }

  disabledStartNgayQd = (startValue: Date): boolean => {
    if (startValue && this.formData.value.thoiGianGiaoNhanDen) {
      return startValue.getTime() >= this.formData.value.thoiGianGiaoNhanDen.getTime();
    }
    return false;
  };

  disabledEndNgayQd = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.thoiGianGiaoNhanTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.thoiGianGiaoNhanTu.getTime();
  };

  disabledStartNgayXk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayXuatDen) {
      return startValue.getTime() >= this.formData.value.ngayXuatDen.getTime();
    }
    return false;
  };

  disabledEndNgayXk = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatTu.getTime();
  };

  async ngOnInit() {
    try {
      this.initData()
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    this.formData.patchValue({ loaiVthh: this.loaiVthh })
    await this.loadDsTong();
  }

  async loadDsTong() {
    /*const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };*/
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }

  }

  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    this.formData.patchValue({
      // loaiVthh: this.loaiVthh,
      type: this.loaiXuat
    });
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayDx) {
        this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
        this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
      }
      if (this.formData.value.ngayKetThuc) {
        this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  expandAll() {
    this.dataView.forEach(s => {
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

  buildTableView() {
    const newData = this.dataTable.map(f => ({ ...f, maNganLoKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho }))
    let dataView = chain(newData)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            const rowLv3 = chain(v).groupBy("maNganLoKho").map((v1, k1) => {
              const nganLoKho = v1.find(f => f.maNganLoKho == k1);
              if (!nganLoKho) return;
              return {
                idVirtual: uuidv4(),
                tenDiemKho: rowLv2 ? rowLv2.tenDiemKho : '',
                tenNhaKho: rowLv2 ? rowLv2.tenNhaKho : '',
                tenNganKho: rowLv2 ? rowLv2.tenNganKho : '',
                tenLoKho: rowLv2 ? rowLv2.tenLoKho : '',
                soPhieuKnCl: nganLoKho.soPhieuKnCl,
                idPhieuKnCl: nganLoKho.idPhieuKnCl,
                ngayKn: nganLoKho.ngayKn,
                childData: v1
              }
            }).value().filter(f => !!f);
            if (!rowLv2) return;
            return {
              id: rowLv2 ? rowLv2.id : null,
              idVirtual: uuidv4(),
              tenDiemKho: rowLv2.tenDiemKho,
              childData: rowLv3
            }
          }).value().filter(f => !!f);
        let rowLv1 = value.find(s => s.soQdGiaoNvXh === key);
        if (!rowLv1) return;
        return {
          idVirtual: uuidv4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: rowLv1 ? rowLv1.nam : null,
          thoiGianGiaoNhan: rowLv1 ? rowLv1.thoiGianGiaoNhan : null,
          childData: rs
        };
      }).value().filter(f => !!f);
    this.dataView = dataView
    this.expandAll()
  }

  editRow(lv2: any, isView: boolean) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  async deleteRow(lv2: any) {
    await this.delete(lv2);
  }
  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }
  openPhieuXkModal(id: number) {
    console.log(id, 'id');
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }
}
