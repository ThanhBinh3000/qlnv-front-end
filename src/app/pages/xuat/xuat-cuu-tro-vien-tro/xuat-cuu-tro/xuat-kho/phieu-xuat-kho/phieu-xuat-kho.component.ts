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
import { chain, groupBy } from 'lodash';
import * as uuid from "uuid";
import { PhieuXuatKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { CuuTroVienTroComponent } from '../../cuu-tro-vien-tro.component';
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { PhieuKiemNghiemChatLuongService } from './../../../../../../services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service';
import { BienBanLayMauService } from 'src/app/services/qlnv-hang/xuat-hang/chung/xuat-kho/PhieuXuatKho.service';

@Component({
  selector: 'app-phieu-xuat-kho',
  templateUrl: './phieu-xuat-kho.component.html',
  styleUrls: ['./phieu-xuat-kho.component.scss']
})
export class PhieuXuatKhoComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Input() loaiXuat: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    private phieuXuatKhoService: PhieuXuatKhoService,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    public bienBanLayMauService: BienBanLayMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soPhieuXuatKho: null,
      ngayXuatKho: null,
      ngayXuatKhoTu: null,
      ngayXuatKhoDen: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      tenDiemKho: '',
      tenLoKho: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      soPhieuKnCl: '',
      ngayKn: '',
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
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  openQdGnv: boolean;
  idQdGnv: number;
  disabledStartNgayXk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayXuatKhoDen) {
      return startValue.getTime() >= this.formData.value.ngayXuatKhoDen.getTime();
    }
    return false;
  };

  disabledEndNgayXk = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatKhoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatKhoTu.getTime();
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
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      type: this.loaiXuat
    });
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
    await this.spinner.show();
    try {
      if (this.formData.value.ngayXuatKho) {
        this.formData.value.ngayXuatKhoTu = dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD')
        this.formData.value.ngayXuatKhoDen = dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    const newData = this.dataTable.map(f => ({ ...f, maNganLoKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho }))
    const dataView = chain(newData)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        const quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        const rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            const diaDiem = v.find(s => s.maDiemKho === k);
            const rs1 = chain(v).groupBy("maNganLoKho").map((v1, k1) => {
              const nganLoKho = v1.find(f => f.maNganLoKho == k1);
              if (!nganLoKho) return;
              return {
                idVirtual: uuid.v4(),
                tenLoKho: nganLoKho.tenLoKho,
                tenNganKho: nganLoKho.tenNganKho,
                tenNhaKho: nganLoKho.tenNhaKho,
                soPhieuKnCl: nganLoKho.soPhieuKnCl,
                idPhieuKnCl: nganLoKho.idPhieuKnCl,
                ngayKn: nganLoKho.ngayKn,
                childData: v1
              }
            }).value().filter(f => !!f)
            if (!diaDiem) return;
            return {
              idVirtual: uuid.v4(),
              tenDiemKho: diaDiem.tenDiemKho,
              childData: rs1
            }
          }
          ).value().filter(f => !!f);
        if (!quyetDinh) return;
        const nam = quyetDinh ? quyetDinh.nam : null;
        const ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          idQdGiaoNvXh: quyetDinh ? quyetDinh.idQdGiaoNvXh : null,
          nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: rs
        };
      }).value().filter(f => !!f);
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

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }
  openQdGnvModal(id: number): void {
    this.idQdGnv = id;
    this.openQdGnv = true;
  }
  closeQdGnvModal() {
    this.idQdGnv = null;
    this.openQdGnv = false;
  }
  async showList() {
    this.isDetail = false;
    await this.search();
  }
  checkRoleExport() {
    return this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_EXP");
  }
  checkRoleAdd(): boolean {
    return this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_THEM") && this.userService.isChiCuc();
  }
  checkRoleView(trangThai: STATUS, idBangKeCh: number): boolean {
    return !this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai, idBangKeCh) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_XEM")
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    return [STATUS.DU_THAO, STATUS.TU_CHOI_LDCC].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_THEM") && this.userService.isChiCuc();
  }
  checkRoleApprove(trangThai: STATUS): boolean {
    return trangThai === STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_DUYET") && this.userService.isChiCuc();
  }
  checkRoleDelete(trangThai: STATUS, idBangKeCh: number): boolean {
    return trangThai === STATUS.DU_THAO && !idBangKeCh && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_XOA") && this.userService.isChiCuc();
  }
}

