import { Component, Input, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from "../../../../../../constants/message";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';

@Component({
  selector: 'app-thong-tin-dau-gia',
  templateUrl: './thong-tin-dau-gia.component.html',
  styleUrls: ['./thong-tin-dau-gia.component.scss']
})
export class ThongTinDauGiaComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  searchFilter = {
    soDxuat: null,
    tenDvi: null,
    maDvi: null,
    nam: dayjs().get('year'),
    ngayDxuat: null,
    thoiGianThucHien: null,
    loaiVthh: null,
    trichYeu: null,
    soQdPdKhBdg: null,
    soQdPdKqBdg: null

  };
  filterTable: any = {
    soDxuat: '',
    tenDonVi: '',
    ngayDxuat: '',
    ngayKy: '',
    trichYeu: '',
    tenHangHoa: '',
    soQuyetDinhGiaoChiTieu: '',
    soQuyetDinhPheDuyet: '',
    tenVthh: '',
    tenCloaiVthh: '',
    tenTrangThai: '',
    tenTrangThaiTh: '',
    nam: '',
    tenLoaiHinhNhapXuat: '',
    tongSoLuong: ''
  };

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
  }

  async ngOnInit() {
    try {
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }



}
