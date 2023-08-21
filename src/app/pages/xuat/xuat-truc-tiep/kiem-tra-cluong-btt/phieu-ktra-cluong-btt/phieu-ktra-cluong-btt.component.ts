import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { PhieuKtraCluongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/phieu-ktra-cluong-btt.service';
import { chain } from 'lodash';
import * as uuid from "uuid";

@Component({
  selector: 'app-phieu-ktra-cluong-btt',
  templateUrl: './phieu-ktra-cluong-btt.component.html',
  styleUrls: ['./phieu-ktra-cluong-btt.component.scss']
})
export class PhieuKtraCluongBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  children: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idBienBan: number = 0;
  isViewBienBan: boolean = false;
  selectedId: number = 0;
  isView = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKtraCluongBttService: PhieuKtraCluongBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKtraCluongBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      soPhieu: null,
      ngayKnghiemTu: null,
      ngayKnghiemDen: null,
      soBienBan: null,
      soBbXuatDoc: null,
      loaiVthh: null,
      maDvi: null,
      trangThai: null,
      maChiCuc: null
    })

    this.filterTable = {
      soQdNv: '',
      namKh: '',
      ngayTao: '',
      soPhieu: '',
      ngayKnghiem: '',
      tenDiemKho: '',
      tenLoKho: '',
      soBienBan: '',
      ngayLayMau: '',
      tenTrangThai: '',

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
      maDvi: this.userInfo.MA_DVI,
      trangThai : this.userService.isCuc() ? null :  this.STATUS.DA_DUYET_LDC
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

  openModalQdNv(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModalQdNv() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }

  openModalSoBienBan(id: number) {
    this.idBienBan = id;
    this.isViewBienBan = true;
  }

  closeModaSoBienBan() {
    this.idBienBan = null;
    this.isViewBienBan = false;
  }

  disabledNgayKnghiemTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKnghiemDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKnghiemDen.getTime();
  };

  disabledNgayKnghiemDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKnghiemTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKnghiemTu.getTime();
  };
}
