import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {DonviService} from "../../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {
  QuyetDinhPheDuyetKetQuaService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-hop-dong-thanh-ly',
  templateUrl: './hop-dong-thanh-ly.component.html',
  styleUrls: ['./hop-dong-thanh-ly.component.scss']
})
export class HopDongThanhLyComponent extends Base3Component implements OnInit {
  isQuanLy: boolean;
  isAddNew: boolean;
  dsDonvi: any[] = [];
  idQdTl: number = 0;
  isViewQdTl: boolean = false;
  idQdKq: number = 0;
  isViewQdKq: boolean = false;

  listTrangThaiHd: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];
  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private donviService: DonviService,
    private _service: QuyetDinhPheDuyetKetQuaService
  ) {
    super(httpClient, storageService, notification, spinner, modal,route,router,_service);
    this.defaultURL = '/xuat/xuat-thanh-ly/to-chuc/hop-dong'
    this.formData = this.fb.group({
      ngayKy: '',
      ngayKyTu: '',
      ngayKyDen: '',
      soHd: '',
      tenHd: '',
      nhaCungCap: '',
      trangThai: this.STATUS.BAN_HANH,
      loaiVthh: '',
      nam: '',
      tenDviThucHien: '',
      tenDviMua: '',
      maDvi: ''
    });

    this.filterTable = {
      nam: '',
      soQdPd: '',
      soQdKq: '',
      tongDvts: '',
      tongDvtsDg: '',
      slHdDaKy: '',
      thoiHanTt: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenDviThucHien: '',
      tenDviMua: '',
      soLuong: '',
      thanhTien: '',
    }
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.loadDsDonVi()
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
      })
      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsDonVi() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    }
    let res = await this.donviService.layDonViTheoCapDo(body);
    this.dsDonvi = res[DANH_MUC_LEVEL.CUC];
    this.dsDonvi = this.dsDonvi.filter(item => item.type != "PB");
  }

  redirectDetail(idDetail, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.router.navigate([this.defaultURL + '/quan-ly-chi-tiet', idDetail]);
  }
}
