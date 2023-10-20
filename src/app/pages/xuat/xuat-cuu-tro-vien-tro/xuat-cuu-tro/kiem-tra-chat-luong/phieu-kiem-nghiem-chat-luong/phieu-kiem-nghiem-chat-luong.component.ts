import { Component, OnInit, Input } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import * as uuid from "uuid";
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
import { CuuTroVienTroComponent } from '../../cuu-tro-vien-tro.component';
import { CHUC_NANG } from 'src/app/constants/status';
@Component({
  selector: 'app-phieu-kiem-nghiem-chat-luong1',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class PhieuKiemNghiemChatLuongComponent1 extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: CuuTroVienTroComponent;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);
    this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: [dayjs().get("year")],
      soQdGiaoNvXh: null,
      soPhieu: null,
      soBienBan: null,
      ngayKnMau: null,
      ngayKnTu: null,
      ngayKnDen: null,
      soBbXuatDocKho: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      soPhieu: '',
      ngayKnMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soBienBan: '',
      ngayLayMau: '',
      soBbTinhKho: '',
      ngayXuatDocKho: '',
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
  idBbLm: number = 0;
  openBbLm = false;

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

  async search(roles?): Promise<void> {
    await super.search(roles);
    this.buildTableView();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }
  disabledStartNgayKn = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKnDen) {
      return startValue.getTime() >= this.formData.value.ngayKnDen.getTime();
    }
    return false;
  };

  disabledEndNgayKn = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKnTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKnTu.getTime();
  };

  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }
  async timKiem() {
    if (this.formData.value.ngayKn) {
      this.formData.value.ngayKnTu = dayjs(this.formData.value.ngayKn[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKnDen = dayjs(this.formData.value.ngayKn[1]).format('YYYY-MM-DD')
    }
    this.formData.patchValue({
      loaiVthh: this.loaiVthh
    })
    await this.search();
    this.dataTable.forEach(s => s.idVirtual = uuid.v4());
    this.buildTableView();
  }

  buildTableView() {
    console.log(this.dataTable, "dataTable");
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        if (quyetDinh != null) {
          let nam = quyetDinh.nam;
          let ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
          let idQdGiaoNvXh = quyetDinh.idQdGiaoNvXh;
          return {
            idVirtual: uuid.v4(),
            soQdGiaoNvXh: key != "null" ? key : '',
            idQdGiaoNvXh: idQdGiaoNvXh,
            nam: nam,
            ngayQdGiaoNvXh: ngayQdGiaoNvXh,
            childData: value
          };
        } else {
          return {
            idVirtual: uuid.v4(),
            soQdGiaoNvXh: key != "null" ? key : '',
            childData: value
          };
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

  openBbLmModal(id: number) {
    this.idBbLm = id;
    this.openBbLm = true;
  }

  closeBbLmModal() {
    this.idBbLm = null;
    this.openBbLm = false;
  }
}
