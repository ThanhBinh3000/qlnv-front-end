import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {KiemTraChatLuongScService} from "../../../../../../services/sua-chua/kiemTraChatLuongSc";
import {Base3Component} from "../../../../../../components/base3/base3.component";
import {MESSAGE} from "../../../../../../constants/message";
import {
  HoSoKyThuatCtvtService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/HoSoKyThuatCtvt.service";

@Component({
  selector: 'app-xtl-hs-kt',
  templateUrl: './xtl-hs-kt.component.html',
  styleUrls: ['./xtl-hs-kt.component.scss']
})
export class XtlHsKtComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: HoSoKyThuatCtvtService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      id: [],
      idQdGiaoNvNh: [],
      soQdGiaoNvNh: [],
      soBbLayMau: [],
      soHd: [],
      maDvi: [],
      soHoSoKyThuat: [],
      nam: [],
      idBbLayMauXuat: [],
      kqKiemTra: [],
      loaiNhap: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      trangThai: [],
      tenTrangThai: [],
      tenDvi: [],
      ngayTao: [],
      soBbKtNgoaiQuan: [],
      soBbKtVanHanh: [],
      soBbKtHskt: [],
      type: []
    })
    router.events.subscribe((val) => {
      let routerUrl = this.router.url;
      const urlList = routerUrl.split("/");
      this.defaultURL  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4] + '/xtl-hs-kt';
      console.log(this.defaultURL)
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        type: 'BDG'
      });
      await Promise.all([
        this.search(),
      ])
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      await this.spinner.hide();
    }
    // this.searchPage();
  }

  clearForm() {
    this.formData.reset();
    let routerUrl = this.router.url;
    const urlList = routerUrl.split("/");
    this.formData.patchValue({
      phanLoai : urlList[4] == 'kiem-tra-lt' ? 'LT' : 'VT'
    })
    this.searchPage();
  }

  async searchPage() {
    await this.search();
    this.dataTable.forEach(item => item.expandSet = true);
  }

}
