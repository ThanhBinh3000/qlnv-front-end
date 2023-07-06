import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "src/app/services/donvi.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {UserLogin} from "src/app/models/userlogin";
import {MESSAGE} from "src/app/constants/message";
import {chain} from 'lodash';
import {BangKeCanService} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BangKeCan.service';
import {DauGiaComponent} from "../../dau-gia.component";
import {CHUC_NANG} from "../../../../../constants/status";
import * as uuid from "uuid";

@Component({
  selector: 'app-bdg-bang-ke-can',
  templateUrl: './bang-ke-can.component.html',
  styleUrls: ['./bang-ke-can.component.scss']
})
export class BangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  public vldTrangThai: DauGiaComponent;
  public CHUC_NANG = CHUC_NANG;
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isView = false;
  expandSetString = new Set<string>();
  children: any = [];
  idPhieuXk: number = 0;
  openPhieuXk = false;
  idQdNv: number =0;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private bangKeCanService: BangKeCanService,
    private dauGiaComponent: DauGiaComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanService);
    this.vldTrangThai = dauGiaComponent;
    this.formData = this.fb.group({
      id: [],
      nam: [],
      soQdGiaoNvXh: [],
      soBangKe: [],
      thoiGianGiaoNhan: [],
      ngayXuat: [],
      ngayXuatTu: [],
      ngayXuatDen: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      ngayKetThuc: [],
      type: []
    })
  }

  disabledStartNgayXk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayXuatDen) {
      return startValue.getTime() >= this.formData.value.ngayXuatDen.getTime();
    }
    return false;
  };

  disabledEndNgayXk = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayXuatTu.getTime();
  };

  async ngOnInit() {
    try {
      this.initData();
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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

  async search(roles?): Promise<void> {
    await this.spinner.show()
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  buildTableView() {
    let dataView = chain(this.dataTable).groupBy("soQdGiaoNvXh").map((value, key) => {
      let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
      let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
        let diaDiem = v.find(s => s.maDiemKho === k)
        return {
          idVirtual: uuid.v4(),
          maDiemKho: k != null ? k : '',
          tenDiemKho: diaDiem ? diaDiem.tenDiemKho : null,
          idQdGiaoNvXh: diaDiem ? diaDiem.idQdGiaoNvXh : null,
          childData: v
        }
      }).value();
      let nam = quyetDinh? quyetDinh.nam : null;
      let ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
      return{
        idVirtual: uuid.v4(),
        soQdGiaoNvXh: key != null ? key : '',
        nam: nam,
        ngayQdGiaoNvXh: ngayQdGiaoNvXh,
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

  redirectDetail(id, b: boolean, idQdNv? : number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.idQdNv = idQdNv
  }

  openPhieuXkModal(id: number) {
    console.log(id, 'id');
    this.idPhieuXk = id;
    this.openPhieuXk = true;
  }

  closePhieuXkModal() {
    this.idPhieuXk = null;
    this.openPhieuXk = false;
  }
}
