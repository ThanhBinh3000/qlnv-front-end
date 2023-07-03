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
import { chain, groupBy, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { PhieuXuatKhoService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuXuatKho.service';
import { BienBanTinhKhoDieuChuyenService } from '../services/dcnb-bien-ban-tinh-kho.service';
import { LIST_TRANG_THAI_BBTK } from './them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';

export interface PassDataBienBanTinhKho {
  soQdinhDcc: string, qdinhDccId: number, tenDiemKho: string, tenNhaKho: string, tenNganKho: string, tenLoKho: string,
  maDiemKho: string, maNhaKho: string, maNganKho: string, maLoKho: string
}
@Component({
  selector: 'app-xuat-dcnb-bien-ban-tinh-kho',
  templateUrl: './bien-ban-tinh-kho.component.html',
  styleUrls: ['./bien-ban-tinh-kho.component.scss']
})
export class BienBanTinhKhoDieuChuyenComponent extends Base2Component implements OnInit {

  @Input() loaiDc: string;
  @Input() thayDoiThuKho: boolean;
  @Input() isVatTu: boolean;
  @Input() type: string
  passData: PassDataBienBanTinhKho = {
    soQdinhDcc: '', qdinhDccId: null, tenDiemKho: '', tenNhaKho: '', tenNganKho: '', tenLoKho: '', maDiemKho: '',
    maNhaKho: '', maNganKho: '', maLoKho: ''
  }
  LIST_TRANG_THAI = LIST_TRANG_THAI_BBTK;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private bienBanTinhKhoDieuChuyenService: BienBanTinhKhoDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoDieuChuyenService);
    this.formData = this.fb.group({
      tenDvi: [''],
      maDvi: [''],
      nam: [''],
      soQdinhDcc: [''],
      soBbTinhKho: [''],
      tuNgay: [''],
      denNgay: [''],
      loaiDc: [''],
      isVatTu: [false],
      thayDoiThuKho: [false],
      type: ['']
    })
    this.filterTable = {
      soQdinhDcc: '',
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
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  dataView: any[] = [];

  ngOnInit(): void {
    try {
      this.spinner.show();
      this.initData();
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

  initData() {
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

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  checkRoleView(data: any): boolean {
    return !this.checkRoleAdd(data) && !this.checkRoleEdit(data) && !this.checkRoleApprove(data) && !this.checkRoleDetele(data)
  }
  checkRoleAdd(data: any): boolean {
    return !data.trangThai && this.userService.isChiCuc()
  }
  checkRoleEdit(data: any): boolean {
    return (data.trangThai == this.STATUS.DU_THAO || data.trangThai === this.STATUS.TU_CHOI_KTVBQ || data.trangThai === this.STATUS.TU_CHOI_KT || data.trangThai == this.STATUS.TU_CHOI_LDCC) && this.userService.isChiCuc();
  }
  checkRoleApprove(data: any): boolean {
    //trangThai1 && Quyen1, trangThai2 && Quyen 2
    return data.trangThai === this.STATUS.CHO_DUYET_KTVBQ || data.trangThai === this.STATUS.CHO_DUYET_KT || data.trangThai == this.STATUS.CHO_DUYET_LDCC && this.userService.isChiCuc();
  }
  checkRoleDetele(data: any): boolean {
    return data.trangThai == this.STATUS.DU_THAO && this.userService.isChiCuc()
  }
  redirectDetail(id, b: boolean, data?: any) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.passData = data ? {
      soQdinhDcc: data.soQdinh, qdinhDccId: data.qdinhDcId, tenDiemKho: data.tenDiemKho, tenNhaKho: data.tenNhaKho, tenNganKho: data.tenNganKho,
      tenLoKho: data.tenLoKho, maDiemKho: data.maDiemKho, maNhaKho: data.maNhaKho, maNganKho: data.maNganKho, maLoKho: data.maLoKho
    } : {
      soQdinhDcc: '', qdinhDccId: '', tenDiemKho: '', tenNhaKho: '', tenNganKho: '',
      tenLoKho: '', maDiemKho: '', maNhaKho: '', maNganKho: '', maLoKho: ''
    };
    console.log("data", this.passData)
    // this.isViewDetail = isView ?? false;
  }
}
