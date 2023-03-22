import {
  Component,
  OnInit,
} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {
  DeXuatScLonService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/de-xuat-sc-lon.service";

@Component({
  selector: 'app-de-xuat-kh-sc-lon',
  templateUrl: './de-xuat-kh-sc-lon.component.html',
  styleUrls: ['./de-xuat-kh-sc-lon.component.scss']
})
export class DeXuatKhScLonComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_CBV, giaTri: 'Đã duyệt - Cán bộ Vụ' },
    { ma: this.STATUS.TU_CHOI_CBV, giaTri: 'Từ chối - Cán bộ Vụ' }
  ];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : DeXuatScLonService
  )
  {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi : [null],
      capDvi : [null],
      soCongVan : [null],
      tenCongTrinh : [null],
      diaDiem : [null],
      trichYeu : [null],
      ngayKy : [null],
      namKeHoachTu : [null],
      trangThai : [null],
      namKeHoachDen: [null],
      ngayKyTu: [''],
      ngayKyDen: [''],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        this.filter()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.patchValue({
        ngayKyTu : this.formData.value.ngayKy[0],
        ngayKyDen : this.formData.value.ngayKy[1]
      })
    }
    this.formData.patchValue({
      maDvi : this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      capDvi : "2"
    })
    await this.search();
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }


}
