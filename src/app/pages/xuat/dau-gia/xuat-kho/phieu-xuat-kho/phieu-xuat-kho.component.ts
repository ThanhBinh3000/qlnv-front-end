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
import { PhieuXuatKhoService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/xuat-kho/PhieuXuatKho.service';
import {CHUC_NANG} from "../../../../../constants/status";
import {DauGiaComponent} from "../../dau-gia.component";

@Component({
  selector: 'app-bdg-phieu-xuat-kho',
  templateUrl: './phieu-xuat-kho.component.html',
  styleUrls: ['./phieu-xuat-kho.component.scss']
})
export class PhieuXuatKhoComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  public vldTrangThai: DauGiaComponent;
  public CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuXuatKhoService: PhieuXuatKhoService,
    private dauGiaComponent: DauGiaComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuXuatKhoService);
    this.vldTrangThai = dauGiaComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soPhieuXuatKho: null,
      ngayXuatKho: null,
      ngayXuatKhoTu: null,
      ngayXuatKhoDen: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      tenDiemKho: '',
      soPhieuXuatKho: '',
      ngayXuatKho: '',
      soPhieuKnCl: '',
      ngayKn: '',
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
  idQdNv: number =0;

  idPhieu: number = 0;
  isViewPhieu: boolean = false;
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
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
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
    await this.spinner.show();
    try {
      if (this.formData.value.ngayXuatKho) {
        this.formData.value.ngayXuatKhoTu = dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD')
        this.formData.value.ngayXuatKhoDen = dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    let dataView = chain(this.dataTable).groupBy("soQdGiaoNvXh").map((value, key) => {
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
          let diaDiem = v.find(s => s.maDiemKho === k)
              return {
                idVirtual: uuid.v4(),
                maDiemKho: k != "null" ? k : '',
                tenDiemKho: diaDiem ? diaDiem.tenDiemKho : null,
                idQdGiaoNvXh: diaDiem ? diaDiem.idQdGiaoNvXh : null,
                childData: v
              }
            }
          ).value();
        let nam = quyetDinh ? quyetDinh.nam : null;
        let ngayQdGiaoNvXh = quyetDinh ? quyetDinh.ngayQdGiaoNvXh : null;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: nam,
          ngayQdGiaoNvXh: ngayQdGiaoNvXh,
          childData: rs
        };
      }).value();
    this.children = dataView
    console.log(this.children, "this.children ");
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

  openPhieuKnClModal(id: number) {
    this.idPhieu = id;
    this.isViewPhieu = true;
  }

  closePhieuKnClModal() {
    this.idPhieu = null;
    this.isViewPhieu = false;
  }


}

