import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'app-tong-hop-khmtt',
  templateUrl: './tong-hop-khmtt.component.html',
  styleUrls: ['./tong-hop-khmtt.component.scss']
})

export class TongHopKhmttComponent extends Base2Component implements OnInit {
  @Input() listVthh: any[] = [];
  @Input() loaiVthh: string;
  listCloaiVthh: any[] = [];

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
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
    private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHMTTService);

    this.formData = this.fb.group({
      namKh: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDungThop: '',
      ngayThop: '',
      ngayQd: ''
    });

    this.filterTable = {
      id: '',
      ngayTao: '',
      noiDung: '',
      namKh: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
      soQdPduyet: '',
    }
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.timKiem();
      this.getCloaiVthh();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async getCloaiVthh() {
    let body = {
      "str": this.loaiVthh
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    console.log(res, 999)
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  async timKiem() {
    if (this.formData.value.ngayThop) {
      this.formData.value.ngayThopTu = dayjs(this.formData.value.ngayThop[0]).format('YYYY-MM-DD')
      this.formData.value.ngayThopDen = dayjs(this.formData.value.ngayThop[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayQd) {
      this.formData.value.ngayQdTu = dayjs(this.formData.value.ngayQd[0]).format('YYYY-MM-DD')
      this.formData.value.ngayQdDen = dayjs(this.formData.value.ngayQd[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

}
