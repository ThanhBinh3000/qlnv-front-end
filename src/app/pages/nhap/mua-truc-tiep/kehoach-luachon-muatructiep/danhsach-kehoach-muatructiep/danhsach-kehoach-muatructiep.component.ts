import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';

@Component({
  selector: 'app-danhsach-kehoach-muatructiep',
  templateUrl: './danhsach-kehoach-muatructiep.component.html',
  styleUrls: ['./danhsach-kehoach-muatructiep.component.scss']
})
export class DanhsachKehoachMuatructiepComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhSachMuaTrucTiepService);
    this.formData = this.fb.group({
      namKh: [dayjs().get('year')],
      maDvi: [],
      tenDvi: [],
      soDxuat: [],
      ngayTao: [],
      ngayPduyet: [],
      trichYeu: [],
      noiDungTh: [],
      trangThaiTh: [],
    });

    this.filterTable = {
      soDxuat: '',
      namKh: '',
      ngayTao: '',
      ngayPduyet: '',
      trichYeu: '',
      soQd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tongSoLuong: '',
      soQdPduyet: '',
      tenTrangThai: '',
      tenTrangThaiTh: '',
    };
  }

  listChiCuc: any[] = [];

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await this.search();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


}
