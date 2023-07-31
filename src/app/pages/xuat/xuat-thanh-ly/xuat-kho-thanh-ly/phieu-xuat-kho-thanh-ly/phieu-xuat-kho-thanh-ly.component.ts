import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import { chain } from 'lodash';
import * as uuid from "uuid";
import {CHUC_NANG} from "../../../../../constants/status";
import {XuatThanhLyComponent} from "../../xuat-thanh-ly.component";
import {
  PhieuXuatKhoThanhLyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/PhieuXuatKhoThanhLy.service";

@Component({
  selector: 'app-phieu-xuat-kho-thanh-ly',
  templateUrl: './phieu-xuat-kho-thanh-ly.component.html',
  styleUrls: ['./phieu-xuat-kho-thanh-ly.component.scss']
})
export class PhieuXuatKhoThanhLyComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatThanhLyComponent;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoThanhLyService: PhieuXuatKhoThanhLyService,
    private xuatThanhLyComponent: XuatThanhLyComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoThanhLyService);
    this.vldTrangThai = this.xuatThanhLyComponent;
    this.formData = this.fb.group({
      nam: null,
      soBbQd: null,
      soPhieuXuatKho: null,
      ngayXuatKhoTu: null,
      ngayXuatKhoDen: null,
    })
    this.filterTable = {
      soBbQd: '',
      nam: '',
      ngayKyBbQd: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      soPhieuKnCl: '',
      ngayKnCl: '',
      tenTrangThai: '',
    };
  }

  isView = false;
  idBbQd : number;
  children: any = [];
  expandSetString = new Set<string>();
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

  async ngOnInit() {
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
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  buildTableView() {
    let dataView = chain(this.dataTable).groupBy("soBbQd").map((value, key) => {
      let quyetDinh = value.find(f => f.soBbQd === key)
      let childData = chain(value).groupBy("maDiemKho").map((v, k) =>{
        let diaDiem = v.find(s => s.maDiaDiem === k)
        return {
          idVirtual: uuid.v4(),
          maDiemKho: k != null ? k : '',
          tenDiemKho: diaDiem ? diaDiem.tenDiemKho : null,
          idBbQd: diaDiem ? diaDiem.idBbQd : null,
          childData: v
        }
      }).value();
      let nam = quyetDinh ? quyetDinh.nam : null;
      let ngayKyBbQd = quyetDinh ? quyetDinh.ngayKyBbQd : null;
      return {
        idVirtual: uuid.v4(),
        soBbQd: key != null ? key : '',
        nam: nam,
        ngayKyBbQd: ngayKyBbQd,
        childData: childData
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

  redirectDetail(id, b: boolean, idBbQd: number) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
    this.idBbQd = idBbQd;
  }
}

