import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import { saveAs } from 'file-saver';
import {DonviService} from "../../../../services/donvi.service";
import {MmBbGiaoNhanService} from "../../../../services/mm-bb-giao-nhan.service";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../constants/message";
@Component({
  selector: 'app-mm-bien-ban-giao-nhan',
  templateUrl: './mm-bien-ban-giao-nhan.component.html',
  styleUrls: ['./mm-bien-ban-giao-nhan.component.scss']
})
export class MmBienBanGiaoNhanComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Đang nhập dữ liệu' },
    { ma: this.STATUS.DA_KY, giaTri: 'Đã ký' }
  ];
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
      })
    }
    this.formData.patchValue({
      maDvi: this.userService.isTongCuc() ?  null :  this.userInfo.MA_DVI  ,
    })
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userService.isTongCuc() ?  null :  this.userInfo.MA_DVI  ,
    })
    await this.search();
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.bienBanSv
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'bien-ban-giao-nhan.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }


}
