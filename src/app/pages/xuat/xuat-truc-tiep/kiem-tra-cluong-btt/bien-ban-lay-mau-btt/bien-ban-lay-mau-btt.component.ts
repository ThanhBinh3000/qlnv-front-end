import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanLayMauBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-bien-ban-lay-mau-btt',
  templateUrl: './bien-ban-lay-mau-btt.component.html',
  styleUrls: ['./bien-ban-lay-mau-btt.component.scss']
})
export class BienBanLayMauBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvXh: number = 0;
  children: any = [];
  expandSetString = new Set<string>();
  dataView: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauBttService);
    this.formData = this.fb.group({
      soBienBan: null,
      soQd: null,
      dviKnghiem: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      maDvi: null,
      loaiVthh: null,
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
      this.timKiem(),
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
      maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  buildTableView() {
    console.log(JSON.stringify(this.dataTable), 'raw')
    let dataView = chain(this.dataTable)
      .groupBy("soQd")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            return {
              id: rowLv2.id,
              idVirtual: uuidv4(),
              maLoKho: rowLv2.maLoKho,
              tenDiemKho: rowLv2.tenDiemKho,
              maNhaKho: rowLv2.maNhaKho,
              tenNhaKho: rowLv2.tenNhaKho,
              maNganKho: rowLv2.maNganKho,
              tenNganKho: rowLv2.tenNganKho,
              maDiemKho: k,
              tenLoKho: rowLv2.tenLoKho,
              soBienBan: rowLv2.soBienBan,
              ngayLayMau: rowLv2.ngayLayMau,
              soBbTinhKho: rowLv2.soBbTinhKho,
              ngayXuatDocKho: rowLv2.ngayXuatDocKho,
              soBbHaoDoi: rowLv2.rowLv2,
              trangThai: rowLv2.trangThai,
              tenTrangThai: rowLv2.tenTrangThai,
              childData: v
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQd === key);
        return {
          idVirtual: uuidv4(),
          soQd: key,
          namKh: rowLv1.namKh,
          ngayQd: rowLv1.ngayQd,
          idQd: rowLv1.idQd,
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
