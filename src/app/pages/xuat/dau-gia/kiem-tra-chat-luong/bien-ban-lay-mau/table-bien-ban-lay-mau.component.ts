import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import * as uuid from "uuid";
import { BienBanLayMauXhService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
@Component({
  selector: 'app-table-bien-ban-lay-mau',
  templateUrl: './table-bien-ban-lay-mau.component.html',
  styleUrls: ['./table-bien-ban-lay-mau.component.scss'],
})
export class TableBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvXh: number = 0;
  children: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauXhService);
    this.formData = this.fb.group({
      soBienBan: null,
      soQd: null,
      dviKnghiem: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      maDvi: null,
      loaiVthh: null,
      maDviCuc: null,
    })

    this.filterTable = {
      nam: '',
      soQd: '',
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
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
      trangThai: this.userService.isChiCuc() ? null : this.STATUS.DA_DUYET_LDCC,
      maDviCuc : this.userService.isCuc() ? this.userInfo.MA_DVI : null,
    })
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  buildTableView() {
    let dataView = chain(this.dataTable).groupBy("soQd").map((value, key) => {
      let quyetDinh = value.find(f => f.soQd === key)
      let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
        let diaDiem = v.find(s => s.maDiemKho === k)
        return {
          idVirtual: uuid.v4(),
          maDiemKho: k != null ? k : '',
          tenDiemKho: diaDiem ? diaDiem.tenDiemKho : null,
          idQd: diaDiem ? diaDiem.idQd : null,
          childData: v
        }
      }).value();
      let nam = quyetDinh ? quyetDinh.nam : null;
      let ngayQd = quyetDinh ? quyetDinh.ngayQd : null;
      let idQd = quyetDinh ? quyetDinh.idQd : null;
      return {
        idVirtual: uuid.v4(),
        soQd: key != null ? key : '',
        nam: nam,
        ngayQd: ngayQd,
        idQd : idQd,
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

  redirectToChiTiet(lv2: any, isView: boolean, idQdGiaoNvXh?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvXh = idQdGiaoNvXh;
  }

  disabledNgayLayMauTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyQdDen.getTime();
  };

  disabledNgayLayMauDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdTu.getTime();
  };

  openModalQdNv(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModalQdNv() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }
}
