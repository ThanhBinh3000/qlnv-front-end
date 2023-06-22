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
import { chain, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  BangKeCanCtvtService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service";
// import { XuatCuuTroVienTroComponent } from 'src/app/pages/xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro-vien-tro.component';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { BangKeCanHangDieuChuyenService } from '../services/dcnb-bang-ke-can-hang.service';

@Component({
  selector: 'app-xuat-dcnb-bang-ke-can',
  templateUrl: './bang-ke-can.component.html',
  styleUrls: ['./bang-ke-can.component.scss']
})
export class BangKeCanXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() isVatTu: boolean;
  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  // public vldTrangThai: XuatCuuTroVienTroComponent;
  public CHUC_NANG = CHUC_NANG;
  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isView = false;
  expandSetString = new Set<string>();
  dataView: any = [];
  idPhieuXk: number = 0;
  openPhieuXk = false;
  LIST_TRANG_THAI = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
    [this.STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
    [this.STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private bangKeCanHangDieuChuyenService: BangKeCanHangDieuChuyenService,
    // private xuatCuuTroVienTroComponent: XuatCuuTroVienTroComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangDieuChuyenService);
    // this.vldTrangThai = xuatCuuTroVienTroComponent;
    this.formData = this.fb.group({
      id: [0],
      nam: [],
      soQdGiaoNvXh: [],
      soBangKe: [],
      isVatTu: [],
      tuNgay: [],
      denNgay: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      ngayKetThuc: [],
      type: [],
      loaiDc: []
    })
  }


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
      isVatTu: this.isVatTu,
      loaiDc: this.loaiDc,
      type: "00",
      thayDoiThuKho: this.thayDoiThuKho
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

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdinh")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            let rsx = chain(v).groupBy("maLoKho").map((x, ix) => {
              const rowLv3 = x.find(f => f.maLoKho == ix);
              return {
                ...rowLv3,
                idVirtual: uuidv4(),
                childData: rowLv3?.phieuXuatKhoId ? x : []
              }
            }).value();
            return {
              ...rowLv2,
              idVirtual: uuidv4(),
              childData: rsx
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQdinh === key);
        return {
          ...rowLv1,
          idVirtual: uuidv4(),
          childData: rs
        };
      }).value();
    this.dataView = dataView;
    this.expandAll()
  }

  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      Array.isArray(s.childData) && s.childData.forEach(element => {
        this.expandSetString.add(element.idVirtual);
      });
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  editRow(lv2: any, isView: boolean) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
  }

  async deleteRow(lv2: any) {
    await this.delete(lv2);
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
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
  checkRoleAdd(trangThai: string): boolean {
    return this.userService.isChiCuc() && !trangThai
  }
  checkRoleView(trangThai: string): boolean {
    return !this.checkRoleAdd(trangThai) && !this.checkRoleEdit(trangThai) && !this.checkRoleDuyet(trangThai) && !this.checkRoleDelete(trangThai)
  }
  checkRoleEdit(trangThai: string): boolean {
    return this.userService.isChiCuc() && (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_LDCC)
  }
  checkRoleDuyet(trangThai: string): boolean {
    return this.userService.isChiCuc() && trangThai == STATUS.CHO_DUYET_LDCC
  }
  checkRoleDelete(trangThai: string): boolean {
    return this.userService.isChiCuc() && trangThai == STATUS.DU_THAO
  }

  disabledTuNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgay) {
      return startValue.getTime() > this.formData.value.denNgay.getTime();
    }
    return false;
  };

  disabledDenNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tuNgay) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgay.getTime();
  };
}
