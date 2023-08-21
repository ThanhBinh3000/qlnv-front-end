import { Component, Input, OnInit } from '@angular/core';
import { MESSAGE } from "../../../../../constants/message";
import * as dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../../services/user.service";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { QuyetDinhGiaoNvXuatHangService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import { STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';

@Component({
  selector: 'app-table-giao-xh',
  templateUrl: './table-giao-xh.component.html',
  styleUrls: ['./table-giao-xh.component.scss'],
})
export class TableGiaoXh extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input()
  listVthh: any[] = [];
  isView = false;

  idHd: number = 0;
  isViewHd: boolean = false;
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành' },
  ];

  listTrangThaiXh: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.formData = this.fb.group({
      nam: null,
      maDvi: null,
      soQd: null,
      loaiVthh: null,
      trichYeu: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      trangThai: null,
      maChiCuc: null
    })

    this.filterTable = {
      nam: '',
      soQd: '',
      ngayTao: '',
      soHd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGnhan: '',
      trichYeu: '',
      bbTinhKho: '',
      bbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      trangThai: this.userService.isChiCuc() ? STATUS.BAN_HANH : null,
      maChiCuc: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
    })
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.loadDsVthh();
    }
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  openModalHd(id: number) {
    this.idHd = id;
    this.isViewHd = true;
  }

  closeModalHd() {
    this.idHd = null;
    this.isViewHd = false;
  }

  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayTaoDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
  };

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }
}
