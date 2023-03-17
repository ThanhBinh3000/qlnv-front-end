import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import dayjs from "dayjs";
import { UserLogin } from "src/app/models/userlogin";
import { MESSAGE } from "src/app/constants/message";
import { chain, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  BangKeCanCtvtService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/BangKeCanCtvt.service";
import { BangKeCanService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/BangKeCan.service';

@Component({
  selector: 'app-bang-ke-can',
  templateUrl: './bang-ke-can.component.html',
  styleUrls: ['./bang-ke-can.component.scss']
})
export class BangKeCanComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  expandSetString = new Set<string>();
  dataView: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    private bangKeCanService: BangKeCanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanService);
    this.formData = this.fb.group({
      id: [],
      nam: dayjs().get('year'),
      soQdGiaoNvXh: [],
      soBangKe: [],
      thoiGianGiaoNhan: [],
      ngayQdGiaoNvXh: [],
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

  async ngOnInit() {
    try {
      this.initData()
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    /*const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };*/
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }

  }

  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async search(roles?): Promise<void> {
    await this.spinner.show()
    this.formData.value.loaiVthh = this.loaiVthh;
    await super.search(roles);
    this.buildTableView();
    await this.spinner.hide()
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayDx) {
        this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
        this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
      }
      if (this.formData.value.ngayKetThuc) {
        this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
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

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)

        let nam = quyetDinh.nam;
        let ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
        return {
          idVirtual: uuidv4(),
          soQdGiaoNvXh: key, nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: value
        };
      }).value();
    this.dataView = dataView
    this.expandAll()

  }

  editRow(lv2: any, isView: boolean) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
  }

  async deleteRow(lv2: any) {
    await this.delete(lv2);
  }
}