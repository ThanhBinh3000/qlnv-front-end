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
  maNganKho: string, tenNganKho: string, maLoKho: string, tenLoKho: string, loaiVthh: string, cloaiVthh: string, tenLoaiVthh: string, tenCloaiVthh: string
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

  dataView: any[];
  passData: PassDataBienBanHaoDoi;
  addChung: boolean;
  LIST_TRANG_THAI = LIST_TRANG_THAI_BBHD
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
      soBkCanHang: '',
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
    this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type })
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
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }


  buildTableView() {
    console.log("dataTable", this.dataTable)
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
                return {
                  ...rowlv4,
                  childData: rowlv4 ? v : []
                }

              }).value()
              return {
                ...rowLv3,
                childData: rowLv3 ? rssx : []
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
    console.log("dataView", dataView)
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
    console.log("data", data)
    this.passData = {
      soQdinhDcc: data.soQdinh, qdinhDccId: data.qdinhDcId, ngayKyQdDcc: data.ngayKyQDinh, soBbTinhKho: '', bbtinhKhoId: data.bbTinhKhoId, maDiemKho: data.maDiemKho, tenDiemKho: data.tenDiemKho,
      maNhaKho: data.maNhaKho, tenNhaKho: data.tenNhaKho, maNganKho: data.maNganKho, tenNganKho: data.tenNganKho, maLoKho: data.maLoKho, tenLoKho: data.tenLoKho,
      loaiVthh: data.loaiVthh, cloaiVthh: data.cloaiVthh, tenLoaiVthh: data.tenLoaiVthh, tenCloaiVthh: data.tenCloaiVthh,
    }
  }
  checkRoleAdd(data: any): boolean {
    return !data.trangThai && this.userService.isChiCuc()
  }
  checkRoleEdit(data: any): boolean {
    return (data.trangThai === this.STATUS.DU_THAO || data.trangThai === this.STATUS.TU_CHOI_KTVBQ || data.trangThai === this.STATUS.TU_CHOI_KT || data.trangThai === this.STATUS.TU_CHOI_LDCC) && this.userService.isChiCuc()
  }
  checkRoleApprove(data: any): boolean {
    return (data.trangThai === this.STATUS.CHO_DUYET_KTVBQ || data.trangThai === this.STATUS.CHO_DUYET_KT || data.trangThai === this.STATUS.CHO_DUYET_LDCC) && this.userService.isChiCuc()
  }
  checkRoleDelete(data: any): boolean {
    return data.trangThai === this.STATUS.DU_THAO && this.userService.isChiCuc()
  }
  checkRoleView(data: any): boolean {
    return !this.checkRoleAdd(data) && !this.checkRoleEdit(data) && !this.checkRoleApprove(data) && !this.checkRoleEdit(data)
  }
} 
