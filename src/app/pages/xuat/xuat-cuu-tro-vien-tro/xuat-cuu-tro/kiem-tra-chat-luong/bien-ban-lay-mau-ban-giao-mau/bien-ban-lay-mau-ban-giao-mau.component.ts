import { Component, OnInit, Input } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BienBanLayMauBanGiaoMauService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BienBanLayMauBanGiaoMau.service';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import * as uuid from "uuid";
import { CuuTroVienTroComponent } from '../../cuu-tro-vien-tro.component';
import { CHUC_NANG } from 'src/app/constants/status';
@Component({
  selector: 'app-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-mau-ban-giao-mau.component.scss']
})
export class BienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  public vldTrangThai: CuuTroVienTroComponent;
  CHUC_NANG = CHUC_NANG;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauBanGiaoMauService: BienBanLayMauBanGiaoMauService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauBanGiaoMauService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      soBienBan: null,
      soQdGiaoNvXh: null,
      dviKiemNghiem: null,
      tenDvi: null,
      maDvi: null,
      ngayLayMau: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      type: null,
      loaiVthh: null,
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      soBienBan: '',
      ngayLayMau: '',
      tenDiemKho: '',
      tenLoKho: '',
      soBbTinhKho: '',
      ngayXuatDocKho: '',
      soBbHaoDoi: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idQdGnv: number = 0;
  openQdGnv = false;

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledStartNgayLayMau = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayLayMauDen) {
      return startValue.getTime() > this.formData.value.ngayLayMauDen.getTime();
    }
    return false;
  };

  disabledEndNgayLayMau = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLayMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayLayMauDen.getTime();
  };
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
    await super.search(roles);
    this.buildTableView();
  }

  async timKiem() {
    if (this.formData.value.ngayLayMau) {
      this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
      this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
    }
    this.formData.patchValue({
      loaiVthh: this.loaiVthh
    })
    await this.search();
    this.dataTable.forEach(s => s.idVirtual = uuid.v4());
    this.buildTableView();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        let nam = quyetDinh.nam;
        let idQdGiaoNvXh = quyetDinh.idQdGiaoNvXh;
        let ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          idQdGiaoNvXh: idQdGiaoNvXh,
          nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: value };
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


  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  openQdGnvModal(id: number) {
    this.idQdGnv = id;
    this.openQdGnv = true;
  }

  closeQdGnvModal() {
    this.idQdGnv = null;
    this.openQdGnv = false;
  }

}
