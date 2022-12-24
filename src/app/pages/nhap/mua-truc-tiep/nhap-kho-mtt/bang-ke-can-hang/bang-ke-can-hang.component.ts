import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './../../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import dayjs from 'dayjs';
import { BangKeCanHangServie } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/bangKeCanHangService.service';
import { MESSAGE } from 'src/app/constants/message';
@Component({
  selector: 'app-bang-ke-can-hang',
  templateUrl: './bang-ke-can-hang.component.html',
  styleUrls: ['./bang-ke-can-hang.component.scss']
})
export class BangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() typeVthh: string;
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangKeCanHangService: BangKeCanHangServie,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangService);
    super.ngOnInit()
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      soQd: [''],
      soBangKe: [''],
      ngayNhap: [''],

    });
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      soQdGoc: '',
      namKhoach: '',
      tenVthh: '',
      soGoiThau: '',
      trangThai: '',
    };
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }
}
