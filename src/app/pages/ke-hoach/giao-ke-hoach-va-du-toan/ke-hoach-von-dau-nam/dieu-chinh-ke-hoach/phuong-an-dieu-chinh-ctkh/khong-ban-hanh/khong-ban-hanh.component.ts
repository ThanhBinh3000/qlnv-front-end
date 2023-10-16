import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { PhuongAnDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/phuong-an-dieu-chinh-ctkh';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-khong-ban-hanh',
  templateUrl: './khong-ban-hanh.component.html',
  styleUrls: ['./khong-ban-hanh.component.scss']
})
export class KhongBanHanhComponent extends Base2Component implements OnInit {

  qdTCDT: string
  soCongVan: string
  fileDinhKemKhongBhs: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    public phuongAnDieuChinhCTKHService: PhuongAnDieuChinhCTKHService


  ) {
    super(httpClient, storageService, notification, spinner, modal, phuongAnDieuChinhCTKHService);
    this.formData = this.fb.group({
      soVanBanKhongBh: [, [Validators.required]],
      ngayKyKhongBh: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      noiDungVanBanKhongBh: [],
      lyDoKhongBh: [],
    }
    );
  }

  ngOnInit(): void {
    this.qdTCDT = this.userInfo.MA_QD;
  }


  handleOk(item: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    this._modalRef.close({
      ...item,
      soVanBanKhongBh: `${item.soVanBanKhongBh}/${this.qdTCDT}`,
      fileDinhKemKhongBhs: this.fileDinhKemKhongBhs
    });

  }

  onCancel() {
    this._modalRef.close();
  }

}
