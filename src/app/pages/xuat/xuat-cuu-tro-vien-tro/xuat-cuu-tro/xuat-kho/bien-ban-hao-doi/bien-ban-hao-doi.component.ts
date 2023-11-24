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
import { BienBanHaoDoiService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanHaoDoi.service';
import { CHUC_NANG } from "../../../../../../constants/status";
import { CuuTroVienTroComponent } from "../../cuu-tro-vien-tro.component";
import { STATUS } from 'src/app/constants/status'
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service';
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { BienBanLayMauService } from 'src/app/services/qlnv-hang/xuat-hang/chung/xuat-kho/PhieuXuatKho.service';

@Component({
  selector: 'app-bien-ban-hao-doi',
  templateUrl: './bien-ban-hao-doi.component.html',
  styleUrls: ['./bien-ban-hao-doi.component.scss']
})
export class BienBanHaoDoiComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Input() loaiXuat: string
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bienBanHaoDoiService: BienBanHaoDoiService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    public bienBanLayMauService: BienBanLayMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soBbHaoDoi: null,
      ngayTaoBb: null,
      ngayTaoBbTu: null,
      ngayTaoBbDen: null,
      ngayBatDauXuat: null,
      ngayBatDauXuatTu: null,
      ngayBatDauXuatDen: null,
      ngayKetThucXuat: null,
      ngayKetThucXuatTu: null,
      ngayKetThucXuatDen: null,
      ngayQdGiaoNvXh: null,
      ngayQdGiaoNvXhTu: null,
      ngayQdGiaoNvXhDen: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      soBbHaoDoi: '',
      soBbTinhKho: '',
      ngayBatDauXuat: '',
      ngayKetThucXuat: '',
      tenDiemKho: '',
      tenLoKho: '',
      soBkCanHang: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  dataView: any = [];
  expandSetString = new Set<string>();

  idBbTk: number = 0;
  openBbTk = false;
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idBangKe: number = 0;
  openBangKe = false;
  idPhieuKnCl: number = 0;
  openPhieuKnCl: boolean = false;

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
  disabledStartNgayBb = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayTaoBbDen) {
      return startValue.getTime() >= this.formData.value.ngayTaoBbDen.getTime();
    }
    return false;
  };

  disabledEndNgayBb = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoBbTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoBbTu.getTime();
  };

  disabledStartNgayQd = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayQdGiaoNvXhDen) {
      return startValue.getTime() >= this.formData.value.ngayQdGiaoNvXhDen.getTime();
    }
    return false;
  };

  disabledEndNgayQd = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayQdGiaoNvXhTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayQdGiaoNvXhTu.getTime();
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
      // loaiVthh: this.loaiVthh,
      type: this.loaiXuat
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

  // buildTableView() {
  //   let dataView = chain(this.dataTable)
  //     .groupBy("soQdGiaoNvXh")
  //     .map((value, key) => {
  //       let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
  //       let rs = chain(value)
  //         .groupBy("soBbHaoDoi")
  //         .map((v, k) => {
  //           let soBb = v.find(s => s.soBbHaoDoi === k)
  //           return {
  //             idVirtual: uuid.v4(),
  //             soBbHaoDoi: k != "null" ? k : '',
  //             soBbTinhKho: soBb ? soBb.soBbTinhKho : null,
  //             tenDiemKho: soBb ? soBb.tenDiemKho : null,
  //             tenLoKho: soBb ? soBb.tenLoKho : null,
  //             ngayBatDauXuat: soBb ? soBb.ngayBatDauXuat : null,
  //             ngayKetThucXuat: soBb ? soBb.ngayKetThucXuat : null,
  //             trangThai: soBb ? soBb.trangThai : null,
  //             tenTrangThai: soBb ? soBb.tenTrangThai : null,
  //             maDvi: soBb ? soBb.maDvi : null,
  //             id: soBb ? soBb.id : null,
  //             childData: v
  //           }
  //         }
  //         ).value();
  //       let nam = quyetDinh ? quyetDinh.nam : null;
  //       let ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
  //       return {
  //         idVirtual: uuid.v4(),
  //         soQdGiaoNvXh: key != "null" ? key : '',
  //         nam: nam,
  //         ngayQdGiaoNvXh: ngayQdGiaoNvXh,
  //         childData: rs
  //       };
  //     }).value();
  //   this.children = dataView
  //   console.log(this.children, "this.children")
  //   this.expandAll()

  // }
  buildTableView() {
    const newData = this.dataTable.map(f => ({ ...f, maNganLoKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho }))
    this.dataView = chain(newData)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        const quyetDinh = value.find(f => f.soQdGiaoNvXh === key);
        if (!quyetDinh) return;
        const lv1 = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            const diemKho = v.find(s => s.maDiemKho === k);
            if (!diemKho) return;
            const lv2 = chain(v).groupBy('maNganLoKho').map((v1, k1) => {
              const nganLoKho = v1.find(f => f.maNganLoKho === k1);
              if (!nganLoKho) return;
              return {
                idVirtual: uuid.v4(),
                tenLoKho: nganLoKho.tenLoKho,
                tenNganKho: nganLoKho.tenNganKho,
                tenNhaKho: nganLoKho.tenNhaKho,
                soBbHaoDoi: nganLoKho.soBbHaoDoi,
                ngayTaoBb: nganLoKho.ngayTaoBb,
                soBbTinhKho: nganLoKho.soBbTinhKho,
                idBbTinhKho: nganLoKho.idBbTinhKho,
                soPhieuKnCl: nganLoKho.soPhieuKnCl,
                idPhieuKnCl: nganLoKho.idPhieuKnCl,
                trangThai: nganLoKho.trangThai,
                tenTrangThai: nganLoKho.tenTrangThai,
                maDvi: nganLoKho.maDvi,
                id: nganLoKho.id,
                childData: v1
              }

            }).value().filter(f => !!f)
            return {
              idVirtual: uuid.v4(),
              tenDiemKho: diemKho.tenDiemKho,
              childData: lv2,
            }
          }
          ).value().filter(f => !!f);
        const nam = quyetDinh.nam;
        const ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: lv1
        };
      }).value().filter(f => !!f);
    this.expandAll()

  }

  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
      s.childData.forEach(s1 => {
        this.expandSetString.add(s1.idVirtual);
        s1.childData.forEach(s2 => {
          this.expandSetString.add(s2.idVirtual);
        })
      })
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
    console.log(id, "id")
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }
  openBbTkModal(id: number) {
    console.log(id, "id")
    this.idBbTk = id;
    this.openBbTk = true;
  }

  closeBbTkModal() {
    this.idBbTk = null;
    this.openBbTk = false;
  }

  openPhieuXkModal(id: number) {
    console.log(id, "id")
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }

  openBangKeModal(id: number) {
    console.log(id, "id")
    this.idBangKe = id;
    this.openBangKe = true;
  }

  closeBangKeModal() {
    this.idBangKe = null;
    this.openBangKe = false;
  }
  checkRoleAdd() {
    return this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_THEM') && this.userService.isChiCuc()
  }
  checkRoleExport() {
    return this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_EXP')
  }
  checkRoleView(trangThai: STATUS): boolean {
    if (!this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_PXK_XEM')) {
      return true
    }
    return false
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    if ([STATUS.DU_THAO, STATUS.TU_CHOI_KTVBQ, STATUS.TU_CHOI_LDCC].includes(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_THEM') && this.userService.isChiCuc()) {
      return true
    }
    return false
  }
  checkRoleApprove(trangThai: STATUS): boolean {
    if (((STATUS.CHO_DUYET_KTVBQ === trangThai && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_DUYET_KT')) || (STATUS.CHO_DUYET_LDCC === trangThai && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_DUYET_LDCCUC'))) && this.userService.isChiCuc()) {
      return true
    }
    return false
  }
  checkRoleDelete(trangThai: STATUS): boolean {
    if ([STATUS.DU_THAO].includes(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK_LT_BBHD_XOA') && this.userService.isChiCuc()) {
      return true
    }
    return false
  }
}
