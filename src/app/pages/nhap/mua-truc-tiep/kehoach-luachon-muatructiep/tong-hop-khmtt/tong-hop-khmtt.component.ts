import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { TongHopDeXuatKHMTTService } from 'src/app/services/tong-hop-de-xuat-khmtt.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tong-hop-khmtt',
  templateUrl: './tong-hop-khmtt.component.html',
  styleUrls: ['./tong-hop-khmtt.component.scss']
})

export class TongHopKhmttComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKHMTTService: TongHopDeXuatKHMTTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHMTTService);

    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      ngayThop: '',
      ngayQd: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDung: ''
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
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    // this.formData.cloaiVthh = data.ma
    // this.formData.tenCloaiVthh = data.ten
    // this.formData.loaiVthh = data.parent.ma
    // this.searchFilter.tenLoaiVthh = data.parent.ten
  }

}
