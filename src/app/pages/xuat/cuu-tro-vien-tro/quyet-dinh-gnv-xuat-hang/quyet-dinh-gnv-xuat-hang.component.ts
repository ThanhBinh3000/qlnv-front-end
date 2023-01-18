import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhGiaoNhapHangService
} from "../../../../services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DanhMucTieuChuanService} from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  QuyetDinhGiaoNvCuuTroService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import {MESSAGE} from "../../../../constants/message";
import dayjs from "dayjs";

@Component({
  selector: 'app-quyet-dinh-gnv-xuat-hang',
  templateUrl: './quyet-dinh-gnv-xuat-hang.component.html',
  styleUrls: ['./quyet-dinh-gnv-xuat-hang.component.scss']
})
export class QuyetDinhGnvXuatHangComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
              private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
              private danhMucService: DanhMucService,
              private danhMucTieuChuanService: DanhMucTieuChuanService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      soQd: [''],
      maDvi: [''],
      ngayKy: [''],
      idQdPd: [''],
      soQdPd: [''],
      soBbHaoDoi: [''],
      soBbTinhKho: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      tenVthh: [''],
      tongSoLuong: [''],
      thoiGianGiaoNhan: [''],
      trichYeu: [''],
      trangThai: [''],
      trangThaiXh: [''],
      lyDoTuChoi: [''],
    });
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

}