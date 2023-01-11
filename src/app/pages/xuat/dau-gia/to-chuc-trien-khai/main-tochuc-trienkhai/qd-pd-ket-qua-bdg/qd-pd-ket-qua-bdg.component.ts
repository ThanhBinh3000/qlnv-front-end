import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "../../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QdPdKetQuaBanDauGiaService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service";
import dayjs from "dayjs";
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'app-qd-pd-ket-qua-bdg',
  templateUrl: './qd-pd-ket-qua-bdg.component.html',
  styleUrls: ['./qd-pd-ket-qua-bdg.component.scss']
})
export class QdPdKetQuaBdgComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    super.ngOnInit();
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      loaiVthh: [''],
      trichYeu: [''],
      soQdKq: [''],
      ngayKy: [],
    });
    this.filterTable = {
      soQdPdKqBdg: '',
      ngayKy: '',
      trichYeu: '',
      ngayTcBdg: '',
      soQdPdKhBdg: '',
      maTbBdg: '',
      hinhThucDauGia: '',
      phuongThucDauGia: '',
      tenLoaiVthh: '',
      namKh: '',
      soTbDgKt: '',
      soBbDg: '',
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

}
