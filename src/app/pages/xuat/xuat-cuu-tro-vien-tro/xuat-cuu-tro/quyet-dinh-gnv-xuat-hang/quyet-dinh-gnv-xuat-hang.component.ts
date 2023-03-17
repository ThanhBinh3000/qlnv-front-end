import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  QuyetDinhGiaoNhapHangService
} from "src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { DanhMucTieuChuanService } from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import { MESSAGE } from "src/app/constants/message";
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

  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  listTrangThaiXh: any[] = [
    { ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật' },
    { ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật' },
    { ma: this.STATUS.HOAN_THANH_CAP_NHAT, giaTri: 'Hoàn thành cập nhật' }
  ];
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
    private danhMucService: DanhMucService,
    private danhMucTieuChuanService: DanhMucTieuChuanService) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      soQd: [''],
      maDvi: [''],
      ngayKy: [''],
      loaiVthh: [''],
      trichYeu: [''],
    });
    this.filterTable = {
      nam: '',
      soQd: '',
      ngayKy: '',
      soQdPd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      thoiGianGiaoNhan: '',
      soBbHaoDoi: '',
      soBbTinhKho: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      // this.formData.patchValue({
      //   loaiVthh: this.loaiVthh
      // })
      await Promise.all([
        this.timKiem(),
        this.loadDsVthh(),
      ])
      this.spinner.hide();
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

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }
  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayKy) {
        this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }
}