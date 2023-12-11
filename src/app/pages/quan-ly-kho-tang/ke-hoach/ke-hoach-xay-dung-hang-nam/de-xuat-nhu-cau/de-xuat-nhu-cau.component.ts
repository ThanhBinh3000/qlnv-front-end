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
import { QuyetDinhKhTrungHanService } from "../../../../../services/quyet-dinh-kh-trung-han.service";
import { Router } from "@angular/router";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: "app-de-xuat-nhu-cau",
  templateUrl: "./de-xuat-nhu-cau.component.html",
  styleUrls: ["./de-xuat-nhu-cau.component.scss"]
})
export class DeXuatNhuCauComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;

  danhSachCuc: any[] = [];

  idTongHop: number = 0;
  isViewTh: boolean;
  STATUS = STATUS;

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
    private dviService: DonviService,
    private quyetDinhService: QuyetDinhKhTrungHanService,
    private router: Router,
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
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHDTXDHANGNAM_DX')) {
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
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : this.formData.value.maDvi
    });
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    await this.filter();
  }


  async openModalCttongHop(data: any) {
    let body = {
      namKeHoach : data.namKeHoach,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: 100,
        page: this.page - 1,
      }
    };
    let res = await this.quyetDinhService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let listData = res.data.content;
      let result = listData.filter(item => item.soQuyetDinh == data.soQdTrunghan);
      if (result && result.length > 0) {
        this.idTongHop = result[0].id;
        this.isViewTh = true;
      }
    }
  }

  closeDxPaModal() {
    this.idTongHop = null;
    this.isViewTh = false;
  }
}

