import { Component, OnInit, Input } from '@angular/core';
import { Base2Component } from './../../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import dayjs from 'dayjs';
import { UserLogin } from './../../../../../models/userlogin';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import * as uuid from "uuid";
import { PhieuKiemNghiemChatLuongService } from './../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service';
@Component({
  selector: 'app-phieu-kiem-nghiem-chat-luong',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class PhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);
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


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }
  async timKiem() {
    if (this.formData.value.ngayLayMau) {
      this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
      this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
    }

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
        let ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
        return { idVirtual: uuid.v4(), soQdGiaoNvXh: key, nam: nam, ngayQdGiaoNvXh: ngayQdGiaoNvXh, childData: value };
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
}
