import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from 'ng-zorro-antd/modal';
import {UserLogin} from 'src/app/models/userlogin';
import {MESSAGE} from 'src/app/constants/message';
import {chain} from 'lodash';
import * as uuid from "uuid";
import {v4 as uuidv4} from "uuid";
import {CHUC_NANG} from 'src/app/constants/status';
import {XuatKhacComponent} from "../../xuat-khac.component";
import {
  TongHopDanhSachHangDTQGService
} from "../../../../../services/qlnv-hang/xuat-hang/xuatkhac/TongHopDanhSachHangDTQG.service";
import {LOAI_HH_XUAT_KHAC} from "../../../../../constants/config";

@Component({
  selector: 'app-xk-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-mau-ban-giao-mau.component.scss']
})
export class BienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  public vldTrangThai: XuatKhacComponent;
  CHUC_NANG = CHUC_NANG;
  loaiHhXuatKhac = LOAI_HH_XUAT_KHAC;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDanhSachHangDTQGService: TongHopDanhSachHangDTQGService,
    private xuatKhacComponent: XuatKhacComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDanhSachHangDTQGService);
    this.vldTrangThai = this.xuatKhacComponent;
    this.formData = this.fb.group({
      nam: null,
      soBienBan: null,
      maDanhSach: null,
      dviKiemNghiem: null,
      tenDvi: null,
      maDvi: null,
      ngayLayMau: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      loai: null,
      loaiVthh: null,
    })
    this.filterTable = {
      maDanhSach: '',
      nam: '',
      soBienBan: '',
      ngayLayMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  item: any = [];
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

  async timKiem() {
    this.formData.patchValue({
      loai: this.loaiHhXuatKhac.LT_6_THANG,
    });
    await this.search();
    this.dataTable.forEach(s => {
      s.idVirtual = uuidv4();
      this.expandSetString.add(s.idVirtual);
    });
    console.log(this.dataTable,"789")
    this.buildTableView();
  }

  buildTableView() {
    // let dataView = chain(this.dataTable)
    //   .groupBy("soQdGiaoNvXh")
    //   .map((value, key) => {
    //     let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
    //     let nam = quyetDinh.nam;
    //     let idQdGiaoNvXh = quyetDinh.idQdGiaoNvXh;
    //     let ngayQdGiaoNvXh = quyetDinh.ngayQdGiaoNvXh;
    //     return {
    //       idVirtual: uuid.v4(),
    //       soQdGiaoNvXh: key != "null" ? key : '',
    //       idQdGiaoNvXh: idQdGiaoNvXh,
    //       nam: nam,
    //       ngayQdGiaoNvXh: ngayQdGiaoNvXh,
    //       childData: value };
    //   }).value();
    // this.children = dataView
    // this.expandAll()

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


  redirectDetail(item, b: boolean) {
    this.item = item;
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
