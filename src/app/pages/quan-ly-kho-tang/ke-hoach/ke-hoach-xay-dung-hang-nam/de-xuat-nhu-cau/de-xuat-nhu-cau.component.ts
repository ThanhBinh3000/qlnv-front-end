import {
  Component, EventEmitter,
  Input,
  OnInit, Output,
} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DieuChinhQuyetDinhPdKhlcntService
} from "../../../../../services/qlnv-hang/nhap-hang/dau-thau/dieuchinh-khlcnt/dieuChinhQuyetDinhPdKhlcnt.service";
import dayjs from "dayjs";
import {KtKhXdHangNamService} from "../../../../../services/kt-kh-xd-hang-nam.service";
import {MESSAGE} from "../../../../../constants/message";

@Component({
  selector: 'app-de-xuat-nhu-cau',
  templateUrl: './de-xuat-nhu-cau.component.html',
  styleUrls: ['./de-xuat-nhu-cau.component.scss']
})
export class DeXuatNhuCauComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi : [null],
      soCongVan : [null],
      namBatDau : [null],
      namKetThuc : [null],
      diaDiem : [null],
      ngayKy : [null],
      trangThai : [null],
    });
    this.filterTable = {
      soCongVan: '',
      tenDvi: '',
      ngayKy: '',
      namKeHoach: '',
      tmdt: '',
      trichYeu: '',
      soQdTrunghan: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }


}

