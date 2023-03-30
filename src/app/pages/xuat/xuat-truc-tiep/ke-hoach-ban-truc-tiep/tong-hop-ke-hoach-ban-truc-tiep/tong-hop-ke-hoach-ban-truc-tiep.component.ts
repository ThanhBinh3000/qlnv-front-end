import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { saveAs } from 'file-saver';
import { TongHopKhBanTrucTiepService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/tong-hop-kh-ban-truc-tiep.service';

@Component({
  selector: 'app-tong-hop-ke-hoach-ban-truc-tiep',
  templateUrl: './tong-hop-ke-hoach-ban-truc-tiep.component.html',
  styleUrls: ['./tong-hop-ke-hoach-ban-truc-tiep.component.scss']
})
export class TongHopKeHoachBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input()
  listVthh: any[] = [];

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' },
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopKhBanTrucTiepService: TongHopKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopKhBanTrucTiepService);
    this.formData = this.fb.group({
      namKh: '',
      ngayThop: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDungThop: ''
    })
  }

  filterTable: any = {
    id: '',
    ngayTao: '',
    noiDungThop: '',
    namKh: '',
    soQdPd: '',
    tenLoaiVthh: '',
    tenTrangThai: '',
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
      })
      this.timKiem();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    if (this.formData.value.ngayThop) {
      this.formData.value.ngayThopTu = dayjs(this.formData.value.ngayThop[0]).format('YYYY-MM-DD')
      this.formData.value.ngayThopDen = dayjs(this.formData.value.ngayThop[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
    this.timKiem();
  }


  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.tongHopKhBanTrucTiepService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, 'Thong-tin-tong-hop-ke-hoach-ban-truc-tiep.xlsx'),
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

