import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanTinhKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-tinh-kho-btt.service';
import { chain } from 'lodash';
import * as uuid from "uuid";

@Component({
  selector: 'app-bien-ban-tinh-kho-btt',
  templateUrl: './bien-ban-tinh-kho-btt.component.html',
  styleUrls: ['./bien-ban-tinh-kho-btt.component.scss']
})
export class BienBanTinhKhoBttComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvXh: number = 0;
  dataView: any = [];
  expandSetString = new Set<string>();
  children: any = [];

  idPhieuXuat: number = 0;
  isViewPhieuXuat: boolean = false;

  idBangKe: number = 0;
  isViewBangKe: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanTinhKhoBttService: BienBanTinhKhoBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      soBbTinhKho: null,
      ngayBdauXuatTu: null,
      ngayBdauXuatDen: null,
      ngayKthucXuatTu: null,
      ngayKthucXuatDen: null,
      ngayQdNvTu: null,
      ngayQdNvDen: null,
      maDvi: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQdNv: '',
      namKh: '',
      ngayQdNv: '',
      soBbTinhKho: '',
      ngayBdauXuat: '',
      ngayKthucXuat: '',
      soPhieuXuat: '',
      soBangKe: '',
      ngayXuatKho: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  buildTableView() {
    console.log(this.dataTable, " key ? key : null,")
    let dataView = chain(this.dataTable)
      .groupBy("soQdNv")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soQdNv === key)
        let rs = chain(value)
          .groupBy("soBbTinhKho")
          .map((v, k) => {
            let soBb = v.find(s => s.soBbTinhKho === k)
            return {
              idVirtual: uuid.v4(),
              soBbTinhKho: k != "null" ? k : '',
              ngayBdauXuat: soBb ? soBb.ngayBdauXuat : null,
              ngayKthucXuat: soBb ? soBb.ngayKthucXuat : null,
              tenDiemKho: soBb ? soBb.tenDiemKho : null,
              tenLoKho: soBb ? soBb.tenLoKho : null,
              trangThai: soBb ? soBb.trangThai : null,
              tenTrangThai: soBb ? soBb.tenTrangThai : null,
              maDvi: soBb ? soBb.maDvi : null,
              id: soBb ? soBb.id : null,
              childData: v ? v : null,
            }
          }
          ).value();
        let namKh = quyetDinh ? quyetDinh.namKh : null;
        let ngayQdNv = quyetDinh ? quyetDinh.ngayQdNv : null;
        let idQdNv = quyetDinh ? quyetDinh.idQdNv : null;
        return {
          idVirtual: uuid.v4(),
          soQdNv: key != "null" ? key : '',
          namKh: namKh,
          ngayQdNv: ngayQdNv,
          idQdNv: idQdNv,
          childData: rs
        };
      }).value();
    this.children = dataView
    this.expandAll()

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

  redirectToChiTiet(lv1: any, isView: boolean, idQdGiaoNvXh?: number) {
    this.selectedId = lv1.id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvXh = idQdGiaoNvXh;
  }


  disabledBdauXuatTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayBdauXuatDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayBdauXuatDen.getTime();
  };

  disabledBdauXuatDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBdauXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBdauXuatTu.getTime();
  };

  disabledKthucXuatTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKthucXuatDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKthucXuatDen.getTime();
  };

  disabledkthucXuatDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKthucXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKthucXuatTu.getTime();
  };


  disabledQdNvTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayQdNvDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayQdNvDen.getTime();
  };

  disabledQdNvDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayQdNvTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayQdNvTu.getTime();
  };

  openModalPhieuXuatKho(id: number) {
    this.idPhieuXuat = id;
    this.isViewPhieuXuat = true;
  }

  closeModalPhieuXuatKho() {
    this.idPhieuXuat = null;
    this.isViewPhieuXuat = false;
  }

  openModalBangKe(id: number) {
    this.idBangKe = id;
    this.isViewBangKe = true;
  }

  closeModalBangKe() {
    this.idBangKe = null;
    this.isViewBangKe = false;
  }

}

