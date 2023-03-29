import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isQuyetDinh: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      ngayThop: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDungThop: '',
      typeLoaiVthh: ''
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
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        this.formData.patchValue({
          typeLoaiVthh: LOAI_HANG_DTQG.VAT_TU
        })
      } else {
        this.formData.patchValue({
          loaiVthh: this.loaiVthh,
        })
      }
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  taoQdinh(id: number) {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
    this.idSelected = id;
  }

  showTongHop() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
    this.search;
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.tongHopDeXuatKeHoachBanDauGiaService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, 'Danh-sach-tong-hop-ke-hoach-ban-dau-gia.xlsx'),
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
