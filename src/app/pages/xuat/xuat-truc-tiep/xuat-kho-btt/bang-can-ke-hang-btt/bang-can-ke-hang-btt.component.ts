import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { BangCanKeHangBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bang-can-ke-hang-btt.service';
import { v4 as uuidv4 } from 'uuid';
import { chain } from 'lodash';

@Component({
  selector: 'app-bang-can-ke-hang-btt',
  templateUrl: './bang-can-ke-hang-btt.component.html',
  styleUrls: ['./bang-can-ke-hang-btt.component.scss']
})
export class BangCanKeHangBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvXh: number = 0;
  dataView: any = [];
  expandSetString = new Set<string>();
  idPhieuXuat: number = 0;
  isViewPhieuXuat: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCanKeHangBttService: BangCanKeHangBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeHangBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      soBangKe: null,
      ngayXuatKhoTu: null,
      ngayXuatKhoDen: null,
      maDvi: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQdNv: '',
      namKh: '',
      ngayQdNv: '',
      maDiemKho: '',
      tenDiemKho: '',
      maNhaKho: '',
      tenNhaKho: '',
      maNganKho: '',
      tenNganKho: '',
      maLoKho: '',
      tenLoKho: '',
      soBangKe: '',
      soPhieuXuat: '',
      trangThai: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
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

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
      trangThai: this.userService.isChiCuc() ? null : this.STATUS.DA_DUYET_LDCC
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdNv")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            return {
              id: rowLv2.id,
              maDiemKho: k,
              idVirtual: uuidv4(),
              maLoKho: rowLv2.maLoKho,
              tenDiemKho: rowLv2.tenDiemKho,
              maNhaKho: rowLv2.maNhaKho,
              tenNhaKho: rowLv2.tenNhaKho,
              maNganKho: rowLv2.maNganKho,
              tenNganKho: rowLv2.tenNganKho,
              tenLoKho: rowLv2.tenLoKho,
              soPhieuXuat: rowLv2.soPhieuXuat,
              ngayXuatKho: rowLv2.ngayXuatKho,
              soBangKe: rowLv2.soBangKe,
              trangThai: rowLv2.trangThai,
              tenTrangThai: rowLv2.tenTrangThai,
              childData: v
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQdNv === key);
        return {
          idVirtual: uuidv4(),
          soQdNv: key,
          namKh: rowLv1.namKh,
          ngayQdNv: rowLv1.ngayQdNv,
          idQdNv: rowLv1.idQdNv,
          childData: rs
        };
      }).value();
    this.dataView = dataView
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

  redirectToChiTiet(lv2: any, isView: boolean, idQdGiaoNvXh?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvXh = idQdGiaoNvXh;
  }

  openModalPhieuXuatKho(id: number) {
    this.idPhieuXuat = id;
    this.isViewPhieuXuat = true;
  }

  closeModalPhieuXuatKho() {
    this.idPhieuXuat = null;
    this.isViewPhieuXuat = false;
  }

  disabledNgayXuatKhoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayXuatKhoDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayXuatKhoDen.getTime();
  };

  disabledNgayXuatKhoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatKhoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatKhoTu.getTime();
  };
}

