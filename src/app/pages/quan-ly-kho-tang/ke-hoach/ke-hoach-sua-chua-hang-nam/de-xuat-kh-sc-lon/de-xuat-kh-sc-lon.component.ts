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

@Component({
  selector: 'app-de-xuat-kh-sc-lon',
  templateUrl: './de-xuat-kh-sc-lon.component.html',
  styleUrls: ['./de-xuat-kh-sc-lon.component.scss']
})
export class DeXuatKhScLonComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;

  danhSachCuc: any[] = [];

  idTongHop: number = 0;

  listTrangThai = [{ "ma": "00", "giaTri": "Dự thảo" },
    { "ma": "01", "giaTri": "Chờ duyệt TP" },
    { "ma": "02", "giaTri": "Từ chối TP" },
    { "ma": "03", "giaTri": "Chờ duyệt LĐ Cục" },
    { "ma": "04", "giaTri": "Từ chối LĐ Cục" },
    { "ma": "05", "giaTri": "Đã duyệt LĐ Cục" },
    { "ma": "18", "giaTri": "Chờ duyệt CB Vụ" },
    { "ma": "19", "giaTri": "Từ chối CB Vụ" },
    { "ma": "20", "giaTri": "Đã duyệt CB Vụ" }];

  constructor(
    private httpClient: HttpClient,
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
      ngayDuyetTu: [null],
      ngayDuyetDen: [null],
      tenCongTrinh: [null],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
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
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
    });
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    await this.filter();
  }


}
