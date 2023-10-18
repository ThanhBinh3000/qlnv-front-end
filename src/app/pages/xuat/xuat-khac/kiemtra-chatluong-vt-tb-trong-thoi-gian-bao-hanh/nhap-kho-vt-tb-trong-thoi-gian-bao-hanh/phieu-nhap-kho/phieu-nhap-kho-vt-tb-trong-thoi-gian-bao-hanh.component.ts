import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";

import { chain } from 'lodash';
import * as uuid from "uuid";
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { StorageService } from "../../../../../../services/storage.service";
import { DataService } from "../../../../../../services/data.service";
import { CHUC_NANG } from "../../../../../../constants/status";
import { UserLogin } from "../../../../../../models/userlogin";
import { MESSAGE } from "../../../../../../constants/message";
import {
  PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanh.service";


@Component({
  selector: 'app-phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class PhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dataService: DataService,
    private phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService: PhieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatNhapKhoVtTbTrongThoiGianBaoHanhService);
    // this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soCanCu: null,
      soBckqKdm: null,
      soPhieu: null,
      ngayXuatNhapTu: null,
      ngayXuatNhapDen: null,
      type: null,
      loaiPhieu: 'NHAP'
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      tenDiemKho: '',
      tenLoKho: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      soPhieuKdCl: '',
      ngayKdcl: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  soBaoCaoKqkdMau: string;
  nganLoKho: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
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
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soCanCu")
      .map((value, key) => {
        let parent = value.find(f => f.soCanCu === key)
        let rs = chain(value)
          .groupBy("tenDiemKho")
          .map((v, k) => {
            // let child = v.find(s => s.tenDiemKho === k)
            let rs1 = chain(v)
              .groupBy("tenCloaiVthh")
              .map((v1, k1) => {
                let childOfChild = v1.find(s => s.tenCloaiVthh === k1)
                return {
                  idVirtual: uuid.v4(),
                  tenCloaiVthh: k1 != "null" ? k1 : '',
                  maDiaDiem: childOfChild ? childOfChild.maDiaDiem : null,
                  tenLoKho: childOfChild ? childOfChild.tenLoKho : null,
                  tenNganKho: childOfChild ? childOfChild.tenNganKho : null,
                  childData: v1
                }
              }
              ).value();
            return {
              idVirtual: uuid.v4(),
              tenDiemKho: k != "null" ? k : '',
              // tenLoaiVthh: child ? child.tenLoaiVthh : null,
              childData: rs1
            }
          }
          ).value();
        return {
          idVirtual: uuid.v4(),
          soCanCu: key != "null" ? key : '',
          namKeHoach: parent ? parent.namKeHoach : null,
          ngayQdGiaoNvXh: parent ? parent.ngayKy : null,
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


  redirectDetail(id, b: boolean, soBaoCaoKqkdMau?, nganLoKho?) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.soBaoCaoKqkdMau = soBaoCaoKqkdMau;
    this.nganLoKho = nganLoKho;
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

  async showList() {
    this.isDetail = false;
    await this.search();
  }

}
