import {
  Component,
  OnInit
} from "@angular/core";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from "../../../../../constants/message";
import { DANH_MUC_LEVEL } from "../../../../luu-kho/luu-kho.constant";
import { DonviService } from "../../../../../services/donvi.service";
import {
  DeXuatScLonService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";
import { STATUS } from "../../../../../constants/status";
import { Router } from "@angular/router";

@Component({
  selector: 'app-de-xuat-kh-sc-lon',
  templateUrl: './de-xuat-kh-sc-lon.component.html',
  styleUrls: ['./de-xuat-kh-sc-lon.component.scss']
})
export class DeXuatKhScLonComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;

  danhSachCuc: any[] = [];

  idTongHop: number = 0;

  listTrangThai = [{ "ma": STATUS.DU_THAO, "giaTri": "Dự thảo" },
    { "ma": STATUS.CHO_DUYET_TP, "giaTri": "Chờ duyệt TP" },
    { "ma": STATUS.TU_CHOI_TP, "giaTri": "Từ chối TP" },
    { "ma": STATUS.CHO_DUYET_LDC, "giaTri": "Chờ duyệt LĐ Cục" },
    { "ma": STATUS.TU_CHOI_LDC, "giaTri": "Từ chối LĐ Cục" },
    { "ma": STATUS.DA_DUYET_LDC, "giaTri": "Đã duyệt LĐ Cục" },
    { "ma": STATUS.TU_CHOI_CBV, "giaTri": "Từ chối CB Vụ" },
    { "ma": STATUS.DA_DUYET_CBV, "giaTri": "Đã duyệt CB Vụ" }];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService: DeXuatScLonService,
    private dviService: DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit();
    this.formData = this.fb.group({
      maDvi: [null],
      diaDiem: [null],
      namKeHoach: [null],
      soCongVan: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      tenCongTrinh: [null]
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUALON_DX')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadDviDeXuat();
      this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDviDeXuat() {
    if (!this.userService.isCuc()) {
      const body = {
        maDviCha: this.userInfo.MA_DVI,
        trangThai: "01"
      };

      const dsTong = await this.dviService.layDonViTheoCapDo(body);
      this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
      this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB");
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async filter() {
    this.formData.patchValue({
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI :  this.formData.value.maDvi
    });
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    await this.filter();
  }


}
