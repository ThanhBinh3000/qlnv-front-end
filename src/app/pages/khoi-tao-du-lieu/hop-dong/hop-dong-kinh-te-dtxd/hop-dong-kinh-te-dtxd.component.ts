import {
  Component, EventEmitter,
  Input,
  OnInit, Output
} from "@angular/core";
import { Base2Component } from "../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { KtKhXdHangNamService } from "../../../../services/kt-kh-xd-hang-nam.service";
import { MESSAGE } from "../../../../constants/message";
import { DANH_MUC_LEVEL } from "../../../luu-kho/luu-kho.constant";
import { DonviService } from "../../../../services/donvi.service";
import { QuyetDinhKhTrungHanService } from "../../../../services/quyet-dinh-kh-trung-han.service";
import { Router } from "@angular/router";
import {STATUS} from "../../../../constants/status";
import {HopdongService} from "../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/hopdong.service";
@Component({
  selector: 'app-hop-dong-kinh-te-dtxd',
  templateUrl: './hop-dong-kinh-te-dtxd.component.html',
  styleUrls: ['./hop-dong-kinh-te-dtxd.component.scss']
})
export class HopDongKinhTeDtxdComponent extends Base2Component implements OnInit {
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
    private hopdongService: HopdongService,
    private router: Router,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService);
    super.ngOnInit();
    this.formData = this.fb.group({
      maDvi: [null],
      namKeHoach: [null],
      soHd: [null],
      tenHd: [null],
      cdtTen: [null],
      trangThai: [null],
      loai: ['00'],
      isKhoiTao: [1],
      ngayKyTu: [null],
      ngayKyDen: [null],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async filter() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI
    });
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    await this.filter();
  }
  closeDxPaModal() {
    this.idTongHop = null;
    this.isViewTh = false;
  }
}
