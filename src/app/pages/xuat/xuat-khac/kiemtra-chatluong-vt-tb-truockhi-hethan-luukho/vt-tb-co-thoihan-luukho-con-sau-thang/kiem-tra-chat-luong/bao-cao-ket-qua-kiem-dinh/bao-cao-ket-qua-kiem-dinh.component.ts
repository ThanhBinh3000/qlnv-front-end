import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  PhieuKdclVtKtclService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/PhieuKdclVtKtcl.service";
import {UserLogin} from "../../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../../constants/message";
import dayjs from "dayjs";
import {CHUC_NANG, STATUS} from "../../../../../../../constants/status";
import {
  BckqKiemDinhMauService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BckqKiemDinhMau.service";

@Component({
  selector: 'app-bao-cao-ket-qua-kiem-dinh',
  templateUrl: './bao-cao-ket-qua-kiem-dinh.component.html',
  styleUrls: ['./bao-cao-ket-qua-kiem-dinh.component.scss']
})
export class BaoCaoKetQuaKiemDinhComponent extends Base2Component implements OnInit {

  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bckqKiemDinhMauService: BckqKiemDinhMauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bckqKiemDinhMauService);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      tenBaoCao: [],
      soQdGiaoNvXh: [],
      ngayBaoCaoTu: [],
      ngayBaoCaoDen: [],
    })
  }

  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  soQdGiaoNvXhSelected: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;

  disabledStartNgayBaoCao = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayBaoCaoDen) {
      return startValue.getTime() >= this.formData.value.ngayBaoCaoDen.getTime();
    }
    return false;
  };

  disabledEndNgayBaoCao = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBaoCaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBaoCaoTu.getTime();
  };

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayBaoCao) {
        this.formData.value.ngayBaoCaoTu = dayjs(this.formData.value.ngayBaoCao[0]).format('YYYY-MM-DD')
        this.formData.value.ngayBaoCaoDen = dayjs(this.formData.value.ngayBaoCao[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

}
