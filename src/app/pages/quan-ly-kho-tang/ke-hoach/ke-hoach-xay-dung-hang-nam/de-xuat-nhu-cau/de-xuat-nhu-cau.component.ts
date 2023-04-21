import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from "@angular/core";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { KtKhXdHangNamService } from "../../../../../services/kt-kh-xd-hang-nam.service";
import { MESSAGE } from "../../../../../constants/message";
import { DANH_MUC_LEVEL } from "../../../../luu-kho/luu-kho.constant";
import { DonviService } from "../../../../../services/donvi.service";

@Component({
  selector: "app-de-xuat-nhu-cau",
  templateUrl: "./de-xuat-nhu-cau.component.html",
  styleUrls: ["./de-xuat-nhu-cau.component.scss"]
})
export class DeXuatNhuCauComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;

  danhSachCuc: any[] = [];

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
    private dexuatService: KtKhXdHangNamService,
    private dviService: DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit();
    this.formData = this.fb.group({
      maDvi: [null],
      namKeHoach: [null],
      soCongVan: [null],
      diaDiem: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      trangThai: [null]
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

