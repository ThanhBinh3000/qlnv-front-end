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
import { chain, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { BienBanHaoDoiDieuChuyenService } from '../services/dcnb-bien-ban-hao-doi.service';
import { LIST_TRANG_THAI_BBHD } from './them-moi-bien-ban-hao-doi/them-moi-bien-ban-hao-doi.component';

export interface PassDataBienBanHaoDoi {
  soQdinhDcc: string, qdinhDccId: number, ngayKyQdDcc: string, soBbTinhKho: string, bbtinhKhoId: number, maDiemKho: string, tenDiemKho: string, maNhaKho: string, tenNhaKho: string,
  maNganKho: string, tenNganKho: string, maLoKho: string, tenLoKho: string, loaiVthh: string, cloaiVthh: string, tenLoaiVthh: string, tenCloaiVthh: string, keHoachDcDtlId: number
}
export interface MA_QUYEN_BBHD {
  XEM: string,
  THEM: string,
  XOA: string,
  DUYET_KTVBQ: string,
  DUYET_KT: string,
  DUYET_LDCCUC: string,
  EXP: string,
  IN: string
}
@Component({
  selector: 'app-xuat-dcnb-bien-ban-hao-doi',
  templateUrl: './bien-ban-hao-doi.component.html',
  styleUrls: ['./bien-ban-hao-doi.component.scss']
})
export class BienBanHaoDoiDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() typeQd: string;
  @Input() loaiMaQuyen: string;

  dataView: any[];
  passData: PassDataBienBanHaoDoi;
  addChung: boolean;
  LIST_TRANG_THAI = LIST_TRANG_THAI_BBHD;
  MA_QUYEN: MA_QUYEN_BBHD = {
    XEM: "",
    THEM: "",
    XOA: "",
    DUYET_KTVBQ: "",
    DUYET_KT: "",
    DUYET_LDCCUC: "",
    EXP: "",
    IN: ""
  };
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanHaoDoiDieuChuyenService: BienBanHaoDoiDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiDieuChuyenService);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      soQdinhDcc: [],
      soBbHaoDoi: [],
      ngayTaoBb: [],
      ngayTaoBbTu: [],
      ngayTaoBbDen: [],
      ngayBatDauXuat: [],
      ngayBatDauXuatTu: [],
      ngayBatDauXuatDen: [],
      ngayKetThucXuat: [],
      ngayKetThucXuatTu: [],
      ngayKetThucXuatDen: [],
      ngayQdGiaoNvXh: [],
      ngayQdGiaoNvXhTu: [],
      ngayQdGiaoNvXhDen: [],

      loaiVthh: [],
      loaiDc: [],
      isVatTu: [],
      thayDoiThuKho: [],
      type: [],
      typeQd: [],

      tuNgay: [],
      denNgay: []
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
      soBangKeXuatDcLt: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();


  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.setMaQuyen();
      this.initData()
      await this.timKiem();
    }
    catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      this.spinner.hide();
    }
  }
  setMaQuyen() {
    switch (this.loaiMaQuyen) {
      case 'DCNB_LT_KHACTK':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_THEM';
        this.MA_QUYEN.DUYET_KTVBQ = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_TDUYET_KTVBQ';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_XOA';
        this.MA_QUYEN.DUYET_KT = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_DUYET_KT';
        this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_DUYET_LDCCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_KHACTK_XK_LT_BBHD_IN';
        break;
      case 'DCNB_LT_CUNGTK':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_THEM';
        this.MA_QUYEN.DUYET_KTVBQ = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_TDUYET_KTVBQ';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_XOA';
        this.MA_QUYEN.DUYET_KT = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_DUYET_KT';
        this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_DUYET_LDCCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_CUNGTK_XK_LT_BBHD_IN';
        break;
      case 'CHICUC_LT':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_THEM';
        this.MA_QUYEN.DUYET_KTVBQ = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_TDUYET_KTVBQ';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_XOA';
        this.MA_QUYEN.DUYET_KT = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_DUYET_KT';
        this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_DUYET_LDCCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_CUNG1CUC_XK_LT_BBHD_IN';
        break;
      case 'CUC_LT':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_2CUC_XK_LT_BBHD_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_2CUC_XK_LT_BBHD_THEM';
        this.MA_QUYEN.DUYET_KTVBQ = 'DCNB_XUAT_2CUC_XK_LT_BBHD_TDUYET_KTVBQ';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_2CUC_XK_LT_BBHD_XOA';
        this.MA_QUYEN.DUYET_KT = 'DCNB_XUAT_2CUC_XK_LT_BBHD_DUYET_KT';
        this.MA_QUYEN.DUYET_LDCCUC = 'DCNB_XUAT_2CUC_XK_LT_BBHD_DUYET_LDCCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_2CUC_XK_LT_BBHD_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_2CUC_XK_LT_BBHD_IN';
        break;
      default:
        break;
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
    this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd })
  }


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }
  resetForm() {
    this.formData.reset();
    this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd })
  }
  clearFilter(): void {
    this.resetForm();
    this.timKiem();
  }
  async timKiem() {
    try {
      const data = this.formData.value;
      const dataTrim = this.trimStringData(data);
      this.formData.patchValue({ ...dataTrim })
      await this.search();
    } catch (error) {
      console.log("error", error)
    }
  };
  trimStringData(obj: any) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' || value instanceof String) {
        obj[key] = value.trim();
      }
    };
    return obj
  }

  buildTableView() {
    const newData = this.dataTable.map(f => ({ ...f, maNganLoKho: f.maLoKho ? `${f.maLoKho}${f.maNganKho}` : f.maNganKho }))
    let dataView = chain(newData)
      .groupBy("soQdinh")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            let rsx = chain(v).groupBy("maNganLoKho").map((x, ix) => {
              const rowLv3 = x.find(f => f.maNganLoKho == ix);
              const rssx = chain(x).groupBy("id").map((v, iv) => {
                const rowlv4 = v.find(f => f.id && f.id == iv);
                if (!rowlv4) return;
                return {
                  ...rowlv4,
                  childData: rowlv4 ? v : []
                }

              }).value()
              return {
                ...rowLv3,
                childData: rowLv3 ? rssx.filter(f => !!f) : []
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
    this.dataView = cloneDeep(dataView);
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
  redirectDetail(id, b: boolean, data?: any, addChung?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.addChung = addChung;
    // this.isViewDetail = isView ?? false;
    this.passData = {
      soQdinhDcc: data.soQdinh, qdinhDccId: data.qdinhDcId, ngayKyQdDcc: data.ngayKyQDinh, soBbTinhKho: '', bbtinhKhoId: data.bbTinhKhoId, maDiemKho: data.maDiemKho, tenDiemKho: data.tenDiemKho,
      maNhaKho: data.maNhaKho, tenNhaKho: data.tenNhaKho, maNganKho: data.maNganKho, tenNganKho: data.tenNganKho, maLoKho: data.maLoKho, tenLoKho: data.tenLoKho,
      loaiVthh: data.loaiVthh, cloaiVthh: data.cloaiVthh, tenLoaiVthh: data.tenLoaiVthh, tenCloaiVthh: data.tenCloaiVthh, keHoachDcDtlId: data.keHoachDcDtlId
    }
  }
  checkRoleAdd(data: any): boolean {
    return this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && !data.trangThai && this.userService.isChiCuc()
  }
  checkRoleEdit(data: any): boolean {
    return this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && (data.trangThai === this.STATUS.DU_THAO || data.trangThai === this.STATUS.TU_CHOI_KTVBQ || data.trangThai === this.STATUS.TU_CHOI_KT || data.trangThai === this.STATUS.TU_CHOI_LDCC) && this.userService.isChiCuc()
  }
  checkRoleApprove(data: any): boolean {
    return (data.trangThai === this.STATUS.CHO_DUYET_KTVBQ && this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_KTVBQ) || data.trangThai === this.STATUS.CHO_DUYET_KT && this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_KT) || data.trangThai === this.STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_LDCCUC)) && this.userService.isChiCuc()
  }
  checkRoleDelete(data: any): boolean {
    return this.userService.isAccessPermisson(this.MA_QUYEN.XOA) && data.trangThai === this.STATUS.DU_THAO && this.userService.isChiCuc()
  }
  checkRoleView(data: any): boolean {
    return this.userService.isAccessPermisson(this.MA_QUYEN.XEM) && data.trangThai && !this.checkRoleAdd(data) && !this.checkRoleEdit(data) && !this.checkRoleApprove(data) && !this.checkRoleEdit(data)
  }
} 
