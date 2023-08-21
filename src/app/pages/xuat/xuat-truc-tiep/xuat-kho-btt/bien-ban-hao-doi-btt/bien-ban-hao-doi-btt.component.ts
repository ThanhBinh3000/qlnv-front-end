import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { BienBanHaoDoiBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-hao-doi-btt.service';
import { chain } from 'lodash';
import * as uuid from "uuid";

@Component({
  selector: 'app-bien-ban-hao-doi-btt',
  templateUrl: './bien-ban-hao-doi-btt.component.html',
  styleUrls: ['./bien-ban-hao-doi-btt.component.scss']
})
export class BienBanHaoDoiBttComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvXh: number = 0;
  expandSetString = new Set<string>();
  children: any = [];
  dataView: any = [];

  idBbTinhKho: number = 0;
  isViewBbTinhKho: boolean = false;

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
    private bienBanHaoDoiBttService: BienBanHaoDoiBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanHaoDoiBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      soBbHaoDoi: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      ngayBdauXuatTu: null,
      ngayBdauXuatDen: null,
      ngayKthucXuatTu: null,
      ngayKthucXuatDen: null,
      ngayQdNvTu: null,
      ngayQdNvDen: null,
      maChiCuc: null,
      loaiVthh: null,
      maDvi: null,
    })

    this.filterTable = {
      soQd: '',
      namKh: '',
      ngayTao: '',
      soHd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGnhan: '',
      trichYeu: '',
      bbTinhKho: '',
      bbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
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
          .groupBy("soBbHaoDoi")
          .map((v, k) => {
            let soBb = v.find(s => s.soBbHaoDoi === k)
            return {
              idVirtual: uuid.v4(),
              soBbHaoDoi: k != "null" ? k : '',
              ngayBdauXuat: soBb ? soBb.ngayBdauXuat : null,
              soBbTinhKho: soBb ? soBb.soBbTinhKho : null,
              idBbTinhKho: soBb ? soBb.idBbTinhKho : null,
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

  disabledLapBbHaoDoiTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayBdauXuatDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayBdauXuatDen.getTime();
  };

  disabledLapBbHaoDoiDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBdauXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBdauXuatTu.getTime();
  };

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

  openModalBbTinhKho(id: number) {
    this.idBbTinhKho = id;
    this.isViewBbTinhKho = true;
  }

  closeModalBbTinhKho() {
    this.idBbTinhKho = null;
    this.isViewBbTinhKho = false;
  }

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

