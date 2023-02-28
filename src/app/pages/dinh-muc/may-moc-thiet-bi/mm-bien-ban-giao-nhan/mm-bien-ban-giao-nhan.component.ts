import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {KtKhXdHangNamService} from "../../../../services/kt-kh-xd-hang-nam.service";
import {DonviService} from "../../../../services/donvi.service";
import {MmBbGiaoNhanService} from "../../../../services/mm-bb-giao-nhan.service";
import dayjs from "dayjs";
@Component({
  selector: 'app-mm-bien-ban-giao-nhan',
  templateUrl: './mm-bien-ban-giao-nhan.component.html',
  styleUrls: ['./mm-bien-ban-giao-nhan.component.scss']
})
export class MmBienBanGiaoNhanComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv : MmBbGiaoNhanService,
    private dviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      capDvi: [null],
      namKeHoach: [null],
      soBienBan: [null],
      soHopDong: [null],
      ngayGiao: [null],
      ngayGiaoTu: [null],
      ngayGiaoDen: [null],
    });
    this.filterTable = {
      soBienBan: '',
      namKeHoach: '',
      soHopDong: '',
      ngayGiaoNhan: '',
      benGiao: '',
      benNhan: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    this.filter()
  }

  async filter() {
    if (this.formData.value.ngayGiao && this.formData.value.ngayGiao.length > 0) {
      this.formData.patchValue({
        ngayGiaoTu: dayjs(this.formData.value.ngayGiao[0]).format('DD/MM/YYYY'),
        ngayGiaoDen: dayjs(this.formData.value.ngayGiao[1]).format('DD/MM/YYYY'),
        maDvi: this.userInfo.MA_DVI ,
        capDvi:this.userInfo.CAP_DVI ,
      })
    }
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ,
      capDvi:this.userInfo.CAP_DVI ,
    })
    await this.search();
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

}
