import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../constants/message";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {HttpClient} from '@angular/common/http';
import {
  QuyetDinhGiaoNvXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-table-giao-xh',
  templateUrl: './table-giao-xh.component.html',
  styleUrls: ['./table-giao-xh.component.scss'],
})

export class TableGiaoXh extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  listLoaiHangHoa: any[] = [];
  isView = false;
  idHopDong: number = 0;
  isViewHopDong: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;
  idHaoDoi: number = 0;
  isViewHaoDoi: boolean = false
  listTrangThai: any = [];
  listTrangThaiXh: any = [];

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
      nam: [null],
      soQdNv: [null],
      loaiVthh: [null],
      trichYeu: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
    });

    this.filterTable = {
      nam: '',
      soQdNv: '',
      ngayKy: '',
      soHopDong: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGiaoHang: '',
      trichYeu: '',
      BienBanTinhKho: '',
      BienBanHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };
    this.listTrangThai = [
      {
        value: this.STATUS.DU_THAO,
        text: 'Dự thảo'
      },
      {
        value: this.STATUS.CHO_DUYET_TP,
        text: 'Chờ duyệt - TP'
      },
      {
        value: this.STATUS.TU_CHOI_TP,
        text: 'Từ chối - TP'
      },
      {
        value: this.STATUS.CHO_DUYET_LDC,
        text: 'Chờ duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.TU_CHOI_LDC,
        text: 'Từ chối - LĐ Cục'
      },
      {
        value: this.STATUS.BAN_HANH,
        text: 'Ban hành'
      },
    ]
    this.listTrangThaiXh = [
      {
        value: this.STATUS.CHUA_THUC_HIEN,
        text: 'Chưa thực hiện'
      },
      {
        value: this.STATUS.DANG_THUC_HIEN,
        text: 'Đang thực hiện'
      },
      {
        value: this.STATUS.DA_HOAN_THANH,
        text: 'Đã hoàn thành'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      await this.loadDsVthh();
    }
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([this.timKiem(), this.search()]);
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter(x => x.ma.length === 4) || [];
    }
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'hopDong' :
        this.idHopDong = id;
        this.isViewHopDong = true;
        break;
      case 'tinhKho' :
        this.idTinhKho = id;
        this.isViewTinhKho = true;
        break;
      case 'haoDoi' :
        this.idHaoDoi = id;
        this.isViewHaoDoi = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'hopDong' :
        this.idHopDong = null;
        this.isViewHopDong = false;
        break;
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
        break;
      case 'haoDoi' :
        this.idHaoDoi = null;
        this.isViewHaoDoi = false;
        break;
      default:
        break;
    }
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayTaoTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKyDen, 'ngayKy');
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKyTu, 'ngayKy');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
        XEM: 'XHDTQG_PTDG_QDGNVXH_XEM',
        THEM: 'XHDTQG_PTDG_QDGNVXH_THEM',
        XOA: 'XHDTQG_PTDG_QDGNVXH_XOA',
        DUYET_TP: 'XHDTQG_PTDG_QDGNVXH_DUYET_TP',
        DUYET_LDCUC: 'XHDTQG_PTDG_QDGNVXH_DUYET_LDCUC',
    };
    switch (action) {
      case 'XEM':
        return this.userService.isAccessPermisson(permissionMapping.XEM) &&
          (data.trangThai !== STATUS.DU_THAO &&
            data.trangThai !== STATUS.TU_CHOI_TP &&
            data.trangThai !== STATUS.TU_CHOI_LDC);
      case 'SUA':
        return (
          (data.trangThai === STATUS.DU_THAO ||
            data.trangThai === STATUS.TU_CHOI_TP ||
            data.trangThai === STATUS.TU_CHOI_LDC) &&
          this.userService.isAccessPermisson(permissionMapping.THEM)
        );
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissionMapping.DUYET_TP) &&
            data.trangThai === STATUS.CHO_DUYET_TP) ||
          (this.userService.isAccessPermisson(permissionMapping.DUYET_LDCUC) &&
            data.trangThai === STATUS.CHO_DUYET_LDC)
        );
      case 'XOA':
        return (
          data.trangThai === STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissionMapping.XOA)
        );
      default:
        return false;
    }
  }
}
