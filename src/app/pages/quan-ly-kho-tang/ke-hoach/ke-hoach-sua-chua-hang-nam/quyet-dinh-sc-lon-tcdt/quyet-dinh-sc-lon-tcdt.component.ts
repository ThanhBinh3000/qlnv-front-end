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
import {KtKhXdHangNamService} from "../../../../../services/kt-kh-xd-hang-nam.service";
import {MESSAGE} from "../../../../../constants/message";
import {DonviService} from "../../../../../services/donvi.service";

@Component({
  selector: 'app-quyet-dinh-sc-lon-tcdt',
  templateUrl: './quyet-dinh-sc-lon-tcdt.component.html',
  styleUrls: ['./quyet-dinh-sc-lon-tcdt.component.scss']
})
export class QuyetDinhScLonTcdtComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dexuatService : KtKhXdHangNamService,
    private dviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dexuatService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi : [null],
      soCongVan : [null],
      tenCongTrinh : [null],
      diaDiem : [null],
      trichYeu : [null],
      ngayKy : [null],
      namBatDau : [null],
      namKetThuc : [null],
      role : [null],
    });
    this.filterTable = {
      soCongVan: '',
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
      this.formData.patchValue({
        role : this.userService.isCuc() ? 'CUC': 'TC',
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null
      })
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

  initForm() {
    this.formData.patchValue({
      role : this.userService.isCuc() ? 'CUC' : 'TC'
    })
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }


}
