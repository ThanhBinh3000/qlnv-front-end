import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {
  BienBanLayMauBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import * as uuid from "uuid";
import {chain} from 'lodash';

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
  children: any = [];
  expandSetString = new Set<string>();
  trangThaiBienBan: string;

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
      soQdNv: null,
      dviKnghiem: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      maDvi: null,
      loaiVthh: null,
      trangThai: null,
    })

    this.filterTable = {
      soQdNv: '',
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
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
      trangThai: this.userService.isChiCuc() ? null : this.STATUS.DA_DUYET_LDCC
    })
    await super.search(roles);
    this.buildTableView();
  }

  clearFilter() {
    this.formData.reset();
    this.search();
  }

  buildTableView() {
    let dataView = chain(this.dataTable).groupBy("soQdNv").map((value, key) => {
      let quyetDinh = value.find(f => f.soQdNv === key)
      let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
        let diaDiem = v.find(s => s.maDiemKho === k)
        return {
          idVirtual: uuid.v4(),
          idQdNv: diaDiem ? diaDiem.idQdNv : null,
          maDiemKho: k != null ? k : '',
          tenDiemKho: diaDiem ? diaDiem.tenDiemKho : null,
          childData: v
        }
      }).value();
      let idQdNv = quyetDinh ? quyetDinh.idQdNv : null;
      let namKh = quyetDinh ? quyetDinh.namKh : null;
      let ngayQdNv = quyetDinh ? quyetDinh.ngayQdNv : null;
      return {
        idVirtual: uuid.v4(),
        idQdNv: idQdNv,
        soQdNv: key != null ? key : '',
        namKh: namKh,
        ngayQdNv: ngayQdNv,
        childData: rs
      }
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

  redirectToChiTiet(lv2: any, trangThaiBienBan: any, idQdNv?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.trangThaiBienBan = trangThaiBienBan;
    this.idQdNv = idQdNv;
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
